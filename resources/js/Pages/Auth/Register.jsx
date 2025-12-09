import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun Baru" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white">Mulai Perjalananmu</h2>
                <p className="text-zinc-400 text-sm mt-1">Buat akun untuk akses fitur editor & gamifikasi.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-zinc-300" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-lg placeholder-zinc-600"
                        placeholder="Contoh: Alvira Risky"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-zinc-300" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-lg placeholder-zinc-600"
                        placeholder="nama@email.com"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        placeholder="Minimal 8 karakter"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className="text-zinc-300" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-lg placeholder-zinc-600"
                        placeholder="Ulangi password"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-6">
                    <PrimaryButton 
                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-500 focus:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-lg transition-all" 
                        disabled={processing}
                    >
                        {processing ? 'Mendaftarkan...' : 'Buat Akun'}
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center text-sm text-zinc-500">
                    Sudah punya akun?{' '}
                    <Link href={route('login')} className="text-white hover:text-indigo-400 font-bold transition-colors">
                        Masuk disini
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}