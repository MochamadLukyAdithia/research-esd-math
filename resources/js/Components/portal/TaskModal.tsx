import { Task } from '@/Pages/Portal/Index';
import { X, Star, ImageOff } from 'lucide-react';
import { useState } from 'react';

interface ModalProps {
    task: Task | null;
    onClose: () => void;
    onToggleFavorite: (taskId: number) => void;
    onShowQuestion: (task: Task) => void;
}

export default function TaskDetailModal({
    task,
    onClose,
    onToggleFavorite,
    onShowQuestion
}: ModalProps) {
    const [imageError, setImageError] = useState(false);

    if (!task) {
        return null;
    }

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-background rounded-lg shadow-2xl p-4 z-20">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
            >
                <X size={20} />
            </button>

            <div className="flex gap-4">
                <img
                    src={task.question_image}
                    alt={task.title}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/96x96/F5C400/001840?text=No+Image';
                    }}
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0 bg-gray-100"
                />

                <div className='flex-grow'>
                    <h3 className="font-bold text-secondary text-lg">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.location_name}</p>
                    <div className="flex flex-wrap gap-1 my-2">
                        {task.tags.map(tag => (
                            <span key={tag.id_tag} className="px-1.5 py-0.5 text-xs bg-background text-secondary border border-secondary rounded-full">{tag.tag_name}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-3 flex gap-2">
                <button
                    onClick={() => onShowQuestion(task)}
                    className="w-full bg-secondary text-background text-sm py-2 px-2 rounded-md border border-secondary hover:text-secondary hover:bg-background font-semibold"
                >
                    Tampilkan Soal
                </button>
                <button
                    onClick={() => onToggleFavorite(task.id_question)}
                    className="p-2 border border-secondary rounded-md hover:bg-secondary hover:text-secondary"
                >
                    <Star size={18} className={`${task.is_favorite ? 'text-primary fill-primary' : 'text-secondary hover:text-background'}`} />
                </button>
            </div>
        </div>
    );
}
