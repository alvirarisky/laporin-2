<?php

namespace App\Http\Controllers;

use App\Models\ReportSection;
use Illuminate\Http\Request;

class ReportSectionController extends Controller
{
    /**
     * Mengupdate konten dari satu bab (section) laporan.
     */
    public function update(Request $request, ReportSection $section)
    {
        // Memastikan hanya pemilik laporan yang bisa mengedit
        $this->authorize('update', $section->laporan);

        $validated = $request->validate([
            'content' => 'nullable|string',
        ]);

        $section->update($validated);

        // Redirect kembali ke halaman editor dengan pesan sukses
        return back()->with('success', 'Perubahan pada bab "'.$section->title.'" berhasil disimpan!');
    }
}
