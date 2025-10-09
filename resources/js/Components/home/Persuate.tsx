const Persuate = () => {
  return (
    <section className="bg-secondary">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-background sm:text-4xl">
          Ayo Mulai Perjalananmu di ESD MathPath
        </h2>
        <p className="mt-4 text-lg leading-6 text-gray-200">
          Sudah siap menjelajahi berbagai fitur seru di ESD MathPath? Dengan login sekarang juga, kamu bisa mengakses seluruh fitur lengkap, menyimpan progres belajarmu, dan mencoba berbagai tools interaktif yang membuat proses belajar jadi lebih menyenangkan. Jangan cuma lihat-lihat, yuk mulai perjalananmu dan nikmati pengalaman belajar yang berbeda bersama ESD MathPath!
        </p>
        <a
          href="/login"
          className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-bold text-secondary bg-primary hover:bg-primary-light transition-colors duration-300 sm:w-auto"
        >
          Cobain Sekarang Juga
        </a>
      </div>
    </section>
  );
};

export default Persuate;
