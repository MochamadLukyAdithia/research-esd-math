// ─────────────────────────────────────────────────────────────────────────────
// File: resources/js/Components/LearningPath/MaterialView.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, FileText, Video, Code, BookOpen } from 'lucide-react';
import axios from 'axios';
import type { Material } from '@/Pages/LearningPath/Module';

interface Props {
    pathId: number;
    module: { id_module: number; title: string; materials?: Material[] };
    nextModule: { id_module: number; title: string } | null;
}

const CONTENT_TYPE_ICON: Record<string, React.ReactNode> = {
    slide:   <FileText size={15} />,
    video:   <Video size={15} />,
    example: <Code size={15} />,
    text:    <BookOpen size={15} />,
};

const CONTENT_TYPE_LABEL: Record<string, string> = {
    slide: 'Slide', video: 'Video', example: 'Contoh Soal', text: 'Materi',
};

export default function MaterialView({ pathId, module, nextModule }: Props) {
    const materials   = module.materials ?? [];
    const [current, setCurrent] = useState(0);
    const [marking,  setMarking] = useState(false);
    const [done,     setDone]    = useState(false);

    const mat = materials[current];

    const handleComplete = async () => {
        if (marking || done) return;
        setMarking(true);
        try {
            await axios.post(route('learning-path.module.complete-material', {
                pathId, moduleId: module.id_module,
            }));
            setDone(true);
        } finally {
            setMarking(false);
        }
    };

    const handleNext = async () => {
        if (!done) await handleComplete();
        if (nextModule) {
            router.visit(route('learning-path.module.show', { pathId, moduleId: nextModule.id_module }));
        }
    };

    if (!mat) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Tab navigasi materi */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
                {materials.map((m, i) => (
                    <button
                        key={m.id_material}
                        onClick={() => setCurrent(i)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                            i === current
                                ? 'bg-white shadow-sm text-primary'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {CONTENT_TYPE_ICON[m.content_type]}
                        {m.title || CONTENT_TYPE_LABEL[m.content_type]}
                    </button>
                ))}
            </div>

            {/* Konten materi */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 min-h-64">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-primary">{CONTENT_TYPE_ICON[mat.content_type]}</span>
                    <h2 className="text-base font-semibold text-gray-900">{mat.title}</h2>
                    <span className="ml-auto text-xs text-gray-400">{CONTENT_TYPE_LABEL[mat.content_type]}</span>
                </div>

                {/* Video embed */}
                {mat.content_type === 'video' && mat.file_url && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                        <iframe
                            src={mat.file_url}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}

                {/* Slide embed (iframe untuk Google Slides/PDF) */}
                {mat.content_type === 'slide' && mat.file_url && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                        <iframe src={mat.file_url} className="w-full h-full" />
                    </div>
                )}

                {/* HTML / teks konten */}
                {mat.content && (
                    <div
                        className="prose prose-sm max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: mat.content }}
                    />
                )}
            </div>

            {/* Navigasi */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setCurrent(i => Math.max(0, i - 1))}
                    disabled={current === 0}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={15} /> Sebelumnya
                </button>

                {current < materials.length - 1 ? (
                    <button
                        onClick={() => setCurrent(i => i + 1)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 transition-colors"
                    >
                        Materi Berikutnya <ChevronRight size={15} />
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        disabled={marking}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {marking ? 'Menyimpan...' : done ? `Lanjut: ${nextModule?.title}` : 'Tandai Selesai & Lanjut'}
                        <ChevronRight size={15} />
                    </button>
                )}
            </div>
        </div>
    );
}