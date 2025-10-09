import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ForgotPasswordForm({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const labelClasses = "block text-sm font-medium mb-2 text-secondary";
    const inputClasses = "w-full p-3 border-2 border-secondary/20 rounded-lg transition-colors focus:ring-2 focus:ring-secondary-light focus:border-secondary bg-background text-secondary placeholder:text-secondary-light/70 disabled:opacity-50";

    return (
        <>
            {status && (
                <div className="mb-4 rounded-lg bg-green-100 p-4 text-sm font-medium text-green-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="email" className={labelClasses}>
                        Alamat Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        disabled={processing}
                        className={inputClasses}
                        placeholder="anda@email.com"
                        autoFocus
                    />
                    <InputError message={errors.email} />
                </div>

                <PrimaryButton processing={processing}>
                    Kirim Tautan Reset
                </PrimaryButton>
            </form>
        </>
    );
}
