import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <UserLayout>
            <Head title="Pengaturan Profil" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">
                            Pengaturan Akun
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Kelola informasi profil, kata sandi, dan pengaturan akun Anda.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-2">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white shadow-xl rounded-2xl p-8">
                                <UpdatePasswordForm 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}