import { useTranslation } from "react-i18next";

const Persuate = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-secondary">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-background sm:text-4xl">
          {t('persuate.judul')}
        </h2>
        <p className="mt-4 text-lg leading-6 text-gray-200">
          {t('persuate.deskripsi')}
        </p>
        <a
          href="/portal"
          className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-bold text-secondary bg-primary hover:bg-primary-light transition-colors duration-300 sm:w-auto"
        >
          {t('persuate.cta')}
        </a>
      </div>
    </section>
  );
};

export default Persuate;
