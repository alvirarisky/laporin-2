<?php

namespace App\Http\Controllers;

use App\Models\ReportSection; // <--- GANTI JADI ReportSection
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SectionController extends Controller
{
    public function reorder(Request $request)
    {
        $orders = $request->input('orders');

        if (!is_array($orders)) {
            return response()->json(['success' => false], 400);
        }

        try {
            foreach ($orders as $item) {
                // Update pakai Model yang BENAR
                ReportSection::where('id', $item['id'])->update(['order' => $item['order']]);
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['success' => false], 500);
        }
    }
}