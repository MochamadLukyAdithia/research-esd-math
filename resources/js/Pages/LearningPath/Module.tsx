import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, ClipboardList, Star, MessageSquare, Menu, X } from 'lucide-react';
import Navbar from '@/Components/navbar/Navbar';
import { User as Profile } from '@/types';
import PreTestView from '@/Components/learningpath/PreTestView';
import MaterialView from '@/Components/learningpath/MaterialView';
import ReflectionView from '@/Components/learningpath/ReflectionView';
import type { AnswerValue } from '@/Components/learningpath/ReflectionView'; // ← tambah ini
import ModuleSidebar from '@/Components/learningpath/ModuleSidebar';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Question {
    id_question: number;
    title: string;
    question: string;
    question_type: 'pilihan_ganda' | 'pilihan_ganda_kompleks' | 'isian';
    points: number;
    question_images: string[];
   options?: {
    id_question_option: number;
    option_text:        string | null;   // ← nullable
    option_image?:      string | null;   // ← tambah ini
}[] | null;
}

export interface Material {
    id_material: number;
    title: string;
    content_type: 'slide' | 'video' | 'example' | 'text';
    content: string | null;
    file_url: string | null;
    order_number: number;
}

interface ModuleData {
    id_module: number;
    title: string;
    type: 'pre_test' | 'material' | 'activity' | 'post_test' | 'reflection';
    order_number: number;
    is_required: boolean;
    status: string;
    questions?: Question[];
    already_submitted?: boolean;
    previous_score?: number | null;
    previous_answers?: any[];
    materials?: Material[];
  existing_reflection?: {
    q1_platform_usage: AnswerValue | null;
    q2_data_comprehension: AnswerValue | null;
    q3_math_application: AnswerValue | null;
    q4_reasoning: AnswerValue | null;
} | null;
}

interface AdjacentModule {
    id_module: number;
    type: string;
    title: string;
}

interface PageProps {
    path: { id_learning_path: number; title: string; grade: number };
    module: ModuleData;
    all_modules: ModuleData[];
    progress: { progress_percentage: number; pre_test_score: number | null; post_test_score: number | null } | null;
    next_module: AdjacentModule | null;
    prev_module: AdjacentModule | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODULE_ICON: Record<string, React.ReactNode> = {
    pre_test:   <ClipboardList size={15} />,
    material:   <BookOpen size={15} />,
    activity:   <Star size={15} />,
    post_test:  <CheckCircle size={15} />,
    reflection: <MessageSquare size={15} />,
};

const MODULE_TYPE_LABEL: Record<string, string> = {
    pre_test:   'Pre-Test',
    material:   'Materi',
    activity:   'Aktivitas',
    post_test:  'Post-Test',
    reflection: 'Refleksi',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Module({ path, module, all_modules, progress, next_module, prev_module }: PageProps) {
    const { auth } = usePage().props as { auth: { user: Profile | null } };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigateModule = (mod: AdjacentModule) => {
        router.visit(route('learningpath.module', {
            pathId:   path.id_learning_path,
            moduleId: mod.id_module,
        }));
    };

    return (
        <>
            <Head title={module.title} />
            <Navbar user={auth.user} />

            <div className="flex h-screen bg-gray-50 pt-[56px] sm:pt-[64px]">

                {/* Sidebar */}
                <ModuleSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    pathId={path.id_learning_path}
                    pathTitle={path.title}
                    modules={all_modules}
                    currentModuleId={module.id_module}
                    progress={progress}
                />

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                    {/* ── Top bar ── */}
                    <div className="bg-white border-b border-gray-100 px-3 sm:px-5 py-4 mt-3 flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                            aria-label="Buka daftar modul"
                        >
                            <Menu size={18} className="text-gray-600" />
                        </button>

                        <button
                            onClick={() => router.visit(route('learningpath.show', path.id_learning_path))}
                            className="hidden lg:flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                        >
                            <ArrowLeft size={13} />
                            <span className="max-w-[120px] truncate">{path.title}</span>
                        </button>
                        <span className="text-gray-200 hidden lg:block">/</span>

                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 min-w-0 flex-1">
                            <span className="text-primary shrink-0">{MODULE_ICON[module.type]}</span>
                            <span className="truncate">{module.title}</span>
                            <span className="hidden sm:inline text-xs text-gray-400 font-normal shrink-0">
                                · {MODULE_TYPE_LABEL[module.type]}
                            </span>
                        </div>

                        {progress && (
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="w-16 sm:w-24 bg-gray-100 rounded-full h-1.5 hidden xs:block">
                                    <div
                                        className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${progress.progress_percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{progress.progress_percentage}%</span>
                            </div>
                        )}
                    </div>

                    {/* ── Konten modul ── */}
                    <div className="flex-1 overflow-y-auto">
                        {(module.type === 'pre_test' || module.type === 'post_test') && (
                            <PreTestView
                                pathId={path.id_learning_path}
                                module={module}
                                nextModule={next_module}
                            />
                        )}

                        {(module.type === 'material' || module.type === 'activity') && (
                            <MaterialView
                                pathId={path.id_learning_path}
                                module={module}
                                nextModule={next_module}
                            />
                        )}

                        {module.type === 'reflection' && (
                            <ReflectionView
                                pathId={path.id_learning_path}
                                module={module}
                                nextModule={next_module}
                            />
                        )}
                    </div>

                    {/* ── Bottom nav ── */}
                    <div className="bg-white border-t border-gray-100 px-3 sm:px-5 py-2.5 flex items-center justify-between shrink-0 safe-bottom">
                        <button
                            onClick={() => prev_module && navigateModule(prev_module)}
                            disabled={!prev_module}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50 active:bg-gray-100"
                        >
                            <ArrowLeft size={14} />
                            <span className="max-w-[100px] sm:max-w-[160px] truncate">
                                {prev_module?.title ?? 'Sebelumnya'}
                            </span>
                        </button>

                        <div className="flex items-center gap-1">
                            {all_modules.map((m) => (
                                <div
                                    key={m.id_module}
                                    className={`rounded-full transition-all duration-300 ${
                                        m.id_module === module.id_module
                                            ? 'w-4 h-1.5 bg-primary'
                                            : m.status === 'completed'
                                                ? 'w-1.5 h-1.5 bg-green-400'
                                                : 'w-1.5 h-1.5 bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => next_module && navigateModule(next_module)}
                            disabled={!next_module}
                            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1.5 rounded-lg hover:bg-primary/5 active:bg-primary/10 font-medium"
                        >
                            <span className="max-w-[100px] sm:max-w-[160px] truncate">
                                {next_module?.title ?? 'Berikutnya'}
                            </span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}