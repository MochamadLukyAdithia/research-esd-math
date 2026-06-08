<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $columns = DB::select("SHOW COLUMNS FROM user_points");
        $columnNames = collect($columns)->pluck('Field')->toArray();

        // Tambah kolom hanya kalau belum ada
        Schema::table('user_points', function (Blueprint $table) use ($columnNames) {
            if (!in_array('source', $columnNames)) {
                $table->enum('source', ['portal', 'pre_test', 'post_test'])
                      ->default('portal')
                      ->after('points_earned')
                      ->comment('Konteks dari mana poin diperoleh');
            }

            if (!in_array('id_learning_path', $columnNames)) {
                $table->unsignedBigInteger('id_learning_path')
                      ->nullable()
                      ->after('source')
                      ->comment('Null jika berasal dari portal');

                $table->foreign('id_learning_path')
                      ->references('id_learning_path')
                      ->on('learning_paths')
                      ->nullOnDelete();
            }
        });

        // Hapus unique lama jika ada
        $indexes = DB::select("SHOW INDEX FROM user_points WHERE Key_name != 'PRIMARY'");
        $indexNames = collect($indexes)->pluck('Key_name')->unique()->toArray();

        $possibleOldIndexes = [
            'user_points_id_user_id_question_unique',
            'user_points_id_user_id_question_index',
            'uq_user_question',
        ];

        Schema::table('user_points', function (Blueprint $table) use ($indexNames, $possibleOldIndexes) {
            foreach ($possibleOldIndexes as $idx) {
                if (in_array($idx, $indexNames)) {
                    $table->dropUnique($idx);
                    break;
                }
            }
        });

        // Tambah unique baru hanya kalau belum ada
        $indexes = DB::select("SHOW INDEX FROM user_points WHERE Key_name = 'uq_user_question_source'");
        if (empty($indexes)) {
            Schema::table('user_points', function (Blueprint $table) {
                $table->unique(
                    ['id_user', 'id_question', 'source'],
                    'uq_user_question_source'
                );
            });
        }
    }

    public function down(): void
    {
        Schema::table('user_points', function (Blueprint $table) {
            $table->dropUnique('uq_user_question_source');
            $table->dropForeign(['id_learning_path']);
            $table->dropColumn(['source', 'id_learning_path']);
        });
    }
};