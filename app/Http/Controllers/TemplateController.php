<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('Templates/Index', [ // <-- PASTIKAN INI SAMA PERSIS
            'templates' => Auth::user()->templates()->latest()->get(),
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
}
