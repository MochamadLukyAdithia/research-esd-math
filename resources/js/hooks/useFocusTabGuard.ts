import { useEffect, useRef, useState, useCallback } from 'react';

interface UseTabFocusGuardOptions {
    /** Nonaktifkan deteksi, misal saat soal sudah disubmit/selesai */
    enabled?: boolean;
}

interface UseTabFocusGuardResult {
    /** Total berapa kali user keluar/pindah dari tab sejak tes dimulai */
    violationCount: number;
    /** True saat warning modal harus ditampilkan (baru saja terjadi 1 pelanggaran) */
    showWarning: boolean;
    /** Panggil saat user menutup/mengkonfirmasi modal warning */
    dismissWarning: () => void;
}

/**
 * Mendeteksi saat user pindah tab / minimize / pindah app lain selama tes
 * berlangsung, menggunakan Page Visibility API.
 *
 * Sengaja TIDAK memakai event `blur`/`focus` pada window karena event itu
 * terlalu sensitif (notifikasi sistem, klik dev tools, dsb bisa memicu
 * false positive). `visibilitychange` jauh lebih reliable, khususnya di
 * mobile, untuk mendeteksi user benar-benar berpindah dari halaman tes.
 *
 * Hook ini TIDAK melakukan auto-submit. Ia hanya menghitung pelanggaran
 * dan menampilkan warning — keputusan akhir (misal menilai kewajaran)
 * diserahkan ke guru/admin lewat data `violationCount` yang dikirim ke
 * backend saat submit.
 */
export function useTabFocusGuard({ enabled = true }: UseTabFocusGuardOptions = {}): UseTabFocusGuardResult {
    const [violationCount, setViolationCount] = useState(0);
    const [showWarning,    setShowWarning]     = useState(false);

    // Hindari menghitung visibilitychange pertama kali (mount) sebagai pelanggaran
    const hasMounted = useRef(false);

    useEffect(() => {
        hasMounted.current = true;
    }, []);

    const handleVisibilityChange = useCallback(() => {
        if (!enabled || !hasMounted.current) return;

        if (document.visibilityState === 'hidden') {
            setViolationCount(prev => prev + 1);
            setShowWarning(true);
        }
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled, handleVisibilityChange]);

    const dismissWarning = useCallback(() => {
        setShowWarning(false);
    }, []);

    return { violationCount, showWarning, dismissWarning };
}