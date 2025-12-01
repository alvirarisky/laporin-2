import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Background gradient */}
            <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-sky-900/40 via-slate-950 to-slate-950" />
            <div className="pointer-events-none fixed inset-y-0 right-0 -z-10 hidden w-1/2 bg-[radial-gradient(circle_at_top,_#0ea5e9_0,_transparent_55%)] md:block" />

            <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between gap-4 pb-10">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-400/40">
                                <span className="text-lg font-semibold text-sky-300">
                                    L
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold tracking-tight text-slate-100">
                                    Laporin
                                </p>
                                <p className="text-xs text-slate-400">
                                    Academic Report Platform
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden text-xs text-slate-400 sm:block">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-3 py-1 ring-1 ring-slate-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Area akun mahasiswa & dosen
                        </span>
                    </div>
                </header>

                <main className="flex flex-1 items-center justify-center pb-10">
                    <div className="w-full max-w-md">
                        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-6 shadow-2xl shadow-sky-900/40 backdrop-blur sm:px-8 sm:py-8">
                            {children}
                        </div>

                        <p className="mt-4 text-center text-xs text-slate-500">
                            Fokus, rapi, dan terukur untuk perjalanan akademik
                            kamu.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
