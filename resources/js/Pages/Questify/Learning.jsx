import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Learning({ auth, game, material }) {
    const [timeLeft, setTimeLeft] = useState(material.min_read_seconds);
    const [canStart, setCanStart] = useState(false);

    // Logic Timer Mundur
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanStart(true);
        }
    }, [timeLeft]);

    // Helper: Ubah link YouTube biasa jadi Embed biar bisa diputar
    const getEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) 
            ? `https://www.youtube.com/embed/${match[2]}` 
            : url;
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={<h2 className="font-bold text-xl text-zinc-100">Mission Briefing: {game.title}</h2>}
        >
            <Head title={`Belajar - ${game.title}`} />

            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CARD UTAMA */}
                <div className="bg-[#18181b] border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl relative">
                    
                    {/* Hiasan Efek Cahaya */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="p-8 relative z-10">
                        {/* Judul Materi */}
                        <div className="border-b border-zinc-700 pb-6 mb-6">
                            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                                PHASE 1: KNOWLEDGE UPLOAD
                            </span>
                            <h1 className="text-3xl font-black text-white mt-3 uppercase tracking-wide">
                                {material.title}
                            </h1>
                        </div>

                        {/* Video Section (Jika Ada) */}
                        {material.video_url && (
                            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-zinc-700 mb-8 shadow-lg">
                                <iframe 
                                    src={getEmbedUrl(material.video_url)} 
                                    className="w-full h-full"
                                    title="Learning Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        {/* Text Content */}
                        <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: material.content }} />
                        </div>
                    </div>

                    {/* Footer / Action Bar */}
                    <div className="bg-zinc-900/50 p-6 border-t border-zinc-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                        
                        {/* Status Timer */}
                        <div className="flex items-center gap-3">
                            {!canStart ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-zinc-400 text-sm font-mono">
                                        Wajib baca: <span className="text-white font-bold">{timeLeft}</span> detik lagi...
                                    </p>
                                </>
                            ) : (
                                <p className="text-emerald-400 text-sm font-mono flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Materi Selesai. Akses dibuka!
                                </p>
                            )}
                        </div>

                        {/* Tombol Mulai */}
                        <Link
                            href={route('questify.show', game.slug)}
                            as="button"
                            disabled={!canStart}
                            className={`px-8 py-3 rounded-full font-black tracking-wider transition-all transform duration-300 flex items-center gap-2 ${
                                canStart 
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] cursor-pointer' 
                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700 grayscale'
                            }`}
                        >
                            {canStart ? (
                                <>START MISSION 🚀</>
                            ) : (
                                <>LOCKED 🔒</>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}