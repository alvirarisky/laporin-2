<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Fungsi untuk menyimpan dokumen baru dari request API.
     */
    public function store(Request $request)
    {
        // Langkah 1: Validasi data yang dikirim dari frontend.
        // Kita pastikan 'title' itu wajib ada, dan 'content_data' juga wajib ada.
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content_data' => 'required|json',
        ]);

        // Langkah 2: Dapatkan data user yang sedang login saat ini.
        $user = $request->user();

        // Langkah 3: Buat entri dokumen baru di tabel 'documents'
        // yang berelasi dengan user yang sedang login.
        $document = $user->documents()->create([
            'title' => $validatedData['title'],
            'content_data' => $validatedData['content_data'],
        ]);

        // Langkah 4: Kirim balasan ke frontend bahwa dokumen berhasil dibuat.
        return response()->json([
            'message' => 'Dokumen berhasil disimpan!',
            'document' => $document,
        ], 201); // Kode 201 berarti "Created" atau berhasil dibuat.
    }
}