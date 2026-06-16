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
    AlertCircle,
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

// ─── Deteksi & normalisasi URL embed ─────────────────────────────────────────

export type EmbedPlatform =
    | 'local_pdf'
    | 'local_video'
    | 'local_file'
    | 'youtube'
    | 'vimeo'
    | 'canva'
    | 'gdrive'
    | 'gslides'
    | 'gdocs'
    | 'pdf'
    | 'generic';

function isLocalPath(url: string): boolean {
    if (!url) return false;
    if (!/^https?:\/\//i.test(url) && !url.startsWith('//')) return true;
    return false;
}

function toStorageUrl(path: string): string {
    if (path.startsWith('/storage/')) return path;
    if (path.startsWith('storage/'))  return '/' + path;
    return '/storage/' + path.replace(/^\//, '');
}

export function detectPlatform(url: string): EmbedPlatform {
    if (!url) return 'generic';

    if (isLocalPath(url)) {
        const u = url.toLowerCase();
        if (u.endsWith('.pdf') || u.includes('.pdf?'))                         return 'local_pdf';
        if (/\.(mp4|webm|ogg|mov|mkv|avi)(\?|$)/i.test(u))                   return 'local_video';
        return 'local_file';
    }

    const u = url.toLowerCase();
    if (u.includes('youtube.com') || u.includes('youtu.be'))                  return 'youtube';
    if (u.includes('vimeo.com'))                                               return 'vimeo';
    if (u.includes('canva.com'))                                               return 'canva';
    if (u.includes('docs.google.com/presentation'))                            return 'gslides';
    if (u.includes('docs.google.com/document'))                                return 'gdocs';
    if (u.includes('drive.google.com'))                                        return 'gdrive';
    if (u.endsWith('.pdf') || u.includes('.pdf?'))                             return 'pdf';
    return 'generic';
}

// ─── Ekstrak Google Drive File ID dari semua format URL ───────────────────────
//
//  Format yang didukung:
//  • https://drive.google.com/file/d/{ID}/view
//  • https://drive.google.com/file/d/{ID}/edit
//  • https://drive.google.com/file/d/{ID}/preview
//  • https://drive.google.com/file/u/0/d/{ID}/view   ← format /u/N/
//  • https://drive.google.com/file/u/0/d/{ID}/edit   ← format /u/N/ + edit
//  • https://drive.google.com/open?id={ID}
//  • https://drive.google.com/uc?id={ID}&export=view
//  • https://drive.google.com/uc?export=view&id={ID}

function extractGDriveFileId(url: string): string | null {
    // Format /file/d/{ID}/ — dengan atau tanpa /u/N/ di antaranya
    const fileMatch = url.match(/\/file(?:\/u\/\d+)?\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];

    // Format ?id={ID} (open?id= atau uc?id=)
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];

    return null;
}

export function normalizeEmbedUrl(url: string, type?: string): string {
    if (!url) return url;

    const platform = detectPlatform(url);

    // ── File lokal → /storage/... ─────────────────────────────────────────────
    if (platform === 'local_pdf' || platform === 'local_video' || platform === 'local_file') {
        return toStorageUrl(url);
    }

    // ── YouTube ───────────────────────────────────────────────────────────────
    if (platform === 'youtube') {
        let videoId = '';

        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        if (shortMatch) videoId = shortMatch[1];

        if (!videoId) {
            const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
            if (longMatch) videoId = longMatch[1];
        }

        if (!videoId) {
            const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
            if (embedMatch) videoId = embedMatch[1];
        }

        if (!videoId) {
            const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
            if (shortsMatch) videoId = shortsMatch[1];
        }

        if (videoId) {
            return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
        }
    }

    // ── Vimeo ─────────────────────────────────────────────────────────────────
    if (platform === 'vimeo') {
        const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&portrait=0`;
        }
    }

    // ── Canva ─────────────────────────────────────────────────────────────────
    if (platform === 'canva') {
        let normalized = url;
        if (!normalized.includes('/view')) {
            normalized = normalized.replace(/\/$/, '') + '/view';
        }
        if (!normalized.includes('?embed') && !normalized.includes('&embed')) {
            normalized += (normalized.includes('?') ? '&' : '?') + 'embed';
        }
        return normalized;
    }

    // ── Google Drive ──────────────────────────────────────────────────────────
    //  Selalu ekstrak File ID dan buat ulang URL preview yang bersih.
    //  Ini menghilangkan /u/0/, /edit, /view, query params aneh, dsb.
    //  URL preview publik: https://drive.google.com/file/d/{ID}/preview
    //  tidak memerlukan login jika file sudah di-share "Anyone with the link".
    if (platform === 'gdrive') {
        const fileId = extractGDriveFileId(url);
        if (fileId) {
            // Format preview — bersih, tanpa /u/N/, tanpa /edit
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
        // Fallback: jika gagal ekstrak ID, coba patch manual
        return url
            .replace(/\/u\/\d+\//, '/')          // hapus /u/0/
            .replace(/\/(edit|view)(\/.*)?$/, '/preview'); // ganti /edit atau /view → /preview
    }

    // ── Google Slides ─────────────────────────────────────────────────────────
    if (platform === 'gslides') {
        return url
            .replace(/\/u\/\d+\//, '/')
            .replace(/\/(edit|pub|present)(\/.*)?(\?.*)?$/, '/embed$3')
            .replace(/\/embed(\?.*)?$/, '/embed?start=false&loop=false&delayms=3000');
    }

    // ── Google Docs ───────────────────────────────────────────────────────────
    if (platform === 'gdocs') {
        return url
            .replace(/\/u\/\d+\//, '/')
            .replace(/\/(edit|pub)(\/.*)?(\?.*)?$/, '/preview');
    }

    // ── PDF publik eksternal → Google Docs Viewer ─────────────────────────────
    if (platform === 'pdf') {
        if (url.includes('docs.google.com/viewer')) return url;
        return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }

    // ── Fallback ──────────────────────────────────────────────────────────────
    return url;
}

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
        <div className="relative h-full flex flex-col" style={{ background: '#0d1b2e' }}>
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
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent', background: '#0d1b2e' }}
            >
                <style>{`
                    .text-viewer-content,
                    .text-viewer-content p,
                    .text-viewer-content span,
                    .text-viewer-content li,
                    .text-viewer-content td,
                    .text-viewer-content th,
                    .text-viewer-content div {
                        color: #e5e7eb !important;
                    }
                    .text-viewer-content h1,
                    .text-viewer-content h2,
                    .text-viewer-content h3,
                    .text-viewer-content h4,
                    .text-viewer-content h5,
                    .text-viewer-content h6 {
                        color: #ffffff !important;
                    }
                    .text-viewer-content strong,
                    .text-viewer-content b {
                        color: #ffffff !important;
                    }
                    .text-viewer-content a {
                        color: #60a5fa !important;
                    }
                    .text-viewer-content code,
                    .text-viewer-content pre {
                        color: #fde047 !important;
                        background: rgba(253,224,71,0.08) !important;
                    }
                    .text-viewer-content blockquote {
                        color: #9ca3af !important;
                        border-left-color: ${accent} !important;
                    }
                    .text-viewer-content img {
                        border-radius: 0.75rem;
                        max-width: 100%;
                    }
                    .text-viewer-content table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    .text-viewer-content td,
                    .text-viewer-content th {
                        border: 1px solid rgba(255,255,255,0.1) !important;
                        padding: 6px 10px;
                    }
                    .text-viewer-content th {
                        background: rgba(255,255,255,0.06) !important;
                        color: #ffffff !important;
                    }
                `}</style>
                <div
                    className="text-viewer-content prose prose-sm max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
}

// ─── Embed Viewer (video / slide) ─────────────────────────────────────────────

const PLATFORM_LABEL: Record<EmbedPlatform, string> = {
    local_pdf:   'PDF',
    local_video: 'Video',
    local_file:  'File',
    youtube:     'YouTube',
    vimeo:       'Vimeo',
    canva:       'Canva',
    gdrive:      'Google Drive',
    gslides:     'Google Slides',
    gdocs:       'Google Docs',
    pdf:         'PDF',
    generic:     'Konten',
};

// ── Loading Overlay ──────────────────────────────────────────────────────────
function LoadingOverlay({ label, accent, icon }: { label: string; accent: string; icon: React.ReactNode }) {
    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
            style={{ background: '#0d1b2e' }}
        >
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
                style={{ background: `${accent}22`, color: accent }}
            >
                {icon}
            </div>
            <p className="text-sm animate-pulse" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Memuat {label}…
            </p>
        </div>
    );
}

// ── Deteksi apakah URL Google Drive berasal dari mobile app (usp=drivesdk)
// atau belum di-share publik — keduanya menghasilkan 403 Forbidden
function isGDrivePrivateLink(url: string): boolean {
    return url.includes('usp=drivesdk') || url.includes('usp=sharing');
}

// ── Error Overlay ────────────────────────────────────────────────────────────
function ErrorOverlay({ url, accent, label }: { url: string; accent: string; label: string }) {
    const platform  = detectPlatform(url);
    const isGDrive  = platform === 'gdrive';
    const isMobile  = isGDrivePrivateLink(url);

    // Ekstrak file ID agar bisa buat link langsung ke sharing settings
    const fileId    = isGDrive
        ? url.match(/\/file(?:\/u\/\d+)?\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? null
        : null;
    const shareSettingsUrl = fileId
        ? `https://drive.google.com/file/d/${fileId}/view`
        : url;

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 px-5 text-center overflow-y-auto py-6"
            style={{ background: '#0d1b2e' }}
        >
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
            >
                <AlertCircle size={28} />
            </div>

            {isGDrive ? (
                /* ── Panduan khusus Google Drive ── */
                <div className="w-full max-w-sm">
                    <p className="text-sm font-semibold text-white mb-1">
                        File Google Drive tidak bisa diakses
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {isMobile
                            ? 'Link ini dibuat dari Google Drive mobile app dan bersifat private.'
                            : 'File belum di-share publik (403 Forbidden).'}
                    </p>

                    {/* Step-by-step fix */}
                    <div
                        className="rounded-xl p-3 mb-4 text-left"
                        style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.2)' }}
                    >
                        <p className="text-xs font-semibold mb-2" style={{ color: '#F5C518' }}>
                            Cara fix (wajib dilakukan admin):
                        </p>
                        {[
                            'Buka file di Google Drive',
                            'Klik kanan → "Share" (atau ikon gembok)',
                            'Klik "Change to anyone with the link"',
                            'Pastikan role = "Viewer"',
                            'Klik "Copy link" → paste ulang ke sistem',
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-2 mb-1">
                                <span
                                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
                                    style={{ background: 'rgba(245,197,24,0.25)', color: '#F5C518' }}
                                >
                                    {i + 1}
                                </span>
                                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{step}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <a
                            href={shareSettingsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                            style={{ background: '#F5C518', color: '#1a1a2e' }}
                        >
                            <ExternalLink size={12} />
                            Buka File
                        </a>
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
                        >
                            <ExternalLink size={12} />
                            URL Asli
                        </a>
                    </div>
                </div>
            ) : (
                /* ── Error generik untuk platform lain ── */
                <>
                    <div>
                        <p className="text-sm font-semibold text-white mb-1">
                            Konten tidak dapat ditampilkan
                        </p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {label} memblokir tampilan embed.
                        </p>
                    </div>
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ background: accent, color: '#1a1a2e' }}
                    >
                        <ExternalLink size={14} />
                        Buka di tab baru
                    </a>
                </>
            )}
        </div>
    );
}

// ── Warning banner untuk URL Google Drive yang terdeteksi private sebelum load ──
function GDrivePrivateWarning({ url, accent }: { url: string; accent: string }) {
    const fileId = url.match(/\/file(?:\/u\/\d+)?\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? null;
    const openUrl = fileId ? `https://drive.google.com/file/d/${fileId}/view` : url;

    return (
        <div
            className="absolute top-3 left-3 right-3 z-20 flex items-start gap-2 rounded-xl px-3 py-2.5"
            style={{
                background: 'rgba(234,179,8,0.12)',
                border: '1px solid rgba(234,179,8,0.35)',
            }}
        >
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#eab308' }} />
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: '#fde047' }}>
                    Link Google Drive private
                </p>
                <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    File perlu di-share "Anyone with the link" agar bisa tampil.
                </p>
            </div>
            <a
                href={openUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg"
                style={{ background: 'rgba(234,179,8,0.2)', color: '#fde047' }}
            >
                <ExternalLink size={10} />
                Fix
            </a>
        </div>
    );
}

function EmbedViewer({ url, type, accent }: { url: string; type: string; accent: string }) {
    const [loaded,  setLoaded]  = useState(false);
    const [errored, setErrored] = useState(false);

    const platform      = detectPlatform(url);
    const embedSrc      = normalizeEmbedUrl(url, type);
    const platformLabel = PLATFORM_LABEL[platform];
    const isLocal       = platform === 'local_pdf' || platform === 'local_video' || platform === 'local_file';
    const isLocalVideo  = platform === 'local_video';

    // Deteksi URL Google Drive private (usp=drivesdk) SEBELUM iframe gagal load
    const showGDriveWarning = platform === 'gdrive' && isGDrivePrivateLink(url) && !loaded && !errored;

    useEffect(() => {
        setLoaded(false);
        setErrored(false);
    }, [url]);

    const loadingIcon = type === 'video' ? <Video size={28} /> : <Layers size={28} />;

    return (
        <div className="relative h-full flex items-center justify-center" style={{ background: '#000' }}>

            {/* Warning banner — muncul segera jika URL Google Drive terdeteksi private */}
            {showGDriveWarning && (
                <GDrivePrivateWarning url={url} accent={accent} />
            )}

            {/* Loading */}
            {!loaded && !errored && (
                <LoadingOverlay label={platformLabel} accent={accent} icon={loadingIcon} />
            )}

            {/* Error */}
            {errored && (
                <ErrorOverlay url={url} accent={accent} label={platformLabel} />
            )}

            {/* ── Video lokal: pakai <video> tag ── */}
            {isLocalVideo && (
                <video
                    key={embedSrc}
                    src={embedSrc}
                    controls
                    className={`w-full h-full object-contain transition-opacity duration-500 ${
                        loaded && !errored ? 'opacity-100' : 'opacity-0'
                    }`}
                    onCanPlay={() => setLoaded(true)}
                    onError={() => setErrored(true)}
                    style={{ maxHeight: '100%' }}
                >
                    Browser kamu tidak mendukung pemutaran video.
                </video>
            )}

            {/* ── PDF lokal & semua embed eksternal: pakai <iframe> ── */}
            {!isLocalVideo && (
                <iframe
                    key={embedSrc}
                    src={embedSrc}
                    title="Konten materi"
                    className={`w-full h-full border-0 transition-opacity duration-500 ${
                        loaded && !errored ? 'opacity-100' : 'opacity-0'
                    }`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    onLoad={() => setLoaded(true)}
                    onError={() => setErrored(true)}
                    {...(!isLocal && {
                        sandbox: 'allow-scripts allow-same-origin allow-presentation allow-popups allow-forms',
                    })}
                />
            )}
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
    const [current,       setCurrent]       = useState(0);
    const [marking,       setMarking]       = useState(false);
    const [done,          setDone]          = useState(false);
    const [showToast,     setShowToast]     = useState(false);
    const [fullscreen,    setFullscreen]    = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    const mat = materials[current];
    const cfg = mat ? (TYPE_CONFIG[mat.content_type] ?? TYPE_CONFIG.text) : TYPE_CONFIG.text;
    const isEmbed = mat?.content_type === 'video' || mat?.content_type === 'slide';
    const isLast  = current === materials.length - 1;

    // ── Keyboard navigation ───────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
            if (e.key === 'Escape')                               setFullscreen(false);
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
            if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
            if (e.key === 'f' || e.key === 'F')                  setFullscreen(f => !f);
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
                    <button
                        onClick={() => setFullscreen(f => !f)}
                        className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                        style={{ color: 'rgba(255,255,255,0.45)' }}
                        title={fullscreen ? 'Keluar fullscreen (Esc / F)' : 'Fullscreen (F)'}
                    >
                        {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                    </button>

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
                        fullscreen ·{' '}
                        <kbd className="px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', fontSize: 9 }}>Esc</kbd>{' '}
                        keluar
                    </p>
                </div>
            </div>

            {/* Backdrop overlay saat fullscreen */}
            {fullscreen && (
                <div
                    className="fixed inset-0 z-[39]"
                    style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setFullscreen(false)}
                />
            )}
        </>
    );
}