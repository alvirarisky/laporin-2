import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

// --- ICONS ---
const Icons = {
    ArrowLeft: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>,
    Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>,
    Upload: () => <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>,
    Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
    Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
};

// --- MODAL PREVIEW COVER (BARU) ---
const CoverPreviewModal = ({ data, onClose }) => {
    // Helper buat tampilin preview logo dari file object
    const logoUrl = data.logo ? URL.createObjectURL(data.logo) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl h-[90vh] bg-zinc-900 rounded-2xl shadow-2xl flex flex-col border border-zinc-700">
                {/* Header Modal */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>📄</span> Pratinjau Cover
                    </h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
                        <Icons.Close />
                    </button>
                </div>

                {/* Body Modal (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 bg-zinc-800/50 flex justify-center">
                    {/* Simulasi Kertas A4 */}
                    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-[2.54cm] shadow-xl origin-top scale-75 sm:scale-90 lg:scale-100 transition-transform duration-300 flex flex-col items-center text-center font-serif leading-relaxed">
                        
                        {/* Judul & Jenis */}
                        <div className="mb-14 w-full">
                            <h1 className="text-xl font-bold uppercase mb-2">{data.judul || "JUDUL LAPORAN"}</h1>
                            <h2 className="text-lg font-bold uppercase">{data.report_type || "JENIS LAPORAN"}</h2>
                        </div>

                        {/* Logo */}
                        <div className="mb-14 flex-1 flex items-center justify-center w-full">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="w-32 h-32 object-contain" />
                            ) : (
                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                                    Logo Disini
                                </div>
                            )}
                        </div>

                        {/* Identitas Penulis */}
                        <div className="mb-12 w-full">
                            <p className="text-md mb-2">Disusun Oleh:</p>
                            <p className="text-lg font-bold uppercase">{data.nama || "Nama Mahasiswa"}</p>
                            <p className="text-lg font-bold">{data.nim || "NIM"}</p>
                        </div>

                        {/* Identitas Dosen */}
                        <div className="mb-12 w-full">
                            <p className="text-md mb-2">Dosen Pengampu:</p>
                            <p className="text-lg font-bold uppercase">{data.dosen_pembimbing || "Nama Dosen"}</p>
                        </div>

                        {/* Footer Kampus */}
                        <div className="mt-auto w-full">
                            <p className="text-lg font-bold uppercase">{data.prodi || "PROGRAM STUDI"}</p>
                            <p className="text-lg font-bold uppercase">{data.instansi || "INSTITUSI / KAMPUS"}</p>
                            <p className="text-lg font-bold uppercase">{data.kota || "KOTA"}</p>
                            <p className="text-lg font-bold uppercase">{data.tahun_ajaran || "TAHUN"}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="p-4 border-t border-zinc-700 bg-zinc-900 rounded-b-2xl">
                    <p className="text-xs text-center text-zinc-500">
                        *Ini hanya pratinjau kasar. Hasil akhir (DOCX/PDF) akan lebih rapi sesuai format resmi.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function Create({ auth }) {
    // Setup Form Inertia
    const { data, setData, post, processing, errors } = useForm({
        report_type: 'Makalah',
        tahun_ajaran: '2025/2026',
        judul: '',
        instansi: '',
        nama: auth.user.name || '',
        nim: '',
        prodi: '',
        kota: '',
        mata_kuliah: '',
        dosen_pembimbing: '',
        logo_position: 'tengah',
        logo: null,
    });

    // State buat modal preview
    const [showPreview, setShowPreview] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('laporan.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-2xl text-white leading-tight flex items-center gap-2">
                            <span>📝</span> Buat Laporan Baru
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1">
                            Isi detail di bawah untuk generate struktur laporan otomatis.
                        </p>
                    </div>
                    <Link
                        href={route('dashboard')}
                        className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
                    >
                        <Icons.ArrowLeft /> Kembali ke Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Buat Laporan Baru" />

            {/* Render Modal Preview Kalau State True */}
            {showPreview && (
                <CoverPreviewModal data={data} onClose={() => setShowPreview(false)} />
            )}

            <div className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* KOLOM KIRI: FORM UTAMA */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* CARD 1: INFORMASI DASAR */}
                            <div className="bg-[#18181b] p-6 sm:p-8 rounded-2xl border border-zinc-800 shadow-xl">
                                <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4 mb-6 flex items-center gap-3">
                                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold">1</span>
                                    Informasi Dasar
                                </h3>
                                
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Jenis Laporan */}
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Jenis Laporan</label>
                                            <select
                                                value={data.report_type}
                                                onChange={(e) => setData('report_type', e.target.value)}
                                                className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                            >
                                                <option value="Makalah">Makalah</option>
                                                <option value="Proposal">Proposal</option>
                                                <option value="Laporan Praktikum">Laporan Praktikum</option>
                                                <option value="Studi Kasus">Studi Kasus</option>
                                                <option value="Skripsi">Skripsi</option>
                                            </select>
                                            {errors.report_type && <div className="text-red-500 text-xs mt-1">{errors.report_type}</div>}
                                        </div>
                                        
                                        {/* Tahun Ajaran */}
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Tahun Ajaran</label>
                                            <input
                                                type="text"
                                                value={data.tahun_ajaran}
                                                onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                                placeholder="Contoh: 2024/2025"
                                                className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm placeholder:text-zinc-600"
                                            />
                                            {errors.tahun_ajaran && <div className="text-red-500 text-xs mt-1">{errors.tahun_ajaran}</div>}
                                        </div>
                                    </div>

                                    {/* Judul */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Judul Laporan</label>
                                        <input
                                            type="text"
                                            value={data.judul}
                                            onChange={(e) => setData('judul', e.target.value)}
                                            placeholder="Masukkan judul lengkap laporan..."
                                            className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm placeholder:text-zinc-600 font-medium"
                                        />
                                        {errors.judul && <div className="text-red-500 text-xs mt-1">{errors.judul}</div>}
                                    </div>

                                    {/* Instansi */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nama Institusi / Kampus</label>
                                        <input
                                            type="text"
                                            value={data.instansi}
                                            onChange={(e) => setData('instansi', e.target.value)}
                                            placeholder="Contoh: Universitas Telkom"
                                            className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm placeholder:text-zinc-600"
                                        />
                                        {errors.instansi && <div className="text-red-500 text-xs mt-1">{errors.instansi}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* CARD 2: DETAIL AKADEMIK */}
                            <div className="bg-[#18181b] p-6 sm:p-8 rounded-2xl border border-zinc-800 shadow-xl">
                                <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4 mb-6 flex items-center gap-3">
                                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold">2</span>
                                    Detail Akademik
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Nama */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nama Penulis</label>
                                        <input
                                            type="text"
                                            value={data.nama}
                                            onChange={(e) => setData('nama', e.target.value)}
                                            className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                        />
                                        {errors.nama && <div className="text-red-500 text-xs mt-1">{errors.nama}</div>}
                                    </div>

                                    {/* NIM */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">NIM / NISN</label>
                                        <input
                                            type="text"
                                            value={data.nim}
                                            onChange={(e) => setData('nim', e.target.value)}
                                            placeholder="Nomor Induk Mahasiswa"
                                            className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm placeholder:text-zinc-600"
                                        />
                                        {errors.nim && <div className="text-red-500 text-xs mt-1">{errors.nim}</div>}
                                    </div>

                                    {/* Prodi */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Program Studi / Jurusan</label>
                                        <input
                                            type="text"
                                            value={data.prodi}
                                            onChange={(e) => setData('prodi', e.target.value)}
                                            className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                        />
                                        {errors.prodi && <div className="text-red-500 text-xs mt-1">{errors.prodi}</div>}
                                    </div>

                                    {/* Kota */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Kota Domisili Kampus</label>
                                        <input
                                            type="text"
                                            value={data.kota}
                                            onChange={(e) => setData('kota', e.target.value)}
                                            className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                        />
                                        {errors.kota && <div className="text-red-500 text-xs mt-1">{errors.kota}</div>}
                                    </div>

                                    {/* Matkul */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Mata Kuliah / Topik</label>
                                        <input
                                            type="text"
                                            value={data.mata_kuliah}
                                            onChange={(e) => setData('mata_kuliah', e.target.value)}
                                            className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                        />
                                        {errors.mata_kuliah && <div className="text-red-500 text-xs mt-1">{errors.mata_kuliah}</div>}
                                    </div>

                                    {/* Dosen */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Dosen Pengampu / Pembimbing</label>
                                        <input
                                            type="text"
                                            value={data.dosen_pembimbing}
                                            onChange={(e) => setData('dosen_pembimbing', e.target.value)}
                                            className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                        />
                                        {errors.dosen_pembimbing && <div className="text-red-500 text-xs mt-1">{errors.dosen_pembimbing}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN: SIDEBAR */}
                        <div className="space-y-6">
                            
                            {/* CARD LOGO */}
                            <div className="bg-[#18181b] p-6 rounded-2xl border border-zinc-800 shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-4">Logo Institusi</h3>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Posisi Logo</label>
                                    <select
                                        value={data.logo_position}
                                        onChange={(e) => setData('logo_position', e.target.value)}
                                        className="w-full rounded-xl bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                    >
                                        <option value="tengah">Tengah (Center)</option>
                                        <option value="kiri">Kiri (Left)</option>
                                        <option value="kanan">Kanan (Right)</option>
                                    </select>
                                </div>

                                {/* Custom File Input Styled */}
                                <div className="mt-2">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-700 border-dashed rounded-xl cursor-pointer bg-zinc-900/50 hover:bg-zinc-800 hover:border-indigo-500 transition-all group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Icons.Upload />
                                            <p className="mb-2 text-sm text-zinc-400 group-hover:text-white transition-colors">
                                                <span className="font-semibold">Klik upload</span> atau drag & drop
                                            </p>
                                            <p className="text-xs text-zinc-500">PNG, JPG (Max. 2MB)</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => setData('logo', e.target.files[0])}
                                        />
                                    </label>
                                    {data.logo && (
                                        <p className="mt-2 text-xs text-emerald-400 font-medium text-center">
                                            File terpilih: {data.logo.name}
                                        </p>
                                    )}
                                    {errors.logo && <div className="text-red-500 text-xs mt-1">{errors.logo}</div>}
                                </div>
                            </div>

                            {/* CARD AKSI */}
                            <div className="bg-[#18181b] p-6 shadow-xl border border-zinc-800 rounded-2xl lg:sticky lg:top-24">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Aksi</h3>
                                
                                <div className="space-y-3">
                                    {/* TOMBOL PREVIEW (SEKARANG BERFUNGSI) */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(true)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 hover:text-white hover:border-zinc-600 transition-all"
                                    >
                                        <Icons.Eye /> Pratinjau Cover
                                    </button>
                                    
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : (
                                            <>
                                                <Icons.Save /> Simpan & Lanjut
                                            </>
                                        )}
                                    </button>
                                </div>
                                
                                <p className="text-xs text-center text-zinc-500 mt-4">
                                    Laporan akan tersimpan di draft setelah tombol simpan ditekan.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}