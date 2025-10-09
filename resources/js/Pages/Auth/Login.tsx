import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import LoginForm from "@/Components/auth/LoginForm";

interface StatsProps {
    competitions: string;
    companies: string;
    activeUsers: string;
}

interface LoginProps {
    stats?: StatsProps;
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ stats, status, canResetPassword }: LoginProps) {
    return (
        <>
            <Head title="Masuk" />
            <div className="md:hidden text-center mb-8">
                <Link href="/">
                    <img
                        src="/logo/logo.png"
                        alt="Logo Innovixus"
                        width={80}
                        height={80}
                        className="relative object-contain drop-shadow-lg mx-auto"
                    />
                </Link>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-secondary">
                    Selamat Datang Kembali
                </h1>
                <p className="text-secondary-light mt-2">
                    Silakan masuk untuk melanjutkan.
                </p>
            </div>

            <LoginForm status={status} canResetPassword={canResetPassword} />
        </>
    );
}

Login.layout = (page: React.ReactElement<LoginProps>) => (
    <AuthLayout stats={page.props.stats}>{page}</AuthLayout>
);
