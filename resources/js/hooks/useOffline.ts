import { useState, useEffect, useCallback, useRef } from 'react';
import { addToSyncQueue, getPendingCount, type SyncAction } from '@/offline/db';
import { syncOfflineQueue, onSyncComplete, type SyncResult } from '@/offline/sync';

// ─── Types ───────────────────────────────────────────────────────────────────

interface UseOfflineReturn {
    isOnline:       boolean;
    pendingCount:   number;
    isSyncing:      boolean;
    lastSyncResult: SyncResult | null;
    /** Kirim request, otomatis di-queue jika offline */
    sendOrQueue:    (params: SendOrQueueParams) => Promise<SendOrQueueResult>;
    /** Trigger sync manual */
    triggerSync:    () => Promise<void>;
}

interface SendOrQueueParams {
    action_type: SyncAction;
    url:         string;
    method?:     string;
    payload:     Record<string, unknown>;
    /** Callback saat berhasil terkirim ke server (online maupun setelah sync) */
    onSuccess?:  (data: unknown) => void;
    /** Callback saat di-queue (offline) */
    onQueued?:   () => void;
}

interface SendOrQueueResult {
    sent:   boolean;   // true = langsung ke server, false = di-queue
    data?:  unknown;   // response dari server (jika sent)
    queueId?: number;  // ID di IndexedDB (jika queued)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOffline(): UseOfflineReturn {
    const [isOnline,       setIsOnline]       = useState(navigator.onLine);
    const [pendingCount,   setPendingCount]   = useState(0);
    const [isSyncing,      setIsSyncing]      = useState(false);
    const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
    const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Monitor online/offline ────────────────────────────────────────────────

    useEffect(() => {
        const handleOnline  = () => { setIsOnline(true);  scheduleSyncDebounced(); };
        const handleOffline = () => { setIsOnline(false); };

        window.addEventListener('online',  handleOnline);
        window.addEventListener('offline', handleOffline);

        // Refresh pending count setiap 10 detik
        const interval = setInterval(refreshPendingCount, 10_000);
        refreshPendingCount();

        // Listen notif dari Service Worker saat sync berhasil
        navigator.serviceWorker?.addEventListener('message', handleSWMessage);

        // Register callback saat sync selesai dari initAutoSync
        onSyncComplete(result => {
            setLastSyncResult(result);
            setIsSyncing(false);
            refreshPendingCount();
        });

        return () => {
            window.removeEventListener('online',  handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
            navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
        };
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────

    async function refreshPendingCount() {
        const count = await getPendingCount();
        setPendingCount(count);
    }

    function handleSWMessage(event: MessageEvent) {
        if (event.data?.type === 'SYNC_SUCCESS') {
            refreshPendingCount();
        }
    }

    function scheduleSyncDebounced() {
        if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
        syncTimerRef.current = setTimeout(() => triggerSync(), 1500);
    }

    // ── sendOrQueue ───────────────────────────────────────────────────────────

    const sendOrQueue = useCallback(async (params: SendOrQueueParams): Promise<SendOrQueueResult> => {
        const { action_type, url, method = 'POST', payload, onSuccess, onQueued } = params;

        // ONLINE → kirim langsung ke server
        if (navigator.onLine) {
            try {
                const { default: axios } = await import('axios');
                const response = await axios({ method, url, data: payload });
                onSuccess?.(response.data);
                return { sent: true, data: response.data };
            } catch (err: any) {
                // Jika network error (bukan HTTP error), fallback ke queue
                if (!err.response) {
                    return queueItem({ action_type, url, method, payload, onQueued });
                }
                throw err; // HTTP error (4xx/5xx) → lempar ke caller
            }
        }

        // OFFLINE → masukkan ke antrian
        return queueItem({ action_type, url, method, payload, onQueued });
    }, []);

    async function queueItem(params: Omit<SendOrQueueParams, 'onSuccess'> & { onQueued?: () => void }): Promise<SendOrQueueResult> {
        const queueId = await addToSyncQueue({
            action_type: params.action_type,
            url:         params.url,
            method:      params.method ?? 'POST',
            payload:     params.payload,
            acted_at:    new Date().toISOString(),
        });
        await refreshPendingCount();
        params.onQueued?.();
        return { sent: false, queueId };
    }

    // ── triggerSync ───────────────────────────────────────────────────────────

    const triggerSync = useCallback(async () => {
        if (!navigator.onLine || isSyncing) return;
        setIsSyncing(true);
        try {
            const result = await syncOfflineQueue();
            setLastSyncResult(result);
            await refreshPendingCount();
        } finally {
            setIsSyncing(false);
        }
    }, [isSyncing]);

    return { isOnline, pendingCount, isSyncing, lastSyncResult, sendOrQueue, triggerSync };
}