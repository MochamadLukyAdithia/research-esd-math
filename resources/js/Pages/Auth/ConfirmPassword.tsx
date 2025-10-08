import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

import AuthLayout from '@/Layouts/AuthLayout';
import ConfirmPasswordForm from '@/Components/auth/ConfirmPasswordForm';

interface ConfirmPasswordProps {
    stats?: any; 
}

export default function ConfirmPassword({ stats }: ConfirmPasswordProps) {
    return (
        <>
            <Head title="Konfirmasi Kata Sandi" />

            <motion.div
                className="w-full max-w-md space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="space-y-3 text-center">
                    <h1 className="text-3xl font-bold text-secondary">
                        Konfirmasi Kata Sandi
                    </h1>
                    <p className="text-secondary-light">
                        Ini adalah area aman. Mohon konfirmasi kata sandi Anda sebelum melanjutkan.
                    </p>
                </div>

                <ConfirmPasswordForm />

            </motion.div>
        </>
    );
}

ConfirmPassword.layout = (page: React.ReactElement<ConfirmPasswordProps>) => (
    <AuthLayout stats={page.props.stats}>
        {page}
    </AuthLayout>
);
