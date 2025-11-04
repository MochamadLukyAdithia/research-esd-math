import { useState, useEffect, useRef, useCallback } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { User as Profile } from '@/types';
import { NavigationLinks } from "./Navlink";
import { AuthSection } from "./Auth";
import LanguageDropdown from "./LanguageDropdown";

interface NavbarProps {
    user?: Profile | null;
}

const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
        opacity: 1,
        height: 'auto' as const,
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: { duration: 0.15, ease: [0.4, 0, 1, 1] as const }
    }
};

export default function Navbar({ user: propUser }: NavbarProps) {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { url, props } = usePage();
    const auth = props.auth as { user: Profile | null } | undefined;
    const user = propUser ?? auth?.user ?? null;
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleScroll = useCallback(() => {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolled(window.scrollY > 10);
        }, 50);
    }, []);

    const closeAllMenus = useCallback(() => setIsMenuOpen(false), []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [handleScroll]);

    useEffect(() => {
        closeAllMenus();
    }, [url, closeAllMenus]);

    return (
        <header
            className={clsx(
                "fixed top-0 left-0 right-0 h-[72px] z-50 bg-primary transition-shadow duration-300",
                isScrolled ? "shadow-lg border-b-2 border-secondary/10" : "border-b-2 border-transparent"
            )}
        >
            <div className="container mx-auto max-w-7xl px-6 xl:px-0 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3" onClick={closeAllMenus}>
                    {/* <img src="/logo/logo.png" alt="Logo" width={32} height={32} /> */}
                    <span className="sm:block text-xl font-bold text-secondary">ESD MathPath</span>
                </Link>

                <nav className="hidden lg:flex items-center gap-8">
                    <NavigationLinks url={url} />
                </nav>

                <div className="flex items-center gap-2">
                    <LanguageDropdown />
                    <AuthSection user={user} />

                    <button
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        className="lg:hidden p-2 -mr-2 rounded-full text-secondary-light hover:bg-secondary/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="lg:hidden absolute top-full left-0 right-0 bg-secondary shadow-xl z-50 border-t-2 border-primary/10 overflow-hidden"
                    >
                        <div className="container mx-auto">
                            <nav className="flex flex-col p-2">
                                <NavigationLinks isMobile onLinkClick={closeAllMenus} url={url} />

                                {!user && (
                                    <div className="flex flex-col gap-2 px-4 py-3 border-t-2 border-primary/10 mt-2">
                                        <Link
                                            href={route('login')}
                                            onClick={closeAllMenus}
                                            className="text-center text-primary bg-transparent border-2 border-primary hover:bg-primary hover:text-secondary font-medium rounded-lg text-sm px-4 py-2.5 transition-all"
                                        >
                                            {t('nav.login')}
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            onClick={closeAllMenus}
                                            className="text-center text-secondary bg-primary border-2 border-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-4 py-2.5 transition-all"
                                        >
                                            {t('nav.register')}
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}