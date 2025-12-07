import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

// Path absolut statis untuk mencegah error 404
const chibiDefault = '/images/chibi-default.png';
const chibiHappy = '/images/chibi-happy.png';
const chibiSad = '/images/chibi-default.png'; // Fallback jika chibi-sad.png tidak ada
const iceCream = '/images/ice-cream.png';

const chibiAssets = {
    default: chibiDefault,
    happy: chibiHappy,
    sad: chibiSad,
};

const statusThemes = {
    info: 'bg-blue-50 text-blue-700 border border-blue-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    error: 'bg-rose-50 text-rose-700 border border-rose-100',
};

const parseCssCode = (cssString) => {
    const style = {};
    const safe = typeof cssString === 'string' ? cssString : '';
    safe.split(';').forEach((rule) => {
        const [prop, value] = rule.split(':');
        if (prop && value) {
            const key = prop.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase());
            style[key] = value.trim();
        }
    });
    return style;
};

const LevelStepper = ({ levels, currentLevelIndex, progressMap }) => (
    <div className="flex flex-wrap gap-2">
        {levels.map((level, index) => {
            const progress = progressMap[level.id] ?? progressMap[String(level.id)];
            const isActive = index === currentLevelIndex;
            const isDone = progress?.status === 'completed';

            return (
                <div
                    key={level.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold tracking-wide transition ${
                        isDone
                            ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-200'
                            : isActive
                            ? 'bg-indigo-600 text-white border border-indigo-500 shadow-lg shadow-indigo-200'
                            : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center border border-current">
                        {index + 1}
                    </span>
                    Level {level.level}
                </div>
            );
        })}
    </div>
);

const ChibiCoach = ({ state, message }) => {
    const src = chibiAssets[state] ?? chibiAssets.default;
    const isHappy = state === 'happy';
    const isSad = state === 'sad';
    
    return (
        <div className="relative bg-white/90 border border-indigo-100 rounded-2xl p-4 shadow-lg">
            {/* Balon Bicara */}
            <div className="mb-3 relative bg-indigo-50 rounded-xl p-3 border border-indigo-200">
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-indigo-50 border-r border-b border-indigo-200 transform rotate-45"></div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-500 font-semibold mb-1">Chibi Coach</p>
                <p className="text-sm text-slate-700 leading-relaxed">{message}</p>
            </div>
            
            {/* Chibi Image dengan animasi */}
            <div className="flex justify-center">
                <img 
                    src={src} 
                    alt="Chibi" 
                    className={`w-20 h-20 object-contain transition-transform duration-300 ${
                        isHappy ? 'animate-bounce' : isSad ? 'opacity-75' : ''
                    }`}
                    onError={(e) => {
                        // Fallback jika gambar tidak ditemukan
                        e.target.src = chibiDefault;
                    }}
                />
            </div>
        </div>
    );
};

const ConfettiOverlay = ({ visible }) => {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="relative">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 0.5}s`,
                            animationDuration: `${1 + Math.random()}s`,
                        }}
                    >
                        {['🎉', '🎊', '✨', '⭐', '🌟'][Math.floor(Math.random() * 5)]}
                    </div>
                ))}
            </div>
        </div>
    );
};

// HACKER TERMINAL THEME - CSS/SQL (Split Screen Layout)
const HackerTerminalWorkspace = ({ level, userAnswer, onChange, disabled, shake, gameType }) => {
    const isCss = gameType === 'css';
    const appliedStyle = useMemo(() => (isCss ? parseCssCode(userAnswer) : {}), [userAnswer, isCss]);

    return (
        <div className={isCss ? 'grid gap-4 lg:grid-cols-2' : 'space-y-4'}>
            {/* Kiri: Visual Output/Preview */}
            {isCss && (
                <div className="bg-white rounded-3xl border border-indigo-100 shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-indigo-50 bg-indigo-50/60">
                        <p className="text-xs uppercase tracking-[0.4em] text-indigo-500 font-semibold">Visual Playground</p>
                        <h3 className="text-lg font-semibold text-slate-800">Preview Hasil</h3>
                    </div>
                    <div className="p-6 h-80 bg-blue-100">
                        {level?.setup_html ? (
                            <div 
                                className="h-full w-full"
                                style={appliedStyle}
                                dangerouslySetInnerHTML={{ __html: level.setup_html }} 
                            />
                        ) : (
                            <div className="h-full w-full" style={appliedStyle}>
                                <img 
                                    src="/images/chibi-default.png" 
                                    alt="Chibi" 
                                    style={{ width: '72px', height: '72px', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <img 
                                    src="/images/ice-cream.png" 
                                    alt="Target" 
                                    style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!isCss && level?.setup_html && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 font-semibold">Database Detective</p>
                        <h3 className="text-lg font-semibold text-slate-800">Data Sampel</h3>
                    </div>
                    <div className="p-6 overflow-auto max-h-[300px]">
                        <div dangerouslySetInnerHTML={{ __html: level.setup_html }} className="min-w-full" />
                    </div>
                </div>
            )}

            {/* Kanan: Code Editor (Terminal Style) */}
            <div className="bg-slate-900 rounded-3xl shadow-lg border-2 border-emerald-500/30 overflow-hidden">
                <div className="px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between bg-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <p className="ml-3 text-xs uppercase tracking-[0.4em] text-emerald-400 font-mono font-semibold">
                            {isCss ? 'CSS Terminal' : 'SQL Terminal'}
                        </p>
                    </div>
                    <span className="text-[10px] text-emerald-500/60 font-mono">root@hacker:~$</span>
                </div>
                <textarea
                    id="answer-input"
                    className={`w-full h-64 bg-slate-900 text-green-400 font-mono text-sm p-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none border-0 ${shake ? 'animate-shake' : ''}`}
                    style={{ 
                        color: '#4ade80',
                        caretColor: '#4ade80',
                        backgroundColor: '#0f172a',
                    }}
                    value={userAnswer}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder={isCss ? 'display:flex; justify-content:center;' : 'SELECT * FROM users;'}
                    spellCheck={false}
                />
            </div>
        </div>
    );
};

// ACADEMIC NOTEBOOK THEME - Math/Logic (Papan Tulis Style)
const AcademicNotebookWorkspace = ({ level, userAnswer, onChange, disabled, shake }) => (
    <div className="grid gap-4 lg:grid-cols-2">
        {/* Kiri: Soal di Papan Tulis */}
    <div className="bg-[#1a472a] rounded-3xl shadow-2xl border-4 border-[#2d5a3d] overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}></div>
        <div className="relative px-6 py-4 border-b-2 border-[#2d5a3d] bg-[#1a472a]/80">
            <div className="flex items-center justify-between">
                <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-white/70 font-semibold">Papan Tulis</p>
                        <h3 className="text-lg font-semibold text-white">Soal</h3>
                </div>
                <span className="text-xs text-white/60 font-semibold bg-white/10 px-3 py-1 rounded-full">
                    Level {level?.level ?? 1}
                </span>
            </div>
        </div>
            <div className="p-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm min-h-[200px]">
                <p className="text-white text-lg leading-relaxed font-medium" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                    {level?.instruction}
                </p>
            </div>
            </div>
        </div>

        {/* Kanan: Area Jawaban (Kertas) */}
        <div className="bg-stone-100 rounded-3xl shadow-xl border-2 border-stone-300 overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-stone-300 bg-white">
                <p className="text-xs uppercase tracking-[0.4em] text-stone-600 font-semibold">Jawaban</p>
                <h3 className="text-lg font-semibold text-stone-900">Tulis Jawabanmu</h3>
            </div>
            <div className="p-8">
            <input
                id="answer-input"
                type="text"
                    className={`w-full p-5 rounded-xl text-xl font-bold tracking-wide border-b-4 border-stone-400 bg-white text-gray-900 placeholder-stone-400 focus:outline-none focus:border-stone-600 focus:ring-4 focus:ring-stone-200 ${shake ? 'animate-shake' : ''}`}
                style={{ 
                        color: '#111827',
                        backgroundColor: '#ffffff',
                }}
                value={userAnswer}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder="Tulis jawaban di sini..."
            />
            </div>
        </div>
    </div>
);

// PAPER EXAM THEME - Quiz (Academic Notebook Style)
const PaperExamWorkspace = ({ level, userAnswer, onChange, disabled, shake }) => (
    <div className="grid gap-4 lg:grid-cols-2">
        {/* Kiri: Soal di Kertas */}
    <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
                <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 font-semibold">Kertas Ujian</p>
                    <h3 className="text-xl font-bold text-slate-900 mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                            Soal
                    </h3>
                </div>
                <span className="text-sm text-slate-600 font-semibold bg-slate-100 px-4 py-2 rounded-lg">
                    Soal #{level?.level ?? 1}
                </span>
            </div>
        </div>
            <div className="p-8 bg-white min-h-[200px]">
            <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-slate-400">
                <p className="text-slate-900 text-lg leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {level?.instruction}
                </p>
            </div>
            </div>
        </div>

        {/* Kanan: Area Jawaban */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500 font-semibold">Jawaban</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                    Tulis Jawabanmu
                </h3>
            </div>
            <div className="p-8 bg-white">
                <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                    Jawaban Anda:
                </label>
                <input
                    id="answer-input"
                    type="text"
                    className={`w-full p-5 rounded-xl text-lg font-semibold tracking-wide border-2 border-slate-300 bg-white text-gray-900 placeholder-slate-400 focus:ring-4 focus:ring-slate-200 focus:border-slate-500 ${shake ? 'animate-shake' : ''}`}
                    style={{ 
                        fontFamily: 'Georgia, serif',
                        color: '#111827',
                        backgroundColor: '#ffffff',
                    }}
                    value={userAnswer}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder="Ketik jawaban di sini..."
                />
            </div>
        </div>
    </div>
);

export default function Game({ auth, game, startLevelIndex = 0, progress = {} }) {
    const [levels, setLevels] = useState(game?.levels ?? []);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(startLevelIndex);
    const [userAnswer, setUserAnswer] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusTone, setStatusTone] = useState('info');
    const [showConfetti, setShowConfetti] = useState(false);
    const [chibiState, setChibiState] = useState('default');
    const [progressMap, setProgressMap] = useState(progress ?? {});
    const [journeyComplete, setJourneyComplete] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);

    const currentLevel = useMemo(() => levels[currentLevelIndex], [levels, currentLevelIndex]);
    const theme = game?.game_type ?? 'quiz';

    useEffect(() => {
        setLevels(game?.levels ?? []);
    }, [game]);

    useEffect(() => {
        setCurrentLevelIndex(startLevelIndex);
    }, [startLevelIndex]);

    useEffect(() => {
        if (!currentLevel) return;
        if (theme === 'css' || theme === 'sql') {
            setUserAnswer(currentLevel.initial_code ?? '');
        } else {
            setUserAnswer('');
        }
        setStatusMessage('');
        setStatusTone('info');
        setChibiState('default');
        setShouldShake(false);
    }, [currentLevel, theme]);

    useEffect(() => {
        setProgressMap(progress ?? {});
    }, [progress]);

    const persistProgress = async (status) => {
        if (!currentLevel) return;
        try {
            const { data } = await axios.post(route('api.game.storeProgress'), {
                game_id: game.id,
                level_id: currentLevel.id,
                status,
            });
            if (data?.progress) {
                setProgressMap((prev) => ({
                    ...prev,
                    [currentLevel.id]: data.progress,
                }));
            }
        } catch (error) {
            console.error('Gagal menyimpan progres', error);
        }
    };

    const triggerShake = () => {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 600);
    };

    const handleCheckAnswer = async () => {
        if (!currentLevel || isChecking) return;
        setIsChecking(true);
        setStatusTone('info');
        setStatusMessage('Memeriksa jawaban...');
        setChibiState('default');

        try {
            const { data } = await axios.post(route('api.game.checkAnswer'), {
                level_id: currentLevel.id,
                user_answer: userAnswer,
            });

            if (data.success) {
                setStatusTone('success');
                setStatusMessage(data.message || 'Jawaban tepat! 🎉');
                setChibiState('happy');
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 2500);
                await persistProgress('completed');

                setTimeout(() => {
                    const nextIndex = currentLevelIndex + 1;
                    if (nextIndex < levels.length) {
                        setCurrentLevelIndex(nextIndex);
                    } else {
                        setJourneyComplete(true);
                        setStatusTone('success');
                        setStatusMessage('Semua level selesai! 🎯');
                    }
                }, 1400);
            } else {
                setStatusTone('error');
                setStatusMessage(data.message || 'Masih ada yang salah, koreksi lagi ya!');
                setChibiState('sad');
                triggerShake();
                await persistProgress('failed');
            }
        } catch (error) {
            // Error handling yang lebih baik
            console.error('Error checking answer:', error);
            
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                if (status === 500) {
                    setStatusMessage('Gagal terhubung ke server, coba lagi nanti.');
                } else if (status === 422) {
                    setStatusMessage(error.response.data?.message || 'Jawaban tidak valid, coba lagi.');
                } else {
                    setStatusMessage(error.response.data?.message || 'Terjadi kesalahan, coba lagi.');
                }
            } else if (error.request) {
                // Request was made but no response received
                setStatusMessage('Gagal terhubung ke server. Periksa koneksi internet Anda.');
            } else {
                // Something else happened
                setStatusMessage('Terjadi kesalahan tidak terduga. Coba lagi.');
            }
            
            setStatusTone('error');
            setChibiState('sad');
            triggerShake();
        } finally {
            setIsChecking(false);
        }
    };

    const resetLevel = () => {
        if (!currentLevel) return;
        if (theme === 'css' || theme === 'sql') {
            setUserAnswer(currentLevel.initial_code ?? '');
        } else {
            setUserAnswer('');
        }
        setStatusMessage('');
        setStatusTone('info');
        setChibiState('default');
        setShouldShake(false);
    };

    const renderWorkspace = () => {
        if (theme === 'css' || theme === 'sql') {
            return (
                <HackerTerminalWorkspace
                    level={currentLevel}
                    userAnswer={userAnswer}
                    onChange={setUserAnswer}
                    disabled={isChecking || journeyComplete}
                    shake={shouldShake}
                    gameType={theme}
                />
            );
        }
        if (theme === 'math' || theme === 'logic') {
            return (
                <AcademicNotebookWorkspace
                    level={currentLevel}
                    userAnswer={userAnswer}
                    onChange={setUserAnswer}
                    disabled={isChecking || journeyComplete}
                    shake={shouldShake}
                />
            );
        }
        // Quiz type
        return (
            <PaperExamWorkspace
                level={currentLevel}
                userAnswer={userAnswer}
                onChange={setUserAnswer}
                disabled={isChecking || journeyComplete}
                shake={shouldShake}
            />
        );
    };

    if (!levels.length) {
        return (
            <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">{game?.title || 'Questify'}</h2>}>
                <Head title={game?.title || 'Questify'} />
                <div className="py-16">
                    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow p-10 text-center">
                        <p className="text-lg font-semibold text-slate-700">Level belum tersedia untuk game ini.</p>
                        <Link href={route('questify.index')} className="mt-6 inline-flex px-4 py-2 bg-indigo-600 text-white rounded-lg">
                            Kembali ke Lobby
                        </Link>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Questify · {game?.title}</h2>}>
            <Head title={`${game?.title} - Level ${currentLevel?.level ?? 1}`} />
            <ConfettiOverlay visible={showConfetti} />

            <div className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 min-h-screen py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow p-6 space-y-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                                    {game.topic?.name} · {game.topic?.major?.name}
                                </span>
                                <span className="text-slate-400">|</span>
                                <span>{levels.length} Level</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">{game.title}</h1>
                            <p className="text-slate-600">{game.description}</p>
                        </div>
                        <LevelStepper levels={levels} currentLevelIndex={currentLevelIndex} progressMap={progressMap} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 space-y-4">
                            {renderWorkspace()}
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white rounded-3xl border border-slate-100 shadow p-6 space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-semibold">Instruksi</p>
                                    <p className="text-lg text-slate-700">{currentLevel?.instruction}</p>
                                </div>

                                {statusMessage && (
                                    <div className={`p-4 rounded-2xl text-sm font-semibold ${statusThemes[statusTone]}`}>
                                        {statusMessage}
                                    </div>
                                )}

                                {journeyComplete && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-2">
                                        <p className="text-2xl">🎉</p>
                                        <p className="font-semibold text-amber-700">Semua level selesai! Kamu mengumpulkan total EXP maksimal.</p>
                                        <Link
                                            href={route('questify.index')}
                                            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold"
                                        >
                                            Kembali ke Lobby
                                        </Link>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={handleCheckAnswer}
                                        disabled={isChecking || journeyComplete}
                                        className={`flex-1 min-w-[150px] inline-flex items-center justify-center px-4 py-3 rounded-2xl font-semibold text-white transition ${
                                            isChecking || journeyComplete
                                                ? 'bg-indigo-300 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                        }`}
                                    >
                                        {isChecking ? 'Memeriksa…' : 'Cek Jawaban'}
                                    </button>
                                    <button
                                        onClick={resetLevel}
                                        disabled={isChecking}
                                        className="px-5 py-3 rounded-2xl font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                        Reset Level
                                    </button>
                                </div>

                                <div className="text-right">
                                    <Link href={route('questify.index')} className="text-sm text-indigo-600 hover:underline">
                                        ← Kembali ke Lobby
                                    </Link>
                                </div>
                            </div>

                            <ChibiCoach
                                state={chibiState}
                                message={
                                    chibiState === 'happy'
                                        ? 'Mantap! Jawabanmu tepat, lanjutkan petualangan!'
                                        : chibiState === 'sad'
                                        ? 'Hmm... coba cek lagi petunjuknya, kamu pasti bisa!'
                                        : 'Halo! Chibi siap bantu kamu menyelesaikan tantangan.'
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-6px); }
                    40%, 80% { transform: translateX(6px); }
                }
                .animate-shake { animation: shake 0.4s ease-in-out; }
                
                @keyframes confetti {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }
                .animate-confetti {
                    animation: confetti 1s ease-out forwards;
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce {
                    animation: bounce 0.6s ease-in-out infinite;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
