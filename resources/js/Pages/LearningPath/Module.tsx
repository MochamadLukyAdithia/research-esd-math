import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, ClipboardList, Star, MessageSquare } from 'lucide-react';
import Navbar from '@/Components/navbar/Navbar';
import { User as Profile } from '@/types';
import PreTestView from '@/Components/learningpath/PreTestView';
import MaterialView from '@/Components/learningpath/MaterialView';
import ReflectionView from '@/Components/learningpath/ReflectionView';
import ModuleSidebar from '@/Components/learningpath/ModuleSidebar';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Question {
    id_question: number;
    title: string;
    question: string;
    question_type: 'pilihan_ganda' | 'isian';
    points: number;
    question_images: string[];
    options?: { id_question_option: number; option_text: string }[] | null;
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
    // test fields
    questions?: Question[];
    already_submitted?: boolean;
    // material fields
    materials?: Material[];
    // reflection fields
    existing_reflection?: {
        understood_concepts: string | null;
        difficult_parts: string | null;
        most_helpful_activity: string | null;
        rating: number | null;
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
    pre_test:   <ClipboardList size={16} />,
    material:   <BookOpen size={16} />,
    activity:   <Star size={16} />,
    post_test:  <CheckCircle size={16} />,
    reflection: <MessageSquare size={16} />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Module({ path, module, all_modules, progress, next_module, prev_module }: PageProps) {
    const { auth } = usePage().props as { auth: { user: Profile | null } };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigateModule = (mod: AdjacentModule) => {
        router.visit(route('learning-path.module.show', {
            pathId:   path.id_learning_path,
            moduleId: mod.id_module,
        }));
    };

    return (
        <>
            <Head title={`${module.title} — ${path.title}`} />
            <Navbar user={auth.user} />

            <div className="flex h-screen bg-gray-50 pt-[72px]">
                {/* Sidebar modul list */}
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
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top bar */}
                    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <BookOpen size={18} className="text-gray-600" />
                        </button>
                        <button
                            onClick={() => router.visit(route('learning-path.show', path.id_learning_path))}
                            className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            {path.title}
                        </button>
                        <span className="text-gray-300 hidden lg:block">/</span>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                            {MODULE_ICON[module.type]}
                            {module.title}
                        </div>

                        {/* Progress bar ringkas */}
                        {progress && (
                            <div className="ml-auto flex items-center gap-2">
                                <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                                    <div
                                        className="bg-primary h-1.5 rounded-full transition-all"
                                        style={{ width: `${progress.progress_percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400">{progress.progress_percentage}%</span>
                            </div>
                        )}
                    </div>

                    {/* Konten modul */}
                    <div className="flex-1 overflow-y-auto">
                        {(module.type === 'pre_test' || module.type === 'post_test') && (
                            <PreTestView
                                pathId={path.id_learning_path}
                                module={module}
                                nextModule={next_module}
                            />
                        )}

                        {module.type === 'material' && (
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

                    {/* Bottom nav */}
                    <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                        <button
                            onClick={() => prev_module && navigateModule(prev_module)}
                            disabled={!prev_module}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowLeft size={15} />
                            {prev_module?.title ?? 'Sebelumnya'}
                        </button>
                        <button
                            onClick={() => next_module && navigateModule(next_module)}
                            disabled={!next_module}
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {next_module?.title ?? 'Berikutnya'}
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}