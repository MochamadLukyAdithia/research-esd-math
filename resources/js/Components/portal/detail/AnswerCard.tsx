import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Info, AlertCircle, Clock, Shield } from 'lucide-react';
import axios from 'axios';

interface AttemptInfo {
  total_attempts: number;
  max_attempts: number;
  attempts_remaining: number;
  is_cooldown?: boolean;
  cooldown_remaining?: number;
}

interface AnswerCardProps {
  questionId: number;
  userAnswer?: {
    answer: string;
    is_correct: boolean;
    answered_at: string;
  } | null;
  attemptInfo?: AttemptInfo | null;
}

export default function AnswerCard({ questionId, userAnswer, attemptInfo: initialAttemptInfo }: AnswerCardProps) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{
    isCorrect: boolean;
    message: string;
    userAnswer?: string;
    alreadyAnswered?: boolean;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasAnsweredCorrectly, setHasAnsweredCorrectly] = useState(false);
  const [attemptInfo, setAttemptInfo] = useState<AttemptInfo | null>(initialAttemptInfo || null);
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (attemptInfo?.is_cooldown && attemptInfo.cooldown_remaining) {
      setCooldownRemaining(attemptInfo.cooldown_remaining);

      const interval = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setAttemptInfo(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [attemptInfo?.is_cooldown, attemptInfo?.cooldown_remaining]);

  useEffect(() => {
    if (userAnswer && userAnswer.is_correct) {
      setAnswer(userAnswer.answer);
      setHasAnsweredCorrectly(true);
      setResult({
        isCorrect: true,
        userAnswer: userAnswer.answer,
        message: 'Anda sudah menjawab soal ini dengan benar!',
        alreadyAnswered: true,
      });
    }
  }, [userAnswer]);

  const formatCooldownTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) {
      return;
    }

    setIsChecking(true);
    setResult(null);

    try {
      const response = await axios.post(
        `/portal/questions/${questionId}/check-answer`,
        { answer: answer.trim() }
      );

      const data = response.data;

      if (data.already_answered) {
        setHasAnsweredCorrectly(true);
        setResult({
          isCorrect: true,
          userAnswer: data.user_answer,
          message: data.message,
          alreadyAnswered: true,
        });
      } else if (data.is_correct) {
        setHasAnsweredCorrectly(true);
        setResult({
          isCorrect: true,
          userAnswer: data.user_answer,
          message: data.message,
        });
        setAttemptInfo(null);
      } else {
        setResult({
          isCorrect: false,
          userAnswer: data.user_answer,
          message: data.message,
        });

        if (data.is_cooldown) {
          setAttemptInfo({
            total_attempts: data.total_attempts,
            max_attempts: 3,
            attempts_remaining: 0,
            is_cooldown: true,
            cooldown_remaining: data.cooldown_remaining,
          });
          setCooldownRemaining(data.cooldown_remaining);
        } else {
          setAttemptInfo({
            total_attempts: data.total_attempts,
            max_attempts: 3,
            attempts_remaining: data.attempts_remaining,
          });
        }

        setAnswer('');
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);

      if (error.response?.status === 429) {
        const data = error.response.data;
        setCooldownRemaining(data.cooldown_remaining);
        setAttemptInfo({
          total_attempts: 0,
          max_attempts: 3,
          attempts_remaining: 0,
          is_cooldown: true,
          cooldown_remaining: data.cooldown_remaining,
        });
        setResult({
          isCorrect: false,
          message: data.message,
        });
      } else if (error.response?.status === 401) {
        setResult({
          isCorrect: false,
          message: 'Anda harus login untuk menjawab soal.',
        });
      } else if (error.response?.status === 419) {
        setResult({
          isCorrect: false,
          message: 'Sesi Anda telah berakhir. Silakan refresh halaman.',
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

  const isCooldownActive = cooldownRemaining !== null && cooldownRemaining > 0;

  return (
    <div className="bg-background shadow-md p-4">
      <h3 className="text-md font-semibold text-secondary mb-3 w-1/4 border-b border-secondary">Jawaban</h3>

      {!hasAnsweredCorrectly && attemptInfo && attemptInfo.total_attempts > 0 && !isCooldownActive && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-blue-800">
            <AlertCircle size={14} />
            <span>
              Percobaan Anda tersisa: <strong>{attemptInfo.attempts_remaining}x</strong>
            </span>
          </div>
        </div>
      )}

      {isCooldownActive && (
        <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="text-orange-600 flex-shrink-0 mt-0.5" size={16} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-orange-800 mb-1">
                Cooldown Aktif
              </p>
              <p className="text-xs text-orange-700">
                Anda terlalu banyak mencoba. Tunggu <strong>{formatCooldownTime(cooldownRemaining)}</strong> untuk mencoba lagi.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Masukkan jawaban..."
            className="w-full px-3 py-2 text-sm bg-background border border-secondary rounded-lg outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isChecking || hasAnsweredCorrectly || isCooldownActive}
          />
          <p className="mt-2 text-xs text-gray-500">
            { isCooldownActive
              ? 'Menunggu cooldown selesai...'
              : 'Max 3x percobaan sebelum cooldown 30 detik'}
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

        {!hasAnsweredCorrectly && (
          <button
            type="submit"
            disabled={isChecking || !answer.trim() || hasAnsweredCorrectly || isCooldownActive}
            className="w-full bg-secondary text-white py-2 px-3 text-sm rounded-lg font-semibold hover:bg-secondary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Memeriksa...
              </>
            ) : isCooldownActive ? (
              <>
                <Clock size={14} />
                Cooldown: {formatCooldownTime(cooldownRemaining!)}
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
