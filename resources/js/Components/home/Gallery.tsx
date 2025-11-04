import { useTranslation } from 'react-i18next';

interface GalleryItem {
  id: number;
  imageSrc: string;
  translationKey: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    imageSrc: '/assets/home/gallery/gallery_1.webp',
    translationKey: 'gallery.items.1'
  },
  {
    id: 2,
    imageSrc: '/assets/home/gallery/gallery_2.webp',
    translationKey: 'gallery.items.2'
  },
  {
    id: 3,
    imageSrc: '/assets/home/gallery/gallery_3.webp',
    translationKey: 'gallery.items.3'
  },
  {
    id: 4,
    imageSrc: '/assets/home/gallery/gallery_4.webp',
    translationKey: 'gallery.items.4'
  },
  {
    id: 5,
    imageSrc: '/assets/home/gallery/gallery_5.webp',
    translationKey: 'gallery.items.5'
  },
  {
    id: 6,
    imageSrc: '/assets/home/gallery/gallery_6.webp',
    translationKey: 'gallery.items.6'
  }
];

const Gallery = () => {
  const { t } = useTranslation();

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
                alt={t(`${item.translationKey}.title`)}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold">
                  {t(`${item.translationKey}.title`)}
                </h3>
                <p className="text-sm mt-1 opacity-90">
                  {t(`${item.translationKey}.description`)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;