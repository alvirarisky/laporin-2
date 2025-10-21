<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->longText('content')->nullable();
            $table->integer('order');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_sections');
    }
};
