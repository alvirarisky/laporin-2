import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react"; // Hapus 'router' jika tidak dipakai langsung di sini
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
// import QuestSidebar from "@/Components/QuestSidebar"; // Komponen ini belum ada, di-comment dulu
import SelectInput from "@/Components/SelectInput"; // Import SelectInput

// Terima report_types dari controller
const Create = ({ auth, report_type, report_types }) => {
    const [previewUrl, setPreviewUrl] = useState("");
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false); // State untuk loading preview

    const { data, setData, post, processing, errors, reset } = useForm({
        // Sesuaikan nama field dengan backend LaporanController@store dan model Laporan
        report_type: report_type || (report_types && report_types.length > 0 ? report_types[0] : ''), // Ambil dari props atau default
        judul: "",
        nama: auth.user.name || "", // Ambil nama user yg login
        nim: "",
        prodi: "",
        mata_kuliah: "",
        dosen_pembimbing: "",
        instansi: "",
        kota: "",
        tahun_ajaran: new Date().getFullYear() + "/" + (new Date().getFullYear() + 1), // Default tahun ajaran
        logo: null, // Untuk file upload
        logo_position: "tengah", // Default posisi logo
    });

    // --- Fungsi Input Change Handler ---
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setData(name, files[0]); // Ambil file pertama jika ada
        } else {
            setData(name, value);
        }
    };

    // --- PERBAIKAN: Fungsi Pratinjau ---
    const handlePreview = async () => {
        setPreviewLoading(true); // Mulai loading
        setPreviewUrl(''); // Kosongkan URL lama

        // Gunakan FormData untuk mengirim data + file
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            // Kirim string kosong jika value null/undefined, kecuali untuk file
            formData.append(key, data[key] === null && key !== 'logo' ? '' : data[key]);
        });

        try {
            const response = await fetch(route("laporan.preview.live"), {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                    "Accept": "text/html", // Minta response HTML
                },
            });

            if (!response.ok) {
                // Coba baca pesan error jika ada
                let errorText = `Gagal memuat pratinjau (Status: ${response.status})`;
                try {
                    const errorJson = await response.json();
                    errorText += `: ${errorJson.message || 'Error tidak diketahui'}`;
                    // Tampilkan validation errors jika ada
                    if (errorJson.errors) {
                         console.error("Validation Errors:", errorJson.errors);
                         // Bisa ditambahkan logic untuk menampilkan error validasi ke user
                    }
                } catch (e) { /* Abaikan jika response bukan JSON */ }
                throw new Error(errorText);
            }

            const blob = await response.blob();
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl); // Bersihkan URL lama
            }
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setShowPreviewModal(true);

        } catch (error) {
            console.error("Preview Error:", error);
            alert(`Gagal menampilkan pratinjau: ${error.message}`);
        } finally {
            setPreviewLoading(false); // Selesai loading
        }
    };

    // --- Fungsi Submit Form (Simpan Laporan) ---
    const submit = (e) => {
        e.preventDefault();
        // Inertia otomatis handle FormData jika ada file
        post(route("laporan.store"), {
            // Opsi tambahan jika perlu (misal: onSuccess, onError)
            // onSuccess: () => console.log('Sukses!'),
            // onError: (err) => console.error('Submit Error:', err),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Buat Laporan Baru {/* Tampilkan jenis laporan dari state */}
                    {data.report_type && `: ${data.report_type}`}
                </h2>
            }
        >
            {/* Sesuaikan title dengan jenis laporan */}
            <Head title={`Buat Laporan ${data.report_type ? `- ${data.report_type}` : ''}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Hapus Grid jika QuestSidebar belum siap */}
                    {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-6"> */}
                    {/* Kolom Kiri: Form Laporan */}
                    {/* <div className="lg:col-span-3 bg-white overflow-hidden shadow-xl sm:rounded-lg p-6"> */}
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-3xl p-8 border border-slate-200">
                        <div className="mb-8">
                            <h3 className="text-3xl font-bold text-slate-900 mb-2">
                            📝 Data Identitas Dokumen
                        </h3>
                            <p className="text-sm text-slate-600">
                                Isi informasi dasar untuk laporan akademik Anda
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* --- TAMBAHKAN DROPDOWN JENIS LAPORAN --- */}
                             <div>
                                <InputLabel htmlFor="report_type" value="Jenis Laporan" />
                                <SelectInput
                                    id="report_type"
                                    name="report_type"
                                    value={data.report_type}
                                    className="mt-1 block w-full"
                                    onChange={handleInputChange}
                                    required
                                >
                                    {/* Opsi dari controller */}
                                    {report_types && report_types.length > 0 ? (
                                        report_types.map(type => <option key={type} value={type}>{type}</option>)
                                    ) : (
                                        <option value="">Pilih Jenis</option> // Fallback jika tidak ada list
                                    )}
                                    {/* Atau hardcode jika tidak dikirim dari controller */}
                                    {/* <option value="Makalah">Makalah</option>
                                    <option value="Proposal">Proposal</option>
                                    <option value="Laporan Praktikum">Laporan Praktikum</option>
                                    <option value="Studi Kasus">Studi Kasus</option>
                                    <option value="Skripsi">Skripsi</option> */}
                                </SelectInput>
                                <InputError message={errors.report_type} className="mt-2" />
                            </div>

                            {/* Baris 1: Judul Laporan */}
                            <div>
                                <InputLabel htmlFor="judul" value="Judul Laporan *" />
                                <TextInput 
                                    id="judul" 
                                    name="judul" 
                                    value={data.judul} 
                                    className="mt-1 block w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" 
                                    onChange={handleInputChange} 
                                    required 
                                />
                                <InputError message={errors.judul} className="mt-2" />
                            </div>

                            {/* Grid untuk field yang lebih pendek */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Baris 2: Nama & NIM */}
                                <div>
                                    <InputLabel htmlFor="nama" value="Nama Penulis *" />
                                    <TextInput id="nama" name="nama" value={data.nama} className="mt-1 block w-full" onChange={handleInputChange} required />
                                    <InputError message={errors.nama} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="nim" value="NIM *" />
                                    <TextInput id="nim" name="nim" value={data.nim} className="mt-1 block w-full" onChange={handleInputChange} required />
                                    <InputError message={errors.nim} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Baris 3: Prodi, Mata Kuliah, Dosen */}
                                <div>
                                    <InputLabel htmlFor="prodi" value="Program Studi *" />
                                    <TextInput id="prodi" name="prodi" value={data.prodi} className="mt-1 block w-full" onChange={handleInputChange} required />
                                    <InputError message={errors.prodi} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="mata_kuliah" value="Mata Kuliah / Topik *" />
                                    <TextInput id="mata_kuliah" name="mata_kuliah" value={data.mata_kuliah} className="mt-1 block w-full" onChange={handleInputChange} required />
                                    <InputError message={errors.mata_kuliah} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="dosen_pembimbing" value="Dosen Pengampu *" />
                                    <TextInput id="dosen_pembimbing" name="dosen_pembimbing" value={data.dosen_pembimbing} className="mt-1 block w-full" onChange={handleInputChange} required />
                                    <InputError message={errors.dosen_pembimbing} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Baris 4: Instansi, Kota, Tahun Ajaran */}
                                <div>
                                    <InputLabel htmlFor="instansi" value="Nama Institusi *" />
                                    <TextInput id="instansi" name="instansi" value={data.instansi} className="mt-1 block w-full" onChange={handleInputChange} required />
                                    <InputError message={errors.instansi} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="kota" value="Kota Institusi *" />
                                    <TextInput id="kota" name="kota" value={data.kota} className="mt-1 block w-full" onChange={handleInputChange} required />
                                    <InputError message={errors.kota} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="tahun_ajaran" value="Tahun Ajaran *" />
                                    <TextInput id="tahun_ajaran" name="tahun_ajaran" value={data.tahun_ajaran} className="mt-1 block w-full" onChange={handleInputChange} required placeholder="Contoh: 2024/2025"/>
                                    <InputError message={errors.tahun_ajaran} className="mt-2" />
                                </div>
                            </div>

                             {/* --- TAMBAHKAN INPUT LOGO & POSISI --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="logo" value="Logo Institusi (.png, .jpg, .gif - Maks 2MB)" />
                                    {/* Input type file */}
                                    <input
                                        id="logo"
                                        type="file"
                                        name="logo"
                                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        accept="image/png, image/jpeg, image/gif" // Batasi tipe file
                                        onChange={handleInputChange} // Gunakan handler yang sama
                                    />
                                    {/* Tampilkan preview kecil jika logo sudah dipilih */}
                                    {data.logo && typeof data.logo === 'object' && (
                                        <img src={URL.createObjectURL(data.logo)} alt="Preview Logo" className="mt-2 h-16 w-auto border rounded"/>
                                    )}
                                    <InputError message={errors.logo} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="logo_position" value="Posisi Logo *" />
                                    <SelectInput
                                        id="logo_position"
                                        name="logo_position"
                                        value={data.logo_position}
                                        className="mt-1 block w-full"
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="kiri">Kiri</option>
                                        <option value="tengah">Tengah</option>
                                        <option value="kanan">Kanan</option>
                                    </SelectInput>
                                    <InputError message={errors.logo_position} className="mt-2" />
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8 gap-4">
                                <button
                                    type="button"
                                    onClick={handlePreview}
                                    className={`inline-flex items-center gap-2 px-6 py-3 bg-slate-600 border border-transparent rounded-xl font-semibold text-sm text-white hover:bg-slate-700 active:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl ${previewLoading || processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={previewLoading || processing}
                                >
                                    {previewLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Memuat...
                                        </>
                                    ) : (
                                        <>
                                            <span>👁️</span>
                                            Preview Cover
                                        </>
                                    )}
                                </button>

                                <PrimaryButton 
                                    disabled={processing || previewLoading}
                                    className="px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            💾 Simpan & Lanjutkan ke Editor
                                        </>
                                    )}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Kolom Kanan: Quest Sidebar (Commented Out) */}
                    {/* <div className="lg:col-span-1">
                        <QuestSidebar formData={data} quests={quests} />
                    </div> */}
                    {/* </div> */}
                </div>
            </div>

            {/* --- PERBAIKAN: Modal untuk Live Preview --- */}
            {showPreviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={() => setShowPreviewModal(false)}>
                    <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col shadow-2xl transform transition-all duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                            <h2 className="text-xl font-bold text-gray-800">
                                Live Preview Cover
                            </h2>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="text-gray-500 hover:text-gray-800 text-3xl font-light leading-none"
                                aria-label="Tutup Pratinjau"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="flex-grow p-2 bg-gray-200 overflow-y-auto">
                            {previewUrl ? (
                                <iframe
                                    src={previewUrl}
                                    title="Preview Laporan"
                                    className="w-full h-full border-0 rounded" // Hilangkan border iframe jika tidak perlu
                                    onLoad={() => URL.revokeObjectURL(previewUrl)} // Revoke URL setelah iframe selesai load
                                ></iframe>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">Memuat pratinjau...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default Create;