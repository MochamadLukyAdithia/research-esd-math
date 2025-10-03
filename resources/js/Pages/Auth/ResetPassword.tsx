import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

import AuthLayout from '@/Layouts/AuthLayout';
import ResetPasswordForm from '@/Components/auth/ResetPasswordForm';

interface ResetPasswordProps {
    stats?: any;
    token: string;
    email: string;
}

export default function ResetPassword({ stats, token, email }: ResetPasswordProps) {
    return (
        <>
            <Head title="Reset Kata Sandi" />

            <motion.div
                className="w-full max-w-md space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="space-y-3 text-center">
                    <h1 className="text-3xl font-bold text-secondary">
                        Reset Kata Sandi Anda
                    </h1>
                    <p className="text-secondary-light">
                        Buat kata sandi baru yang kuat dan aman untuk akun Anda.
                    </p>
                </div>

                <ResetPasswordForm token={token} email={email} />

            </motion.div>
        </>
    );
}

ResetPassword.layout = (page: React.ReactElement<ResetPasswordProps>) => (
    <AuthLayout stats={page.props.stats}>
        {page}
    </AuthLayout>
);
