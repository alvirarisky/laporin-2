import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react'; 

export default function Index({ auth, templates, laporans }) {
    const { flash } = usePage().props;
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showUseModal, setShowUseModal] = useState(null);
    const [selectedLaporan, setSelectedLaporan] = useState(""); 
    const [replaceExisting, setReplaceExisting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // State form lengkap (Name, File, Desc, Public)
    const [uploadForm, setUploadForm] = useState({
        name: '',
        template_file: null,
        description: '',   // Baru
        is_public: false,  // Baru
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
            description: uploadForm.description, // Kirim deskripsi
            is_public: uploadForm.is_public,     // Kirim status public
        }, {
            forceFormData: true,
            onStart: () => setIsProcessing(true),
            onFinish: () => setIsProcessing(false),
            onSuccess: () => {
                setShowUploadModal(false);
                // Reset form total
                setUploadForm({ name: '', template_file: null, description: '', is_public: false });
            },
            onError: (errors) => {
                alert('Gagal upload: ' + JSON.stringify(errors));
            }
        });
    };

    // --- HANDLER GUNAKAN TEMPLATE ---
    const handleUseTemplate = (templateId) => {
        setIsProcessing(true);

        if (selectedLaporan) {
            // Apply ke laporan existing
            router.post(route('templates.apply', { template: templateId, laporan: selectedLaporan }), {
                replace_existing: replaceExisting,
            }, {
                onFinish: () => setIsProcessing(false),
                onSuccess: () => {
                    setShowUseModal(null);
                    setSelectedLaporan("");
                    setReplaceExisting(false);
                }
            });
        } else {
            // Buat laporan baru
            router.post(route('templates.use', { template: templateId }), {}, {
                onFinish: () => setIsProcessing(false),
                onSuccess: () => {
                    setShowUseModal(null);
                },
                onError: (err) => {
                    console.error(err);
                    alert("Gagal menggunakan template.");
                }
            });
        }
    };

    // --- HANDLER DELETE ---
    const handleDelete = (templateId) => {
        if (!confirm('Yakin ingin menghapus template ini?')) return;
        
        router.delete(route('templates.destroy', templateId), {
            onSuccess: () => {
                // Auto reload by Inertia
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Manajemen Template
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Upload dan kelola template laporan (.docx) untuk digunakan berulang kali
                        </p>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-200"
                    >
                        📂 Upload Template Baru
                    </button>
                </div>
            }
        >
            <Head title="Template - Laporin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow">
                            {flash.error}
                        </div>
                    )}

                    {templates.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <span className="text-6xl mb-4 block">📄</span>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum ada template
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Upload template DOCX pertama Anda untuk memulai
                            </p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
                            >
                                📂 Upload Template Baru
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className={`rounded-xl shadow-sm border p-6 transition-shadow hover:shadow-md ${template.is_owner ? 'bg-white border-gray-100' : 'bg-slate-50 border-slate-200'}`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {template.name}
                                                </h3>
                                                {/* Badge Public */}
                                                {template.is_public && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                                                        PUBLIC
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Info Uploader */}
                                            <p className="text-xs text-gray-500">
                                                Oleh: <span className="font-medium text-gray-700">{template.is_owner ? 'Anda Sendiri' : template.user?.name}</span>
                                            </p>

                                            {/* Deskripsi */}
                                            {template.description && (
                                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                    {template.description}
                                                </p>
                                            )}
                                            
                                            <p className="mt-2 text-[10px] text-gray-400">
                                                {new Date(template.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>

                                        {/* Hapus cuma bisa kalau Owner */}
                                        {template.is_owner && (
                                            <button
                                                onClick={() => handleDelete(template.id)}
                                                className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                                                title="Hapus template"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                setShowUseModal(template.id);
                                                setSelectedLaporan(""); 
                                            }}
                                            className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
                                        >
                                            ✨ Gunakan Template Ini
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Upload Template */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Upload Template Baru</h3>
                        <form onSubmit={handleUpload}>
                            {/* Input Nama */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Template
                                </label>
                                <input
                                    type="text"
                                    value={uploadForm.name}
                                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                                    placeholder="Contoh: Template Makalah 2024"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Input Deskripsi */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    rows="2"
                                    placeholder="Contoh: Format Laporan Praktikum Basis Data..."
                                />
                            </div>

                            {/* Input File */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    File Template (.docx)
                                </label>
                                <input
                                    type="file"
                                    accept=".docx"
                                    onChange={(e) => setUploadForm({ ...uploadForm, template_file: e.target.files[0] })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Maksimal 2MB, format .docx
                                </p>
                            </div>

                            {/* Checkbox Public */}
                            <div className="mb-6 flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="is_public"
                                        type="checkbox"
                                        checked={uploadForm.is_public}
                                        onChange={(e) => setUploadForm({ ...uploadForm, is_public: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                    />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="is_public" className="font-medium text-gray-900 cursor-pointer">
                                        Bagikan ke Komunitas?
                                    </label>
                                    <p className="text-gray-500">
                                        Template ini akan bisa dilihat dan digunakan oleh mahasiswa lain.
                                    </p>
                                </div>
                            </div>

                            {/* Tombol Action */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                                >
                                    {isProcessing ? 'Mengupload...' : 'Upload'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setUploadForm({ name: '', template_file: null, description: '', is_public: false });
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Gunakan Template (Sama Kayak Sebelumnya) */}
            {showUseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Gunakan Template</h3>
                        
                        {laporans && laporans.length > 0 && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pilih Laporan (atau biarkan kosong untuk laporan baru)
                                    </label>
                                    <select
                                        value={selectedLaporan || ''}
                                        onChange={(e) => setSelectedLaporan(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">-- Buat Laporan Baru --</option>
                                        {laporans.map((laporan) => (
                                            <option key={laporan.id} value={laporan.id}>
                                                {laporan.judul}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {selectedLaporan && (
                                    <div className="mb-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={replaceExisting}
                                                onChange={(e) => setReplaceExisting(e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Ganti semua bab yang ada
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleUseTemplate(showUseModal)}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                            >
                                {isProcessing ? 'Memproses...' : 'Gunakan'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowUseModal(null);
                                    setSelectedLaporan("");
                                    setReplaceExisting(false);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}