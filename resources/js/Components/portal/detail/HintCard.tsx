import { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';

interface Hint {
  id_hint: number;
  image: string;
  hint_description: string;
}

interface HintsCardProps {
  hints: Hint[];
}

export default function HintsCard({ hints }: HintsCardProps) {
  const [openHintId, setOpenHintId] = useState<number | null>(null);

  const toggleHint = (id: number) => {
    setOpenHintId(openHintId === id ? null : id);
  };

  if (!hints || hints.length === 0) {
    return null;
  }

  return (
    <div className="bg-background shadow-md p-6">
      <div className="space-y-3">
        {hints.map((hint, index) => (
          <div
            key={hint.id_hint}
            className="border-b border-secondary overflow-hidden"
          >
            <button
              onClick={() => toggleHint(hint.id_hint)}
              className="w-full flex items-center justify-between p-4 transition-colors text-left"
            >
              <span className="font-medium text-gray-900">Petunjuk {index + 1}</span>
              <ChevronDown
                size={20}
                className={`text-gray-500 transition-transform duration-200 ${
                  openHintId === hint.id_hint ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`transition-all duration-200 ease-in-out ${
                openHintId === hint.id_hint
                  ? 'max-h-[600px] opacity-100'
                  : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="p-4 pt-0 space-y-3">
                {hint.image && (
                  <img
                    src={hint.image}
                    alt={`Petunjuk ${index + 1}`}
                    className="w-full"
                  />
                )}
                <p className="text-gray-700 text-sm leading-relaxed">
                  {hint.hint_description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
