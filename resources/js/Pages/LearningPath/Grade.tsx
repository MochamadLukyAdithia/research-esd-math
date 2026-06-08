import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Lock, CheckCircle, Play, Clock, BookOpen, ChevronRight, ClipboardList, MessageSquare, Star } from 'lucide-react';
import Navbar from '@/Components/navbar/Navbar';
import { User as Profile } from '@/types';
import axios from 'axios';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Step {
    id_module: number;
    title: string;
    type: 'pre_test' | 'material' | 'activity' | 'post_test' | 'reflection';
    order_number: number;
}

interface ModuleProgress {
    status: 'not_started' | 'in_progress' | 'completed';
    progress_percentage: number;
    pre_test_score: number | null;
    post_test_score: number | null;
}

interface LearningModule {
    id_learning_path: number;
    title: string;
    description: string;
    category: string;
    estimated_minutes: number;
    thumbnail: string | null;
    order_number: number;
    modules_count: number;
    steps: Step[];
    is_locked: boolean;
    progress: ModuleProgress | null;
}

interface PageProps {
    grade: number;
    label: string;
    level: string;
    modules: LearningModule[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STEP_ICON: Record<string, React.ReactNode> = {
    pre_test:   <ClipboardList size={11} />,
    material:   <BookOpen size={11} />,
    activity:   <Star size={11} />,
    post_test:  <ClipboardList size={11} />,
    reflection: <MessageSquare size={11} />,
};

const STEP_COLOR: Record<string, string> = {
    pre_test:   'bg-orange-100 text-orange-600',
    material:   'bg-blue-100 text-blue-600',
    activity:   'bg-purple-100 text-purple-600',
    post_test:  'bg-green-100 text-green-600',
    reflection: 'bg-pink-100 text-pink-600',
};

function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} mnt`;
    return `${Math.floor(minutes / 60)} jam${minutes % 60 > 0 ? ` ${minutes % 60} mnt` : ''}`;
}

// ─── Module Card ──────────────────────────────────────────────────────────────

function ModuleCard({ mod, index, isLoggedIn }: { mod: LearningModule; index: number; isLoggedIn: boolean }) {
    const isCompleted  = mod.progress?.status === 'completed';
    const isInProgress = mod.progress?.status === 'in_progress';
    const isLocked     = mod.is_locked;

    const handleStart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLocked || !isLoggedIn) return;

        if (isCompleted || isInProgress) {
            router.visit(route('learningpath.show', mod.id_learning_path));
            return;
        }

        try {
            const { data } = await axios.post(route('learningpath.start', mod.id_learning_path));
            if (data.first_module_id) {
                router.visit(route('learningpath.module', {
                    pathId:   mod.id_learning_path,
                    moduleId: data.first_module_id,
                }));
            }
        } catch (err: any) {
            if (err.response?.status === 403) {
                alert(err.response.data.error);
            }
        }
    };

    const handleCardClick = () => {
        if (!isLocked) router.visit(route('learningpath.show', mod.id_learning_path));
    };

    return (
        <div
            onClick={handleCardClick}
            className={`group relative bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                isLocked
                    ? 'border-gray-200 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 hover:border-primary hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
            }`}
        >
            {/* Nomor modul */}
            <div className={`absolute top-0 left-0 w-10 h-10 flex items-center justify-center rounded-br-2xl text-sm font-black ${
                isCompleted ? 'bg-green-500 text-white' :
                isInProgress ? 'bg-primary text-white' :
                isLocked ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}>
                {isCompleted ? <CheckCircle size={16} /> : isLocked ? <Lock size={14} /> : index + 1}
            </div>

            <div className="p-5 pt-4 pl-12">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                        <p className="text-[10px] text-primary font-semibold mb-0.5">{mod.category}</p>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">{mod.title}</h3>
                    </div>
                    {isLocked && <Lock size={14} className="text-gray-300 shrink-0 mt-0.5" />}
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{mod.description}</p>

                {/* Steps preview */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {mod.steps.map(step => (
                        <span
                            key={step.id_module}
                            className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${STEP_COLOR[step.type]}`}
                        >
                            {STEP_ICON[step.type]}
                            {step.type === 'material' ? step.title : {
                                pre_test: 'Pre-Test', post_test: 'Post-Test', reflection: 'Refleksi', activity: 'Aktivitas'
                            }[step.type]}
                        </span>
                    ))}
                </div>

                {/* Progress bar */}
                {mod.progress && mod.progress.status !== 'not_started' && (
                    <div className="mb-3">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                            <span>Progress</span>
                            <span className="font-semibold">{mod.progress.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1">
                            <div
                                className={`h-1 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                                style={{ width: `${mod.progress.progress_percentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1"><Clock size={10} />{formatDuration(mod.estimated_minutes)}</span>
                        <span className="flex items-center gap-1"><BookOpen size={10} />{mod.modules_count} langkah</span>
                    </div>

                    {!isLocked && isLoggedIn && (
                        <button
                            onClick={handleStart}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                isCompleted
                                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                    : isInProgress
                                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                        : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                        >
                            {isCompleted   ? <><CheckCircle size={12} />Lihat</> :
                             isInProgress  ? <><Play size={12} />Lanjut</>       :
                                            <><Play size={12} />Mulai</>}
                        </button>
                    )}

                    {!isLoggedIn && (
                        <button
                            onClick={(e) => { e.stopPropagation(); router.visit(route('login')); }}
                            className="text-xs text-primary font-semibold flex items-center gap-1"
                        >
                            Login <ChevronRight size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Skor pre/post test jika sudah selesai */}
            {isCompleted && mod.progress?.pre_test_score !== null && mod.progress?.post_test_score !== null && (
                <div className="px-5 py-2 bg-green-50 border-t border-green-100 flex items-center justify-between">
                    <span className="text-[10px] text-green-600">Pre: {mod.progress?.pre_test_score}</span>
                    <span className="text-[10px] text-green-400">→</span>
                    <span className="text-[10px] text-green-700 font-bold">Post: {mod.progress?.post_test_score}</span>
                    <span className="text-[10px] text-green-600 font-semibold">
                        +{(mod.progress?.post_test_score ?? 0) - (mod.progress?.pre_test_score ?? 0)} poin
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Grade({ grade, label, level, modules }: PageProps) {
    const { auth } = usePage().props as { auth: { user: Profile | null } };

    const completed = modules.filter(m => m.progress?.status === 'completed').length;
    const pct = modules.length > 0 ? Math.round((completed / modules.length) * 100) : 0;

    return (
        <>
            <Head title={`Learning Path ${label}`} />
            <Navbar user={auth.user} />

            <div className="min-h-screen bg-gray-50 pt-[72px] pb-16">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <button
                            onClick={() => router.visit(route('learningpath.index'))}
                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            Semua Kelas
                        </button>

                        <div className="flex items-end justify-between flex-wrap gap-4">
                            <div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block ${
                                    level === 'SMP'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-purple-100 text-purple-700'
                                }`}>{level}</span>
                                <h1 className="text-3xl font-black text-gray-900">{label}</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {modules.length} modul · Selesaikan secara berurutan
                                </p>
                            </div>

                            {auth.user && completed > 0 && (
                                <div className="text-right">
                                    <p className="text-2xl font-black text-primary">{pct}%</p>
                                    <p className="text-xs text-gray-400">{completed} dari {modules.length} selesai</p>
                                </div>
                            )}
                        </div>

                        {/* Progress bar overall */}
                        {auth.user && (
                            <div className="mt-5 w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-700 ${
                                        level === 'SMP' ? 'bg-blue-500' : 'bg-purple-500'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Daftar modul */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Petunjuk urutan */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 bg-white border border-gray-100 rounded-xl px-4 py-3">
                        <Lock size={12} className="shrink-0" />
                        <span>Modul harus diselesaikan secara berurutan. Selesaikan modul sebelumnya untuk membuka modul berikutnya.</span>
                    </div>

                    <div className="space-y-4">
                        {modules.map((mod, index) => (
                            <ModuleCard
                                key={mod.id_learning_path}
                                mod={mod}
                                index={index}
                                isLoggedIn={!!auth.user}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}