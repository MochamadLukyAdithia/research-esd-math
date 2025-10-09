import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MailCheck } from 'lucide-react';

import AuthLayout from '@/Layouts/AuthLayout';
import PrimaryButton from '@/Components/PrimaryButton';

interface VerifyEmailProps {
    stats?: any;
    status?: string;
}

export default function VerifyEmail({ stats, status }: VerifyEmailProps) {
    const { post, processing } = useForm({});

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    const linkClasses = "text-sm font-medium text-secondary hover:underline";

    return (
        <>
            <Head title="Verifikasi Email" />

            <motion.div
                className="w-full max-w-md space-y-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex justify-center">
                    <MailCheck size={48} className="text-primary" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-secondary">
                        Verifikasi Alamat Email Anda
                    </h1>
                    <p className="text-secondary-light">
                        Terima kasih telah mendaftar! Sebelum memulai, bisakah Anda memverifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan?
                    </p>
                    <p className="text-secondary-light">
                        Jika Anda tidak menerima email, kami akan dengan senang hati mengirimkan yang lain.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-lg bg-green-100 p-4 text-sm font-medium text-green-800">
                        Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <PrimaryButton processing={processing}>
                            Kirim Ulang Email Verifikasi
                        </PrimaryButton>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`${linkClasses} whitespace-nowrap`}
                        >
                            Keluar
                        </Link>
                    </div>
                </form>
            </motion.div>
        </>
    );
}

VerifyEmail.layout = (page: React.ReactElement<VerifyEmailProps>) => (
    <AuthLayout stats={page.props.stats}>
        {page}
    </AuthLayout>
);
