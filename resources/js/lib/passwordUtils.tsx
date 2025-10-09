import React from 'react';

/**
 * Menghitung kekuatan password berdasarkan beberapa kriteria.
 * @param password - String password yang akan dihitung.
 * @returns Object berisi skor (1-5) dan label kekuatan.
 */
export const calculatePasswordStrength = (password: string): { score: number; label: string } => {
    if (!password) return { score: 0, label: '' };

    // Menghitung berapa banyak kriteria yang terpenuhi
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password),
    };
    const passedChecks = Object.values(checks).filter(Boolean).length;

    // Menentukan label dan skor berdasarkan jumlah kriteria yang lolos
    const strength = {
        0: { score: 0, label: '' }, // Tidak menampilkan bar jika kosong
        1: { score: 1, label: 'Sangat Lemah' },
        2: { score: 2, label: 'Lemah' },
        3: { score: 3, label: 'Sedang' },
        4: { score: 4, label: 'Kuat' },
        5: { score: 5, label: 'Sangat Kuat' },
    };

    return strength[passedChecks as keyof typeof strength];
};

/**
 * Komponen React untuk menampilkan bar kekuatan password.
 */
export const PasswordStrengthMeter = ({ score, label }: { score: number; label: string }) => {
    // Jangan tampilkan komponen jika password kosong atau sangat lemah
    if (!score || score < 2) return null;

    // Definisikan warna untuk setiap level kekuatan, disesuaikan dengan tema
    const levelStyles = {
        2: { barColor: 'bg-red-500', textColor: 'text-red-500' },          // Lemah
        3: { barColor: 'bg-primary', textColor: 'text-primary' },          // Sedang (menggunakan warna tema)
        4: { barColor: 'bg-green-500', textColor: 'text-green-500' },      // Kuat
        5: { barColor: 'bg-green-600', textColor: 'text-green-600' },      // Sangat Kuat
    };

    const currentStyle = levelStyles[score as keyof typeof levelStyles] || { barColor: 'bg-secondary/20', textColor: 'text-secondary-light' };
    const widthPercentage = (score / 5) * 100;

    return (
        <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
                {/* UPDATED: Menggunakan warna tema untuk label statis */}
                <span className="text-secondary-light">Kekuatan Password:</span>
                {/* UPDATED: Menggunakan warna dinamis yang sesuai tema */}
                <span className={`font-medium ${currentStyle.textColor}`}>{label}</span>
            </div>
            {/* UPDATED: Menggunakan warna tema untuk background bar */}
            <div className="w-full bg-secondary/10 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${currentStyle.barColor}`}
                    style={{ width: `${widthPercentage}%` }}
                />
            </div>
        </div>
    );
};
