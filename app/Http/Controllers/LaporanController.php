<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\Template; // ✅ Tambah Model Template
use Spatie\Browsershot\Browsershot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Shared\Converter;
use PhpOffice\PhpWord\Style\Language;
use App\Traits\ParsesWordDocument; // ✅ Tambah Trait Parser

class LaporanController extends Controller
{
    use ParsesWordDocument; // ✅ Gunakan Trait di sini

    public function index()
    {
        $laporans = Laporan::where('user_id', Auth::id())
            ->with('sections')
            ->latest()
            ->get();

        return Inertia::render('Laporan/Index', ['laporans' => $laporans]);
    }

    public function create(Request $request)
    {
        $reportType = $request->query('type', 'Makalah');
        $reportTypes = ['Makalah', 'Proposal', 'Laporan Praktikum', 'Studi Kasus', 'Skripsi'];

        // ✅ LOGIC BARU: Tangkap Template ID dari URL
        $selectedTemplate = null;
        if ($request->has('template_id')) {
            $selectedTemplate = Template::find($request->template_id);
        }

        return Inertia::render('Laporan/Create', [
            'report_type' => $reportType,
            'report_types' => $reportTypes,
            'selectedTemplate' => $selectedTemplate, // ✅ Kirim ke frontend
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_type' => 'required|string|max:255|in:Makalah,Proposal,Laporan Praktikum,Studi Kasus,Skripsi',
            'judul' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'nim' => 'required|string|max:20',
            'prodi' => 'required|string|max:255',
            'mata_kuliah' => 'required|string|max:255',
            'dosen_pembimbing' => 'required|string|max:255',
            'instansi' => 'required|string|max:255',
            'kota' => 'required|string|max:100',
            'tahun_ajaran' => 'required|string|max:10',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'logo_position' => 'required|in:kiri,tengah,kanan',
            'template_id' => 'nullable|exists:templates,id', // ✅ Validasi Template ID
        ]);

        $logoPath = null;
        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Siapkan data untuk create
        $reportData = array_merge(
            $validated,
            [
                'user_id' => Auth::id(),
                'logo_path' => $logoPath,
            ]
        );
        
        // Hapus template_id dari array karena tidak disimpan di tabel laporans
        unset($reportData['logo'], $reportData['template_id']);

        // 1. Buat Record Laporan
        $laporan = Laporan::create($reportData);

        // 2. ✅ LOGIC BARU: Generate Section (Template vs Default)
        if ($request->filled('template_id')) {
            // Jika user pilih template, gunakan Trait Parser
            $template = Template::find($request->template_id);
            
            if ($template && Storage::disk('public')->exists($template->filepath)) {
                try {
                    $filePath = Storage::disk('public')->path($template->filepath);
                    // Panggil fungsi sakti dari Trait
                    $this->parseAndSaveSections($filePath, $laporan);
                } catch (\Exception $e) {
                    // Jika gagal parsing, kembalikan dengan error tapi laporan sudah terbuat
                    return redirect()->route('laporan.edit', $laporan->id)
                        ->with('error', 'Laporan dibuat tapi gagal membaca template: ' . $e->getMessage());
                }
            } else {
                // Fallback jika file template hilang fisik
                $this->createDefaultSections($laporan, $laporan->report_type);
            }
        } else {
            // Jika tidak pakai template, pakai default hardcoded
            $this->createDefaultSections($laporan, $laporan->report_type);
        }

        return redirect()->route('laporan.edit', $laporan->id)
            ->with('success', 'Data laporan berhasil dibuat! Struktur bab telah disesuaikan.');
    }

    public function edit(Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        $laporan->load(['sections' => function ($query) {
            $query->orderBy('order');
        }, 'sections.children' => function ($query) {
            $query->orderBy('order');
        }]);

        return Inertia::render('Laporan/Edit', [
            'laporan' => $laporan,
        ]);
    }

    public function destroy(Laporan $laporan)
    {
        $this->authorize('delete', $laporan);

        if ($laporan->logo_path && Storage::disk('public')->exists($laporan->logo_path)) {
            Storage::disk('public')->delete($laporan->logo_path);
        }

        $laporan->delete();

        return redirect()->route('dashboard')->with('success', 'Laporan berhasil dihapus.');
    }

    public function previewLive(Request $request)
    {
        $request->validate(['logo' => 'nullable|image|max:2048']);

        $previewData = $request->except(['logo', '_token']);
        $previewData['base64Logo'] = null;

        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            try {
                $path = $request->file('logo')->getRealPath();
                $type = $request->file('logo')->getClientMimeType();
                $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

                if (in_array($type, $allowedTypes)) {
                    $data = file_get_contents($path);
                    $previewData['base64Logo'] = 'data:' . $type . ';base64,' . base64_encode($data);
                }
            } catch (\Exception $e) {
                report($e);
            }
        }

        return view('reports.preview', $previewData);
    }

    public function downloadPdf(Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        try {
            $laporan->load(['sections' => function ($query) {
                $query->orderBy('order');
            }, 'sections.children' => function ($query) {
                $query->orderBy('order');
            }]);

            foreach ($laporan->sections as $section) {
                if (!empty($section->content)) {
                    $section->content = $this->convertImagesToBase64($section->content);
                }
                foreach ($section->children as $child) {
                    if (!empty($child->content)) {
                        $child->content = $this->convertImagesToBase64($child->content);
                    }
                }
            }

            $cssPath = public_path('build/assets');
            $cssContent = '';
            if (File::exists($cssPath)) {
                $files = File::files($cssPath);
                foreach ($files as $file) {
                    if ($file->getExtension() === 'css') {
                        $cssContent .= File::get($file->getPathname());
                    }
                }
            }

            $html = View::make('reports.preview', [
                'laporan' => $laporan,
                'css_inline' => $cssContent,
                'is_pdf_mode' => true 
            ])->render();

            $footerHtml = '
                <div style="font-size: 10px; text-align: right; width: 100%; padding-right: 2cm; font-family: Times New Roman;">
                    Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span>
                </div>';

            $filename = 'laporan-' . \Illuminate\Support\Str::slug($laporan->judul) . '.pdf';

            return response()->streamDownload(function () use ($html, $footerHtml) {
                echo Browsershot::html($html)
                    ->format('A4')
                    ->margins(25, 25, 30, 25, 'mm')
                    ->showBackground()
                    ->hideBrowserHeaderAndFooter()
                    ->options([
                        'displayHeaderFooter' => true,
                        'footerTemplate' => $footerHtml,
                        'headerTemplate' => '<div></div>'
                    ])
                    ->waitUntilNetworkIdle()
                    ->pdf();
            }, $filename, [
                'Content-Type' => 'application/pdf',
            ]);
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->with('error', 'Gagal generate PDF: ' . $e->getMessage());
        }
    }

    private function convertImagesToBase64($html)
    {
        return preg_replace_callback('/<img[^>]+src="([^">]+)"/', function ($matches) {
            $src = $matches[1];
            if (strpos($src, 'storage/') !== false) {
                $relativePath = substr($src, strpos($src, 'storage/') + 8);
                $fullPath = storage_path('app/public/' . $relativePath);

                if (file_exists($fullPath)) {
                    $type = pathinfo($fullPath, PATHINFO_EXTENSION);
                    $data = file_get_contents($fullPath);
                    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                    return str_replace($src, $base64, $matches[0]);
                }
            }
            return $matches[0];
        }, $html);
    }

    public function downloadDocx(Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        if (ob_get_level() > 0) {
            ob_end_clean();
        }
        ob_start();

        try {
            $phpWord = new PhpWord;
            $phpWord->getSettings()->setThemeFontLang(new Language(Language::EN_US));

            $centerStyle = ['align' => 'center'];
            $boldUpper = ['bold' => true, 'allCaps' => true];

            $phpWord->addTitleStyle(1, ['size' => 14, 'bold' => true], ['spaceBefore' => Converter::cmToTwip(0.8), 'spaceAfter' => Converter::cmToTwip(0.5), 'keepNext' => true]);
            $phpWord->addTitleStyle(0, ['size' => 16, 'bold' => true], ['spaceAfter' => Converter::cmToTwip(0.8), 'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);

            // SECTION 1: COVER
            $coverSection = $phpWord->addSection([
                'marginTop' => Converter::cmToTwip(3),
                'marginBottom' => Converter::cmToTwip(3),
                'marginLeft' => Converter::cmToTwip(4),
                'marginRight' => Converter::cmToTwip(3),
            ]);

            $paraStyleCenter = ['align' => 'center', 'spaceAfter' => Converter::cmToTwip(0.5)];
            $paraStyleCenterLarge = ['align' => 'center', 'spaceAfter' => Converter::cmToTwip(1)];

            $coverSection->addText(htmlspecialchars(strtoupper($laporan->judul)), ['size' => 16, 'bold' => true], $paraStyleCenterLarge);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->report_type)), ['size' => 14, 'bold' => true], $paraStyleCenterLarge);

            if ($laporan->logo_path && Storage::disk('public')->exists($laporan->logo_path)) {
                $logoFullPath = Storage::disk('public')->path($laporan->logo_path);
                $coverSection->addImage($logoFullPath, ['width' => Converter::cmToPixel(2.5), 'height' => Converter::cmToPixel(2.5), 'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);
            }

            $coverSection->addText('Disusun Oleh:', ['size' => 12], $paraStyleCenter);
            $coverSection->addText(htmlspecialchars($laporan->nama) . ' (' . htmlspecialchars($laporan->nim) . ')', ['size' => 12, 'bold' => true], $paraStyleCenterLarge);
            $coverSection->addText('Dosen Pengampu:', ['size' => 12], $paraStyleCenter);
            $coverSection->addText(htmlspecialchars($laporan->dosen_pembimbing), ['size' => 12, 'bold' => true], $paraStyleCenterLarge);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->prodi)), $boldUpper, $paraStyleCenter);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->instansi)), $boldUpper, $paraStyleCenter);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->kota)), $boldUpper, $paraStyleCenter);
            $coverSection->addText(htmlspecialchars($laporan->tahun_ajaran), $boldUpper, ['align' => 'center', 'spaceAfter' => 0]);
            $coverSection->addPageBreak();

            // SECTION 2: DAFTAR ISI
            $tocSection = $phpWord->addSection([
                'marginTop' => Converter::cmToTwip(3),
                'marginBottom' => Converter::cmToTwip(3),
                'marginLeft' => Converter::cmToTwip(4),
                'marginRight' => Converter::cmToTwip(3),
            ]);
            $tocSection->addTitle('DAFTAR ISI', 0);
            $tocSection->addTextBreak(1);
            $fontStyle = ['size' => 12];
            $tocStyle = ['tabLeader' => 'dot']; 
            $tocSection->addTOC($fontStyle, $tocStyle);
            $tocSection->addPageBreak();

            // SECTION 3: KONTEN
            $laporan->load('sections');

            if ($laporan->sections->isNotEmpty()) {
                $contentSection = $phpWord->addSection([
                    'marginTop' => Converter::cmToTwip(3),
                    'marginBottom' => Converter::cmToTwip(3),
                    'marginLeft' => Converter::cmToTwip(4),
                    'marginRight' => Converter::cmToTwip(3),
                ]);

                $fontStyle = ['size' => 12];
                $paraStyle = ['spaceAfter' => 120]; 

                foreach ($laporan->sections as $section) {
                    $contentSection->addTitle(htmlspecialchars(strtoupper($section->title)), 1);

                    if (! empty($section->content)) {
                        $html = $section->content;
                        $html = preg_replace('/(<\/p>|<br\s*?\/?>|<li>)/i', "\n", $html);
                        $plainText = strip_tags($html);
                        $plainText = html_entity_decode($plainText, ENT_QUOTES, 'UTF-8');
                        $plainText = preg_replace('/[ \t]+/', ' ', $plainText);
                        $plainText = preg_replace('/(\n\s*){2,}/', "\n\n", $plainText); 
                        $plainText = trim($plainText);

                        $lines = explode("\n", $plainText);

                        if (! empty($lines)) {
                            foreach ($lines as $line) {
                                $safeLine = htmlspecialchars($line, ENT_COMPAT, 'UTF-8', false);
                                if (trim($safeLine) !== '') {
                                    $contentSection->addText($safeLine, $fontStyle, $paraStyle);
                                } else {
                                    $contentSection->addTextBreak(1);
                                }
                            }
                        } else {
                            $contentSection->addTextBreak(1);
                        }
                    } else {
                        $contentSection->addTextBreak(1); 
                    }
                }
            }

            $filename = 'laporan-' . \Illuminate\Support\Str::slug($laporan->judul) . '.docx';

            ob_end_clean();

            header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            header('Content-Disposition: attachment;filename="' . $filename . '"');
            header('Cache-Control: max-age=0');

            $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save('php://output');
            exit;
        } catch (\Exception $e) {
            ob_end_clean();
            report($e);
            return redirect()->back()->with('error', 'Gagal membuat file DOCX: ' . $e->getMessage());
        }
    }

    public function preview(Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        $laporan->load(['sections' => function ($query) {
            $query->orderBy('order');
        }, 'sections.children' => function ($query) {
            $query->orderBy('order');
        }]);

        foreach ($laporan->sections as $section) {
            if (!empty($section->content)) {
                $section->content = $this->processImagesForPdf($section->content);
            }
            foreach ($section->children as $child) {
                if (!empty($child->content)) {
                    $child->content = $this->processImagesForPdf($child->content);
                }
            }
        }

        return view('reports.preview', ['laporan' => $laporan]);
    }

    private function processImagesForPdf(string $html): string
    {
        $pattern = '/<img([^>]*?)>/i';
        $figureCounter = 0;
        $baseUrl = config('app.url');

        $processed = preg_replace_callback($pattern, function ($matches) use (&$figureCounter, $baseUrl) {
            $figureCounter++;
            $imgAttrs = $matches[1];

            preg_match('/src=["\']([^"\']*)["\']/', $imgAttrs, $srcMatch);
            $src = $srcMatch[1] ?? '';

            if (!empty($src)) {
                if (strpos($src, 'http') !== 0 && strpos($src, 'data:') !== 0) {
                    if (strpos($src, '/storage/') === 0 || strpos($src, '/uploads/') === 0) {
                        $src = $baseUrl . $src;
                    } else {
                        $storagePath = str_replace('/storage/', '', $src);
                        if (Storage::disk('public')->exists($storagePath)) {
                            $src = $baseUrl . '/storage/' . $storagePath;
                        }
                    }
                }
            }

            preg_match('/alt=["\']([^"\']*)["\']/', $imgAttrs, $altMatch);
            $altText = $altMatch[1] ?? '';

            $imgAttrs = preg_replace('/src=["\'][^"\']*["\']/', '', $imgAttrs);
            $imgAttrs = 'src="' . htmlspecialchars($src, ENT_QUOTES, 'UTF-8') . '" ' . $imgAttrs;

            return sprintf(
                '<figure style="margin: 1em 0; text-align: center;"><img%s style="max-width: 100%%; height: auto; object-fit: contain; display: block; margin: 0 auto;"><figcaption style="font-size: 10pt; font-style: italic; margin-top: 5px; text-align: center;">Gambar %d: %s</figcaption></figure>',
                $imgAttrs,
                $figureCounter,
                htmlspecialchars($altText, ENT_QUOTES, 'UTF-8')
            );
        }, $html);

        return $processed ?? $html;
    }

    private function createDefaultSections(Laporan $laporan, string $reportType): void
    {
        $sections = [];

        switch ($reportType) {
            case 'Proposal':
            case 'Skripsi':
                $sections = [
                    ['title' => 'BAB I PENDAHULUAN', 'order' => 1],
                    ['title' => 'BAB II TINJAUAN PUSTAKA', 'order' => 2],
                    ['title' => 'BAB III METODOLOGI PENELITIAN', 'order' => 3],
                    ['title' => 'DAFTAR PUSTAKA', 'order' => 4],
                ];
                break;

            case 'Laporan Praktikum':
                $sections = [
                    ['title' => 'I. TUJUAN PRAKTIKUM', 'order' => 1],
                    ['title' => 'II. DASAR TEORI', 'order' => 2],
                    ['title' => 'III. ALAT DAN BAHAN', 'order' => 3],
                    ['title' => 'IV. LANGKAH KERJA', 'order' => 4],
                    ['title' => 'V. HASIL DAN PEMBAHASAN', 'order' => 5],
                    ['title' => 'VI. KESIMPULAN', 'order' => 6],
                    ['title' => 'DAFTAR PUSTAKA', 'order' => 7],
                    ['title' => 'LAMPIRAN', 'order' => 8],
                ];
                break;

            case 'Studi Kasus':
                $sections = [
                    ['title' => 'BAB I PENDAHULUAN', 'order' => 1],
                    ['title' => 'BAB II PROFIL OBJEK STUDI', 'order' => 2],
                    ['title' => 'BAB III PEMBAHASAN KASUS', 'order' => 3],
                    ['title' => 'BAB IV SOLUSI DAN REKOMENDASI', 'order' => 4],
                    ['title' => 'BAB V KESIMPULAN', 'order' => 5],
                    ['title' => 'DAFTAR PUSTAKA', 'order' => 6],
                ];
                break;

            case 'Makalah':
            default:
                $sections = [
                    ['title' => 'BAB I PENDAHULUAN', 'order' => 1],
                    ['title' => 'BAB II PEMBAHASAN', 'order' => 2],
                    ['title' => 'BAB III PENUTUP (KESIMPULAN DAN SARAN)', 'order' => 3],
                    ['title' => 'DAFTAR PUSTAKA', 'order' => 4],
                ];
                break;
        }

        foreach ($sections as $sectionData) {
            $laporan->sections()->create($sectionData);
        }
    }
}