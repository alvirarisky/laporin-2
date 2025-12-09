import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        // Data Mahasiswa
        nim: user.nim || '',
        prodi: user.prodi || '',
        instansi: user.instansi || '',
        no_hp: user.no_hp || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-zinc-100">Biodata Mahasiswa</h2>
                <p className="mt-1 text-sm text-zinc-400">
                    Lengkapi data akademikmu biar nanti otomatis masuk ke Cover Laporan.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* --- NAMA LENGKAP --- */}
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-zinc-300" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* --- NIM & PRODI (Grid 2 Kolom) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="nim" value="NIM / NPM" className="text-zinc-300" />
                        <TextInput
                            id="nim"
                            className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.nim}
                            onChange={(e) => setData('nim', e.target.value)}
                            placeholder="Contoh: 1202200123"
                        />
                        <InputError className="mt-2" message={errors.nim} />
                    </div>

                    <div>
                        <InputLabel htmlFor="prodi" value="Program Studi" className="text-zinc-300" />
                        <TextInput
                            id="prodi"
                            className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.prodi}
                            onChange={(e) => setData('prodi', e.target.value)}
                            placeholder="Contoh: S1 Informatika"
                        />
                        <InputError className="mt-2" message={errors.prodi} />
                    </div>
                </div>

                {/* --- INSTANSI & NO HP (Grid 2 Kolom) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="instansi" value="Nama Kampus / Instansi" className="text-zinc-300" />
                        <TextInput
                            id="instansi"
                            className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.instansi}
                            onChange={(e) => setData('instansi', e.target.value)}
                            placeholder="Contoh: Telkom University"
                        />
                        <InputError className="mt-2" message={errors.instansi} />
                    </div>

                    <div>
                        <InputLabel htmlFor="no_hp" value="Nomor WhatsApp (Opsional)" className="text-zinc-300" />
                        <TextInput
                            id="no_hp"
                            className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.no_hp}
                            onChange={(e) => setData('no_hp', e.target.value)}
                            placeholder="08xxxxxxxxxx"
                        />
                        <InputError className="mt-2" message={errors.no_hp} />
                    </div>
                </div>

                {/* --- EMAIL --- */}
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-zinc-300" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="mt-2">
                            <p className="text-sm text-zinc-400">
                                Email kamu belum diverifikasi.
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="underline text-sm text-zinc-400 hover:text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Klik di sini untuk kirim ulang email verifikasi.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 font-medium text-sm text-green-400">
                                    Link verifikasi baru udah dikirim ke email kamu.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} className="bg-indigo-600 hover:bg-indigo-500 text-white border-0">
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-emerald-400">✅ Berhasil Disimpan!</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}