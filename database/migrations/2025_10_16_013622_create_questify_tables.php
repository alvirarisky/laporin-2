<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel untuk Topik Utama (Pemrograman Web, Basis Data)
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->timestamps();
        });

        // Tabel untuk setiap Game (FlexCode Challenge, SQL Quiz)
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->timestamps();
        });

        // Tabel untuk Level di dalam Game
        Schema::create('game_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->integer('level');
            $table->string('instruction');
            $table->text('initial_code'); // Kode awal yang tampil di editor
            $table->text('solution_code'); // Jawaban yang benar
            $table->integer('exp_reward')->default(20);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_levels');
        Schema::dropIfExists('games');
        Schema::dropIfExists('topics');
    }
};
