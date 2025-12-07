import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const gameTypeIcons = {
    css: '🎨',
    sql: '🗄️',
    math: '🔢',
    logic: '🧩',
    quiz: '📝',
};

const gameTypeColors = {
    css: 'from-purple-500 to-pink-500',
    sql: 'from-blue-500 to-cyan-500',
    math: 'from-green-500 to-emerald-500',
    logic: 'from-orange-500 to-red-500',
    quiz: 'from-yellow-500 to-amber-500',
};

const GameCard = ({ game }) => {
    const icon = gameTypeIcons[game.game_type] || '🎮';
    const gradient = gameTypeColors[game.game_type] || 'from-gray-500 to-gray-600';

    return (
        <Link
            href={route('questify.show', game.slug)}
            className="group relative flex flex-col gap-3 p-6 bg-white rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-400 overflow-hidden"
        >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {game.title}
                        </h4>
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
                            {game.game_type?.toUpperCase()}
                        </span>
                    </div>
                </div>
                <span className="px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full shadow-sm">
                    {game.levels_count ?? 0} Level
                </span>
            </div>
            
            <p className="relative text-sm text-slate-600 line-clamp-2">{game.description}</p>
            
            {/* Play button indicator */}
            <div className="relative flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Klik untuk bermain</span>
                <div className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-semibold">Play</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
};

const TopicCard = ({ topic }) => (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
        <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                    📚
                </div>
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-bold">Mata Kuliah</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{topic.name}</h3>
                </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{topic.description}</p>
        </div>

        {topic.games?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        ) : (
            <div className="text-sm text-slate-500 bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 text-center">
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Questify Game Arcade</h2>}
        >
            <Head title="Questify Lobby" />

            <div className="py-10 sm:py-14 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200 shadow-sm">
                            <span className="text-2xl">🎮</span>
                            <p className="text-sm uppercase tracking-[0.4em] text-indigo-600 font-black">
                                Questify 2.0
                            </p>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
                            Game Arcade
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Learning Center
                            </span>
                        </h1>
                        <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
                            Setiap Program Studi punya koleksi mata kuliah dan mini game berbeda. 
                            Pilih Prodi, jelajahi mata kuliah, dan mulai petualangan belajarmu!
                        </p>
                    </div>

                    {majors.length ? (
                        <>
                            {/* Major Tabs - Arcade Style */}
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {majors.map((major) => {
                                    const isActive = major.slug === activeMajor;
                                    return (
                                        <button
                                            key={major.id}
                                            onClick={() => setActiveMajor(major.slug)}
                                            className={`flex-shrink-0 px-6 py-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                                isActive
                                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/50 scale-105'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:shadow-lg'
                                            }`}
                                        >
                                            <p className="text-base font-bold">{major.name}</p>
                                            <p className={`text-xs mt-1 font-semibold ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                {major.topics?.length ?? 0} Mata Kuliah
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedMajor ? (
                                <div className="space-y-6">
                                    {/* Major Info Card */}
                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl border-2 border-indigo-500 shadow-2xl p-6 sm:p-8 text-white">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm uppercase tracking-[0.3em] text-indigo-200 font-bold mb-2">
                                                    Program Studi
                                                </p>
                                                <h2 className="text-3xl sm:text-4xl font-black mb-3">{selectedMajor.name}</h2>
                                                <p className="text-indigo-100 leading-relaxed text-lg">{selectedMajor.description}</p>
                                            </div>
                                            <div className="hidden sm:flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30">
                                                <span className="text-4xl">🎓</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Topics Grid */}
                                    <div className="space-y-6">
                                        {selectedMajor.topics?.length ? (
                                            selectedMajor.topics.map((topic) => (
                                                <TopicCard key={topic.id} topic={topic} />
                                            ))
                                        ) : (
                                            <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center">
                                                <div className="text-6xl mb-4">📭</div>
                                                <p className="text-slate-500 text-lg font-semibold">
                                                    Belum ada mata kuliah yang terdaftar di prodi ini.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center shadow-lg">
                            <div className="text-6xl mb-4">🎮</div>
                            <p className="text-slate-500 text-lg font-semibold mb-2">
                                Belum ada data Questify.
                            </p>
                            <p className="text-slate-400 text-sm">
                                Jalankan seeder untuk mengisi Program Studi dan Game.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
