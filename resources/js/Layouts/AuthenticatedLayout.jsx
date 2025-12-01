import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const navItems = useMemo(
        () => [
            { label: 'Dashboard', route: route('dashboard'), active: route().current('dashboard') },
            { label: 'Template', route: route('templates.index'), active: route().current('templates.index') },
            { label: 'Questify', route: route('questify.index'), active: route().current('questify.index') },
        ],
        [],
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Background gradient */}
            <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-sky-900/40 via-slate-950 to-slate-950" />
            <div className="pointer-events-none fixed inset-y-0 right-0 -z-10 hidden w-1/2 bg-[radial-gradient(circle_at_top,_#0ea5e9_0,_transparent_55%)] md:block" />

            <nav className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center gap-2">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-400/40">
                                        <span className="text-base font-semibold text-sky-300">
                                            L
                                        </span>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-semibold tracking-tight text-slate-100">
                                            Laporin
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Academic Workspace
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            {/* Bagian Navigasi Desktop */}
                            <div className="hidden items-center gap-2 sm:-my-px sm:ms-10 sm:flex">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.route}
                                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                            item.active
                                                ? 'bg-sky-500/20 text-sky-200 ring-1 ring-sky-500/40'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Bagian Dropdown User */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium leading-4 text-slate-200 transition hover:border-slate-500 hover:text-white"
                                            >
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-sky-200">
                                                    {user.name?.charAt(0)}
                                                </span>
                                                <span>{user.name}</span>
                                                <svg className="-me-0.5 ms-1 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content contentClasses="rounded-2xl border border-slate-800 bg-slate-900/90 text-sm text-slate-100 shadow-xl shadow-sky-950/40 backdrop-blur">
                                        <div className="px-4 py-3">
                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                Akun
                                            </p>
                                            <p className="text-sm font-semibold text-slate-100">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-slate-400">{user.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')} className="px-4 py-2 !text-slate-200 hover:bg-slate-800/60">
                                            Profil
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="px-4 py-2 !text-rose-300 hover:bg-rose-500/10">
                                            Keluar
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Tombol Hamburger (Mobile) */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 transition duration-150 ease-in-out hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bagian Navigasi Mobile (saat hamburger diklik) */}
                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' border-b border-slate-800 bg-slate-950/95 backdrop-blur sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {navItems.map((item) => (
                            <ResponsiveNavLink key={item.label} href={item.route} active={item.active}>
                                {item.label}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-slate-800 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-100">{user.name}</div>
                            <div className="text-sm font-medium text-slate-400">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-slate-950/60">
                    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}