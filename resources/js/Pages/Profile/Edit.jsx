import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-bold text-xl text-white leading-tight">
                    Pengaturan Profil
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12 bg-[#09090b] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Update Profile Info */}
                    <div className="p-4 sm:p-8 bg-[#18181b] shadow-lg sm:rounded-2xl border border-zinc-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Update Password */}
                    <div className="p-4 sm:p-8 bg-[#18181b] shadow-lg sm:rounded-2xl border border-zinc-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Delete Account */}
                    <div className="p-4 sm:p-8 bg-[#18181b] shadow-lg sm:rounded-2xl border border-zinc-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}