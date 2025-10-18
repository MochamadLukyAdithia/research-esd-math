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
            $table->text('question_image');
            $table->foreignId('id_district')->constrained(table: 'districts', column: 'id_district');
            $table->foreignId('id_user')->constrained(table: 'users', column: 'id_user');
            $table->float('correct_answer');
            $table->timestamps();
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
