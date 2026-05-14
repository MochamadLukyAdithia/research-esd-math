import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Star, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Props {
    pathId: number;
    module: {
        id_module: number;
        existing_reflection?: {
            understood_concepts: string | null;
            difficult_parts: string | null;
            most_helpful_activity: string | null;
            rating: number | null;
        } | null;
    };
    nextModule: { id_module: number; title: string } | null;
}

// Opsi survey — tinggal klik sesuai brief
const UNDERSTOOD_OPTIONS = ['Konsep dasar', 'Rumus dan penerapan', 'Contoh kontekstual', 'Semua materi'];
const DIFFICULT_OPTIONS   = ['Tidak ada', 'Soal cerita', 'Perhitungan', 'Pemahaman konsep'];
const HELPFUL_OPTIONS     = ['Slide materi', 'Video', 'Contoh soal', 'Aktivitas peta'];

export default function ReflectionView({ pathId, module, nextModule }: Props) {
    const existing = module.existing_reflection;

    const [understood, setUnderstood]   = useState(existing?.understood_concepts   ?? '');
    const [difficult,  setDifficult]    = useState(existing?.difficult_parts       ?? '');
    const [helpful,    setHelpful]      = useState(existing?.most_helpful_activity ?? '');
    const [rating,     setRating]       = useState(existing?.rating ?? 0);
    const [submitting, setSubmitting]   = useState(false);
    const [submitted,  setSubmitted]    = useState(!!existing);

    const [totalPoints, setTotalPoints] = useState<number | null>(null);
    const [newBadges,   setNewBadges]   = useState<{ name: string; image_path: string }[]>([]);

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const { data } = await axios.post(
                route('learning-path.module.submit-reflection', { pathId, moduleId: module.id_module }),
                { understood_concepts: understood, difficult_parts: difficult, most_helpful_activity: helpful, rating }
            );
            setTotalPoints(data.total_points);
            setNewBadges(data.new_badges ?? []);
            setSubmitted(true);

            // Kalau tidak ada modul berikutnya, redirect ke completion
            if (!data.next_module) {
                setTimeout(() => {
                    router.visit(route('learning-path.completion', pathId));
                }, 2000);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Sudah submit: tampilkan konfirmasi ────────────────────────────────
    if (submitted && totalPoints !== null) {
        return (
            <div className="max-w-xl mx-auto px-4 py-10 text-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Refleksi Tersimpan!</h2>
                    {totalPoints > 0 && (
                        <p className="text-sm text-gray-500 mb-4">
                            Total poin yang kamu kumpulkan dalam learning path ini:{' '}
                            <span className="font-semibold text-primary">{totalPoints} poin</span>
                        </p>
                    )}
                    {newBadges.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                            {newBadges.map(b => (
                                <div key={b.name} className="flex flex-col items-center gap-1">
                                    {b.image_path && <img src={b.image_path} alt={b.name} className="w-12 h-12 object-contain" />}
                                    <span className="text-xs text-gray-600 font-medium">{b.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-gray-400">Mengarahkan ke halaman selesai...</p>
                </div>
            </div>
        );
    }

    // ── Sudah ada dari sebelumnya ──────────────────────────────────────────
    if (submitted && totalPoints === null) {
        return (
            <div className="max-w-xl mx-auto px-4 py-10 text-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Refleksi Sudah Diisi</h2>
                    {nextModule && (
                        <button
                            onClick={() => router.visit(route('learning-path.module.show', { pathId, moduleId: nextModule.id_module }))}
                            className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-medium"
                        >
                            Lanjut: {nextModule.title}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Form refleksi ─────────────────────────────────────────────────────
    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-1">Refleksi Pembelajaran</h2>
                    <p className="text-xs text-gray-400">Pilih opsi yang paling sesuai dengan pengalamanmu.</p>
                </div>

                {/* Hal yang dipahami */}
                <SurveyGroup
                    label="Apa yang sudah kamu pahami?"
                    options={UNDERSTOOD_OPTIONS}
                    value={understood}
                    onChange={setUnderstood}
                />

                {/* Hal yang masih sulit */}
                <SurveyGroup
                    label="Bagian mana yang masih sulit?"
                    options={DIFFICULT_OPTIONS}
                    value={difficult}
                    onChange={setDifficult}
                />

                {/* Aktivitas paling membantu */}
                <SurveyGroup
                    label="Aktivitas yang paling membantu pemahamanmu?"
                    options={HELPFUL_OPTIONS}
                    value={helpful}
                    onChange={setHelpful}
                />

                {/* Rating bintang */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Kesan pembelajaran kontekstual ini</p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(v => (
                            <button
                                key={v}
                                onClick={() => setRating(v)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={28}
                                    className={v <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={submitting || !understood || !difficult || !helpful || rating === 0}
                    className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    <Send size={15} />
                    {submitting ? 'Menyimpan...' : 'Kirim Refleksi'}
                </button>
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            value === opt
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}