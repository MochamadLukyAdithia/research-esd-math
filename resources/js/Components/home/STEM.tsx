const STEM = () => {
  return (
    <section className="relative py-20 bg-primary text-secondary overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">

          <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full max-w-md sm:max-w-lg mx-auto">
            {[
              { src: "/assets/home/stem/stem_1.webp", label: "Science" },
              { src: "/assets/home/stem/stem_2.webp", label: "Technology" },
              { src: "/assets/home/stem/stem_3.webp", label: "Engineering" },
              { src: "/assets/home/stem/stem_4.webp", label: "Mathematics" },
            ].map((item, i) => (
              <div
                key={i}
                className="relative group overflow-hidden rounded-xl"
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover rounded-xl shadow-xl transform transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Science, Technology, Engineering, and Mathematics
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed opacity-90">
              STEM yang digagas oleh Amerika Serikat ini merupakan pendekatan
              yang menggabungkan keempat disiplin ilmu tersebut secara terpadu
              ke dalam metode pembelajaran berbasis masalah dan kejadian
              kontekstual sehari-hari. Metode pembelajaran berbasis STEM
              menerapkan pengetahuan dan keterampilan secara bersamaan untuk
              menyelesaikan suatu kasus. Pendekatan ini dinyatakan sebagai
              pendekatan pembelajaran abad-21 dalam upaya untuk menghasilkan
              sumber daya manusia dengan kognitif, psikomotor dan afektif yang
              berkualitas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default STEM;
