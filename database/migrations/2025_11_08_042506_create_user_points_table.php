<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_points', function (Blueprint $table) {
            $table->id('id_user_point');
            $table->foreignId('id_user')
                  ->constrained('users', 'id_user')
                  ->onDelete('cascade');
            $table->foreignId('id_question')
                  ->constrained('questions', 'id_question')
                  ->onDelete('cascade');
            $table->integer('points_earned')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('id_user');
            $table->index('id_question');
            $table->index(['id_user', 'id_question']); // Composite index
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_points');
    }
};
