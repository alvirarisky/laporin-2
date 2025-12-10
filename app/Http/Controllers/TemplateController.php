<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\ReportSection;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use PhpOffice\PhpWord\IOFactory;

class TemplateController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $templates = Template::with('user:id,name')
            ->where('user_id', $user->id)
            ->orWhere('is_public', true)
            ->latest()
            ->get()
            ->map(function ($template) use ($user) {
                $template->is_owner = $template->user_id === $user->id;
                return $template;
            });

        return Inertia::render('Templates/Index', [
            'templates' => $templates,
            'laporans' => $user->laporans()->select('id', 'judul')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'template_file' => 'required|mimes:docx|max:10240',
            'is_public' => 'boolean',
            'description' => 'nullable|string|max:500',
        ]);

        try {
            $file = $request->file('template_file');
            $path = $file->store('templates', 'public');

            Auth::user()->templates()->create([
                'name' => $request->name,
                'filepath' => $path,
                'is_public' => $request->boolean('is_public'),
                'description' => $request->description,
            ]);

            return back()->with('success', 'Template berhasil disimpan! 💾');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal upload: ' . $e->getMessage());
        }
    }

    public function destroy(Template $template)
    {
        if ($template->user_id !== Auth::id()) abort(403);
        if (Storage::disk('public')->exists($template->filepath)) {
            Storage::disk('public')->delete($template->filepath);
        }
        $template->delete();
        return back()->with('success', 'Template berhasil dihapus.');
    }

    /**
     * [MODIFIED] Gunakan template (DEBUG MODE)
     * Try-catch dihapus sementara biar kelihatan error aslinya.
     */
    public function useTemplate(Request $request, Template $template)
    {
        // 1. Validasi Input
        $validated = $request->validate([
            'judul' => 'nullable|string|max:255',
            'report_type' => 'nullable|string|max:100',
            'mata_kuliah' => 'nullable|string|max:255',
            'nim' => 'nullable|string|max:50',
            'prodi' => 'nullable|string|max:100',
            'instansi' => 'nullable|string|max:100',
        ]);

        // Default logic
        $judul = $validated['judul'] ?: 'Laporan: ' . $template->name;
        $matkul = $validated['mata_kuliah'] ?: 'Umum';
        $tipe = $validated['report_type'] ?? 'Makalah';

        // 2. Buat Laporan Baru
        $laporan = Laporan::create([
            'user_id' => Auth::id(),
            'nama' => Auth::user()->name,
            'judul' => $judul,
            'report_type' => $tipe,
            'mata_kuliah' => $matkul,
            
            // Isi field opsional
            'nim' => $validated['nim'] ?? null,
            'prodi' => $validated['prodi'] ?? null,
            'instansi' => $validated['instansi'] ?? null,
            
            // Default field lain
            'kota' => 'Jakarta', 
            'tahun_ajaran' => date('Y'),
        ]);

        // 3. PARSING LOGIC (Ini yang bikin bab-nya muncul!)
        // Cek apakah file template fisik ada, lalu convert ke Section
        if (Storage::disk('public')->exists($template->filepath)) {
            $filePath = Storage::disk('public')->path($template->filepath);
            
            // Panggil fungsi parsing yang sudah ada di bawah
            $this->parseAndSaveSections($filePath, $laporan);
        }

        // 4. REDIRECT KHUSUS INERTIA (FIX)
        // Gunakan to_route agar Inertia otomatis redirect browser ke halaman edit
        return to_route('laporan.edit', $laporan->id)
                ->with('success', 'Template berhasil diterapkan! Silakan edit isinya.');
    }
    public function apply(Request $request, Template $template, Laporan $laporan)
    {
        if ($laporan->user_id !== Auth::id()) abort(403);

        if ($request->boolean('replace_existing')) {
            $laporan->sections()->delete();
        }

        $filePath = Storage::disk('public')->path($template->filepath);
        $this->parseAndSaveSections($filePath, $laporan);

        return redirect()->route('laporan.edit', $laporan->id)
            ->with('success', 'Template berhasil diterapkan!');
    }

    public function import(Request $request, Laporan $laporan)
    {
        $request->validate(['template_file' => 'required|mimes:docx|max:10240']);
        $path = $request->file('template_file')->getPathname();
        $this->parseAndSaveSections($path, $laporan);
        return back()->with('success', 'Import Sukses!');
    }

    // --- PARSER LOGIC ---
    private function parseAndSaveSections($filePath, Laporan $laporan)
    {
        $phpWord = IOFactory::load($filePath);
        $xmlWriter = IOFactory::createWriter($phpWord, 'HTML');
        
        ob_start();
        $xmlWriter->save('php://output');
        $rawHtml = ob_get_contents();
        ob_end_clean();

        // Bersihin HTML dari style bawaan Word yang kacau
        $cleanHtml = preg_replace('/<head\b[^>]*>(.*?)<\/head>/is', "", $rawHtml);
        $cleanHtml = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', "", $cleanHtml);
        $cleanHtml = strip_tags($cleanHtml, '<p><h1><h2><h3><h4><h5><h6><table><thead><tbody><tr><td><ul><ol><li><strong><em><b><i><u><br><img>');

        $htmlToLoad = '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>' . $cleanHtml . '</body></html>';
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($htmlToLoad, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $body = $dom->getElementsByTagName('body')->item(0);
        if (!$body) return; // Kalau kosong ya udah return aja

        $currentRoot = null;
        $activeSection = null;
        $rootOrder = $laporan->sections()->whereNull('parent_id')->max('order') + 1;
        $subOrder = 1;

        foreach ($body->childNodes as $node) {
            $textRaw = $node->textContent;
            $text = trim(preg_replace('/\s+/', ' ', str_replace("\xC2\xA0", ' ', $textRaw)));
            $nodeHtml = $node->ownerDocument->saveHTML($node);
            $tag = strtolower($node->nodeName);

            if (empty($text) && !in_array($tag, ['img', 'table', 'tr', 'td'])) continue;

            // Deteksi Judul Bab (H1 atau text bold > uppercase)
            $isBold = false;
            if ($node->hasChildNodes()) {
                foreach ($node->childNodes as $child) {
                    if (in_array(strtolower($child->nodeName), ['b', 'strong'])) {
                        $isBold = true; break;
                    }
                }
            }

            $isRootTitle = ($tag === 'h1') || 
                           preg_match('/^(BAB\s+[0-9IVX]+|DAFTAR\s+[A-Z]+|LAMPIRAN\s+[A-Z]+)/i', $text) ||
                           ($isBold && strlen($text) < 100 && ctype_upper(str_replace([' ', '.', '-', ':'], '', $text)) && strlen($text) > 3);

            $isSubTitle = ($tag === 'h2' || $tag === 'h3') || preg_match('/^(\d+\.\d+|[A-Z]\.)\s+/i', $text);

            if ($isRootTitle) {
                $currentRoot = $this->createSection($laporan, $text, "", $rootOrder++, null);
                $subOrder = 1;
                $activeSection = $currentRoot;
            } elseif ($isSubTitle && $currentRoot) {
                $activeSection = $this->createSection($laporan, $text, "", $subOrder++, $currentRoot->id);
            } else {
                if ($activeSection) {
                    $activeSection->content .= $nodeHtml;
                    $activeSection->save();
                } else {
                    if (!empty($text) || $tag === 'img') {
                        $currentRoot = $this->createSection($laporan, "Cover / Intro", $nodeHtml, $rootOrder++, null);
                        $activeSection = $currentRoot;
                    }
                }
            }
        }
    }

    private function createSection($laporan, $title, $content, $order, $parentId = null)
    {
        $cleanTitle = strip_tags($title);
        $cleanTitle = str_replace('&nbsp;', ' ', $cleanTitle);
        $cleanTitle = trim(preg_replace('/\s+/', ' ', $cleanTitle));
        if (strlen($cleanTitle) > 250) $cleanTitle = substr($cleanTitle, 0, 250);
        if (empty($cleanTitle)) $cleanTitle = "Bab Tanpa Judul";

        return ReportSection::create([
            'laporan_id' => $laporan->id,
            'title' => $cleanTitle,
            'content' => $content,
            'order' => $order,
            'parent_id' => $parentId
        ]);
    }
}