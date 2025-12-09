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
        Schema::table('templates', function (Blueprint $table) {
            // Kolom boolean, default-nya false (Privat)
            $table->boolean('is_public')->default(false)->after('filepath');
            // Optional: Deskripsi template biar user lain tau ini buat matkul apa
            $table->text('description')->nullable()->after('name');
        });
    }
    
    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn(['is_public', 'description']);
        });
    }
};