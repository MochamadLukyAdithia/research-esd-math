import { FormEventHandler, useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { calculatePasswordStrength, PasswordStrengthMeter } from '@/lib/passwordUtils';
import InputError from '@/Components/InputError';
import PasswordInput from '@/Components/auth/PasswordInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface ResetPasswordFormProps {
    token: string;
    email: string;
}

export default function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setData('password', newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    const labelClasses = "block text-sm font-medium mb-2 text-secondary";
    const inputClasses = "w-full p-3 border-2 border-secondary/20 rounded-lg transition-colors focus:ring-2 focus:ring-secondary-light focus:border-secondary bg-background text-secondary placeholder:text-secondary-light/70 disabled:opacity-50";

    return (
        <form onSubmit={submit} className="space-y-5">
            <div>
                <label htmlFor="email" className={labelClasses}>Alamat Email</label>
                <input
                    id="email"
                    type="email"
                    value={data.email}
                    className={`${inputClasses} cursor-not-allowed`}
                    disabled
                />
                <InputError message={errors.email} />
            </div>

            <div>
                <label htmlFor="password" className={labelClasses}>Kata Sandi Baru</label>
                <PasswordInput
                    id="password"
                    value={data.password}
                    onChange={handlePasswordChange}
                    disabled={processing}
                    className={inputClasses}
                    placeholder="••••••••"
                    autoFocus
                />
                <InputError message={errors.password} />
                <PasswordStrengthMeter score={passwordStrength.score} label={passwordStrength.label} />
            </div>

            <div>
                <label htmlFor="password_confirmation" className={labelClasses}>Konfirmasi Kata Sandi Baru</label>
                <PasswordInput
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    disabled={processing}
                    className={inputClasses}
                    placeholder="••••••••"
                />
                <InputError message={errors.password_confirmation} />
            </div>

            <div className="flex items-center justify-end">
                <PrimaryButton processing={processing}>
                    Reset Kata Sandi
                </PrimaryButton>
            </div>
        </form>
    );
}
