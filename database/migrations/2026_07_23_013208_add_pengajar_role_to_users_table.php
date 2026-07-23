<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Tambahkan 'pengajar' ke dalam array enum, lalu panggil ->change()
            $table->enum('role', ['user', 'admin', 'question_admin', 'pengajar'])
                  ->default('user')
                  ->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Kembalikan ke enum semula jika di-rollback
            $table->enum('role', ['user', 'admin', 'question_admin'])
                  ->default('user')
                  ->change();
        });
    }
};