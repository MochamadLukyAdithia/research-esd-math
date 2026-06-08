import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Star, Send, CheckCircle, Trophy, Award, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

interface ExistingReflection {
    understood_concepts:   string | null;
    difficult_parts:       string | null;
    most_helpful_activity: string | null;
    rating:                number | null;
}

interface Props {
    pathId: number;
    module: {
        id_module: number;
        existing_reflection?: ExistingReflection | null;
    };
    nextModule: { id_module: number; title: string } | null;
}

const UNDERSTOOD_OPTIONS = ['Konsep dasar', 'Rumus dan penerapan', 'Contoh kontekstual', 'Semua materi'];
const DIFFICULT_OPTIONS   = ['Tidak ada', 'Soal cerita', 'Perhitungan', 'Pemahaman konsep'];
const HELPFUL_OPTIONS     = ['Slide materi', 'Video', 'Contoh soal', 'Aktivitas peta'];

const STAR_LABEL = ['', 'Kurang', 'Cukup', 'Baik', 'Bagus', 'Luar Biasa'];

// ── Komponen tampilan refleksi read-only ──────────────────────────────────────
function ReflectionReadOnly({ data, nextModule, pathId }: {
    data: ExistingReflection;
    nextModule: Props['nextModule'];
    pathId: number;
}) {
    const [showDetail, setShowDetail] = useState(false);

    return (
        <div className="max-w-lg mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-6 pt-6 pb-5 text-center border-b border-gray-100">
                    <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                    <h2 className="text-base font-semibold text-gray-900 mb-1">Refleksi Sudah Diisi</h2>
                    <p className="text-xs text-gray-400">Kamu sudah mengisi refleksi untuk modul ini.</p>
                </div>

                {/* Rating bintang */}
                {data.rating !== null && (
                    <div className="px-6 py-4 border-b border-gray-100 text-center">
                        <p className="text-xs text-gray-400 mb-2">Rating yang kamu berikan</p>
                        <div className="flex justify-center gap-1 mb-1">
                            {[1,2,3,4,5].map(v => (
                                <Star key={v} size={22}
                                    className={v <= (data.rating ?? 0)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-200 fill-gray-100'
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-xs font-semibold text-yellow-600">
                            {STAR_LABEL[data.rating ?? 0]}
                        </span>
                    </div>
                )}

                {/* Toggle detail jawaban */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <button
                        onClick={() => setShowDetail(v => !v)}
                        className="w-full flex items-center justify-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors py-1"
                    >
                        {showDetail ? <EyeOff size={15} /> : <Eye size={15} />}
                        {showDetail ? 'Sembunyikan Detail' : 'Lihat Detail Jawabanku'}
                    </button>
                </div>

                {/* Detail refleksi */}
                {showDetail && (
                    <div className="px-6 py-4 space-y-3 border-b border-gray-100 bg-gray-50/50">
                        <ReflectionItem
                            label="Yang sudah dipahami"
                            value={data.understood_concepts}
                        />
                        <ReflectionItem
                            label="Bagian yang masih sulit"
                            value={data.difficult_parts}
                        />
                        <ReflectionItem
                            label="Aktivitas yang paling membantu"
                            value={data.most_helpful_activity}
                        />
                    </div>
                )}

                {/* Tombol lanjut */}
                <div className="px-6 py-4">
                    {nextModule ? (
                        <button
                            onClick={() => router.visit(route('learningpath.module', { pathId, moduleId: nextModule.id_module }))}
                            className="w-full py-3 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                        >
                            Lanjut: {nextModule.title} <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => router.visit(route('learningpath.completion', pathId))}
                            className="w-full py-3 bg-yellow-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors"
                        >
                            <Trophy size={16} /> Lihat Hasil Akhir
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function ReflectionItem({ label, value }: { label: string; value: string | null }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-sm text-gray-700 font-medium">{value || '—'}</p>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ReflectionView({ pathId, module, nextModule }: Props) {
    const existing = module.existing_reflection;

    const [understood, setUnderstood] = useState(existing?.understood_concepts   ?? '');
    const [difficult,  setDifficult]  = useState(existing?.difficult_parts       ?? '');
    const [helpful,    setHelpful]    = useState(existing?.most_helpful_activity ?? '');
    const [rating,     setRating]     = useState(existing?.rating ?? 0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [submitting, setSubmitting]  = useState(false);
    const [submitted,  setSubmitted]   = useState(!!existing);
    const [showAnim,   setShowAnim]    = useState(false);

    const [totalPoints, setTotalPoints] = useState<number | null>(null);
    const [newBadges,   setNewBadges]   = useState<{ name: string; image_path: string }[]>([]);

    // Sudah ada refleksi sebelumnya → tampilkan read-only
    if (submitted && totalPoints === null && existing) {
        return (
            <ReflectionReadOnly
                data={{
                    understood_concepts:   understood || existing.understood_concepts,
                    difficult_parts:       difficult  || existing.difficult_parts,
                    most_helpful_activity: helpful    || existing.most_helpful_activity,
                    rating:                rating     || existing.rating,
                }}
                nextModule={nextModule}
                pathId={pathId}
            />
        );
    }

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const { data } = await axios.post(
                route('learningpath.module.submit-reflection', { pathId, moduleId: module.id_module }),
                { understood_concepts: understood, difficult_parts: difficult, most_helpful_activity: helpful, rating }
            );
            setTotalPoints(data.total_points);
            setNewBadges(data.new_badges ?? []);
            setSubmitted(true);
            setTimeout(() => setShowAnim(true), 100);

            if (!data.next_module) {
                setTimeout(() => router.visit(route('learningpath.completion', pathId)), 3000);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Baru saja submit — tampilkan animasi poin & badge ─────────────────────
    if (submitted && totalPoints !== null) {
        return (
            <div className="max-w-lg mx-auto px-4 py-10">
                <div
                    className="bg-white rounded-2xl border border-yellow-200 shadow-sm overflow-hidden"
                    style={{
                        opacity:   showAnim ? 1 : 0,
                        transform: showAnim ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'all 0.5s ease',
                    }}
                >
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 px-8 pt-8 pb-6 text-center">
                        <div className="absolute -top-0 -right-0 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
                        <div
                            className="w-20 h-20 rounded-full bg-yellow-100 border-4 border-yellow-300 flex items-center justify-center mx-auto mb-4"
                            style={{ animation: showAnim ? 'bounceIn 0.6s ease 0.2s both' : 'none' }}
                        >
                            <Trophy size={36} className="text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Refleksi Tersimpan!</h2>
                        <p className="text-sm text-gray-500">Terima kasih sudah berbagi pengalamanmu 🙏</p>
                    </div>

                    {totalPoints > 0 && (
                        <div className="px-8 py-6 text-center border-b border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Poin Terkumpul</p>
                            <div
                                className="text-5xl font-black text-yellow-500"
                                style={{ animation: showAnim ? 'countUp 0.7s ease 0.4s both' : 'none' }}
                            >
                                {totalPoints}
                            </div>
                            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
                                <span className="text-base">⭐</span>
                                <span className="text-sm font-semibold text-yellow-700">poin dikumpulkan di learning path ini</span>
                            </div>
                        </div>
                    )}

                    {newBadges.length > 0 && (
                        <div className="px-8 py-5 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <Award size={13} /> Badge Baru Diperoleh!
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {newBadges.map((b, idx) => (
                                    <div key={b.name} className="flex flex-col items-center gap-1"
                                        style={{ animation: showAnim ? `starPop 0.4s ease ${0.6 + idx * 0.1}s both` : 'none' }}
                                    >
                                        {b.image_path && <img src={b.image_path} alt={b.name} className="w-14 h-14 object-contain" />}
                                        <span className="text-xs text-gray-600 font-medium text-center max-w-[80px]">{b.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="px-8 py-4 text-center">
                        <p className="text-xs text-gray-400">Mengarahkan ke halaman selesai...</p>
                    </div>
                </div>

                <style>{`
                    @keyframes bounceIn {
                        0%   { transform: scale(0.3); opacity: 0; }
                        50%  { transform: scale(1.1); }
                        70%  { transform: scale(0.9); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes starPop {
                        0%   { transform: scale(0); opacity: 0; }
                        60%  { transform: scale(1.3); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes countUp {
                        from { transform: translateY(20px); opacity: 0; }
                        to   { transform: translateY(0);    opacity: 1; }
                    }
                `}</style>
            </div>
        );
    }

    // ── Form refleksi (belum pernah mengisi) ──────────────────────────────────
    const canSubmit = !!understood && !!difficult && !!helpful && rating > 0;

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-1">Refleksi Pembelajaran</h2>
                    <p className="text-xs text-gray-400">Pilih opsi yang paling sesuai dengan pengalamanmu.</p>
                </div>

                <SurveyGroup label="Apa yang sudah kamu pahami?" options={UNDERSTOOD_OPTIONS} value={understood} onChange={setUnderstood} />
                <SurveyGroup label="Bagian mana yang masih sulit?" options={DIFFICULT_OPTIONS} value={difficult} onChange={setDifficult} />
                <SurveyGroup label="Aktivitas yang paling membantu pemahamanmu?" options={HELPFUL_OPTIONS} value={helpful} onChange={setHelpful} />

                {/* Rating bintang */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Kesan pembelajaran kontekstual ini</p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(v => (
                            <button
                                key={v}
                                onClick={() => setRating(v)}
                                onMouseEnter={() => setHoveredStar(v)}
                                onMouseLeave={() => setHoveredStar(0)}
                                className="transition-transform hover:scale-110 active:scale-95"
                            >
                                <Star size={30}
                                    className={v <= (hoveredStar || rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-200 fill-gray-100'
                                    }
                                />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="text-xs text-gray-400 self-center ml-1">{STAR_LABEL[rating]}</span>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={submitting || !canSubmit}
                    className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <Send size={15} />
                    {submitting ? 'Menyimpan...' : 'Kirim Refleksi'}
                </button>

                {!canSubmit && (
                    <p className="text-xs text-center text-gray-400">
                        Lengkapi semua pilihan dan beri rating untuk melanjutkan.
                    </p>
                )}
            </div>
        </div>
    );
}

function SurveyGroup({ label, options, value, onChange }: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
                            value === opt
                                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}