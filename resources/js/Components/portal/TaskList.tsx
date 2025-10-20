import { Globe, GraduationCap, LocateFixed, Star } from 'lucide-react';
import { Task } from '@/Pages/Portal/Index';

interface TaskListProps {
  tasks: Task[];
  selectedTask: Task | null;
  onTaskSelect: (task: Task) => void;
  onToggleFavorite: (taskId: number) => void;
  isLoadingLocation: boolean;
}

export default function TaskList({ tasks, selectedTask, onTaskSelect, onToggleFavorite, isLoadingLocation }: TaskListProps) {
  return (
    <div className="space-y-3 px-6 pb-4">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div
            key={task.id_question}
            className={`rounded-lg shadow-lg border border-transparent transition-all duration-200 overflow-hidden ${
              selectedTask?.id_question === task.id_question
                ? 'border border-primary shadow-lg'
                : 'hover:border hover:border-gray-300'
            }`}
          >
            <div className="p-3">
              <div className="flex gap-3 mb-2">
                <img
                  src={task.question_image}
                  alt={task.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/80x80/F5C400/001840?text=No+Image';
                  }}
                  className="w-16 h-16 object-cover flex-shrink-0 bg-gray-100"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-semibold text-secondary mb-1.5 truncate text-md md:text-lg">
                    {task.location_name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag.id_tag}
                        className="px-2 py-0.5 text-[10px] border border-secondary text-secondary rounded-full font-medium"
                      >
                        {tag.tag_name}
                      </span>
                    ))}
                    {task.tags.length > 2 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                        +{task.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(task.id_question);
                  }}
                  className="flex-shrink-0 self-start p-1.5 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <Star
                    size={16}
                    className={task.is_favorite ? 'fill-primary text-primary' : 'text-secondary'}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-secondary">
                  <div className="flex items-center gap-1">
                    <Globe size={16} />
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap size={16} />
                    <span>{task.grade}</span>
                  </div>
                  {task.distance !== undefined && task.distance >= 0 && (
                    <div className="flex items-center gap-1 text-secondary font-semibold">
                      <LocateFixed size={16} />
                      <span>{task.distance.toFixed(1)} km</span>
                    </div>
                  )}
                </div>

                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onTaskSelect(task);
                  }}
                  className="text-xs text-secondary underline font-medium cursor-pointer hover:text-blue-700 transition-colors whitespace-nowrap ml-2"
                >
                  Lihat di Peta
                </a>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-300 mb-3">
            <Globe size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">Tidak ada tugas yang sesuai</p>
          <p className="text-sm text-gray-400 mt-1">Coba ubah filter Anda</p>
        </div>
      )}
    </div>
  );
}
