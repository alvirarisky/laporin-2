<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $judul ?? 'Laporan' }}</title>

    {{-- LOGIC CSS: INJEKSI (PDF) VS VITE (BROWSER) --}}
    @if(isset($css_inline) && !empty($css_inline))
        {{-- Mode PDF: CSS ditulis mentah di sini biar Browsershot gampang bacanya --}}
        <style>
            {!! $css_inline !!}
        </style>
    @else
        {{-- Mode Browser: Pake Vite biar bisa development enak --}}
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        {{-- Fallback CDN kalau Vite belum build (optional) --}}
        <script src="https://cdn.tailwindcss.com"></script>
    @endif

    <style>
        /* --- SETUP KERTAS --- */
        @page {
            size: A4 portrait;
            margin: 2.5cm 2.5cm 2.5cm 3cm; /* Atas Kanan Bawah Kiri (Standar Skripsi: 4-3-3-4 atau 3-2.5-2.5-3) */
        }
        
        /* Hapus Header/Footer Browser bawaan (Double Kill sama Controller tadi) */
        @media print {
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
            }
        }

        /* --- TYPOGRAPHY --- */
        body {
            font-family: 'Times New Roman', Times, serif; /* Wajib Times New Roman */
            font-size: 12pt;
            line-height: 1.5; /* Spasi 1.5 */
            color: #000;
            background: white; /* Pastikan background putih */
        }

        /* Helpers Page Break */
        .page-break { page-break-after: always; }
        .page-break-before { page-break-before: always; }
        .avoid-break { page-break-inside: avoid; }

        /* --- TIPTAP CONTENT STYLING --- */
        /* Kita benerin style HTML dari editor biar rapi di PDF */
        .tiptap-content { text-align: justify; }
        .tiptap-content p { margin-bottom: 1em; text-indent: 0; /* Ubah ke 2em kalau mau menjorok */ }
        
        .tiptap-content ul { list-style-type: disc; margin-left: 1.5em; margin-bottom: 1em; }
        .tiptap-content ol { list-style-type: decimal; margin-left: 1.5em; margin-bottom: 1em; }
        
        .tiptap-content h1, .tiptap-content h2, .tiptap-content h3 {
            font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; color: black;
        }

        .tiptap-content img {
            max-width: 100%; height: auto; display: block; margin: 1.5em auto;
        }
        
        .tiptap-content figure { text-align: center; margin: 1em 0; page-break-inside: avoid; }
        .tiptap-content figcaption { font-size: 10pt; font-style: italic; margin-top: 5px; color: #444; }

        /* Table Styling (kalau user masukin tabel) */
        .tiptap-content table {
            width: 100%; border-collapse: collapse; margin-bottom: 1em;
        }
        .tiptap-content th, .tiptap-content td {
            border: 1px solid black; padding: 6px; text-align: left; vertical-align: top;
        }
    </style>
</head>
<body class="bg-white text-black antialiased">

    @php
        // LOGIC DATA PREPARATION (Biar Rapi)
        $isDbPreview = isset($laporan) && $laporan instanceof \App\Models\Laporan;
        
        // Data Fallback
        $d = [
            'judul' => $isDbPreview ? $laporan->judul : ($judul ?? 'JUDUL LAPORAN'),
            'type'  => $isDbPreview ? $laporan->report_type : ($report_type ?? 'JENIS LAPORAN'),
            'nama'  => $isDbPreview ? $laporan->nama : ($nama ?? 'Nama Penulis'),
            'nim'   => $isDbPreview ? $laporan->nim : ($nim ?? 'NIM'),
            'dosen' => $isDbPreview ? $laporan->dosen_pembimbing : ($dosen_pembimbing ?? 'Nama Dosen'),
            'prodi' => $isDbPreview ? $laporan->prodi : ($prodi ?? 'Program Studi'),
            'instansi' => $isDbPreview ? $laporan->instansi : ($instansi ?? 'Nama Institusi'),
            'kota'  => $isDbPreview ? $laporan->kota : ($kota ?? 'Kota'),
            'tahun' => $isDbPreview ? $laporan->tahun_ajaran : ($tahun_ajaran ?? 'Tahun'),
        ];

        // LOGIC GAMBAR LOGO (Base64 is King for PDF)
        $logoSrc = null;
        if ($isDbPreview && $laporan->logo_path) {
            // Cek path storage
            $path = storage_path('app/public/' . $laporan->logo_path);
            if (file_exists($path)) {
                $type = pathinfo($path, PATHINFO_EXTENSION);
                $data = file_get_contents($path);
                $logoSrc = 'data:image/' . $type . ';base64,' . base64_encode($data);
            }
        } elseif (isset($base64Logo)) {
            $logoSrc = $base64Logo; // Dari Live Preview
        }
    @endphp

    {{-- ================= HALAMAN 1: COVER ================= --}}
    <div class="page-break w-full h-[1000px] flex flex-col justify-between items-center text-center py-10">
        
        {{-- Bagian Atas --}}
        <div class="w-full">
            <h2 class="text-xl font-bold uppercase tracking-wide mb-2">{{ $d['type'] }}</h2>
            <div class="w-full h-1 bg-black mb-8 hidden"></div> {{-- Garis opsional --}}
            
            <h1 class="text-2xl font-bold uppercase leading-relaxed max-w-2xl mx-auto">
                {{ $d['judul'] }}
            </h1>

            <p class="mt-6 text-lg">Diajukan untuk memenuhi tugas mata kuliah:<br/>
                <span class="font-bold">{{ $d['dosen'] }}</span> </p>
        </div>

        {{-- Bagian Tengah (Logo) --}}
        <div class="flex-1 flex items-center justify-center py-8">
            @if($logoSrc)
                <img src="{{ $logoSrc }}" alt="Logo" class="w-48 h-auto object-contain">
            @else
                <div class="w-40 h-40 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400">
                    NO LOGO
                </div>
            @endif
        </div>

        {{-- Bagian Bawah --}}
        <div class="w-full space-y-10">
            <div>
                <p class="text-lg">Disusun Oleh:</p>
                <p class="text-xl font-bold uppercase mt-1">{{ $d['nama'] }}</p>
                <p class="text-lg">NIM. {{ $d['nim'] }}</p>
            </div>

            <div class="text-lg font-bold uppercase leading-tight">
                <p>{{ $d['prodi'] }}</p>
                <p>{{ $d['instansi'] }}</p>
                <p>{{ $d['kota'] }}</p>
                <p>{{ $d['tahun'] }}</p>
            </div>
        </div>
    </div>

    {{-- ================= HALAMAN 2: DAFTAR ISI ================= --}}
    @if($isDbPreview && $laporan->sections->isNotEmpty())
        <div class="page-break pt-4">
            <h2 class="text-xl font-bold text-center uppercase mb-8">DAFTAR ISI</h2>
            
            <div class="w-full max-w-3xl mx-auto space-y-1 font-serif">
                @foreach($laporan->sections->whereNull('parent_id')->sortBy('order') as $main)
                    {{-- Bab Utama --}}
                    <div class="flex justify-between items-end border-b border-dotted border-gray-400 pb-1">
                        <span class="font-bold uppercase">{{ $loop->iteration }}. {{ $main->title }}</span>
                        <span></span> {{-- Halaman otomatis susah di HTML to PDF basic, biarin kosong atau titik --}}
                    </div>

                    {{-- Sub Bab --}}
                    @foreach($laporan->sections->where('parent_id', $main->id)->sortBy('order') as $sub)
                        <div class="flex justify-between items-end border-b border-dotted border-gray-300 pb-1 pl-6 text-sm">
                            <span>{{ $loop->parent->iteration }}.{{ $loop->iteration }} {{ $sub->title }}</span>
                            <span></span>
                        </div>
                    @endforeach
                    
                    <div class="mb-2"></div> {{-- Spacer antar bab --}}
                @endforeach
            </div>
        </div>
    @endif

    {{-- ================= HALAMAN 3 dst: KONTEN ================= --}}
    @if($isDbPreview && $laporan->sections->isNotEmpty())
        @foreach($laporan->sections->whereNull('parent_id')->sortBy('order') as $main)
            
            {{-- JUDUL BAB (Page Break Sebelumnya) --}}
            <div class="page-break-before pt-4">
                <h2 class="text-xl font-bold text-center uppercase mb-8" id="sec-{{$main->id}}">
                    {{ $main->title }}
                    {{-- Hapus nomor otomatis di sini kalau judul bab di DB udah pake "BAB I ..." --}}
                </h2>

                {{-- KONTEN BAB UTAMA --}}
                <div class="tiptap-content">
                    {!! $main->content !!}
                </div>
            </div>

            {{-- SUB BAB (Langsung di bawahnya, gak perlu page break kecuali panjang) --}}
            @foreach($laporan->sections->where('parent_id', $main->id)->sortBy('order') as $sub)
                <div class="pt-6 avoid-break" id="sec-{{$sub->id}}">
                    <h3 class="text-lg font-bold uppercase mb-4">
                        {{-- Logic Nomor Sub Bab (1.1, 1.2) --}}
                        {{ $loop->parent->iteration }}.{{ $loop->iteration }} {{ $sub->title }}
                    </h3>
                    <div class="tiptap-content">
                        {!! $sub->content !!}
                    </div>
                </div>
            @endforeach

        @endforeach
    @endif

</body>
</html>