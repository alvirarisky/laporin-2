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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Kolom dari Form Identitas
            $table->string('report_type')->default('Makalah Akademik');
            $table->string('judul');
            $table->string('nama');
            $table->string('nim');
            $table->string('prodi');
            $table->string('mata_kuliah');
            $table->string('dosen_pembimbing');
            $table->string('instansi');
            $table->string('kota');
            $table->string('tahun_ajaran');

            // Kolom untuk Logo
            $table->string('logo_path')->nullable();
            $table->string('logo_position')->default('tengah');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporans');
    }
};
