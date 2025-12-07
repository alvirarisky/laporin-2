<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Preview Laporan</title>
    <!-- Tailwind CSS CDN untuk Browsershot -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @page {
            margin: 2.5cm;
            @bottom-right {
                content: "Halaman " counter(page) " dari " counter(pages);
                font-family: 'Times New Roman', Times, serif;
                font-size: 10pt;
                color: #555;
            }
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
        }

        .page-break {
            page-break-after: always;
        }
        
        .tiptap-content {
            text-align: justify;
        }
        
        .tiptap-content p {
            margin-bottom: 1em;
            orphans: 3;
            widows: 3;
        }

        .tiptap-content img {
            max-width: 100%;
            height: auto;
            object-fit: contain;
            display: block;
            margin: 1em auto;
        }

        .tiptap-content figure {
            margin: 1em 0;
            text-align: center;
        }
        
        .tiptap-content figure img {
            max-width: 100%;
            height: auto;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }

        .tiptap-content figcaption {
            font-size: 10pt;
            font-style: italic;
            margin-top: 0.5em;
            text-align: center;
            color: #555;
        }
        
        .tiptap-content ul,
        .tiptap-content ol {
            padding-left: 1.5em;
            margin-bottom: 1em;
            page-break-inside: avoid;
        }
        
        .tiptap-content li {
             margin-bottom: 0.5em;
        }
        
        .chapter-main {
            page-break-before: always;
        }
        
        .chapter-main:first-of-type {
            page-break-before: auto;
        }
        
        h2 {
            page-break-after: avoid;
            }
    </style>
</head>
<body class="bg-gray-100">
    @php
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

    {{-- Halaman 1: Cover (Tailwind Flexbox) --}}
    <div class="page-break bg-white min-h-screen flex flex-col justify-center items-center p-10">
        <div class="text-center space-y-6">
            <h1 class="text-2xl font-bold uppercase mb-4">{{ strtoupper(htmlspecialchars($theJudul)) }}</h1>
            <p class="text-xl font-bold uppercase mb-8">{{ strtoupper(htmlspecialchars($theReportType)) }}</p>

            <div class="my-8">
                @if($logoSrc)
                    <img src="{{ $logoSrc }}" alt="Logo Institusi" class="mx-auto max-w-[100px] max-h-[100px]">
                @else
                    <div class="mx-auto w-[85px] h-[85px] border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                        LOGO
                    </div>
                @endif
            </div>

            <div class="space-y-2 mt-12">
                <p>Disusun Oleh:</p>
                <p class="font-bold">{{ htmlspecialchars($theNama) }} ({{ htmlspecialchars($theNim) }})</p>
                <p class="mt-8">Dosen Pengampu:</p>
                <p class="font-bold">{{ htmlspecialchars($theDosen) }}</p>
            </div>

            <div class="space-y-1 mt-12">
                <p class="font-bold uppercase">{{ strtoupper(htmlspecialchars($theProdi)) }}</p>
                <p class="font-bold uppercase">{{ strtoupper(htmlspecialchars($theInstansi)) }}</p>
                <p class="font-bold uppercase">{{ strtoupper(htmlspecialchars($theKota)) }}</p>
                <p class="font-bold">{{ htmlspecialchars($theTahun) }}</p>
            </div>
        </div>
    </div>

    {{-- Halaman 2: Daftar Isi --}}
    @if($isDbPreview && isset($laporan->sections) && $laporan->sections->isNotEmpty())
        @php
            $rootSections = $laporan->sections->whereNull('parent_id')->sortBy('order');
        @endphp
        <div class="page-break bg-white p-10">
            <h2 class="text-xl font-bold text-center uppercase mb-8">DAFTAR ISI</h2>

            <ul class="space-y-2">
                @foreach($rootSections as $mainSection)
                    @php
                        $mainNumber = $loop->iteration;
                        $children = $laporan->sections->where('parent_id', $mainSection->id)->sortBy('order');
                    @endphp
                    <li class="flex justify-between">
                        <span>{{ $mainNumber }}. {{ strtoupper(htmlspecialchars($mainSection->title)) }}</span>
                        <span class="text-gray-500">...</span>
                    </li>
                    @foreach($children as $child)
                        <li class="flex justify-between pl-8 text-sm">
                            <span>{{ $mainNumber }}.{{ $loop->iteration }}. {{ htmlspecialchars($child->title) }}</span>
                            <span class="text-gray-500">...</span>
                        </li>
                    @endforeach
                @endforeach
            </ul>
        </div>
    @endif

    {{-- Halaman 3...N: Konten Bab --}}
    @if($isDbPreview && isset($laporan->sections) && $laporan->sections->isNotEmpty())
        @php
            $rootSections = $laporan->sections->whereNull('parent_id')->sortBy('order');
        @endphp
        @foreach($rootSections as $mainSection)
            @php
                $mainNumber = $loop->iteration;
                $children = $laporan->sections->where('parent_id', $mainSection->id)->sortBy('order');
            @endphp
            {{-- Main Chapter (Level 1) --}}
            <div class="chapter-main page-break bg-white p-10">
                <h2 class="text-xl font-bold text-center uppercase mb-6" id="section-{{ $mainSection->id }}">
                    {{ $mainNumber }}. {{ strtoupper(htmlspecialchars($mainSection->title)) }}
                </h2>

                <div class="tiptap-content">
                    {!! $mainSection->content !!}
                </div>
            </div>

            {{-- Sub-chapters (Level 2) --}}
            @foreach($children as $child)
                <div class="page-break bg-white p-10">
                    <h2 class="text-lg font-bold text-left mb-6" id="section-{{ $child->id }}">
                        {{ $mainNumber }}.{{ $loop->iteration }}. {{ htmlspecialchars($child->title) }}
                    </h2>

                    <div class="tiptap-content">
                        {!! $child->content !!}
                    </div>
                </div>
            @endforeach
        @endforeach
    @endif

</body>
</html>
