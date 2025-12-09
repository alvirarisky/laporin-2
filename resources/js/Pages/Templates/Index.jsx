import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

export default function Index({ auth, templates, laporans }) {
    const { flash } = usePage().props;
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showUseModal, setShowUseModal] = useState(null); // Menyimpan ID Template
    const [selectedLaporan, setSelectedLaporan] = useState("");
    const [replaceExisting, setReplaceExisting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // State form upload template
    const [uploadForm, setUploadForm] = useState({
        name: '',
        template_file: null,
        description: '',
        is_public: false,
    });

    // State form untuk data laporan baru (Judul, NIM, dll)
    const [useForm, setUseForm] = useState({
        judul: '',
        report_type: 'Makalah',
        mata_kuliah: '',
        nim: auth.user.nim || '', // Auto-fill kalau user punya data NIM
        prodi: '',
        instansi: '',
    });

    // --- HANDLER UPLOAD ---
    const handleUpload = (e) => {
        e.preventDefault();
        if (!uploadForm.name || !uploadForm.template_file) {
            alert('Mohon isi nama template dan pilih file!');
            return;
        }

        router.post(route('templates.store'), {
            _method: 'post',
            name: uploadForm.name,
            template_file: uploadForm.template_file,
            description: uploadForm.description,
            is_public: uploadForm.is_public,
        }, {
            forceFormData: true,
            onStart: () => setIsProcessing(true),
            onFinish: () => setIsProcessing(false),
            onSuccess: () => {
                setShowUploadModal(false);
                setUploadForm({ name: '', template_file: null, description: '', is_public: false });
            },
            onError: (errors) => {
                alert('Gagal upload: ' + JSON.stringify(errors));
            }
        });
    };

    // --- HANDLER GUNAKAN TEMPLATE ---
    const handleUseTemplate = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const routeUrl = selectedLaporan
            ? route('templates.apply', { template: showUseModal, laporan: selectedLaporan })
            : route('templates.use', { template: showUseModal });
        
        // Kalau pilih laporan lama, kirim opsi replace.
        // Kalau buat baru, kirim data form detailnya.
        const data = selectedLaporan 
            ? { replace_existing: replaceExisting }
            : { ...useForm }; 

        router.post(routeUrl, data, {
            onFinish: () => setIsProcessing(false),
            onSuccess: () => {
                setShowUseModal(null);
                setSelectedLaporan("");
                setReplaceExisting(false);
                setUseForm({ judul: '', mata_kuliah: '', nim: '', prodi: '', instansi: '' }); // Reset form
            },
            onError: (errors) => {
                console.error("Template Error:", errors);
                alert("Gagal memproses template. Cek inputan."); 
            }
        });
    };

    // --- HANDLER DELETE ---
    const handleDelete = (templateId) => {
        if (!confirm('Yakin ingin menghapus template ini?')) return;
        router.delete(route('templates.destroy', templateId));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-bold text-2xl text-white leading-tight flex items-center gap-2">
                            <span className="text-indigo-400"></span> Manajemen Template
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1">
                            Upload format laporan (.docx) biar gak ngetik ulang format terus.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:-translate-y-1 transition-all duration-300 border border-indigo-400/30"
                    >
                        <span>📤</span> Upload Template
                    </button>
                </div>
            }
        >
            <Head title="Template - Laporin" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up">
                            <span>✅</span> {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up">
                            <span>⚠️</span> {flash.error}
                        </div>
                    )}

                    {templates.length === 0 ? (
                        <div className="bg-[#18181b]/60 backdrop-blur-sm rounded-2xl border border-dashed border-zinc-700 p-16 text-center animate-fade-in">
                            <div className="text-7xl mb-6 opacity-20 grayscale">📂</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Belum ada template</h3>
                            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                                Upload template pertamamu (.docx) biar bisa dipake buat generate laporan otomatis.
                            </p>
                            <button onClick={() => setShowUploadModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-200 font-semibold rounded-xl border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-all">
                                Mulai Upload
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map((template) => (
                                <div key={template.id} className="group relative bg-[#18181b]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 hover:border-indigo-500/50 hover:bg-zinc-900/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-500"></div>
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300 border border-indigo-500/20">📄</div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white line-clamp-1" title={template.name}>{template.name}</h3>
                                                        <p className="text-[10px] text-zinc-500 font-mono">
                                                            {new Date(template.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    {template.is_public && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">PUBLIC</span>}
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${template.is_owner ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                                                        {template.is_owner ? 'MILIKMU' : template.user?.name}
                                                    </span>
                                                </div>
                                                {template.description && <p className="text-sm text-zinc-400 line-clamp-2 h-10 mb-2 leading-relaxed">{template.description}</p>}
                                            </div>
                                            {template.is_owner && (
                                                <button onClick={() => handleDelete(template.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus template">🗑️</button>
                                            )}
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-white/5">
                                            <button onClick={() => { setShowUseModal(template.id); setSelectedLaporan(""); }} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 text-white text-sm font-bold rounded-xl border border-white/10 hover:bg-indigo-600 hover:border-indigo-500 transition-all group-active:scale-95 shadow-lg">
                                                <span>🚀</span> Gunakan Template
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL UPLOAD --- */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-[#18181b] rounded-2xl border border-zinc-700 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Upload Template Baru</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-zinc-500 hover:text-white transition">✖</button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nama Template</label>
                                    <input type="text" value={uploadForm.name} onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })} placeholder="Contoh: Makalah Kampus" className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-zinc-600" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">File (.docx)</label>
                                    <input type="file" accept=".docx" onChange={(e) => setUploadForm({ ...uploadForm, template_file: e.target.files[0] })} className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer bg-zinc-900 border border-zinc-700 rounded-xl" required />
                                </div>
                                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-start gap-3">
                                    <input id="is_public" type="checkbox" checked={uploadForm.is_public} onChange={(e) => setUploadForm({ ...uploadForm, is_public: e.target.checked })} className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-indigo-600" />
                                    <label htmlFor="is_public" className="font-bold text-white text-sm cursor-pointer">Bagikan ke Public?</label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 border border-zinc-700 transition">Batal</button>
                                    <button type="submit" disabled={isProcessing} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition">{isProcessing ? 'Upload...' : 'Upload'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL GUNAKAN (FORM INPUT DATA) --- */}
            {showUseModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-[#18181b] rounded-2xl border border-zinc-700 w-full max-w-lg shadow-2xl my-8">
                        <div className="p-6 border-b border-zinc-800">
                            <h3 className="text-xl font-bold text-white">Persiapan Laporan 🚀</h3>
                            <p className="text-sm text-zinc-500">Isi detail dasar dulu biar Cover-nya ganteng.</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Target Penggunaan</label>
                                <select
                                    value={selectedLaporan || ''}
                                    onChange={(e) => setSelectedLaporan(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">➕ Buat Laporan Baru</option>
                                    <option disabled>──────────────</option>
                                    {laporans.map((laporan) => (
                                        <option key={laporan.id} value={laporan.id}>
                                            📝 Timpa Laporan: {laporan.judul}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Jenis Laporan</label>
                                    <select
                                        value={useForm.report_type}
                                        onChange={(e) => setUseForm({ ...useForm, report_type: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-indigo-500"
                                    >
                                        <option value="Makalah">Makalah</option>
                                        <option value="Laporan Praktikum">Laporan Praktikum</option>
                                        <option value="Proposal">Proposal</option>
                                        <option value="Studi Kasus">Studi Kasus</option>
                                        <option value="Skripsi">Skripsi</option>
                                        <option value="Tugas Akhir">Tugas Akhir</option>
                                    </select>
                                </div>

                            {/* --- FORM HANYA MUNCUL KALAU BUAT BARU --- */}
                            {!selectedLaporan && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Judul Laporan</label>
                                        <input
                                            type="text"
                                            value={useForm.judul}
                                            onChange={(e) => setUseForm({ ...useForm, judul: e.target.value })}
                                            placeholder="Contoh: Laporan Akhir Praktikum PBO"
                                            className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-zinc-600"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">Mata Kuliah</label>
                                            <input
                                                type="text"
                                                value={useForm.mata_kuliah}
                                                onChange={(e) => setUseForm({ ...useForm, mata_kuliah: e.target.value })}
                                                placeholder="Nama Matkul"
                                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-zinc-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">NIM (Opsional)</label>
                                            <input
                                                type="text"
                                                value={useForm.nim}
                                                onChange={(e) => setUseForm({ ...useForm, nim: e.target.value })}
                                                placeholder="NIM kamu..."
                                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-zinc-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                         <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">Prodi (Opsional)</label>
                                            <input
                                                type="text"
                                                value={useForm.prodi}
                                                onChange={(e) => setUseForm({ ...useForm, prodi: e.target.value })}
                                                placeholder="Jurusan..."
                                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-zinc-600"
                                            />
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">Instansi (Opsional)</label>
                                            <input
                                                type="text"
                                                value={useForm.instansi}
                                                onChange={(e) => setUseForm({ ...useForm, instansi: e.target.value })}
                                                placeholder="Kampus..."
                                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-zinc-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- PILIHAN REPLACE (Kalau Timpa Lama) --- */}
                            {selectedLaporan && (
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 mt-4">
                                    <input
                                        type="checkbox"
                                        checked={replaceExisting}
                                        onChange={(e) => setReplaceExisting(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-amber-500/50 bg-amber-900/20 text-amber-500 cursor-pointer"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-amber-400">Timpa Isi Laporan?</p>
                                        <p className="text-xs text-amber-500/80 mt-0.5">
                                            Isi bab yang ada bakal diganti total sama template ini.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowUseModal(null)}
                                    className="flex-1 px-4 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 border border-zinc-700 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleUseTemplate}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition disabled:opacity-50"
                                >
                                    {isProcessing ? 'Memproses...' : (selectedLaporan ? 'Terapkan' : 'Buat Laporan')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}