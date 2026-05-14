import { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, Clock, ChevronRight, GraduationCap, Filter, TrendingUp } from 'lucide-react';
import Navbar from '@/Components/navbar/Navbar';
import { User as Profile } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LearningPathProgress {
    status: 'not_started' | 'in_progress' | 'completed';
    progress_percentage: number;
}

export interface LearningPath {
    id_learning_path: number;
    title: string;
    description: string;
    grade: number;
    category: string;
    thumbnail: string | null;
    estimated_minutes: number;
    modules_count: number;
    progress: LearningPathProgress | null;
}

interface PageProps {
    paths: LearningPath[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
    not_started: { label: 'Belum Dimulai', className: 'bg-gray-100 text-gray-600' },
    in_progress:  { label: 'Sedang Berjalan', className: 'bg-blue-100 text-blue-700' },
    completed:    { label: 'Selesai', className: 'bg-green-100 text-green-700' },
} as const;

function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} mnt`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} jam ${m} mnt` : `${h} jam`;
}

// ─── PathCard ─────────────────────────────────────────────────────────────────

function PathCard({ path }: { path: LearningPath }) {
    const status = path.progress?.status ?? 'not_started';
    const badge  = STATUS_CONFIG[status];

    return (
        <div
            onClick={() => router.visit(route('learning-path.show', path.id_learning_path))}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col"
        >
            {/* Thumbnail */}
            <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden shrink-0">
                {path.thumbnail ? (
                    <img
                        src={path.thumbnail}
                        alt={path.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <BookOpen size={40} className="text-primary/30" />
                    </div>
                )}
                <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${badge.className}`}>
                    {badge.label}
                </span>
                <span className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700">
                    Kelas {path.grade}
                </span>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-primary font-medium mb-1">{path.category}</p>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">
                    {path.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{path.description}</p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                        <GraduationCap size={13} />
                        {path.modules_count} modul
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {formatDuration(path.estimated_minutes)}
                    </span>
                </div>

                {/* Progress bar */}
                {path.progress && path.progress.status !== 'not_started' && (
                    <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{path.progress.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className="bg-primary h-1.5 rounded-full transition-all"
                                style={{ width: `${path.progress.progress_percentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                    <span className="text-xs font-medium text-primary">
                        {status === 'not_started' ? 'Mulai Belajar' :
                         status === 'in_progress'  ? 'Lanjutkan'    : 'Lihat Detail'}
                    </span>
                    <ChevronRight size={15} className="text-primary group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Index({ paths }: PageProps) {
    const { auth } = usePage().props as { auth: { user: Profile | null } };

    const [selectedGrade,    setSelectedGrade]    = useState<number | 'all'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus,   setSelectedStatus]   = useState<string>('all');

    const grades     = [...new Set(paths.map(p => p.grade))].sort((a, b) => a - b);
    const categories = [...new Set(paths.map(p => p.category))];

    const filtered = useMemo(() => {
        return paths.filter(p => {
            const gradeOk    = selectedGrade    === 'all' || p.grade    === selectedGrade;
            const categoryOk = selectedCategory === 'all' || p.category === selectedCategory;
            const statusOk   = selectedStatus   === 'all' || (p.progress?.status ?? 'not_started') === selectedStatus;
            return gradeOk && categoryOk && statusOk;
        });
    }, [paths, selectedGrade, selectedCategory, selectedStatus]);

    const stats = {
        total:      paths.length,
        inProgress: paths.filter(p => p.progress?.status === 'in_progress').length,
        completed:  paths.filter(p => p.progress?.status === 'completed').length,
    };

    return (
        <>
            <Head title="Learning Path" />
            <Navbar user={auth.user} />

            <div className="min-h-screen bg-gray-50 pt-[72px]">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Learning Path</h1>
                        <p className="text-sm text-gray-500">
                            Belajar matematika kontekstual dengan alur pembelajaran yang terstruktur
                        </p>

                        {/* Stats (hanya jika login) */}
                        {auth.user && (
                            <div className="flex gap-8 mt-6">
                                {[
                                    { label: 'Total Path', value: stats.total, color: 'text-gray-900' },
                                    { label: 'Sedang Berjalan', value: stats.inProgress, color: 'text-blue-600' },
                                    { label: 'Selesai', value: stats.completed, color: 'text-green-600' },
                                ].map(s => (
                                    <div key={s.label}>
                                        <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-6">
                    {/* Filter */}
                    <div className="flex flex-wrap gap-2 mb-6 items-center">
                        <Filter size={14} className="text-gray-400" />

                        <select
                            value={selectedGrade}
                            onChange={e => setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-primary"
                        >
                            <option value="all">Semua Kelas</option>
                            {grades.map(g => <option key={g} value={g}>Kelas {g}</option>)}
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-primary"
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        {auth.user && (
                            <select
                                value={selectedStatus}
                                onChange={e => setSelectedStatus(e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-primary"
                            >
                                <option value="all">Semua Status</option>
                                <option value="not_started">Belum Dimulai</option>
                                <option value="in_progress">Sedang Berjalan</option>
                                <option value="completed">Selesai</option>
                            </select>
                        )}

                        <span className="text-xs text-gray-400 ml-auto">
                            {filtered.length} dari {paths.length} path
                        </span>
                    </div>

                    {/* Grid */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filtered.map(path => (
                                <PathCard key={path.id_learning_path} path={path} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <TrendingUp size={40} className="mx-auto text-gray-200 mb-3" />
                            <p className="text-gray-400 text-sm">Tidak ada learning path yang sesuai filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}