<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth; // Panggil helper Auth

class HomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        // 1. Ambil data user yang login
        $user = Auth::user();

        // 2. Ambil semua dokumen milik user tsb, urutkan dari yang terbaru
        $documents = $user->documents()->latest()->get();

        // 3. Kirim data documents itu ke view 'home'
        return view('home', ['documents' => $documents]);
    }
}
