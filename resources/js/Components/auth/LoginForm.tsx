import { FormEventHandler, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import PasswordInput from "@/Components/auth/PasswordInput";
import Checkbox from "@/Components/Checkbox";
import PrimaryButton from "@/Components/PrimaryButton";

export default function LoginForm({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    const labelClasses = "block text-sm font-medium mb-2 text-secondary";
    const inputClasses =
        "w-full p-3 border-2 border-secondary/20 rounded-lg transition-colors focus:ring-2 focus:ring-secondary-light focus:border-secondary bg-background text-secondary placeholder:text-secondary-light/70 disabled:opacity-50";
    const linkClasses = "text-sm font-medium text-secondary hover:underline";

    return (
        <form onSubmit={submit} className="space-y-5">
            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

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

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label
                        htmlFor="password"
                        className={`${labelClasses} mb-0`}
                    >
                        Kata Sandi
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className={linkClasses}
                        >
                            Lupa kata sandi?
                        </Link>
                    )}
                </div>
                <PasswordInput
                    id="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    disabled={processing}
                    className={inputClasses}
                    placeholder="••••••••"
                />
                <InputError message={errors.password} />
            </div>

            <div className="block">
                <label className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                    />
                    <span className="ms-2 text-sm text-secondary-light">
                        Ingat saya
                    </span>
                </label>
            </div>

            <PrimaryButton processing={processing}>Masuk</PrimaryButton>

            <p className="text-sm text-center text-secondary-light pt-2">
                Belum punya akun?{" "}
                <Link
                    href={route("register")}
                    className={`${linkClasses} font-bold`}
                >
                    Daftar di sini
                </Link>
            </p>
        </form>
    );
}
