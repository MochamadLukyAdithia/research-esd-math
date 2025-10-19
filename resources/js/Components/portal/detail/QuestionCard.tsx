import { useState } from 'react';
import { Globe, GraduationCap, Copy, Check, Star } from 'lucide-react';

interface Tag {
  id_tag: number;
  tag_name: string;
}

interface QuestionCardProps {
  questionId: number;
  title: string;
  question: string;
  questionImage: string;
  tags: Tag[];
  grade: number;
  distance?: number;
  locationName: string;
  isFavorite: boolean;
  onToggleFavorite: (questionId: number) => void;
}

export default function QuestionCard({
  questionId,
  title,
  question,
  questionImage,
  tags,
  grade,
  distance,
  locationName,
  isFavorite,
  onToggleFavorite
}: QuestionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyQuestion = async () => {
    try {
      const textToCopy = `${title}\n\n${question}\n\nLokasi: ${locationName}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(questionId);
  };

  return (
    <div className="bg-background shadow-md overflow-hidden">
      <div className="relative w-full h-64">
        <img
          src={questionImage}
          alt={title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x200/F5C400/001840?text=No+Image';
          }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-secondary mb-2">{title}</h2>

        <div className="mb-4">
          <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
            {question}
          </p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span
                key={tag.id_tag}
                className="px-3 py-1 text-xs border border-secondary text-secondary rounded-full font-medium"
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end pt-3">
          <div className="flex items-center gap-2 text-secondary">
            <div className="flex items-center gap-1">
              <GraduationCap size={16} />
              <span className='mr-1 text-sm'>{grade}</span>
            </div>

            <div className="flex items-center gap-1">
              <Globe size={16} />
            </div>

            <button
              onClick={handleCopyQuestion}
              className="p-1.5 text-secondary hover:text-secondary-light transition-colors"
              title="Salin soal"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 transition-colors ${
                isFavorite
                  ? 'text-primary'
                  : 'text-secondary hover:text-secondary-light'
              }`}
              title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            >
              <Star size={16} className={isFavorite ? 'fill-primary' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
