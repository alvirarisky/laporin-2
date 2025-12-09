import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-zinc-100">Hapus Akun</h2>
                <p className="mt-1 text-sm text-zinc-400">
                    Jika akun dihapus, seluruh data tidak akan bisa dikembalikan. Pastikan sudah mengunduh semua data penting.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="bg-red-600 hover:bg-red-500 border-0 text-white">
                Hapus Akun
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-zinc-100">
                        Yakin ingin menghapus akun?
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                        Masukkan password untuk mengonfirmasi penghapusan permanen akunmu.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" className="text-zinc-300" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-3/4 bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal} className="text-zinc-300 hover:text-white">
                            Batal
                        </SecondaryButton>

                        <DangerButton className="ms-3 bg-red-600 hover:bg-red-500 border-0 text-white" disabled={processing}>
                            Hapus
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
