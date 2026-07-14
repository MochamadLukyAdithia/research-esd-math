import '../css/app.css';
import './bootstrap';
import 'mapbox-gl/dist/mapbox-gl.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import './i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// ─── 1. Import ────────────────────────────────────────────────────────────────
// Tambahkan baris ini di atas file app.tsx yang sudah ada:
 
import { initAutoSync } from '@/offline/sync';
 
// ─── 2. Register Service Worker ───────────────────────────────────────────────
// Tambahkan setelah semua import, sebelum createInertiaApp:
 
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then(reg => {
                console.log('[SW] Registered:', reg.scope);
            })
            .catch(err => {
                console.warn('[SW] Registration failed:', err);
            });
    });
}
 
// ─── 3. Init auto-sync ────────────────────────────────────────────────────────
// Jalankan setelah SW terdaftar:
initAutoSync();


createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
