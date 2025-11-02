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

        Schema::create('tag_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_question')->constrained(table: 'questions', column: 'id_question')->onDelete('cascade');
            $table->foreignId('id_tag')->constrained(table: 'tags', column: 'id_tag');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tag_questions');
    }
};
