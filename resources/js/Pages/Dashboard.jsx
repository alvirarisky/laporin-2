import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, laporans }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* KARTU PINTU MASUK KE FITUR UTAMA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* KARTU #1: PINTU MASUK KE QUESTIFY */}
                        <div className="p-6 bg-white shadow sm:rounded-lg flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900">Questify questify</h3>
                            <p className="mt-2 text-sm text-gray-600 flex-grow">
                                Asah skill pemrograman dan logikamu melalui tantangan interaktif. Pilih mata kuliah dan selesaikan semua quest!
                            </p>
                            <Link
                                href={route('questify.index')} // <-- Ini mengarah ke GameController@index
                                className="mt-4 inline-block w-full text-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
                            >
                                Mulai Quest
                            </Link>
                        </div>

                        {/* KARTU #2: PINTU MASUK KE GENERATOR LAPORAN */}
                        <div className="p-6 bg-white shadow sm:rounded-lg flex flex-col">
                             <h3 className="text-lg font-bold text-gray-900">Generator Laporan</h3>
                             <p className="mt-2 text-sm text-gray-600 flex-grow">
                                Buat laporan akademik, praktikum, atau penelitian dengan format otomatis sesuai standar.
                            </p>
                            <Link
                                href={route('laporan.create')} // <-- Ini mengarah ke LaporanController@dashboard
                                className="mt-4 inline-block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                            >
                                + Buat Laporan Baru
                            </Link>
                        </div>
                    </div>

                    {/* BAGIAN RIWAYAT LAPORAN (INI TETAP SAMA) */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Laporan Terbaru</h3>
                        {/* Kode tabel riwayat laporan Anda bisa diletakkan di sini */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}