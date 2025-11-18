import React from 'react';
import User from '@/Layouts/UserLayout';
import { Globe2, Brain, Atom, ExternalLink } from 'lucide-react';
import { useTranslation } from "react-i18next";

const ContentCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-lg ${className}`}>
        {children}
    </div>
);

const FocusBadge = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
    <div className={`flex items-center gap-2 py-2 px-4 rounded-full ${color}`}>
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </div>
);

const TeamMemberCard = ({
    name,
    role,
    imagePath
}: {
    name: string;
    role: string;
    imagePath: string;
}) => (
    <ContentCard className="transition-all duration-300 hover:shadow-xl h-full">
        <div className="flex flex-col items-center text-center">
            <img
                src={imagePath}
                alt={`Foto ${name}`}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-100 shadow-lg"
            />
            <h3 className="text-lg font-bold text-secondary mb-1">
                {name}
            </h3>
            <p className="text-sm text-primary font-medium">
                {role}
            </p>
        </div>
    </ContentCard>
);

const AboutUsPage: React.FC = () => {
    const { t } = useTranslation();
    const colors = {
        esd: 'bg-blue-100 text-blue-800',
        ethno: 'bg-green-100 text-green-800',
        stem: 'bg-purple-100 text-purple-800',
    };

    const teamMembers = [
        {
            name: 'Mochamad Luky Adithia',
            role: 'Koordinator',
            imagePath: '/assets/about/luky.webp'
        },
        {
            name: 'Richie Olajuwon Santoso',
            role: 'UI/UX Designer & Frontend Developer',
            imagePath: '/assets/about/richie.webp'
        },
        {
            name: 'Mohammad Setiawan Wibisono',
            role: 'Backend Developer',
            imagePath: '/assets/about/iwan.webp'
        },
        {
            name: 'Devies Ade Irawan',
            role: 'Backend Developer',
            imagePath: '/assets/about/devies.webp'
        },
        {
            name: 'Rimbi Siara',
            role: 'System Request',
            imagePath: '/assets/about/rimbi.webp'
        }
    ];

    return (
        <User>
            <section className="relative text-center text-white overflow-hidden bg-secondary h-64 md:h-72 flex flex-col justify-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
                        alt="About Us Background"
                        className="w-full h-full object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-secondary/30"></div>
                </div>
            </section>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative z-10 -mt-32 md:-mt-36 pb-16">
                    <ContentCard className="max-w-3xl mx-auto transition-all duration-300 hover:shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <img
                                src="/assets/about/owner_esd.webp"
                                alt="Foto Dr. Dian Kurniati"
                                className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover -mt-24 md:-mt-28 mb-4
                                        border-8 border-white shadow-xl"
                            />
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-1">
                                Dr. Dian Kurniati
                            </h2>
                            <p className="text-lg font-semibold text-primary mb-6">
                                Founder & Academic Coordinator – ESDMathPath
                            </p>

                            {/* Scopus Button */}
                            <div className="flex justify-center">
                                <a
                                    href="https://www.scopus.com/authid/detail.uri?authorId=57193683206"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                                    title="Lihat profil Scopus Dr. Dian Kurniati"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0m3.28 16.85c-.29.41-.8.64-1.34.64-.96 0-1.73-.77-1.73-1.73s.77-1.73 1.73-1.73c.53 0 1.04.24 1.34.64l1.05-.75c-.58-.82-1.54-1.35-2.64-1.35-2.07 0-3.76 1.68-3.76 3.76s1.68 3.76 3.76 3.76c1.54 0 2.86-.91 3.45-2.23l-1.2-.86z"/>
                                    </svg>
                                    View Scopus Profile
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-200" />
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-secondary mb-4 text-left">{t('about.fokus')}</h3>
                            <div className="flex flex-wrap justify-start gap-3">
                                <FocusBadge
                                    icon={<Globe2 size={16} />}
                                    label="ESD"
                                    color={colors.esd}
                                />
                                <FocusBadge
                                    icon={<Brain size={16} />}
                                    label="Ethnomathematics"
                                    color={colors.ethno}
                                />
                                <FocusBadge
                                    icon={<Atom size={16} />}
                                    label="STEM"
                                    color={colors.stem}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-secondary mb-3 text-left">{t('about.tentang')}</h3>
                            <p className="text-secondary/80 leading-relaxed text-left">
                                {t('about.deskripsi')}
                            </p>
                        </div>
                    </ContentCard>

                    <div className="mt-16 max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">
                                {t('about.dev')}
                            </h2>
                            <p className="text-secondary/70 text-lg max-w-2xl mx-auto">
                                {t('about.devdeskripsi')}
                            </p>
                        </div>


                        <div className="flex flex-wrap justify-center gap-6">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                                    <TeamMemberCard
                                        name={member.name}
                                        role={member.role}
                                        imagePath={member.imagePath}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </User>
    );
};

export default AboutUsPage;
