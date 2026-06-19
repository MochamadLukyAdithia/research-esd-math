<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Struktur baru sesuai form refleksi diri ESDMathPath (dokumen Word).
     *
     * 4 pertanyaan, masing-masing dengan 3 pilihan:
     *   1 = Sudah mampu
     *   2 = Cukup mampu
     *   3 = Perlu dibimbing
     *
     * Kolom lama (understood_concepts, difficult_parts, most_helpful_activity, rating)
     * dihapus dan diganti kolom baru yang merepresentasikan 4 indikator literasi
     * digital & numerasi.
     */
    public function up(): void
    {
        Schema::table('user_reflections', function (Blueprint $table) {
            // ── Hapus kolom lama ──────────────────────────────────────────────
            $table->dropColumn([
                'understood_concepts',
                'difficult_parts',
                'most_helpful_activity',
                'rating',
            ]);

            // ── Tambah kolom baru (4 pertanyaan form refleksi diri) ───────────
            //
            // Nilai enum: 'sudah_mampu' | 'cukup_mampu' | 'perlu_dibimbing'
            // Kolom nullable agar tidak memaksa isian saat migrasi data lama.

            /**
             * Pertanyaan 1:
             * "Saya dapat menggunakan platform ESDMathPath dengan baik untuk
             *  membaca materi, mengikuti aktivitas, dan mengerjakan tugas matematika."
             */
            $table->enum('q1_platform_usage', ['sudah_mampu', 'cukup_mampu', 'perlu_dibimbing'])
                ->nullable()
                ->after('id_module')
                ->comment('P1: Kemampuan menggunakan platform ESDMathPath');

            /**
             * Pertanyaan 2:
             * "Saya dapat memahami informasi, data, gambar, tabel, atau grafik
             *  yang tersedia dalam platform ESDMathPath."
             */
            $table->enum('q2_data_comprehension', ['sudah_mampu', 'cukup_mampu', 'perlu_dibimbing'])
                ->nullable()
                ->after('q1_platform_usage')
                ->comment('P2: Kemampuan memahami informasi/data/grafik di platform');

            /**
             * Pertanyaan 3:
             * "Saya dapat menggunakan konsep matematika untuk menyelesaikan
             *  masalah yang berkaitan dengan kehidupan sehari-hari dan isu
             *  keberlanjutan."
             */
            $table->enum('q3_math_application', ['sudah_mampu', 'cukup_mampu', 'perlu_dibimbing'])
                ->nullable()
                ->after('q2_data_comprehension')
                ->comment('P3: Kemampuan menerapkan konsep matematika ke konteks nyata');

            /**
             * Pertanyaan 4:
             * "Saya dapat menjelaskan alasan atau langkah penyelesaian matematika
             *  berdasarkan data atau informasi yang saya peroleh dari platform
             *  ESDMathPath."
             */
            $table->enum('q4_reasoning', ['sudah_mampu', 'cukup_mampu', 'perlu_dibimbing'])
                ->nullable()
                ->after('q3_math_application')
                ->comment('P4: Kemampuan menjelaskan alasan/langkah penyelesaian matematika');
        });
    }

    public function down(): void
    {
        Schema::table('user_reflections', function (Blueprint $table) {
            // Hapus kolom baru
            $table->dropColumn([
                'q1_platform_usage',
                'q2_data_comprehension',
                'q3_math_application',
                'q4_reasoning',
            ]);

            // Kembalikan kolom lama
            $table->text('understood_concepts')->nullable()->comment('Konsep yang sudah dipahami');
            $table->text('difficult_parts')->nullable()->comment('Bagian yang masih sulit');
            $table->text('most_helpful_activity')->nullable()->comment('Aktivitas yang paling membantu');
            $table->tinyInteger('rating')->nullable()->comment('Kesan pembelajaran kontekstual (1-5)');
        });
    }
};