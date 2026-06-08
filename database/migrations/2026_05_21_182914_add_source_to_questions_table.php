<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // 'portal'        = hanya muncul di fitur portal
            // 'learning_path' = hanya muncul di pre_test / post_test
            // 'both'          = bisa dipakai keduanya (default, backward-compatible)
            $table->enum('source', ['portal', 'learning_path', 'both'])
                  ->default('both')
                  ->after('correct_answer')
                  ->comment('Menentukan fitur mana soal ini digunakan');
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('source');
        });
    }
};