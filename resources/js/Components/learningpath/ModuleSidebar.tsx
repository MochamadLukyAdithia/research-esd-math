import { router } from '@inertiajs/react';
import { X, CheckCircle, Circle, PlayCircle, ChevronRight, BookOpen } from 'lucide-react';

interface Module {
    id_module: number;
    title: string;
    type: string;
    order_number: number;
    status: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    pathId: number;
    pathTitle: string;
    modules: Module[];
    currentModuleId: number;
    progress: { progress_percentage: number } | null;
}

const TYPE_LABEL: Record<string, string> = {
    pre_test: 'Pre-Test', material: 'Materi', activity: 'Aktivitas',
    post_test: 'Post-Test', reflection: 'Refleksi',
};

const TYPE_DOT: Record<string, string> = {
    pre_test: 'bg-orange-400', material: 'bg-blue-400', activity: 'bg-purple-400',
    post_test: 'bg-green-400', reflection: 'bg-pink-400',
};

function StatusIcon({ status }: { status: string }) {
    if (status === 'completed')   return <CheckCircle size={16} className="text-green-500 shrink-0" />;
    if (status === 'in_progress') return <PlayCircle  size={16} className="text-blue-500 shrink-0" />;
    return <Circle size={16} className="text-gray-300 shrink-0" />;
}

export default function ModuleSidebar({ isOpen, onClose, pathId, pathTitle, modules, currentModuleId, progress }: Props) {
    const navigate = (moduleId: number) => {
        onClose();
        router.visit(route('learning-path.module.show', { pathId, moduleId }));
    };

    return (
        <>
            {/* Backdrop (mobile) */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="lg:hidden fixed inset-0 bg-black/30 z-20"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30
                w-72 bg-white border-r border-gray-200
                flex flex-col h-full
                transform transition-transform duration-200
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                pt-[72px] lg:pt-0
            `}>
                {/* Header sidebar */}
                <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <BookOpen size={15} className="text-primary" />
                            <span className="text-xs font-semibold text-gray-700 line-clamp-1">{pathTitle}</span>
                        </div>
                        <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
                            <X size={15} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Overall progress */}
                    {progress && (
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{progress.progress_percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div
                                    className="bg-primary h-1.5 rounded-full transition-all"
                                    style={{ width: `${progress.progress_percentage}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Module list */}
                <div className="flex-1 overflow-y-auto py-3 px-2">
                    {modules.map((mod) => {
                        const isActive = mod.id_module === currentModuleId;
                        return (
                            <button
                                key={mod.id_module}
                                onClick={() => navigate(mod.id_module)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left transition-colors ${
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <StatusIcon status={mod.status} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium truncate ${isActive ? 'text-primary' : 'text-gray-800'}`}>
                                        {mod.title}
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${TYPE_DOT[mod.type] ?? 'bg-gray-300'}`} />
                                        <span className="text-xs text-gray-400">{TYPE_LABEL[mod.type]}</span>
                                    </div>
                                </div>
                                {isActive && <ChevronRight size={13} className="text-primary shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            </aside>
        </>
    );
}