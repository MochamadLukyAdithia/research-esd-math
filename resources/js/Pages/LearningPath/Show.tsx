import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    BookOpen, Shield, Users, Globe, Clock,
    ChevronRight, CheckCircle, ArrowLeft, ArrowRight, Lock,
    Download, FileText, ListChecks, Layers,
    PlayCircle, Circle, ClipboardList, MessageSquare, Star, Play
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
    kbNumber?: number | null;
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
    capaian_pembelajaran: string | null;
    kompetensi_dasar: string | null;
    metode_penilaian: string[] | null;
    sumber_belajar: string[] | null;
}

interface SiblingModule {
    id_learning_path: number;
    title: string;
    order_number: number;
}

interface PageProps {
    path: PathDetail;
    modules: Module[];
    progress: Progress | null;
    sibling_modules?: SiblingModule[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODULE_TYPE_LABEL: Record<string, string> = {
    pre_test:   'Pre-Test',
    material:   'Materi',
    activity:   'Aktivitas',
    post_test:  'Post-Test',
    reflection: 'Refleksi',
};

const MODULE_TYPE_COLOR: Record<string, string> = {
    pre_test:   'bg-yellow-50 text-yellow-700 border-yellow-200',
    material:   'bg-blue-50 text-blue-700 border-blue-200',
    activity:   'bg-purple-50 text-purple-700 border-purple-200',
    post_test:  'bg-green-50 text-green-700 border-green-200',
    reflection: 'bg-pink-50 text-pink-700 border-pink-200',
};

const MODULE_TYPE_ICON: Record<string, JSX.Element> = {
    pre_test:   <FileText size={14} />,
    material:   <BookOpen size={14} />,
    activity:   <ListChecks size={14} />,
    post_test:  <CheckCircle size={14} />,
    reflection: <Layers size={14} />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Show({ path, modules, progress, sibling_modules = [] }: PageProps) {
    const { auth } = usePage().props as { auth: { user: Profile | null } };
    const [activeTab, setActiveTab] = useState<'informasi' | 'silabus'>('informasi');
    const [starting, setStarting] = useState(false);
    const sylabusRef = useRef<HTMLDivElement>(null);

    // kbCounter: hitung nomor urut untuk tipe material
    let kbCounter = 0;
    const modulesWithKb: (Module & { kbNumber: number | null })[] = modules.map(m => ({
        ...m,
        kbNumber: m.type === 'material' ? ++kbCounter : null,
    }));

    // isEligible logic
    const enhancedModules = modulesWithKb.map((mod, index) => {
        const isFirst      = index === 0;
        const prevCompleted = index > 0 && modules[index - 1].status === 'completed';
        const isStarted    = mod.status !== 'not_started';
        return {
            ...mod,
            isEligible: isFirst || prevCompleted || isStarted,
        };
    });

    // Download Silabus
    const handleDownloadSilabus = () => {
        const metodePenilaianHtml = path.metode_penilaian?.length
            ? `<ul style="padding-left:18px;margin:0">${path.metode_penilaian.map(i => `<li>${i}</li>`).join('')}</ul>`
            : '<span style="color:#94a3b8">-</span>';

        const sumberBelajarHtml = path.sumber_belajar?.length
            ? `<ul style="padding-left:18px;margin:0">${path.sumber_belajar.map(i => `<li>${i}</li>`).join('')}</ul>`
            : '<span style="color:#94a3b8">-</span>';

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Silabus - ${path.title}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 40px; }
                    .header { padding-bottom: 20px; margin-bottom: 28px; border-bottom: 2px solid #e2e8f0; }
                    .header h1 { font-size: 22px; font-weight: 700; color: #1e3a5f; }
                    .header p { color: #64748b; font-size: 13px; margin-top: 4px; }
                    .meta { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
                    .meta-item { background: #f1f5f9; border-radius: 8px; padding: 10px 16px; min-width: 120px; }
                    .meta-item .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; }
                    .meta-item .value { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 2px; }
                    .section { margin-bottom: 24px; }
                    .section-title { font-size: 13px; font-weight: 700; color: #1e3a5f; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
                    .section p, .section li { font-size: 13px; color: #334155; line-height: 1.7; }
                    .two-col { display: flex; gap: 24px; }
                    .two-col > div { flex: 1; }
                    h2 { font-size: 13px; font-weight: 700; color: #1e3a5f; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
                    table { width: 100%; border-collapse: collapse; font-size: 13px; }
                    th { background: #1e3a5f; color: white; padding: 10px 14px; text-align: left; font-weight: 600; font-size: 12px; }
                    td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
                    tr:nth-child(even) td { background: #f8fafc; }
                    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
                    .badge-pre_test   { background: #fef9c3; color: #854d0e; }
                    .badge-material   { background: #dbeafe; color: #1d4ed8; }
                    .badge-activity   { background: #f3e8ff; color: #7c3aed; }
                    .badge-post_test  { background: #dcfce7; color: #166534; }
                    .badge-reflection { background: #fce7f3; color: #9d174d; }
                    .badge-required   { background: #fee2e2; color: #991b1b; font-size: 10px; padding: 2px 8px; }
                    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
                    @media print { body { padding: 20px; } button { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${path.title}</h1>
                    <p>${path.description}</p>
                </div>

                <div class="meta">
                    <div class="meta-item"><div class="label">Mata Pelajaran</div><div class="value">${path.category}</div></div>
                    <div class="meta-item"><div class="label">Kelas / Tingkat</div><div class="value">Kelas ${path.grade}</div></div>
                    <div class="meta-item"><div class="label">Alokasi Waktu</div><div class="value">${path.estimated_minutes} Menit</div></div>
                    <div class="meta-item"><div class="label">Total KB</div><div class="value">${path.modules_count} Modul</div></div>
                <div>

                
                .replace(/\n/g, '<br/>')}</p>
                
                ${path.kompetensi_dasar ? `
                <div class="section">
                    <div class="section-title">Kompetensi Dasar</div>
                    <p>${path.kompetensi_dasar.replace(/\n/g, '<br/>')}</p>
                </div>` : ''}

                <div class="section">
                    <h2>Alur Materi Pembelajaran</h2>
                    <table>
                        <thead>
                            <tr>
                                <th style="width:40px">#</th>
                                <th>Judul KB / Kegiatan</th>
                                <th>Tipe</th>
                                <th>Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${modules.map((m, i) => `
                                <tr>
                                    <td style="font-weight:600;color:#64748b">${i + 1}</td>
                                    <td style="font-weight:500">${m.title}</td>
                                    <td><span class="badge badge-${m.type}">${MODULE_TYPE_LABEL[m.type]}</span></td>
                                    <td>${m.is_required
                                        ? '<span class="badge badge-required">Wajib</span>'
                                        : '<span style="color:#94a3b8;font-size:12px">Opsional</span>'
                                    }</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="two-col">
                    <div class="section">
                        <div class="section-title">Metode Penilaian</div>
                        ${metodePenilaianHtml}
                    </div>
                    <div class="section">
                        <div class="section-title">Sumber Belajar</div>
                        ${sumberBelajarHtml}
                    </div>
                </div>

                <div class="footer">
                    Dicetak dari platform ESD Math Path &nbsp;·&nbsp; ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([printContent], { type: 'text/html' });
        const url  = URL.createObjectURL(blob);
        const win  = window.open(url, '_blank');
        if (win) {
            win.onload = () => {
                win.print();
                URL.revokeObjectURL(url);
            };
        }
    };

    // handleStart
    const handleStart = async () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }
        if (starting) return;

        if (progress && progress.status === 'in_progress') {
            const target = modules.find(m => m.status === 'in_progress')
                        ?? modules.find(m => m.status !== 'completed')
                        ?? modules[0];
            router.visit(route('learningpath.module', {
                pathId:   path.id_learning_path,
                moduleId: target.id_module,
            }));
            return;
        }

        if (progress && progress.status === 'completed') {
            const last = modules[modules.length - 1];
            router.visit(route('learningpath.module', {
                pathId:   path.id_learning_path,
                moduleId: last.id_module,
            }));
            return;
        }

        setStarting(true);
        try {
            const { data } = await axios.post(route('learningpath.start', path.id_learning_path));
            if (data.first_module_id) {
                router.visit(route('learningpath.module', {
                    pathId:   path.id_learning_path,
                    moduleId: data.first_module_id,
                }));
            }
        } catch (err: any) {
            alert(err.response?.data?.error ?? 'Terjadi kesalahan, silakan coba lagi.');
        } finally {
            setStarting(false);
        }
    };

    const handleNavigateModule = (moduleId: number, isEligible: boolean) => {
        if (!isEligible) return;
        router.visit(route('learningpath.module', {
            pathId:   path.id_learning_path,
            moduleId: moduleId,
        }));
    };

    const statusLabel = !progress || progress.status === 'not_started' ? 'Belum Dimulai'
        : progress.status === 'in_progress' ? 'Sedang Berjalan'
        : 'Selesai';

    const ctaLabel = starting      ? 'Memuat...'
        : !auth.user               ? 'Login untuk Mulai'
        : !progress || progress.status === 'not_started' ? 'Mulai Belajar'
        : progress.status === 'in_progress'              ? 'Lanjutkan Belajar'
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
                            onClick={() => router.visit(route('learningpath.index'))}
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

                        {/* ── KOLOM KIRI ──────────────────────────────────────── */}
                        <div className="lg:col-span-2">

                            {/* Tab */}
                            <div className="flex border-b border-gray-200 mb-8">
                                {(['informasi', 'silabus'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 capitalize ${
                                            activeTab === tab
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* ── TAB: INFORMASI ─────────────────────────────── */}
                            {activeTab === 'informasi' && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 mb-10 pb-10 border-b border-gray-100">
                                        {[
                                            { icon: <BookOpen className="text-blue-500" size={18} />, label: 'Metode', value: 'Self-Paced (Mandiri)' },
                                            { icon: <Globe className="text-blue-500" size={18} />,    label: 'Kategori', value: path.category, accent: true },
                                            { icon: <Shield className="text-blue-500" size={18} />,   label: 'Level / Kelas', value: `Kelas ${path.grade}` },
                                            { icon: <Clock className="text-blue-500" size={18} />,    label: 'Estimasi Waktu', value: `${path.estimated_minutes} Menit`, accent: true },
                                            { icon: <Users className="text-blue-500" size={18} />,    label: 'Total Modul', value: `${path.modules_count} KB Pembelajaran` },
                                            { icon: <CheckCircle className="text-blue-500" size={18} />, label: 'Status Akses', value: 'Bebas Akses (Online/Offline)' },
                                        ].map(item => (
                                            <div key={item.label} className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100 shrink-0">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 mb-0.5">{item.label}</p>
                                                    <p className={`text-sm ${item.accent ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                                        {item.value}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
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

                                    {/* Modul lain di kelas yang sama */}
                                    {sibling_modules.length > 0 && (
                                        <div className="mt-10 pt-8 border-t border-gray-100">
                                            <h2 className="text-base font-bold text-gray-900 mb-4">
                                                Modul Lain di Kelas {path.grade}
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {sibling_modules.map(s => (
                                                    <button
                                                        key={s.id_learning_path}
                                                        onClick={() => router.visit(route('learningpath.show', s.id_learning_path))}
                                                        className="flex items-center justify-between gap-2 text-sm text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-100 rounded-xl px-4 py-3 transition-all text-left"
                                                    >
                                                        <span className="truncate font-medium">
                                                            Modul {s.order_number}: {s.title}
                                                        </span>
                                                        <ChevronRight size={14} className="shrink-0" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ── TAB: SILABUS ───────────────────────────────── */}
                            {activeTab === 'silabus' && (
                                <div ref={sylabusRef}>
                                    {/* Header Silabus */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">Silabus Program</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {modules.length} modul · {path.estimated_minutes} menit estimasi
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleDownloadSilabus}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                                        >
                                            <Download size={15} />
                                            Unduh Silabus
                                        </button>
                                    </div>

                                    {/* ── 1. Identitas Program ── */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                                        {[
                                            { label: 'Mata Pelajaran', value: path.category },
                                            { label: 'Kelas / Tingkat', value: `Kelas ${path.grade}` },
                                            { label: 'Alokasi Waktu',   value: `${path.estimated_minutes} Menit` },
                                            { label: 'Total Modul',     value: `${path.modules_count} Modul` },
                                        ].map(item => (
                                            <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{item.label}</p>
                                                <p className="text-sm font-bold text-gray-800 mt-1">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* ── 3. Kompetensi Dasar ── */}
                                    {path.kompetensi_dasar && (
                                        <div className="mb-6 p-5 bg-purple-50 border border-purple-100 rounded-2xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ClipboardList size={15} className="text-purple-600" />
                                                <p className="text-sm font-bold text-purple-800">Tujuan Pembelajaran</p>
                                            </div>
                                            <p className="text-sm text-purple-700 leading-relaxed whitespace-pre-line">
                                                {path.kompetensi_dasar}
                                            </p>
                                        </div>
                                    )}

                                    {/* ── 4. Alur Materi Pembelajaran ── */}
                                    <div className="mb-6">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <BookOpen size={13} className="text-gray-400" />
                                            Alur Materi Pembelajaran
                                        </h3>
                                        <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100">
                                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">#</th>
                                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul KB / Kegiatan</th>
                                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipe</th>
                                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Keterangan</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {modulesWithKb.map((mod, index) => (
                                                        <tr
                                                            key={mod.id_module}
                                                            className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors"
                                                        >
                                                            <td className="py-4 px-4 font-bold text-gray-400 text-xs">{index + 1}</td>
                                                            <td className="py-4 px-4">
                                                                <span className="font-semibold text-gray-800">{mod.title}</span>
                                                                {mod.type === 'material' && mod.kbNumber !== null && (
                                                                    <span className="ml-2 text-[10px] text-blue-400 font-medium">
                                                                        KB {mod.kbNumber}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${MODULE_TYPE_COLOR[mod.type]}`}>
                                                                    {MODULE_TYPE_ICON[mod.type]}
                                                                    {MODULE_TYPE_LABEL[mod.type]}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                {mod.is_required ? (
                                                                    <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-md text-[11px] font-semibold">
                                                                        Wajib
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-400 text-xs">Opsional</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* ── 5. Metode Penilaian & Sumber Belajar ── */}
                                    {((path.metode_penilaian?.length ?? 0) > 0 || (path.sumber_belajar?.length ?? 0) > 0) && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                            {path.metode_penilaian && path.metode_penilaian.length > 0 && (
                                                <div className="p-5 bg-green-50 border border-green-100 rounded-2xl">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <CheckCircle size={15} className="text-green-600" />
                                                        <p className="text-sm font-bold text-green-800">Metode Penilaian</p>
                                                    </div>
                                                    <ul className="space-y-1.5">
                                                        {path.metode_penilaian.map((item, i) => (
                                                            <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {path.sumber_belajar && path.sumber_belajar.length > 0 && (
                                                <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Globe size={15} className="text-orange-600" />
                                                        <p className="text-sm font-bold text-orange-800">Sumber Belajar</p>
                                                    </div>
                                                    <ul className="space-y-1.5">
                                                        {path.sumber_belajar.map((item, i) => (
                                                            <li key={i} className="flex items-center gap-2 text-sm text-orange-700">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ── 6. Catatan Penting ── */}
                                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                                        <p className="text-sm text-yellow-800 font-semibold mb-1">Catatan Penting</p>
                                        <p className="text-sm text-yellow-700 leading-relaxed">
                                            Modul yang ditandai <strong>Wajib</strong> harus diselesaikan sebelum melanjutkan ke modul berikutnya.
                                            Urutan pembelajaran tidak dapat dilewati.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── KOLOM KANAN ─────────────────────────────────────── */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">

                                {/* Action Card */}
                                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Status Pembelajaran</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">{statusLabel}</h3>

                                    {progress && progress.status !== 'not_started' && (
                                        <div className="mb-6">
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

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="text-center w-20">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {progress.pre_test_score ?? '-'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Pre-Test</p>
                                                </div>
                                                <ArrowRight size={16} className="text-gray-300" />
                                                <div className="text-center w-20">
                                                    <p className="text-lg font-bold text-yellow-500">
                                                        {progress.post_test_score ?? '-'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Post-Test</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleStart}
                                        disabled={starting}
                                        className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <Play size={16} />
                                        {ctaLabel}
                                        {!starting && progress?.status !== 'completed' && (
                                            <ChevronRight size={18} />
                                        )}
                                    </button>
                                </div>

                                {/* Timeline Modul */}
                                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Alur Pembelajaran</h3>

                                    <div className="relative pl-1">
                                        {enhancedModules.map((module, index) => {
                                            const isLast      = index === enhancedModules.length - 1;
                                            const isCompleted = module.status === 'completed';
                                            const isActive    = module.status === 'in_progress';
                                            const lineColor   = isCompleted ? 'bg-yellow-500' : 'bg-gray-200';

                                            let circleClass = 'bg-white border-2 border-gray-200 text-gray-400';
                                            if (isCompleted) {
                                                circleClass = 'bg-yellow-500 border-yellow-500 text-white';
                                            } else if (isActive) {
                                                circleClass = 'bg-white border-2 border-blue-500 text-blue-500';
                                            } else if (module.isEligible) {
                                                circleClass = 'bg-white border-2 border-yellow-500 text-yellow-500';
                                            }

                                            const circleContent = isCompleted
                                                ? <CheckCircle size={18} strokeWidth={2.5} />
                                                : isActive
                                                    ? <PlayCircle size={18} strokeWidth={2.5} />
                                                    : <span className="text-xs font-bold">{index + 1}</span>;

                                            let rightBadge;
                                            if (isCompleted) {
                                                rightBadge = (
                                                    <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-md flex items-center gap-1 border border-green-100">
                                                        Selesai <CheckCircle size={12} />
                                                    </span>
                                                );
                                            } else if (isActive) {
                                                rightBadge = (
                                                    <button
                                                        onClick={() => handleNavigateModule(module.id_module, true)}
                                                        className="text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md flex items-center gap-1 transition-colors border border-blue-100"
                                                    >
                                                        Lanjut <ChevronRight size={12} />
                                                    </button>
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
                                                    {!isLast && (
                                                        <div className={`absolute top-10 left-[19px] bottom-0 w-[2px] ${lineColor}`} />
                                                    )}
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0 transition-colors ${circleClass}`}>
                                                        {circleContent}
                                                    </div>
                                                    <div className="ml-4 flex-1 flex justify-between items-start pt-0.5">
                                                        <div className="pr-3">
                                                            <h4 className={`text-sm font-bold ${module.isEligible ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                {module.type === 'material' && module.kbNumber !== null
                                                                    ? `KB ${module.kbNumber}: ${module.title}`
                                                                    : module.title
                                                                }
                                                            </h4>
                                                            <p className="text-xs text-gray-400 mt-1 font-medium">
                                                                {MODULE_TYPE_LABEL[module.type]}
                                                            </p>
                                                        </div>
                                                        <div className="shrink-0 pt-0.5">
                                                            {rightBadge}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

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