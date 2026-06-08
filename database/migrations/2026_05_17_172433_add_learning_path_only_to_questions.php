<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah flag is_learning_path_only ke tabel questions.
     * Soal dengan flag ini = true tidak akan tampil di portal utama.
     * Sekaligus buat kolom geo nullable karena soal LP tidak butuh lokasi.
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Flag utama: soal hanya untuk learning path tertentu
            $table->boolean('is_learning_path_only')
                ->default(false)
                ->after('correct_answer')
                ->comment('True = soal hanya dipakai di learning path, tidak tampil di portal soal');

            // Buat kolom geo nullable agar soal LP bisa dibuat tanpa data lokasi
            $table->string('location_name')->nullable()->change();
            $table->float('longitude')->nullable()->change();
            $table->float('latitude')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('is_learning_path_only');
            $table->string('location_name')->nullable(false)->change();
            $table->float('longitude')->nullable(false)->change();
            $table->float('latitude')->nullable(false)->change();
        });
    }
};                                                                                                                                                                                                                                                                                                                                              