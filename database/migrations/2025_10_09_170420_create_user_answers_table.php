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
        Schema::disableForeignKeyConstraints();

        Schema::create('user_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_question')->constrained(table: 'questions', column: 'id_question');
            $table->foreignId('id_user')->constrained(table: 'users', column: 'id_user');
            $table->text('answer');
            $table->boolean('is_correct')->default(false);
            $table->timestamp('answered_at')->useCurrent();
            $table->timestamps();

            // Indexes
            $table->index('id_user');
            $table->index('id_question');
            $table->index('is_correct');
            $table->index('answered_at');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_answers');
    }
};
