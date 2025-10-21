const galleryItems = [
  {
    id: 1,
    imageSrc: '/assets/home/gallery/gallery_1.webp',
    title: 'Jelajahi Rute Belajar',
    description: 'Temukan jalur-jalur matematika yang menantang di sekitarmu.'
  },
  {
    id: 2,
    imageSrc: '/assets/home/gallery/gallery_2.webp',
    title: 'Pecahkan Teka-Teki Interaktif',
    description: 'Setiap lokasi memiliki tantangan unik untuk diselesaikan.'
  },
  {
    id: 3,
    imageSrc: '/assets/home/gallery/gallery_3.webp',
    title: 'Belajar Sambil Bermain',
    description: 'Mengubah lingkungan sekitar menjadi papan permainan raksasa.'
  },
  {
    id: 4,
    imageSrc: '/assets/home/gallery/gallery_4.webp',
    title: 'Kumpulkan Poin & Lencana',
    description: 'Dapatkan penghargaan untuk setiap misi yang berhasil kamu selesaikan.'
  },
  {
    id: 5,
    imageSrc: '/assets/home/gallery/gallery_5.webp',
    title: 'Kerja Sama Tim',
    description: 'Selesaikan soal-soal bersama teman-temanmu.'
  },
  {
    id: 6,
    imageSrc: '/assets/home/gallery/gallery_6.webp',
    title: 'Petualangan Luar Ruangan',
    description: 'Jadikan setiap sudut kota sebagai arena belajarmu yang baru.'
  }
];

const Gallery = () => {
  return (
    <div className="w-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden cursor-pointer"
          >
            <div className="aspect-[4/3]">
              <img
                src={item.imageSrc}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm mt-1 opacity-90">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
