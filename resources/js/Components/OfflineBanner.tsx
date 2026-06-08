import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, CloudUpload } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';

interface Props {
    className?: string;
}

export default function OfflineBanner({ className = '' }: Props) {
    const { isOnline, pendingCount, isSyncing, lastSyncResult, triggerSync } = useOffline();
    const [justCameOnline, setJustCameOnline] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            setVisible(true);
            setJustCameOnline(false);
        } else {
            setJustCameOnline(true);
            setVisible(true);
            // Sembunyikan banner "kembali online" setelah 4 detik
            const t = setTimeout(() => {
                if (pendingCount === 0) setVisible(false);
            }, 4000);
            return () => clearTimeout(t);
        }
    }, [isOnline]);

    // Tetap tampil jika masih ada pending
    useEffect(() => {
        if (pendingCount > 0) setVisible(true);
        else if (isOnline && !isSyncing) {
            const t = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(t);
        }
    }, [pendingCount, isSyncing]);

    if (!visible) return null;

    // ── OFFLINE ──────────────────────────────────────────────────────────────
    if (!isOnline) {
        return (
            <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${className}`}>
                <div className="bg-gray-900 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <WifiOff size={15} className="text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">Mode Offline</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                            Kamu tetap bisa belajar. Jawaban dan progress disimpan di perangkat
                            dan akan dikirim otomatis saat online kembali.
                        </p>
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-1.5 mt-2">
                                <CloudUpload size={12} className="text-yellow-400" />
                                <span className="text-xs text-yellow-400 font-medium">
                                    {pendingCount} item menunggu sinkronisasi
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── SYNCING ───────────────────────────────────────────────────────────────
    if (isSyncing) {
        return (
            <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${className}`}>
                <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3">
                    <RefreshCw size={16} className="text-white animate-spin shrink-0" />
                    <div>
                        <p className="text-sm font-semibold">Menyinkronkan data...</p>
                        <p className="text-xs text-blue-200">Mengirim {pendingCount} item ke server.</p>
                    </div>
                </div>
            </div>
        );
    }

    // ── ONLINE + SYNC BERHASIL ────────────────────────────────────────────────
    if (justCameOnline && lastSyncResult) {
        const hasSuccess = lastSyncResult.success > 0;
        const hasFailed  = lastSyncResult.failed > 0;

        return (
            <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${className}`}>
                <div className={`text-white rounded-2xl px-4 py-3 shadow-2xl flex items-start gap-3 ${
                    hasFailed ? 'bg-orange-600' : 'bg-green-600'
                }`}>
                    <div className="shrink-0 mt-0.5">
                        {hasFailed
                            ? <AlertCircle size={18} className="text-white" />
                            : <CheckCircle size={18} className="text-white" />
                        }
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold">
                            {hasFailed ? 'Sinkronisasi sebagian berhasil' : 'Sinkronisasi selesai!'}
                        </p>
                        <p className="text-xs text-white/80 mt-0.5">
                            {hasSuccess && `${lastSyncResult.success} item berhasil dikirim. `}
                            {hasFailed  && `${lastSyncResult.failed} item gagal.`}
                        </p>
                        {hasFailed && (
                            <button
                                onClick={triggerSync}
                                className="text-xs underline mt-1 text-white/90 hover:text-white"
                            >
                                Coba lagi
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── KEMBALI ONLINE (tidak ada sync) ──────────────────────────────────────
    if (justCameOnline) {
        return (
            <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 ${className}`}>
                <div className="bg-green-600 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3">
                    <Wifi size={16} className="text-white shrink-0" />
                    <p className="text-sm font-semibold">Kembali online 👋</p>
                </div>
            </div>
        );
    }

    // ── PENDING ITEMS (online tapi ada antrian) ───────────────────────────────
    if (pendingCount > 0) {
        return (
            <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${className}`}>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                    <CloudUpload size={18} className="text-blue-500 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                            {pendingCount} item belum tersinkronisasi
                        </p>
                        <p className="text-xs text-gray-400">Data offline yang belum terkirim ke server.</p>
                    </div>
                    <button
                        onClick={triggerSync}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shrink-0"
                    >
                        Sync
                    </button>
                </div>
            </div>
        );
    }

    return null;
}