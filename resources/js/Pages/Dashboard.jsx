import Modal from "@/Components/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react"; // Pastikan router di-import
import { useState } from "react";

// Icon Tong Sampah buat tombol delete
const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default function Dashboard({ auth, laporans, templates }) {
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const laporanList = laporans ?? [];

    // --- FUNGSI HAPUS (BARU) ---
    const handleDelete = (id) => {
        if (confirm("⚠️ Yakin mau hapus laporan ini secara permanen?")) {
            router.delete(route('laporan.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Bisa kasih toast notif disini
                }
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Belum diedit";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

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
                        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                            Selamat datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{auth.user.name}</span> 👋
                        </h2>
                        <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
                            Siap produktif hari ini? Kelola laporan akademik dan asah skill coding kamu di satu tempat.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 space-y-8">
                
                {/* 1. SECTION: HERO CARDS */}
                <section className="grid gap-6 md:grid-cols-2">
                    {/* Card Questify */}
                    <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-zinc-900/80 hover:-translate-y-1">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-[60px] transition-all group-hover:bg-indigo-500/30" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-indigo-400 border border-indigo-500/20">
                                    <span className="text-lg">🎮</span>
                                    <span className="text-xs font-bold uppercase tracking-wide">Questify Mode</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Asah Logika & Keterampilan Akademik
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                                Belajar nggak harus bikin ngantuk. Tuntaskan level dan pahami materi lewat mini game interaktif yang sesuai bidangmu.
                                </p>
                            </div>
                            
                            <Link
                                href={route("questify.index")}
                                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-black px-5 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-indigo-50 hover:scale-[1.02]"
                            >
                                <span>Mainkan Questify</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Card Laporan */}
                    <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-zinc-900/80 hover:-translate-y-1">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-[60px] transition-all group-hover:bg-emerald-500/30" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-emerald-400 border border-emerald-500/20">
                                    <span className="text-lg">📝</span>
                                    <span className="text-xs font-bold uppercase tracking-wide">Report Builder</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Buat Laporan Instan
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                                    Nggak perlu pusing mikirin format. Gunakan template standar kampus, isi konten per bab, dan export ke PDF/Word.
                                </p>
                            </div>

                            <Link
                                href={route("laporan.create")}
                                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/50 transition-all hover:bg-emerald-500 hover:scale-[1.02]"
                            >
                                <span>+ Buat Laporan Baru</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 2. SECTION: STATS SUMMARY */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        { label: "Total Laporan", value: laporans?.length ?? 0, icon: "📊", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                        { label: "Template Aktif", value: templates?.length ?? 0, icon: "📋", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
                        { label: "Draft Disimpan", value: laporans?.filter(l => calculateProgress(l.sections) < 100).length ?? 0, icon: "💾", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                        { label: "Selesai", value: laporans?.filter(l => calculateProgress(l.sections) === 100).length ?? 0, icon: "✅", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col rounded-2xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-sm hover:bg-zinc-900/60 transition">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg border ${stat.bg}`}>
                                    <span className="text-lg">{stat.icon}</span>
                                </div>
                                <dt className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                                    {stat.label}
                                </dt>
                            </div>
                            <dd className={`mt-4 text-3xl font-black tracking-tight ${stat.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                                {stat.value}
                            </dd>
                        </div>
                    ))}
                </section>

                {/* 3. SECTION: RECENT WORK */}
                <section className="rounded-3xl border border-white/5 bg-[#18181b]/60 p-6 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                Lanjutkan Pengerjaan
                            </h3>
                            <p className="text-sm text-zinc-500">
                                File yang terakhir kamu buka atau edit.
                            </p>
                        </div>
                        {laporanList.length > 0 && (
                            <button
                                onClick={() => setShowHistoryModal(true)}
                                className="group flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition"
                            >
                                Lihat Semua
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </button>
                        )}
                    </div>

                    {laporanList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/5 bg-white/5 py-12">
                            <div className="mb-3 rounded-full bg-zinc-800 p-4 border border-white/5">
                                <span className="text-2xl opacity-50">📭</span>
                            </div>
                            <h4 className="text-base font-semibold text-white">Belum ada laporan</h4>
                            <p className="mt-1 max-w-sm text-center text-sm text-zinc-500">
                                Mulai buat laporan pertamamu dengan menekan tombol hijau di atas.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {laporanList.slice(0, 3).map((laporan) => {
                                const progress = calculateProgress(laporan.sections);
                                const isComplete = progress === 100;
                                
                                return (
                                    <div key={laporan.id} className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-zinc-900 p-5 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10">
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-zinc-100 line-clamp-1 group-hover:text-indigo-300 transition" title={laporan.judul}>
                                                        {laporan.judul || "Tanpa Judul"}
                                                    </h4>
                                                    <p className="mt-1 text-xs font-medium text-zinc-500">
                                                        {laporan.mata_kuliah || "Matkul Umum"}
                                                    </p>
                                                </div>
                                                <span className={`flex h-6 items-center rounded-full px-2 text-[10px] font-bold uppercase tracking-wide border ${
                                                    isComplete 
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                }`}>
                                                    {isComplete ? "Selesai" : "Draft"}
                                                </span>
                                            </div>

                                            <div className="mt-5 mb-4">
                                                <div className="flex items-end justify-between text-xs mb-1.5">
                                                    <span className="text-zinc-500">Progress</span>
                                                    <span className={`font-bold ${isComplete ? 'text-emerald-400' : 'text-indigo-400'}`}>{progress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_currentColor] ${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                                                        style={{ width: `${progress}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-4">
                                            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                                                🕒 {formatTimeAgo(laporan.updated_at)}
                                            </span>
                                            <Link
                                                href={route("laporan.edit", laporan.id)}
                                                className="text-xs font-bold text-indigo-400 decoration-2 underline-offset-2 hover:text-indigo-300 hover:underline"
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

                {/* --- MODAL RIWAYAT SEMUA LAPORAN --- */}
                <Modal show={showHistoryModal} onClose={() => setShowHistoryModal(false)}>
                    <div className="p-6 bg-zinc-900 border border-white/10 text-zinc-200">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Riwayat Laporan</h3>
                                <p className="text-sm text-zinc-500">Daftar semua laporan yang pernah dibuat.</p>
                            </div>
                            <button onClick={() => setShowHistoryModal(false)} className="rounded-full p-2 text-zinc-500 hover:bg-white/10 hover:text-white transition">
                                ✕
                            </button>
                        </div>
                        
                        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                            {laporanList.map((laporan) => (
                                <div key={laporan.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-zinc-800/50 p-4 transition hover:bg-zinc-800 hover:border-indigo-500/30 group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-zinc-100 group-hover:text-indigo-400 transition">{laporan.judul || "Tanpa Judul"}</h4>
                                            <span className="text-[10px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded border border-white/5">{laporan.report_type || 'Draft'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            {/* UPDATE: Pakai updated_at biar relevan */}
                                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                🕒 Diupdate: {formatTimeAgo(laporan.updated_at)}
                                            </span>
                                            <span className="text-zinc-700">•</span>
                                            <span className="text-xs text-zinc-500">
                                                {laporan.mata_kuliah}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <Link
                                            href={route("laporan.preview", laporan.id)}
                                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition"
                                            title="Lihat Preview"
                                        >
                                            👁️
                                        </Link>
                                        <Link
                                            href={route("laporan.edit", laporan.id)}
                                            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition"
                                        >
                                            Edit
                                        </Link>
                                        
                                        {/* UPDATE: Tombol Hapus */}
                                        <button
                                            onClick={() => handleDelete(laporan.id)}
                                            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-red-400 hover:bg-red-500 hover:text-white transition"
                                            title="Hapus Laporan"
                                        >
                                            <TrashIcon />
                                        </button>
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