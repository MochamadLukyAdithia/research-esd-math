/**
 * ESD MathPath Service Worker
 * Strategi:
 * - App shell (HTML/JS/CSS): Cache First → fallback network
 * - API GET (learning path, modul, soal): Network First → fallback cache
 * - Gambar & file materi: Cache First → lazy cache saat online
 * - API POST (jawaban, refleksi): Queue ke IndexedDB saat offline → sync saat online
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE   = `mathpath-shell-${CACHE_VERSION}`;
const DATA_CACHE    = `mathpath-data-${CACHE_VERSION}`;
const MEDIA_CACHE   = `mathpath-media-${CACHE_VERSION}`;

// File yang di-cache saat install (app shell)
const SHELL_URLS = [
    '/',
    '/learning-path',
    '/offline.html',
];

// Prefix URL yang dianggap API data (di-cache tapi network first)
const DATA_API_PREFIXES = [
    '/learning-path',
    '/learningpath',
];

// Prefix URL yang tidak boleh di-cache (mutasi data)
const NEVER_CACHE = [
    '/learningpath/',      // POST routes (start, submit, dll)
    '/portal/questions',
    '/livewire',
];

// ─── Install ─────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_URLS))
    );
    self.skipWaiting();
});

// ─── Activate ────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => ![SHELL_CACHE, DATA_CACHE, MEDIA_CACHE].includes(k))
                    .map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// ─── Fetch ───────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Abaikan request non-GET yang bukan sync (POST/PUT/DELETE langsung ke network)
    if (request.method !== 'GET') {
        event.respondWith(networkOnly(request));
        return;
    }

    // Abaikan chrome-extension dan websocket
    if (!url.protocol.startsWith('http')) return;

    // Gambar & file materi → Cache First
    if (isMediaRequest(url)) {
        event.respondWith(cacheFirst(request, MEDIA_CACHE));
        return;
    }

    // JS/CSS/Font (assets Vite) → Cache First (hash di URL, aman di-cache lama)
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request, SHELL_CACHE));
        return;
    }

    // API data GET → Network First dengan fallback cache
    if (isDataRequest(url)) {
        event.respondWith(networkFirst(request, DATA_CACHE));
        return;
    }

    // Navigasi halaman (HTML) → Network First, fallback ke cache, lalu offline.html
    if (request.mode === 'navigate') {
        event.respondWith(navigationHandler(request));
        return;
    }

    // Default: network first
    event.respondWith(networkFirst(request, DATA_CACHE));
});

// ─── Background Sync ─────────────────────────────────────────────────────────

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-offline-queue') {
        event.waitUntil(syncOfflineQueue());
    }
});

// ─── Push Notification (opsional) ────────────────────────────────────────────

self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {};
    event.waitUntil(
        self.registration.showNotification(data.title ?? 'ESD MathPath', {
            body: data.body ?? '',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: 'mathpath-notif',
        })
    );
});

// ═══════════════════════════════════════════════════════════════════════
//  STRATEGI CACHE
// ═══════════════════════════════════════════════════════════════════════

async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Konten tidak tersedia secara offline.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}

async function networkFirst(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response(JSON.stringify({ offline: true, error: 'Tidak ada koneksi internet' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function networkOnly(request) {
    try {
        return await fetch(request);
    } catch {
        return new Response(JSON.stringify({ offline: true, error: 'Tidak ada koneksi internet' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function navigationHandler(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DATA_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        // Coba dari cache dulu
        const cached = await caches.match(request);
        if (cached) return cached;

        // Fallback ke halaman offline
        const offlinePage = await caches.match('/offline.html');
        return offlinePage ?? new Response('<h1>Offline</h1>', {
            headers: { 'Content-Type': 'text/html' },
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SYNC OFFLINE QUEUE
// ═══════════════════════════════════════════════════════════════════════

async function syncOfflineQueue() {
    const db      = await openDB();
    const pending = await getAllPending(db);

    for (const item of pending) {
        try {
            const response = await fetch(item.url, {
                method:  item.method,
                headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                body:    JSON.stringify(item.payload),
            });

            if (response.ok) {
                await deleteItem(db, item.id);
                // Beritahu semua tab bahwa sync berhasil
                const clients = await self.clients.matchAll();
                clients.forEach(c => c.postMessage({ type: 'SYNC_SUCCESS', item }));
            } else {
                await markFailed(db, item.id);
            }
        } catch {
            // Masih offline, coba lagi nanti
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  INDEXEDDB HELPERS (di Service Worker)
// ═══════════════════════════════════════════════════════════════════════

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('mathpath-offline', 1);
        req.onupgradeneeded = (e) => {
            const db    = e.target.result;
            if (!db.objectStoreNames.contains('sync_queue')) {
                const store = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
                store.createIndex('status', 'status', { unique: false });
            }
            if (!db.objectStoreNames.contains('cache_data')) {
                db.createObjectStore('cache_data', { keyPath: 'key' });
            }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror   = (e) => reject(e.target.error);
    });
}

function getAllPending(db) {
    return new Promise((resolve, reject) => {
        const tx    = db.transaction('sync_queue', 'readonly');
        const store = tx.objectStore('sync_queue');
        const idx   = store.index('status');
        const req   = idx.getAll('pending');
        req.onsuccess = () => resolve(req.result);
        req.onerror   = () => reject(req.error);
    });
}

function deleteItem(db, id) {
    return new Promise((resolve, reject) => {
        const tx  = db.transaction('sync_queue', 'readwrite');
        const req = tx.objectStore('sync_queue').delete(id);
        req.onsuccess = () => resolve();
        req.onerror   = () => reject(req.error);
    });
}

function markFailed(db, id) {
    return new Promise((resolve, reject) => {
        const tx    = db.transaction('sync_queue', 'readwrite');
        const store = tx.objectStore('sync_queue');
        const getReq = store.get(id);
        getReq.onsuccess = () => {
            const item = getReq.result;
            item.status   = 'failed';
            item.attempts = (item.attempts ?? 0) + 1;
            store.put(item);
            resolve();
        };
        getReq.onerror = () => reject(getReq.error);
    });
}

// ═══════════════════════════════════════════════════════════════════════
//  URL CLASSIFIERS
// ═══════════════════════════════════════════════════════════════════════

function isMediaRequest(url) {
    return /\.(png|jpg|jpeg|webp|gif|svg|mp4|webm|pdf|pptx?)$/i.test(url.pathname)
        || url.pathname.startsWith('/storage/');
}

function isStaticAsset(url) {
    return url.pathname.startsWith('/build/')
        || /\.(js|css|woff2?|ttf|eot)$/i.test(url.pathname);
}

function isDataRequest(url) {
    return DATA_API_PREFIXES.some(p => url.pathname.startsWith(p));
}