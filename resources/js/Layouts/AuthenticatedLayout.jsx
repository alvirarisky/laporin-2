import Dropdown from '@/Components/Dropdown';
import Toast from "@/Components/Toast";
import AiAssistant from '@/Components/AiAssistant'; // [BARU] Import AI Component
import { Link, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);

    const navItems = useMemo(
        () => [
            {
                label: "Dashboard",
                route: route("dashboard"),
                active: route().current("dashboard"),
            },
            {
                label: "Template",
                route: route("templates.index"),
                active: route().current("templates.*"),
            },
            {
                label: "Questify",
                route: route("questify.index"),
                active: route().current("questify.index"),
            },
        ],
        []
    );

    const handleComingSoon = (e) => {
        e.preventDefault();
        setToastMsg("Sabar bray, fitur ini lagi dimasak! 👨‍🍳");
    };

    return (
        // BACKGROUND UTAMA: Deep Dark Zinc (#09090b)
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
            
            {/* AMBIENT BACKGROUND (Efek Cahaya) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]"></div>
                <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-emerald-500/5 blur-[100px]"></div>
            </div>

            {/* TOAST NOTIFICATION */}
            {toastMsg && (
                <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
            )}

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl transition-all duration-300">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            {/* LOGO */}
                            <div className="flex shrink-0 items-center gap-2">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 transition-transform hover:scale-105 group"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
                                        <span className="text-lg font-black">L</span>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-base font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                                            Laporin.
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            {/* NAVIGASI DESKTOP */}
                            <div className="hidden items-center gap-1 sm:-my-px sm:ms-10 sm:flex">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.route}
                                        onClick={item.comingSoon ? handleComingSoon : undefined}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                            item.active
                                                ? "bg-white/10 text-white border border-white/5 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        } ${item.comingSoon ? "opacity-70 cursor-not-allowed" : ""}`}
                                    >
                                        {item.label}
                                        {item.comingSoon && (
                                            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 leading-none border border-amber-500/30">
                                                SOON
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* USER DROPDOWN (DESKTOP) */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-1.5 text-sm font-medium leading-4 text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white hover:border-white/20 focus:outline-none"
                                            >
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30">
                                                    {user.name?.charAt(0)}
                                                </span>
                                                <span className="font-semibold">{user.name}</span>
                                                <svg className="-me-0.5 ms-1 h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    {/* DROPDOWN CONTENT */}
                                    <Dropdown.Content contentClasses="rounded-lg border border-white/10 bg-[#18181b] text-sm text-zinc-300 shadow-xl ring-1 ring-black ring-opacity-5 py-1">
                                        <div className="px-4 py-3 border-b border-white/5">
                                            <p className="text-xs uppercase tracking-wide text-zinc-500 font-bold">Akun</p>
                                            <p className="text-sm font-bold text-white mt-1 truncate">{user.name}</p>
                                            <p className="text-xs text-zinc-400 font-mono truncate">{user.email}</p>
                                        </div>

                                        <Dropdown.Link href={route("profile.edit")} className="!text-zinc-300 hover:!bg-white/5 hover:!text-white transition-colors">
                                            Profil
                                        </Dropdown.Link>

                                        <Dropdown.Link href={route("logout")} method="post" as="button" className="!text-red-400 hover:!bg-red-500/10 hover:!text-red-300 w-full text-left transition-colors">
                                            Keluar
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* HAMBURGER MENU (MOBILE) */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 transition duration-150 ease-in-out hover:bg-zinc-800 hover:text-white focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? "inline-flex" : "hidden"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? "inline-flex" : "hidden"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU CONTENT */}
                <div className={(showingNavigationDropdown ? "block" : "hidden") + " border-b border-white/5 bg-[#09090b]/95 backdrop-blur-xl sm:hidden absolute w-full z-40 shadow-2xl"}>
                    <div className="space-y-1 pb-3 pt-2 px-4">
                        {navItems.map((item) => (
                            <div key={item.label} onClick={item.comingSoon ? handleComingSoon : undefined}>
                                <Link
                                    href={item.route}
                                    as={item.comingSoon ? "button" : "a"}
                                    className={`w-full text-left flex items-center justify-between py-3 border-b border-white/5 ${
                                        item.active ? "text-indigo-400 font-bold" : "text-zinc-400"
                                    } ${item.comingSoon ? "opacity-75" : ""}`}
                                >
                                    {item.label}
                                    {item.comingSoon && (
                                        <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                                            SOON
                                        </span>
                                    )}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="pb-4 pt-4 bg-zinc-900/50">
                        <div className="px-4">
                            <div className="text-base font-bold text-white">{user.name}</div>
                            <div className="text-sm font-medium text-zinc-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1 px-4">
                            <Link href={route("profile.edit")} className="block w-full px-4 py-2 text-start text-sm leading-5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                                Profil
                            </Link>
                            <Link href={route("logout")} method="post" as="button" className="block w-full px-4 py-2 text-start text-sm leading-5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition">
                                Keluar
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="relative z-10 border-b border-white/5 bg-[#09090b]/40 backdrop-blur-sm">
                    <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="relative z-10 mx-auto px-4 pb-10 pt-4 sm:px-6 lg:px-8 animate-fade-in">
                {children}
            </main>

            {/* [BARU] WIDGET AI FLOATING */}
            <AiAssistant />
        </div>
    );
}