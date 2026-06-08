<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('learning_paths', function (Blueprint $table) {
            $table->text('capaian_pembelajaran')->nullable()
                ->after('description')
                ->comment('Capaian Pembelajaran / Kompetensi Dasar');

            $table->text('kompetensi_dasar')->nullable()
                ->after('capaian_pembelajaran')
                ->comment('Kompetensi Dasar detail, bisa diisi sebagai list');

            $table->text('metode_penilaian')->nullable()
                ->after('kompetensi_dasar')
                ->comment('JSON array, e.g. ["Pre-Test","Post-Test","Portofolio"]');

            $table->text('sumber_belajar')->nullable()
                ->after('metode_penilaian')
                ->comment('JSON array referensi, e.g. ["Buku Paket Kelas 7","Khan Academy"]');
        });
    }

    public function down(): void
    {
        Schema::table('learning_paths', function (Blueprint $table) {
            $table->dropColumn([
                'capaian_pembelajaran',
                'kompetensi_dasar',
                'metode_penilaian',
                'sumber_belajar',
            ]);
        });
    }
};