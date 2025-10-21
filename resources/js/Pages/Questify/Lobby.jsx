import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Sub-komponen untuk setiap kartu Game
const GameCard = ({ game }) => (
    <Link
        href={route('questify.show', game.slug)} // Menggunakan route name dari web.php yang sudah diperbaiki
        className="block p-5 border rounded-lg hover:bg-indigo-50 transition-all duration-200 group"
    >
        <h4 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600">{game.title}</h4>
        <p className="text-sm text-gray-500 mt-1">{game.description}</p>
    </Link>
);

// Komponen utama Lobby
export default function Lobby({ auth, topics }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Questify Game Room</h2>}
        >
            <Head title="Questify Lobby" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 md:p-10">
                        
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-3">
                                Pilih Topik Petualanganmu!
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Ubah proses belajar menjadi sebuah game yang seru dan menantang. Pilih topik di bawah untuk memulai.
                            </p>
                        </div>

                        {topics.length > 0 ? (
                            <div className="space-y-12">
                                {topics.map((topic) => (
                                    <div key={topic.id}>
                                        {/* Judul Topik */}
                                        <div className="flex items-center mb-4">
                                            {/* Anda bisa menambahkan ikon di sini */}
                                            {/* <i className="fas fa-code text-2xl text-indigo-500 mr-3"></i> */}
                                            <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-indigo-200 pb-2">
                                                {topic.name}
                                            </h2>
                                        </div>
                                        
                                        {/* Daftar Game dalam Topik */}
                                        {topic.games && topic.games.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                                                {topic.games.map((game) => (
                                                    <GameCard key={game.id} game={game} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">
                                                Belum ada game yang tersedia untuk topik ini.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <h3 className="text-2xl font-bold text-gray-700">Oops!</h3>
                                <p className="text-gray-500 mt-2">Sepertinya belum ada topik quest yang tersedia saat ini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}