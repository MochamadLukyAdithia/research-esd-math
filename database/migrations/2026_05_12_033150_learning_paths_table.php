<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_paths', function (Blueprint $table) {
            $table->id('id_learning_path');
            $table->string('title');
            $table->text('description');
            $table->integer('grade')->comment('Tingkat kelas, e.g. 7, 8, 9 (SMP) atau 10, 11, 12 (SMA)');
            $table->string('category')->comment('Kategori topik matematika, e.g. Aljabar, Geometri');
            $table->string('thumbnail')->nullable();
            $table->integer('estimated_minutes')->default(0)->comment('Estimasi total waktu pengerjaan dalam menit');
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_paths');
    }
};