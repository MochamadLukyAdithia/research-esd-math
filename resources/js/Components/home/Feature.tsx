import { useTranslation } from "react-i18next";
import React from 'react';

const FeatureSection = () => {
  const { t } = useTranslation(); 
  return (
    <section id='feature' className="bg-secondary text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="pr-8">
          <h2 className="text-4xl font-bold mb-6">
            ESD.MathPath
          </h2>
          <p className="text-lg leading-relaxed opacity-90">
            {t('feature.deskripsi')}
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src="/assets/home/feature.png"
            alt="Peta Interaktif ESD MathPath"
            className="w-full h-auto object-cover"
          />

          <a
            href="/portal"
            className="absolute bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-sm py-2 text-center text-xl font-bold text-white hover:bg-secondary/90 transition-colors duration-300"
          >
            Portal
          </a>
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;
