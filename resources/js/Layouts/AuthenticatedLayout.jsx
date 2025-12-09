import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Toast from '@/Components/Toast'; // <--- IMPORT TOAST DISINI
import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    
    // State buat Toast
    const [toastMsg, setToastMsg] = useState(null);

    const navItems = useMemo(
        () => [
            { 
                label: 'Dashboard', 
                route: route('dashboard'), 
                active: route().current('dashboard') 
            },
            { 
                label: 'Template', 
                route: route('templates.index'), 
                active: route().current('templates.*') // Aktif kalo user ada di halaman template mana aja
            },
            { 
                label: 'Questify', 
                route: route('questify.index'), 
                active: route().current('questify.index') 
            },
        ],
        [],
    );

    // Handler pas klik menu Coming Soon
    const handleComingSoon = (e) => {
        e.preventDefault();
        setToastMsg("Sabar bray, fitur Template lagi dimasak! 👨‍🍳");
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* TAMPILIN TOAST DISINI */}
            {toastMsg && (
                <Toast 
                    message={toastMsg} 
                    onClose={() => setToastMsg(null)} 
                />
            )}

            <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center gap-2">
                                <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
                                        <span className="text-base font-semibold text-white">
                                            L
                                        </span>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-base font-bold tracking-tight text-gray-900">
                                            Laporin
                                        </p>
                                        <p className="text-xs font-medium text-gray-600">
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
                                        // Kalo comingSoon, bajak onClick-nya
                                        onClick={item.comingSoon ? handleComingSoon : undefined}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                            item.active
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100 font-medium'
                                        } ${item.comingSoon ? 'opacity-70 hover:opacity-100' : ''}`}
                                    >
                                        {item.label}
                                        {/* Badge SOON kecil */}
                                        {item.comingSoon && (
                                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 leading-none border border-amber-200">
                                                SOON
                                            </span>
                                        )}
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
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold leading-4 text-gray-800 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400"
                                            >
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                                                    {user.name?.charAt(0)}
                                                </span>
                                                <span className="font-semibold">{user.name}</span>
                                                <svg className="-me-0.5 ms-1 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content contentClasses="rounded-lg border border-gray-200 bg-white text-sm text-gray-700 shadow-xl">
                                        <div className="px-4 py-3">
                                            <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                                                Akun
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-600 font-medium">{user.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')} className="px-4 py-2 !text-gray-800 hover:bg-gray-100 font-medium">
                                            Profil
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="px-4 py-2 !text-red-600 hover:bg-red-50 font-medium">
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
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bagian Navigasi Mobile */}
                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' border-b border-gray-200 bg-white shadow-lg sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {navItems.map((item) => (
                            <div key={item.label} onClick={item.comingSoon ? handleComingSoon : undefined}>
                                <ResponsiveNavLink 
                                    href={item.route} 
                                    active={item.active}
                                    as={item.comingSoon ? 'button' : 'a'} // Ubah jadi button biar gak redirect di mobile
                                    className={`w-full text-left flex items-center justify-between ${item.comingSoon ? 'opacity-75' : ''}`}
                                >
                                    {item.label}
                                    {item.comingSoon && (
                                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                            SOON
                                        </span>
                                    )}
                                </ResponsiveNavLink>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-bold text-gray-900">{user.name}</div>
                            <div className="text-sm font-medium text-gray-600">{user.email}</div>
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
                <header className="bg-white border-b border-slate-200">
                    <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="mx-auto px-4 pb-10 pt-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}