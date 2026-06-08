<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambahkan order_number ke learning_paths agar modul bisa
     * diurutkan dalam satu kelas (grade).
     * Modul dengan order_number lebih kecil harus diselesaikan lebih dulu.
     */
    public function up(): void
    {
        Schema::table('learning_paths', function (Blueprint $table) {
            $table->integer('order_number')->default(1)->after('grade')
                ->comment('Urutan modul dalam satu kelas. Harus selesai urutan sebelumnya.');
        });
    }

    public function down(): void
    {
        Schema::table('learning_paths', function (Blueprint $table) {
            $table->dropColumn('order_number');
        });
    }
};