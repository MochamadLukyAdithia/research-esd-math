import { useTranslation } from "react-i18next";

const SDGsGoalsGrid = () => {
  const { t } = useTranslation();
  const goals = [
    { id: 1, title: t("sdgs.1"), bg: "bg_sdgs_1.webp", logo: "sdgs_1.webp" },
    { id: 2, title: t("sdgs.2"), bg: "bg_sdgs_2.webp", logo: "sdgs_2.webp" },
    { id: 3, title: t("sdgs.3"), bg: "bg_sdgs_3.webp", logo: "sdgs_3.webp" },
    { id: 4, title: t("sdgs.4"), bg: "bg_sdgs_4.webp", logo: "sdgs_4.webp" },
    { id: 5, title: t("sdgs.5"), bg: "bg_sdgs_5.webp", logo: "sdgs_5.webp" },
    { id: 6, title: t("sdgs.6"), bg: "bg_sdgs_6.webp", logo: "sdgs_6.webp" },
    { id: 7, title: t("sdgs.7"), bg: "bg_sdgs_7.webp", logo: "sdgs_7.webp" },
    { id: 8, title: t("sdgs.8"), bg: "bg_sdgs_8.webp", logo: "sdgs_8.webp" },
    { id: 9, title: t("sdgs.9"), bg: "bg_sdgs_9.webp", logo: "sdgs_9.webp" },
    { id: 10, title: t("sdgs.10"), bg: "bg_sdgs_10.webp", logo: "sdgs_10.webp" },
    { id: 11, title: t("sdgs.11"), bg: "bg_sdgs_11.webp", logo: "sdgs_11.webp" },
    { id: 12, title: t("sdgs.12"), bg: "bg_sdgs_12.webp", logo: "sdgs_12.webp" },
    { id: 13, title: t("sdgs.13"), bg: "bg_sdgs_13.webp", logo: "sdgs_13.webp" },
    { id: 14, title: t("sdgs.14"), bg: "bg_sdgs_14.webp", logo: "sdgs_14.webp" },
    { id: 15, title: t("sdgs.15"), bg: "bg_sdgs_15.webp", logo: "sdgs_15.webp" },
    { id: 16, title: t("sdgs.16"), bg: "bg_sdgs_16.webp", logo: "sdgs_16.webp" },
    { id: 17, title: t("sdgs.17"), bg: "bg_sdgs_17.webp", logo: "sdgs_17.webp" },
    { id: 18, title: t("sdgs.18"), bg: "bg_sdgs_18.webp", logo: "sdgs_18.webp", isViewAll: true },
  ];


  return (
    <div id="sdgs" className="w-screen">
      <div className="min-w-screen mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${goal.isViewAll
                  ? 'h-80 sm:h-96 md:h-80 lg:h-96'
                  : 'h-80 sm:h-96 md:h-80 lg:h-96'
                }`}
            >
              {goal.isViewAll ? (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <img
                    src={`/assets/home/logo-sdgs/${goal.logo}`}
                    alt="See all goals"
                    className="w-32 h-32 object-contain p-2"
                  />
                </div>
              ) : (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 filter grayscale group-hover:grayscale-0"
                    style={{
                      backgroundImage: `url('/assets/home/bg-sdgs/${goal.bg}')`
                    }}
                  />

                  <div className="absolute bottom-0 left-0 transition-all duration-300 ease-in-out group-hover:top-0 group-hover:left-0 group-hover:bottom-auto group-hover:left-auto">
                    <img
                      src={`/assets/home/logo-sdgs/${goal.logo}`}
                      alt={`SDG ${goal.id} logo`}
                      className="w-36 h-36 object-contain transition-all duration-300 ease-in-out group-hover:w-20 group-hover:h-20"
                    />
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-sm leading-tight line-clamp-4">{goal.title}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SDGsGoalsGrid;
