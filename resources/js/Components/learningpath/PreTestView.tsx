import { useState } from 'react';
import { router } from '@inertiajs/react';
import { CheckCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import axios from 'axios';
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
    id_question: number;
    is_correct: boolean;
    answer: string;
}

export default function PreTestView({ pathId, module, nextModule }: Props) {
    const questions = module.questions ?? [];

    const [answers,       setAnswers]       = useState<Record<number, string>>({});
    const [currentIndex,  setCurrentIndex]  = useState(0);
    const [submitted,     setSubmitted]     = useState(module.already_submitted ?? false);
    const [results,       setResults]       = useState<AnswerResult[]>([]);
    const [score,         setScore]         = useState<number | null>(null);
    const [isSubmitting,  setIsSubmitting]  = useState(false);

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
            const { data } = await axios.post(
                route('learning-path.module.submit-answer', { pathId, moduleId: module.id_module }),
                { answers }
            );
            setScore(data.score);
            setResults(data.results);
            setSubmitted(true);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Sudah submit: tampilkan hasil ──────────────────────────────────────
    if (submitted && score !== null) {
        const correctCount = results.filter(r => r.is_correct).length;

        return (
            <div className="max-w-2xl mx-auto px-4 py-10 text-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${score >= 70 ? 'bg-green-100' : 'bg-orange-100'}`}>
                        <span className={`text-3xl font-bold ${score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>{score}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        {module.type === 'pre_test' ? 'Hasil Pre-Test' : 'Hasil Post-Test'}
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        {correctCount} dari {questions.length} soal benar
                    </p>

                    {/* Hasil per soal */}
                    <div className="text-left space-y-3 mb-8">
                        {results.map((r, i) => (
                            <div key={r.id_question} className={`flex items-start gap-3 p-3 rounded-xl border ${r.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <span className={`mt-0.5 font-semibold text-sm ${r.is_correct ? 'text-green-600' : 'text-red-500'}`}>
                                    {i + 1}.
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-700 truncate">{r.answer}</p>
                                </div>
                                <CheckCircle size={16} className={r.is_correct ? 'text-green-500 shrink-0' : 'text-red-400 shrink-0'} />
                            </div>
                        ))}
                    </div>

                    {nextModule && (
                        <button
                            onClick={() => router.visit(route('learning-path.module.show', { pathId, moduleId: nextModule.id_module }))}
                            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            Lanjut: {nextModule.title}
                            <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Sudah submit sebelumnya (already_submitted dari server) ───────────
    if (submitted && score === null) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10 text-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Sudah Dikerjakan</h2>
                    <p className="text-sm text-gray-500 mb-6">Kamu sudah mengerjakan {module.type === 'pre_test' ? 'pre-test' : 'post-test'} ini.</p>
                    {nextModule && (
                        <button
                            onClick={() => router.visit(route('learning-path.module.show', { pathId, moduleId: nextModule.id_module }))}
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

    // ── Form soal ─────────────────────────────────────────────────────────
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header progress soal */}
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
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
                {/* Gambar soal */}
                {currentQuestion.question_images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {currentQuestion.question_images.map((img, i) => (
                            <img key={i} src={img} alt="" className="max-h-48 rounded-lg object-contain border border-gray-100" />
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
                                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                                        isSelected
                                            ? 'border-primary bg-primary/10 text-primary font-medium'
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
                        placeholder="Ketik jawabanmu di sini..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    />
                )}

                <p className="text-xs text-gray-400 mt-3 text-right">{currentQuestion.points} poin</p>
            </div>

            {/* Navigasi soal */}
            <div className="flex justify-between gap-3">
                <button
                    onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={14} />
                        {isSubmitting ? 'Mengirim...' : `Submit (${answeredCount}/${questions.length})`}
                    </button>
                )}
            </div>
        </div>
    );
}