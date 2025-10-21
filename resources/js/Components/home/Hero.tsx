import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/assets/home/hero/hero_1.webp',
    headline: 'Ubah Dunia Menjadi Arena Belajarmu',
    description: 'Jelajahi lingkungan sekitarmu, pecahkan teka-teki matematika yang menantang, dan lihat bagaimana angka membentuk dunia di sekitar kita.',
    buttonText: 'Mulai Petualangan',
    buttonLink: '/portal',
  },
  {
    image: '/assets/home/hero/hero_2.webp',
    headline: 'Pembelajaran Interaktif Berbasis Peta',
    description: 'Dengan ESD MathPath, setiap sudut kota adalah ruang kelas baru. Belajar matematika tidak pernah semenyenangkan ini.',
    buttonText: 'Jelajahi Fitur',
    buttonLink: '#feature',
  },
  {
    image: '/assets/home/hero/hero_3.webp',
    headline: 'Terhubung dengan Tujuan Pembangunan Berkelanjutan',
    description: 'Setiap misi dirancang untuk meningkatkan kesadaran akan SDGs, menjadikanmu agen perubahan untuk masa depan yang lebih baik.',
    buttonText: 'Pelajari SDGs',
    buttonLink: '#sdgs',
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentSlide === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentSlide - 1;
    setCurrentSlide(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentSlide === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentSlide + 1;
    setCurrentSlide(newIndex);
  };

  useEffect(() => {
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 7000);
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  const handleButtonClick = (link: string) => {
    if (link.startsWith('#')) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = link;
    }
  };

  return (
    <div className="h-screen w-full relative group overflow-hidden -mt-[72px]">
      <div className="w-full h-full">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white p-4 w-full max-w-4xl">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`transition-opacity duration-1000 ${
              currentSlide === index
                ? 'opacity-100 relative z-10'
                : 'opacity-0 absolute inset-0 pointer-events-none'
            }`}
          >
             {currentSlide === index && (
                <div className="animate-fadeIn">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">
                        {slide.headline}
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-shadow">
                        {slide.description}
                    </p>
                    <button
                        onClick={() => handleButtonClick(slide.buttonLink)}
                        className="bg-primary text-secondary font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 inline-block"
                    >
                        {slide.buttonText}
                    </button>
                </div>
             )}
          </div>
        ))}
      </div>

      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer hover:bg-white/30 transition">
        <ChevronLeft onClick={prevSlide} size={30} />
      </div>
      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer hover:bg-white/30 transition">
        <ChevronRight onClick={nextSlide} size={30} />
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === index ? 'bg-primary scale-125' : 'bg-white/50'}`}
          ></div>
        ))}
      </div>

      <style>{`
        .text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
        .text-shadow-lg { text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Hero;
