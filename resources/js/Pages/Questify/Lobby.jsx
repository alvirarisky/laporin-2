import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const GameCard = ({ game }) => (
    <Link
        href={route('questify.show', game.slug)}
        className="flex flex-col gap-2 p-5 bg-white/80 border border-indigo-50 rounded-xl shadow-sm hover:shadow-lg transition-all"
    >
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg text-gray-800">{game.title}</h4>
            <span className="px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-600 rounded-full">
                {game.levels_count ?? 0} Level
            </span>
        </div>
        <p className="text-sm text-gray-600">{game.description}</p>
    </Link>
);

const TopicCard = ({ topic }) => (
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col gap-2 mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-400 font-semibold">Mata Kuliah</p>
            <h3 className="text-2xl font-bold text-slate-800">{topic.name}</h3>
            <p className="text-sm text-slate-500">{topic.description}</p>
        </div>

        {topic.games?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        ) : (
            <div className="text-sm text-slate-500 bg-slate-50 rounded-xl p-4">
                Belum ada game untuk mata kuliah ini.
            </div>
        )}
    </div>
);

export default function Lobby({ auth, majors = [] }) {
    const [activeMajor, setActiveMajor] = useState(majors[0]?.slug ?? null);

    useEffect(() => {
        if (!activeMajor && majors.length) {
            setActiveMajor(majors[0].slug);
        }
    }, [majors, activeMajor]);

    const selectedMajor = useMemo(
        () => majors.find((major) => major.slug === activeMajor),
        [majors, activeMajor]
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Questify Game Room</h2>}
        >
            <Head title="Questify Lobby" />

            <div className="py-10 sm:py-14 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-3">
                        <p className="text-sm uppercase tracking-[0.4em] text-indigo-500 font-semibold">
                            Questify 2.0
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                            Pilih Program Studi & Mulai Petualanganmu
                        </h1>
                        <p className="text-slate-600 max-w-3xl mx-auto">
                            Setiap Program Studi punya koleksi mata kuliah dan mini game berbeda. Klik Prodi untuk
                            menjelajah, pilih mata kuliah, lalu mulai level yang kamu sukai.
                        </p>
                    </div>

                    {majors.length ? (
                        <>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {majors.map((major) => {
                                    const isActive = major.slug === activeMajor;
                                    return (
                                        <button
                                            key={major.id}
                                            onClick={() => setActiveMajor(major.slug)}
                                            className={`flex-shrink-0 px-5 py-3 rounded-2xl border transition-all ${
                                                isActive
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                                            }`}
                                        >
                                            <p className="text-sm font-semibold">{major.name}</p>
                                            <p className={`text-xs mt-1 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                {major.topics?.length ?? 0} Mata Kuliah
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedMajor ? (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-3xl border border-slate-100 shadow p-6 sm:p-8">
                                        <p className="text-sm text-indigo-500 font-semibold mb-2">Program Studi</p>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedMajor.name}</h2>
                                        <p className="text-slate-600">{selectedMajor.description}</p>
                                    </div>

                                    <div className="space-y-6">
                                        {selectedMajor.topics?.length ? (
                                            selectedMajor.topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)
                                        ) : (
                                            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
                                                Belum ada mata kuliah yang terdaftar di prodi ini.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                            Belum ada data Questify. Jalankan seeder untuk mengisi Program Studi dan Game.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}