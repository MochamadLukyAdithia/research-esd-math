<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_module_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')
                ->constrained('users', 'id_user')
                ->cascadeOnDelete();
            $table->foreignId('id_module')
                ->constrained('learning_path_modules', 'id_module')
                ->cascadeOnDelete();
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->timestamp('completed_at')->nullable();

            // Offline-first: tandai apakah progress ini sudah tersinkronisasi
            $table->boolean('is_synced')->default(true)->comment('False jika diisi saat offline, menunggu sync');

            $table->timestamps();

            $table->unique(['id_user', 'id_module']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_module_progress');
    }
};