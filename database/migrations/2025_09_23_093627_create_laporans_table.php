<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('report_type')->default('General'); // Kalau ada
            
            $table->string('judul');
            $table->string('nama'); // Ini wajib (udah kita fix tadi)
            
            // --- KASIH ->nullable() DI SINI SEMUA ---
            $table->string('nim')->nullable(); 
            $table->string('prodi')->nullable();
            $table->string('mata_kuliah')->nullable();
            $table->string('dosen_pembimbing')->nullable();
            $table->string('instansi')->nullable();
            $table->string('kota')->nullable();
            $table->string('tahun_ajaran')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('logo_position')->default('center')->nullable();
            // ----------------------------------------
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporans');
    }
};
