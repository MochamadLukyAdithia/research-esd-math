<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_path_modules', function (Blueprint $table) {
            $table->id('id_module');
            $table->foreignId('id_learning_path')
                ->constrained('learning_paths', 'id_learning_path')
                ->cascadeOnDelete();
            $table->string('title');
            $table->enum('type', [
                'pre_test',     // Asesmen awal
                'material',     // Materi pembelajaran (slide, video, contoh soal)
                'activity',     // Aktivitas map-based ESD MathPath
                'post_test',    // Asesmen akhir
                'reflection',   // Refleksi pembelajaran
            ]);
            $table->integer('order_number')->default(0)->comment('Urutan modul dalam learning path');
            $table->boolean('is_required')->default(true)->comment('Wajib diselesaikan untuk lanjut ke modul berikutnya');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_path_modules');
    }
};