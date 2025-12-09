import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

// --- CONFIG & ASSETS ---
const gameAssets = {
    chibi: '/images/chibi-default.png',
    chibiHappy: '/images/chibi-happy.png',
    iceCream: '/images/ice-cream.png',
};

// --- UPDATE LOGIC TARGET (Posisi Ice Cream) ---
const levelTargets = {
    1: { justifyContent: 'flex-end' }, // Kanan
    2: { alignItems: 'flex-end' },     // Bawah (Sesuai request baru)
    3: { flexDirection: 'row-reverse' }, // Terbalik
};

// Helper: Parse CSS
const parseCssCode = (cssString) => {
    const style = {};
    const safe = typeof cssString === 'string' ? cssString : '';
    const cleanCss = safe.replace(/\/\*[\s\S]*?\*\//g, '');
    cleanCss.split(';').forEach((rule) => {
        const [prop, value] = rule.split(':');
        if (prop && value) {
            const key = prop.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase());
            style[key] = value.trim();
        }
    });
    return style;
};

// --- SUB-COMPONENTS ---

const LevelHeader = ({ levels, currentLevelIndex, progressMap }) => {
    const currentLevel = levels[currentLevelIndex];
    return (
        <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase font-mono mb-2 drop-shadow-md">
                <span className="text-indigo-500">LEVEL</span> {currentLevel?.level} <span className="text-zinc-500 text-lg">/ {levels.length}</span>
            </h2>
            <div className="flex gap-1.5">
                {levels.map((level, index) => {
                    const progress = progressMap[level.id] ?? progressMap[String(level.id)];
                    const isDone = progress?.status === 'completed';
                    const isActive = index === currentLevelIndex;
                    return (
                        <div key={level.id} className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? 'w-8 bg-indigo-500 shadow-[0_0_8px_#6366f1]' : isDone ? 'w-2 bg-emerald-500' : 'w-2 bg-zinc-800'}`} />
                    );
                })}
            </div>
        </div>
    );
};

// Update CSS ChibiCoach buat support Newline di Hint
const ChibiCoach = ({ state, message, tips }) => {
    const src = state === 'happy' ? gameAssets.chibiHappy : gameAssets.chibi;
    const isHappy = state === 'happy';
    const isSad = state === 'sad';

    return (
        <div className="flex flex-col items-center w-full relative z-10">
            <div className={`relative mb-3 px-5 py-4 rounded-2xl border text-left w-full shadow-lg transition-all duration-300 ${isHappy ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200' : isSad ? 'bg-rose-500/10 border-rose-500/50 text-rose-200' : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'}`}>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b border-r bg-inherit ${isHappy ? 'border-emerald-500/50' : isSad ? 'border-rose-500/50' : 'border-zinc-700'}`}></div>
                <div className="flex items-center gap-2 mb-1 border-b border-white/5 pb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{isHappy ? 'SUCCESS' : isSad ? 'OOPS' : 'HINT'}</span>
                </div>
                {/* Tambahin whitespace-pre-line biar \n dari database jadi baris baru */}
                <p className="text-sm font-medium leading-relaxed drop-shadow-md whitespace-pre-line">
                    {message || tips}
                </p>
            </div>
            <div className="relative h-48 w-full flex justify-center items-end">
                 <img src={src} alt="Chibi" className={`h-full object-contain transition-transform duration-300 origin-bottom ${isHappy ? 'animate-happy-hop' : 'animate-float-slow'} ${isSad ? 'grayscale opacity-75' : ''}`} onError={(e) => { e.target.src = gameAssets.chibi; }} />
            </div>
        </div>
    );
};

const HackerWorkspace = ({ level, userAnswer, onChange, disabled, shake, gameType }) => {
    const isCss = gameType === 'css';
    const appliedStyle = useMemo(() => (isCss ? parseCssCode(userAnswer) : {}), [userAnswer, isCss]);
    const targetStyle = levelTargets[level?.level] || {};

    return (
        <div className="flex flex-col lg:flex-row gap-5 h-full min-h-[500px]">
            <div className={`lg:w-5/12 w-full bg-[#0d0d0d] rounded-xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col ${shake ? 'animate-shake' : ''}`}>
                <div className="bg-[#151515] px-4 py-2 flex items-center justify-between border-b border-zinc-800">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div></div>
                    <span className="text-zinc-500 text-[10px] font-mono font-bold tracking-wider">CSS EDITOR</span>
                </div>
                <div className="flex-1 flex relative">
                    <div className="w-8 bg-[#111] border-r border-zinc-800 text-zinc-600 text-xs font-mono pt-4 text-right pr-2 select-none">1<br/>2<br/>3<br/>4</div>
                    <textarea
                        spellCheck="false"
                        className="flex-1 bg-[#0d0d0d] text-indigo-300 font-mono text-sm p-4 focus:outline-none resize-none leading-loose placeholder-white/10 border-none focus:ring-0"
                        value={userAnswer}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        placeholder={isCss ? ".container {\n  /* Bantu Chibi ambil Ice Cream! */\n}" : "SELECT ..."}
                    />
                </div>
            </div>

            <div className="lg:w-7/12 w-full flex flex-col gap-4">
                <div className="bg-[#151515] rounded-xl p-4 border border-zinc-800 shadow-sm flex gap-3 items-start">
                    <div className="bg-indigo-500/20 text-indigo-300 p-2 rounded-lg">🎯</div>
                    <div>
                        <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">MISSION GOAL</h4>
                        <p className="text-zinc-200 text-sm leading-relaxed font-medium">{level?.instruction}</p>
                    </div>
                </div>

                <div className="flex-1 bg-[#1a1a1a] rounded-xl border-4 border-zinc-800 overflow-hidden flex flex-col relative shadow-inner min-h-[300px]">
                    <div className="bg-zinc-900 border-b border-zinc-800 px-3 py-2 flex justify-between items-center z-10">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> LIVE PREVIEW
                        </span>
                    </div>
                    
                    <div className="flex-1 relative bg-zinc-900/50 p-6 overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        {isCss && (
                            <>
                                {/* TARGET (Ice Cream) - Layer Belakang */}
                                <div 
                                    className="absolute inset-0 p-6 flex z-0 opacity-50 grayscale transition-all duration-500 pointer-events-none"
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'flex-start', 
                                        justifyContent: 'flex-start',
                                        ...targetStyle 
                                    }}
                                >
                                    <div className="w-20 h-20 flex items-center justify-center animate-pulse">
                                        <img src={gameAssets.iceCream} alt="Goal" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                    </div>
                                </div>

                                {/* PLAYER (Chibi) - Layer Depan */}
                                <div 
                                    className="relative w-full h-full border-2 border-dashed border-zinc-700/50 rounded-xl bg-indigo-900/10 z-10 transition-all duration-500 ease-in-out"
                                    style={{
                                        display: 'flex', 
                                        gap: '12px',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        ...appliedStyle 
                                    }}
                                >
                                    <div className="w-20 h-20 flex items-center justify-center animate-item-bounce transition-all duration-500">
                                        <img src={gameAssets.chibi} alt="Player" className="w-full h-full object-contain drop-shadow-xl" />
                                    </div>
                                </div>
                            </>
                        )}

                        {!isCss && (
                             <div className="h-full flex flex-col items-center justify-center font-mono text-zinc-600 gap-3">
                                <div className="text-4xl opacity-20">🗄️</div>
                                <div className="text-xs">Database Output Area</div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AcademicWorkspace = ({ level, userAnswer, onChange, disabled, shake }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full items-stretch">
            <div className="flex-1 bg-[#1e1e1e] rounded-xl border-4 border-[#3a3a3a] shadow-2xl relative overflow-hidden flex flex-col min-h-[300px]">
                <div className="relative px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <span className="text-indigo-400 font-bold text-xs tracking-[0.2em]">PROBLEM STATEMENT</span>
                </div>
                <div className="relative p-8 flex-1 flex items-center justify-center">
                    <p className="text-zinc-200 text-lg md:text-xl font-serif text-center leading-relaxed">{level?.instruction}</p>
                </div>
            </div>
            <div className={`flex-1 bg-[#121212] rounded-xl border border-zinc-800 shadow-xl relative flex flex-col min-h-[300px] ${shake ? 'animate-shake' : ''}`}>
                <div className="px-6 py-4 border-b border-zinc-800 bg-[#1a1a1a] rounded-t-xl">
                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">YOUR ANSWER</h3>
                </div>
                <div className="flex-1 relative p-6">
                    <textarea 
                        value={userAnswer}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        placeholder="Type answer here..."
                        className="w-full h-full bg-transparent border-none focus:ring-0 text-zinc-300 text-lg font-mono leading-relaxed resize-none p-0 placeholder-zinc-700"
                    />
                </div>
            </div>
        </div>
    );
};

export default function Game({ auth, game, startLevelIndex = 0, progress = {} }) {
    const [levels] = useState(game?.levels ?? []);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(startLevelIndex);
    const [userAnswer, setUserAnswer] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [educationalTip, setEducationalTip] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [chibiState, setChibiState] = useState('default');
    const [progressMap, setProgressMap] = useState(progress ?? {});
    const [journeyComplete, setJourneyComplete] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);

    const currentLevel = useMemo(() => levels[currentLevelIndex], [levels, currentLevelIndex]);
    const theme = game?.game_type ?? 'quiz';
    const isCodingGame = theme === 'css' || theme === 'sql';

    useEffect(() => {
        if (!currentLevel) return;
        setUserAnswer(isCodingGame ? (currentLevel.initial_code ?? '') : '');
        setStatusMessage('');
        setChibiState('default');
        setShouldShake(false);

        if (currentLevel.hint) {
            setEducationalTip(currentLevel.hint);
        } else {
            setEducationalTip("Semangat! Kamu pasti bisa.");
        }

    }, [currentLevel, theme]);

    const handleCheckAnswer = async () => {
        if (!currentLevel || isChecking) return;
        setIsChecking(true);
        setStatusMessage('Sedang memeriksa...');
        
        try {
            const { data } = await axios.post(route('api.game.checkAnswer'), {
                level_id: currentLevel.id,
                user_answer: userAnswer,
            });

            if (data.success) {
                setStatusMessage('Mantap! Chibi berhasil dapat Ice Cream! 🍦');
                setChibiState('happy');
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 2500);
                setProgressMap(prev => ({ ...prev, [currentLevel.id]: { status: 'completed' } }));

                setTimeout(() => {
                    const nextIndex = currentLevelIndex + 1;
                    if (nextIndex < levels.length) {
                        setCurrentLevelIndex(nextIndex);
                    } else {
                        setJourneyComplete(true);
                        setStatusMessage('Selamat! Semua misi selesai!');
                    }
                }, 1500);
            } else {
                setStatusMessage(data.message || 'Yah, Chibi belum nyampe nih. Coba cek kodingannya lagi.');
                setChibiState('sad');
                setShouldShake(true);
                setTimeout(() => setShouldShake(false), 400);
            }
        } catch (error) {
            setStatusMessage('Error koneksi server.');
            setChibiState('sad');
        } finally {
            setIsChecking(false);
        }
    };

    if (!levels.length) return <AuthenticatedLayout user={auth.user}><div className="p-10 text-center text-white">Level kosong.</div></AuthenticatedLayout>;

    return (
        <AuthenticatedLayout user={auth.user} header={
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl text-white">{game?.title}</h2>
                <Link href={route('questify.index')} className="text-sm text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition-colors">Exit Game</Link>
            </div>
        }>
            <Head title={game?.title} />
            {showConfetti && <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">{[...Array(40)].map((_, i) => (<div key={i} className="absolute animate-confetti text-2xl" style={{ left: `${Math.random() * 100}%`, top: '-5%', animationDuration: `${1 + Math.random()}s` }}>{['✨', '🎉', '🍦', '🚀'][Math.floor(Math.random() * 4)]}</div>))}</div>}

            <div className="min-h-screen py-8 bg-[#09090b] font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <LevelHeader levels={levels} currentLevelIndex={currentLevelIndex} progressMap={progressMap} />
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="lg:w-3/12 w-full flex flex-col gap-5 sticky top-6 z-20">
                            <div className="bg-[#121212] rounded-2xl shadow-xl border border-zinc-800 p-5 flex flex-col items-center relative overflow-hidden">
                                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                                <ChibiCoach state={chibiState} message={statusMessage} tips={educationalTip} />
                                <div className="w-full mt-4 space-y-2 relative z-10">
                                    <button onClick={handleCheckAnswer} disabled={isChecking || journeyComplete} className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/5 ${isChecking ? 'bg-zinc-700 cursor-wait' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500'}`}>{isChecking ? 'Checking...' : 'RUN CODE ▶'}</button>
                                    <button onClick={() => setUserAnswer('')} className="w-full py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 hover:bg-[#1a1a1a] rounded-lg transition uppercase tracking-wider">RESET CODE</button>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-9/12 w-full">
                            {isCodingGame ? (
                                <HackerWorkspace level={currentLevel} userAnswer={userAnswer} onChange={setUserAnswer} disabled={isChecking} shake={shouldShake} gameType={theme} />
                            ) : (
                                <AcademicWorkspace level={currentLevel} userAnswer={userAnswer} onChange={setUserAnswer} disabled={isChecking} shake={shouldShake} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes item-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                .animate-item-bounce { animation: item-bounce 2s ease-in-out infinite; }
                @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
                .animate-float-slow { animation: float-slow 3s ease-in-out infinite; }
                @keyframes happy-hop { 0% { transform: translateY(0) scale(1); } 30% { transform: translateY(-15px) scale(1.05) rotate(2deg); } 50% { transform: translateY(0) scale(0.95) rotate(-2deg); } 70% { transform: translateY(-8px) scale(1.02) rotate(1deg); } 100% { transform: translateY(0) scale(1); } }
                .animate-happy-hop { animation: happy-hop 0.6s ease-in-out; }
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
                .animate-shake { animation: shake 0.3s ease-in-out; }
                @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
                .animate-confetti { animation: confetti 2.5s ease-out forwards; }
            `}</style>
        </AuthenticatedLayout>
    );
}