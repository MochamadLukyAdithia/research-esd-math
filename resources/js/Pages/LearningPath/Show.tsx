import { Head, router, usePage } from '@inertiajs/react';
import { 
    BookOpen, Shield, Users, Globe, Clock, 
    ChevronRight, CheckCircle, ArrowLeft, ArrowRight, Lock 
} from 'lucide-react';
import Navbar from '@/Components/navbar/Navbar';
import { User as Profile } from '@/types';
import axios from 'axios';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Module {
    id_module: number;
    title: string;
    type: 'pre_test' | 'material' | 'activity' | 'post_test' | 'reflection';
    order_number: number;
    is_required: boolean;
    status: 'not_started' | 'in_progress' | 'completed';
}

interface Progress {
    status: string;
    progress_percentage: number;
    pre_test_score: number | null;
    post_test_score: number | null;
    started_at: string | null;
    completed_at: string | null;
}

interface PathDetail {
    id_learning_path: number;
    title: string;
    description: string;
    grade: number;
    category: string;
    thumbnail: string | null;
    estimated_minutes: number;
    modules_count: number;
}

interface PageProps {
    path: PathDetail;
    modules: Module[];
    progress: Progress | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODULE_TYPE_LABEL: Record<string, string> = {
    pre_test:   'Pre-Test',
    material:   'Materi',
    activity:   'Aktivitas',
    post_test:  'Post-Test',
    reflection: 'Refleksi',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Show({ path, modules, progress }: PageProps) {
    const { auth } = usePage().props as { auth: { user: Profile | null } };

    // Logika "Eligible": bisa diakses JIKA modul pertama ATAU modul sebelumnya sudah selesai ATAU sudah pernah dimulai
    const enhancedModules = modules.map((mod, index) => {
        const isFirst = index === 0;
        const prevCompleted = index > 0 && modules[index - 1].status === 'completed';
        const isStarted = mod.status !== 'not_started';
        
        return {
            ...mod,
            isEligible: isFirst || prevCompleted || isStarted,
        };
    });

    const handleStart = async () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        if (progress && progress.status !== 'not_started') {
            const inProgress = modules.find(m => m.status === 'in_progress');
            const target = inProgress ?? modules[0];
            router.visit(route('learningpath.module', {
                pathId: path.id_learning_path,
                moduleId: target.id_module,
            }));
            return;
        }

        try {
            const { data } = await axios.post(route('learningpath.start', path.id_learning_path));
            router.visit(route('learningpath.module', {
                pathId: path.id_learning_path,
                moduleId: data.first_module_id,
            }));
        } catch (e) {
            console.error(e);
        }
    };

    const handleNavigateModule = (moduleId: number, isEligible: boolean) => {
        if (!isEligible) return;
        router.visit(route('learningpath.module', {
            pathId: path.id_learning_path,
            moduleId: moduleId,
        }));
    };

    const statusLabel = !progress || progress.status === 'not_started' ? 'Belum Dimulai'
        : progress.status === 'in_progress' ? 'Sedang Berjalan'
        : 'Selesai';

    const ctaLabel = !auth.user ? 'Login untuk Mulai'
        : !progress || progress.status === 'not_started' ? 'Mulai Belajar'
        : progress.status === 'in_progress' ? 'Lanjutkan Belajar'
        : 'Lihat Hasil Akhir';

    const percentage = progress?.progress_percentage ?? 0;

    return (
        <>
            <Head title={path.title} />
            <Navbar user={auth.user} />

            <div className="min-h-screen bg-white pt-[72px] pb-12">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    
                    {/* Header Top */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.visit(route('learning-path.index'))}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-6"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Daftar Program
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                                <BookOpen className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Program Pembelajaran</p>
                                <h1 className="text-xl font-bold text-gray-900">{path.title}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
                        
                        {/* ── KOLOM KIRI (Informasi) Tetap Sama ─────────────────────────────────── */}
                        <div className="lg:col-span-2">
                            <div className="flex border-b border-gray-200 mb-8">
                                <button className="px-6 py-3 border-b-2 border-blue-600 text-blue-600 font-semibold text-sm">
                                    Informasi
                                </button>
                                <button className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors">
                                    Silabus
                                </button>
                              
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 mb-10 pb-10 border-b border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100 shrink-0">
                                        <BookOpen className="text-blue-500" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Metode</p>
                                        <p className="text-sm text-gray-500">Self-Paced (Mandiri)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100 shrink-0">
                                        <Globe className="text-blue-500" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Kategori</p>
                                        <p className="text-sm text-blue-600 font-medium">{path.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100 shrink-0">
                                        <Shield className="text-blue-500" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Level / Kelas</p>
                                        <p className="text-sm text-gray-500">Kelas {path.grade}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100 shrink-0">
                                        <Clock className="text-blue-500" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Estimasi Waktu</p>
                                        <p className="text-sm text-blue-600 font-medium">{path.estimated_minutes} Menit</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100 shrink-0">
                                        <Users className="text-blue-500" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Total Modul</p>
                                        <p className="text-sm text-gray-500">{path.modules_count} Modul Pembelajaran</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100 shrink-0">
                                        <CheckCircle className="text-blue-500" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Status Akses</p>
                                        <p className="text-sm text-gray-500">Bebas Akses (Online/Offline)</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Deskripsi</h2>
                                <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                                    <p>{path.description}</p>
                                    <p className="font-semibold text-gray-800">
                                        Program ini harus diselesaikan secara BERURUTAN mulai dari Pre-Test, Materi, Post-Test, hingga Refleksi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── KOLOM KANAN (Visual Baru) ─────────────────────────────── */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                
                                {/* 1. Action Card */}
                                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Status Pembelajaran</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">{statusLabel}</h3>
                                    
                                    {progress && progress.status !== 'not_started' && (
                                        <div className="mb-6">
                                            {/* Progress Bar */}
                                            <div className="flex justify-between items-end text-sm font-medium mb-2">
                                                <span className="text-gray-700">Progress Belajar</span>
                                                <span className="text-yellow-500 font-bold">{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                                                <div
                                                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>

                                            {/* Score Card Menyamping */}
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="text-center w-20">
                                                    <p className="text-lg font-bold text-gray-900">{progress.pre_test_score ?? '-'}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Pre-Test</p>
                                                </div>
                                                <ArrowRight size={16} className="text-gray-300" />
                                                <div className="text-center w-20">
                                                    <p className="text-lg font-bold text-yellow-500">{progress.post_test_score ?? '-'}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Post-Test</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleStart}
                                        className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        {ctaLabel}
                                        {progress?.status !== 'completed' && <ChevronRight size={18} />}
                                    </button>
                                </div>

                                {/* 2. Timeline Modul */}
                                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Alur Pembelajaran</h3>
                                    
                                    <div className="relative pl-1">
                                        {enhancedModules.map((module, index) => {
                                            const isLast = index === enhancedModules.length - 1;
                                            const isCompleted = module.status === 'completed';
                                            
                                            // Warna Garis (Kuning jika completed)
                                            const lineColor = isCompleted ? 'bg-yellow-500' : 'bg-gray-200';
                                            
                                            // Desain Lingkaran
                                            let circleClass = 'bg-white border-2 border-gray-200 text-gray-400';
                                            if (isCompleted) {
                                                circleClass = 'bg-yellow-500 border-yellow-500 text-white';
                                            } else if (module.isEligible) {
                                                circleClass = 'bg-white border-2 border-yellow-500 text-yellow-500';
                                            }

                                            // Render Badge Sebelah Kanan
                                            let rightBadge;
                                            if (isCompleted) {
                                                rightBadge = (
                                                    <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-md flex items-center gap-1 border border-green-100">
                                                        Selesai <CheckCircle size={12} />
                                                    </span>
                                                );
                                            } else if (module.isEligible) {
                                                rightBadge = (
                                                    <button 
                                                        onClick={() => handleNavigateModule(module.id_module, module.isEligible)}
                                                        className="text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md flex items-center gap-1 transition-colors border border-blue-100"
                                                    >
                                                        Lihat <ChevronRight size={12} />
                                                    </button>
                                                );
                                            } else {
                                                rightBadge = (
                                                    <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md flex items-center gap-1 border border-gray-100">
                                                        <Lock size={12} /> Terkunci
                                                    </span>
                                                );
                                            }

                                            return (
                                                <div key={module.id_module} className="flex relative pb-8">
                                                    
                                                    {/* Garis Penghubung */}
                                                    {!isLast && (
                                                        <div className={`absolute top-10 left-[19px] bottom-0 w-[2px] ${lineColor}`} />
                                                    )}

                                                    {/* Lingkaran Angka */}
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0 font-bold text-sm transition-colors ${circleClass}`}>
                                                        {isCompleted ? <CheckCircle size={18} strokeWidth={2.5} /> : index + 1}
                                                    </div>

                                                    {/* Konten Timeline */}
                                                    <div className="ml-4 flex-1 flex justify-between items-start pt-0.5">
                                                        <div className="pr-3">
                                                            <h4 className={`text-sm font-bold ${module.isEligible ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                {module.title}
                                                            </h4>
                                                            <p className="text-xs text-gray-400 mt-1 font-medium">
                                                                {MODULE_TYPE_LABEL[module.type]}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Badge Sebelah Kanan */}
                                                        <div className="shrink-0 pt-0.5">
                                                            {rightBadge}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Footer bagikan */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                                        <button className="text-blue-600 text-sm font-semibold hover:underline inline-flex items-center gap-1.5 transition-colors">
                                            Bagikan program ini
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}