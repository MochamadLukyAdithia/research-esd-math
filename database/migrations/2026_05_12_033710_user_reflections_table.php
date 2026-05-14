<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_reflections', function (Blueprint $table) {
            $table->id('id_reflection');
            $table->foreignId('id_user')
                ->constrained('users', 'id_user')
                ->cascadeOnDelete();
            $table->foreignId('id_module')
                ->constrained('learning_path_modules', 'id_module')
                ->cascadeOnDelete();

            // Pertanyaan refleksi sesuai brief (format survey pilih/klik, bukan essay)
            $table->text('understood_concepts')->nullable()->comment('Konsep yang sudah dipahami');
            $table->text('difficult_parts')->nullable()->comment('Bagian yang masih sulit');
            $table->text('most_helpful_activity')->nullable()->comment('Aktivitas yang paling membantu');
            $table->tinyInteger('rating')->nullable()->comment('Kesan pembelajaran kontekstual (1-5)');

            $table->boolean('is_synced')->default(true);
            $table->timestamps();

            $table->unique(['id_user', 'id_module']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_reflections');
    }
};