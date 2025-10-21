import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Komponen Chibi Playground (Diambil dari kode Anda sebelumnya, sedikit penyesuaian)
const ChibiPlayground = ({ cssCode = '', instruction = '...', isHappy = false, hasIceCream = false }) => {
    // Fungsi parse CSS tetap sama
    const parseCssCode = (cssString) => {
        const style = {};
        (cssString || '').split(';').forEach(rule => { // Tambahkan pengecekan null/undefined
            const parts = rule.trim().split(':');
            if (parts.length === 2) {
                const cssProp = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                style[cssProp] = parts[1].trim();
            }
        });
        return style;
    };
    const pondStyle = { display: 'flex', minHeight: '200px', border: '2px solid #3b82f6', borderRadius: '8px', backgroundColor: '#e0f2fe', ...parseCssCode(cssCode) };
    const chibiSrc = `/images/${isHappy ? 'chibi-happy.png' : 'chibi-default.png'}`;
    const chibiClass = `transition-transform duration-500 ${isHappy ? 'animate-bounce' : ''}`;
    const iceCreamSrc = '/images/ice-cream.png';

    return (
        <div className="bg-white p-6 rounded-xl shadow-inner mb-6">
            <p className="text-sm font-semibold mb-3 text-indigo-700">Instruksi: <span className="text-gray-600">{instruction}</span></p>
            <div className="relative p-2" style={pondStyle}>
                <img src={iceCreamSrc} alt="Target" className="w-10 h-10 absolute right-2 bottom-2" style={{ zIndex: 10 }} onError={(e) => { e.target.src = "https://placehold.co/40x40/f43f5e/ffffff?text=🍦" }} />
                <img src={chibiSrc} alt="Chibi" className={chibiClass} style={{ width: '40px', height: '40px', zIndex: 20 }} onError={(e) => { e.target.src = "https://placehold.co/40x40/1d4ed8/ffffff?text=C" }} />
                {hasIceCream && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <span className="text-6xl animate-ping">🎉</span>
                     </div>
                 )}
            </div>
        </div>
    );
};

// --- Komponen Utama Game ---
export default function Game({ auth, game }) { // Terima 'game' dari props Controller
    const levels = game?.levels || []; // Ambil data level dari props 'game'
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [isHappy, setIsHappy] = useState(false);
    const [hasIceCream, setHasIceCream] = useState(false);
    const [message, setMessage] = useState('');

    // Gunakan useForm untuk editor
    const { data, setData } = useForm({
        userCode: '',
    });

    const currentLevel = levels[currentLevelIndex]; // Gunakan level dari props

    // Set kode awal saat level berubah
    useEffect(() => {
        if (currentLevel) {
            // Gunakan initial_code dari data level
            setData('userCode', currentLevel.initial_code || '/* Tulis kode CSS di sini */');
            setMessage('');
            setIsHappy(false);
            setHasIceCream(false);
        }
    }, [currentLevelIndex, currentLevel]); // Tambahkan currentLevel sebagai dependency

    const checkAnswer = () => {
        if (!currentLevel) return;

        // Gunakan solution_code dari data level
        const solution = currentLevel.solution_code?.replace(/\s+/g, '').toLowerCase() || '';
        const input = data.userCode.replace(/\s+/g, '').toLowerCase();

        // Cek sederhana: apakah input mengandung semua bagian solusi
        const isCorrect = solution.split(';').filter(Boolean).every(part => input.includes(part));

        if (isCorrect) {
            setIsHappy(true);
            setHasIceCream(true);
            setMessage(`Benar! +${currentLevel.exp_reward || 20} EXP 🍦`);
            setTimeout(() => {
                setHasIceCream(false);
                if (currentLevelIndex < levels.length - 1) {
                    setCurrentLevelIndex(prev => prev + 1);
                } else {
                    setMessage('Selamat! Semua level selesai!');
                }
            }, 2000);
        } else {
            setIsHappy(false);
            setMessage('Jawaban Salah. Coba lagi!');
        }
    };

    const resetLevel = () => {
        if (currentLevel) {
            // Gunakan initial_code dari data level
            setData('userCode', currentLevel.initial_code || '');
            setMessage('');
            setIsHappy(false);
        }
    }

    // Tampilan jika data level belum siap atau sudah selesai
    if (!levels.length || !currentLevel) {
        return (
             <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">{game?.title || "Memuat Game..."}</h2>}>
                <Head title={game?.title || "Memuat..."} />
                <div className="py-12"><div className="max-w-4xl mx-auto text-center"><p>Memuat level game atau semua level telah selesai...</p> <Link href={route('questify.index')}>Kembali ke Lobby</Link></div></div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Bermain: {game.title}</h2>}
        >
            <Head title={`Bermain - ${game.title}`} />
            <div className="py-12 bg-indigo-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Gunakan data dari currentLevel */}
                    <p className="text-indigo-600 font-semibold mb-6 text-center">Level {currentLevel.level}</p>

                     <ChibiPlayground
                        cssCode={data.userCode}
                        instruction={currentLevel.instruction}
                        isHappy={isHappy}
                        hasIceCream={hasIceCream}
                    />

                    <div className="bg-white p-6 rounded-xl shadow-lg">
                         <label htmlFor="editor" className="block text-lg font-bold text-gray-700 mb-2">
                            Kode CSS Anda (.pond):
                        </label>
                        <textarea
                            id="editor"
                            className="w-full h-40 p-3 font-mono text-sm border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                            value={data.userCode}
                            onChange={(e) => setData('userCode', e.target.value)}
                            placeholder="Contoh: justify-content: flex-end;"
                        ></textarea>

                        {message && (
                            <p className={`mt-3 p-2 rounded-lg font-semibold ${isHappy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </p>
                        )}

                        <div className="mt-4 flex space-x-3">
                            <button onClick={checkAnswer} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full shadow-md hover:bg-indigo-700">
                                Cek Jawaban
                            </button>
                            <button onClick={resetLevel} className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-400">
                                Reset
                            </button>
                        </div>
                         <div className="mt-6">
                            <Link href={route('questify.index')} className="text-sm text-indigo-600 hover:underline">← Kembali ke Lobby</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}