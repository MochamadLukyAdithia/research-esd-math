import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

interface UserStats {
    total_points: number;
    questions_solved: number;
    accuracy_rate: number;
    rank: number | null;
}

interface EditProfileProps extends PageProps {
    mustVerifyEmail: boolean;
    status?: string;
    userStats: UserStats;
}

export default function Edit({
    mustVerifyEmail,
    status,
    userStats,
}: EditProfileProps) {
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
                            {/* Stats Card */}
                            <div className="bg-white shadow-xl rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Statistik Anda
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Total Poin</span>
                                        <span className="font-bold text-blue-600">
                                            {userStats?.total_points?.toLocaleString() ?? 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Ranking</span>
                                        <span className="font-bold text-amber-600">
                                            {userStats?.rank ? `#${userStats.rank}` : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Soal Diselesaikan</span>
                                        <span className="font-bold text-green-600">
                                            {userStats?.questions_solved ?? 0}
                                        </span>
                                    </div>
                                    
                                </div>
                            </div>

                            {/* Password Form */}
                            <div className="bg-white shadow-xl rounded-2xl p-6">
                                <UpdatePasswordForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
