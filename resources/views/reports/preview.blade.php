<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    {{-- Tambahkan meta http-equiv untuk Dompdf membaca UTF-8 dengan benar --}}
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Preview Laporan</title>
    <style>
        /* * Style dasar untuk PDF (Dompdf) dan Preview HTML.
         */
        @page {
            /* Set margin halaman PDF: Atas 3, Kanan 3, Bawah 3, Kiri 4 (sesuai standar umum) */
            margin: 3cm 3cm 3cm 4cm;
        }

        body {
            font-family: 'Times New Roman', Times, serif; /* Font utama */
            font-size: 12pt;
            line-height: 1.5; /* Spasi 1.5 */
            /* Background hanya untuk preview browser */
            background-color: #e9e9e9;
            margin: 0;
            padding: 0;
        }

        /* --- PERBAIKAN: Hapus .page-container, styling langsung ke body/page --- */

        /* Style dasar halaman */
        .page {
            width: 100%;
            min-height: calc(29.7cm - 6cm); /* Estimasi tinggi bersih A4 */
            background: white;
            box-sizing: border-box;
            /* Page break SEBELUM setiap halaman, kecuali halaman pertama */
            page-break-before: always;
            /* Hilangkan shadow & margin bawah untuk PDF, hanya perlu di browser */
            /* box-shadow: 0 0 15px rgba(0,0,0,0.2); */
            /* margin: 0 auto 2rem; */
        }

        /* Halaman pertama tidak perlu page break */
        .page:first-child {
            page-break-before: auto;
        }

        /* --- PERBAIKAN: Footer untuk Nomor Halaman --- */
        #footer {
            position: fixed;
            bottom: -2.5cm; /* Sesuaikan agar pas di bawah margin */
            left: 0cm;
            right: 0cm;
            height: 2cm;
            text-align: center;
            font-size: 10pt; /* Ukuran font lebih kecil */
            color: #555; /* Warna abu-abu */
        }
        /* Script untuk nomor halaman (Dompdf akan proses ini) */
        #footer .page-number:after {
            content: counter(page); /* Tampilkan nomor halaman */
        }


        /* --- Cover Specific Styles --- */
        .cover {
            text-align: center;
            display: flex;
            flex-direction: column;
            height: calc(29.7cm - 6cm); /* Tinggi bersih halaman cover */
            /* Hapus padding, diatur oleh @page */
        }

        .cover h1.judul {
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 0;
            margin-bottom: 1em;
            line-height: 1.3;
        }

        .cover .jenis-laporan {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 2em;
        }

        .cover .logo-container {
             margin: 2cm auto;
        }
        .cover .logo-img {
            max-width: 100px;
            max-height: 100px;
            object-fit: contain;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .cover .logo-placeholder {
            width: 85px;
            height: 85px;
            border: 2px dashed #ccc;
            display: flex; /* Pakai flex biar text NO LOGO ditengah */
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            color: #aaa;
            font-size: 10pt;
            font-family: Arial, sans-serif;
        }

        .cover .penyusun-dosen {
            margin-top: 2cm;
            margin-bottom: auto; /* Mendorong ke bawah */
            line-height: 1.5;
        }
        .cover .penyusun-dosen p {
             margin: 0.3em 0;
        }

        /* PERBAIKAN SPASI COVER BAWAH */
        .cover .cover-bottom {
            margin-top: auto; /* Otomatis menempel ke bawah */
            padding-top: 2cm; /* Jarak dari atasnya */
            padding-bottom: 0; /* Pastikan tidak ada padding bawah */
        }
        .cover .cover-bottom p {
            font-weight: bold;
            text-transform: uppercase;
            margin: 0.2em 0; /* Jarak antar baris institusi */
            font-size: 12pt;
        }
        /* Hapus margin bawah paragraf terakhir (tahun ajaran) */
        .cover .cover-bottom p:last-child {
             margin-bottom: 0;
        }


        /* --- Table of Contents (ToC) Styles --- */
        .page-toc h2 {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            margin-top: 0;
            margin-bottom: 2rem;
            page-break-after: avoid; /* Jangan pisah judul ToC dari isinya */
        }
        ul.daftar-isi {
            list-style-type: none;
            padding-left: 0;
            margin-top: 2rem;
            font-size: 12pt;
        }
        .daftar-isi li {
            margin-bottom: 0.8em;
            /* Coba hapus flex jika alignment titik-titik bermasalah di PDF */
            /* display: flex;
            justify-content: space-between;
            align-items: baseline; */
        }
        .daftar-isi li a { /* Meskipun link tidak aktif di PDF, tetap style */
            text-decoration: none;
            color: #000;
        }
        /* Nomor halaman palsu (tidak bisa otomatis) */
        .daftar-isi li .page-number {
             float: right; /* Coba float ke kanan */
             padding-left: 5px;
        }


        /* --- Content Page Styles --- */
        .page-content {
            text-align: justify;
        }
        .page-content h2 {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            margin-top: 1.5rem; /* Beri jarak atas dari konten sebelumnya jika ada */
            margin-bottom: 1rem;
            page-break-after: avoid; /* Judul bab jangan dipisah dari paragraf pertama */
            page-break-before: auto; /* Bisa pecah halaman sebelum judul bab jika perlu */
        }

        /* Style dasar untuk konten dari Tiptap */
        .tiptap-content p {
            margin-top: 0;
            margin-bottom: 1em;
            text-align: justify;
            line-height: 1.5;
            /* Hindari paragraf pertama kosong setelah judul */
            orphans: 3; widows: 3; /* Minimal 3 baris di awal/akhir halaman */
        }
        .tiptap-content ul,
        .tiptap-content ol {
            padding-left: 1.5em;
            margin-bottom: 1em;
            text-align: justify; /* List juga rata kiri-kanan */
            page-break-inside: avoid; /* Usahakan list tidak terpotong antar halaman */
        }
        .tiptap-content li {
             margin-bottom: 0.5em;
        }
        .tiptap-content li > p {
             margin-bottom: 0;
        }
        .tiptap-content blockquote {
            border-left: 3px solid #ccc;
            padding-left: 1em;
            margin-left: 0;
            margin-bottom: 1em;
            font-style: italic;
            color: #555;
            page-break-inside: avoid;
        }
        .tiptap-content code { /* Inline code */
            background: #f1f1f1;
            padding: 0.2em 0.4em;
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 11pt; /* Sedikit lebih kecil */
        }
        .tiptap-content pre { /* Code block */
            background: #f1f1f1; /* Buat terang agar mudah dibaca di PDF */
            color: #333;
            padding: 1em;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-bottom: 1em;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', Courier, monospace;
            font-size: 10pt;
            page-break-inside: avoid;
        }
        .tiptap-content hr {
            border: 0;
            border-top: 1px solid #ccc;
            margin: 1.5em 0;
            page-break-after: always; /* Garis horizontal bisa jadi pemisah halaman */
        }
        .tiptap-content a {
            color: blue; /* Warna link */
            text-decoration: none; /* Hapus underline default PDF */
        }
        /* PERBAIKAN: Sembunyikan link DOI duplikat */
        .tiptap-content span > a[href^="https://doi.org"] {
            /* Jika link DOI ada di dalam span setelah teks judul, sembunyikan */
            /* Ini asumsi struktur HTML dari Tiptap/Daftar Pustaka */
            /* display: none; */ /* Hati-hati, mungkin menyembunyikan yg benar */
        }
        /* Coba style URL lebih eksplisit */
        .tiptap-content a[href^="https://doi.org"]:after,
        .tiptap-content a[href^="http"]:after {
            /* content: " (" attr(href) ")"; */ /* Nonaktifkan sementara, mungkin ini yg bikin kacau */
            /* font-size: 9pt; */
            /* color: #555; */
        }


        /* Style untuk browser saja */
        @media screen {
            body {
                padding: 2rem; /* Jarak dari ujung browser */
            }
            .page {
                box-shadow: 0 0 15px rgba(0,0,0,0.2);
                margin: 0 auto 2rem;
                /* Beri padding di browser karena @page tidak berlaku */
                padding: 3cm 3cm 3cm 4cm;
            }
        }

    </style>
</head>
<body>
    @php
        // --- (Blok PHP ini tidak berubah) ---
        $isDbPreview = isset($laporan) && $laporan instanceof \App\Models\Laporan;
        $isLivePreview = !$isDbPreview;

        $theJudul = $isDbPreview ? $laporan->judul : ($judul ?? 'JUDUL BELUM DIISI');
        $theReportType = $isDbPreview ? $laporan->report_type : ($report_type ?? 'JENIS LAPORAN');
        $theNama = $isDbPreview ? $laporan->nama : ($nama ?? 'Nama Penulis');
        $theNim = $isDbPreview ? $laporan->nim : ($nim ?? 'NIM');
        $theDosen = $isDbPreview ? $laporan->dosen_pembimbing : ($dosen_pembimbing ?? 'Nama Dosen');
        $theProdi = $isDbPreview ? $laporan->prodi : ($prodi ?? 'Program Studi');
        $theInstansi = $isDbPreview ? $laporan->instansi : ($instansi ?? 'Nama Institusi');
        $theKota = $isDbPreview ? $laporan->kota : ($kota ?? 'Kota');
        $theTahun = $isDbPreview ? $laporan->tahun_ajaran : ($tahun_ajaran ?? 'Tahun Ajaran');

        $logoSrc = null;
        if ($isDbPreview && !empty($laporan->logo_path) && Storage::disk('public')->exists($laporan->logo_path)) {
            try {
                 $logoFullPath = Storage::disk('public')->path($laporan->logo_path);
                 $logoData = base64_encode(file_get_contents($logoFullPath));
                 $mime = mime_content_type($logoFullPath);
                 $logoSrc = 'data:' . $mime . ';base64,' . $logoData;
            } catch (\Exception $e) { $logoSrc = null; }
        } elseif ($isLivePreview && isset($base64Logo) && !empty($base64Logo)) {
            $logoSrc = $base64Logo;
        }
    @endphp

    {{-- PERBAIKAN: Tambahkan div footer untuk nomor halaman --}}
    <div id="footer">
        <p class="page-number"></p>
    </div>

    {{-- Hapus .page-container --}}

    {{-- ======================== --}}
    {{-- Halaman 1: Cover --}}
    {{-- ======================== --}}
    <div class="page"> {{-- Halaman pertama tidak pakai class page-break --}}
        <div class="cover">

            <h1 class="judul">{{ strtoupper(htmlspecialchars($theJudul)) }}</h1>

            <p class="jenis-laporan">{{ strtoupper(htmlspecialchars($theReportType)) }}</p>

            <div class="logo-container">
                @if($logoSrc)
                    <img src="{{ $logoSrc }}" alt="Logo Institusi" class="logo-img">
                @else
                    <div class="logo-placeholder">LOGO</div>
                @endif
            </div>

            <div class="penyusun-dosen">
                <p>Disusun Oleh:</p>
                <p style="font-weight: bold;">{{ htmlspecialchars($theNama) }} ({{ htmlspecialchars($theNim) }})</p>

                <p style="margin-top: 2cm;">Dosen Pengampu:</p>
                <p style="font-weight: bold;">{{ htmlspecialchars($theDosen) }}</p>
            </div>

            <div class="cover-bottom">
                <p>{{ strtoupper(htmlspecialchars($theProdi)) }}</p>
                <p>{{ strtoupper(htmlspecialchars($theInstansi)) }}</p>
                <p>{{ strtoupper(htmlspecialchars($theKota)) }}</p>
                <p>{{ htmlspecialchars($theTahun) }}</p> {{-- Margin bawah paragraf ini sudah dihapus di CSS --}}
            </div>

        </div>
    </div>

    {{-- ======================== --}}
    {{-- Halaman 2: Daftar Isi --}}
    {{-- ======================== --}}
    @if($isDbPreview && isset($laporan->sections) && $laporan->sections->isNotEmpty())
        <div class="page page-toc">
            <h2>DAFTAR ISI</h2>

            <ul class="daftar-isi">
                @foreach($laporan->sections as $section)
                    <li>
                        <span>{{ strtoupper(htmlspecialchars($section->title)) }}</span>
                        {{-- Nomor halaman palsu/kosong --}}
                         <span class="page-number"></span>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif


    {{-- ======================== --}}
    {{-- Halaman 3...N: Konten Bab --}}
    {{-- ======================== --}}
    @if($isDbPreview && isset($laporan->sections) && $laporan->sections->isNotEmpty())
        @foreach($laporan->sections as $section)
            <div class="page page-content">

                <h2 id="section-{{ $section->id }}">
                    {{ strtoupper(htmlspecialchars($section->title)) }}
                </h2>

                <div class="tiptap-content">
                    {!! $section->content !!}
                </div>

            </div>
        @endforeach
    @endif

</body>
</html>