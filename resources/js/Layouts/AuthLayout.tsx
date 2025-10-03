import { ReactNode, useState, useEffect, ElementType } from "react";
import { motion } from "framer-motion";
import {
    Sigma,
    Calculator,
    Pi,
    Infinity as InfinityIcon,
    FunctionSquare,
    Divide,
} from "lucide-react";

type IconProp = {
    IconComponent: ElementType;
    className: string;
    left: string;
    delay: number;
    duration: number;
    scale: number;
};

interface StatsProps {
    competitions: string;
    companies: string;
    activeUsers: string;
}

interface AuthLayoutProps {
    children: ReactNode;
    stats?: StatsProps;
    scrollable?: boolean;
}

const AnimatedIconsRain = () => {
    const [iconsProps, setIconsProps] = useState<IconProp[]>([]);

    useEffect(() => {
        const generatedIcons: IconProp[] = [];
        const numberOfIcons = 20;
        const icons = [
            Sigma,
            Calculator,
            Pi,
            InfinityIcon,
            FunctionSquare,
            Divide,
        ];
        const colorClasses = ["text-primary", "text-primary-light"];

        for (let i = 0; i < numberOfIcons; i++) {
            generatedIcons.push({
                IconComponent: icons[i % icons.length],
                className: colorClasses[i % colorClasses.length],
                left: `${Math.random() * 100}%`,
                delay: Math.random() * 5,
                duration: Math.random() * 7 + 6,
                scale: Math.random() * 0.5 + 0.5,
            });
        }
        setIconsProps(generatedIcons);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {iconsProps.map((props, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${props.className}`}
                    style={{
                        left: props.left,
                        fontSize: `${props.scale * 1.5}rem`,
                    }}
                    initial={{ y: "-10vh", scale: props.scale, opacity: 0 }}
                    animate={{ y: "110vh", scale: props.scale, opacity: 0.8 }}
                    transition={{
                        delay: props.delay,
                        duration: props.duration,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                >
                    <props.IconComponent />
                </motion.div>
            ))}
        </div>
    );
};

export default function AuthLayout({
    children,
    stats,
    scrollable = true,
}: AuthLayoutProps) {
    return (
        <div className={`flex h-screen ${scrollable ? "overflow-y-auto" : ""}`}>
            <div className="hidden md:flex md:w-1/2 bg-secondary relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 z-20">
                    <AnimatedIconsRain />
                </div>
                <div className="absolute inset-0 bg-secondary/95 z-10 backdrop-blur-sm"></div>
                <div className="relative z-30 w-full h-full flex flex-col items-center justify-center text-center">
                    <div>
                        <motion.div
                            className="mb-16"
                            initial={{ y: -10 }}
                            animate={{ y: 10 }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "mirror",
                            }}
                        >
                            <img
                                src="/logo/logo.png"
                                alt="Logo"
                                width={110}
                                height={110}
                                className="relative object-contain drop-shadow-lg mx-auto"
                            />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-primary">
                            ESD MathPath
                        </h2>
                        <p className="text-background mt-4 text-md max-w-md mx-auto">
                            ESD MathPath adalah platform inovatif yang dirancang
                            untuk membantu siswa, guru, dan siapa saja yang
                            ingin belajar matematika dengan cara yang lebih
                            interaktif. 
                        </p>
                    </div>
                    {stats && (
                        <div className="mt-10 flex gap-x-8 text-center justify-center">
                            <div>
                                <p className="text-2xl font-bold text-primary">
                                    {stats.competitions}
                                </p>
                                <p className="text-sm text-background">
                                    Info Lomba
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">
                                    {stats.companies}
                                </p>
                                <p className="text-sm text-background">
                                    Perusahaan
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">
                                    {stats.activeUsers}
                                </p>
                                <p className="text-sm text-background">
                                    Pengguna Aktif
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div
                className={`w-full md:w-1/2 bg-primary flex items-start md:items-center justify-center p-6 sm:p-8 py-12 ${
                    scrollable ? "overflow-y-auto" : ""
                }`}
            >
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
