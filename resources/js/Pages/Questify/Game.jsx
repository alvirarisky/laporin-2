import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

const chibiAssets = {
    default: '/images/chibi-default.png',
    happy: '/images/chibi-happy.png',
    sad: '/images/chibi-sad.png',
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
    return (
        <div className="relative flex items-center gap-3 bg-white/90 border border-indigo-100 rounded-2xl px-4 py-3 shadow">
            <img src={src} alt="Chibi" className="w-16 h-16 object-contain" />
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-semibold">Chibi Coach</p>
                <p className="text-sm text-slate-700">{message}</p>
            </div>
        </div>
    );
};

const ConfettiOverlay = ({ visible }) => {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-5xl animate-bounce">🎊</div>
        </div>
    );
};

const CssPlayground = ({ level, userAnswer, onChange, disabled, shake }) => {
    const appliedStyle = useMemo(() => parseCssCode(userAnswer), [userAnswer]);

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <div className="bg-white rounded-3xl border border-indigo-100 shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-indigo-50 bg-indigo-50/60">
                    <p className="text-xs uppercase tracking-[0.4em] text-indigo-500 font-semibold">Visual Playground</p>
                    <h3 className="text-lg font-semibold text-slate-800">Preview Hasil</h3>
                </div>
                <div className="p-6 min-h-[260px] bg-gradient-to-b from-white to-indigo-50" style={appliedStyle}>
                    {level?.setup_html ? (
                        <div dangerouslySetInnerHTML={{ __html: level.setup_html }} className="prose max-w-none" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            Tambahkan CSS untuk melihat perubahan.
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-900 rounded-3xl shadow-lg border border-slate-800">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold">Kode Editor</p>
                    <span className="text-[10px] text-slate-400">Visual Studio Mode</span>
                </div>
                <textarea
                    id="answer-input"
                    className={`w-full h-64 bg-transparent text-white font-mono text-sm p-6 focus:outline-none focus:ring-0 ${shake ? 'animate-shake' : ''}`}
                    value={userAnswer}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder="display:flex; justify-content:center;"
                />
            </div>
        </div>
    );
};

const SqlWorkspace = ({ level, userAnswer, onChange, disabled, shake }) => (
    <div className="space-y-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500 font-semibold">Database Detective</p>
                <h3 className="text-lg font-semibold text-slate-800">Data Sampel</h3>
            </div>
            <div className="p-6 overflow-auto">
                {level?.setup_html ? (
                    <div dangerouslySetInnerHTML={{ __html: level.setup_html }} className="min-w-full" />
                ) : (
                    <div className="text-sm text-slate-500">Dataset tidak tersedia untuk level ini.</div>
                )}
            </div>
        </div>

        <div className="bg-slate-900 rounded-3xl shadow-lg border border-slate-800">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-300 font-semibold">SQL Terminal</p>
                <span className="text-[10px] text-slate-400">psql @localhost</span>
            </div>
            <textarea
                id="answer-input"
                className={`w-full h-56 bg-transparent text-white font-mono text-sm p-6 focus:outline-none focus:ring-0 ${shake ? 'animate-shake' : ''}`}
                value={userAnswer}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder="SELECT * FROM mahasiswa;"
            />
        </div>
    </div>
);

const BlackboardWorkspace = ({ level, userAnswer, onChange, disabled, shake }) => (
    <div className="bg-white rounded-3xl border border-amber-100 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-100 bg-amber-50 flex items-center justify-between">
            <div>
                <p className="text-xs uppercase tracking-[0.4em] text-amber-500 font-semibold">Chibi's Blackboard</p>
                <h3 className="text-lg font-semibold text-slate-800">Kerjakan soal di papan</h3>
            </div>
            <span className="text-xs text-amber-500 font-semibold">{level?.level ?? 1}</span>
        </div>
        <div className="p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-amber-50/60">
            <div className="bg-white/90 rounded-2xl p-4 border border-amber-100 shadow-inner">
                <p className="text-slate-700 text-base leading-relaxed">{level?.instruction}</p>
            </div>
            <input
                id="answer-input"
                type="text"
                className={`w-full p-4 rounded-2xl text-lg font-semibold tracking-wide border-2 border-slate-200 bg-white text-gray-900 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 ${shake ? 'animate-shake' : ''}`}
                value={userAnswer}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder="Tulis jawaban di sini..."
            />
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
                setTimeout(() => setShowConfetti(false), 1800);
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
            setStatusTone('error');
            setStatusMessage(error?.response?.data?.message ?? 'Terjadi kesalahan pada server. Coba lagi.');
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
        if (theme === 'css') {
            return (
                <CssPlayground
                    level={currentLevel}
                    userAnswer={userAnswer}
                    onChange={setUserAnswer}
                    disabled={isChecking || journeyComplete}
                    shake={shouldShake}
                />
            );
        }
        if (theme === 'sql') {
            return (
                <SqlWorkspace
                    level={currentLevel}
                    userAnswer={userAnswer}
                    onChange={setUserAnswer}
                    disabled={isChecking || journeyComplete}
                    shake={shouldShake}
                />
            );
        }
        return (
            <BlackboardWorkspace
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
            `}</style>
        </AuthenticatedLayout>
    );
}
