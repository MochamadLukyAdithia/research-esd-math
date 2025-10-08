import React from 'react';
import User from '@/Layouts/UserLayout';

const ContentCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

const PinLegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-4">
        <span className={`flex-shrink-0 w-5 h-5 rounded-full ${color} ring-1 ring-black/10`}></span>
        <span className="text-secondary/90">{label}</span>
    </div>
);

const TutorialPage: React.FC = () => {
    return (
        <User>
            <div className="font-sans text-secondary">
                <section className="relative text-center text-white overflow-hidden bg-secondary">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
                            alt="Tutorial Background"
                            className="w-full h-full object-cover opacity-10"
                        />
                        <div className="absolute inset-0 bg-secondary/30"></div>
                    </div>
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white">
                            Tutorial <span className="text-primary-light">ESD MathPath</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/80">
                            Panduan lengkap untuk mengubah lingkungan sekitar Anda menjadi petualangan matematika yang seru dan interaktif.
                        </p>
                    </div>
                </section>

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
                    <ContentCard>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0 w-20 h-20 bg-primary-light text-secondary rounded-full flex items-center justify-center">
                                <i className="fas fa-map-signs text-4xl"></i>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-secondary-light mb-2">1. Apa itu ESD MathPath?</h2>
                                <p className="text-secondary/90 leading-relaxed">
                                    <strong>ESD MathPath</strong> adalah platform yang mengubah dunia nyata menjadi laboratorium matematika. Menggunakan konsep <strong>jalur matematika (math trail)</strong>, aplikasi ini menghubungkan objek di sekitar Anda dengan soal-soal matematika yang menarik.
                                </p>
                            </div>
                        </div>
                    </ContentCard>

                    <ContentCard>
                        <h2 className="text-2xl md:text-3xl font-bold text-secondary-light text-center mb-8">2. Cara Membuat Tugas</h2>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 bg-primary-light text-secondary rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                                <h3 className="font-semibold text-secondary mb-1">Registrasi & Login</h3>
                                <p className="text-sm text-secondary/80">Kunjungi <a href="https://esdmathpath.id" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-primary">esdmathpath.id</a>, daftar & masuk.</p>
                            </div>
                            <i className="fas fa-arrow-right text-2xl text-gray-300 hidden md:block"></i>
                            <div className="flex-1 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 bg-primary-light text-secondary rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                                <h3 className="font-semibold text-secondary mb-1">Buka Portal Tugas</h3>
                                <p className="text-sm text-secondary/80">Klik "Portal", lalu "Tugas" & "Tugas Baru".</p>
                            </div>
                            <i className="fas fa-arrow-right text-2xl text-gray-300 hidden md:block"></i>
                            <div className="flex-1 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 bg-primary-light text-secondary rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                                <h3 className="font-semibold text-secondary mb-1">Isi Detail & Simpan</h3>
                                <p className="text-sm text-secondary/80">Tulis detail tugas, tentukan lokasi, & simpan.</p>
                            </div>
                        </div>
                    </ContentCard>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <ContentCard className="lg:col-span-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-secondary-light mb-8">3. Cara Membuat Rute <em>Math Trail</em></h2>
                            <ol className="relative border-l-2 border-primary/50 space-y-8">
                                {[
                                    { icon: "fa-route", title: "Pilih Menu Rute", desc: 'Klik "Rute" lalu "Rute Baru" untuk memulai.' },
                                    { icon: "fa-tasks", title: "Tambahkan Tugas ke Peta", desc: "Klik dua kali pada pin tugas untuk menambahkannya ke rute." },
                                    { icon: "fa-sort-amount-down", title: "Atur Urutan Tugas", desc: "Gunakan fitur drag & drop untuk memastikan alur rute logis." },
                                    { icon: "fa-save", title: "Simpan Rute Anda", desc: 'Isi detail rute dan klik "Buat" untuk menyimpan.' }
                                ].map((item, index) => (
                                    <li key={index} className="ml-8">
                                        <span className="absolute flex items-center justify-center w-8 h-8 bg-primary-light text-secondary rounded-full -left-4 ring-4 ring-white">
                                            <i className={`fas ${item.icon}`}></i>
                                        </span>
                                        <h3 className="font-semibold text-secondary">{item.title}</h3>
                                        <p className="text-sm text-secondary/80">{item.desc}</p>
                                    </li>
                                ))}
                            </ol>
                        </ContentCard>

                        <ContentCard>
                            <h2 className="text-2xl md:text-3xl font-bold text-secondary-light mb-8">4. Arti Warna Pin</h2>
                            <div className="space-y-4">
                                <PinLegendItem color="bg-red-600" label="Rute Publik" />
                                <PinLegendItem color="bg-purple-800" label="Rute Privat" />
                                <PinLegendItem color="bg-blue-600" label="Tugas Publik" />
                                <PinLegendItem color="bg-slate-500" label="Tugas Privat" />
                                <PinLegendItem color="bg-sky-400" label="Tugas Bagian dari Rute" />
                            </div>
                        </ContentCard>
                    </div>

                    <ContentCard>
                        <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-secondary-light mb-4">5. Butuh Bantuan Visual?</h2>
                            <p className="max-w-2xl mx-auto text-secondary/80 mb-8">
                                Tonton playlist tutorial video kami untuk panduan langkah demi langkah yang lebih jelas.
                            </p>
                            <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                                <iframe
                                    src="https://www.youtube.com/embed/videoseries?list=PLtP-2l-dGgL8wuNTeA-62ihPAb-G_CV-d"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    </ContentCard>
                </main>
            </div>
        </User>
    );
};

export default TutorialPage;
