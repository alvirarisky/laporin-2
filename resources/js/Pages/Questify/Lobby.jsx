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
    css: 'from-purple-600 to-pink-600',
    sql: 'from-blue-600 to-cyan-600',
    math: 'from-emerald-600 to-green-600',
    logic: 'from-orange-600 to-red-600',
    quiz: 'from-amber-500 to-yellow-600',
};

const GameCard = ({ game }) => {
    const icon = gameTypeIcons[game.game_type] || '🎮';
    const gradient = gameTypeColors[game.game_type] || 'from-zinc-500 to-zinc-600';

    return (
        <Link
            href={route('questify.show', game.slug)}
            className="group relative flex flex-col gap-3 p-6 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] overflow-hidden"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            <div className="relative flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg shadow-black/20 ring-1 ring-white/10`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-zinc-100 group-hover:text-white transition-colors">
                            {game.title}
                        </h4>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-400 rounded-md">
                            {game.game_type?.toUpperCase()}
                        </span>
                    </div>
                </div>
                <span className="px-3 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                    {game.levels_count ?? 0} Level
                </span>
            </div>
            
            <p className="relative text-sm text-zinc-400 line-clamp-2 leading-relaxed">{game.description}</p>
            
            <div className="relative flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                <span className="text-xs text-zinc-500 font-medium">Siap bermain?</span>
                <div className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-1 transition-transform group-hover:text-indigo-300">
                    <span className="text-sm font-bold">Start</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
};

const TopicCard = ({ topic }) => (
    <div className="bg-[#18181b]/60 backdrop-blur-sm rounded-3xl border border-white/5 p-6 sm:p-8 hover:border-white/10 transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <div className="flex flex-col gap-3 mb-8 relative z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30">
                    📚
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold">Mata Kuliah</p>
                    <h3 className="text-2xl font-black text-white mt-1">{topic.name}</h3>
                </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">{topic.description}</p>
        </div>

        {topic.games?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {topic.games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        ) : (
            <div className="text-sm text-zinc-500 bg-white/5 rounded-xl p-8 border border-dashed border-white/10 text-center relative z-10">
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
            header={<h2 className="font-bold text-xl text-white leading-tight">Questify Game Arcade</h2>}
        >
            <Head title="Questify Lobby" />

            <div className="py-10 sm:py-14 min-h-[80vh]">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur rounded-full border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                            <span className="text-xl animate-pulse">🎮</span>
                            <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-black">
                                Questify
                            </p>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
                            Game Arcade <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                Learning Center
                            </span>
                        </h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Koleksi mini game tiap prodi beda-beda, tinggal pilih prodimu dan gaskeun coba tantangannya!
                        </p>
                    </div>

                    {majors.length ? (
                        <>
                            {/* Major Tabs - Cyberpunk Style */}
                            {/* 🔥 PERBAIKAN: Ganti 'justify-center' jadi 'justify-start' biar bisa scroll dari kiri */}
                            <div className="flex gap-3 overflow-x-auto pb-4 px-4 scrollbar-hide justify-start">
                                {majors.map((major) => {
                                    const isActive = major.slug === activeMajor;
                                    return (
                                        <button
                                            key={major.id}
                                            onClick={() => setActiveMajor(major.slug)}
                                            className={`flex-shrink-0 px-6 py-4 rounded-xl border transition-all duration-300 relative overflow-hidden group whitespace-nowrap ${
                                                isActive
                                                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                                                    : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                                            }`}
                                        >
                                            <div className="relative z-10">
                                                <p className="text-base font-bold">{major.name}</p>
                                                <p className={`text-xs mt-1 font-medium ${isActive ? 'text-indigo-200' : 'text-zinc-500'}`}>
                                                    {major.topics?.length ?? 0} Mata Kuliah
                                                </p>
                                            </div>
                                            {/* Shine Effect */}
                                            {isActive && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>}
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedMajor ? (
                                <div className="space-y-8 animate-fade-in px-4 sm:px-0">
                                    {/* Major Info Card */}
                                    <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 text-white relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-20" style={{
                                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                                            backgroundSize: '40px 40px'
                                        }}></div>
                                        
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300 font-bold mb-2">
                                                    Program Studi Terpilih
                                                </p>
                                                <h2 className="text-3xl font-black mb-2">{selectedMajor.name}</h2>
                                                <p className="text-indigo-200/80 leading-relaxed max-w-2xl">{selectedMajor.description}</p>
                                            </div>
                                            <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-inner">
                                                <span className="text-4xl">🎓</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Topics Grid */}
                                    <div className="space-y-8">
                                        {selectedMajor.topics?.length ? (
                                            selectedMajor.topics.map((topic) => (
                                                <TopicCard key={topic.id} topic={topic} />
                                            ))
                                        ) : (
                                            <div className="bg-zinc-900/50 border border-dashed border-zinc-700 rounded-3xl p-12 text-center">
                                                <div className="text-4xl mb-4 opacity-50">📭</div>
                                                <p className="text-zinc-400 text-lg font-semibold">
                                                    Belum ada mata kuliah yang terdaftar di prodi ini.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-700 p-12 text-center">
                            <p className="text-zinc-500">
                                Belum ada data Questify. Jalankan seeder.
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