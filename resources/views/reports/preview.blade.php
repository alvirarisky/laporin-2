<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $judul ?? 'Laporan' }}</title>

    {{-- VITE / CSS --}}
    @if(isset($css_inline) && !empty($css_inline))
        <style> {!! $css_inline !!} </style>
    @else
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <script src="https://cdn.tailwindcss.com"></script>
    @endif

    <style>
        /* --- GLOBAL RESET --- */
        * { box-sizing: border-box; }
        
        /* --- LOGIKA TAMPILAN KERTAS (PENTING!) --- */
        
        /* 1. Default Style (Base Typography) */
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            -webkit-font-smoothing: antialiased;
        }

        /* 2. MODE LAYAR (PREVIEW DI BROWSER) 
           Disini kita "memaksa" tampilan agar fix A4 */
        @media screen {
            body {
                background-color: #525659; /* Background abu gelap ala PDF Viewer */
                margin: 0;
                padding: 40px 0; /* Jarak atas bawah biar kertas gak nempel tepi layar */
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .paper-sheet {
                background-color: white;
                width: 210mm;       /* Lebar Fix A4 */
                min-height: 297mm;  /* Tinggi Min A4 */
                padding: 2.5cm 2.5cm 2.5cm 3cm; /* Margin: Atas Kanan Bawah Kiri */
                margin-bottom: 30px; /* Jarak antar halaman jika ada banyak */
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Efek bayangan kertas */
                position: relative;
            }
        }

        /* 3. MODE CETAK / PDF (BROWSERSHOT)
           Disini kita kembalikan ke native paper handling */
        @media print {
            @page {
                size: A4 portrait;
                margin: 2.5cm 2.5cm 2.5cm 3cm; /* Margin Kertas Fisik */
            }

            body {
                background-color: white;
                margin: 0;
                padding: 0;
            }

            .paper-sheet {
                width: 100%;    /* Ikuti area cetak */
                margin: 0;
                padding: 0;     /* Padding 0 karena margin sudah dihandle @page */
                box-shadow: none;
                background-color: transparent;
            }

            /* Hilangkan elemen browser saat print manual */
            .no-print { display: none !important; }
        }

        /* --- UTILITIES --- */
        .page-break { page-break-after: always; }
        .page-break-before { page-break-before: always; }
        .avoid-break { page-break-inside: avoid; }
        
        /* Tiptap Content Styling (Sama seperti sebelumnya) */
        .tiptap-content { text-align: justify; width: 100%; overflow-wrap: break-word; }
        .tiptap-content p { margin-bottom: 1em; text-indent: 0; margin-top: 0; }
        .tiptap-content ul, .tiptap-content ol { margin-top: 0; margin-bottom: 1em; padding-left: 1.5em; }
        .tiptap-content li { margin-bottom: 0.2em; padding-left: 0.5em; }
        .tiptap-content h1, .tiptap-content h2, .tiptap-content h3 { font-weight: bold; color: black; page-break-after: avoid; }
        .tiptap-content h1 { font-size: 14pt; margin-top: 1em; text-align: center; text-transform: uppercase; }
        .tiptap-content h2 { font-size: 13pt; margin-top: 1em; }
        .tiptap-content h3 { font-size: 12pt; margin-top: 1em; }
        .tiptap-content img { max-width: 100% !important; height: auto !important; display: block; margin: 1.5em auto; }
        .tiptap-content table { width: 100%; border-collapse: collapse; margin-bottom: 1em; font-size: 11pt; }
        .tiptap-content th, .tiptap-content td { border: 1px solid black; padding: 6px 8px; text-align: left; vertical-align: top; }
        .tiptap-content th { font-weight: bold; text-align: center; background-color: #f3f3f3; }
    </style>
</head>
<body>

    @php
        $isDbPreview = isset($laporan) && $laporan instanceof \App\Models\Laporan;
        
        $d = [
            'judul' => $isDbPreview ? $laporan->judul : ($judul ?? 'JUDUL LAPORAN'),
            'type'  => $isDbPreview ? $laporan->report_type : ($report_type ?? 'MAKALAH'),
            'nama'  => $isDbPreview ? $laporan->nama : ($nama ?? 'Nama Penulis'),
            'nim'   => $isDbPreview ? $laporan->nim : ($nim ?? 'NIM'),
            'dosen' => $isDbPreview ? $laporan->dosen_pembimbing : ($dosen_pembimbing ?? 'Nama Dosen'),
            'prodi' => $isDbPreview ? $laporan->prodi : ($prodi ?? 'Program Studi'),
            'instansi' => $isDbPreview ? $laporan->instansi : ($instansi ?? 'Nama Institusi'),
            'kota'  => $isDbPreview ? $laporan->kota : ($kota ?? 'Kota'),
            'tahun' => $isDbPreview ? $laporan->tahun_ajaran : ($tahun_ajaran ?? 'Tahun'),
        ];

        $logoSrc = null;
        if ($isDbPreview && $laporan->logo_path) {
            $path = storage_path('app/public/' . $laporan->logo_path);
            if (file_exists($path)) {
                $type = pathinfo($path, PATHINFO_EXTENSION);
                $data = file_get_contents($path);
                $logoSrc = 'data:image/' . $type . ';base64,' . base64_encode($data);
            }
        } elseif (isset($base64Logo)) {
            $logoSrc = $base64Logo; 
        }
    @endphp

    <div class="paper-sheet">
        
        {{-- ================= HALAMAN 1: COVER ================= --}}
        <div class="page-break flex flex-col justify-between items-center text-center h-full min-h-[23cm]">
            
            {{-- Header Cover --}}
            <div class="w-full pt-6">
                <h2 class="text-xl font-bold uppercase tracking-widest mb-4">{{ $d['type'] }}</h2>
                <h1 class="text-2xl font-bold uppercase leading-relaxed max-w-[90%] mx-auto">
                    {{ $d['judul'] }}
                </h1>
                <p class="mt-8 text-lg">Diajukan untuk memenuhi tugas mata kuliah:<br/>
                    <span class="font-bold">{{ $d['dosen'] }}</span>
                </p>
            </div>

            {{-- Logo --}}
            <div class="flex-1 flex items-center justify-center my-6">
                @if($logoSrc)
                    <img src="{{ $logoSrc }}" alt="Logo" class="w-48 h-auto object-contain">
                @else
                    <div class="w-40 h-40 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 rounded-full text-xs">
                        LOGO
                    </div>
                @endif
            </div>

            {{-- Footer Cover --}}
            <div class="w-full pb-6 space-y-8">
                <div>
                    <p class="text-lg">Disusun Oleh:</p>
                    <p class="text-xl font-bold uppercase mt-2">{{ $d['nama'] }}</p>
                    <p class="text-lg font-mono">NIM. {{ $d['nim'] }}</p>
                </div>

                <div class="text-lg font-bold uppercase leading-tight space-y-1">
                    <p>{{ $d['prodi'] }}</p>
                    <p>{{ $d['instansi'] }}</p>
                    <p>{{ $d['kota'] }}</p>
                    <p>{{ $d['tahun'] }}</p>
                </div>
            </div>
        </div>

        {{-- ================= HALAMAN 2: DAFTAR ISI ================= --}}
        @if($isDbPreview && $laporan->sections->isNotEmpty())
            <div class="page-break-before pt-4">
                <h2 class="text-xl font-bold text-center uppercase mb-8">DAFTAR ISI</h2>
                
                <div class="w-full space-y-1">
                    @foreach($laporan->sections->whereNull('parent_id')->sortBy('order') as $main)
                        <div class="flex justify-between items-end border-b border-dotted border-gray-400 pb-1">
                            <span class="font-bold uppercase">
                                @if(!str_contains(strtoupper($main->title), 'BAB')) BAB {{ $loop->iteration }} @endif
                                {{ $main->title }}
                            </span>
                        </div>

                        @foreach($laporan->sections->where('parent_id', $main->id)->sortBy('order') as $sub)
                            <div class="flex justify-between items-end border-b border-dotted border-gray-300 pb-1 pl-8 text-sm">
                                <span>{{ $loop->parent->iteration }}.{{ $loop->iteration }} {{ $sub->title }}</span>
                            </div>
                        @endforeach
                        <div class="mb-3"></div> 
                    @endforeach
                </div>
            </div>
        @endif

        {{-- ================= HALAMAN 3 dst: KONTEN ================= --}}
        @if($isDbPreview && $laporan->sections->isNotEmpty())
            @foreach($laporan->sections->whereNull('parent_id')->sortBy('order') as $main)
                <div class="page-break-before pt-2">
                    <h2 class="text-xl font-bold text-center uppercase mb-6" id="sec-{{$main->id}}">
                        @if(!str_contains(strtoupper($main->title), 'BAB') && !str_contains(strtoupper($main->title), 'DAFTAR PUSTAKA'))
                            BAB {{ $loop->iteration }} <br/>
                        @endif
                        {{ $main->title }}
                    </h2>
                    <div class="tiptap-content">{!! $main->content !!}</div>
                </div>

                @foreach($laporan->sections->where('parent_id', $main->id)->sortBy('order') as $sub)
                    <div class="pt-4 avoid-break" id="sec-{{$sub->id}}">
                        <h3 class="text-lg font-bold uppercase mb-2 ml-0">
                            {{ $loop->parent->iteration }}.{{ $loop->iteration }} {{ $sub->title }}
                        </h3>
                        <div class="tiptap-content">{!! $sub->content !!}</div>
                    </div>
                @endforeach
            @endforeach
        @endif

    </div> {{-- End Paper Sheet --}}

</body>
</html>