import React from 'react';
import { useTranslation } from "react-i18next";


const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <footer className="bg-primary text-secondary py-10 px-5 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">

            <div className="md:w-2/5">
              <h4 className="text-xl font-bold mb-5">ESD.MathPath</h4>
              <p className="leading-relaxed">
                {t('nav.footer')  }
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-5">{t('nav.quick-link')}</h4>
              <ul className="space-y-3">
                <li><a href="/" className="hover:underline">{t('nav.home')}</a></li>
                <li><a href="/portal" className="hover:underline">{t('nav.portal')}</a></li>
                <li><a href="/tutorial" className="hover:underline">{t('nav.tutorial')}</a></li>
                <li><a href="/about-us" className="hover:underline">{t('nav.about')}</a></li>
                <li><a href="/news" className="hover:underline">{t('nav.news')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-5">{t('nav.contact')}</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span>
                    Jalan Kalimantan No. 37, ,
                    <br />
                    Kampus Tegalboto, Sumbersari
                    <br />
                    Kabupaten Jember
                  </span>
                </li>
                <li className="flex items-start">
                  <span>+62 852-3639-5454</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-5 text-left border-t border-secondary/10">
            <p>2025 ESD.MathPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
