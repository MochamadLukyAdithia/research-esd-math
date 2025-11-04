import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/translation.json';
import idTranslation from './locales/id/translation.json';
import jvTranslation from './locales/jv/translation.json';
import madTranslation from './locales/mad/translation.json';

export const resources = {
  en: {
    translation: enTranslation,
  },
  id: {
    translation: idTranslation,
  },
  jv: {
    translation: jvTranslation,
  },
  mad: {
    translation: madTranslation,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'id', 
    lng: 'id',
    defaultNS: 'translation',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;