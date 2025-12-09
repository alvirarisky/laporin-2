import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Laporin" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">Selamat Datang Kembali</h2>
                <p className="text-zinc-400 text-sm mt-2">Lanjutkan progres skripsimu yang tertunda.</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-emerald-400 bg-emerald-500/10 p-3 rounded border border-emerald-500/20">{status}</div>}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email Kampus / Pribadi" className="text-zinc-300 font-medium" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        // STYLE: Dark Input
                        className="mt-1 block w-full bg-zinc-900/80 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-lg placeholder-zinc-600 transition-all"
                        placeholder="nama@mahasiswa.ac.id"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-zinc-300 font-medium" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-zinc-900/80 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-lg placeholder-zinc-600 transition-all"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4 flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox 
                            name="remember" 
                            checked={data.remember} 
                            onChange={(e) => setData('remember', e.target.checked)} 
                            className="bg-zinc-900 border-zinc-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900 rounded"
                        />
                        <span className="ms-2 text-sm text-zinc-400 select-none">Ingat Saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                <div className="mt-8">
                    <PrimaryButton 
                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all hover:scale-[1.02]" 
                        disabled={processing}
                    >
                        {processing ? 'Memproses...' : 'Masuk Sekarang'}
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center text-sm text-zinc-500">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="text-white hover:text-indigo-400 font-bold transition-colors">
                        Daftar disini
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}