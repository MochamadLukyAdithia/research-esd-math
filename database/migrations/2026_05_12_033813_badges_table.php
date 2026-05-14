<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id('id_badge');
            $table->string('name');
            $table->text('description');
            $table->string('image_path')->nullable();

            // Logika pemberian badge
            // Contoh criteria_type: 'complete_path', 'score_above', 'streak_days'
            $table->string('criteria_type')->comment('Jenis kriteria untuk mendapatkan badge');
            $table->integer('criteria_value')->default(0)->comment('Nilai ambang batas kriteria');

            $table->timestamps();
        });

        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')
                ->constrained('users', 'id_user')
                ->cascadeOnDelete();
            $table->foreignId('id_badge')
                ->constrained('badges', 'id_badge')
                ->cascadeOnDelete();
            $table->timestamp('earned_at')->useCurrent();
            $table->timestamps();

            $table->unique(['id_user', 'id_badge']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_badges');
        Schema::dropIfExists('badges');
    }
};