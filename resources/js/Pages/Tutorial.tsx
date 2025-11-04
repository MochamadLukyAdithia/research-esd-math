import React from 'react';
import User from '@/Layouts/UserLayout';
import {
    Compass,
    Rocket,
    Search,
    Map,
    List,
    Navigation,
    MousePointerClick,
    Filter,
    Keyboard,
    Tags,
    Star,
    ArrowDownUp,
    CheckCheck,
    Infinity,
    TriangleAlert,
    RotateCw,
    Lightbulb,
    Heart,
    Info,
    Copy,
    HelpCircle,
    ChevronDown,
} from 'lucide-react';
import { useTranslation } from "react-i18next";

const ContentCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => (
    <div className="flex-1 text-center group">
        <div className="w-10 h-10 mx-auto -mt-2 mb-3 bg-secondary text-white rounded-full flex items-center justify-center text-lg font-bold">
            {number}
        </div>
        <h3 className="font-bold text-secondary mb-2 text-lg">{title}</h3>
        <p className="text-sm text-secondary/70 leading-relaxed">{description}</p>
    </div>
);

const FeatureItem = ({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300">
        <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-md`}>
            {icon} 
        </div>
        <div>
            <h4 className="font-bold text-secondary mb-1">{title}</h4>
            <p className="text-sm text-secondary/70">{description}</p>
        </div>
    </div>
);

const TutorialPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <User>
            <div className="font-sans text-secondary bg-background">
                <section className="relative text-center text-white overflow-hidden bg-secondary">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
                            alt="Tutorial Background"
                            className="w-full h-full object-cover opacity-10"
                        />
                        <div className="absolute inset-0 bg-secondary/30"></div>
                    </div>
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white">
                            Tutorial <span className="text-primary-light">ESD MathPath</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/80">
                            {t('tutorial.hero.description')}
                        </p>
                    </div>
                </section>

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
                    <ContentCard>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-primary to-primary/70 text-secondary rounded-2xl flex items-center justify-center shadow-lg">
                                <Compass className="text-secondary" size={48} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">{t('tutorial.intro.title')}</h2>
                                <p className="text-secondary/80 leading-relaxed text-lg">
                                    <strong className="text-secondary">ESD MathPath Portal</strong> {t('tutorial.intro.description')}
                                </p>
                            </div>
                        </div>
                    </ContentCard>

                    <ContentCard className="bg-white">
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-12">
                            {t('tutorial.steps.title')}
                        </h2>
                        <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-4">
                            <StepCard
                                number={1}
                                title= {t('tutorial.steps.step1.title')}
                                description={t('tutorial.steps.step1.description')}
                            />
                            <StepCard
                                number={2}
                                title={t('tutorial.steps.step2.title')}
                                description={t('tutorial.steps.step2.description')}
                            />
                            <StepCard
                                number={3}
                                title={t('tutorial.steps.step3.title')}
                                description={t('tutorial.steps.step3.description')}
                            />

                            <StepCard
                                number={4}
                                title={t('tutorial.steps.step4.title')}
                                description={t('tutorial.steps.step4.description')}
                            />
                        </div>
                    </ContentCard>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ContentCard>
                            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6 flex items-center gap-3">
                                <Search className="h-7 w-7 text-primary" aria-hidden="true" />
                                {t('tutorial.search.title')}
                            </h2>
                            <div className="space-y-4">
                                <FeatureItem
                                    icon={<Map size={20} />}
                                    color="bg-blue-500"
                                    title={t('tutorial.search.map.title')}
                                    description={t('tutorial.search.map.description')}
                                />
                                <FeatureItem
                                    icon={<List size={20} />}
                                    color="bg-green-500"
                                    title={t('tutorial.search.list.title')}
                                    description={t('tutorial.search.list.description')}
                                />
                                <FeatureItem
                                    icon={<Navigation size={20} />}
                                    color="bg-purple-500"
                                    title={t('tutorial.search.distance.title')}
                                    description={t('tutorial.search.distance.description')}
                                />
                                <FeatureItem
                                    icon={<MousePointerClick size={20} />}
                                    color="bg-orange-500"
                                    title={t('tutorial.search.select.click')}
                                    description={t('tutorial.search.select.description')}
                                />
                            </div>
                        </ContentCard>

                        <ContentCard>
                            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6 flex items-center gap-3">
                                <Filter className="h-7 w-7 text-primary" aria-hidden="true" />
                                {t('tutorial.filter.title')}
                            </h2>
                            <div className="space-y-4">
                                <FeatureItem
                                    icon={<Keyboard size={20} />}
                                    color="bg-indigo-500"
                                    title={t('tutorial.filter.searchBar.title')}
                                    description={t('tutorial.filter.searchBar.description')}
                                />
                                <FeatureItem
                                    icon={<Tags size={20} />}
                                    color="bg-pink-500"
                                    title={t('tutorial.filter.tags.title')}
                                    description={t('tutorial.filter.tags.description')}
                                />
                                <FeatureItem
                                    icon={<Star size={20} />}
                                    color="bg-yellow-500"
                                    title={t('tutorial.filter.favorites.title')}
                                    description={t('tutorial.filter.favorites.description')}
                                />
                                <FeatureItem
                                    icon={<ArrowDownUp size={20} />}
                                    color="bg-teal-500"
                                    title= {t('tutorial.filter.sorting.title')}
                                    description= {t('tutorial.filter.sorting.description')}
                                />
                            </div>
                        </ContentCard>
                    </div>

                    <ContentCard className="bg-white">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 flex items-center justify-center gap-3">
                                {t('tutorial.cooldown.title')}
                            </h2>
                            <p className="text-secondary/70 max-w-2xl mx-auto">
                                {t('tutorial.cooldown.description')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-200">
                                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Infinity size={28} />
                                </div>
                                <h3 className="font-bold text-secondary text-center mb-2 text-lg"> {t('tutorial.cooldown.unlimited.title')}</h3>
                                <p className="text-sm text-secondary/70 text-center">
                                    {t('tutorial.cooldown.unlimited.description')}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-orange-200">
                                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <TriangleAlert size={28} />
                                </div>
                                <h3 className="font-bold text-secondary text-center mb-2 text-lg">{t('tutorial.cooldown.warning.title')}</h3>
                                <p className="text-sm text-secondary/70 text-center">
                                    {t('tutorial.cooldown.warning.description')}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
                                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <RotateCw size={28} />
                                </div>
                                <h3 className="font-bold text-secondary text-center mb-2 text-lg">{t('tutorial.cooldown.reset.title')}</h3>
                                <p className="text-sm text-secondary/70 text-center">
                                    {t('tutorial.cooldown.reset.description')}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                            <div className="flex items-start gap-4">
                                <Lightbulb className="text-blue-500 h-6 w-6 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-secondary mb-2"> {t('tutorial.cooldown.tips.title')}</h4>
                                    <ul className="text-sm text-secondary/80 space-y-1 list-disc list-inside">
                                        <li>{t('tutorial.cooldown.tips.tip1')}</li>
                                        <li>{t('tutorial.cooldown.tips.tip2')}</li>
                                        <li>{t('tutorial.cooldown.tips.tip3')}</li>
                                        <li>{t('tutorial.cooldown.tips.tip4')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </ContentCard>

                    <div className="grid md:grid-cols-2 gap-8">
                        <ContentCard>
                            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
                                <Heart className="h-6 w-6 text-red-500" aria-hidden="true" />
                                {t('tutorial.features.favorite.title')}
                            </h2>
                                <p className="text-secondary/80 mb-4 leading-relaxed">
                                    {t('tutorial.features.favorite.description')}
                                </p>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-secondary/70">
                                    <Info className="inline-block h-4 w-4 text-blue-500 mr-2" />
                                    {t('tutorial.features.favorite.info')}
                                </p>
                            </div>
                        </ContentCard>

                        <ContentCard>
                            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
                                <Copy className="h-6 w-6 text-purple-500" aria-hidden="true" />
                                {t('tutorial.features.copy.title')}
                            </h2>
                            <p className="text-secondary/80 mb-4 leading-relaxed">
                                {t('tutorial.features.copy.description')}
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-secondary/70">
                                    <Info className="inline-block h-4 w-4 text-blue-500 mr-2" />
                                    {t('tutorial.features.copy.info')}
                                </p>
                            </div>
                        </ContentCard>
                    </div>

                    <ContentCard>
                        <h2 className="text-3xl font-bold text-secondary text-center mb-8 flex items-center justify-center gap-3">
                            <HelpCircle className="h-8 w-8 text-primary" aria-hidden="true" />
                            {t('tutorial.faq.title')}
                        </h2>
                        <div className="space-y-4">
                            <details className="group bg-gray-50 rounded-lg p-5 cursor-pointer hover:bg-gray-100 transition-colors">
                                <summary className="font-bold text-secondary flex items-center justify-between">
                                    <span>{t('tutorial.faq.q1.question')}</span>
                                    <ChevronDown className="group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-3 text-secondary/70 text-sm leading-relaxed">
                                    {t('tutorial.faq.q1.answer')}
                                </p>
                            </details>

                            <details className="group bg-gray-50 rounded-lg p-5 cursor-pointer hover:bg-gray-100 transition-colors">
                                <summary className="font-bold text-secondary flex items-center justify-between">
                                    <span>{t('tutorial.faq.q2.question')}</span>
                                    <ChevronDown className="group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-3 text-secondary/70 text-sm leading-relaxed">
                                    {t('tutorial.faq.q2.answer')}
                                </p>
                            </details>

                            <details className="group bg-gray-50 rounded-lg p-5 cursor-pointer hover:bg-gray-100 transition-colors">
                                <summary className="font-bold text-secondary flex items-center justify-between">
                                    <span>{t('tutorial.faq.q3.question')}</span>
                                    <ChevronDown className="group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-3 text-secondary/70 text-sm leading-relaxed">
                                    {t('tutorial.faq.q3.answer')}
                                </p>
                            </details>

                            <details className="group bg-gray-50 rounded-lg p-5 cursor-pointer hover:bg-gray-100 transition-colors">
                                <summary className="font-bold text-secondary flex items-center justify-between">
                                    <span>{t('tutorial.faq.q4.question')}</span>
                                    <ChevronDown className="group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-3 text-secondary/70 text-sm leading-relaxed">
                                    {t('tutorial.faq.q4.answer')}
                                </p>
                            </details>
                        </div>
                    </ContentCard>

                    <ContentCard className="bg-gradient-to-r from-secondary to-secondary/90 text-white text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('tutorial.cta.title')}</h2>
                        <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
                            {t('tutorial.cta.description')}
                        </p>
                        <a
                            href="/portal"
                            className="inline-block bg-primary hover:bg-primary/90 text-secondary font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            {t('tutorial.cta.button')}
                        </a>
                    </ContentCard>
                </main>
            </div>
        </User>
    );
};

export default TutorialPage;