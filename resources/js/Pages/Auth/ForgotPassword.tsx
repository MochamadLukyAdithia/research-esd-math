import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Mail, AlertTriangle } from 'lucide-react';

import AuthLayout from '@/Layouts/AuthLayout';
import ForgotPasswordForm from '@/Components/auth/ForgotPasswordForm';

interface ForgotPasswordProps {
    stats?: any;
    status?: string;
}

export default function ForgotPassword({ stats, status }: ForgotPasswordProps) {
    return (
        <>
            <Head title="Lupa Kata Sandi" />

            <motion.div
                className="w-full max-w-md space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="space-y-3 text-center">
                    <h1 className="text-3xl font-bold text-secondary">
                        Lupa Kata Sandi?
                    </h1>
                    <p className="text-secondary-light">
                        Jangan khawatir! Masukkan email Anda di bawah ini.
                    </p>
                </div>

                <ForgotPasswordForm status={status} />

                <div className="text-center">
                    <Link
                        href={route('login')}
                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-secondary transition-colors hover:underline"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        <span>Kembali ke halaman masuk</span>
                    </Link>
                </div>

                <div className="space-y-4 rounded-xl border-2 border-secondary/20 bg-background p-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary">
                        <Shield size={16} className="text-secondary" />
                        Proses Aman & Mudah
                    </h3>
                    <ul className="space-y-2 text-sm text-secondary-light">
                        <li className="flex items-start gap-2.5">
                            <Mail size={16} className="mt-0.5 flex-shrink-0 text-secondary" />
                            <span>Tautan reset akan dikirim ke email yang terdaftar dan hanya berlaku selama 24 jam.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-secondary" />
                            <span>Jika tidak ada, periksa folder spam atau coba lagi dalam 5 menit.</span>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </>
    );
}

ForgotPassword.layout = (page: React.ReactElement<ForgotPasswordProps>) => (
    <AuthLayout stats={page.props.stats}>
        {page}
    </AuthLayout>
);
