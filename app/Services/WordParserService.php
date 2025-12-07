<?php

namespace App\Services;

use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\Element\TextRun;
use PhpOffice\PhpWord\Element\AbstractContainer;

class WordParserService
{
    /**
     * Parse DOCX file dan ekstrak struktur bab berdasarkan heading
     * Support nested structure: BAB (parent) dan SUB-BAB (child dengan parent_id)
     * 
     * @param string $filePath Path ke file DOCX
     * @return array Array of sections: [{ title: '...', content: '...', level: 1|2 }, ...]
     */
    public function parse(string $filePath): array
    {
        $phpWord = IOFactory::load($filePath);
        $sections = $phpWord->getSections();
        
        $result = [];
        $currentParent = null; // Track parent section untuk SUB-BAB
        $currentTitle = null;
        $currentContent = [];
        $currentLevel = 1;
        
        foreach ($sections as $section) {
            $elements = $section->getElements();
            
            foreach ($elements as $element) {
                // Deteksi heading berdasarkan style atau pola teks
                $text = $this->extractText($element);
                $headingInfo = $this->detectHeading($element, $text);
                
                if ($headingInfo['isHeading']) {
                    // Simpan section sebelumnya jika ada
                    if ($currentTitle !== null && !empty($currentContent)) {
                        $result[] = [
                            'title' => $currentTitle,
                            'content' => $this->convertToHtml($currentContent),
                            'level' => $currentLevel,
                            'parent_index' => $currentLevel === 2 ? $currentParent : null,
                        ];
                    }
                    
                    // Deteksi level heading (1 = BAB, 2 = SUB-BAB)
                    $newLevel = $headingInfo['level'];
                    
                    // Jika level 1 (BAB), reset parent
                    if ($newLevel === 1) {
                        $currentParent = count($result); // Index parent di result array
                    }
                    
                    // Mulai section baru
                    $currentTitle = $this->normalizeTitle($text);
                    $currentContent = [];
                    $currentLevel = $newLevel;
                } else {
                    // Tambahkan ke konten section saat ini
                    if (!empty(trim($text))) {
                        $currentContent[] = $text;
                    }
                }
            }
        }
        
        // Simpan section terakhir
        if ($currentTitle !== null && !empty($currentContent)) {
            $result[] = [
                'title' => $currentTitle,
                'content' => $this->convertToHtml($currentContent),
                'level' => $currentLevel,
                'parent_index' => $currentLevel === 2 ? $currentParent : null,
            ];
        }
        
        // Jika tidak ada heading terdeteksi, buat satu section dengan semua konten
        if (empty($result)) {
            $allText = [];
            foreach ($sections as $section) {
                $elements = $section->getElements();
                foreach ($elements as $element) {
                    $text = $this->extractText($element);
                    if (!empty(trim($text))) {
                        $allText[] = $text;
                    }
                }
            }
            
            if (!empty($allText)) {
                $result[] = [
                    'title' => 'Konten Template',
                    'content' => $this->convertToHtml($allText),
                    'level' => 1,
                    'parent_index' => null,
                ];
            }
        }
        
        return $result;
    }
    
    /**
     * Ekstrak teks dari elemen PhpWord
     */
    private function extractText($element): string
    {
        if ($element instanceof Text) {
            return $element->getText();
        }
        
        if ($element instanceof TextRun) {
            $text = '';
            foreach ($element->getElements() as $subElement) {
                if ($subElement instanceof Text) {
                    $text .= $subElement->getText();
                }
            }
            return $text;
        }
        
        if (method_exists($element, 'getText')) {
            return $element->getText();
        }
        
        if ($element instanceof AbstractContainer) {
            $text = '';
            foreach ($element->getElements() as $subElement) {
                $text .= $this->extractText($subElement);
            }
            return $text;
        }
        
        return '';
    }
    
    /**
     * Deteksi apakah elemen adalah heading dan levelnya
     * Cek berdasarkan Style Heading atau pola "BAB [Angka]"
     * 
     * @return array ['isHeading' => bool, 'level' => 1|2]
     */
    private function detectHeading($element, string $text): array
    {
        $text = trim($text);
        if (empty($text)) {
            return ['isHeading' => false, 'level' => 1];
        }
        
        $level = 1; // Default level 1 (BAB)
        
        // Cek style heading (H1, H2, Heading 1, Heading 2, dll)
        if (method_exists($element, 'getStyle')) {
            $style = $element->getStyle();
            if (is_string($style)) {
                $styleLower = strtolower($style);
                // Deteksi level dari style name
                if (preg_match('/h([1-6])|heading\s*([1-6])/i', $styleLower, $matches)) {
                    $detectedLevel = isset($matches[1]) ? (int)$matches[1] : (int)$matches[2];
                    $level = $detectedLevel <= 2 ? $detectedLevel : 2; // Max level 2 untuk SUB-BAB
                    return ['isHeading' => true, 'level' => $level];
                }
                if (strpos($styleLower, 'heading') !== false) {
                    // Jika hanya "heading" tanpa angka, default level 1
                    return ['isHeading' => true, 'level' => 1];
                }
            }
        }
        
        $textUpper = strtoupper($text);
        
        // Pola: BAB I, BAB II, BAB 1, BAB 2, dll (Level 1)
        if (preg_match('/^BAB\s+([IVX]+|\d+)/i', $textUpper)) {
            return ['isHeading' => true, 'level' => 1];
        }
        
        // Pola: BAB I PENDAHULUAN, BAB II TINJAUAN, dll (Level 1)
        if (preg_match('/^BAB\s+([IVX]+|\d+)\s+[A-Z]/i', $textUpper)) {
            return ['isHeading' => true, 'level' => 1];
        }
        
        // Kata kunci heading umum (Level 1)
        $headingKeywords = [
            'DAFTAR PUSTAKA',
            'DAFTAR ISI',
            'LAMPIRAN',
            'PENDAHULUAN',
            'KESIMPULAN',
            'RINGKASAN',
            'ABSTRAK',
        ];
        
        foreach ($headingKeywords as $keyword) {
            if (strpos($textUpper, $keyword) === 0) {
                if (strlen($text) < 200) {
                    return ['isHeading' => true, 'level' => 1];
                }
            }
        }
        
        // Cek format angka romawi atau angka biasa di awal (I. JUDUL, 1. JUDUL)
        // Jika format seperti "1.1", "1.2" atau "I.1", "I.2" -> Level 2 (SUB-BAB)
        if (preg_match('/^([IVX]+|\d+)\.([IVX]+|\d+)\s+[A-Z]/u', $textUpper)) {
            if (strlen($text) < 150) {
                return ['isHeading' => true, 'level' => 2];
            }
        }
        
        // Format "1. JUDUL" atau "I. JUDUL" -> Level 1 (BAB)
        if (preg_match('/^(I|II|III|IV|V|VI|VII|VIII|IX|X|1|2|3|4|5|6|7|8|9|10)\.\s+[A-Z]/u', $textUpper)) {
            if (strlen($text) < 150) {
                return ['isHeading' => true, 'level' => 1];
            }
        }
        
        return ['isHeading' => false, 'level' => 1];
    }
    
    /**
     * Normalisasi judul heading
     */
    private function normalizeTitle(string $text): string
    {
        $text = trim($text);
        
        // Hapus karakter aneh di awal/akhir
        $text = preg_replace('/^[^\w]+|[^\w]+$/u', '', $text);
        
        // Pastikan uppercase untuk BAB
        if (preg_match('/^BAB\s+/i', $text)) {
            $text = strtoupper($text);
        }
        
        return $text;
    }
    
    /**
     * Konversi array teks ke HTML
     */
    private function convertToHtml(array $texts): string
    {
        $html = '';
        foreach ($texts as $text) {
            $text = htmlspecialchars(trim($text), ENT_QUOTES, 'UTF-8');
            if (!empty($text)) {
                $html .= '<p>' . $text . '</p>';
            }
        }
        return $html;
    }
}

