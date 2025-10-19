import { ArrowLeft, Loader2 } from 'lucide-react';
import QuestionCard from '@/Components/portal/detail/QuestionCard';
import CreatorCard from '@/Components/portal/detail/CreatorCard';
import AnswerCard from '@/Components/portal/detail/AnswerCard';
import HintsCard from '@/Components/portal/detail/HintCard';

interface Tag {
  id_tag: number;
  tag_name: string;
}

interface Hint {
  id_hint: number;
  image: string;
  hint_description: string;
}

interface QuestionDetail {
  id_question: number;
  title: string;
  question: string;
  location_name: string;
  latitude: number;
  longitude: number;
  question_image: string;
  tags: Tag[];
  grade: number;
  is_favorite: boolean;
  created_at: string;
  creator: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  hints: Hint[];
  distance?: number;
  user_answer?: {
    answer: string;
    is_correct: boolean;
    answered_at: string;
    correct_answer?: string | null;
  } | null;
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
        />

        <CreatorCard creator={question.creator} />

        <AnswerCard
          questionId={question.id_question}
          userAnswer={question.user_answer}
        />

        <HintsCard hints={question.hints} />
      </div>
    </div>
  );
}
