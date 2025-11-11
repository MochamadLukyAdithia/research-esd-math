import { ArrowLeft, Loader2 } from 'lucide-react';
import QuestionCard from '@/Components/portal/detail/QuestionCard';
import CreatorCard from '@/Components/portal/detail/CreatorCard';
import AnswerCard from '@/Components/portal/detail/AnswerCard';
import HintsCard from '@/Components/portal/detail/HintCard';

interface Tag {
  id_tag: number;
  tag_name: string;
}

interface QuestionOption {
  id_question_option: number;
  option_text: string;
  is_correct: boolean;
}

interface AnswerHistoryItem {
  answer: string;
  is_correct: boolean;
  answered_at: string;
  points_earned?: number;
}
interface QuestionDetail {
  id_question: number;
  answer_history?: AnswerHistoryItem[];
  title: string;
  question: string;
  question_type: 'pilihan_ganda' | 'isian';
  location_name: string;
  latitude: number;
  longitude: number;
  question_image: string;
  tags: Tag[];
  grade: number;
  options?: QuestionOption[] | null;
  is_favorite: boolean;
  created_at: string;
  points: number;
  creator: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  hints: Array<{
    id_hint: number;
    image: string;
    hint_description: string;
  }>;
  distance?: number;
user_answer?: {
  answer: string;
  is_correct: boolean;
  answered_at: string;
} | null;
  attempt_info?: {
    total_attempts: number;
    max_attempts: number;
    attempts_remaining: number;
    is_cooldown?: boolean;
    cooldown_remaining?: number;
  } | null;
    potential_points?: number | null;
    points_earned?: number | null;
}

interface QuestionDetailSidebarProps {
  question: QuestionDetail | null;
  isLoading: boolean;
  onBack: () => void;
  onToggleFavorite: (questionId: number) => void;
}

export default function QuestionDetailSidebar({
  question,
  isLoading,
  onBack,
  onToggleFavorite
}: QuestionDetailSidebarProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-secondary" size={32} />
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-background border-b w-[90%] border-secondary pt-4 pb-3 pl-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Kembali"
          >
            <ArrowLeft size={20} className="text-secondary" />
          </button>
          <h2 className="text-lg font-semibold text-secondary truncate">
            Tugas: {question.location_name}
          </h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <QuestionCard
          questionId={question.id_question}
          title={question.title}
          question={question.question}
          questionImage={question.question_image}
          tags={question.tags}
          grade={question.grade}
          distance={question.distance}
          locationName={question.location_name}
          isFavorite={question.is_favorite}
          onToggleFavorite={onToggleFavorite}
            points={question.points}
        />

        <CreatorCard creator={question.creator} />

        <AnswerCard
        questionId={question.id_question}
        questionType={question.question_type}
        options={question.options}
        userAnswer={question.user_answer}
        attemptInfo={question.attempt_info}
        basePoints={question.points}
        pointsEarned={question.points_earned}
        />

        <HintsCard hints={question.hints} />
      </div>
    </div>
  );
}
