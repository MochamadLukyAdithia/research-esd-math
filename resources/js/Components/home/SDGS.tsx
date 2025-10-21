const SDGsGoalsGrid = () => {
  const goals = [
    { id: 1, title: "End poverty in all its forms everywhere.", bg: "bg_sdgs_1.webp", logo: "sdgs_1.webp" },
    { id: 2, title: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture.", bg: "bg_sdgs_2.webp", logo: "sdgs_2.webp" },
    { id: 3, title: "Ensure healthy lives and promote well-being for all at all ages.", bg: "bg_sdgs_3.webp", logo: "sdgs_3.webp" },
    { id: 4, title: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.", bg: "bg_sdgs_4.webp", logo: "sdgs_4.webp" },
    { id: 5, title: "Achieve gender equality and empower all women and girls.", bg: "bg_sdgs_5.webp", logo: "sdgs_5.webp" },
    { id: 6, title: "Ensure availability and sustainable management of water and sanitation for all.", bg: "bg_sdgs_6.webp", logo: "sdgs_6.webp" },
    { id: 7, title: "Ensure access to affordable, reliable, sustainable and modern energy for all.", bg: "bg_sdgs_7.webp", logo: "sdgs_7.webp" },
    { id: 8, title: "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.", bg: "bg_sdgs_8.webp", logo: "sdgs_8.webp" },
    { id: 9, title: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.", bg: "bg_sdgs_9.webp", logo: "sdgs_9.webp" },
    { id: 10, title: "Reduce inequality within and among countries.", bg: "bg_sdgs_10.webp", logo: "sdgs_10.webp" },
    { id: 11, title: "Make cities and human settlements inclusive, safe, resilient and sustainable.", bg: "bg_sdgs_11.webp", logo: "sdgs_11.webp" },
    { id: 12, title: "Ensure sustainable consumption and production patterns.", bg: "bg_sdgs_12.webp", logo: "sdgs_12.webp" },
    { id: 13, title: "Take urgent action to combat climate change and its impacts.", bg: "bg_sdgs_13.webp", logo: "sdgs_13.webp" },
    { id: 14, title: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development.", bg: "bg_sdgs_14.webp", logo: "sdgs_14.webp" },
    { id: 15, title: "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.", bg: "bg_sdgs_15.webp", logo: "sdgs_15.webp" },
    { id: 16, title: "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.", bg: "bg_sdgs_16.webp", logo: "sdgs_16.webp" },
    { id: 17, title: "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.", bg: "bg_sdgs_17.webp", logo: "sdgs_17.webp" },
    { id: 18, title: "See all goals", bg: "bg_sdgs_18.webp", logo: "sdgs_18.webp", isViewAll: true }
  ];

  return (
    <div id="sdgs" className="w-screen">
      <div className="min-w-screen mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                goal.isViewAll
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
