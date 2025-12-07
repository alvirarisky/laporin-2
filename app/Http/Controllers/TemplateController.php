<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\ReportSection;
use App\Models\Template;
use App\Services\WordParserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpWord\IOFactory;

class TemplateController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return Inertia::render('Templates/Index', [
            'templates' => $user->templates()->latest()->get(),
            'laporans' => $user->laporans()->latest()->take(10)->get(['id', 'judul']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'template_file' => 'required|file|mimes:docx|max:2048', // Maks 2MB
        ]);

        $path = $request->file('template_file')->store('templates', 'private');

        $request->user()->templates()->create([
            'name' => $request->name,
            'filepath' => $path,
        ]);

        return Redirect::route('templates.index')->with('success', 'Template berhasil diunggah.');
    }

    public function destroy(Template $template)
    {
        // Pastikan user hanya bisa hapus template miliknya sendiri
        if (Auth::id() !== $template->user_id) {
            abort(403);
        }

        // Hapus file dari storage
        Storage::disk('private')->delete($template->filepath);

        // Hapus record dari database
        $template->delete();

        return Redirect::route('templates.index')->with('success', 'Template berhasil dihapus.');
    }

    /**
     * Import template DOCX ke dalam laporan
     */
    public function import(Request $request, Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        $request->validate([
            'template_file' => 'required|file|mimes:docx|max:5120', // Max 5MB
        ]);

        try {
            $file = $request->file('template_file');
            $filePath = $file->getRealPath();

            // Load DOCX file
            $phpWord = IOFactory::load($filePath);
            $sections = $phpWord->getSections();

            $htmlContent = '';
            foreach ($sections as $section) {
                $elements = $section->getElements();
                foreach ($elements as $element) {
                    if (method_exists($element, 'getText')) {
                        $text = $element->getText();
                        if (!empty(trim($text))) {
                            $htmlContent .= '<p>' . htmlspecialchars($text, ENT_QUOTES, 'UTF-8') . '</p>';
                        }
                    }
                }
            }

            // Jika kosong, coba metode alternatif: extract text dari semua elemen
            if (empty($htmlContent)) {
                foreach ($sections as $section) {
                    $elements = $section->getElements();
                    foreach ($elements as $element) {
                        if (method_exists($element, 'getText')) {
                            $text = $element->getText();
                            if (!empty(trim($text))) {
                                $htmlContent .= '<p>' . htmlspecialchars($text, ENT_QUOTES, 'UTF-8') . '</p>';
                            }
                        } elseif (method_exists($element, 'getElements')) {
                            // Handle nested elements (like tables, lists)
                            foreach ($element->getElements() as $nested) {
                                if (method_exists($nested, 'getText')) {
                                    $text = $nested->getText();
                                    if (!empty(trim($text))) {
                                        $htmlContent .= '<p>' . htmlspecialchars($text, ENT_QUOTES, 'UTF-8') . '</p>';
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Cari atau buat section "Imported Content"
            $section = $laporan->sections()
                ->where('title', 'LIKE', '%Imported Content%')
                ->first();

            if (!$section) {
                // Buat section baru
                $maxOrder = $laporan->sections()->whereNull('parent_id')->max('order') ?? 0;
                $section = $laporan->sections()->create([
                    'title' => 'Imported Content',
                    'content' => $htmlContent,
                    'order' => $maxOrder + 1,
                ]);
            } else {
                // Update section yang ada
                $section->update([
                    'content' => $htmlContent,
                ]);
            }

            return back()->with('success', 'Template berhasil diimpor ke laporan!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengimpor template: ' . $e->getMessage());
        }
    }

    /**
     * Gunakan template yang sudah diupload ke laporan
     */
    public function useTemplate(Request $request, Template $template, Laporan $laporan = null)
    {
        // Authorization
        if (Auth::id() !== $template->user_id) {
            abort(403, 'Anda tidak memiliki akses ke template ini.');
        }

        $request->validate([
            'replace_existing' => 'boolean',
        ]);

        try {
            $filePath = Storage::disk('private')->path($template->filepath);
            
            if (!file_exists($filePath)) {
                return back()->with('error', 'File template tidak ditemukan.');
            }

            // Parse template menggunakan WordParserService
            $parser = new WordParserService();
            $sections = $parser->parse($filePath);

            if (empty($sections)) {
                return back()->with('error', 'Template tidak berisi konten yang dapat diparsing.');
            }

            // Jika laporan tidak diberikan, buat laporan baru
            if (!$laporan) {
                $laporan = Auth::user()->laporans()->create([
                    'report_type' => 'Makalah',
                    'judul' => $template->name . ' - ' . now()->format('Y-m-d'),
                    'nama' => Auth::user()->name,
                    'nim' => '',
                    'prodi' => '',
                    'mata_kuliah' => '',
                    'dosen_pembimbing' => '',
                    'instansi' => '',
                    'kota' => '',
                    'tahun_ajaran' => now()->format('Y'),
                    'logo_position' => 'tengah',
                ]);
            } else {
                $this->authorize('update', $laporan);
            }

            // Hapus section lama jika diminta
            if ($request->boolean('replace_existing')) {
                $laporan->sections()->delete();
            }

            // Buat section baru dari template
            $order = $laporan->sections()->whereNull('parent_id')->max('order') ?? 0;
            
            foreach ($sections as $sectionData) {
                $order++;
                $laporan->sections()->create([
                    'title' => $sectionData['title'],
                    'content' => $sectionData['content'],
                    'order' => $order,
                    'parent_id' => null,
                ]);
            }

            if ($laporan->wasRecentlyCreated) {
                return redirect()->route('laporan.edit', $laporan->id)
                    ->with('success', 'Template berhasil diterapkan! Laporan baru telah dibuat.');
            }

            return redirect()->route('laporan.edit', $laporan->id)
                ->with('success', 'Template berhasil diterapkan ke laporan!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menggunakan template: ' . $e->getMessage());
        }
    }

    /**
     * Terapkan template ke laporan (reset dan isi ulang sections)
     * Alias untuk apply
     */
    public function apply(Request $request, Template $template, Laporan $laporan)
    {
        // Authorization
        if (Auth::id() !== $template->user_id) {
            abort(403, 'Anda tidak memiliki akses ke template ini.');
        }
        
        $this->authorize('update', $laporan);

        $request->validate([
            'replace_existing' => 'boolean',
        ]);

        try {
            $filePath = Storage::disk('private')->path($template->filepath);
            
            if (!file_exists($filePath)) {
                return back()->with('error', 'File template tidak ditemukan.');
            }

            // Parse template dengan support nested structure
            $parser = new WordParserService();
            $sectionsData = $parser->parse($filePath);

            if (empty($sectionsData)) {
                return back()->with('error', 'Template tidak berisi konten yang dapat diparsing.');
            }

            // Hapus section lama jika diminta
            if ($request->boolean('replace_existing')) {
                $laporan->sections()->delete();
            }

            // Buat section baru dari template dengan support parent_id
            $order = $laporan->sections()->whereNull('parent_id')->max('order') ?? 0;
            $parentSections = []; // Track parent sections by index
            
            foreach ($sectionsData as $index => $sectionData) {
                $parentId = null;
                
                // Jika level 2 (SUB-BAB), cari parent_id dari parent_index
                if ($sectionData['level'] === 2 && isset($sectionData['parent_index'])) {
                    $parentIndex = $sectionData['parent_index'];
                    if (isset($parentSections[$parentIndex])) {
                        $parentId = $parentSections[$parentIndex]->id;
                    }
                }
                
                // Jika level 1 (BAB), increment order untuk parent
                if ($sectionData['level'] === 1) {
                    $order++;
                }
                
                $section = $laporan->sections()->create([
                    'title' => $sectionData['title'],
                    'content' => $sectionData['content'],
                    'order' => $sectionData['level'] === 1 ? $order : ($laporan->sections()->where('parent_id', $parentId)->max('order') ?? 0) + 1,
                    'parent_id' => $parentId,
                ]);
                
                // Simpan parent section untuk referensi SUB-BAB
                if ($sectionData['level'] === 1) {
                    $parentSections[$index] = $section;
                }
            }

            return redirect()->route('laporan.edit', $laporan->id)
                ->with('success', 'Template berhasil diterapkan ke laporan!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menerapkan template: ' . $e->getMessage());
        }
    }
}
