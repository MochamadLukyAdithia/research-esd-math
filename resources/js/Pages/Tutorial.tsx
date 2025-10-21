import React from 'react';
import User from '@/Layouts/UserLayout';
import {
    Compass,
    Rocket,
    Search,
    Map,
    List,
    Navigation,
    MousePointerClick,
    Filter,
    Keyboard,
    Tags,
    Star,
    ArrowDownUp,
    CheckCheck,
    Infinity,
    TriangleAlert,
    RotateCw,
    Lightbulb,
    Heart,
    Info,
    Copy,
    HelpCircle,
    ChevronDown,
} from 'lucide-react';

const ContentCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => (
    <div className="flex-1 text-center group">
        <div className="w-10 h-10 mx-auto -mt-2 mb-3 bg-secondary text-white rounded-full flex items-center justify-center text-lg font-bold">
            {number}
        </div>
        <h3 className="font-bold text-secondary mb-2 text-lg">{title}</h3>
        <p className="text-sm text-secondary/70 leading-relaxed">{description}</p>
    </div>
);

const FeatureItem = ({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300">
        <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-md`}>
            {icon} 
        </div>
        <div>
            <h4 className="font-bold text-secondary mb-1">{title}</h4>
            <p className="text-sm text-secondary/70">{description}</p>
        </div>
    </div>
);

const TutorialPage: React.FC = () => {
    return (
        <User>
            <div className="font-sans text-secondary bg-background">
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

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
                    <ContentCard>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-primary to-primary/70 text-secondary rounded-2xl flex items-center justify-center shadow-lg">
                                <Compass className="text-secondary" size={48} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Apa itu ESD MathPath Portal?</h2>
                                <p className="text-secondary/80 leading-relaxed text-lg">
                                    <strong className="text-secondary">ESD MathPath Portal</strong> adalah platform pembelajaran matematika berbasis lokasi yang mengubah lingkungan sekitar menjadi ruang kelas interaktif. Temukan soal matematika kontekstual, kerjakan dengan sistem jawaban berulang, dan lacak progress Anda dengan peta digital yang menarik!
                                </p>
                            </div>
                        </div>
                    </ContentCard>

                    <ContentCard className="bg-white">
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-12">
                            Mulai Petualangan Anda
                        </h2>
                        <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-4">
                            <StepCard
                                number={1}
                                title="Registrasi & Login"
                                description="Daftar akun baru atau login ke ESD MathPath Portal untuk mulai belajar"
                            />
                            <StepCard
                                number={2}
                                title="Buka Portal"
                                description="Klik menu 'Portal' untuk melihat peta interaktif dengan soal-soal matematika"
                            />
                            <StepCard
                                number={3}
                                title="Pilih Soal"
                                description="Cari soal terdekat atau gunakan filter untuk menemukan soal sesuai kebutuhan"
                            />

                            <StepCard
                                number={4}
                                title="Kerjakan Soal"
                                description="Jawab soal dan submit! Sistem akan auto-check jawaban Anda"
                            />
                        </div>
                    </ContentCard>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ContentCard>
                            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6 flex items-center gap-3">
                                <Search className="h-7 w-7 text-primary" aria-hidden="true" />
                                Cara Mencari Soal
                            </h2>
                            <div className="space-y-4">
                                <FeatureItem
                                    icon={<Map size={20} />}
                                    color="bg-blue-500"
                                    title="Jelajahi Peta Interaktif"
                                    description="Gunakan peta untuk melihat semua soal di sekitar Anda. Pin berwarna menunjukkan lokasi soal."
                                />
                                <FeatureItem
                                    icon={<List size={20} />}
                                    color="bg-green-500"
                                    title="List View"
                                    description="Lihat daftar soal dalam bentuk card di sidebar. Setiap card menampilkan info lokasi dan jarak."
                                />
                                <FeatureItem
                                    icon={<Navigation size={20} />}
                                    color="bg-purple-500"
                                    title="Sorting by Distance"
                                    description="Soal otomatis diurutkan berdasarkan jarak terdekat dari lokasi Anda saat ini."
                                />
                                <FeatureItem
                                    icon={<MousePointerClick size={20} />}
                                    color="bg-orange-500"
                                    title="Klik untuk Detail"
                                    description="Klik card soal atau pin di peta untuk melihat preview, lalu klik 'Tampilkan Soal' untuk mulai."
                                />
                            </div>
                        </ContentCard>

                        <ContentCard>
                            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6 flex items-center gap-3">
                                <Filter className="h-7 w-7 text-primary" aria-hidden="true" />
                                Filter & Pencarian
                            </h2>
                            <div className="space-y-4">
                                <FeatureItem
                                    icon={<Keyboard size={20} />}
                                    color="bg-indigo-500"
                                    title="Search Bar"
                                    description="Ketik nama lokasi atau kata kunci untuk mencari soal spesifik dengan cepat."
                                />
                                <FeatureItem
                                    icon={<Tags size={20} />}
                                    color="bg-pink-500"
                                    title="Filter by Tags"
                                    description="Pilih tag seperti 'Geometri', 'Aljabar', atau topik lain untuk filter soal berdasarkan kategori."
                                />
                                <FeatureItem
                                    icon={<Star size={20} />}
                                    color="bg-yellow-500"
                                    title="Favorit Saya"
                                    description="Aktifkan filter 'Favorit' untuk hanya menampilkan soal yang sudah Anda tandai favoritkan."
                                />
                                <FeatureItem
                                    icon={<ArrowDownUp size={20} />}
                                    color="bg-teal-500"
                                    title="Sorting Options"
                                    description="Urutkan soal berdasarkan jarak terdekat atau tanggal terbaru sesuai preferensi."
                                />
                            </div>
                        </ContentCard>
                    </div>

                    <ContentCard className="bg-white">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 flex items-center justify-center gap-3">
                                Sistem Jawaban & Cooldown
                            </h2>
                            <p className="text-secondary/70 max-w-2xl mx-auto">
                                ESD MathPath menggunakan sistem jawaban berulang dengan cooldown untuk mendorong pembelajaran yang efektif dan mencegah spam.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-200">
                                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Infinity size={28} />
                                </div>
                                <h3 className="font-bold text-secondary text-center mb-2 text-lg">Jawab Sampai Benar</h3>
                                <p className="text-sm text-secondary/70 text-center">
                                    Anda bisa menjawab berulang kali sampai jawaban benar. Tidak ada batasan jumlah percobaan total!
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-orange-200">
                                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <TriangleAlert size={28} />
                                </div>
                                <h3 className="font-bold text-secondary text-center mb-2 text-lg">3x Salah = Cooldown</h3>
                                <p className="text-sm text-secondary/70 text-center">
                                    Setelah 3 jawaban salah berturut-turut, sistem akan mengaktifkan cooldown selama 30 detik.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
                                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <RotateCw size={28} />
                                </div>
                                <h3 className="font-bold text-secondary text-center mb-2 text-lg">Auto Reset</h3>
                                <p className="text-sm text-secondary/70 text-center">
                                    Counter percobaan akan reset otomatis setelah 30 menit tidak aktif atau setelah cooldown selesai.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                            <div className="flex items-start gap-4">
                                <Lightbulb className="text-blue-500 h-6 w-6 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-secondary mb-2">Tips Mengerjakan Soal</h4>
                                    <ul className="text-sm text-secondary/80 space-y-1 list-disc list-inside">
                                        <li>Baca soal dengan teliti sebelum menjawab</li>
                                        <li>Perhatikan format jawaban yang diminta (angka, teks, atau kombinasi)</li>
                                        <li>Gunakan hint jika tersedia untuk membantu pemahaman</li>
                                        <li>Jika salah 2x, pikirkan ulang strategi sebelum attempt ke-3 untuk menghindari cooldown</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </ContentCard>

                    <div className="grid md:grid-cols-2 gap-8">
                        <ContentCard>
                            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
                                <Heart className="h-6 w-6 text-red-500" aria-hidden="true" />
                                Favorit & Bookmark
                            </h2>
                                <p className="text-secondary/80 mb-4 leading-relaxed">
                                    Tandai soal favorit Anda dengan klik ikon bintang <Star className="inline-block h-4 w-4 align-text-bottom text-yellow-500" fill="currentColor" />. Soal yang difavoritkan bisa diakses cepat melalui filter "Favorit Saya" untuk dikerjakan ulang atau direview kapan saja.
                                </p>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-secondary/70">
                                    <Info className="inline-block h-4 w-4 text-blue-500 mr-2" />
                                    Fitur favorit sangat berguna untuk menyimpan soal-soal yang ingin Anda pelajari lebih dalam atau bagikan ke teman!
                                </p>
                            </div>
                        </ContentCard>

                        <ContentCard>
                            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
                                <Copy className="h-6 w-6 text-purple-500" aria-hidden="true" />
                                Copy Soal
                            </h2>
                            <p className="text-secondary/80 mb-4 leading-relaxed">
                                Gunakan tombol copy <Copy className="inline-block h-4 w-4 align-text-bottom text-purple-500" /> untuk menyalin teks soal beserta informasi lokasi. Cocok untuk belajar offline atau berbagi soal dengan teman sekelas Anda.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-secondary/70">
                                    <Info className="inline-block h-4 w-4 text-blue-500 mr-2" />
                                    Teks yang dicopy sudah terformat rapi dan siap untuk di-paste ke aplikasi notes atau messaging!
                                </p>
                            </div>
                        </ContentCard>
                    </div>

                    <ContentCard>
                        <h2 className="text-3xl font-bold text-secondary text-center mb-8 flex items-center justify-center gap-3">
                            <HelpCircle className="h-8 w-8 text-primary" aria-hidden="true" />
                            Pertanyaan Umum (FAQ)
                        </h2>
                        <div className="space-y-4">
                            <details className="group bg-gray-50 rounded-lg p-5 cursor-pointer hover:bg-gray-100 transition-colors">
                                <summary className="font-bold text-secondary flex items-center justify-between">
                                    <span>Apa yang harus dilakukan jika saya kena cooldown?</span>
                                    <ChevronDown className="group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-3 text-secondary/70 text-sm leading-relaxed">
                                    Tunggu hingga timer cooldown selesai (30 detik). Gunakan waktu ini untuk membaca hint, mempelajari materi terkait, atau mencoba soal lain yang belum kena cooldown.
                                </p>
                            </details>

                            <details className="group bg-gray-50 rounded-lg p-5 cursor-pointer hover:bg-gray-100 transition-colors">
                                <summary className="font-bold text-secondary flex items-center justify-between">
                                    <span>Apakah saya bisa mengerjakan soal yang sama berulang kali?</span>
                                    <ChevronDown className="group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-3 text-secondary/70 text-sm leading-relaxed">
                                    Setelah menjawab benar, soal tersebut akan ditandai sebagai "Sudah Dijawab" dan tidak bisa dijawab lagi. Namun Anda masih bisa melihat soal dan jawaban Anda untuk review.
                                </p>
                            </details>

                            <details className="group bg-gray-50 rounded-lg p-5 cursor-pointer hover:bg-gray-100 transition-colors">
                                <summary className="font-bold text-secondary flex items-center justify-between">
                                    <span>Bagaimana cara kerja perhitungan jarak?</span>
                                    <ChevronDown className="group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-3 text-secondary/70 text-sm leading-relaxed">
                                    Sistem menggunakan GPS lokasi Anda untuk menghitung jarak ke setiap soal menggunakan formula Haversine. Pastikan GPS aktif untuk hasil yang akurat!
                                </p>
                            </details>

                            <details className="group bg-gray-50 rounded-lg p-5 cursor-pointer hover:bg-gray-100 transition-colors">
                                <summary className="font-bold text-secondary flex items-center justify-between">
                                    <span>Apakah ada progress tracking?</span>
                                    <ChevronDown className="group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-3 text-secondary/70 text-sm leading-relaxed">
                                    Ya! Sistem menyimpan semua jawaban benar Anda beserta timestamp. Anda bisa melihat progress melalui status "Sudah Dijawab" di setiap card soal.
                                </p>
                            </details>
                        </div>
                    </ContentCard>

                    <ContentCard className="bg-gradient-to-r from-secondary to-secondary/90 text-white text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Petualangan Matematika?</h2>
                        <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
                            Jelajahi ratusan soal matematika di sekitar Anda dan tingkatkan kemampuan dengan cara yang menyenangkan!
                        </p>
                        <a
                            href="/portal"
                            className="inline-block bg-primary hover:bg-primary/90 text-secondary font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Buka Portal Sekarang
                        </a>
                    </ContentCard>
                </main>
            </div>
        </User>
    );
};

export default TutorialPage;