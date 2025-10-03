import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PasswordInput from '@/Components/auth/PasswordInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ConfirmPasswordForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    const labelClasses = "block text-sm font-medium mb-2 text-secondary";
    const inputClasses = "w-full p-3 border-2 border-secondary/20 rounded-lg transition-colors focus:ring-2 focus:ring-secondary-light focus:border-secondary bg-background text-secondary placeholder:text-secondary-light/70 disabled:opacity-50";

    return (
        <form onSubmit={submit} className="space-y-5">
            <div>
                <label htmlFor="password" className={labelClasses}>
                    Kata Sandi
                </label>
                <PasswordInput
                    id="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    disabled={processing}
                    className={inputClasses}
                    autoFocus
                />
                <InputError message={errors.password} />
            </div>

            <div className="flex items-center justify-end">
                <PrimaryButton processing={processing}>
                    Konfirmasi
                </PrimaryButton>
            </div>
        </form>
    );
}
