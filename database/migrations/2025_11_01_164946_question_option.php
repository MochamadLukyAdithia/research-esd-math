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
        Schema::create('question_options', function (Blueprint $table) {
            $table->id('id_question_option');
            $table->foreignId('id_question')
                  ->constrained('questions', 'id_question')
                  ->onDelete('cascade'); 
            $table->text('option_text'); 
            $table->boolean('is_correct')->default(false); 
            $table->timestamps();

            // Indexes
            $table->index('id_question');
            $table->index('is_correct');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_options');
    }
};
