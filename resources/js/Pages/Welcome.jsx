import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const isAuthenticated = Boolean(auth?.user);

    return (
        <>
            <Head title="Laporin - Engineering Your Thesis" />

            {/* BACKGROUND GRID PATTERN & DARK MODE */}
            <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
                {/* Grid Halus */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                {/* Ambient Glow */}
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>

                {/* --- NAVBAR TRANSPARAN --- */}
                <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/60 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                            <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center font-black">L</div>
                            Laporin.
                        </div>
                        
                        {/* Navigasi Kanan */}
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <Link href={route('dashboard')} className="text-sm font-medium hover:text-indigo-400 transition flex items-center gap-1">
                                    Dashboard 
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-medium text-zinc-400 hover:text-white transition">Masuk</Link>
                                    <Link href={route('register')} className="px-4 py-2 bg-white text-black text-sm font-bold rounded hover:bg-zinc-200 transition">Daftar</Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
                    
                    {/* --- HERO SECTION (SPLIT LAYOUT) --- */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
                        
                        {/* Kiri: Teks & CTA */}
                        <div className="relative z-10">
                            {/* BADGE BARU (Sesuai Request) */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6 animate-fade-in">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                Platform Web Editor Laporan Akademik
                            </div>

                            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                                Buat Laporan Tanpa <br /> Drama Format.
                            </h1>
                            
                            <p className="text-lg text-zinc-400 max-w-lg mb-8 leading-relaxed">
                                Editor teks khusus mahasiswa dan pelajar. Otomatisasi format laporan standar kampus, ekspor instan, dan fitur gamifikasi biar nggak stres.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <Link href={isAuthenticated ? route('dashboard') : route('register')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02]">
                                    Mulai Menulis
                                </Link>
                                <a href="#features" className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold rounded-lg transition-all">
                                    Lihat Fitur
                                </a>
                            </div>
                        </div>

                        {/* Kanan: 3D Mockup (SKEWED) */}
                        <div className="relative group perspective-1000 hidden lg:block">
                            {/* Glow Effect Belakang */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            
                            {/* Kartu Browser Miring */}
                            <div className="relative transform rotate-y-[-12deg] rotate-x-[5deg] group-hover:rotate-y-[-5deg] group-hover:rotate-x-[2deg] transition-all duration-500 ease-out bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden aspect-[4/3]">
                                
                                {/* Browser Bar */}
                                <div className="h-8 bg-[#27272a] border-b border-white/5 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                                    </div>
                                    <div className="ml-4 px-2 py-0.5 rounded bg-black/20 text-[10px] font-mono text-zinc-500">
                                        laporin.app/editor/skripsi-final-banget
                                    </div>
                                </div>

                                {/* Konten Editor (Simulasi CSS) */}
                                <div className="flex h-full">
                                    {/* Sidebar Kecil */}
                                    <div className="w-16 sm:w-40 border-r border-white/5 bg-[#09090b] p-4 flex flex-col gap-3">
                                        <div className="h-3 w-16 bg-white/10 rounded animate-pulse mb-2"></div>
                                        <div className="h-8 w-full bg-indigo-500/20 border border-indigo-500/30 rounded flex items-center px-2 gap-2">
                                            <div className="w-1 h-3 bg-indigo-400 rounded-full"></div>
                                            <div className="h-1.5 w-12 bg-indigo-300/50 rounded"></div>
                                        </div>
                                        <div className="h-8 w-full bg-white/5 rounded flex items-center px-2 gap-2">
                                            <div className="h-1.5 w-16 bg-zinc-700 rounded"></div>
                                        </div>
                                        <div className="h-8 w-full bg-white/5 rounded flex items-center px-2 gap-2">
                                            <div className="h-1.5 w-10 bg-zinc-700 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Kertas Editor */}
                                    <div className="flex-1 bg-[#18181b] p-6 flex justify-center overflow-hidden relative">
                                        <div className="w-full max-w-[280px] h-[120%] bg-white rounded-t shadow-lg p-6 space-y-4 transform translate-y-2">
                                            {/* Dummy Text Lines */}
                                            <div className="h-4 w-3/4 bg-zinc-800 rounded mb-4"></div>
                                            <div className="space-y-2">
                                                <div className="h-2 w-full bg-zinc-200 rounded"></div>
                                                <div className="h-2 w-full bg-zinc-200 rounded"></div>
                                                <div className="h-2 w-5/6 bg-zinc-200 rounded"></div>
                                            </div>
                                            {/* Dummy Image Box */}
                                            <div className="h-24 w-full bg-indigo-50 rounded border border-indigo-100 flex items-center justify-center text-indigo-300 text-[10px] font-mono mt-4">
                                                [GAMBAR SKEMA]
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-2 w-full bg-zinc-200 rounded"></div>
                                                <div className="h-2 w-4/5 bg-zinc-200 rounded"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Floating Badge "Saved" */}
                                        <div className="absolute bottom-12 right-8 bg-emerald-500/90 backdrop-blur text-white px-3 py-1.5 rounded-full shadow-lg text-[10px] font-bold flex items-center gap-1.5 animate-bounce-slow border border-emerald-400/50">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            Auto-Saved
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BENTO GRID FEATURES (Kotak-Kotak Asimetris) --- */}
                    <div id="features" className="space-y-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white">Fitur Pintar.</h2>
                            <p className="text-zinc-400 mt-2">Didesain untuk kebutuhan akademik spesifik.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 auto-rows-[250px]">
                            
                            {/* Feature 1: GEDE (Format Otomatis) */}
                            <div className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-8 hover:border-indigo-500/50 transition-colors">
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20"></div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Auto-Format Skripsi</h3>
                                <p className="text-zinc-400 max-w-sm text-sm leading-relaxed">
                                    Margin 4-4-3-3? Font Times New Roman? Spasi 1.5? Lupakan setting manual di Word. Kami atur semuanya otomatis sesuai standar kampus.
                                </p>
                                <div className="absolute bottom-6 right-6 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/50 backdrop-blur border border-white/10 p-3 rounded-xl flex gap-3 items-center">
                                        <div className="h-10 w-10 bg-indigo-600 rounded flex items-center justify-center font-serif font-bold text-white text-xl">A</div>
                                        <div className="text-xs text-zinc-300">
                                            <div className="font-bold text-white">Times New Roman</div>
                                            <div>Size 12 • 1.5 Spacing</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2: KECIL (Export) */}
                            <div className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-8 hover:border-blue-500/50 transition-colors flex flex-col justify-between">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-zinc-900/0 to-zinc-900/0"></div>
                                <div>
                                    <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4 ring-1 ring-blue-500/40">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1 text-white">Export PDF & Docx</h3>
                                    <p className="text-sm text-zinc-500">Sekali klik, langsung jadi file siap cetak atau kirim ke dosen.</p>
                                </div>
                            </div>

                            {/* Feature 3: KECIL (Questify) */}
                            <div className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-8 hover:border-emerald-500/50 transition-colors flex flex-col justify-between">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-zinc-900/0 to-zinc-900/0"></div>
                                <div>
                                    <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mb-4 ring-1 ring-emerald-500/40">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1 text-white">Questify Mode</h3>
                                    <p className="text-sm text-zinc-500">Buntu nulis? Mainkan mini-game logika & SQL buat refreshing.</p>
                                </div>
                            </div>

                            {/* Feature 4: GEDE (Stats) */}
                            <div className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-8 hover:border-orange-500/50 transition-colors flex items-center">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                                <div className="z-10 relative">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Live Progress Tracking</h3>
                                    <p className="text-zinc-400 max-w-sm text-sm">
                                        Pantau jumlah kata, bab yang selesai, dan progres skripsimu secara real-time. Jangan biarkan deadline mengejar.
                                    </p>
                                </div>
                                {/* Hiasan Grafik Batang */}
                                <div className="absolute right-6 bottom-0 opacity-30 group-hover:opacity-80 transition-all duration-500 transform group-hover:scale-110 origin-bottom">
                                    <div className="flex gap-2 items-end">
                                        <div className="w-3 h-8 bg-zinc-800 rounded-t"></div>
                                        <div className="w-3 h-14 bg-zinc-800 rounded-t"></div>
                                        <div className="w-3 h-10 bg-zinc-800 rounded-t"></div>
                                        <div className="w-3 h-20 bg-orange-500 rounded-t shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* --- FOOTER --- */}
                    <footer className="mt-32 border-t border-white/5 pt-8 text-center pb-8">
                        <p className="text-zinc-600 text-sm">
                            © {new Date().getFullYear()} <span className="text-zinc-400 font-bold">Laporin</span>.
                        </p>
                    </footer>
                </main>
            </div>
        </>
    );
}