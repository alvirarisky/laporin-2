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

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white">Selamat Datang Kembali</h2>
                <p className="text-zinc-400 text-sm mt-1">Lanjutkan progres skripsimu yang tertunda.</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-400">{status}</div>}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email Kampus / Pribadi" className="text-zinc-300" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-lg placeholder-zinc-600"
                        placeholder="nama@mahasiswa.ac.id"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-zinc-300" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-lg placeholder-zinc-600"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox 
                            name="remember" 
                            checked={data.remember} 
                            onChange={(e) => setData('remember', e.target.checked)} 
                            className="bg-zinc-900 border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ms-2 text-sm text-zinc-400">Ingat Saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-indigo-400 hover:text-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-zinc-900"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                <div className="mt-6">
                    <PrimaryButton 
                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-500 focus:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-lg transition-all" 
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