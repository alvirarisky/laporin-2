import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar – Laporin" />

            <div className="mb-6 space-y-2 text-left">
                <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                    Buat akun Laporin
                </h1>
                <p className="text-sm text-slate-400">
                    Gunakan nama lengkap dan email aktif untuk mengelola laporan
                    akademik dan progres Questify kamu.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1">
                    <InputLabel
                        htmlFor="name"
                        value="Nama lengkap"
                        className="text-slate-200"
                    />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full rounded-xl border-slate-700 bg-slate-900/60 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        autoComplete="name"
                        isFocused
                        placeholder="Nama sesuai kartu mahasiswa"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-1 text-xs" />
                </div>

                <div className="space-y-1">
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-slate-200"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-xl border-slate-700 bg-slate-900/60 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        autoComplete="username"
                        placeholder="nama@kampus.ac.id"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1 text-xs" />
                </div>

                <div className="space-y-1">
                    <InputLabel
                        htmlFor="password"
                        value="Kata sandi"
                        className="text-slate-200"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-xl border-slate-700 bg-slate-900/60 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        autoComplete="new-password"
                        placeholder="Minimal 8 karakter"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1 text-xs" />
                </div>

                <div className="space-y-1">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi kata sandi"
                        className="text-slate-200"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full rounded-xl border-slate-700 bg-slate-900/60 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        autoComplete="new-password"
                        placeholder="Ulangi kata sandi"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1 text-xs"
                    />
                </div>

                <div className="space-y-3 pt-1">
                    <p className="text-[11px] text-slate-500">
                        Dengan mendaftar, kamu menyetujui penggunaan Laporin
                        untuk keperluan akademik dan penyimpanan data laporan
                        sesuai kebijakan kampus.
                    </p>

                    <PrimaryButton
                        className="inline-flex w-full justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-500/60"
                        disabled={processing}
                    >
                        Buat akun baru
                    </PrimaryButton>

                    <p className="text-center text-xs text-slate-400">
                        Sudah punya akun?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-sky-300 hover:text-sky-200"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
