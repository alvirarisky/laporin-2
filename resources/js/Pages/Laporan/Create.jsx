import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import SelectInput from "@/Components/SelectInput";

// --- IMPORT FILEPOND ---
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImagePreview);

// ✅ TERIMA PROPS selectedTemplate
const Create = ({ auth, report_type, report_types, selectedTemplate }) => {
    
    const [files, setFiles] = useState([]);
    const [previewUrl, setPreviewUrl] = useState("");
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);

    // ✅ INISIALISASI DATA DENGAN TEMPLATE ID
    const { data, setData, post, processing, errors } = useForm({
        report_type: report_type || (report_types && report_types.length > 0 ? report_types[0] : ''),
        // Jika ada template, pre-fill judul biar keren
        judul: selectedTemplate ? `Laporan: ${selectedTemplate.name}` : "", 
        nama: auth.user.name || "",
        nim: "",
        prodi: "",
        mata_kuliah: "",
        dosen_pembimbing: "",
        instansi: "",
        kota: "",
        tahun_ajaran: new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
        logo: null,
        logo_position: "tengah",
        // ✅ SIMPAN TEMPLATE ID (Hidden)
        template_id: selectedTemplate ? selectedTemplate.id : null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handlePreview = async () => {
        setPreviewLoading(true);
        setPreviewUrl('');
        
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            const value = data[key] === null ? '' : data[key];
            if (key === 'logo' && value instanceof File) {
                 formData.append(key, value);
            } else if (key !== 'logo') {
                 formData.append(key, value);
            }
        });

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
            const response = await fetch(route("laporan.preview.live"), {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": token,
                    "Accept": "text/html",
                    "X-Requested-With": "XMLHttpRequest", 
                },
                credentials: 'include', 
            });

            if (response.status === 419) {
                throw new Error("Sesi kadaluarsa (419). Silakan refresh halaman.");
            }
            if (!response.ok) throw new Error("Gagal memuat preview.");
            
            const blob = await response.blob();
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(blob));
            setShowPreviewModal(true);
        } catch (error) {
            console.error("Preview Error:", error);
            const msg = error.message.includes("419") 
                ? "Sesi kamu sudah habis. Coba refresh halaman!" 
                : "Gagal menampilkan pratinjau. Pastikan data terisi.";
            alert(msg);
        } finally {
            setPreviewLoading(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("laporan.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-2xl text-slate-800 leading-tight">
                            Buat Laporan Baru 📝
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Isi detail di bawah untuk generate struktur laporan otomatis.
                        </p>
                    </div>
                    <Link
                        href={route('dashboard')}
                        className="text-sm font-medium text-slate-500 hover:text-slate-800 transition"
                    >
                        ← Kembali ke Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Buat Laporan Baru" />

            <div className="py-10">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* ✅ BADGE JIKA MENGGUNAKAN TEMPLATE */}
                    {selectedTemplate && (
                        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-indigo-800 font-bold text-lg">Menggunakan Template: {selectedTemplate.name}</h3>
                                <p className="text-indigo-600 text-sm mt-1">
                                    Setelah kamu menekan tombol <b>Simpan</b>, sistem akan otomatis membuat Bab & Sub-bab berdasarkan file template ini.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* KOLOM KIRI */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Card 1 */}
                            <div className="bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200 rounded-2xl">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg text-sm">1</span>
                                    Informasi Dasar
                                </h3>
                                
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <InputLabel htmlFor="report_type" value="Jenis Laporan" className="mb-1" />
                                            <SelectInput
                                                id="report_type"
                                                name="report_type"
                                                value={data.report_type}
                                                className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                onChange={handleInputChange}
                                                required
                                            >
                                                {report_types && report_types.length > 0 ? (
                                                    report_types.map(type => <option key={type} value={type}>{type}</option>)
                                                ) : (
                                                    <option value="">Pilih Jenis</option>
                                                )}
                                            </SelectInput>
                                            <InputError message={errors.report_type} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="tahun_ajaran" value="Tahun Ajaran" className="mb-1" />
                                            <TextInput 
                                                id="tahun_ajaran" 
                                                name="tahun_ajaran" 
                                                value={data.tahun_ajaran} 
                                                className="block w-full rounded-xl" 
                                                onChange={handleInputChange} 
                                                placeholder="Contoh: 2024/2025"
                                                required 
                                            />
                                            <InputError message={errors.tahun_ajaran} className="mt-2" />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="judul" value="Judul Laporan" className="mb-1" />
                                        <TextInput 
                                            id="judul" 
                                            name="judul" 
                                            value={data.judul} 
                                            className="block w-full rounded-xl font-medium" 
                                            onChange={handleInputChange} 
                                            placeholder="Masukkan judul lengkap laporan..."
                                            required 
                                        />
                                        <InputError message={errors.judul} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="instansi" value="Nama Institusi / Kampus" className="mb-1" />
                                        <TextInput 
                                            id="instansi" 
                                            name="instansi" 
                                            value={data.instansi} 
                                            className="block w-full rounded-xl" 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                        <InputError message={errors.instansi} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200 rounded-2xl">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg text-sm">2</span>
                                    Detail Akademik
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <InputLabel htmlFor="nama" value="Nama Penulis" className="mb-1" />
                                        <TextInput id="nama" name="nama" value={data.nama} className="block w-full rounded-xl bg-slate-50" onChange={handleInputChange} required />
                                        <InputError message={errors.nama} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nim" value="NIM / NISN" className="mb-1" />
                                        <TextInput id="nim" name="nim" value={data.nim} className="block w-full rounded-xl" onChange={handleInputChange} required placeholder="Nomor Induk Mahasiswa" />
                                        <InputError message={errors.nim} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="prodi" value="Program Studi / Jurusan" className="mb-1" />
                                        <TextInput id="prodi" name="prodi" value={data.prodi} className="block w-full rounded-xl" onChange={handleInputChange} required />
                                        <InputError message={errors.prodi} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="kota" value="Kota Domisili Kampus" className="mb-1" />
                                        <TextInput id="kota" name="kota" value={data.kota} className="block w-full rounded-xl" onChange={handleInputChange} required />
                                        <InputError message={errors.kota} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="mata_kuliah" value="Mata Kuliah / Topik" className="mb-1" />
                                        <TextInput id="mata_kuliah" name="mata_kuliah" value={data.mata_kuliah} className="block w-full rounded-xl" onChange={handleInputChange} required />
                                        <InputError message={errors.mata_kuliah} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="dosen_pembimbing" value="Dosen Pengampu / Pembimbing" className="mb-1" />
                                        <TextInput id="dosen_pembimbing" name="dosen_pembimbing" value={data.dosen_pembimbing} className="block w-full rounded-xl" onChange={handleInputChange} required />
                                        <InputError message={errors.dosen_pembimbing} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN */}
                        <div className="space-y-6">
                            
                            {/* Card 3 */}
                            <div className="bg-white p-6 shadow-sm ring-1 ring-slate-200 rounded-2xl">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Logo Institusi</h3>
                                
                                <div className="mb-4">
                                    <InputLabel htmlFor="logo_position" value="Posisi Logo" className="mb-1" />
                                    <SelectInput
                                        id="logo_position"
                                        name="logo_position"
                                        value={data.logo_position}
                                        className="block w-full rounded-xl border-slate-300"
                                        onChange={handleInputChange}
                                    >
                                        <option value="tengah">Tengah (Center)</option>
                                        <option value="kiri">Kiri (Left)</option>
                                        <option value="kanan">Kanan (Right)</option>
                                    </SelectInput>
                                </div>

                                <div className="mt-2">
                                    <FilePond
                                        files={files}
                                        onupdatefiles={fileItems => {
                                            setFiles(fileItems.map(fileItem => fileItem.file));
                                            const file = fileItems.length > 0 ? fileItems[0].file : null;
                                            if (data.logo !== file) {
                                                setData('logo', file);
                                            }
                                        }}
                                        allowMultiple={false}
                                        maxFiles={1}
                                        name="logo"
                                        labelIdle='Drag & Drop logo atau <span class="filepond--label-action">Cari</span>'
                                        storeAsFile={true}
                                        credits={false} 
                                        allowImagePreview={true}
                                        imagePreviewHeight={170}
                                        stylePanelLayout='integrated'
                                        imagePreviewMarkupShow={true}
                                    />
                                    <InputError message={errors.logo} className="mt-2" />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white p-6 shadow-xl shadow-slate-200 ring-1 ring-slate-200 rounded-2xl lg:sticky lg:top-8">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Aksi</h3>
                                
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        disabled={previewLoading || processing}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                                    >
                                        {previewLoading ? (
                                            <span className="animate-pulse">Loading...</span>
                                        ) : (
                                            <>
                                                <span>👁️</span> Pratinjau Cover
                                            </>
                                        )}
                                    </button>

                                    <PrimaryButton
                                        disabled={processing || previewLoading}
                                        className="w-full justify-center py-3 text-base font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-200"
                                    >
                                        {processing ? 'Menyimpan...' : '💾 Simpan & Lanjut'}
                                    </PrimaryButton>
                                </div>
                                <p className="text-xs text-center text-slate-400 mt-4">
                                    Laporan akan tersimpan di draft setelah tombol simpan ditekan.
                                </p>
                            </div>

                        </div>
                    </form>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {showPreviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setShowPreviewModal(false)}
                    />
                    <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                📄 Pratinjau Cover
                            </h3>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 bg-slate-100 p-4 overflow-hidden">
                            {previewUrl ? (
                                <iframe
                                    src={previewUrl}
                                    title="Preview"
                                    className="w-full h-full rounded-lg shadow-sm bg-white"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 bg-white border-t border-slate-100 text-right">
                             <button
                                onClick={() => setShowPreviewModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                            >
                                Tutup Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default Create;