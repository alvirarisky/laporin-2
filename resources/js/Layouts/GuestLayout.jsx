import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#09090b] text-white relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
            
            {/* BACKGROUND: Grid & Ambient Glow (Konsisten dengan Dashboard/Welcome) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]"></div>
            </div>

            {/* Logo Section */}
            <div className="relative z-10 mb-8 animate-fade-in-up">
                <Link href="/" className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform duration-300">
                        L
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-white group-hover:text-indigo-400 transition-colors">Laporin.</span>
                </Link>
            </div>

            {/* Card Form: Glass Panel */}
            <div className="relative z-10 w-full sm:max-w-md mt-4 px-8 py-8 bg-[#18181b]/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden sm:rounded-2xl ring-1 ring-white/5">
                {/* Top Border Gradient */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                
                {children}
            </div>
            
            <div className="mt-8 text-zinc-500 text-sm">
                &copy; {new Date().getFullYear()} Laporin Academic Workspace.
            </div>
        </div>
    );
}