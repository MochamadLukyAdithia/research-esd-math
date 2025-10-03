import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = {
    id: { name: 'Indonesia', flag: '🇮🇩' },
    en: { name: 'English', flag: '🇺🇸' },
};

const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
};

export default function LanguageDropdown() {
    const [currentLang, setCurrentLang] = useState<'id' | 'en'>('id');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (lang: 'id' | 'en') => {
        setCurrentLang(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary-light hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
                aria-label="Change language"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLang.toUpperCase()}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-primary rounded-lg shadow-xl z-50 border-2 border-secondary/20 overflow-hidden"
                    >
                        <div className="py-1">
                            {Object.entries(languages).map(([code, { name, flag }]) => (
                                <button
                                    key={code}
                                    onClick={() => handleLanguageChange(code as 'id' | 'en')}
                                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                                        currentLang === code
                                            ? 'bg-secondary/10 text-secondary font-medium'
                                            : 'text-secondary-light hover:bg-secondary/5 hover:text-secondary'
                                    }`}
                                >
                                    <span className="text-lg">{flag}</span>
                                    <span>{name}</span>
                                    {currentLang === code && (
                                        <span className="ml-auto text-secondary">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
