import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import QuestSidebar from "@/Components/QuestSidebar";
import SelectInput from "@/Components/SelectInput";

// Path relatif untuk aset statis di public/. Asumsi '/' adalah root public.
const BASE_URL = "/";

const Create = ({ auth, report_type, quests }) => {
    const [previewUrl, setPreviewUrl] = useState("");
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        report_type: report_type,
        judul: "",
        nama: auth.user.name,
        nim: "",
        prodi: "",
        mata_kuliah: "",
        dosen_pembimbing: "",
        instansi: "",
        kota: "",
        tahun_ajaran: "2025/2026",
        logo: null,
        logo_position: "tengah",
    });

    // --- Fungsi Pratinjau (Fixed: Menggunakan Inertia/Axios) ---
    const handlePreview = () => {
        // Menggunakan FormData untuk mengirim data multipart (termasuk file)
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key] || "");
        }

        // Mengirim data ke route preview-live (LaporanController@previewLive)
        // Kita menggunakan fetch manual/axios untuk POST request ke non-Inertia endpoint
        fetch(route("laporan.preview.live"), {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"), // Ambil CSRF token
            },
        })
            .then((response) => {
                if (response.ok) {
                    // Jika sukses, respons adalah HTML/Blade View murni.
                    // Kita perlu blob URL untuk menampilkannya di iframe.
                    return response.blob();
                }
                throw new Error("Gagal memuat pratinjau.");
            })
            .then((blob) => {
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl); // Bersihkan URL lama
                }
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                setShowPreviewModal(true);
            })
            .catch((error) => {
                console.error("Preview Error:", error);
                alert("Gagal menampilkan pratinjau: " + error.message);
            });
    };

    const submit = (e) => {
        e.preventDefault();
        // Route 'laporan.store' akan menjalankan LaporanController@store
        post(route("laporan.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Buat Laporan Baru: {data.report_type}
                </h2>
            }
        >
            <Head title={`Buat ${data.report_type}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Kolom Kiri: Form Laporan (3/4 Lebar) */}
                        <div className="lg:col-span-4 bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-2">
                                📝 Data Identitas Dokumen
                            </h3>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Baris 1: Judul Laporan */}
                                <div>
                                    <InputLabel
                                        htmlFor="judul"
                                        value="Judul Laporan"
                                    />
                                    <TextInput
                                        id="judul"
                                        type="text"
                                        name="judul"
                                        value={data.judul}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("judul", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.judul}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Baris 2: Nama & NIM */}
                                    <div>
                                        <InputLabel
                                            htmlFor="nama"
                                            value="Nama Penulis"
                                        />
                                        <TextInput
                                            id="nama"
                                            type="text"
                                            name="nama"
                                            value={data.nama}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("nama", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.nama}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nim" value="NIM" />
                                        <TextInput
                                            id="nim"
                                            type="text"
                                            name="nim"
                                            value={data.nim}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("nim", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.nim}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Baris 3: Prodi, Mata Kuliah, Dosen */}
                                    <div>
                                        <InputLabel
                                            htmlFor="prodi"
                                            value="Program Studi"
                                        />
                                        <TextInput
                                            id="prodi"
                                            type="text"
                                            name="prodi"
                                            value={data.prodi}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("prodi", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.prodi}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="mata_kuliah"
                                            value="Mata Kuliah / Bidang"
                                        />
                                        <TextInput
                                            id="mata_kuliah"
                                            type="text"
                                            name="mata_kuliah"
                                            value={data.mata_kuliah}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "mata_kuliah",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.mata_kuliah}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="dosen_pembimbing"
                                            value="Dosen Pengampu"
                                        />
                                        <TextInput
                                            id="dosen_pembimbing"
                                            type="text"
                                            name="dosen_pembimbing"
                                            value={data.dosen_pembimbing}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "dosen_pembimbing",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.dosen_pembimbing}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Baris 4: Instansi, Kota, Tahun Ajaran */}
                                    <div>
                                        <InputLabel
                                            htmlFor="instansi"
                                            value="Nama Institusi"
                                        />
                                        <TextInput
                                            id="instansi"
                                            type="text"
                                            name="instansi"
                                            value={data.instansi}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "instansi",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.instansi}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="kota"
                                            value="Kota Institusi"
                                        />
                                        <TextInput
                                            id="kota"
                                            type="text"
                                            name="kota"
                                            value={data.kota}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("kota", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.kota}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="tahun_ajaran"
                                            value="Tahun Ajaran"
                                        />
                                        <TextInput
                                            id="tahun_ajaran"
                                            type="text"
                                            name="tahun_ajaran"
                                            value={data.tahun_ajaran}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "tahun_ajaran",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.tahun_ajaran}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Baris 5: Logo dan Posisi */}
                                    <div>
                                        <InputLabel
                                            htmlFor="logo"
                                            value="Logo Institusi (.png/.jpg)"
                                        />
                                        <input
                                            id="logo"
                                            type="file"
                                            name="logo"
                                            className="mt-1 block w-full border border-gray-300 rounded-lg p-1"
                                            onChange={(e) =>
                                                setData(
                                                    "logo",
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.logo}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="logo_position"
                                            value="Posisi Logo"
                                        />
                                        <SelectInput
                                            id="logo_position"
                                            name="logo_position"
                                            value={data.logo_position}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "logo_position",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="kiri">Kiri</option>
                                            <option value="tengah">
                                                Tengah
                                            </option>
                                            <option value="kanan">Kanan</option>
                                        </SelectInput>
                                        <InputError
                                            message={errors.logo_position}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t mt-6">
                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-150"
                                        disabled={processing}
                                    >
                                        <i className="fas fa-eye mr-2"></i>{" "}
                                        Preview Cover
                                    </button>

                                    <PrimaryButton processing={processing}>
                                        <i className="fas fa-arrow-right mr-2"></i>{" "}
                                        Buat & Lanjutkan (Mulai Quest)
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal untuk Live Preview */}
            {showPreviewModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                Live Preview Cover
                            </h2>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="text-gray-500 hover:text-gray-800 text-2xl"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="flex-grow p-4">
                            {previewUrl ? (
                                <iframe
                                    src={previewUrl}
                                    className="w-full h-full border-2 border-gray-300 rounded-lg"
                                ></iframe>
                            ) : (
                                <p>Memuat pratinjau...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default Create;
