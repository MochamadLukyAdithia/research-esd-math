import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Send, CheckCircle, Trophy, Award, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// ── Tipe data ─────────────────────────────────────────────────────────────────

export type AnswerValue = 'sudah_mampu' | 'cukup_mampu' | 'perlu_dibimbing' | '';

interface ExistingReflection {
    q1_platform_usage:     AnswerValue | null;
    q2_data_comprehension: AnswerValue | null;
    q3_math_application:   AnswerValue | null;
    q4_reasoning:          AnswerValue | null;
}

interface Props {
    pathId: number;
    module: {
        id_module: number;
        existing_reflection?: ExistingReflection | null;
    };
    nextModule: { id_module: number; title: string } | null;
}

// ── Konfigurasi pertanyaan (sesuai dokumen form refleksi diri ESDMathPath) ───

const QUESTIONS: { key: keyof ExistingReflection; label: string }[] = [
    {
        key: 'q1_platform_usage',
        label:
            'Saya dapat menggunakan platform ESDMathPath dengan baik untuk membaca materi, mengikuti aktivitas, dan mengerjakan tugas matematika.',
    },
    {
        key: 'q2_data_comprehension',
        label:
            'Saya dapat memahami informasi, data, gambar, tabel, atau grafik yang tersedia dalam platform ESDMathPath.',
    },
    {
        key: 'q3_math_application',
        label:
            'Saya dapat menggunakan konsep matematika untuk menyelesaikan masalah yang berkaitan dengan kehidupan sehari-hari dan isu keberlanjutan.',
    },
    {
        key: 'q4_reasoning',
        label:
            'Saya dapat menjelaskan alasan atau langkah penyelesaian matematika berdasarkan data atau informasi yang saya peroleh dari platform ESDMathPath.',
    },
];

const ANSWER_OPTIONS: { value: AnswerValue; label: string; description: string; color: string }[] = [
    {
        value: 'sudah_mampu',
        label: 'Sudah Mampu',
        description: 'Dapat melakukan dengan mandiri',
        color: 'green',
    },
    {
        value: 'cukup_mampu',
        label: 'Cukup Mampu',
        description: 'Dapat melakukan, tetapi masih perlu sedikit bantuan',
        color: 'yellow',
    },
    {
        value: 'perlu_dibimbing',
        label: 'Perlu Dibimbing',
        description: 'Masih membutuhkan banyak bantuan dari guru atau teman',
        color: 'red',
    },
];

const ANSWER_LABEL: Record<string, string> = {
    sudah_mampu:    'Sudah Mampu',
    cukup_mampu:    'Cukup Mampu',
    perlu_dibimbing:'Perlu Dibimbing',
};

// Warna per pilihan jawaban
const COLOR_MAP: Record<string, { border: string; bg: string; text: string; dot: string }> = {
    green:  { border: 'border-green-500',  bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500'  },
    yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    red:    { border: 'border-red-400',    bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-400'    },
};

// ── Sub-komponen ──────────────────────────────────────────────────────────────

/** Satu baris pertanyaan dengan 3 tombol pilihan */
function QuestionRow({
    no,
    label,
    value,
    onChange,
}: {
    no: number;
    label: string;
    value: AnswerValue;
    onChange: (v: AnswerValue) => void;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Teks pertanyaan */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                <p className="text-sm text-gray-700 leading-snug">
                    <span className="font-semibold text-gray-400 mr-1">{no}.</span>
                    {label}
                </p>
            </div>

            {/* Pilihan jawaban */}
            <div className="grid grid-cols-3 divide-x divide-gray-100">
                {ANSWER_OPTIONS.map((opt) => {
                    const c = COLOR_MAP[opt.color];
                    const selected = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            className={`flex flex-col items-center gap-1 px-2 py-3 text-center transition-all active:scale-95
                                ${selected
                                    ? `${c.bg} ${c.border} border-t-2`
                                    : 'hover:bg-gray-50 border-t-2 border-transparent'
                                }`}
                        >
                            {/* Indikator dot */}
                            <span
                                className={`w-3 h-3 rounded-full border-2 transition-all ${
                                    selected
                                        ? `${c.dot} border-transparent`
                                        : 'border-gray-300 bg-white'
                                }`}
                            />
                            <span
                                className={`text-xs font-semibold leading-tight ${
                                    selected ? c.text : 'text-gray-500'
                                }`}
                            >
                                {opt.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/** Tampilan read-only saat refleksi sudah diisi */
function ReflectionReadOnly({
    data,
    nextModule,
    pathId,
}: {
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

                {/* Toggle detail */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <button
                        onClick={() => setShowDetail((v) => !v)}
                        className="w-full flex items-center justify-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors py-1"
                    >
                        {showDetail ? <EyeOff size={15} /> : <Eye size={15} />}
                        {showDetail ? 'Sembunyikan Detail' : 'Lihat Detail Jawabanku'}
                    </button>
                </div>

                {/* Detail jawaban */}
                {showDetail && (
                    <div className="px-6 py-4 space-y-2 border-b border-gray-100 bg-gray-50/50">
                        {QUESTIONS.map((q, i) => {
                            const raw = data[q.key];
                            const opt = ANSWER_OPTIONS.find((o) => o.value === raw);
                            const c = opt ? COLOR_MAP[opt.color] : null;
                            return (
                                <div
                                    key={q.key}
                                    className="rounded-xl border border-gray-200 bg-white px-4 py-3"
                                >
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                                        Pertanyaan {i + 1}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2 leading-snug">{q.label}</p>
                                    {raw && c ? (
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                                            {ANSWER_LABEL[raw]}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">—</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Tombol lanjut */}
                <div className="px-6 py-4">
                    {nextModule ? (
                        <button
                            onClick={() =>
                                router.visit(
                                    route('learningpath.module', {
                                        pathId,
                                        moduleId: nextModule.id_module,
                                    })
                                )
                            }
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

// ── Main Component ────────────────────────────────────────────────────────────

export default function ReflectionView({ pathId, module, nextModule }: Props) {
    const existing = module.existing_reflection;

    const [answers, setAnswers] = useState<Record<keyof ExistingReflection, AnswerValue>>({
        q1_platform_usage:     (existing?.q1_platform_usage     ?? '') as AnswerValue,
        q2_data_comprehension: (existing?.q2_data_comprehension ?? '') as AnswerValue,
        q3_math_application:   (existing?.q3_math_application   ?? '') as AnswerValue,
        q4_reasoning:          (existing?.q4_reasoning           ?? '') as AnswerValue,
    });

    const [submitting, setSubmitting]  = useState(false);
    const [submitted,  setSubmitted]   = useState(!!existing);
    const [showAnim,   setShowAnim]    = useState(false);

    const [totalPoints, setTotalPoints] = useState<number | null>(null);
    const [newBadges,   setNewBadges]   = useState<{ name: string; image_path: string }[]>([]);

    // Sudah mengisi sebelumnya → tampilkan read-only
    if (submitted && totalPoints === null && existing) {
        return (
            <ReflectionReadOnly
                data={answers as unknown as ExistingReflection}
                nextModule={nextModule}
                pathId={pathId}
            />
        );
    }

    const handleChange = (key: keyof ExistingReflection) => (val: AnswerValue) => {
        setAnswers((prev) => ({ ...prev, [key]: val }));
    };

    const canSubmit = QUESTIONS.every((q) => !!answers[q.key]);

    const handleSubmit = async () => {
        if (submitting || !canSubmit) return;
        setSubmitting(true);
        try {
            const { data } = await axios.post(
                route('learningpath.module.submit-reflection', {
                    pathId,
                    moduleId: module.id_module,
                }),
                answers
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

    // ── Baru saja submit — animasi poin & badge ───────────────────────────────
    if (submitted && totalPoints !== null) {
        return (
            <div className="max-w-lg mx-auto px-4 py-10">
                <div
                    className="bg-white rounded-2xl border border-yellow-200 shadow-sm overflow-hidden"
                    style={{
                        opacity:    showAnim ? 1 : 0,
                        transform:  showAnim ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'all 0.5s ease',
                    }}
                >
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 px-8 pt-8 pb-6 text-center">
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
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                                Total Poin Terkumpul
                            </p>
                            <div
                                className="text-5xl font-black text-yellow-500"
                                style={{ animation: showAnim ? 'countUp 0.7s ease 0.4s both' : 'none' }}
                            >
                                {totalPoints}
                            </div>
                            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
                                <span className="text-base">⭐</span>
                                <span className="text-sm font-semibold text-yellow-700">
                                    poin dikumpulkan di learning path ini
                                </span>
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
                                    <div
                                        key={b.name}
                                        className="flex flex-col items-center gap-1"
                                        style={{
                                            animation: showAnim
                                                ? `starPop 0.4s ease ${0.6 + idx * 0.1}s both`
                                                : 'none',
                                        }}
                                    >
                                        {b.image_path && (
                                            <img
                                                src={b.image_path}
                                                alt={b.name}
                                                className="w-14 h-14 object-contain"
                                            />
                                        )}
                                        <span className="text-xs text-gray-600 font-medium text-center max-w-[80px]">
                                            {b.name}
                                        </span>
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

    // ── Form refleksi ─────────────────────────────────────────────────────────
    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                {/* Judul */}
                <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-0.5">Refleksi Diri Siswa</h2>
                    <p className="text-xs text-gray-400">
                        Pilih jawaban yang paling sesuai dengan kemampuanmu saat ini.
                    </p>
                </div>

                {/* Keterangan pilihan */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 space-y-1.5">
                    {ANSWER_OPTIONS.map((opt) => {
                        const c = COLOR_MAP[opt.color];
                        return (
                            <div key={opt.value} className="flex items-start gap-2">
                                <span className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot}`} />
                                <p className="text-xs text-gray-600">
                                    <span className={`font-semibold ${c.text}`}>{opt.label}</span>
                                    {': '}
                                    {opt.description}.
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Daftar pertanyaan */}
                <div className="space-y-3">
                    {QUESTIONS.map((q, i) => (
                        <QuestionRow
                            key={q.key}
                            no={i + 1}
                            label={q.label}
                            value={answers[q.key]}
                            onChange={handleChange(q.key)}
                        />
                    ))}
                </div>

                {/* Tombol kirim */}
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
                        Jawab semua pertanyaan untuk dapat mengirim refleksi.
                    </p>
                )}
            </div>
        </div>
    );
}