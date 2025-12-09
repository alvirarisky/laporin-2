<?php

namespace App\Traits;

use App\Models\ReportSection;
use PhpOffice\PhpWord\IOFactory;
use DOMDocument;
use DOMXPath;

trait ParsesWordDocument
{
    /**
     * Parsing file Word dan simpan jadi Section di database
     * Versi Refactored: Support Images (Base64), Tables, & Better Heading Detection
     */
    public function parseAndSaveSections($filePath, $laporan)
    {
        if (!file_exists($filePath)) {
            throw new \Exception("File template tidak ditemukan di server: " . $filePath);
        }

        // 1. Convert Word ke HTML dengan Image Embed (Base64)
        try {
            $phpWord = IOFactory::load($filePath);
            $xmlWriter = IOFactory::createWriter($phpWord, 'HTML');
            
            // PENTING: Ini biar gambar jadi data:image/base64, bukan link file lokal yang bakal error
            if (method_exists($xmlWriter, 'setImageValue')) {
                $xmlWriter->setImageValue(true);
            }
            
            // Capture output buffer
            ob_start();
            $xmlWriter->save('php://output');
            $rawHtml = ob_get_contents();
            ob_end_clean();
        } catch (\Exception $e) {
            throw new \Exception("Gagal convert Word ke HTML: " . $e->getMessage());
        }

        // 2. Load DOMDocument dengan Error Suppression (biar gak protes soal tag HTML5 yg aneh)
        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        
        // Hack biar UTF-8 kebaca bener
        $htmlToLoad = mb_convert_encoding($rawHtml, 'HTML-ENTITIES', 'UTF-8');
        // Bungkus body biar valid
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $htmlToLoad, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $body = $dom->getElementsByTagName('body')->item(0);
        if (!$body) return; // Dokumen kosong, skip.

        // 3. Logic Parsing Bab/Sub-bab (Smart Detection)
        $currentRoot = null;    // Untuk BAB (Parent)
        $activeSection = null;  // Section yang lagi diisi konten (bisa BAB atau SUB-BAB)
        
        // Ambil order terakhir biar aman kalau append
        $rootOrder = $laporan->sections()->whereNull('parent_id')->max('order') + 1;
        $subOrder = 1;

        foreach ($body->childNodes as $node) {
            // Skip text node kosong/spasi doang
            if ($node->nodeName === '#text' && trim($node->textContent) === '') {
                continue;
            }

            $nodeHtml = $node->ownerDocument->saveHTML($node);
            $tag = strtolower($node->nodeName);
            $textRaw = $node->textContent;
            $textClean = trim(preg_replace('/\s+/', ' ', $textRaw)); // Hapus spasi ganda & newline

            // Deteksi Jenis Heading
            $headingType = $this->detectHeadingType($node, $tag, $textClean);

            if ($headingType === 'root') {
                // --- KETEMU BAB BARU (Level 1) ---
                $currentRoot = $this->createSection($laporan, $textClean, "", $rootOrder++, null);
                $activeSection = $currentRoot;
                $subOrder = 1; // Reset urutan sub-bab
            } 
            elseif ($headingType === 'sub' && $currentRoot) {
                // --- KETEMU SUB-BAB (Level 2) ---
                // Pastikan ada parent dulu
                $activeSection = $this->createSection($laporan, $textClean, "", $subOrder++, $currentRoot->id);
            } 
            else {
                // --- KONTEN BIASA ---
                if ($activeSection) {
                    // Append konten ke section yang aktif
                    $activeSection->content .= $nodeHtml;
                    $activeSection->save();
                } else {
                    // Kalau belum ada BAB tapi udah ada konten (misal Cover/Kata Pengantar tanpa heading)
                    // Kita bikin section "Intro" otomatis biar kontennya gak ilang
                    if (!empty($textClean) || $tag === 'img' || $tag === 'table') {
                        $currentRoot = $this->createSection($laporan, "Bagian Awal (Intro)", $nodeHtml, $rootOrder++, null);
                        $activeSection = $currentRoot;
                    }
                }
            }
        }
    }

    /**
     * Helper: Deteksi apakah node ini Judul Bab, Sub-bab, atau Konten biasa
     * Returns: 'root', 'sub', or 'content'
     */
    private function detectHeadingType($node, $tag, $text)
    {
        // 1. Cek Tag HTML Headings (H1 = Bab, H2/H3 = Sub-bab)
        if ($tag === 'h1') return 'root';
        if (in_array($tag, ['h2', 'h3'])) return 'sub';

        // 2. Cek Pattern Teks (Regex) - Backup kalau user gak pake Style Heading
        // Pattern BAB: "BAB 1", "BAB I", "DAFTAR PUSTAKA", "LAMPIRAN"
        if (preg_match('/^(BAB\s+[0-9IVX]+|DAFTAR\s+[A-Z]+|LAMPIRAN|KESIMPULAN|PENDAHULUAN)/i', $text)) {
            return 'root';
        }

        // Pattern Sub-bab: "1.1 Latar", "A. Tujuan" (minimal 3 huruf biar gak false detect list)
        if (preg_match('/^(\d+\.\d+|[A-Z]\.)\s+[A-Za-z]/', $text) && strlen($text) < 100) {
            return 'sub';
        }

        // 3. Cek Bold & All Caps (Sering dipake mahasiswa buat judul manual)
        // Syarat: Bold, Pendek (<100 char), Kapital semua, Bukan kosong
        $isBold = false;
        // Cek child node (b, strong, atau style="font-weight:bold")
        if ($node->hasAttributes() && strpos($node->getAttribute('style'), 'bold') !== false) $isBold = true;
        foreach ($node->childNodes as $child) {
            if (in_array(strtolower($child->nodeName), ['b', 'strong'])) $isBold = true;
        }

        if ($isBold && strlen($text) > 3 && strlen($text) < 100) {
            // Cek apakah uppercase semua (ignoring angka/simbol)
            $lettersOnly = preg_replace('/[^a-zA-Z]/', '', $text);
            if (!empty($lettersOnly) && ctype_upper($lettersOnly)) {
                return 'root'; // Anggap BAB kalau Bold + Kapital
            }
        }

        return 'content';
    }

    /**
     * Helper: Create Section ke Database
     */
    private function createSection($laporan, $title, $content, $order, $parentId = null)
    {
        // Bersihin judul biar gak kepanjangan atau aneh
        $cleanTitle = strip_tags($title);
        $cleanTitle = str_replace('&nbsp;', ' ', $cleanTitle);
        $cleanTitle = trim(preg_replace('/\s+/', ' ', $cleanTitle));
        
        if (strlen($cleanTitle) > 250) $cleanTitle = substr($cleanTitle, 0, 247) . '...';
        if (empty($cleanTitle)) $cleanTitle = "Bagian Tanpa Judul";

        return ReportSection::create([
            'laporan_id' => $laporan->id,
            'title' => $cleanTitle,
            'content' => $content, // Konten awal (bisa kosong dulu)
            'order' => $order,
            'parent_id' => $parentId
        ]);
    }
}