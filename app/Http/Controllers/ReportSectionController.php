<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\ReportSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportSectionController extends Controller
{
    /**
     * Menyimpan bab atau sub-bab baru
     */
    public function store(Request $request, Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:report_sections,id',
            'order' => 'nullable|integer',
        ]);

        // Tentukan order jika tidak diberikan
        if (!isset($validated['order'])) {
            if ($validated['parent_id']) {
                // Sub-bab: ambil order terakhir dari sub-bab dengan parent yang sama
                $lastOrder = ReportSection::where('laporan_id', $laporan->id)
                    ->where('parent_id', $validated['parent_id'])
                    ->max('order') ?? 0;
                $validated['order'] = $lastOrder + 1;
            } else {
                // Bab utama: ambil order terakhir dari root sections
                $lastOrder = ReportSection::where('laporan_id', $laporan->id)
                    ->whereNull('parent_id')
                    ->max('order') ?? 0;
                $validated['order'] = $lastOrder + 1;
            }
        }

        $validated['laporan_id'] = $laporan->id;
        $validated['content'] = '';

        $section = ReportSection::create($validated);

        return back()->with('success', 'Bab/Sub-bab berhasil ditambahkan!');
    }

    /**
     * Mengupdate konten atau judul dari satu bab (section) laporan.
     */
    public function update(Request $request, ReportSection $section)
    {
        // Memastikan hanya pemilik laporan yang bisa mengedit
        $this->authorize('update', $section->laporan);

        $validated = $request->validate([
            'content' => 'nullable|string',
            'title' => 'nullable|string|max:255',
        ]);

        $section->update($validated);

        // Redirect kembali ke halaman editor dengan pesan sukses
        return back()->with('success', 'Perubahan pada bab "'.$section->title.'" berhasil disimpan!');
    }

    /**
     * Menghapus bab atau sub-bab
     */
    public function destroy(ReportSection $section)
    {
        $this->authorize('update', $section->laporan);

        // Hapus semua sub-bab terlebih dahulu (cascade)
        $section->children()->delete();
        
        $section->delete();

        return back()->with('success', 'Bab/Sub-bab berhasil dihapus!');
    }
}
