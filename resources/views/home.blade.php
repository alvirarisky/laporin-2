@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">{{ __('Dashboard') }}</div>

                    <div class="card-body">
                        {{-- Tulisan Selamat Datang --}}
                        Selamat Datang di Dasbor Lapor.in!

                        {{-- Pesan Sukses --}}
                        @if (session('success'))
                            <div class="alert alert-success mt-3">
                                {{ session('success') }}
                            </div>
                        @endif

                        <hr>

                        {{-- Form Buat Laporan --}}
                        <h3>Buat Laporan Baru</h3>

                        {{-- GANTI SELURUH BLOK <form> DENGAN KODE INI --}}
                        <form action="{{ route('documents.store') }}" method="POST">
                            @csrf
                            <div class="mb-3">
                                <label for="title" class="form-label">Judul Laporan</label>
                                <input type="text" class="form-control @error('title') is-invalid @enderror"
                                    id="title" name="title" value="{{ old('title') }}" required>
                                @error('title')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            {{-- BAGIAN YANG BERUBAH --}}
                            <div class="mb-3">
                                <label for="nama" class="form-label">Nama Mahasiswa</label>
                                <input type="text" class="form-control @error('nama') is-invalid @enderror"
                                    id="nama" name="nama" value="{{ old('nama') }}" required>
                                @error('nama')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="nim" class="form-label">NIM</label>
                                <input type="text" class="form-control @error('nim') is-invalid @enderror" id="nim"
                                    name="nim" value="{{ old('nim') }}" required>
                                @error('nim')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            {{-- AKHIR BAGIAN YANG BERUBAH --}}

                            <button type="submit" class="btn btn-primary">Simpan Laporan</button>
                        </form>
                        {{-- Kode ini untuk menampilkan tabel riwayat --}}
                        <hr class="mt-4">
                        <h3>Riwayat Laporan</h3>

                        @if ($documents->isEmpty())
                            <p>Belum ada laporan yang dibuat.</p>
                        @else
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Judul</th>
                                        <th>Tanggal Buat</th>
                                        <th>Aksi</th> {{-- <-- INI YANG KURANG --}}
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($documents as $document)
                                        <tr>
                                            <td>{{ $loop->iteration }}</td>
                                            <td>{{ $document->title }}</td>
                                            <td>{{ $document->created_at->format('d M Y, H:i') }}</td>
                                            <td>
                                                {{-- DAN INI TOMBOLNYA YANG KURANG --}}
                                                <a href="{{ route('documents.download', $document) }}"
                                                    class="btn btn-sm btn-success">
                                                    Download
                                                </a>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
