import { Head, router, usePage } from '@inertiajs/react';
import { Trophy, Star, ArrowLeft, CheckCircle, TrendingUp, TrendingDown, Minus, Award, RotateCcw, Home } from 'lucide-react';
import Navbar from '@/Components/navbar/Navbar';
import { User as Profile } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Badge {
    name: string;
    description?: string;
    image_path: string | null;
}

interface PageProps {
    path: {
        id_learning_path: number;
        title: string;
        description: string;
        grade: number;
        category: string;
    };
    progress: {
        status: string;
        progress_percentage: number;
        pre_test_score: number | null;
        post_test_score: number | null;
        started_at: string | null;
        completed_at: string | null;
    };
    total_points: number;
    badges: Badge[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ScoreDiff({ pre, post }: { pre: number | null; post: number | null }) {
    if (pre === null || post === null) return null;
    const diff = post - pre;
    if (diff > 0)  return <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm"><TrendingUp size={14} />+{diff} poin</span>;
    if (diff < 0)  return <span className="flex items-center gap-1 text-red-500 font-bold text-sm"><TrendingDown size={14} />{diff} poin</span>;
    return <span className="flex items-center gap-1 text-gray-400 font-semibold text-sm"><Minus size={14} />Sama</span>;
}

function getGrade(score: number | null): { label: string; color: string; bg: string; stars: number } {
    if (score === null) return { label: '-', color: 'text-gray-400', bg: 'bg-gray-50', stars: 0 };
    if (score >= 90) return { label: 'Sangat Baik', color: 'text-emerald-600', bg: 'bg-emerald-50', stars: 5 };
    if (score >= 75) return { label: 'Baik',        color: 'text-blue-600',    bg: 'bg-blue-50',    stars: 4 };
    if (score >= 60) return { label: 'Cukup',       color: 'text-yellow-600',  bg: 'bg-yellow-50',  stars: 3 };
    return                   { label: 'Perlu Latihan', color: 'text-orange-600', bg: 'bg-orange-50', stars: 2 };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Completion({ path, progress, total_points, badges }: PageProps) {
    const { auth } = usePage().props as { auth: { user: Profile | null } };
    const postGrade = getGrade(progress.post_test_score);

    return (
        <>
            <Head title={`${path.title}`} />
            <Navbar user={auth.user} />

            <div className="min-h-screen bg-gray-50 pt-[72px] pb-16">
                <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">

                    {/* ── Hero Card ── */}
                    <div className="bg-white rounded-2xl border border-yellow-200 shadow-sm overflow-hidden">
                        {/* Gradient header */}
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 px-8 py-10 text-center relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                            <div className="absolute -bottom-4 -left-6 w-24 h-24 bg-white/10 rounded-full" />

                            <div className="relative">
                                <div className="w-20 h-20 bg-white/20 border-4 border-white/40 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Trophy size={36} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-black text-white mb-1">Learning Path Selesai!</h1>
                                <p className="text-yellow-100 text-sm font-medium">{path.title}</p>
                            </div>
                        </div>

                        {/* Rating bintang post-test */}
                        {progress.post_test_score !== null && (
                            <div className="px-8 py-5 text-center border-b border-gray-100">
                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Nilai Akhirmu</p>
                                <div className="flex items-end justify-center gap-1 mb-2">
                                    <span className={`text-5xl font-black ${postGrade.color}`}>
                                        {progress.post_test_score}
                                    </span>
                                    <span className="text-lg text-gray-300 mb-1 font-medium">/100</span>
                                </div>
                                <div className="flex justify-center gap-1 mb-2">
                                    {[1,2,3,4,5].map(v => (
                                        <Star key={v} size={18}
                                            className={v <= postGrade.stars
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-200 fill-gray-100'
                                            }
                                        />
                                    ))}
                                </div>
                                <span className={`text-sm font-semibold ${postGrade.color}`}>{postGrade.label}</span>
                            </div>
                        )}

                        {/* Poin total */}
                        {total_points > 0 && (
                            <div className="px-8 py-4 bg-yellow-50/60 border-b border-yellow-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">⭐</span>
                                    <span className="text-sm font-semibold text-yellow-800">Total Poin Terkumpul</span>
                                </div>
                                <span className="text-2xl font-black text-yellow-600">{total_points}</span>
                            </div>
                        )}
                    </div>

                    {/* ── Perbandingan Skor ── */}
                    {(progress.pre_test_score !== null || progress.post_test_score !== null) && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <TrendingUp size={15} className="text-blue-500" />
                                Perkembangan Belajarmu
                            </h2>
                            <div className="flex items-center gap-4">
                                {/* Pre-test */}
                                <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Pre-Test</p>
                                    <p className="text-3xl font-black text-gray-700">
                                        {progress.pre_test_score ?? <span className="text-gray-300 text-xl">—</span>}
                                    </p>
                                </div>

                                {/* Panah + diff */}
                                <div className="flex flex-col items-center gap-1 shrink-0">
                                    <div className="text-gray-200">→</div>
                                    <ScoreDiff pre={progress.pre_test_score} post={progress.post_test_score} />
                                </div>

                                {/* Post-test */}
                                <div className={`flex-1 rounded-xl p-4 text-center border ${postGrade.bg} ${
                                    progress.post_test_score !== null ? 'border-yellow-200' : 'border-gray-100'
                                }`}>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Post-Test</p>
                                    <p className={`text-3xl font-black ${postGrade.color}`}>
                                        {progress.post_test_score ?? <span className="text-gray-300 text-xl">—</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Badge ── */}
                    {badges && badges.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Award size={15} className="text-purple-500" />
                                Badge yang Kamu Raih
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {badges.map((badge) => (
                                    <div key={badge.name} className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-xl border border-purple-100 min-w-[80px]">
                                        {badge.image_path
                                            ? <img src={badge.image_path} alt={badge.name} className="w-12 h-12 object-contain" />
                                            : <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center"><Award size={20} className="text-purple-500" /></div>
                                        }
                                        <span className="text-xs font-semibold text-purple-700 text-center leading-tight max-w-[70px]">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Progress ringkas ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <CheckCircle size={15} className="text-green-500" />
                                Progress Keseluruhan
                            </h2>
                            <span className="text-lg font-black text-green-600">{progress.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className="bg-green-500 h-2.5 rounded-full transition-all duration-700"
                                style={{ width: `${progress.progress_percentage}%` }}
                            />
                        </div>
                        {progress.completed_at && (
                            <p className="text-xs text-gray-400 mt-2">
                                Diselesaikan pada {new Date(progress.completed_at).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </p>
                        )}
                    </div>

                    {/* ── Action buttons ── */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => router.visit(route('learningpath.show', path.id_learning_path))}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <RotateCcw size={15} />
                            Tinjau Ulang Materi
                        </button>
                        <button
                            onClick={() => router.visit(route('learningpath.index'))}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                        >
                            <Home size={15} />
                            Kembali ke Beranda
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}