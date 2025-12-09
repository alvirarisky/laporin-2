<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nim')->nullable()->after('email');
            $table->string('prodi')->nullable()->after('nim');
            $table->string('instansi')->nullable()->after('prodi');
            $table->string('no_hp')->nullable()->after('instansi');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nim', 'prodi', 'instansi', 'no_hp']);
        });
    }
};