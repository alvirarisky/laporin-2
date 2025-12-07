import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

// --- KOMPONEN IKON ---
const Icons = {
    Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
    Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
    Doc: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>,
    Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
    Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
    Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
};

export default function Index({ auth, laporans, flash }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id) => {
        if (confirm("Yakin hapus laporan ini? Data yang dihapus tidak bisa dikembalikan.")) {
            router.delete(route("laporan.destroy", id));
        }
    };

    // Filter Logic (Client Side)
    const filteredLaporan = laporans.filter((laporan) =>
        laporan.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        laporan.mata_kuliah.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-bold text-2xl text-slate-800 leading-tight">
                            Arsip Laporan 🗂️
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola semua dokumen laporan yang pernah kamu buat.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("dashboard")} // Balik ke dashboard dulu
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition shadow-sm"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={route("laporan.create")} // Langsung ke create
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
                        >
                            <Icons.Plus /> Buat Baru
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Daftar Laporan" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Flash Message */}
                    {flash.success && (
                        <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 shadow-sm animate-fade-in-down">
                            <span className="text-xl">✅</span>
                            {flash.success}
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Search />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari judul laporan atau mata kuliah..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
                        />
                    </div>

                    {/* Content Area */}
                    {filteredLaporan.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredLaporan.map((laporan) => (
                                <div
                                    key={laporan.id}
                                    className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                <Icons.Doc />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                                {new Date(laporan.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2 leading-tight group-hover:text-indigo-700 transition-colors">
                                            {laporan.judul}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-1">
                                            {laporan.mata_kuliah}
                                        </p>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={route("laporan.edit", laporan.id)}
                                                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all tooltip"
                                                title="Edit Laporan"
                                            >
                                                <Icons.Edit />
                                            </Link>
                                            <a
                                                href={route("laporan.preview", laporan.id)} // Ganti route ke show/preview
                                                className="p-2 text-slate-500 hover:text-sky-600 hover:bg-white rounded-lg transition-all"
                                                title="Lihat Preview"
                                            >
                                                <Icons.Eye />
                                            </a>
                                            <a
                                                href={route("laporan.download", laporan.id)}
                                                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"
                                                title="Download File"
                                            >
                                                <Icons.Download />
                                            </a>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(laporan.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Hapus"
                                        >
                                            <Icons.Trash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                📭
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                {searchTerm ? "Tidak ditemukan" : "Belum ada laporan"}
                            </h3>
                            <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
                                {searchTerm 
                                    ? `Tidak ada laporan yang cocok dengan kata kunci "${searchTerm}".` 
                                    : "Mulai buat laporan pertamamu dan arsip akan muncul di sini."}
                            </p>
                            {!searchTerm && (
                                <Link
                                    href={route("laporan.create")}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                                >
                                    <Icons.Plus /> Buat Laporan Sekarang
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}