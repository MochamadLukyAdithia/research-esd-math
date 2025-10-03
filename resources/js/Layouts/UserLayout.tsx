import React, { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '@/Components/navbar/Navbar';
import Footer from '@/Components/footer/Footer';

import { User as Profile } from '@/types';

interface UserLayoutProps {
    children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    const { auth } = usePage().props as { auth: { user: Profile | null } };

    return (
        <div className="bg-background min-h-screen text-secondary">
            <Navbar user={auth.user} />

            <main className="pt-[88px]">
                {children}
            </main>
            <Footer/>
        </div>
    );
}
