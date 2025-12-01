<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpWord\TemplateProcessor;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content_data' => 'required|json',
        ]);

        $user = Auth::user();

        $user->documents()->create([
            'title' => $validated['title'],
            'content_data' => $validated['content_data'],
        ]);

        return redirect()->route('home')->with('success', 'Laporan berhasil disimpan!');
    }

    public function download(\App\Models\Document $document)
    {
        // 1. Tentukan path ke file template
        $templatePath = storage_path('app/templates/template_laporan.docx');

        // 2. Buat instance TemplateProcessor dari PHPWord
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor($templatePath);

        // 3. Ambil data JSON dari database dan ubah jadi array
        $contentData = json_decode($document->content_data, true);

        // 4. Ganti placeholder di template dengan data dari database
        $templateProcessor->setValue('judul_laporan', $document->title);
        $templateProcessor->setValue('nama_mahasiswa', $contentData['nama'] ?? '');
        $templateProcessor->setValue('nim_mahasiswa', $contentData['nim'] ?? '');

        // 5. Siapkan nama file baru yang akan di-download
        $newFileName = 'Laporan - '.$document->title.'.docx';
        $newFilePath = storage_path($newFileName);

        // 6. Simpan dokumen yang sudah diproses
        $templateProcessor->saveAs($newFilePath);

        // 7. Kirim file ke user untuk di-download, lalu hapus file sementaranya
        return response()->download($newFilePath)->deleteFileAfterSend(true);
    }
}
