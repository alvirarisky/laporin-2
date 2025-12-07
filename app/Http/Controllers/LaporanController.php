<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use Spatie\Browsershot\Browsershot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
// --- KITA PAKAI DUA-DUANYA ---
use Inertia\Inertia; // Untuk Inertia
use PhpOffice\PhpWord\IOFactory; // Untuk DOCX
use PhpOffice\PhpWord\PhpWord; // Untuk DOCX
use PhpOffice\PhpWord\Shared\Converter; // Untuk DOCX
use PhpOffice\PhpWord\Shared\Html; // Untuk DOCX (meski pakai addText)
// Untuk DOCX
use PhpOffice\PhpWord\Style\Language; // Untuk DOCX

class LaporanController extends Controller
{
    // Method index, create, store, edit, destroy, previewLive, preview
    // (Tidak ada perubahan di method-method ini)

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

        return Inertia::render('Laporan/Create', [
            'report_type' => $reportType,
            'report_types' => $reportTypes,
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
        ]);

        $logoPath = null;
        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        $reportData = array_merge(
            $validated,
            [
                'user_id' => Auth::id(),
                'logo_path' => $logoPath,
            ]
        );
        unset($reportData['logo']);

        $laporan = Laporan::create($reportData);

        // Buat section default berdasarkan report_type
        $this->createDefaultSections($laporan, $laporan->report_type);

        return redirect()->route('laporan.edit', $laporan->id)->with('success', 'Data laporan berhasil dibuat! Silakan mulai mengisi konten.');
    }

    public function edit(Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        // Load sections dengan children (nested structure)
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
                    $previewData['base64Logo'] = 'data:'.$type.';base64,'.base64_encode($data);
                }
            } catch (\Exception $e) {
                report($e);
            }
        }

        return view('reports.preview', $previewData);
    }

    // --- METHOD 1: DOWNLOAD PDF (BROWSERSHOT - PUPPETEER) ---
    public function downloadPdf(Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        try {
            // Load relasi section dengan children
            $laporan->load(['sections' => function ($query) {
                $query->orderBy('order');
            }, 'sections.children' => function ($query) {
                $query->orderBy('order');
            }]);

            // Process images in content to convert to absolute URLs or base64
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

            // Buat nama file
            $filename = 'laporan-'.\Illuminate\Support\Str::slug($laporan->judul).'.pdf';

            // Render view ke HTML string
            $html = View::make('reports.preview', [
                'laporan' => $laporan,
            ])->render();

            // Generate PDF menggunakan Browsershot (Puppeteer) dengan streamDownload
            return response()->streamDownload(function () use ($html) {
                echo Browsershot::html($html)
                    ->format('A4')
                    ->margins(20, 20, 20, 20, 'mm')
                    ->showBackground() // Wajib agar background gambar muncul
                    ->showBrowserHeaderAndFooter() // Untuk nomor halaman otomatis
                    ->waitUntilNetworkIdle() // Wajib agar gambar terload sebelum print
                    ->pdf();
            }, $filename, [
                'Content-Type' => 'application/pdf',
            ]);

        } catch (\Exception $e) {
            // Tangani error jika Browsershot gagal
            report($e);

            return redirect()->back()->with('error', 'Gagal membuat file PDF: '.$e->getMessage());
        }
    }

    // --- METHOD 2: DOWNLOAD DOCX (TEKS POLOSAN, TAPI AMAN DARI CRASH/KORUP) ---
    public function downloadDocx(Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        // Bersihkan output buffer (penting untuk download file)
        if (ob_get_level() > 0) {
            ob_end_clean();
        }
        ob_start();

        try {
            // Inisialisasi PhpWord
            $phpWord = new PhpWord;
            $phpWord->getSettings()->setThemeFontLang(new Language(Language::EN_US));

            // Style global
            $centerStyle = ['align' => 'center'];
            $boldUpper = ['bold' => true, 'allCaps' => true];

            // Style Judul Bab (Heading 1) untuk Daftar Isi
            $phpWord->addTitleStyle(1, ['size' => 14, 'bold' => true], ['spaceBefore' => Converter::cmToTwip(0.8), 'spaceAfter' => Converter::cmToTwip(0.5), 'keepNext' => true]);
            // Style Judul "DAFTAR ISI" (Heading 0)
            $phpWord->addTitleStyle(0, ['size' => 16, 'bold' => true], ['spaceAfter' => Converter::cmToTwip(0.8), 'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);

            // === SECTION 1: COVER === (Sama seperti sebelumnya)
            $coverSection = $phpWord->addSection([
                'marginTop' => Converter::cmToTwip(3), 'marginBottom' => Converter::cmToTwip(3),
                'marginLeft' => Converter::cmToTwip(4), 'marginRight' => Converter::cmToTwip(3),
            ]);

            // Style paragraf dengan spaceAfter untuk spacing yang lebih baik
            $paraStyleCenter = ['align' => 'center', 'spaceAfter' => Converter::cmToTwip(0.5)];
            $paraStyleCenterLarge = ['align' => 'center', 'spaceAfter' => Converter::cmToTwip(1)];
            
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->judul)), ['size' => 16, 'bold' => true], $paraStyleCenterLarge);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->report_type)), ['size' => 14, 'bold' => true], $paraStyleCenterLarge);
            
            if ($laporan->logo_path && Storage::disk('public')->exists($laporan->logo_path)) {
                $logoFullPath = Storage::disk('public')->path($laporan->logo_path);
                $coverSection->addImage($logoFullPath, ['width' => Converter::cmToPixel(2.5), 'height' => Converter::cmToPixel(2.5), 'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);
            }
            
            $coverSection->addText('Disusun Oleh:', ['size' => 12], $paraStyleCenter);
            $coverSection->addText(htmlspecialchars($laporan->nama).' ('.htmlspecialchars($laporan->nim).')', ['size' => 12, 'bold' => true], $paraStyleCenterLarge);
            $coverSection->addText('Dosen Pengampu:', ['size' => 12], $paraStyleCenter);
            $coverSection->addText(htmlspecialchars($laporan->dosen_pembimbing), ['size' => 12, 'bold' => true], $paraStyleCenterLarge);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->prodi)), $boldUpper, $paraStyleCenter);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->instansi)), $boldUpper, $paraStyleCenter);
            $coverSection->addText(htmlspecialchars(strtoupper($laporan->kota)), $boldUpper, $paraStyleCenter);
            $coverSection->addText(htmlspecialchars($laporan->tahun_ajaran), $boldUpper, ['align' => 'center', 'spaceAfter' => 0]);
            $coverSection->addPageBreak();

            // === SECTION 2: DAFTAR ISI === (Sama seperti sebelumnya)
            $tocSection = $phpWord->addSection([
                'marginTop' => Converter::cmToTwip(3), 'marginBottom' => Converter::cmToTwip(3),
                'marginLeft' => Converter::cmToTwip(4), 'marginRight' => Converter::cmToTwip(3),
            ]);
            $tocSection->addTitle('DAFTAR ISI', 0);
            $tocSection->addTextBreak(1);
            $fontStyle = ['size' => 12];
            $tocStyle = ['tabLeader' => 'dot']; // String 'dot' aman
            $tocSection->addTOC($fontStyle, $tocStyle);
            $tocSection->addPageBreak();

            // === SECTION 3: KONTEN LAPORAN (MODE TEKS POLOS) ===
            $laporan->load('sections');

            if ($laporan->sections->isNotEmpty()) {
                $contentSection = $phpWord->addSection([
                    'marginTop' => Converter::cmToTwip(3), 'marginBottom' => Converter::cmToTwip(3),
                    'marginLeft' => Converter::cmToTwip(4), 'marginRight' => Converter::cmToTwip(3),
                ]);

                // Style paragraf standar
                $fontStyle = ['size' => 12];
                $paraStyle = ['spaceAfter' => 120]; // spasi 6pt setelah paragraf

                foreach ($laporan->sections as $section) {
                    $contentSection->addTitle(htmlspecialchars(strtoupper($section->title)), 1);

                    // --- INI KODENYA: KONVERSI KE TEKS POLOS (AMAN) ---
                    if (! empty($section->content)) {

                        $html = $section->content;

                        // Ganti tag block-level (paragraf, br, list) dengan newline
                        $html = preg_replace('/(<\/p>|<br\s*?\/?>|<li>)/i', "\n", $html);
                        // Strip semua tag yang tersisa (bold, italic, dll HILANG)
                        $plainText = strip_tags($html);
                        // Decode sisa HTML entities (kayak &nbsp; &amp;)
                        $plainText = html_entity_decode($plainText, ENT_QUOTES, 'UTF-8');

                        // Bersihkan spasi & newline berlebih
                        $plainText = preg_replace('/[ \t]+/', ' ', $plainText); // Ganti spasi duplikat
                        $plainText = preg_replace('/(\n\s*){2,}/', "\n\n", $plainText); // Ganti newline duplikat jadi 1 baris kosong
                        $plainText = trim($plainText);

                        // Pecah jadi beberapa baris berdasarkan newline
                        $lines = explode("\n", $plainText);

                        if (! empty($lines)) {
                            foreach ($lines as $line) {
                                // Escape karakter khusus XML (&, <, >) untuk PhpWord
                                $safeLine = htmlspecialchars($line, ENT_COMPAT, 'UTF-8', false);

                                if (trim($safeLine) !== '') {
                                    // Tambahkan teks sebagai paragraf ke Word
                                    $contentSection->addText($safeLine, $fontStyle, $paraStyle);
                                } else {
                                    // Jika baris kosong (hasil dari <p></p> atau \n\n), tambahkan spasi
                                    $contentSection->addTextBreak(1);
                                }
                            }
                        } else {
                            // Jika setelah dibersihkan jadi benar-benar kosong
                            $contentSection->addTextBreak(1);
                        }
                    } else {
                        $contentSection->addTextBreak(1); // Section kosong dari awal
                    }
                    // --- BATAS PERBAIKAN ---
                }
            }

            // Nama file download
            $filename = 'laporan-'.\Illuminate\Support\Str::slug($laporan->judul).'.docx';

            // Hapus buffer sebelum kirim header
            ob_end_clean();

            // Set header untuk download DOCX
            header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            header('Content-Disposition: attachment;filename="'.$filename.'"');
            header('Cache-Control: max-age=0');

            // Simpan ke output
            $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save('php://output');
            exit;

        } catch (\Exception $e) {
            // Tangani error jika PhpWord gagal
            ob_end_clean();
            report($e);

            return redirect()->back()->with('error', 'Gagal membuat file DOCX: '.$e->getMessage().' (File: '.basename($e->getFile()).' Baris: '.$e->getLine().')');
        }
    }

    // Preview dari Database
    public function preview(Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        // Load sections dengan children dan urutkan
        $laporan->load(['sections' => function ($query) {
            $query->orderBy('order');
        }, 'sections.children' => function ($query) {
            $query->orderBy('order');
        }]);

        // Process images in content to add figure/figcaption wrappers for better PDF rendering
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

    /**
     * Helper: Process images in HTML content to convert to absolute URLs and add figure/figcaption wrappers
     */
    private function processImagesForPdf(string $html): string
    {
        // Pattern untuk match img tags
        $pattern = '/<img([^>]*?)>/i';
        
        $figureCounter = 0;
        $baseUrl = config('app.url');
        
        $processed = preg_replace_callback($pattern, function ($matches) use (&$figureCounter, $baseUrl) {
            $figureCounter++;
            $imgAttrs = $matches[1];
            
            // Extract src
            preg_match('/src=["\']([^"\']*)["\']/', $imgAttrs, $srcMatch);
            $src = $srcMatch[1] ?? '';
            
            // Convert relative URL to absolute URL
            if (!empty($src)) {
                if (strpos($src, 'http') !== 0 && strpos($src, 'data:') !== 0) {
                    // Relative path, convert to absolute
                    if (strpos($src, '/storage/') === 0 || strpos($src, '/uploads/') === 0) {
                        $src = $baseUrl . $src;
                    } else {
                        // Try to get full path from storage
                        $storagePath = str_replace('/storage/', '', $src);
                        if (Storage::disk('public')->exists($storagePath)) {
                            $src = $baseUrl . '/storage/' . $storagePath;
                        }
                    }
                }
            }
            
            // Extract alt text
            preg_match('/alt=["\']([^"\']*)["\']/', $imgAttrs, $altMatch);
            $altText = $altMatch[1] ?? '';
            
            // Remove old src and add new absolute src
            $imgAttrs = preg_replace('/src=["\'][^"\']*["\']/', '', $imgAttrs);
            $imgAttrs = 'src="' . htmlspecialchars($src, ENT_QUOTES, 'UTF-8') . '" ' . $imgAttrs;
            
            // Create figure wrapper
            return sprintf(
                '<figure style="margin: 1em 0; text-align: center;"><img%s style="max-width: 100%%; height: auto; object-fit: contain; display: block; margin: 0 auto;"><figcaption style="font-size: 10pt; font-style: italic; margin-top: 5px; text-align: center;">Gambar %d: %s</figcaption></figure>',
                $imgAttrs,
                $figureCounter,
                htmlspecialchars($altText, ENT_QUOTES, 'UTF-8')
            );
        }, $html);
        
        return $processed ?? $html;
    }

    /**
     * Helper untuk membuat section default dinamis berdasarkan jenis laporan.
     */
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
