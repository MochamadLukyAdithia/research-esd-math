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

        Schema::create('questions', function (Blueprint $table) {
            $table->id('id_question');
            $table->text('title');
            $table->string('question');
            $table->string('location_name');
            $table->float('longitude');
            $table->float('latitude');
            $table->integer('grade');
            $table->text('question_image')->nullable();
            $table->foreignId('id_user')->constrained(table: 'users', column: 'id_user');
            $table->text('correct_answer')->nullable();
            $table->foreignId('id_question_type')
                  ->constrained('question_types', 'id_question_type')
                  ->onDelete('cascade');
            $table->timestamps();

            // Indexes
            $table->index('id_user');
            $table->index('id_question_type');
            $table->index('grade');
            $table->index('created_at');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
