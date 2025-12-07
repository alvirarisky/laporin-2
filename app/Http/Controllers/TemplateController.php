<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\ReportSection;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Log;

class TemplateController extends Controller
{
    public function import(Request $request, Laporan $laporan)
    {
        $request->validate([
            'template_file' => 'required|mimes:docx|max:10240',
        ]);

        try {
            // 1. Convert Word ke HTML
            $file = $request->file('template_file');
            $phpWord = IOFactory::load($file->getPathname());
            $xmlWriter = IOFactory::createWriter($phpWord, 'HTML');
            
            ob_start();
            $xmlWriter->save('php://output');
            $rawHtml = ob_get_contents();
            ob_end_clean();

            // 2. BERSIHIN HTML (Wajib!)
            // Buang CSS Style & Head yang bikin sampah teks
            $cleanHtml = preg_replace('/<head\b[^>]*>(.*?)<\/head>/is', "", $rawHtml);
            $cleanHtml = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', "", $cleanHtml);
            
            // Sisakan tag penting aja
            $cleanHtml = strip_tags($cleanHtml, '<p><h1><h2><h3><h4><h5><h6><table><thead><tbody><tr><td><ul><ol><li><strong><em><b><i><u><br><img>');

            // 3. WRAPPER AJAIB (Ini Solusi "Imported Content")
            // Kita bungkus paksa pake HTML & BODY biar DOMDocument gak bingung
            $htmlToLoad = '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>' . $cleanHtml . '</body></html>';

            // 4. Load DOM
            $dom = new \DOMDocument();
            libxml_use_internal_errors(true);
            $dom->loadHTML($htmlToLoad, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
            libxml_clear_errors();

            $body = $dom->getElementsByTagName('body')->item(0);

            // Kalau masih gagal juga, berarti filenya kosong/rusak
            if (!$body) {
                return back()->with('error', 'Gagal membaca struktur dokumen. Coba Save As ulang file Word-nya.');
            }

            // --- STATE MACHINE ---
            $currentRoot = null;
            $currentSub = null;
            $activeSection = null;
            
            // Ambil urutan terakhir biar gak numpuk
            $rootOrder = $laporan->sections()->whereNull('parent_id')->max('order') + 1;
            $subOrder = 1;

            foreach ($body->childNodes as $node) {
                // Normalisasi Teks (Hapus spasi aneh & spasi ganda)
                $textRaw = $node->textContent;
                $text = trim(preg_replace('/\s+/', ' ', str_replace("\xC2\xA0", ' ', $textRaw)));
                
                // Ambil HTML konten
                $nodeHtml = $node->ownerDocument->saveHTML($node);
                $tag = strtolower($node->nodeName);

                // Skip node kosong (kecuali gambar/tabel)
                if (empty($text) && !in_array($tag, ['img', 'table', 'tr', 'td'])) {
                    continue;
                }

                // =================================================
                // LOGIC DETEKTIF V2 (LEBIH AGRESIF)
                // =================================================

                // Cek Bold (Indikator Kuat Judul Manual)
                $isBold = false;
                if ($node->hasChildNodes()) {
                    foreach ($node->childNodes as $child) {
                        if (in_array(strtolower($child->nodeName), ['b', 'strong'])) {
                            $isBold = true; break;
                        }
                    }
                }

                // REGEX SAKTI:
                // 1. "BAB" diikuti angka/romawi
                // 2. "DAFTAR ..." atau "LAMPIRAN"
                // 3. Kapital semua & pendek & bold (buat judul manual)
                $isRootTitle = ($tag === 'h1') || 
                               preg_match('/^(BAB\s+[0-9IVX]+|DAFTAR\s+[A-Z]+|LAMPIRAN\s+[A-Z]+)/i', $text) ||
                               ($isBold && strlen($text) < 100 && ctype_upper(str_replace([' ', '.', '-', ':'], '', $text)) && strlen($text) > 3);

                // REGEX SUB-BAB:
                // 1. Angka "1.1", "1.2", "A."
                // 2. Tag H2/H3
                $isSubTitle = ($tag === 'h2' || $tag === 'h3') || 
                              preg_match('/^(\d+\.\d+|[A-Z]\.)\s+/i', $text);

                // =================================================
                // ACTION
                // =================================================

                if ($isRootTitle) {
                    // KETEMU BAPAK BARU
                    $currentRoot = $this->createSection($laporan, $text, "", $rootOrder++, null);
                    $currentSub = null;
                    $subOrder = 1;
                    $activeSection = $currentRoot;

                } elseif ($isSubTitle && $currentRoot) {
                    // KETEMU ANAK BARU (Masuk ke Bapak yg aktif)
                    $currentSub = $this->createSection($laporan, $text, "", $subOrder++, $currentRoot->id);
                    $activeSection = $currentSub;

                } else {
                    // KONTEN BIASA
                    if ($activeSection) {
                        $activeSection->content .= $nodeHtml;
                        $activeSection->save();
                    } else {
                        // Konten Yatim Piatu (Sebelum Bab 1) -> Masukin ke Bab Intro
                        if (!empty($text) || $tag === 'img') {
                            $currentRoot = $this->createSection($laporan, "Cover / Intro", $nodeHtml, $rootOrder++, null);
                            $activeSection = $currentRoot;
                        }
                    }
                }
            }

            return back()->with('success', 'Import Sukses! Struktur Bab terbentuk.');

        } catch (\Exception $e) {
            Log::error("Import Error: " . $e->getMessage());
            return back()->with('error', 'Gagal import: ' . $e->getMessage());
        }
    }

    // Helper Create
    private function createSection($laporan, $title, $content, $order, $parentId = null)
    {
        $cleanTitle = strip_tags($title);
        $cleanTitle = str_replace('&nbsp;', ' ', $cleanTitle);
        $cleanTitle = trim(preg_replace('/\s+/', ' ', $cleanTitle));

        if (strlen($cleanTitle) > 250) $cleanTitle = substr($cleanTitle, 0, 250);
        if (empty($cleanTitle)) $cleanTitle = "Bab Tanpa Judul";

        return ReportSection::create([
            'laporan_id' => $laporan->id,
            'title' => $cleanTitle,
            'content' => $content,
            'order' => $order,
            'parent_id' => $parentId
        ]);
    }
}