/**
 * IndexedDB wrapper untuk ESD MathPath offline-first.
 * Menyimpan:
 * 1. sync_queue  — aksi offline (jawaban, progress, refleksi) yang antri dikirim ke server
 * 2. cache_data  — data halaman (soal, materi) yang di-cache manual untuk akses offline
 */


const DB_NAME    = 'mathpath-offline';
const DB_VERSION = 1;

// ─── Types ───────────────────────────────────────────────────────────────────

export type SyncAction =
    | 'answer_question'
    | 'complete_module'
    | 'complete_material'
    | 'submit_reflection';

export interface SyncQueueItem {
    id?: number;
    action_type: SyncAction;
    url: string;
    method: string;
    payload: Record<string, unknown>;
    status: 'pending' | 'synced' | 'failed';
    attempts: number;
    acted_at: string;    
    created_at: string;
}

export interface CacheDataItem {
    key: string;
    data: unknown;
    cached_at: string;
    expires_at?: string;
}

//  Open DB ─────────────────────────────────────────────────────────────────

let dbInstance: IDBDatabase | null = null;

export function openDB(): Promise<IDBDatabase> {
    if (dbInstance) return Promise.resolve(dbInstance);

    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;

            // Tabel antrian sync
            if (!db.objectStoreNames.contains('sync_queue')) {
                const store = db.createObjectStore('sync_queue', {
                    keyPath: 'id', autoIncrement: true,
                });
                store.createIndex('status',      'status',      { unique: false });
                store.createIndex('action_type', 'action_type', { unique: false });
                store.createIndex('acted_at',    'acted_at',    { unique: false });
            }

            // Tabel cache data (soal, materi, dll)
            if (!db.objectStoreNames.contains('cache_data')) {
                const store = db.createObjectStore('cache_data', { keyPath: 'key' });
                store.createIndex('cached_at', 'cached_at', { unique: false });
            }
        };

        req.onsuccess = (e) => {
            dbInstance = (e.target as IDBOpenDBRequest).result;
            resolve(dbInstance);    
        };
        req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
    });
}

// ═══════════════════════════════════════════════════════════════════════
//  SYNC QUEUE tambah, ambil, update status
// ═══════════════════════════════════════════════════════════════════════

export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'status' | 'attempts' | 'created_at'>): Promise<number> {
    const db    = await openDB();
    const entry: SyncQueueItem = {
        ...item,
        status: 'pending',
        attempts:   0,

        created_at: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
        const tx  = db.transaction('sync_queue', 'readwrite');
        const req = tx.objectStore('sync_queue').add(entry);
        req.onsuccess = () => resolve(req.result as number);
        req.onerror   = () => reject(req.error);
    });
}

export async function getPendingItems(): Promise<SyncQueueItem[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx    = db.transaction('sync_queue', 'readonly');
        const store = tx.objectStore('sync_queue');
        const idx   = store.index('status');
        const req   = idx.getAll('pending');
        req.onsuccess = () => resolve(req.result as SyncQueueItem[]);
        req.onerror   = () => reject(req.error);
    });
}

export async function getPendingCount(): Promise<number> {
    const pending = await getPendingItems();
    return pending.length;
}

export async function markItemSynced(id: number): Promise<void> {
    await updateItem(id, { status: 'synced' });
}

export async function markItemFailed(id: number): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx    = db.transaction('sync_queue', 'readwrite');
        const store = tx.objectStore('sync_queue');
        const getReq = store.get(id);
        getReq.onsuccess = () => {
            const item = getReq.result as SyncQueueItem;
            item.status   = 'failed';
            item.attempts = (item.attempts ?? 0) + 1;
            store.put(item);
            resolve();
        };
        getReq.onerror = () => reject(getReq.error);
    });
}

async function updateItem(id: number, patch: Partial<SyncQueueItem>): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx    = db.transaction('sync_queue', 'readwrite');
        const store = tx.objectStore('sync_queue');
        const getReq = store.get(id);
        getReq.onsuccess = () => {
            store.put({ ...getReq.result, ...patch });
            resolve();
        };
        getReq.onerror = () => reject(getReq.error);
    });
}

// ═══════════════════════════════════════════════════════════════════════
//  CACHE DATA simpan & ambil data halaman
// ═══════════════════════════════════════════════════════════════════════

export async function cacheData(key: string, data: unknown, ttlMinutes = 60 * 24): Promise<void> {
    const db  = await openDB();
    const now = new Date();
    const exp = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    const entry: CacheDataItem = {
        key,
        data,
        cached_at:  now.toISOString(),
        expires_at: exp.toISOString(),
    };

    return new Promise((resolve, reject) => {
        const tx  = db.transaction('cache_data', 'readwrite');
        const req = tx.objectStore('cache_data').put(entry);
        req.onsuccess = () => resolve();
        req.onerror   = () => reject(req.error);
    });
}

export async function getCachedData<T = unknown>(key: string): Promise<T | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx  = db.transaction('cache_data', 'readonly');
        const req = tx.objectStore('cache_data').get(key);
        req.onsuccess = () => {
            const entry = req.result as CacheDataItem | undefined;
            if (!entry) { resolve(null); return; }

            // Cek expired
            if (entry.expires_at && new Date(entry.expires_at) < new Date()) {
                resolve(null);
                return;
            }
            resolve(entry.data as T);
        };
        req.onerror = () => reject(req.error);
    });
}

export async function clearExpiredCache(): Promise<void> {
    const db  = await openDB();
    const now = new Date().toISOString();
    return new Promise((resolve, reject) => {
        const tx    = db.transaction('cache_data', 'readwrite');
        const store = tx.objectStore('cache_data');
        const req   = store.openCursor();
        req.onsuccess = (e) => {
            const cursor = (e.target as IDBRequest).result as IDBCursorWithValue | null;
            if (!cursor) { resolve(); return; }
            const entry = cursor.value as CacheDataItem;
            if (entry.expires_at && entry.expires_at < now) cursor.delete();
            cursor.continue();
        };
        req.onerror = () => reject(req.error);
    });
}