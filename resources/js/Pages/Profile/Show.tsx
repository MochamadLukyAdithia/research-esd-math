import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { User as UserIcon } from 'lucide-react';

export default function ShowProfile() {
    const user = usePage().props.auth.user;
    return (
        <UserLayout>
            <Head title="Profil Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Profil Saya
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Lihat informasi akun Anda di bawah ini.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-background hover:text-secondary border border-secondary"
                            >
                                Edit Profil
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl p-8">
                        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">

                            <div className="flex-shrink-0 mb-6 sm:mb-0">
                                {user?.avatar ? (
                                    <img
                                        src={`/storage/${user.avatar}`}
                                        alt="Profile"
                                        className="h-28 w-28 rounded-full object-cover ring-4 ring-gray-100"
                                        onError={(e) => {
                                            console.error('Image failed to load:', e);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 ring-4 ring-gray-100">
                                        <UserIcon className="h-14 w-14 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="mt-1 text-lg text-gray-500">{user?.email}</p>

                                <div className="mt-5">
                                    <span className="text-sm text-gray-500">
                                        Bergabung sejak:{' '}
                                        {user?.created_at
                                            ? new Date(user.created_at).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : '-'}
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
