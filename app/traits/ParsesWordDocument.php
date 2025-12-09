<?php

namespace App\Traits;

use App\Models\ReportSection;
use PhpOffice\PhpWord\IOFactory;

trait ParsesWordDocument
{
    /**
     * Parsing file Word dan simpan jadi Section di database
     */
    public function parseAndSaveSections($filePath, $laporan)
    {
        if (!file_exists($filePath)) {
            throw new \Exception("File template tidak ditemukan di server.");
        }

        // 1. Convert Word ke HTML
        $phpWord = IOFactory::load($filePath);
        $xmlWriter = IOFactory::createWriter($phpWord, 'HTML');
        
        ob_start();
        $xmlWriter->save('php://output');
        $rawHtml = ob_get_contents();
        ob_end_clean();

        // 2. Bersihin HTML (Hapus Head, Style, dll)
        $cleanHtml = preg_replace('/<head\b[^>]*>(.*?)<\/head>/is', "", $rawHtml);
        $cleanHtml = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', "", $cleanHtml);
        $cleanHtml = strip_tags($cleanHtml, '<p><h1><h2><h3><h4><h5><h6><table><thead><tbody><tr><td><ul><ol><li><strong><em><b><i><u><br><img>');

        // 3. Load DOM
        $htmlToLoad = '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>' . $cleanHtml . '</body></html>';
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($htmlToLoad, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $body = $dom->getElementsByTagName('body')->item(0);
        if (!$body) return; // Dokumen kosong

        // 4. Logic Parsing Bab/Sub-bab
        $currentRoot = null;
        $activeSection = null;
        
        // Cek urutan terakhir biar gak numpuk
        $rootOrder = $laporan->sections()->whereNull('parent_id')->max('order') + 1;
        $subOrder = 1;

        foreach ($body->childNodes as $node) {
            $textRaw = $node->textContent;
            $text = trim(preg_replace('/\s+/', ' ', str_replace("\xC2\xA0", ' ', $textRaw)));
            $nodeHtml = $node->ownerDocument->saveHTML($node);
            $tag = strtolower($node->nodeName);

            if (empty($text) && !in_array($tag, ['img', 'table', 'tr', 'td'])) continue;

            $isBold = false;
            if ($node->hasChildNodes()) {
                foreach ($node->childNodes as $child) {
                    if (in_array(strtolower($child->nodeName), ['b', 'strong'])) {
                        $isBold = true; break;
                    }
                }
            }

            $isRootTitle = ($tag === 'h1') || 
                           preg_match('/^(BAB\s+[0-9IVX]+|DAFTAR\s+[A-Z]+|LAMPIRAN\s+[A-Z]+)/i', $text) ||
                           ($isBold && strlen($text) < 100 && ctype_upper(str_replace([' ', '.', '-', ':'], '', $text)) && strlen($text) > 3);

            $isSubTitle = ($tag === 'h2' || $tag === 'h3') || preg_match('/^(\d+\.\d+|[A-Z]\.)\s+/i', $text);

            if ($isRootTitle) {
                $currentRoot = $this->createSection($laporan, $text, "", $rootOrder++, null);
                $subOrder = 1;
                $activeSection = $currentRoot;
            } elseif ($isSubTitle && $currentRoot) {
                $activeSection = $this->createSection($laporan, $text, "", $subOrder++, $currentRoot->id);
            } else {
                if ($activeSection) {
                    $activeSection->content .= $nodeHtml;
                    $activeSection->save();
                } else {
                    if (!empty($text) || $tag === 'img') {
                        $currentRoot = $this->createSection($laporan, "Cover / Intro", $nodeHtml, $rootOrder++, null);
                        $activeSection = $currentRoot;
                    }
                }
            }
        }
    }

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