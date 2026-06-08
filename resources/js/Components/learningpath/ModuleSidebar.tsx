import { router } from '@inertiajs/react';
import { X, CheckCircle, Circle, PlayCircle, ChevronRight, BookOpen, RotateCcw, Lock } from 'lucide-react';

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
    pre_test:   'Pre-Test',
    material:   'Materi',
    activity:   'Aktivitas',
    post_test:  'Post-Test',
    reflection: 'Refleksi',
};

const TYPE_DOT: Record<string, string> = {
    pre_test:   'bg-orange-400',
    material:   'bg-blue-400',
    activity:   'bg-purple-400',
    post_test:  'bg-green-400',
    reflection: 'bg-pink-400',
};

function StatusIcon({ status, isActive }: { status: string; isActive: boolean }) {
    if (isActive)                 return <PlayCircle  size={15} className="text-primary shrink-0" />;
    if (status === 'completed')   return <CheckCircle size={15} className="text-green-500 shrink-0" />;
    if (status === 'in_progress') return <PlayCircle  size={15} className="text-blue-400 shrink-0" />;
    if (status === 'locked')      return <Lock        size={13} className="text-gray-300 shrink-0" />;
    return <Circle size={14} className="text-gray-300 shrink-0" />;
}

export default function ModuleSidebar({
    isOpen, onClose, pathId, pathTitle, modules, currentModuleId, progress
}: Props) {
    const navigate = (moduleId: number) => {
        onClose();
        router.visit(route('learningpath.module', { pathId, moduleId }));
    };

    const completedCount = modules.filter(m => m.status === 'completed').length;

    return (
        <>
            {/* ── Backdrop mobile ── */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="lg:hidden fixed inset-0 bg-black/40 z-20 backdrop-blur-[1px]"
                    aria-hidden="true"
                />
            )}

            {/* ── Sidebar panel ──
                • Mobile  : fixed overlay dari kiri, z-30, lebar 80vw max 300px
                • Desktop : static, selalu tampil, lebar w-64
            ── */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30
                    w-[min(80vw,300px)] lg:w-64
                    bg-white border-r border-gray-100
                    flex flex-col
                    transform transition-transform duration-200 ease-in-out
                    ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'}
                    pt-[56px] sm:pt-[64px] lg:pt-0
                `}
                style={{ height: '100dvh' }}
            >
                {/* ── Header ── */}
                <div className="px-4 py-5 mt-3 border-b border-gray-100 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <BookOpen size={14} className="text-primary shrink-0" />
                            <span className="text-sm font-bold text-gray-700 truncate">{pathTitle}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg shrink-0 transition-colors"
                            aria-label="Tutup"
                        >
                            <X size={14} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    {progress && (
                        <div>
                            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                <span>{completedCount}/{modules.length} selesai</span>
                                <span className="font-bold text-primary">{progress.progress_percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${progress.progress_percentage}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Info bisa review ── */}
                <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-100 shrink-0">
                    <p className="text-[10px] text-blue-500 font-medium flex items-center gap-1">
                        <RotateCcw size={9} />
                        Modul selesai bisa ditinjau ulang kapan saja.
                    </p>
                </div>

                {/* ── Daftar modul ── */}
                <div className="flex-1 overflow-y-auto py-2 px-2">
                    {modules.map((mod) => {
                        const isActive    = mod.id_module === currentModuleId;
                        const isCompleted = mod.status === 'completed';
                        const isLocked    = mod.status === 'locked';

                        return (
                            <button
                                key={mod.id_module}
                                onClick={() => !isLocked && navigate(mod.id_module)}
                                disabled={isLocked}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-colors group ${
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : isLocked
                                            ? 'opacity-40 cursor-not-allowed text-gray-400'
                                            : isCompleted
                                                ? 'hover:bg-green-50 text-gray-700'
                                                : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <StatusIcon status={mod.status} isActive={isActive} />

                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold truncate leading-tight ${
                                        isActive ? 'text-primary' : isCompleted ? 'text-gray-800' : 'text-gray-600'
                                    }`}>
                                        {mod.title}
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TYPE_DOT[mod.type] ?? 'bg-gray-300'}`} />
                                        <span className="text-[10px] text-gray-400">{TYPE_LABEL[mod.type] ?? mod.type}</span>
                                    </div>
                                </div>

                                {isActive && (
                                    <ChevronRight size={12} className="text-primary shrink-0" />
                                )}
                                {isCompleted && !isActive && (
                                    <RotateCcw size={11} className="text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Footer ── */}
                {completedCount > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 shrink-0">
                        <p className="text-[10px] text-gray-400 text-center">
                            <span className="font-bold text-green-600">{completedCount}</span>
                            {' '}dari {modules.length} modul selesai
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
}