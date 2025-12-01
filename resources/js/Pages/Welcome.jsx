import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const isAuthenticated = Boolean(auth?.user);

    const primaryCtaHref = isAuthenticated ? route('dashboard') : route('register');
    const primaryCtaLabel = isAuthenticated ? 'Buka Dashboard' : 'Daftar Sekarang';

    return (
        <>
            <Head title="Laporin – Asisten Laporan Akademik" />

            <div className="min-h-screen bg-slate-950 text-slate-100">
                {/* Background gradient */}
                <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-sky-900/40 via-slate-950 to-slate-950" />
                <div className="pointer-events-none fixed inset-y-0 right-0 -z-10 hidden w-1/2 bg-[radial-gradient(circle_at_top,_#0ea5e9_0,_transparent_55%)] md:block" />

                <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <header className="flex items-center justify-between gap-4 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-400/40">
                                <span className="text-lg font-semibold text-sky-300">
                                    L
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold tracking-tight text-slate-100">
                                    Laporin
                                </p>
                                <p className="text-xs text-slate-400">
                                    Academic Report & Questify Platform
                                </p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3 text-sm font-medium">
                            <Link
                                href={route('login')}
                                className="hidden rounded-full px-4 py-2 text-slate-200/80 transition hover:text-white md:inline-flex"
                            >
                                Masuk
                            </Link>

                            <Link
                                href={primaryCtaHref}
                                className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 md:text-sm"
                            >
                                {primaryCtaLabel}
                            </Link>
                        </nav>
                    </header>

                    {/* Main content */}
                    <main className="flex flex-1 flex-col gap-12 pb-10 pt-4 md:flex-row md:items-center">
                        {/* Hero text */}
                        <section className="md:w-1/2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-200 ring-1 ring-sky-500/30">
                                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Platform untuk mahasiswa & dosen
                            </div>

                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
                                Susun{' '}
                                <span className="text-sky-400">
                                    laporan akademik
                                </span>{' '}
                                dan belajar interaktif dalam satu tempat.
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                                Laporin membantu kamu menyusun laporan praktikum,
                                skripsi, maupun tugas akhir dengan struktur yang
                                rapi, template konsisten, dan preview langsung.
                                Lengkapi perjalanan belajarmu dengan{' '}
                                <span className="font-semibold text-sky-300">
                                    Questify
                                </span>
                                , game interaktif untuk melatih logika & SQL.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <Link
                                    href={primaryCtaHref}
                                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/35 transition hover:bg-sky-400"
                                >
                                    {primaryCtaLabel}
                                </Link>

                                {!isAuthenticated && (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center justify-center rounded-full border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-400 hover:text-white"
                                    >
                                        Saya sudah punya akun
                                    </Link>
                                )}
                            </div>

                            <dl className="mt-8 grid max-w-md grid-cols-2 gap-4 text-xs text-slate-300 sm:text-sm">
                                <div>
                                    <dt className="font-semibold text-slate-100">
                                        Fokus akademik
                                    </dt>
                                    <dd className="mt-1">
                                        Bab laporan, template, dan preview
                                        didesain khusus untuk kebutuhan kampus.
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-slate-100">
                                        Questify learning
                                    </dt>
                                    <dd className="mt-1">
                                        Latih logika & SQL lewat level game
                                        bertahap, bukan hanya soal teks.
                                    </dd>
                                </div>
                            </dl>
                        </section>

                        {/* Hero illustration / cards */}
                        <section className="md:w-1/2">
                            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-sky-900/40 backdrop-blur">
                                <div className="absolute -right-4 -top-4 rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/40">
                                    Demo Akademik
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-sky-300">
                                            Laporan Penelitian
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-50">
                                            Analisis Sistem Informasi Akademik
                                        </p>
                                        <p className="mt-2 text-xs text-slate-400">
                                            Bab: Pendahuluan · Metodologi ·
                                            Pembahasan · Penutup
                                        </p>
                                        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
                                            <div className="h-1.5 w-2/3 rounded-full bg-sky-400" />
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
                                            <p className="text-xs font-semibold text-slate-100">
                                                Template Kampus
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Konsisten dengan pedoman
                                                penulisan, termasuk margin,
                                                heading, dan sitasi.
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
                                            <p className="text-xs font-semibold text-slate-100">
                                                Questify Room
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Selesaikan level logika dan SQL
                                                untuk membuka bab laporan
                                                berikutnya.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-100">
                                                Siap dipakai untuk kelas
                                            </p>
                                            <p className="mt-1 text-[11px] text-slate-400">
                                                Cocok untuk tugas praktikum,
                                                project based learning, dan
                                                skripsi.
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end text-right">
                                            <span className="text-2xl font-semibold text-sky-400">
                                                0 →
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                Mulai dari halaman ini
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>

                    {/* Footer */}
                    <footer className="border-t border-slate-800 pt-4 text-xs text-slate-500 sm:text-[13px]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span>
                                Laravel v{laravelVersion} · PHP v{phpVersion}
                            </span>
                            <span className="text-slate-500">
                                Dibangun untuk lingkungan akademik modern.
                            </span>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
