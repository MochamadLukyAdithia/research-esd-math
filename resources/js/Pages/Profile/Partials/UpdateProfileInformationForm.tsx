import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Camera, CheckCircle, Mail, User, AlertTriangle } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const [previewAvatar, setPreviewAvatar] = useState<string | null>(
        user?.avatar ? `/storage/${user.avatar}` : null
    );

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user?.name || '',
            email: user?.email || '',
            avatar: null as File | null,
            _method: 'PATCH',
        });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Gunakan post dengan forceFormData untuk upload file
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <section
            className={`bg-white shadow-xl rounded-2xl p-8 h-full ${className}`}
        >

            <form onSubmit={submit} className="flex flex-col h-full">

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:gap-10">
                        
                        <div className="md:w-1/3 flex-shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Foto Profil
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 mb-6">
                                Perbarui foto profil dan avatar Anda.
                            </p>
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    {previewAvatar ? (
                                        <img
                                            src={previewAvatar}
                                            alt="Profile"
                                            className="h-28 w-28 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-gray-200 transition-all"
                                        />
                                    ) : (
                                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 ring-4 ring-gray-100 group-hover:ring-gray-200 transition-all">
                                            <User className="h-14 w-14 text-gray-400" />
                                        </div>
                                    )}
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute bottom-1 right-1 p-1.5 bg-gray-800 hover:bg-gray-900 rounded-full cursor-pointer shadow-md transition-all transform hover:scale-110"
                                    >
                                        <Camera className="w-4 h-4 text-white" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                </div>
                                <p className="mt-3 text-xs text-gray-400 text-center md:text-left">
                                    JPG, PNG, atau GIF. (Maks 2MB)
                                </p>
                                <InputError className="mt-2" message={errors.avatar} />
                            </div>
                        </div>

                        <div className="md:w-2/3 mt-8 md:mt-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Detail Akun
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 mb-6">
                                Perbarui informasi nama dan email Anda.
                            </p>
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                                    <div className="relative mt-2">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="name"
                                            className="pl-10 py-2 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoComplete="name"
                                        />
                                    </div>
                                    <InputError className="mt-2" message={errors.name} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="Alamat Email" />
                                    <div className="relative mt-2">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="pl-10 py-2 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="username"
                                        />
                                    </div>
                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                                {mustVerifyEmail && user?.email_verified_at === null && (
                                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-yellow-800">
                                                    Alamat email Anda belum terverifikasi.
                                                    <Link
                                                        href={route('verification.send')}
                                                        method="post"
                                                        as="button"
                                                        className="font-medium underline hover:text-yellow-900 ml-1"
                                                    >
                                                        Klik di sini untuk mengirim ulang email verifikasi.
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                        {status === 'verification-link-sent' && (
                                            <div className="mt-3 text-sm font-medium text-green-600 flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4" />
                                                Tautan verifikasi baru telah dikirim!
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0 translate-x-2"
                    >
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                            <CheckCircle className="h-5 w-5" />
                            <span>Tersimpan!</span>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}