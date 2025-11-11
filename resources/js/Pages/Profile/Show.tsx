import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types'; // <-- Tambahkan ini
import { Head, Link, usePage } from '@inertiajs/react';
import {
    User as UserIcon,
    Mail,
    Calendar,
    Edit,
    Award, // <-- Tambahkan ini
    Hash, // <-- Tambahkan ini
    CheckSquare, // <-- Tambahkan ini
} from 'lucide-react';

// Definisikan interface untuk stats
interface UserStats {
    total_points: number;
    questions_solved: number;
    rank: number | null;
}

// Tentukan props untuk halaman ini, termasuk userStats
interface ShowProfileProps extends PageProps {
    userStats: UserStats;
}

export default function ShowProfile({ userStats }: ShowProfileProps) { // <-- Terima props
    const user = usePage().props.auth.user;

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <UserLayout>
            <Head title="Profil Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    {/* Header Halaman */}
                    <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Profil Saya
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Lihat informasi akun dan statistik Anda di bawah
                                ini.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Profil
                            </Link>
                        </div>
                    </div>

                    {/* Kartu Profil Utama */}
                    <div className="bg-white shadow-xl rounded-2xl p-8">
                        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-10">
                            {/* Avatar */}
                            <div className="flex-shrink-0 mb-6 sm:mb-0">
                                {user?.avatar ? (
                                    <img
                                        src={`/storage/${user.avatar}`}
                                        alt="Profile"
                                        className="h-32 w-32 rounded-full object-cover ring-4 ring-gray-100"
                                        onError={(e) => {
                                            console.error(
                                                'Image failed to load:',
                                                e
                                            );
                                            e.currentTarget.style.display =
                                                'none';
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 ring-4 ring-gray-100">
                                        <UserIcon className="h-16 w-16 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Info Detail */}
                            <div className="flex-1 w-full text-center sm:text-left">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {user?.name}
                                </h2>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <span className="text-lg text-gray-600">
                                            {user?.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-500">
                                            Bergabung sejak:{' '}
                                            <span className="font-medium text-gray-700">
                                                {formatDate(user?.created_at)}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                            Statistik Anda
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stat: Total Poin */}
                            <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-5">
                                <div className="flex-shrink-0 rounded-full bg-blue-100 p-3">
                                    <Award className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">
                                        Total Poin
                                    </span>
                                    <span className="block text-2xl font-bold text-blue-600">
                                        {userStats?.total_points?.toLocaleString() ??
                                            0}
                                    </span>
                                </div>
                            </div>

                            {/* Stat: Ranking */}
                            <div className="flex items-center gap-4 rounded-lg bg-amber-50 p-5">
                                <div className="flex-shrink-0 rounded-full bg-amber-100 p-3">
                                    <Hash className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">
                                        Ranking
                                    </span>
                                    <span className="block text-2xl font-bold text-amber-600">
                                        {userStats?.rank
                                            ? `#${userStats.rank}`
                                            : '-'}
                                    </span>
                                </div>
                            </div>

                            {/* Stat: Soal Diselesaikan */}
                            <div className="flex items-center gap-4 rounded-lg bg-green-50 p-5">
                                <div className="flex-shrink-0 rounded-full bg-green-100 p-3">
                                    <CheckSquare className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">
                                        Soal Diselesaikan
                                    </span>
                                    <span className="block text-2xl font-bold text-green-600">
                                        {userStats?.questions_solved ?? 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
