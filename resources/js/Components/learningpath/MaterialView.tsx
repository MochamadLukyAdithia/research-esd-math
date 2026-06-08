// ─────────────────────────────────────────────────────────────────────────────
// File: resources/js/Components/LearningPath/MaterialView.tsx
// Redesign: mobile-first, high-contrast, ESD MathPath yellow brand
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    ChevronLeft, ChevronRight, FileText, Video,
    Code, BookOpen, CheckCircle, Maximize2, Minimize2,
    ArrowRight, Clock, Eye, Layers, ExternalLink, Check,
} from 'lucide-react';
import axios from 'axios';
import type { Material } from '@/Pages/LearningPath/Module';

interface Props {
    pathId: number;
    module: { id_module: number; title: string; materials?: Material[] };
    nextModule: { id_module: number; title: string } | null;
}

// ─── Konfigurasi tipe konten ──────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, {
    icon: React.ReactNode;
    label: string;
    accent: string;
    textColor: string;
}> = {
    slide: {
        icon: <Layers size={13} />,
        label: 'Slide',
        accent: '#F5C518',
        textColor: '#1a1a2e',
    },
    video: {
        icon: <Video size={13} />,
        label: 'Video',
        accent: '#ef4444',
        textColor: '#ffffff',
    },
    example: {
        icon: <Code size={13} />,
        label: 'Contoh Soal',
        accent: '#3b82f6',
        textColor: '#ffffff',
    },
    text: {
        icon: <BookOpen size={13} />,
        label: 'Materi',
        accent: '#10b981',
        textColor: '#ffffff',
    },
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ show }: { show: boolean }) {
    return (
        <div
            className={`fixed top-16 right-3 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 border transition-all duration-400 ${
                show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
            }`}
            style={{
                background: '#0f3460',
                borderColor: 'rgba(245,197,24,0.4)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
        >
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(245,197,24,0.15)' }}
            >
                <Check size={15} style={{ color: '#F5C518' }} />
            </div>
            <div>
                <p className="text-sm font-semibold text-white">Materi selesai!</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Progress tersimpan otomatis.</p>
            </div>
        </div>
    );
}

// ─── Thumbnail navigasi ───────────────────────────────────────────────────────

function MaterialThumbnail({
    mat, index, isCurrent, onClick,
}: {
    mat: Material; index: number; isCurrent: boolean; onClick: () => void;
}) {
    const cfg = TYPE_CONFIG[mat.content_type] ?? TYPE_CONFIG.text;
    return (
        <button
            onClick={onClick}
            className="relative flex-shrink-0 flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl border transition-all duration-200"
            style={{
                minWidth: 64,
                background: isCurrent ? `${cfg.accent}18` : 'rgba(255,255,255,0.04)',
                borderColor: isCurrent ? cfg.accent : 'rgba(255,255,255,0.1)',
                borderWidth: isCurrent ? '1.5px' : '1px',
            }}
        >
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                    background: isCurrent ? `${cfg.accent}28` : 'rgba(255,255,255,0.06)',
                    color: isCurrent ? cfg.accent : '#6b7280',
                }}
            >
                {cfg.icon}
            </div>
            <span
                className="text-[10px] font-medium leading-tight text-center max-w-[56px] truncate"
                style={{ color: isCurrent ? '#fff' : 'rgba(255,255,255,0.4)' }}
            >
                {mat.title || cfg.label}
            </span>
            <span style={{ fontSize: 9, color: isCurrent ? `${cfg.accent}80` : 'rgba(255,255,255,0.18)' }}>
                {index + 1}
            </span>
        </button>
    );
}

// ─── Text / Contoh Soal Viewer ────────────────────────────────────────────────

function TextViewer({ content, accent }: { content: string; accent: string }) {
    const [scrollPct, setScrollPct] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        const el = ref.current;
        if (!el) return;
        const pct = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
        setScrollPct(Math.min(pct, 1));
    };

    const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="relative h-full flex flex-col">
            {/* Reading progress */}
            <div className="absolute top-0 left-0 right-0 h-0.5 z-10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                    className="h-full transition-all duration-150 rounded-r-full"
                    style={{ width: `${scrollPct * 100}%`, background: accent }}
                />
            </div>

            {/* Meta */}
            <div
                className="flex items-center gap-4 px-4 pt-4 pb-3 border-b shrink-0"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <Clock size={11} />
                    ~{readMinutes} mnt baca
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <Eye size={11} />
                    {wordCount} kata
                </span>
            </div>

            {/* Content */}
            <div
                ref={ref}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}
            >
                <div
                    className="prose prose-invert prose-sm max-w-none
                        prose-headings:font-bold prose-headings:text-white
                        prose-p:text-gray-300 prose-p:leading-relaxed
                        prose-strong:text-white
                        prose-code:text-yellow-300 prose-code:bg-yellow-500/10
                        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-blockquote:border-l-2 prose-blockquote:pl-4
                        prose-blockquote:text-gray-400
                        prose-ul:text-gray-300 prose-ol:text-gray-300
                        prose-img:rounded-xl"
                    style={{ '--tw-prose-blockquote-border': accent } as React.CSSProperties}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
}

// ─── Embed Viewer (video / slide) ─────────────────────────────────────────────

function EmbedViewer({ url, type, accent }: { url: string; type: string; accent: string }) {
    const [loaded, setLoaded] = useState(false);

    const src = type === 'slide' && url.includes('drive.google.com')
        ? url.replace('/view', '/preview')
        : url;

    return (
        <div className="relative h-full flex items-center justify-center" style={{ background: '#000' }}>
            {!loaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10" style={{ background: '#0d1b2e' }}>
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
                        style={{ background: `${accent}22`, color: accent }}
                    >
                        {type === 'video' ? <Video size={28} /> : <Layers size={28} />}
                    </div>
                    <p className="text-sm animate-pulse" style={{ color: 'rgba(255,255,255,0.35)' }}>Memuat konten…</p>
                </div>
            )}
            <iframe
                src={src}
                className={`w-full h-full border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}

// ─── Nav Button (kiri / kanan) ────────────────────────────────────────────────

function NavArrow({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
                [dir === 'left' ? 'left' : 'right']: 10,
                background: 'rgba(0,0,0,0.55)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                color: '#fff',
                backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#F5C518';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,197,24,0.15)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.18)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.55)';
            }}
            aria-label={dir === 'left' ? 'Materi sebelumnya' : 'Materi berikutnya'}
        >
            {dir === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
    );
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function MaterialView({ pathId, module, nextModule }: Props) {
    const materials = module.materials ?? [];
    const [current,      setCurrent]      = useState(0);
    const [marking,      setMarking]      = useState(false);
    const [done,         setDone]         = useState(false);
    const [showToast,    setShowToast]    = useState(false);
    const [fullscreen,   setFullscreen]   = useState(false);
    const [transitioning,setTransitioning] = useState(false);

    const mat = materials[current];
    const cfg = mat ? (TYPE_CONFIG[mat.content_type] ?? TYPE_CONFIG.text) : TYPE_CONFIG.text;
    const isEmbed = mat?.content_type === 'video' || mat?.content_type === 'slide';
    const isLast  = current === materials.length - 1;

    // ── Keyboard navigation ───────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
            if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
            if (e.key === 'f' || e.key === 'F') setFullscreen(f => !f);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [current, materials.length]);

    const goTo = useCallback((idx: number) => {
        if (idx < 0 || idx >= materials.length || transitioning) return;
        setTransitioning(true);
        setTimeout(() => {
            setCurrent(idx);
            setTransitioning(false);
        }, 160);
    }, [materials.length, transitioning]);

    // ── Tandai selesai ────────────────────────────────────────────────────────
    const handleComplete = async () => {
        if (marking || done) return;
        setMarking(true);
        try {
            await axios.post(route('learningpath.module.complete-material', {
                pathId, moduleId: module.id_module,
            }));
            setDone(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3500);
        } finally {
            setMarking(false);
        }
    };

    const handleNext = async () => {
        if (!done) await handleComplete();
        if (nextModule) {
            router.visit(route('learningpath.module', { pathId, moduleId: nextModule.id_module }));
        }
    };

    if (!mat) return (
        <div className="h-full flex items-center justify-center text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <div className="flex flex-col items-center gap-3">
                <FileText size={36} style={{ opacity: 0.2 }} />
                <p>Tidak ada materi.</p>
            </div>
        </div>
    );

    return (
        <>
            <Toast show={showToast} />

            <div
                className={`flex flex-col transition-all duration-300 ${
                    fullscreen ? 'fixed inset-0 z-40' : 'h-full'
                }`}
                style={{ background: '#0d1b2e' }}
            >
                {/* ── Top bar ── */}
                <div
                    className="shrink-0 flex items-center gap-2.5 px-3 py-2.5"
                    style={{
                        background: '#16213e',
                        borderBottom: `2px solid ${cfg.accent}`,
                    }}
                >
                    {/* Badge tipe */}
                    <span
                        className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex-shrink-0"
                        style={{
                            background: cfg.accent,
                            color: cfg.textColor,
                            letterSpacing: '0.5px',
                        }}
                    >
                        {cfg.icon}
                        {cfg.label}
                    </span>

                    {/* Judul */}
                    <h2 className="flex-1 text-sm font-medium truncate text-white min-w-0">
                        {mat.title}
                    </h2>

                    {/* Counter */}
                    <span
                        className="text-[11px] px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: 'rgba(255,255,255,0.5)',
                        }}
                    >
                        {current + 1} / {materials.length}
                    </span>

                    {/* Fullscreen toggle */}
                    {isEmbed && (
                        <button
                            onClick={() => setFullscreen(f => !f)}
                            className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                            style={{ color: 'rgba(255,255,255,0.45)' }}
                            title={fullscreen ? 'Keluar fullscreen (F)' : 'Fullscreen (F)'}
                        >
                            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                        </button>
                    )}

                    {/* Buka tab baru */}
                    {mat.file_url && (
                        <a
                            href={mat.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                            style={{ color: 'rgba(255,255,255,0.45)' }}
                            title="Buka di tab baru"
                        >
                            <ExternalLink size={15} />
                        </a>
                    )}
                </div>

                {/* ── Progress bar ── */}
                <div className="h-1 shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                        className="h-full transition-all duration-500 rounded-r-full"
                        style={{
                            width: `${((current + 1) / materials.length) * 100}%`,
                            background: cfg.accent,
                        }}
                    />
                </div>

                {/* ── Area konten ── */}
                <div
                    className={`flex-1 min-h-0 relative transition-opacity duration-160 ${
                        transitioning ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                    {current > 0 && (
                        <NavArrow dir="left" onClick={() => goTo(current - 1)} />
                    )}
                    {current < materials.length - 1 && (
                        <NavArrow dir="right" onClick={() => goTo(current + 1)} />
                    )}

                    {isEmbed && mat.file_url && (
                        <EmbedViewer url={mat.file_url} type={mat.content_type} accent={cfg.accent} />
                    )}

                    {(mat.content_type === 'text' || mat.content_type === 'example') && mat.content && (
                        <TextViewer content={mat.content} accent={cfg.accent} />
                    )}

                    {!mat.file_url && !mat.content && (
                        <div className="h-full flex flex-col items-center justify-center gap-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            <FileText size={36} className="opacity-30" />
                            <p className="text-sm">Konten belum tersedia.</p>
                        </div>
                    )}
                </div>

                {/* ── Bottom panel ── */}
                <div
                    className="shrink-0 px-3 pt-2.5 pb-3"
                    style={{
                        background: '#16213e',
                        borderTop: '2px solid rgba(245,197,24,0.2)',
                    }}
                >
                    {/* Thumbnail strip */}
                    <div
                        className="flex gap-2 overflow-x-auto pb-2.5"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {materials.map((m, i) => (
                            <MaterialThumbnail
                                key={m.id_material}
                                mat={m}
                                index={i}
                                isCurrent={i === current}
                                onClick={() => goTo(i)}
                            />
                        ))}
                    </div>

                    {/* Tombol aksi */}
                    <div className="flex items-center gap-2">
                        {/* Tombol prev / next kecil — tetap ada di mobile */}
                        <button
                            onClick={() => goTo(current - 1)}
                            disabled={current === 0}
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-25"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                            }}
                            aria-label="Materi sebelumnya"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/* Tombol utama */}
                        {!isLast ? (
                            <button
                                onClick={() => goTo(current + 1)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                                style={{
                                    background: cfg.accent,
                                    color: cfg.textColor,
                                }}
                            >
                                Lanjut <ChevronRight size={15} />
                            </button>
                        ) : done ? (
                            <button
                                onClick={handleNext}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                                style={{ background: '#10b981' }}
                            >
                                <CheckCircle size={15} />
                                {nextModule ? `Lanjut: ${nextModule.title}` : 'Selesai'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={marking}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
                                style={{
                                    background: '#F5C518',
                                    color: '#1a1a2e',
                                }}
                            >
                                {marking ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                        Menyimpan…
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={15} />
                                        Tandai Selesai
                                    </>
                                )}
                            </button>
                        )}

                        <button
                            onClick={() => goTo(current + 1)}
                            disabled={isLast}
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-25"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                            }}
                            aria-label="Materi berikutnya"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Keyboard hint — hanya desktop */}
                    <p className="hidden md:block text-center mt-2" style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>
                        Gunakan ← → untuk berpindah ·{' '}
                        <kbd className="px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', fontSize: 9 }}>F</kbd>{' '}
                        untuk fullscreen
                    </p>
                </div>
            </div>

            {/* Overlay fullscreen non-embed */}
            {fullscreen && !isEmbed && (
                <div
                    className="fixed inset-0 z-39"
                    style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setFullscreen(false)}
                />
            )}
        </>
    );
}