<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Shared\Converter;
use PhpOffice\PhpWord\Shared\Html; // PENTING: Buat render HTML balik ke Word
use PhpOffice\PhpWord\Style\Language;
use Spatie\Browsershot\Browsershot;
use App\Traits\ParsesWordDocument;
use Illuminate\Support\Facades\Http;

class LaporanController extends Controller
{
    use ParsesWordDocument;

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

        $selectedTemplate = null;
        if ($request->has('template_id')) {
            $selectedTemplate = Template::find($request->template_id);
        }

        return Inertia::render('Laporan/Create', [
            'report_type' => $reportType,
            'report_types' => $reportTypes,
            'selectedTemplate' => $selectedTemplate,
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
            'template_id' => 'nullable|exists:templates,id',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Siapkan data laporan
        $reportData = array_merge(
            $validated,
            [
                'user_id' => Auth::id(),
                'logo_path' => $logoPath,
            ]
        );

        // Bersihkan field yang tidak masuk tabel laporans
        unset($reportData['logo'], $reportData['template_id']);

        // 1. Create Record Laporan
        $laporan = Laporan::create($reportData);

        // 2. Generate Sections (Template vs Default)
        if ($request->filled('template_id')) {
            $template = Template::find($request->template_id);

            // Cek fisik file template
            if ($template && Storage::disk('public')->exists($template->filepath)) {
                try {
                    $filePath = Storage::disk('public')->path($template->filepath);
                    // Gunakan Trait ParsesWordDocument yang baru
                    $this->parseAndSaveSections($filePath, $laporan);
                } catch (\Exception $e) {
                    // Fallback jika parsing gagal
                    return redirect()->route('laporan.edit', $laporan->id)
                        ->with('error', 'Laporan dibuat, tapi gagal baca template: ' . $e->getMessage());
                }
            } else {
                $this->createDefaultSections($laporan, $laporan->report_type);
            }
        } else {
            $this->createDefaultSections($laporan, $laporan->report_type);
        }

        return redirect()->route('laporan.edit', $laporan->id)
            ->with('success', 'Laporan berhasil dibuat!');
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

    // ... method edit dan destroy yang udah ada ...

    public function update(Request $request, Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        // Validasi data cover
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'nim' => 'nullable|string|max:50',
            'prodi' => 'nullable|string|max:255',
            'mata_kuliah' => 'nullable|string|max:255',
            'dosen_pembimbing' => 'nullable|string|max:255',
            'instansi' => 'nullable|string|max:255',
            'kota' => 'nullable|string|max:100',
            'tahun_ajaran' => 'nullable|string|max:20',
            'logo' => 'nullable|image|max:2048', // Opsional update logo
        ]);

        // Handle Upload Logo Baru (kalo ada)
        if ($request->hasFile('logo')) {
            // Hapus logo lama kalo ada
            if ($laporan->logo_path && Storage::disk('public')->exists($laporan->logo_path)) {
                Storage::disk('public')->delete($laporan->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('logos', 'public');
        }

        $laporan->update($validated);

        return redirect()->back()->with('success', 'Data Cover berhasil diperbarui!');
    }

    // ... sisa method lain ...

    public function previewLive(Request $request)
    {
        $request->validate(['logo' => 'nullable|image|max:2048']);

        $previewData = $request->except(['logo', '_token']);
        $previewData['base64Logo'] = null;

        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            try {
                $path = $request->file('logo')->getRealPath();
                $type = $request->file('logo')->getClientMimeType();
                if (in_array($type, ['image/jpeg', 'image/png', 'image/gif'])) {
                    $data = file_get_contents($path);
                    $previewData['base64Logo'] = 'data:' . $type . ';base64,' . base64_encode($data);
                }
            } catch (\Exception $e) {
                // Silent error for preview
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

            // Convert image links to Base64 for PDF Generation
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

            // Load CSS
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

    public function downloadDocx(Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        // Bersihkan output buffer biar file gak corrupt
        if (ob_get_level() > 0) {
            ob_end_clean();
        }
        ob_start();

        try {
            $phpWord = new PhpWord;
            $phpWord->getSettings()->setThemeFontLang(new Language(Language::EN_US));

            // Styles
            $phpWord->addTitleStyle(1, ['size' => 14, 'bold' => true], ['spaceBefore' => Converter::cmToTwip(0.8), 'spaceAfter' => Converter::cmToTwip(0.5)]);
            $phpWord->addTitleStyle(0, ['size' => 16, 'bold' => true], ['spaceAfter' => Converter::cmToTwip(0.8), 'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);

            // --- SECTION 1: COVER ---
            $coverSection = $phpWord->addSection([
                'marginTop' => Converter::cmToTwip(3),
                'marginBottom' => Converter::cmToTwip(3),
                'marginLeft' => Converter::cmToTwip(4),
                'marginRight' => Converter::cmToTwip(3),
            ]);

            $paraStyleCenter = ['align' => 'center', 'spaceAfter' => Converter::cmToTwip(0.5)];
            $paraStyleCenterLarge = ['align' => 'center', 'spaceAfter' => Converter::cmToTwip(1)];
            $boldUpper = ['bold' => true, 'allCaps' => true];

            $coverSection->addText(htmlspecialchars(strtoupper($laporan->judul)), ['size' => 16, 'bold' => true], $paraStyleCenterLarge);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->report_type)), ['size' => 14, 'bold' => true], $paraStyleCenterLarge);

            if ($laporan->logo_path && Storage::disk('public')->exists($laporan->logo_path)) {
                $logoFullPath = Storage::disk('public')->path($laporan->logo_path);
                $coverSection->addImage($logoFullPath, ['width' => Converter::cmToPixel(2.5), 'height' => Converter::cmToPixel(2.5), 'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);
            }

            $coverSection->addTextBreak(2);
            $coverSection->addText('Disusun Oleh:', ['size' => 12], $paraStyleCenter);
            $coverSection->addText(htmlspecialchars($laporan->nama) . ' (' . htmlspecialchars($laporan->nim) . ')', ['size' => 12, 'bold' => true], $paraStyleCenterLarge);
            $coverSection->addText('Dosen Pengampu:', ['size' => 12], $paraStyleCenter);
            $coverSection->addText(htmlspecialchars($laporan->dosen_pembimbing), ['size' => 12, 'bold' => true], $paraStyleCenterLarge);

            $coverSection->addTextBreak(2);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->prodi)), $boldUpper, $paraStyleCenter);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->instansi)), $boldUpper, $paraStyleCenter);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->kota)), $boldUpper, $paraStyleCenter);
            $coverSection->addText(htmlspecialchars($laporan->tahun_ajaran), $boldUpper, ['align' => 'center', 'spaceAfter' => 0]);

            $coverSection->addPageBreak();

            // --- SECTION 2: DAFTAR ISI ---
            $tocSection = $phpWord->addSection();
            $tocSection->addTitle('DAFTAR ISI', 0);
            $tocSection->addTextBreak(1);
            $tocSection->addTOC(['size' => 12], ['tabLeader' => 'dot']);
            $tocSection->addPageBreak();

            // --- SECTION 3: KONTEN LAPORAN ---
            $laporan->load('sections.children');

            if ($laporan->sections->isNotEmpty()) {
                $contentSection = $phpWord->addSection([
                    'marginTop' => Converter::cmToTwip(3),
                    'marginBottom' => Converter::cmToTwip(3),
                    'marginLeft' => Converter::cmToTwip(4),
                    'marginRight' => Converter::cmToTwip(3),
                ]);

                foreach ($laporan->sections as $section) {
                    // Judul Bab (Heading 1)
                    $contentSection->addTitle(htmlspecialchars(strtoupper($section->title)), 1);

                    // Konten Bab
                    if (!empty($section->content)) {
                        // FIX: Gunakan addHtml biar format tabel, bold, italic, gambar tetap ada!
                        Html::addHtml($contentSection, $section->content, false, false);
                    } else {
                        $contentSection->addTextBreak(1);
                    }

                    // Loop Sub-bab (Heading 2) jika ada
                    foreach ($section->children as $child) {
                        $contentSection->addTitle(htmlspecialchars($child->title), 2); // Level 2
                        if (!empty($child->content)) {
                            Html::addHtml($contentSection, $child->content, false, false);
                        }
                    }
                }
            }

            $filename = 'laporan-' . \Illuminate\Support\Str::slug($laporan->judul) . '.docx';

            return response()->streamDownload(function () use ($phpWord) {
                $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
                $objWriter->save('php://output');
            }, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Cache-Control' => 'max-age=0',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal generate DOCX: ' . $e->getMessage());
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

        // Process images for web preview
        foreach ($laporan->sections as $section) {
            if (!empty($section->content)) {
                $section->content = $this->processImagesForPreview($section->content);
            }
            foreach ($section->children as $child) {
                if (!empty($child->content)) {
                    $child->content = $this->processImagesForPreview($child->content);
                }
            }
        }

        return view('reports.preview', ['laporan' => $laporan]);
    }

    public function generateWithAi(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        $prompt = $request->input('prompt');

        // Manggil API Gemini
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        if ($response->successful()) {
            // Ambil hasil teks dari struktur JSON Gemini
            $result = $response->json('candidates.0.content.parts.0.text');
            return response()->json(['result' => $result]);
        }

        return response()->json(['error' => 'Gagal narik data AI, bray!'], 500);
    }
    // --- Helper Methods ---

    private function convertImagesToBase64($html)
    {
        return preg_replace_callback('/<img[^>]+src="([^">]+)"/', function ($matches) {
            $src = $matches[1];
            // Handle local storage images
            if (strpos($src, 'storage/') !== false) {
                $relativePath = substr($src, strpos($src, 'storage/') + 8);
                $fullPath = storage_path('app/public/' . $relativePath);

                if (file_exists($fullPath)) {
                    $type = pathinfo($fullPath, PATHINFO_EXTENSION);
                    $data = file_get_contents($fullPath);
                    return str_replace($src, 'data:image/' . $type . ';base64,' . base64_encode($data), $matches[0]);
                }
            }
            return $matches[0];
        }, $html);
    }

    private function processImagesForPreview(string $html): string
    {
        // Simple processing to ensure images have correct styling for preview
        return preg_replace(
            '/<img([^>]+)>/i',
            '<img$1 style="max-width: 100%; height: auto; display: block; margin: 10px auto;">',
            $html
        );
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
                ];
                break;
            default: // Makalah
                $sections = [
                    ['title' => 'BAB I PENDAHULUAN', 'order' => 1],
                    ['title' => 'BAB II PEMBAHASAN', 'order' => 2],
                    ['title' => 'BAB III PENUTUP', 'order' => 3],
                    ['title' => 'DAFTAR PUSTAKA', 'order' => 4],
                ];
                break;
        }

        foreach ($sections as $sectionData) {
            $laporan->sections()->create($sectionData);
        }
    }
}
