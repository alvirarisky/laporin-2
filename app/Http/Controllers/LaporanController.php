<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\ReportSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Shared\Converter;
use PhpOffice\PhpWord\Shared\Html;
use PhpOffice\PhpWord\Element\Section as PhpWordSection;
use PhpOffice\PhpWord\Style\Language;

class LaporanController extends Controller
{
    public function index()
    {
        $laporans = Laporan::where('user_id', Auth::id())->latest()->get();
        return Inertia::render('Laporan/Index', ['laporans' => $laporans]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Laporan/Create', [
            'report_type' => $request->query('type', 'Makalah Akademik')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([ 'report_type' => 'required|string|max:255', /* ... validasi lainnya ... */ 'logo' => 'nullable|image|max:5120', 'logo_position' => 'required|in:kiri,tengah,kanan',]);
        $logoPath = $request->hasFile('logo') ? $request->file('logo')->store('logos', 'public') : null;
        $reportData = array_merge($validated, ['user_id' => Auth::id(), 'logo_path' => $logoPath]);
        unset($reportData['logo']);
        $laporan = Laporan::create($reportData);
        $this->createDefaultSections($laporan);
        return redirect()->route('laporan.edit', $laporan->id)->with('success', 'Data laporan berhasil dibuat!');
    }

    public function edit(Laporan $laporan)
    {
        $this->authorize('update', $laporan);
        return Inertia::render('Laporan/Edit', ['laporan' => $laporan->load('sections')]);
    }

    public function destroy(Laporan $laporan)
    {
        $this->authorize('delete', $laporan);
        if ($laporan->logo_path) Storage::disk('public')->delete($laporan->logo_path);
        $laporan->delete();
        return redirect()->route('laporan.index')->with('success', 'Laporan berhasil dihapus.');
    }

    public function previewLive(Request $request)
    {
        $previewData = ['judul' => $request->input('judul', 'JUDUL'), /* ... data lainnya ... */];
        if ($request->hasFile('logo')) {
            try {
                $path = $request->file('logo')->getRealPath(); $type = pathinfo($path, PATHINFO_EXTENSION);
                if (in_array(strtolower($type), ['jpg', 'jpeg', 'png', 'gif'])) {
                    $data = file_get_contents($path); $previewData['base64Logo'] = 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            } catch (\Exception $e) {}
        }
        return view('reports.preview', $previewData);
    }

    public function download(Laporan $laporan)
    {
        ob_start();
        $phpWord = new PhpWord(); $phpWord->getSettings()->setThemeFontLang(new Language(Language::EN_US)); /* ... setup PhpWord ... */
        // Cover
        $section1 = $phpWord->addSection([/* ... margin ... */]); $centerStyle = ['align' => 'center']; /* ... kode cover ... */
        // Isi
        $laporan->load('sections');
        if ($laporan->sections->isNotEmpty()) {
            $contentSection = $phpWord->addSection([/* ... margin ... */]); $config = \HTMLPurifier_Config::createDefault(); $purifier = new \HTMLPurifier($config);
            foreach ($laporan->sections as $section) {
                $contentSection->addTitle(\htmlspecialchars(strtoupper($section->title)), 1);
                if ($section->content && trim(strip_tags($section->content)) !== '') {
                    $cleanHtml = $purifier->purify($section->content); Html::addHtml($contentSection, $cleanHtml, true, false);
                }
                $contentSection->addPageBreak();
            }
        }
        $filename = "laporan-" . \Illuminate\Support\Str::slug($laporan->judul) . ".docx";
        ob_end_clean(); /* ... headers ... */ $objWriter = IOFactory::createWriter($phpWord, 'Word2007'); $objWriter->save("php://output"); exit;
    }

    public function preview(Laporan $laporan)
    {
        $this->authorize('update', $laporan);
        return view('reports.preview', ['laporan' => $laporan->load('sections')]);
    }

    private function createDefaultSections(Laporan $laporan): void { /* ... logika membuat bab default ... */ }
}