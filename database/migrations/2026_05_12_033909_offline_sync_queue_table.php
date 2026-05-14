<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel antrian sinkronisasi untuk fitur Offline First.
     *
     * Saat pengguna mengerjakan aktivitas tanpa internet, semua aksi
     * (jawab soal, selesaikan modul, isi refleksi) disimpan di
     * localStorage/IndexedDB di browser, lalu entry ini dibuat saat kembali online
     * untuk memastikan data terkirim ke server secara berurutan.
     */
    public function up(): void
    {
        Schema::create('offline_sync_queue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')
                ->constrained('users', 'id_user')
                ->cascadeOnDelete();

            // Jenis aksi yang perlu disinkronisasi
            $table->enum('action_type', [
                'answer_question',      // Jawaban soal pre/post-test
                'complete_module',      // Penyelesaian modul
                'complete_material',    // Membaca materi selesai
                'submit_reflection',    // Submit refleksi
            ]);

            // Data payload dalam format JSON (isi berbeda sesuai action_type)
            $table->json('payload')->comment('Data yang akan di-POST ke endpoint server saat sync');

            $table->enum('status', ['pending', 'synced', 'failed'])->default('pending');
            $table->tinyInteger('attempts')->default(0);
            $table->text('error_message')->nullable();

            // Waktu aksi dilakukan di device (bisa berbeda dari created_at jika offline lama)
            $table->timestamp('acted_at')->comment('Waktu aksi dilakukan di perangkat pengguna');

            $table->timestamps();

            $table->index(['id_user', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offline_sync_queue');
    }
};