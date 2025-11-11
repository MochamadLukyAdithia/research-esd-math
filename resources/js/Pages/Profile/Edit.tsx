import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface EditProfileProps extends PageProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Edit({
    mustVerifyEmail,
    status,
}: EditProfileProps) {
    return (
        <UserLayout>
            <Head title="Pengaturan Profil" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold leading-tight text-gray-900">
                                Pengaturan Akun
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Kelola informasi profil, kata sandi, dan
                                pengaturan akun Anda.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <Link
                                href={route('profile.show')}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Profil
                            </Link>
                        </div>
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
                                <UpdatePasswordForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
