<?php

namespace App\Services;

use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\Element\TextRun;
use PhpOffice\PhpWord\Element\AbstractElement;

class TemplateParserService
{
    /**
     * Parse DOCX file dan ekstrak struktur bab berdasarkan heading
     * 
     * @param string $filePath Path ke file DOCX
     * @return array Array of sections: [{ title: '...', content: '...' }, ...]
     */
    public function parse(string $filePath): array
    {
        $phpWord = IOFactory::load($filePath);
        $sections = $phpWord->getSections();
        
        $result = [];
        $currentTitle = null;
        $currentContent = [];
        
        foreach ($sections as $section) {
            $elements = $section->getElements();
            
            foreach ($elements as $element) {
                // Deteksi heading (H1, H2) atau teks yang mengandung kata kunci
                $text = $this->extractText($element);
                $isHeading = $this->isHeading($element, $text);
                
                if ($isHeading) {
                    // Simpan section sebelumnya jika ada
                    if ($currentTitle !== null && !empty($currentContent)) {
                        $result[] = [
                            'title' => $currentTitle,
                            'content' => $this->convertToHtml($currentContent),
                        ];
                    }
                    
                    // Mulai section baru
                    $currentTitle = $this->normalizeTitle($text);
                    $currentContent = [];
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
        
        if (method_exists($element, 'getElements')) {
            $text = '';
            foreach ($element->getElements() as $subElement) {
                $text .= $this->extractText($subElement);
            }
            return $text;
        }
        
        return '';
    }
    
    /**
     * Deteksi apakah elemen adalah heading
     */
    private function isHeading($element, string $text): bool
    {
        // Cek style heading
        if (method_exists($element, 'getStyle')) {
            $style = $element->getStyle();
            if (is_string($style) && (strpos($style, 'Heading') !== false || strpos($style, 'heading') !== false)) {
                return true;
            }
        }
        
        // Cek apakah teks mengandung kata kunci heading
        $textUpper = strtoupper(trim($text));
        $headingKeywords = [
            'BAB I', 'BAB II', 'BAB III', 'BAB IV', 'BAB V', 'BAB VI', 'BAB VII', 'BAB VIII', 'BAB IX', 'BAB X',
            'BAB 1', 'BAB 2', 'BAB 3', 'BAB 4', 'BAB 5',
            'DAFTAR PUSTAKA',
            'DAFTAR ISI',
            'LAMPIRAN',
            'PENDAHULUAN',
            'KESIMPULAN',
        ];
        
        foreach ($headingKeywords as $keyword) {
            if (strpos($textUpper, $keyword) === 0 || strpos($textUpper, $keyword) !== false) {
                // Pastikan bukan bagian dari paragraf panjang
                if (strlen($text) < 200) {
                    return true;
                }
            }
        }
        
        // Cek format angka romawi atau angka biasa di awal
        if (preg_match('/^(I|II|III|IV|V|VI|VII|VIII|IX|X|1|2|3|4|5|6|7|8|9|10)\.?\s+[A-Z]/u', $textUpper)) {
            return true;
        }
        
        return false;
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
        if (stripos($text, 'BAB') === 0) {
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

