<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('question_options', function (Blueprint $table) {
            // Buat option_text nullable (sebelumnya NOT NULL)
            $table->string('option_text')->nullable()->change();

            // Tambah kolom gambar jika belum ada
            if (!Schema::hasColumn('question_options', 'option_image')) {
                $table->string('option_image')->nullable()->after('option_text');
            }
        });
    }

    public function down(): void
    {
        Schema::table('question_options', function (Blueprint $table) {
            $table->string('option_text')->nullable(false)->change();
            $table->dropColumn('option_image');
        });
    }
};