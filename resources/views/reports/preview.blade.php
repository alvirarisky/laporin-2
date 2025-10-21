<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Preview Laporan</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; background: #e9e9e9; margin: 0; padding: 2rem; }
        .page { background: white; width: 21cm; min-height: 29.7cm; padding: 3cm; box-shadow: 0 0 15px rgba(0,0,0,0.2); margin: 0 auto 2rem; }
        .cover { text-align: center; display: flex; flex-direction: column; height: calc(29.7cm - 6cm); } /* Pastikan tinggi cukup */
        h1.judul { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 1em; } /* Beri margin bawah */
        .jenis-laporan { font-size: 14pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2em; } /* Style jenis laporan */
        .logo-img { max-width: 100px; max-height: 100px; object-fit: contain; margin: 2cm auto; }
        .logo-placeholder { width: 85px; height: 85px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; margin: 2cm auto; color: #aaa; }
        .penyusun-dosen { margin-top: 2cm; margin-bottom: auto; } /* Dorong ke tengah */
        .cover-bottom { margin-top: auto; padding-top: 2cm; } /* Pastikan ada di bawah */
        .cover-bottom p { font-weight: bold; text-transform: uppercase; margin: 0.2em 0; }
        /* Style untuk isi laporan (jika ada) */
        .page-content { margin-top: 2rem; }
        .page-content h2 { font-size: 14pt; font-weight: bold; text-align: center; margin-top: 1.5rem; margin-bottom: 1rem;}
        .page-content div { text-align: justify; } /* Supaya isi HTML dari editor rapi */
    </style>
</head>
<body>
    @php
        // Cek sumber data: dari database ($laporan) atau form ($judul, dll.)
        $isDbPreview = isset($laporan);
        // Ambil data dengan fallback jika variabel tidak ada
        $theJudul = $isDbPreview ? ($laporan->judul ?? 'JUDUL') : ($judul ?? 'JUDUL');
        $theReportType = $isDbPreview ? ($laporan->report_type ?? 'JENIS') : ($report_type ?? 'JENIS');
        $theNama = $isDbPreview ? ($laporan->nama ?? '-') : ($nama ?? '-');
        $theNim = $isDbPreview ? ($laporan->nim ?? '-') : ($nim ?? '-');
        $theDosen = $isDbPreview ? ($laporan->dosen_pembimbing ?? '-') : ($dosen_pembimbing ?? '-');
        $theProdi = $isDbPreview ? ($laporan->prodi ?? '-') : ($prodi ?? '-');
        $theInstansi = $isDbPreview ? ($laporan->instansi ?? 'INSTITUSI') : ($instansi ?? 'INSTITUSI');
        $theKota = $isDbPreview ? ($laporan->kota ?? '-') : ($kota ?? '-');
        $theTahun = $isDbPreview ? ($laporan->tahun_ajaran ?? 'TAHUN') : ($tahun_ajaran ?? 'TAHUN');
        $logoPath = $isDbPreview ? $laporan->logo_path : null;
        // Variabel base64Logo hanya ada saat preview live dari form
        $base64LogoExists = isset($base64Logo);
    @endphp

    <div class="page">
        <div class="cover">
            <h1 class="judul">{{ strtoupper($theJudul) }}</h1>
            <p class="jenis-laporan">{{ strtoupper($theReportType) }}</p>

            @if($isDbPreview && $logoPath && Storage::disk('public')->exists($logoPath))
                {{-- Tampilkan logo dari storage jika preview database --}}
                <img src="{{ asset('storage/' . $logoPath) }}" alt="Logo" class="logo-img">
            @elseif($base64LogoExists)
                {{-- Tampilkan logo dari base64 jika preview live dari form --}}
                <img src="{{ $base64Logo }}" alt="Logo Preview" class="logo-img">
            @else
                <div class="logo-placeholder">NO LOGO</div>
            @endif

            <div class="penyusun-dosen">
                <p>Disusun Oleh:</p>
                <p>{{ $theNama }} ({{ $theNim }})</p>
                <p style="margin-top: 2cm;">Dosen Pengampu:</p>
                <p>{{ $theDosen }}</p>
            </div>

            <div class="cover-bottom">
                <p>{{ strtoupper($theProdi) }}</p>
                <p>{{ strtoupper($theInstansi) }}</p>
                <p>{{ strtoupper($theKota) }}</p>
                <p>{{ $theTahun }}</p>
            </div>
        </div>
    </div>

    @if($isDbPreview && isset($laporan->sections) && $laporan->sections->isNotEmpty())
        <div class="page page-content">
            @foreach($laporan->sections as $section)
                @if(strtolower($section->title) !== 'daftar isi') {{-- Abaikan Daftar Isi untuk sementara --}}
                    <h2>{{ strtoupper($section->title) }}</h2>
                    <div>{!! $section->content !!}</div> {{-- Tampilkan HTML dari editor --}}
                @endif
            @endforeach
        </div>
    @endif
</body>
</html>