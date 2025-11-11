import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Lock, CheckCircle } from 'lucide-react'; // Import ikon

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            {/* Header yang Disesuaikan */}
            <header>
                <h3 className="text-lg font-semibold text-gray-900">
                    Ubah Kata Sandi
                </h3>
                <p className="mt-1 text-sm text-gray-500 mb-6">
                    Pastikan akun Anda menggunakan kata sandi yang panjang dan
                    acak agar tetap aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                {/* Input Kata Sandi Saat Ini */}
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Kata Sandi Saat Ini"
                    />
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type="password"
                            className="pl-10 py-2.5 block w-full rounded-lg"
                            autoComplete="current-password"
                        />
                    </div>
                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                {/* Input Kata Sandi Baru */}
                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" />
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            type="password"
                            className="pl-10 py-2.5 block w-full rounded-lg"
                            autoComplete="new-password"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Input Konfirmasi Kata Sandi */}
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi"
                    />
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData(
                                    'password_confirmation',
                                    e.target.value
                                )
                            }
                            type="password"
                            className="pl-10 py-2.5 block w-full rounded-lg"
                            autoComplete="new-password"
                        />
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0 translate-x-2"
                    >
                        {/* Pesan Sukses yang Disesuaikan */}
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
