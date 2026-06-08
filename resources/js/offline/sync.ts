/**
 * Sync manager — mengirim antrian offline ke server saat kembali online.
 * Dipanggil dari:
 * 1. Event 'online' di browser
 * 2. Background Sync via Service Worker
 * 3. Manual trigger dari UI
 */

import axios from 'axios';
import {
    getPendingItems,
    markItemSynced,
    markItemFailed,
    type SyncQueueItem,
} from './db';

export type SyncResult = {
    success: number;
    failed:  number;
    skipped: number;
};

type SyncEventCallback = (result: SyncResult) => void;
const listeners: SyncEventCallback[] = [];

export function onSyncComplete(cb: SyncEventCallback) {
    listeners.push(cb);
}

// ─── Main sync function ───────────────────────────────────────────────────────

export async function syncOfflineQueue(): Promise<SyncResult> {
    const pending = await getPendingItems();
    const result: SyncResult = { success: 0, failed: 0, skipped: 0 };

    if (pending.length === 0) return result;

    // Urutkan berdasarkan acted_at (kronologis)
    const sorted = [...pending].sort(
        (a, b) => new Date(a.acted_at).getTime() - new Date(b.acted_at).getTime()
    );

    for (const item of sorted) {
        if (item.attempts >= 5) {
            result.skipped++;
            continue;
        }

        try {
            await sendItem(item);
            await markItemSynced(item.id!);
            result.success++;
        } catch (err: any) {
            // Jika 401/403 → tidak perlu retry (auth issue)
            if (err.response?.status === 401 || err.response?.status === 403) {
                await markItemFailed(item.id!);
                result.failed++;
            } else if (err.response?.status === 422) {
                // Validasi gagal → data tidak valid, tandai failed
                await markItemFailed(item.id!);
                result.failed++;
            } else {
                // Network error → biarkan pending untuk retry
                result.failed++;
            }
        }
    }

    // Beritahu semua listener
    listeners.forEach(cb => cb(result));

    // Trigger Background Sync untuk percobaan berikutnya jika ada yang gagal
    if (result.failed > 0 && 'serviceWorker' in navigator) {
        try {
            const reg = await navigator.serviceWorker.ready;
            await (reg as any).sync?.register('sync-offline-queue');
        } catch { /* Background Sync tidak tersedia */ }
    }

    return result;
}

async function sendItem(item: SyncQueueItem): Promise<void> {
    const response = await axios({
        method: item.method,
        url:    item.url,
        data:   item.payload,
        headers: {
            'X-Offline-Sync': '1',
            'X-Acted-At':     item.acted_at,
        },
    });

    if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP ${response.status}`);
    }
}

// ─── Auto-sync saat online ────────────────────────────────────────────────────

let syncScheduled = false;

export function initAutoSync() {
    window.addEventListener('online', async () => {
        if (syncScheduled) return;
        syncScheduled = true;

        // Tunggu sebentar agar koneksi stabil
        await new Promise(r => setTimeout(r, 1500));
        await syncOfflineQueue();
        syncScheduled = false;
    });

    // Jika sudah online saat pertama load, sync langsung
    if (navigator.onLine) {
        setTimeout(() => syncOfflineQueue(), 2000);
    }
}

// ─── Register Background Sync ─────────────────────────────────────────────────

export async function registerBackgroundSync() {
    if (!('serviceWorker' in navigator)) return;
    try {
        const reg = await navigator.serviceWorker.ready;
        await (reg as any).sync?.register('sync-offline-queue');
    } catch {
        // Background Sync API tidak tersedia di browser ini
    }
}