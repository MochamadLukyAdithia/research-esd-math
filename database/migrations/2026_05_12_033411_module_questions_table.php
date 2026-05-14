<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Pivot table yang menghubungkan modul (pre_test / post_test / activity)
     * dengan soal-soal yang sudah ada di tabel questions.
     * Satu soal bisa dipakai di banyak modul.
     */
    public function up(): void
    {
        Schema::create('module_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_module')
                ->constrained('learning_path_modules', 'id_module')
                ->cascadeOnDelete();
            $table->foreignId('id_question')
                ->constrained('questions', 'id_question')
                ->cascadeOnDelete();
            $table->integer('order_number')->default(0);
            $table->timestamps();

            $table->unique(['id_module', 'id_question']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_questions');
    }
};