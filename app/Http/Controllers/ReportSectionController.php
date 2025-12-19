<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\ReportSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportSectionController extends Controller
{
    public function store(Request $request, Laporan $laporan)
    {
        $this->authorize('update', $laporan);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:report_sections,id',
            'order' => 'nullable|integer',
        ]);

        if (!isset($validated['order'])) {
            $query = ReportSection::where('laporan_id', $laporan->id);
            if ($validated['parent_id']) {
                $query->where('parent_id', $validated['parent_id']);
            } else {
                $query->whereNull('parent_id');
            }
            $validated['order'] = ($query->max('order') ?? 0) + 1;
        }

        $validated['laporan_id'] = $laporan->id;
        $validated['content'] = $validated['content'] ?? '';

        $section = ReportSection::create($validated);

        // Return JSON agar frontend tidak reload/redirect
        if ($request->wantsJson()) {
            return response()->json(['message' => 'Bab berhasil dibuat', 'section' => $section]);
        }

        return back()->with('success', 'Bab berhasil ditambahkan!');
    }

    public function update(Request $request, ReportSection $section)
    {
        $this->authorize('update', $section->laporan);

        // Validasi: Gunakan 'sometimes' agar kalau cuma kirim content, title gak error
        $validated = $request->validate([
            'content' => 'nullable|string',
            'title'   => 'sometimes|required|string|max:255',
        ]);

        $section->update($validated);

        // [FIX UTAMA] Jangan return back()! Gunakan JSON.
        return response()->json([
            'message' => 'Berhasil disimpan',
            'section' => $section
        ]);
    }

    public function destroy(ReportSection $section)
    {
        $this->authorize('update', $section->laporan);
        $section->children()->delete();
        $section->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Terhapus']);
        }
        return back()->with('success', 'Bab dihapus!');
    }
}