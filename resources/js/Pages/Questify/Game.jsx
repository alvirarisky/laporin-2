import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios'; // Import axios

// --- PERBAIKAN: Path Aset Chibi ---
// Pastikan path ini benar relatif terhadap folder public
const assetPath = '/assets/chibi/'; // Ganti jika path beda
const chibiDefault = assetPath + 'chibi-default.png';
const chibiHappy = assetPath + 'chibi-happy.png';
const chibiSad = assetPath + 'chibi-sad.png'; // Tambah Chibi Sedih
const iceCream = assetPath + 'ice-cream.png';

// Komponen Playground (Sama seperti sebelumnya, pastikan props sesuai)
const ChibiPlayground = ({ cssCode = '', setupHtml = '', targetCss = '', chibiState = 'default', showIceCream = false, gameComplete = false }) => {
    const parseCssCode = (cssString) => { /* ... (fungsi parse CSS tidak berubah) ... */
        const style = {};
        (cssString || '').split(';').forEach(rule => {
            const parts = rule.trim().split(':');
            if (parts.length === 2) {
                const cssProp = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                style[cssProp] = parts[1].trim();
            }
        });
        return style;
    };

    const pondStyle = { /* ... (style pond tidak berubah) ... */
        display: 'flex',
        minHeight: '200px',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        backgroundColor: '#e0f2fe',
        position: 'relative',
        overflow: 'hidden',
        ...parseCssCode(cssCode)
    };
    const targetStyle = { /* ... (style target tidak berubah) ... */
        position: 'absolute', width: '50px', height: '50px', zIndex: 10,
        ...parseCssCode(targetCss)
    };

    let chibiSrc;
    switch (chibiState) {
        case 'happy': chibiSrc = chibiHappy; break;
        case 'sad': chibiSrc = chibiSad; break;
        default: chibiSrc = chibiDefault;
    }
    const chibiClass = `transition-transform duration-500 ${chibiState === 'happy' ? 'animate-bounce' : ''}`;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-inner mb-6 relative">
             <div className="relative" style={pondStyle}>
                 {/* Setup HTML dari backend */}
                 {setupHtml && <div dangerouslySetInnerHTML={{ __html: setupHtml }} className="flex items-end w-full h-full"></div>}

                 {/* Chibi (Jika tidak ada di setupHtml) */}
                 {!setupHtml?.includes('class="chibi"') && (
                     <img src={chibiSrc} alt="Chibi" className={chibiClass} style={{ width: '50px', height: '50px', zIndex: 20 }} />
                 )}

                 {/* Target (Es Krim) - Tampilkan jika showIceCream true */}
                 {showIceCream && <img src={iceCream} alt="Target" style={targetStyle} />}

                 {/* Efek saat game selesai */}
                 {gameComplete && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black bg-opacity-50 rounded-lg">
                         <span className="text-6xl animate-ping">🎉</span>
                         <span className="text-white text-2xl font-bold absolute bottom-5">Level Selesai!</span>
                     </div>
                 )}
            </div>
        </div>
    );
};


// --- Komponen Utama Game ---
export default function Game({ auth, game, startLevelIndex }) { // Terima 'game' & 'startLevelIndex' dari props
    // --- PERBAIKAN: State Management ---
    const [levels, setLevels] = useState([]);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(startLevelIndex || 0); // Mulai dari index yg dikirim backend
    const [userAnswer, setUserAnswer] = useState('');
    const [chibiState, setChibiState] = useState('default'); // 'default', 'happy', 'sad'
    const [showIceCream, setShowIceCream] = useState(false); // Untuk reward visual
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading saat cek jawaban
    const [levelComplete, setLevelComplete] = useState(false); // Animasi per level
    const [allLevelsComplete, setAllLevelsComplete] = useState(false); // Popup akhir

    // --- PERBAIKAN: Ambil Level dari Props (Bukan Fetch) ---
    useEffect(() => {
        if (game && game.levels && game.levels.length > 0) {
            setLevels(game.levels);
            // Index awal sudah di-set dari props 'startLevelIndex'
            // setCurrentLevelIndex(startLevelIndex || 0); // Tidak perlu set lagi di sini
        } else {
            setFeedbackMessage("Gagal memuat level. Data tidak ditemukan.");
        }
    }, [game]); // Re-run jika game berubah

    const currentLevel = levels[currentLevelIndex];

    // --- Reset State saat Level Berubah ---
    useEffect(() => {
        if (currentLevel) {
            setUserAnswer(currentLevel.initial_code || ''); // Kode awal dari backend
            setFeedbackMessage('');
            setChibiState('default');
            setShowIceCream(false);
            setLevelComplete(false);
            setAllLevelsComplete(false); // Reset popup akhir juga
        }
        // Pastikan currentLevelIndex tidak out of bounds setelah reset
        if (currentLevelIndex >= levels.length && levels.length > 0) {
             setCurrentLevelIndex(levels.length - 1);
        }

    }, [currentLevelIndex, levels]); // Jalankan saat index atau data levels berubah

    // --- PERBAIKAN: Fungsi Cek Jawaban (Pakai Axios ke API) ---
    const checkAnswer = async () => {
        if (!currentLevel || isLoading) return;

        setIsLoading(true);
        setFeedbackMessage('Memeriksa jawaban...');
        setChibiState('default'); // Kembali ke default saat loading
        setShowIceCream(false);

        try {
            // Panggil API checkAnswer
            const response = await axios.post(route('api.game.checkAnswer'), {
                level_id: currentLevel.id,
                user_answer: userAnswer,
            });

            const { success, message } = response.data;

            if (success) {
                setChibiState('happy');
                setShowIceCream(true); // Tampilkan es krim
                setLevelComplete(true); // Animasi level selesai
                setFeedbackMessage(message || `Benar! ✨ Level ${currentLevel.level} Selesai!`);

                // --- Pindah Level atau Selesai ---
                setTimeout(() => {
                    const nextLevelIndex = currentLevelIndex + 1;
                    if (nextLevelIndex < levels.length) {
                        setCurrentLevelIndex(nextLevelIndex);
                        // State akan di-reset oleh useEffect [currentLevelIndex, levels]
                    } else {
                        // Semua level selesai
                        setFeedbackMessage('🎉 Chibi berhasil mendapatkan ice cream! +20 EXP');
                        setAllLevelsComplete(true); // Tampilkan popup akhir
                    }
                }, 2500); // Tunggu 2.5 detik

            } else {
                setChibiState('sad'); // Chibi sedih
                setShowIceCream(false);
                setFeedbackMessage(message || 'Jawaban Salah. Coba lagi! 🤔');
                // Animasi shake (opsional)
                const editor = document.getElementById('editor');
                if (editor) {
                    editor.classList.add('animate-shake');
                    setTimeout(() => editor.classList.remove('animate-shake'), 500);
                }
            }

        } catch (error) {
            console.error("Check Answer Error:", error);
            setChibiState('sad');
            setFeedbackMessage("Oops, terjadi kesalahan saat memeriksa jawaban.");
            // Tampilkan detail error jika dari backend (misal: validasi)
             if (error.response && error.response.data && error.response.data.message) {
                 setFeedbackMessage(`Error: ${error.response.data.message}`);
             }
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi Reset Kode (Sama)
    const resetLevel = () => { /* ... (fungsi reset tidak berubah) ... */
        if (currentLevel) {
            setUserAnswer(currentLevel.initial_code || '');
            setFeedbackMessage('');
            setChibiState('default');
            setLevelComplete(false);
            setShowIceCream(false);
        }
    }

    // Tampilan Loading Awal (jika perlu, tapi data harusnya sudah ada di props)
    // if (!game || !levels.length) { ... }

    // Tampilan Jika Tidak Ada Level (Harusnya sudah ditangani useEffect)
     if (!levels.length && !isLoading) { /* ... (tampilan error/kembali ke lobby) ... */
         return (
             <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">{game?.title || "Error"}</h2>}>
                 <Head title={game?.title || "Error"} />
                 <div className="py-12"><div className="max-w-4xl mx-auto text-center">
                     <p className="text-red-600 font-semibold">{feedbackMessage || "Tidak ada level yang ditemukan."}</p>
                     <Link href={route('questify.index')} className="text-indigo-600 hover:underline mt-4 inline-block">Kembali ke Lobby</Link>
                 </div></div>
             </AuthenticatedLayout>
         );
     }


    // Tampilan Game Utama
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Bermain: {game?.title || 'Game'}</h2>}
        >
            <Head title={`Level ${currentLevel?.level || ''} - ${game?.title || 'Game'}`} />
            <div className="py-6 sm:py-12 bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-0">
                    {/* Informasi Level dan Instruksi */}
                    {currentLevel && (
                        <div className="text-center mb-6">
                             <span className="inline-block bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                                 Level {currentLevel.level} / {levels.length}
                             </span>
                             <p className="text-lg text-gray-700 max-w-2xl mx-auto">{currentLevel.instruction}</p>
                        </div>
                    )}

                    {/* Area Playground Chibi */}
                    {currentLevel && (
                        <ChibiPlayground
                            cssCode={userAnswer} // Terapkan kode user ke playground
                            setupHtml={currentLevel.setup_html}
                            targetCss={currentLevel.target_css}
                            chibiState={chibiState}
                            showIceCream={showIceCream}
                            gameComplete={levelComplete} // Animasi per level
                        />
                    )}

                    {/* Area Editor Kode */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                         <label htmlFor="editor" className="block text-lg font-bold text-gray-700 mb-2">
                            Jawaban Anda: {/* Sesuaikan label jika bukan kode CSS */}
                        </label>
                        <textarea
                            id="editor"
                            className="w-full h-40 p-3 font-mono text-sm border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors duration-300"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Tulis jawaban di sini..."
                            spellCheck="false"
                            disabled={isLoading || levelComplete || allLevelsComplete} // Disable saat loading/selesai
                        ></textarea>

                        {/* Pesan Feedback */}
                        {feedbackMessage && (
                            <p className={`mt-3 p-3 rounded-lg font-semibold text-center ${
                                chibiState === 'happy' ? 'bg-green-100 text-green-700'
                                : chibiState === 'sad' ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700' // Pesan loading/info
                            }`}>
                                {feedbackMessage}
                            </p>
                        )}

                         {/* Popup Semua Level Selesai */}
                        {allLevelsComplete && (
                             <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-center">
                                 <h3 className="font-bold text-lg">🎉 Selamat! 🎉</h3>
                                 <p>Kamu telah menyelesaikan semua level di game ini!</p>
                                 <p className="mt-2">Chibi berhasil mendapatkan ice cream! +20 EXP</p>
                                 <Link href={route('questify.index')} className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                     Kembali ke Lobby
                                 </Link>
                             </div>
                        )}


                        {/* Tombol Aksi */}
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                onClick={checkAnswer}
                                className={`px-6 py-2 bg-indigo-600 text-white font-bold rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ${isLoading || levelComplete || allLevelsComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading || levelComplete || allLevelsComplete}
                            >
                                {isLoading ? 'Memeriksa...' : 'Cek Jawaban ✅'}
                            </button>
                            <button
                                onClick={resetLevel}
                                className={`px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ${isLoading || levelComplete || allLevelsComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading || levelComplete || allLevelsComplete}
                            >
                                Reset 🔄
                            </button>
                        </div>
                         <div className="mt-6 border-t pt-4">
                            <Link href={route('questify.index')} className="text-sm text-indigo-600 hover:underline">← Kembali ke Lobby Game</Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Tambahkan CSS untuk animasi shake */}
             <style>{`
                @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
                .animate-shake { animation: shake 0.5s ease-in-out; }
             `}</style>
        </AuthenticatedLayout>
    );
}