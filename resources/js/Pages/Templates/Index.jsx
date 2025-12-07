import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function Index({ auth, templates, laporans }) {
    const { flash } = usePage().props;
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showUseModal, setShowUseModal] = useState(null);
    const [selectedLaporan, setSelectedLaporan] = useState(null);
    const [replaceExisting, setReplaceExisting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        name: '',
        template_file: null,
    });

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadForm.name || !uploadForm.template_file) {
            alert('Mohon isi nama template dan pilih file!');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('name', uploadForm.name);
        formData.append('template_file', uploadForm.template_file);

        try {
            await axios.post(route('templates.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowUploadModal(false);
            setUploadForm({ name: '', template_file: null });
            router.reload();
        } catch (error) {
            console.error('Error uploading template:', error);
            alert('Gagal mengupload template: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUseTemplate = async (templateId, laporanId = null) => {
        setIsProcessing(true);
        try {
            if (laporanId) {
                // Terapkan ke laporan yang dipilih
                await axios.post(route('templates.apply', { template: templateId, laporan: laporanId }), {
                    replace_existing: replaceExisting,
                });
                setShowUseModal(null);
                setSelectedLaporan(null);
                setReplaceExisting(false);
                router.visit(route('laporan.edit', laporanId));
            } else {
                // Buat laporan baru
                await axios.post(route('templates.use', { template: templateId }));
                setShowUseModal(null);
                setSelectedLaporan(null);
                setReplaceExisting(false);
                router.reload();
            }
        } catch (error) {
            console.error('Error using template:', error);
            alert('Gagal menggunakan template: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (templateId) => {
        if (!confirm('Yakin ingin menghapus template ini?')) return;
        
        try {
            await axios.delete(route('templates.destroy', templateId));
            router.reload();
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Gagal menghapus template.');
        }
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
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {template.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Diupload: {new Date(template.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(template.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Hapus template"
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                setShowUseModal(template.id);
                                                setSelectedLaporan(null);
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
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Upload Template Baru</h3>
                        <form onSubmit={handleUpload}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Template
                                </label>
                                <input
                                    type="text"
                                    value={uploadForm.name}
                                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                                    placeholder="Contoh: Template Makalah 2024"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
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
                                        setUploadForm({ name: '', template_file: null });
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

            {/* Modal Gunakan Template */}
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
                                        onChange={(e) => setSelectedLaporan(e.target.value || null)}
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
                                onClick={() => handleUseTemplate(showUseModal, selectedLaporan)}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                            >
                                {isProcessing ? 'Memproses...' : 'Gunakan'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowUseModal(null);
                                    setSelectedLaporan(null);
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

