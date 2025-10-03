import { FormEventHandler, useEffect, useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import {
    calculatePasswordStrength,
    PasswordStrengthMeter,
} from "@/lib/passwordUtils";
import InputError from "@/Components/InputError";
import PasswordInput from "@/Components/auth/PasswordInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function RegisterForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setData("password", newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    const labelClasses = "block text-sm font-medium mb-2 text-secondary";
    const inputClasses =
        "w-full p-3 border-2 border-secondary/20 rounded-lg transition-colors focus:ring-2 focus:ring-secondary-light focus:border-secondary bg-background text-secondary placeholder:text-secondary-light/70 disabled:opacity-50";
    const linkClasses = "text-sm font-medium text-secondary hover:underline";

    return (
        <form onSubmit={submit} className="space-y-5">
            <div>
                <label htmlFor="name" className={labelClasses}>
                    Nama Lengkap
                </label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    disabled={processing}
                    className={inputClasses}
                    placeholder="John Doe"
                    autoFocus
                />
                <InputError message={errors.name} />
            </div>

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
                />
                <InputError message={errors.email} />
            </div>

            <div>
                <label htmlFor="password" className={labelClasses}>
                    Kata Sandi
                </label>
                <PasswordInput
                    id="password"
                    value={data.password}
                    onChange={handlePasswordChange}
                    disabled={processing}
                    className={inputClasses}
                    placeholder="••••••••"
                />
                <InputError message={errors.password} />
                <PasswordStrengthMeter
                    score={passwordStrength.score}
                    label={passwordStrength.label}
                />
            </div>

            <div>
                <label htmlFor="password_confirmation" className={labelClasses}>
                    Konfirmasi Kata Sandi
                </label>
                <PasswordInput
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    disabled={processing}
                    className={inputClasses}
                    placeholder="••••••••"
                />
                <InputError message={errors.password_confirmation} />
            </div>

            <PrimaryButton processing={processing}>Buat Akun</PrimaryButton>

            <p className="text-sm text-center text-secondary-light pt-2">
                Sudah punya akun?{" "}
                <Link
                    href={route("login")}
                    className={`${linkClasses} font-bold`}
                >
                    Masuk di sini
                </Link>
            </p>
        </form>
    );
}
