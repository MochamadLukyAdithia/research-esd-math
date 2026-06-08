import { useState } from 'react';
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

// ─── Score display ─────────────────────────────────────────────────────────

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

// ─── Component ─────────────────────────────────────────────────────────────

export default function PreTestView({ pathId, module, nextModule }: Props) {
    const questions = module.questions ?? [];
    const { isOnline, sendOrQueue } = useOffline();

    const [answers,      setAnswers]      = useState<Record<number, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted,    setSubmitted]    = useState(module.already_submitted ?? false);
    const [results,      setResults]      = useState<AnswerResult[]>(module.previous_answers ?? []);
    const [score,        setScore]        = useState<number | null>(module.previous_score ?? null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wasQueued,    setWasQueued]    = useState(false);

    const currentQuestion = questions[currentIndex];
    const answeredCount   = Object.keys(answers).length;
    const allAnswered     = answeredCount === questions.length;

    const handleAnswer = (questionId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
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

    // ── 1. Queued offline ──────────────────────────────────────────────────
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

    // ── 2. Hasil submit (online, score ada) ───────────────────────────────
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
                                        <p className="text-gray-700 text-xs leading-relaxed">{r.answer}</p>
                                        {!r.is_correct && r.correct_answer && (
                                            <p className="text-green-700 text-xs mt-1 flex items-center gap-1">
                                                <CheckCircle size={10} />
                                                {r.correct_answer}
                                            </p>
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

    // ── 3. Sudah pernah submit, tapi score null (belum ada data review) ───
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

    // ── 4. Form soal ──────────────────────────────────────────────────────
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
                                    : answers[q.id_question]
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
                    {currentQuestion.question}
                </p>

                {/* Pilihan ganda */}
                {currentQuestion.question_type === 'pilihan_ganda' && currentQuestion.options && (
                    <div className="space-y-2">
                        {currentQuestion.options.map(opt => {
                            const isSelected = answers[currentQuestion.id_question] === String(opt.id_question_option);
                            return (
                                <button
                                    key={opt.id_question_option}
                                    onClick={() => handleAnswer(currentQuestion.id_question, String(opt.id_question_option))}
                                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all active:scale-[.99] ${
                                        isSelected
                                            ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-700 active:bg-gray-50'
                                    }`}
                                >
                                    {opt.option_text}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Isian */}
                {currentQuestion.question_type === 'isian' && (
                    <input
                        type="text"
                        value={answers[currentQuestion.id_question] ?? ''}
                        onChange={e => handleAnswer(currentQuestion.id_question, e.target.value)}
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