<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_materials', function (Blueprint $table) {
            $table->id('id_material');
            $table->foreignId('id_module')
                ->constrained('learning_path_modules', 'id_module')
                ->cascadeOnDelete();
            $table->string('title');
            $table->enum('content_type', [
                'slide',        // Slide PPT / presentasi
                'video',        // Video pembelajaran
                'example',      // Contoh soal kontekstual
                'text',         // Penjelasan konsep teks biasa
            ]);
            $table->longText('content')->nullable()->comment('Konten teks / embed URL / HTML slide');
            $table->string('file_path')->nullable()->comment('Path file untuk slide atau video yang diupload');
            $table->integer('order_number')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_materials');
    }
};