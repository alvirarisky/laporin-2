import Modal from "@/Components/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Dashboard({ auth, laporans, templates }) {
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const laporanList = laporans ?? [];

    // Helper: Format Tanggal (Tetap dipake buat Modal History)
    const formatDate = (dateString) => {
        if (!dateString) return "Belum diedit";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Helper Baru: Time Ago (Buat Card Dashboard)
    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Belum diedit";

        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        const intervals = [
            { label: 'tahun', seconds: 31536000 },
            { label: 'bulan', seconds: 2592000 },
            { label: 'hari', seconds: 86400 },
            { label: 'jam', seconds: 3600 },
            { label: 'menit', seconds: 60 },
            { label: 'detik', seconds: 1 }
        ];

        for (let i = 0; i < intervals.length; i++) {
            const interval = intervals[i];
            const count = Math.floor(seconds / interval.seconds);
            
            if (count >= 1) {
                if (interval.label === 'detik' && count < 30) return "Baru saja";
                return `${count} ${interval.label} yang lalu`;
            }
        }
        return "Baru saja";
    };

    // Helper: Hitung Progress
    const calculateProgress = (sections) => {
        if (!sections || sections.length === 0) return 0;
        const filled = sections.filter(s => s.content && s.content.trim().length > 0).length;
        return Math.round((filled / sections.length) * 100);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Selamat datang, {auth.user.name} 👋
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                            Siap produktif hari ini? Kelola laporan akademik dan asah skill coding kamu di satu tempat.
                        </p>
                    </div>
                    <div className="hidden md:block">
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 space-y-8">
                
                {/* 1. SECTION: HERO CARDS */}
                <section className="grid gap-6 md:grid-cols-2">
                    {/* Card Questify */}
                    <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md ring-1 ring-slate-100 transition-all hover:shadow-xl hover:ring-sky-200 hover:-translate-y-1">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-50 transition-all group-hover:bg-sky-100 blur-3xl" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-1.5 text-sky-700 border border-sky-100">
                                    <span className="text-lg">🎮</span>
                                    <span className="text-xs font-bold uppercase tracking-wide">Questify Mode</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    Asah Logika & SQL
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    Belajar coding nggak perlu ngebosenin. Selesaikan level, raih XP, dan pahami materi lewat tantangan interaktif.
                                </p>
                            </div>
                            
                            <Link
                                href={route("questify.index")}
                                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:scale-[1.02]"
                            >
                                <span>Mainkan Questify</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Card Laporan */}
                    <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md ring-1 ring-slate-100 transition-all hover:shadow-xl hover:ring-emerald-200 hover:-translate-y-1">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-50 transition-all group-hover:bg-emerald-100 blur-3xl" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-emerald-700 border border-emerald-100">
                                    <span className="text-lg">📝</span>
                                    <span className="text-xs font-bold uppercase tracking-wide">Report Builder</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    Buat Laporan Instan
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    Nggak perlu pusing mikirin format. Gunakan template standar kampus, isi konten per bab, dan export ke PDF/Word.
                                </p>
                            </div>

                            <Link
                                href={route("laporan.create")}
                                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02]"
                            >
                                <span>+ Buat Laporan Baru</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 2. SECTION: STATS SUMMARY */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        { label: "Total Laporan", value: laporans?.length ?? 0, icon: "📊", color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Template Aktif", value: templates?.length ?? 0, icon: "📋", color: "text-purple-600", bg: "bg-purple-50" },
                        { label: "Draft Disimpan", value: laporans?.filter(l => calculateProgress(l.sections) < 100).length ?? 0, icon: "💾", color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Selesai", value: laporans?.filter(l => calculateProgress(l.sections) === 100).length ?? 0, icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <span className="text-lg">{stat.icon}</span>
                                </div>
                                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                    {stat.label}
                                </dt>
                            </div>
                            <dd className={`mt-4 text-3xl font-bold ${stat.color}`}>
                                {stat.value}
                            </dd>
                        </div>
                    ))}
                </section>

                {/* 3. SECTION: RECENT WORK */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">
                                Lanjutkan Pengerjaan
                            </h3>
                            <p className="text-sm text-slate-500">
                                File yang terakhir kamu buka atau edit.
                            </p>
                        </div>
                        {laporanList.length > 0 && (
                            <button
                                onClick={() => setShowHistoryModal(true)}
                                className="group flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            >
                                Lihat Semua
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </button>
                        )}
                    </div>

                    {laporanList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12">
                            <div className="mb-3 rounded-full bg-white p-4 shadow-sm border border-slate-100">
                                <span className="text-2xl">📭</span>
                            </div>
                            <h4 className="text-base font-semibold text-slate-800">Belum ada laporan</h4>
                            <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
                                Mulai buat laporan pertamamu dengan menekan tombol hijau di atas.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {laporanList.slice(0, 3).map((laporan) => {
                                const progress = calculateProgress(laporan.sections);
                                const isComplete = progress === 100;
                                
                                return (
                                    <div key={laporan.id} className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-900/5">
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-slate-800 line-clamp-1" title={laporan.judul}>
                                                        {laporan.judul || "Tanpa Judul"}
                                                    </h4>
                                                    <p className="mt-1 text-xs font-medium text-slate-500">
                                                        {laporan.mata_kuliah || "Matkul Umum"}
                                                    </p>
                                                </div>
                                                <span className={`flex h-6 items-center rounded-full px-2 text-[10px] font-bold uppercase tracking-wide ${
                                                    isComplete 
                                                        ? "bg-emerald-100 text-emerald-700" 
                                                        : "bg-amber-100 text-amber-700"
                                                }`}>
                                                    {isComplete ? "Selesai" : "Draft"}
                                                </span>
                                            </div>

                                            <div className="mt-5 mb-4">
                                                <div className="flex items-end justify-between text-xs mb-1.5">
                                                    <span className="text-slate-500">Progress Kelengkapan</span>
                                                    <span className="font-bold text-slate-700">{progress}%</span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ease-out ${isComplete ? 'bg-emerald-500' : 'bg-sky-500'}`} 
                                                        style={{ width: `${progress}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4">
                                            {/* UPDATE: Pake formatTimeAgo disini */}
                                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                🕒 {formatTimeAgo(laporan.updated_at)}
                                            </span>
                                            <Link
                                                href={route("laporan.edit", laporan.id)}
                                                className="text-xs font-bold text-sky-600 decoration-2 underline-offset-2 hover:underline"
                                            >
                                                Lanjutkan →
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* MODAL RIWAYAT (Tetap pake formatDate biar detail) */}
                <Modal show={showHistoryModal} onClose={() => setShowHistoryModal(false)}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Riwayat Semua Laporan</h3>
                            <button onClick={() => setShowHistoryModal(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                ✕
                            </button>
                        </div>
                        
                        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                            {laporanList.map((laporan) => (
                                <div key={laporan.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{laporan.judul || "Tanpa Judul"}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Dibuat: {formatDate(laporan.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route("laporan.preview", laporan.id)}
                                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900"
                                        >
                                            Preview
                                        </Link>
                                        <Link
                                            href={route("laporan.edit", laporan.id)}
                                            className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-500"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}