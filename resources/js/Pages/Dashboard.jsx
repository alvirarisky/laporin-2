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
                <section className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-sky-900/40">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
                                Questify
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-slate-50">
                                Asah logika & SQL lewat quest interaktif
                            </h3>
                            <p className="mt-2 text-sm text-slate-300">
                                Pilih topik, selesaikan level, dan pantau
                                progres belajarmu secara bertahap seperti game.
                            </p>
                        </div>
                        <Link
                            href={route('questify.index')}
                            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-sky-500/40 transition hover:bg-sky-400"
                        >
                            Masuk ke Questify
                        </Link>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-sky-900/40">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                                Generator Laporan
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-slate-50">
                                Susun laporan akademik dengan struktur rapi
                            </h3>
                            <p className="mt-2 text-sm text-slate-300">
                                Gunakan template kampus, kelola bab per bagian,
                                dan dapatkan preview sebelum diunduh.
                            </p>
                        </div>
                        <Link
                            href={route('laporan.create')}
                            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-400"
                        >
                            + Buat Laporan Baru
                        </Link>
                    </div>
                </section>

                {/* Ringkasan cepat */}
                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="text-xs font-medium text-slate-400">
                            Total laporan
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-50">
                            {laporans?.length ?? 0}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Laporan yang tersimpan di akun kamu.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="text-xs font-medium text-slate-400">
                            Template aktif
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-50">
                            {templates?.length ?? 0}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Template laporan yang siap dipakai ulang.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="text-xs font-medium text-slate-400">
                            Mode belajar
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-50">
                            Laporan & Questify
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Kombinasikan penulisan laporan dengan latihan soal
                            interaktif.
                        </p>
                    </div>
                </section>

                {/* Riwayat laporan terbaru */}
                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-100 sm:text-base">
                            Riwayat laporan terbaru
                        </h3>
                        <button
                            type="button"
                            onClick={() => setShowHistoryModal(true)}
                            className="text-xs font-medium text-sky-300 transition hover:text-sky-200"
                        >
                            Lihat semua
                        </button>
                    </div>

                    {laporanList.length === 0 && (
                        <p className="mt-4 text-sm text-slate-400">
                            Belum ada laporan yang tersimpan. Mulai dari tombol{' '}
                            <span className="font-semibold text-emerald-300">
                                “Buat Laporan Baru”
                            </span>{' '}
                            di atas.
                        </p>
                    )}

                    {laporanList.length > 0 && (
                        <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
                            <table className="min-w-full divide-y divide-slate-800 text-sm">
                                <thead className="bg-slate-900/80">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Judul
                                        </th>
                                        <th className="hidden px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 sm:table-cell">
                                            Dibuat
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                                    {laporanList.slice(0, 5).map((laporan) => (
                                        <tr key={laporan.id}>
                                            <td className="px-4 py-2 text-slate-100">
                                                <p className="truncate text-sm font-medium">
                                                    {laporan.judul ??
                                                        laporan.title ??
                                                        'Laporan tanpa judul'}
                                                </p>
                                            </td>
                                            <td className="hidden px-4 py-2 text-xs text-slate-400 sm:table-cell">
                                                {laporan.created_at}
                                            </td>
                                            <td className="px-4 py-2 text-right text-xs">
                                                <Link
                                                    href={route(
                                                        'laporan.edit',
                                                        laporan.id,
                                                    )}
                                                    className="font-medium text-sky-300 hover:text-sky-200"
                                                >
                                                    Buka
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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