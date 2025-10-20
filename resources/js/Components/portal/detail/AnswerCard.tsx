
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Info, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface AnswerCardProps {
  questionId: number;
  userAnswer?: {
    answer: string;
    is_correct: boolean;
    answered_at: string;
    correct_answer?: string | null;
  } | null;
}

export default function AnswerCard({ questionId, userAnswer }: AnswerCardProps) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{
    isCorrect: boolean;
    message: string;
    userAnswer?: string;
    correctAnswer?: string | null;
    alreadyAnswered?: boolean;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (userAnswer) {
      setAnswer(userAnswer.answer);
      setHasAnswered(true);
      setResult({
        isCorrect: userAnswer.is_correct,
        userAnswer: userAnswer.answer,
        correctAnswer: userAnswer.correct_answer,
        message: userAnswer.is_correct
          ? 'Anda sudah menjawab soal ini dengan benar!'
          : 'Anda sudah pernah mencoba soal ini.',
        alreadyAnswered: true,
      });
    }
  }, [userAnswer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) {
      return;
    }

    setIsChecking(true);

    try {
      const response = await axios.post(
        `/portal/questions/${questionId}/check-answer`,
        { answer: answer.trim() }
      );

      const data = response.data;

      setHasAnswered(true);
      setResult({
        isCorrect: data.is_correct,
        userAnswer: data.user_answer,
        correctAnswer: data.correct_answer,
        message: data.message,
        alreadyAnswered: data.already_answered || false,
      });
    } catch (error: any) {
      console.error('Error submitting answer:', error);

      if (error.response?.status === 401) {
        setResult({
          isCorrect: false,
          message: 'Anda harus login untuk menjawab soal.',
        });
      } else if (error.response?.status === 404) {
        setResult({
          isCorrect: false,
          message: 'Soal tidak ditemukan.',
        });
      } else if (error.response?.status === 419) {
        setResult({
          isCorrect: false,
          message: 'Sesi Anda telah berakhir. Silakan refresh halaman.',
        });
      } else if (error.response?.status === 422) {
        const errorMsg = error.response?.data?.message || 'Jawaban tidak valid.';
        setResult({
          isCorrect: false,
          message: errorMsg,
        });
      } else {
        setResult({
          isCorrect: false,
          message: error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.',
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-background shadow-md p-4">
      <h3 className="text-md font-semibold text-secondary mb-3 w-1/4 border-b border-secondary">Jawaban</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Masukkan jawaban..."
            className="w-full px-3 py-2 text-sm bg-background border border-secondary rounded-lg outline-none transition-all disabled:hidden"
            disabled={isChecking || hasAnswered}
          />
          <p className="mt-2 text-xs text-gray-500">
            {hasAnswered
              ? 'Anda hanya memiliki 1 kesempatan menjawab'
              : 'Format: angka, teks, atau kombinasi (1 kesempatan)'}
          </p>
        </div>

        {result && (
          <div className={`flex items-start gap-2 p-3 rounded-lg ${
              result.isCorrect
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
            {result.isCorrect ? (
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
            ) : (
              <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
            )}
            <div className="flex-1">
              <p className={`text-xs font-medium ${
                  result.isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                {result.message}
              </p>

              {!result.isCorrect && result.correctAnswer && (
                <div className="mt-2 p-2">
                  <p className="text-xs font-semibold text-red-800 mb-1">Jawaban yang benar:</p>
                  <p className="text-xs text-red-800 font-medium">{result.correctAnswer}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {result?.alreadyAnswered && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
            <div className="flex-1">
              <p className="text-xs text-blue-800">
                Jawaban Anda: <span className="font-semibold">{result.userAnswer}</span>
              </p>
            </div>
          </div>
        )}

        {!hasAnswered && (
          <button
            type="submit"
            disabled={isChecking || !answer.trim() || hasAnswered}
            className="w-full bg-secondary text-white py-2 px-3 text-sm rounded-lg font-semibold hover:bg-secondary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Memeriksa...
              </>
            ) : (
              'Periksa Jawaban'
            )}
          </button>
        )}
      </form>
    </div>
  );
}
