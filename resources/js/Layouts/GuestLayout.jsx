import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#09090b] text-white relative overflow-hidden">
            
            {/* Background Grid Pattern (Sama kayak Landing Page) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px] pointer-events-none"></div>

            {/* Logo Section */}
            <div className="relative z-10 mb-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                        L
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-white group-hover:text-indigo-400 transition-colors">Laporin.</span>
                </Link>
            </div>

            {/* Card Form */}
            <div className="relative z-10 w-full sm:max-w-md mt-6 px-8 py-8 bg-[#18181b] border border-white/10 shadow-2xl overflow-hidden sm:rounded-2xl">
                {/* Glow Effect di atas card */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
                
                {children}
            </div>
        </div>
    );
}