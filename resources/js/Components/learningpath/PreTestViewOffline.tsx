import { useState } from 'react';
import { router } from '@inertiajs/react';
import { CheckCircle, ChevronLeft, ChevronRight, Send, WifiOff, CloudUpload } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';
import type { Question } from '@/Pages/LearningPath/Module';

interface AdjacentModule { id_module: number; type: string; title: string }

interface Props {
    pathId: number;
    module: {
        id_module: number;
        title: string;
        type: string;
        questions?: Question[];
        already_submitted?: boolean;
    };
    nextModule: AdjacentModule | null;
}

interface AnswerResult {
    id_question:    number;
    is_correct:     boolean;
    answer:         string;
    correct_answer: string;
}

export default function PreTestView({ pathId, module, nextModule }: Props) {
    const questions = module.questions ?? [];
    const { isOnline, sendOrQueue } = useOffline();

    const [answers,      setAnswers]      = useState<Record<number, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted,    setSubmitted]    = useState(module.already_submitted ?? false);
    const [results,      setResults]      = useState<AnswerResult[]>([]);
    const [score,        setScore]        = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wasQueued,    setWasQueued]    = useState(false); // submit berhasil di-queue (offline)

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
            const result = await sendOrQueue({
                action_type: 'answer_question',
                url:    route('learningpath.module.submit-answer', { pathId, moduleId: module.id_module }),
                method: 'POST',
                payload: { answers },
                onSuccess: (data: any) => {
                    setScore(data.score);
                    setResults(data.results ?? []);
                    setSubmitted(true);
                },
                onQueued: () => {
                    // Offline: simpan state lokal dan tampilkan pesan
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

    // ── Sudah submit secara offline (di-queue) ────────────────────────────────
    if (submitted && wasQueued) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10 text-center">
                <div className="bg-white rounded-2xl border border-orange-200 p-8 shadow-sm">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CloudUpload size={28} className="text-orange-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Jawaban Tersimpan Offline</h2>
                    <p className="text-sm text-gray-500 mb-2">
                        Kamu sedang offline. Jawabanmu sudah disimpan di perangkat dan akan dikirim ke server
                        secara otomatis saat kamu kembali online.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-orange-600 bg-orange-50 rounded-xl px-4 py-2 mb-6 inline-flex">
                        <WifiOff size={12} />
                        <span>Mode offline aktif</span>
                    </div>
                    {nextModule && (
                        <button
                            onClick={() => router.visit(route('learningpath.module', {
                                pathId, moduleId: nextModule.id_module,
                            }))}
                            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            Lanjut: {nextModule.title} <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Hasil submit online ───────────────────────────────────────────────────
    if (submitted && score !== null) {
        const correctCount = results.filter(r => r.is_correct).length;

        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    {/* Skor */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${score >= 70 ? 'bg-green-100' : 'bg-orange-100'}`}>
                        <span className={`text-3xl font-bold ${score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>{score}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
                        {module.type === 'pre_test' ? 'Hasil Pre-Test' : 'Hasil Post-Test'}
                    </h2>
                    <p className="text-sm text-gray-400 text-center mb-6">
                        {correctCount} dari {questions.length} soal benar
                    </p>

                    {/* Detail jawaban */}
                    <div className="space-y-2 mb-6">
                        {results.map((r, i) => (
                            <div key={r.id_question} className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${
                                r.is_correct ? 'border-green-200 bg-green-50' : 'border-red-100 bg-red-50'
                            }`}>
                                <span className={`font-semibold shrink-0 ${r.is_correct ? 'text-green-600' : 'text-red-500'}`}>
                                    {i + 1}.
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-700 text-xs">{r.answer}</p>
                                    {!r.is_correct && r.correct_answer && (
                                        <p className="text-green-700 text-xs mt-0.5">
                                            ✓ {r.correct_answer}
                                        </p>
                                    )}
                                </div>
                                <CheckCircle size={16} className={`shrink-0 ${r.is_correct ? 'text-green-500' : 'text-red-400'}`} />
                            </div>
                        ))}
                    </div>

                    {nextModule && (
                        <button
                            onClick={() => router.visit(route('learningpath.module', {
                                pathId, moduleId: nextModule.id_module,
                            }))}
                            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            Lanjut: {nextModule.title} <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Already submitted sebelumnya ──────────────────────────────────────────
    if (submitted && score === null) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10 text-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Sudah Dikerjakan</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Kamu sudah mengerjakan {module.type === 'pre_test' ? 'pre-test' : 'post-test'} ini.
                    </p>
                    {nextModule && (
                        <button
                            onClick={() => router.visit(route('learningpath.module', {
                                pathId, moduleId: nextModule.id_module,
                            }))}
                            className="w-full py-3 bg-primary text-white rounded-xl font-medium"
                        >
                            Lanjut: {nextModule.title}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    // ── Form soal ─────────────────────────────────────────────────────────────
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Status offline */}
            {!isOnline && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-orange-700">
                    <WifiOff size={13} />
                    <span>Mode offline — jawaban disimpan di perangkat dan dikirim saat online.</span>
                </div>
            )}

            {/* Progress bar soal */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Soal {currentIndex + 1} dari {questions.length}</span>
                    <span>{answeredCount} dijawab</span>
                </div>
                <div className="flex gap-1">
                    {questions.map((q, i) => (
                        <button
                            key={q.id_question}
                            onClick={() => setCurrentIndex(i)}
                            className={`flex-1 h-1.5 rounded-full transition-colors ${
                                answers[q.id_question] ? 'bg-primary' :
                                i === currentIndex ? 'bg-primary/40' : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Kartu soal */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4 shadow-sm">
                {currentQuestion.question_images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {currentQuestion.question_images.map((img, i) => (
                            <img key={i} src={img} alt="" className="max-h-48 rounded-xl object-contain border border-gray-100" />
                        ))}
                    </div>
                )}

                <p className="text-xs text-gray-400 mb-1">{currentQuestion.title}</p>
                <p className="text-sm text-gray-800 leading-relaxed mb-5">{currentQuestion.question}</p>

                {/* Pilihan ganda */}
                {currentQuestion.question_type === 'pilihan_ganda' && currentQuestion.options && (
                    <div className="space-y-2.5">
                        {currentQuestion.options.map(opt => {
                            const isSelected = answers[currentQuestion.id_question] === String(opt.id_question_option);
                            return (
                                <button
                                    key={opt.id_question_option}
                                    onClick={() => handleAnswer(currentQuestion.id_question, String(opt.id_question_option))}
                                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all active:scale-[.99] ${
                                        isSelected
                                            ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
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
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    />
                )}

                <p className="text-xs text-gray-400 mt-3 text-right">{currentQuestion.points} poin</p>
            </div>

            {/* Navigasi */}
            <div className="flex justify-between gap-3">
                <button
                    onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft size={15} /> Sebelumnya
                </button>

                {currentIndex < questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 transition-colors"
                    >
                        Berikutnya <ChevronRight size={15} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered || isSubmitting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-40 transition-colors"
                    >
                        {isOnline ? <Send size={14} /> : <CloudUpload size={14} />}
                        {isSubmitting ? 'Mengirim...' : isOnline ? `Submit (${answeredCount}/${questions.length})` : `Simpan Offline`}
                    </button>
                )}
            </div>
        </div>
    );
}