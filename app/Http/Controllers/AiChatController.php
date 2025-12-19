<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiChatController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string']);
        
        $apiKey = env('GROQ_API_KEY'); 
        
        if (!$apiKey) {
            return response()->json(['reply' => 'Error: GROQ_API_KEY belum dipasang di .env']);
        }

        // Endpoint Groq
        $apiUrl = "https://api.groq.com/openai/v1/chat/completions";

        // [UPDATE] Model Terbaru & Stabil (Llama 3.3)
        // Alternatif jika ini nanti berubah lagi: 'llama-3.1-8b-instant' (Lebih cepat)
        $model = "llama-3.3-70b-versatile";

        // System Instruction (Otak LaporBot)
        $systemPrompt = "
        Kamu adalah 'LaporBot', asisten AI untuk mahasiswa IT di aplikasi 'Lapor.in'.
        
        ATURAN JAWABAN:
        1. Gunakan Bahasa Indonesia yang santai tapi akademis (seperti senior membimbing junior).
        2. WAJIB gunakan format Markdown:
           - Gunakan **Bold** untuk poin penting.
           - Gunakan Bullet points (-) untuk langkah-langkah.
           - Gunakan `Code Block` untuk contoh kodingan.
        3. Jawab dengan ringkas, padat, dan jelas. Jangan bertele-tele.
        
        TUGAS: 
        - Membantu menyusun kalimat laporan/skripsi/makalah.
        - Menjawab pertanyaan coding (Laravel/React/SQL).
        - Jika ditanya hal di luar topik kuliah (misal: curhat, politik), tolak dengan candaan sopan.
        ";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ])->post($apiUrl, [
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $request->message],
                ],
                'temperature' => 0.7, 
                'max_tokens' => 1024,
            ]);

            $data = $response->json();

            // Cek Error dari API Groq
            if (isset($data['error'])) {
                Log::error('Groq API Error: ' . json_encode($data['error']));
                return response()->json(['reply' => "Gagal: " . $data['error']['message']]);
            }

            // Ambil jawaban
            $reply = $data['choices'][0]['message']['content'] ?? 'AI diam saja (No response).';
            
            return response()->json(['reply' => $reply]);

        } catch (\Exception $e) {
            Log::error('Server Error: ' . $e->getMessage());
            return response()->json(['reply' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }
}