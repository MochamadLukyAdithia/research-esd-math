import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, ChevronRight, Lock, CheckCircle, Play, Trophy } from 'lucide-react';
import Navbar from '@/Components/navbar/Navbar';
import { User as Profile } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface GradeData {
    grade: number;
    label: string;
    level: 'SMP' | 'SMA' | 'Mahasiswa';
    total_modules: number;
    completed_modules: number;
    in_progress: number;
    progress_pct: number;
    next_path_id: number | null;
    topics: string[];
}

interface PageProps {
    gradeData: GradeData[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_COLOR = {
    SMP: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500', icon: 'text-blue-400' },
    SMA: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500', icon: 'text-purple-400' },
    Mahasiswa: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', bar: 'bg-green-500', icon: 'text-green-400' },    
};

// ─── Grade Card ───────────────────────────────────────────────────────────────

function GradeCard({ data, isLoggedIn }: { data: GradeData; isLoggedIn: boolean }) {
    const c = LEVEL_COLOR[data.level];
    const isCompleted = data.completed_modules === data.total_modules && data.total_modules > 0;
    const hasProgress = data.completed_modules > 0 || data.in_progress > 0;

    const handleClick = () => {
        router.visit(route('learningpath.grade', data.grade));
    };

    const handleContinue = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.next_path_id) {
            router.visit(route('learningpath.show', data.next_path_id));
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative bg-white border rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${c.border}`}
        >
            {/* Header warna */}
            <div className={`${c.bg} px-6 py-5 relative`}>
                {/* Badge level */}
                <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {data.level}
                </span>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium mb-1">Matematika</p>
                        <h2 className="text-2xl font-black text-gray-900">{data.label}</h2>
                    </div>
                    {isCompleted && (
                        <Trophy size={28} className="text-yellow-500 mb-1" />
                    )}
                </div>

                {/* Topik */}
                {data.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {data.topics.map(t => (
                            <span key={t} className="text-[10px] bg-white/70 text-gray-600 px-2 py-0.5 rounded-full">
                                {t}
                            </span>
                        ))}
                        {data.topics.length < 3 ? null : (
                            <span className="text-[10px] text-gray-400 self-center">& lainnya</span>
                        )}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="px-6 py-4">
                {/* Info modul */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <BookOpen size={13} />
                    <span>{data.total_modules} kb pembelajaran</span>
                </div>

                {/* Progress (hanya jika sudah login dan ada progress) */}
                {isLoggedIn && hasProgress && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                            <span>{data.completed_modules} dari {data.total_modules} selesai</span>
                            <span className="font-semibold">{data.progress_pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full transition-all ${c.bar}`}
                                style={{ width: `${data.progress_pct}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isCompleted ? 'text-green-600' : 'text-gray-700'}`}>
                        {!isLoggedIn         ? 'Lihat Modul'    :
                         isCompleted         ? '✓ Selesai'      :
                         hasProgress         ? 'Lanjutkan'      : 'Mulai Belajar'}
                    </span>

                    <div className="flex items-center gap-2">
                        {/* Tombol lanjut cepat */}
                        {isLoggedIn && !isCompleted && data.next_path_id && (
                            <button
                                onClick={handleContinue}
                                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${c.badge}`}
                            >
                                <Play size={11} />
                                {hasProgress ? 'Lanjut' : 'Mulai'}
                            </button>
                        )}
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Index({ gradeData }: PageProps) {
    const { auth } = usePage().props as { auth: { user: Profile | null } };

    const smpGrades = gradeData.filter(g => g.level === 'SMP');
    const smaGrades = gradeData.filter(g => g.level === 'SMA');
    const mahasiswaGrades = gradeData.filter(g => g.level === 'Mahasiswa');
    const totalCompleted = gradeData.reduce((sum, g) => sum + g.completed_modules, 0);
    const totalModules   = gradeData.reduce((sum, g) => sum + g.total_modules, 0);

    return (
        <>
            <Head title="Learning Path" />
            <Navbar user={auth.user} />

            <div className="min-h-screen bg-gray-50 pt-[72px] pb-16">
                {/* ── Hero ── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-4 py-10">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Learning Path</h1>
                        <p className="text-gray-500 text-sm max-w-lg">
                            Belajar matematika kontekstual dengan alur terstruktur.
                            Selesaikan modul secara berurutan untuk membuka modul berikutnya.
                        </p>

                        {/* Stats user */}
                        {auth.user && totalModules > 0 && (
                            <div className="flex items-center gap-6 mt-6">
                                <div>
                                    <p className="text-2xl font-black text-gray-900">{totalCompleted}</p>
                                    <p className="text-xs text-gray-400">Modul selesai</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900">{totalModules}</p>
                                    <p className="text-xs text-gray-400">Total modul</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-primary">
                                        {Math.round((totalCompleted / totalModules) * 100)}%
                                    </p>
                                    <p className="text-xs text-gray-400">Progress keseluruhan</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
                    {/* SMP */}
                    {smpGrades.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <h2 className="text-lg font-bold text-gray-800">Sekolah Menengah Pertama</h2>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">SMP</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {smpGrades.map(g => (
                                    <GradeCard key={g.grade} data={g} isLoggedIn={!!auth.user} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SMA */}
                    {smaGrades.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <h2 className="text-lg font-bold text-gray-800">Sekolah Menengah Atas</h2>
                                <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">SMA</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {smaGrades.map(g => (
                                    <GradeCard key={g.grade} data={g} isLoggedIn={!!auth.user} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mahasiswa */}
                    {mahasiswaGrades.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <h2 className="text-lg font-bold text-gray-800">Mahasiswa</h2>
                                <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Mahasiswa</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {mahasiswaGrades.map(g => (
                                    <GradeCard key={g.grade} data={g} isLoggedIn={!!auth.user} />
                                ))}
                            </div>
                        </div>
                    )}

                    {gradeData.length === 0 && (
                        <div className="text-center py-20">
                            <BookOpen size={40} className="mx-auto text-gray-200 mb-3" />
                            <p className="text-gray-400 text-sm">Belum ada learning path yang tersedia.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}