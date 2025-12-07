import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, laporans, templates }) {
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const laporanList = laporans ?? [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                            Selamat datang kembali, {auth.user.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Kelola laporan akademik dan lanjutkan perjalanan
                            belajar kamu bersama Questify.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard – Laporin" />

            <div className="space-y-6 pb-8 pt-2">
                {/* Kartu fitur utama */}
                <section className="grid gap-6 md:grid-cols-2">
                    <div className="group flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-sky-900/40 hover:shadow-2xl hover:shadow-sky-900/60 transition-all duration-300 hover:scale-[1.02]">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🎮</span>
                            <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
                                Questify
                            </p>
                            </div>
                            <h3 className="mt-1 text-xl font-bold text-slate-50">
                                Asah logika & SQL lewat quest interaktif
                            </h3>
                            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                                Pilih topik, selesaikan level, dan pantau
                                progres belajarmu secara bertahap seperti game.
                            </p>
                        </div>
                        <Link
                            href={route('questify.index')}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/40 transition-all duration-200 hover:bg-sky-400 hover:shadow-xl hover:shadow-sky-500/50 hover:scale-105"
                        >
                            <span>Masuk ke Questify</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>

                    <div className="group flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-emerald-900/40 hover:shadow-2xl hover:shadow-emerald-900/60 transition-all duration-300 hover:scale-[1.02]">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">📝</span>
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                                Generator Laporan
                            </p>
                            </div>
                            <h3 className="mt-1 text-xl font-bold text-slate-50">
                                Susun laporan akademik dengan struktur rapi
                            </h3>
                            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                                Gunakan template kampus, kelola bab per bagian,
                                dan dapatkan preview sebelum diunduh.
                            </p>
                        </div>
                        <Link
                            href={route('laporan.create')}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/40 transition-all duration-200 hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105"
                        >
                            <span>+ Buat Laporan Baru</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </Link>
                    </div>
                </section>

                {/* Ringkasan cepat */}
                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Total laporan
                        </p>
                            <span className="text-lg">📊</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-slate-50">
                            {laporans?.length ?? 0}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Laporan yang tersimpan di akun kamu.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Template aktif
                        </p>
                            <span className="text-lg">📋</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-slate-50">
                            {templates?.length ?? 0}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Template laporan yang siap dipakai ulang.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Mode belajar
                        </p>
                            <span className="text-lg">🎓</span>
                        </div>
                        <p className="mt-2 text-lg font-bold text-slate-50">
                            Laporan & Questify
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Kombinasikan penulisan laporan dengan latihan soal
                            interaktif.
                        </p>
                    </div>
                </section>

                {/* Riwayat laporan terbaru */}
                <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
                    <div className="flex items-center justify-between gap-2 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-100">
                            Riwayat laporan terbaru
                        </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Laporan yang baru saja kamu buat atau edit
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowHistoryModal(true)}
                            className="text-xs font-semibold text-sky-300 hover:text-sky-200 transition px-3 py-1.5 rounded-lg hover:bg-sky-500/10"
                        >
                            Lihat semua →
                        </button>
                    </div>

                    {laporanList.length === 0 && (
                        <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/40 border border-dashed border-slate-700">
                            <span className="text-4xl mb-3 block">📄</span>
                            <p className="text-sm text-slate-400">
                            Belum ada laporan yang tersimpan. Mulai dari tombol{' '}
                            <span className="font-semibold text-emerald-300">
                                    "Buat Laporan Baru"
                            </span>{' '}
                            di atas.
                        </p>
                        </div>
                    )}

                    {laporanList.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {laporanList.slice(0, 6).map((laporan) => {
                                // Calculate progress based on sections with content
                                const totalSections = laporan.sections?.length || 0;
                                const filledSections = laporan.sections?.filter(s => s.content && s.content.trim().length > 0).length || 0;
                                const progress = totalSections > 0 ? Math.round((filledSections / totalSections) * 100) : 0;
                                
                                // Format date
                                const lastEdited = laporan.updated_at 
                                    ? new Date(laporan.updated_at).toLocaleDateString('id-ID', { 
                                        day: 'numeric', 
                                        month: 'short', 
                                        year: 'numeric' 
                                    })
                                    : 'Belum pernah diedit';

                                return (
                                    <div
                                        key={laporan.id}
                                        className="group rounded-xl border border-slate-800 bg-slate-950/40 p-5 hover:bg-slate-950/60 hover:border-slate-700 hover:shadow-xl transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <h4 className="text-sm font-semibold text-slate-100 line-clamp-2 flex-1">
                                                    {laporan.judul ??
                                                        laporan.title ??
                                                        'Laporan tanpa judul'}
                                            </h4>
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                                                progress === 100 
                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            }`}>
                                                {progress === 100 ? 'Selesai' : 'Draft'}
                                            </span>
                                        </div>
                                        
                                        {/* Badge Mata Kuliah */}
                                        {laporan.mata_kuliah && (
                                            <div className="mb-3">
                                                <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                    {laporan.mata_kuliah}
                                                </span>
                                            </div>
                                        )}

                                        {/* Progress Bar */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                                <span>Progress</span>
                                                <span className="font-semibold text-slate-300">{progress}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-300 ${
                                                        progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                                                    }`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Last Edited */}
                                        <p className="text-xs text-slate-400 mb-3">
                                            Terakhir diedit: {lastEdited}
                                        </p>

                                        {/* Action Button */}
                                                <Link
                                            href={route('laporan.edit', laporan.id)}
                                            className="block w-full text-center px-4 py-2 text-xs font-semibold text-sky-300 hover:text-sky-200 bg-sky-500/10 hover:bg-sky-500/20 rounded-lg transition-all duration-200"
                                                >
                                            Buka Editor →
                                                </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            <Modal show={showHistoryModal} onClose={() => setShowHistoryModal(false)}>
                <div className="space-y-4 p-6 text-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-50">
                                Riwayat laporan lengkap
                            </h3>
                            <p className="text-xs text-slate-400">
                                Semua laporan yang pernah kamu simpan ditampilkan di sini.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowHistoryModal(false)}
                            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
                        >
                            Tutup
                        </button>
                    </div>

                    {laporanList.length === 0 && (
                        <p className="text-sm text-slate-400">
                            Belum ada laporan. Mulai buat laporan pertama kamu untuk melihat riwayat di sini.
                        </p>
                    )}

                    {laporanList.length > 0 && (
                        <div className="max-h-80 space-y-3 overflow-y-auto pr-2">
                            {laporanList.map((laporan) => (
                                <div
                                    key={laporan.id}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-sm"
                                >
                                    <p className="font-semibold text-slate-50">
                                        {laporan.judul ?? laporan.title ?? 'Laporan tanpa judul'}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Dibuat: {laporan.created_at}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                        <Link
                                            href={route('laporan.edit', laporan.id)}
                                            className="rounded-full bg-sky-500/20 px-3 py-1 font-semibold text-sky-200 ring-1 ring-sky-500/40 transition hover:bg-sky-500/30"
                                        >
                                            Buka & sunting
                                        </Link>
                                        <Link
                                            href={route('laporan.preview', laporan.id)}
                                            className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-slate-500"
                                        >
                                            Preview
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}