import { useState, Fragment } from 'react';
import { router } from '@inertiajs/react';
import {
    CheckCircle, XCircle, ChevronLeft, ChevronRight, Send,
    WifiOff, CloudUpload, RotateCcw, Trophy
} from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';
import type { Question } from '@/Pages/LearningPath/Module';

interface AdjacentModule { id_module: number; type: string; title: string }

interface AnswerResult {
    id_question:    number;
    is_correct:     boolean;
    answer:         string;
    correct_answer: string;
}

interface Props {
    pathId: number;
    module: {
        id_module: number;
        title: string;
        type: string;
        questions?: Question[];
        already_submitted?: boolean;
        previous_score?: number | null;
        previous_answers?: AnswerResult[];
    };
    nextModule: AdjacentModule | null;
}

// ─── Math notation renderer ─────────────────────────────────────────────────
//
// Parser ringan tanpa library eksternal untuk merender notasi matematika
// yang ditulis dengan sintaks "LaTeX-ish" jadi tampilan asli:
//   \sqrt{50}, \sqrt50, √50   -> akar (radical) asli
//   2^3, 2^{10}               -> pangkat (superscript) asli
//   \times, \cdot             -> ×
//
// Cukup untuk notasi soal sekolah; bukan parser LaTeX penuh.

type MathToken =
    | { type: 'text'; value: string }
    | { type: 'sqrt'; value: string }
    | { type: 'pow'; base: string; exp: string };

function tokenizeMath(raw: string): MathToken[] {
    if (!raw) return [];

    const s = raw
        .replace(/\\times/g, '×')
        .replace(/\\cdot/g, '×')
        .replace(/\\pm/g, '±');

    const tokens: MathToken[] = [];

    // Urutan alternation penting: sqrt dicek dulu supaya "\sqrt{2^3}"
    // tidak salah dipecah oleh pola pow terlebih dahulu.
    const pattern =
        /\\?sqrt\{([^{}]+)\}|\\?sqrt(\d+(?:\.\d+)?)|√\{([^{}]+)\}|√(\d+(?:\.\d+)?)|([a-zA-Z0-9.]+)\^\{([^{}]+)\}|([a-zA-Z0-9.]+)\^(\d+(?:\.\d+)?)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(s)) !== null) {
        const [whole, sqBrace, sqPlain, sqSymBrace, sqSymPlain, powBaseA, powExpA, powBaseB, powExpB] = match;

        if (match.index > lastIndex) {
            tokens.push({ type: 'text', value: s.slice(lastIndex, match.index) });
        }

        if (sqBrace !== undefined) {
            tokens.push({ type: 'sqrt', value: sqBrace });
        } else if (sqPlain !== undefined) {
            tokens.push({ type: 'sqrt', value: sqPlain });
        } else if (sqSymBrace !== undefined) {
            tokens.push({ type: 'sqrt', value: sqSymBrace });
        } else if (sqSymPlain !== undefined) {
            tokens.push({ type: 'sqrt', value: sqSymPlain });
        } else if (powBaseA !== undefined) {
            tokens.push({ type: 'pow', base: powBaseA, exp: powExpA });
        } else if (powBaseB !== undefined) {
            tokens.push({ type: 'pow', base: powBaseB, exp: powExpB });
        }

        lastIndex = match.index + whole.length;
    }

    if (lastIndex < s.length) {
        tokens.push({ type: 'text', value: s.slice(lastIndex) });
    }

    return tokens;
}

/**
 * Radical (akar) yang digambar manual dengan SVG + border, bukan mengandalkan
 * karakter Unicode "√" yang bentuknya beda-beda tergantung font dan susah
 * disambung rapi ke garis atas (overline) lewat CSS biasa.
 *
 * Struktur: [kaki centang akar (SVG)] + [garis atas menyatu dengan isi akar]
 * Hasilnya simbol akar yang proporsional ke ukuran teks & selalu rapat,
 * konsisten di semua ukuran font.
 *
 * `inline` (bukan inline-flex) dipakai supaya elemen ini ikut mengalir
 * normal di antara teks sekitarnya saat baris di-wrap oleh browser —
 * inline-flex/inline-block punya kebiasaan "loncat baris" sebagai satu
 * unit yang membuatnya terlihat terpisah dari kalimat di sekitarnya.
 */
function Radical({ value }: { value: string }) {
    return (
        <span className="inline whitespace-nowrap">
            <svg
                viewBox="0 0 12 14"
                className="inline-block w-[0.55em] h-[1.05em] -mr-px -mb-[0.05em] shrink-0 align-baseline"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    d="M0 8.5 L2.3 11 L5 1 L12 1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className="border-t-[1.1px] border-current pt-0 leading-[1.05]">
                {value}
            </span>
        </span>
    );
}

function renderMathToken(token: MathToken, key: number) {
    switch (token.type) {
        case 'sqrt':
            return <Radical key={key} value={token.value} />;
        case 'pow':
            // `inline` + `whitespace-nowrap` (bukan span block-ish) supaya
            // "2" dan "³" tidak pernah terpisah baris, TAPI token ini tetap
            // menyatu dengan teks sebelum/sesudahnya — tidak loncat ke
            // "kolom" sendiri seperti versi lama yang memakai inline-flex
            // pada elemen pembungkus.
            return (
                <span key={key} className="whitespace-nowrap">
                    {token.base}
                    <sup className="text-[0.7em] leading-none">{token.exp}</sup>
                </span>
            );
        case 'text':
        default:
            return <Fragment key={key}>{token.value}</Fragment>;
    }
}

/**
 * Render satu string yang mungkin berisi notasi matematika.
 *   <MathText text="5\sqrt2" />        -> 5√2 (dengan radical asli)
 *   <MathText text="2^3\times2^2" />   -> 2³ × 2²
 *
 * Dibungkus dalam satu <span> (bukan Fragment) supaya seluruh rangkaian
 * token ikut satu konteks inline yang sama dan mengalir sebagai satu
 * kalimat utuh, alih-alih tiap token dianggap node terpisah yang bisa
 * di-wrap browser secara tidak terduga.
 */
function MathText({ text }: { text: string }) {
    const tokens = tokenizeMath(text ?? '');
    return <span>{tokens.map((t, i) => renderMathToken(t, i))}</span>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Untuk pilihan_ganda_kompleks, jawaban disimpan sebagai string[]
 * (array of id_question_option sebagai string).
 * Untuk pilihan_ganda dan isian, disimpan sebagai string biasa.
 */
type AnswerValue = string | string[];

function isCompleks(q: Question) {
    return q.question_type === 'pilihan_ganda_kompleks';
}
// Tambahkan interface kecil ini di atas OptionContent
interface QuestionOption {
    id_question_option: number;
    option_text:        string | null;
    option_image?:      string | null;
}

// PreTestView.tsx — OptionContent, src-nya langsung pakai nilai dari backend
//
// Dibungkus dalam <span> block-level konteksnya tetap inline-block agar opsi
// teks panjang yang mengandung notasi pangkat/akar tetap mengalir sebagai
// satu paragraf yang sama, bukan terpecah jadi "kolom kiri" (teks) dan
// "kolom kanan" (notasi) seperti sebelumnya.
function OptionContent({ opt }: { opt: QuestionOption }) {
    if (opt.option_image) {
        return (
            <img
                src={opt.option_image}  // ← tidak perlu /storage/ prefix lagi
                alt={opt.option_text ?? 'Opsi'}
                className="max-h-28 max-w-full object-contain rounded-lg"
            />
        );
    }
    return (
        <span className="inline">
            <MathText text={opt.option_text ?? ''} />
        </span>
    );
}


/** Render teks jawaban — jika diawali __img__ tampilkan sebagai gambar,
 *  selain itu render lewat MathText supaya notasi matematika tampil rapi.
 *  Pemisah "|||" dibuang dari teks dan tidak pernah ditampilkan ke user. */
function AnswerContent({ text }: { text: string }) {
    // Bisa berisi beberapa jawaban (PGK) dipisah |||
    const parts = (text ?? '')
        .split('|||')
        .map(p => p.trim())
        .filter(p => p.length > 0);

    return (
        <span className="flex flex-wrap gap-2 items-center">
            {parts.map((part, i) =>
                part.startsWith('__img__') ? (
                    <img
                        key={i}
                        src={part.replace('__img__', '')}
                        alt="Jawaban"
                        className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                    />
                ) : (
                    <span key={i}><MathText text={part} /></span>
                )
            )}
        </span>
    );
}
// ─── Score display ───────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
    const color = score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-500';
    const bg    = score >= 70 ? 'bg-green-50 border-green-200' : score >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
    return (
        <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center mx-auto mb-4 ${bg}`}>
            <span className={`text-3xl font-black leading-none ${color}`}>{score}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">/ 100</span>
        </div>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PreTestView({ pathId, module, nextModule }: Props) {
    const questions = module.questions ?? [];
    const { isOnline, sendOrQueue } = useOffline();

    const [answers,      setAnswers]      = useState<Record<number, AnswerValue>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted,    setSubmitted]    = useState(module.already_submitted ?? false);
    const [results,      setResults]      = useState<AnswerResult[]>(module.previous_answers ?? []);
    const [score,        setScore]        = useState<number | null>(module.previous_score ?? null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wasQueued,    setWasQueued]    = useState(false);

    const currentQuestion = questions[currentIndex];
    const answeredCount   = Object.keys(answers).length;
    const allAnswered     = answeredCount === questions.length;

    // ── Handlers ─────────────────────────────────────────────────────────────

    /** Pilihan ganda biasa & isian: simpan satu nilai */
    const handleSingleAnswer = (questionId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    /**
     * Pilihan ganda kompleks: toggle item dalam array.
     * Jika optionId sudah ada → hapus, jika belum → tambahkan.
     */
    const handleMultiAnswer = (questionId: number, optionId: string) => {
        setAnswers(prev => {
            const current = (prev[questionId] as string[] | undefined) ?? [];
            const updated = current.includes(optionId)
                ? current.filter(id => id !== optionId)
                : [...current, optionId];

            // Hapus entry jika array kosong (agar answeredCount akurat)
            if (updated.length === 0) {
                const { [questionId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [questionId]: updated };
        });
    };

    const handleSubmit = async () => {
        if (!allAnswered || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await sendOrQueue({
                action_type: 'answer_question',
                url:    route('learningpath.module.submit-answer', { pathId, moduleId: module.id_module }),
                method: 'POST',
                payload: { answers },
                onSuccess: (data: any) => {
                    setScore(data.score ?? 0);
                    setResults(data.results ?? []);
                    setSubmitted(true);
                },
                onQueued: () => {
                    setWasQueued(true);
                    setSubmitted(true);
                },
            });
        } catch (err) {
            console.error('Submit answer error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToNext = () => {
        if (nextModule) {
            router.visit(route('learningpath.module', { pathId, moduleId: nextModule.id_module }));
        }
    };

    const testLabel = module.type === 'pre_test' ? 'Pre-Test' : 'Post-Test';

    // ── 1. Queued offline ─────────────────────────────────────────────────────
    if (submitted && wasQueued) {
        return (
            <div className="max-w-lg mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl border border-orange-200 p-6 sm:p-8 shadow-sm text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CloudUpload size={28} className="text-orange-500" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900 mb-2">Jawaban Tersimpan Offline</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Jawabanmu sudah disimpan di perangkat dan akan dikirim otomatis saat kamu kembali online.
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs text-orange-600 bg-orange-50 rounded-xl px-4 py-2 mb-6">
                        <WifiOff size={12} />
                        <span>Mode offline aktif</span>
                    </div>
                    {nextModule && (
                        <button onClick={goToNext}
                            className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                            Lanjut: {nextModule.title} <ChevronRight size={15} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── 2. Hasil submit (online, score ada) ───────────────────────────────────
    if (submitted && score !== null) {
        const correctCount = results.filter(r => r.is_correct).length;
        const totalCount   = results.length || questions.length;

        return (
            <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header skor */}
                    <div className={`px-6 py-8 text-center ${score >= 70 ? 'bg-green-50' : 'bg-orange-50'}`}>
                        <ScoreRing score={score} />
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Hasil {testLabel}</h2>
                        <p className="text-sm text-gray-500">
                            {correctCount} dari {totalCount} soal benar
                        </p>
                        {score >= 70 ? (
                            <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-green-700 bg-green-100 rounded-full px-3 py-1">
                                <Trophy size={11} /> Bagus!
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-orange-700 bg-orange-100 rounded-full px-3 py-1">
                                <RotateCcw size={11} /> Tetap semangat belajar!
                            </div>
                        )}
                    </div>

                    {/* Review jawaban */}
                    {results.length > 0 && (
                        <div className="px-4 sm:px-6 py-4 space-y-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Review Jawaban</p>
                            {results.map((r, i) => (
                                <div key={r.id_question}
                                    className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${
                                        r.is_correct
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-red-100 bg-red-50'
                                    }`}>
                                    <span className={`font-bold shrink-0 mt-0.5 ${r.is_correct ? 'text-green-600' : 'text-red-500'}`}>
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-gray-700 text-xs leading-relaxed">
                                                <AnswerContent text={r.answer} />
                                            </div>
                                            {!r.is_correct && r.correct_answer && (
                                                   <div className="text-green-700 text-xs mt-1 flex items-center gap-2">
                                                    <CheckCircle size={10} className="shrink-0" />
                                                    <AnswerContent text={r.correct_answer} />
                                                </div>
                                            )}
                                    </div>
                                    {r.is_correct
                                        ? <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                                        : <XCircle     size={15} className="text-red-400 shrink-0 mt-0.5" />
                                    }
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    {nextModule && (
                        <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
                            <button onClick={goToNext}
                                className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 active:scale-[.98]">
                                Lanjut: {nextModule.title} <ChevronRight size={15} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── 3. Sudah pernah submit, tapi score null ───────────────────────────────
    if (submitted && score === null) {
        return (
            <div className="max-w-lg mx-auto px-4 py-8 text-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                    <CheckCircle size={44} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-base font-bold text-gray-900 mb-2">Sudah Dikerjakan</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Kamu sudah mengerjakan {testLabel} ini.
                    </p>
                    {nextModule && (
                        <button onClick={goToNext}
                            className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm active:scale-[.98]">
                            Lanjut: {nextModule.title}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    // ── 4. Form soal ──────────────────────────────────────────────────────────
    return (
        <div className="max-w-lg mx-auto px-3 sm:px-4 py-4 sm:py-8">
            {/* Banner offline */}
            {!isOnline && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5 mb-4 text-xs text-orange-700">
                    <WifiOff size={12} className="shrink-0" />
                    <span>Mode offline — jawaban disimpan di perangkat.</span>
                </div>
            )}

            {/* Progress dots + counter */}
            <div className="mb-4 sm:mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span className="font-medium">Soal {currentIndex + 1} / {questions.length}</span>
                    <span className={answeredCount === questions.length ? 'text-green-600 font-semibold' : ''}>
                        {answeredCount} dijawab
                    </span>
                </div>
                {/* Scrollable dot bar */}
                <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                    {questions.map((q, i) => (
                        <button
                            key={q.id_question}
                            onClick={() => setCurrentIndex(i)}
                            className={`shrink-0 transition-all rounded-full ${
                                i === currentIndex
                                    ? 'w-6 h-2 bg-primary'
                                    : answers[q.id_question] !== undefined
                                        ? 'w-2 h-2 bg-primary/60'
                                        : 'w-2 h-2 bg-gray-200'
                            }`}
                            aria-label={`Soal ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Kartu soal */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-4 shadow-sm">
                {/* Gambar soal */}
                {currentQuestion.question_images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {currentQuestion.question_images.map((img, i) => (
                            <img key={i} src={img} alt=""
                                className="max-h-40 sm:max-h-48 w-full object-contain rounded-xl border border-gray-100" />
                        ))}
                    </div>
                )}

                {currentQuestion.title && (
                    <p className="text-[10px] text-gray-400 mb-1 font-medium">{currentQuestion.title}</p>
                )}
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4 sm:mb-5">
                    <MathText text={currentQuestion.question} />
                </p>

                {/* ── Pilihan ganda biasa (1 jawaban) ── */}
                {currentQuestion.question_type === 'pilihan_ganda' && currentQuestion.options && (
    <div className="space-y-2">
        {currentQuestion.options.map(opt => {
            const isSelected = answers[currentQuestion.id_question] === String(opt.id_question_option);
            return (
                <button
                    key={opt.id_question_option}
                    onClick={() => handleSingleAnswer(currentQuestion.id_question, String(opt.id_question_option))}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all active:scale-[.99] ${
                        isSelected
                            ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700 active:bg-gray-50'
                    }`}
                >
                    {/* ← ganti opt.option_text dengan ini */}
                    <OptionContent opt={opt} />
                </button>
            );
        })}
    </div>
)}

                {/* ── Pilihan ganda kompleks (bisa pilih lebih dari 1) ── */}
                {currentQuestion.question_type === 'pilihan_ganda_kompleks' && currentQuestion.options && (
                    <div className="space-y-2">
                        {/* Label petunjuk */}
                        <p className="text-[11px] text-primary bg-primary/8 rounded-lg px-3 py-1.5 mb-3 font-medium">
                            Pilih semua jawaban yang benar (bisa lebih dari satu)
                        </p>
                        {currentQuestion.options.map(opt => {
                            const selectedArr = (answers[currentQuestion.id_question] as string[] | undefined) ?? [];
                            const isSelected  = selectedArr.includes(String(opt.id_question_option));
                            return (
                                <button
    key={opt.id_question_option}
    onClick={() => handleMultiAnswer(currentQuestion.id_question, String(opt.id_question_option))}
    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all active:scale-[.99] flex items-start gap-3 ${
        isSelected
            ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
            : 'border-gray-200 hover:border-gray-300 text-gray-700 active:bg-gray-50'
    }`}
>
    {/* Checkbox visual */}
    <span className={`w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
        isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
    }`}>
        {isSelected && (
            <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-white">
                <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )}
    </span>
    {/* ← ganti opt.option_text dengan ini */}
    <span className="flex-1 min-w-0">
        <OptionContent opt={opt} />
    </span>
</button>
                            );
                        })}
                        {/* Counter pilihan terpilih */}
                        {(() => {
                            const count = ((answers[currentQuestion.id_question] as string[] | undefined) ?? []).length;
                            return count > 0 ? (
                                <p className="text-[11px] text-gray-400 text-right pt-1">
                                    {count} pilihan dipilih
                                </p>
                            ) : null;
                        })()}
                    </div>
                )}

                {/* ── Isian ── */}
                {currentQuestion.question_type === 'isian' && (
                    <input
                        type="text"
                        value={(answers[currentQuestion.id_question] as string) ?? ''}
                        onChange={e => handleSingleAnswer(currentQuestion.id_question, e.target.value)}
                        placeholder="Ketik jawabanmu..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                )}

                <p className="text-[10px] text-gray-400 mt-3 text-right">{currentQuestion.points} poin</p>
            </div>

            {/* Navigasi */}
            <div className="flex items-center justify-between gap-2">
                <button
                    onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors active:bg-gray-100"
                >
                    <ChevronLeft size={15} />
                    <span className="hidden xs:inline">Sebelumnya</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                        className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 transition-colors active:scale-[.98]"
                    >
                        <span className="hidden xs:inline">Berikutnya</span>
                        <ChevronRight size={15} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered || isSubmitting}
                        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors active:scale-[.98]"
                    >
                        {isOnline ? <Send size={13} /> : <CloudUpload size={13} />}
                        {isSubmitting
                            ? 'Mengirim...'
                            : isOnline
                                ? `Submit (${answeredCount}/${questions.length})`
                                : 'Simpan Offline'
                        }
                    </button>
                )}
            </div>

            {/* Hint semua sudah dijawab */}
            {allAnswered && currentIndex < questions.length - 1 && (
                <p className="text-center text-xs text-green-600 mt-3 font-medium">
                    Semua soal sudah dijawab! Geser ke soal terakhir untuk submit.
                </p>
            )}
        </div>
    );
}