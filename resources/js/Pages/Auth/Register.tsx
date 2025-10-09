import React from 'react';
import { Head } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import RegisterForm from '@/Components/auth/RegisterForm';

export default function Register() {
    return (
        <>
            <Head title="Daftar" />

            <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-secondary">
                    Bergabung Bersama Kami
                </h1>
                <p className="text-secondary-light mt-2">
                    Buat akun untuk memulai pengalaman terbaik Anda.
                </p>
            </div>

            <RegisterForm />
        </>
    );
}

Register.layout = (page: React.ReactElement) => (
    <AuthLayout>
        {page}
    </AuthLayout>
);
