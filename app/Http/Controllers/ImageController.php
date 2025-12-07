<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        try {
            if ($request->hasFile('image')) {
                // Simpan file
                $path = $request->file('image')->store('uploads', 'public');

                // Return URL lengkap
                return response()->json([
                    'success' => true,
                    'url' => asset('storage/' . $path)
                ]);
            }
            return response()->json(['message' => 'No file'], 400);

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['success' => false], 500);
        }
    }
}