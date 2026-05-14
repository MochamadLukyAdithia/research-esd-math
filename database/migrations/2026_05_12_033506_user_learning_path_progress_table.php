<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_learning_path_progress', function (Blueprint $table) {
            $table->id('id_progress');
            $table->foreignId('id_user')
                ->constrained('users', 'id_user')
                ->cascadeOnDelete();
            $table->foreignId('id_learning_path')
                ->constrained('learning_paths', 'id_learning_path')
                ->cascadeOnDelete();

            // Skor pre-test dan post-test untuk perbandingan peningkatan kompetensi
            $table->integer('pre_test_score')->nullable()->comment('Skor pre-test (0-100)');
            $table->integer('post_test_score')->nullable()->comment('Skor post-test (0-100)');

            // Progress tracking
            $table->tinyInteger('progress_percentage')->default(0)->comment('Persentase modul yang sudah selesai (0-100)');
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');

            // Timestamps aktivitas
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            // Offline-first: waktu terakhir data disinkronkan ke server
            $table->timestamp('synced_at')->nullable()->comment('Waktu terakhir progress disinkronkan dari offline ke server');

            $table->timestamps();

            $table->unique(['id_user', 'id_learning_path']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_learning_path_progress');
    }
};