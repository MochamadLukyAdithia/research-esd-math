import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { UserAvatar } from './UserAvatar';
import { User as Profile } from '@/types';

const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
};

export function AuthSection({ user }: { user: Profile | null }) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    console.log('Auth user:', user);

    if (user && user.name) {
        const isAdmin = user.role === 'admin';
        const ProfileIcon = isAdmin ? LayoutDashboard : User;
        const profileLink = isAdmin ? route('admin.dashboard') : route('profile.edit');
        const profileText = isAdmin ? 'Dashboard' : 'Profil Anda';

        return (
            <div className="relative" ref={profileMenuRef}>
                <button
                    onClick={() => setIsProfileMenuOpen(prev => !prev)}
                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary rounded-full"
                    aria-label="User menu"
                >
                    <UserAvatar profile={user} />
                </button>
                <AnimatePresence>
                    {isProfileMenuOpen && (
                        <motion.div
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 bg-primary rounded-lg shadow-xl z-50 border-2 border-secondary/20 overflow-hidden"
                        >
                            <div className="px-4 py-3 border-b-2 border-secondary/10">
                                <p className="text-sm font-semibold text-secondary truncate">{user.name}</p>
                                <p className="text-xs text-secondary-light truncate">{user.email}</p>
                            </div>
                            <Link
                                href={profileLink}
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-secondary-light hover:bg-secondary/5 hover:text-secondary transition-colors"
                            >
                                <ProfileIcon className="w-4 h-4" />
                                {profileText}
                            </Link>
                            <div className="border-t-2 border-secondary/10"></div>
                            <Link
                                as="button"
                                method="post"
                                href={route('logout')}
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-secondary-light hover:bg-red-500/10 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Keluar
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex items-center gap-3">
            <Link
                href={route('login')}
                className="text-center text-secondary bg-transparent border-2 border-secondary hover:bg-secondary hover:text-primary font-medium rounded-lg text-sm px-4 py-2 transition-all"
            >
                Masuk
            </Link>

            <Link
                href={route('register')}
                className="text-center text-primary bg-secondary border-2 border-secondary hover:bg-secondary/90 font-medium rounded-lg text-sm px-4 py-2 transition-all"
            >
                Daftar
            </Link>
        </div>
    );
}
