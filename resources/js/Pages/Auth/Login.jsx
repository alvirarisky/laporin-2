import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk – Laporin" />

            <div className="mb-6 space-y-2 text-left">
                <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                    Masuk ke akun akademik kamu
                </h1>
                <p className="text-sm text-slate-400">
                    Akses dashboard laporan dan Questify dengan akun kampus atau
                    email yang sudah terdaftar.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-xs font-medium text-emerald-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1">
                    <InputLabel
                        htmlFor="email"
                        value="Email akademik"
                        className="text-slate-200"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-xl border-slate-700 bg-slate-900/60 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        autoComplete="username"
                        isFocused
                        placeholder="nama@kampus.ac.id"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1 text-xs" />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <InputLabel
                            htmlFor="password"
                            value="Kata sandi"
                            className="text-slate-200"
                        />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-medium text-sky-300 hover:text-sky-200"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-xl border-slate-700 bg-slate-900/60 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1 text-xs" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span>Ingat saya di perangkat ini</span>
                    </label>

                    <span className="text-[11px] text-slate-500">
                        Aman, hanya untuk keperluan autentikasi.
                    </span>
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="inline-flex w-full justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-500/60"
                        disabled={processing}
                    >
                        Masuk ke Laporin
                    </PrimaryButton>

                    <p className="mt-3 text-center text-xs text-slate-400">
                        Belum punya akun?{' '}
                        <Link
                            href={route('register')}
                            className="font-semibold text-sky-300 hover:text-sky-200"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
