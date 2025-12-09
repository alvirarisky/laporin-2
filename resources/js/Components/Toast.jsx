import { useEffect } from "react";

export default function Toast({ message, onClose }) {
    useEffect(() => {
        // Auto-hide setelah 3 detik
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-white shadow-xl shadow-slate-900/20 ring-1 ring-white/10">
                <span className="text-xl">🚧</span>
                <p className="text-sm font-medium">{message}</p>
            </div>
        </div>
    );
}