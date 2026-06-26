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
    Schema::table('user_answers', function (Blueprint $table) {
        $table->unsignedInteger('tab_switch_count')->default(0)->after('answered_at');
    });
}

public function down(): void
{
    Schema::table('user_answers', function (Blueprint $table) {
        $table->dropColumn('tab_switch_count');
    });
}
};
