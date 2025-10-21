import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, laporans, flash }) {
    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
            router.delete(route("laporan.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Daftar Laporan Saya
                    </h2>
                    <Link
                        href={route("laporan.dashboard")} // <-- INI SOLUSINYA
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        + Buat Laporan Baru
                    </Link>
                </div>
            }
        >
            <Head title="Daftar Laporan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && (
                        <div
                            className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {flash.success}
                            </span>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {laporans.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {laporans.map((laporan) => (
                                        <li
                                            key={laporan.id}
                                            className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800">
                                                    {laporan.judul}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Mata Kuliah:{" "}
                                                    {laporan.mata_kuliah} -
                                                    Dibuat pada:{" "}
                                                    {new Date(
                                                        laporan.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </p>
                                            </div>
                                            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                                                <Link
                                                    href={route(
                                                        "laporan.edit",
                                                        laporan.id
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Editor
                                                </Link>
                                                <a
                                                    href={route(
                                                        "laporan.preview",
                                                        laporan.id
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    Preview
                                                </a>
                                                <a
                                                    href={route(
                                                        "laporan.download",
                                                        laporan.id
                                                    )}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Download
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(laporan.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>
                                    Anda belum memiliki laporan. Silakan buat
                                    laporan baru.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
