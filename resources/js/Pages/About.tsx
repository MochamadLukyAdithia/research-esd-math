    import React from 'react';
    import User from '@/Layouts/UserLayout';
    import { Users, Globe2, Brain, Atom } from 'lucide-react';
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

    const AboutUsPage: React.FC = () => {
        const { t } = useTranslation();
        const colors = {
            esd: 'bg-blue-100 text-blue-800',
            ethno: 'bg-green-100 text-green-800',
            stem: 'bg-purple-100 text-purple-800',
        };

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
                    </div>
                </main>
            </User>
        );
    };

    export default AboutUsPage;