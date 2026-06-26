import { AlertTriangle } from 'lucide-react';

interface TabFocusWarningModalProps {
    violationCount: number;
    onClose: () => void;
}

/**
 * Modal peringatan saat user terdeteksi keluar/pindah dari tab tes.
 * Gaya visual mengikuti card-card lain di PreTestView (rounded-2xl,
 * border tipis, warna primary) supaya konsisten, tapi pakai warna
 * orange/red untuk menandakan ini adalah peringatan.
 */
export default function TabFocusWarningModal({ violationCount, onClose }: TabFocusWarningModalProps) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-red-200 shadow-lg max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={26} className="text-red-500" />
                </div>

                <h2 className="text-base font-bold text-gray-900 mb-1">
                    Terdeteksi Keluar dari Halaman Tes
                </h2>

                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    Selama tes berlangsung, jangan berpindah tab, aplikasi, atau membuka jendela lain.
                    Aktivitas ini tercatat dan akan terlihat oleh guru.
                </p>

                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-full px-3 py-1.5 mb-5">
                    Peringatan ke-{violationCount}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors active:scale-[.98]"
                >
                    Saya Mengerti, Lanjutkan Tes
                </button>
            </div>
        </div>
    );
}