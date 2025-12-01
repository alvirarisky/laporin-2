<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('game_progresses');
        Schema::dropIfExists('game_levels');
        Schema::dropIfExists('games');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('majors');

        Schema::create('majors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('major_id')->constrained('majors')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('game_type', ['css', 'sql', 'math', 'quiz', 'logic'])->default('quiz');
            $table->timestamps();
        });

        Schema::create('game_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained('games')->cascadeOnDelete();
            $table->unsignedInteger('level');
            $table->text('instruction');
            $table->longText('setup_html')->nullable();
            $table->text('initial_code')->nullable();
            $table->text('solution');
            $table->text('target_answer')->nullable();
            $table->text('target_css')->nullable();
            $table->unsignedInteger('exp_reward')->default(20);
            $table->timestamps();
        });

        Schema::create('game_progresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_id')->constrained('games')->cascadeOnDelete();
            $table->foreignId('level_id')->constrained('game_levels')->cascadeOnDelete();
            $table->enum('status', ['completed', 'failed'])->default('completed');
            $table->unsignedInteger('score')->default(0);
            $table->timestamps();
            $table->unique(['user_id', 'game_id', 'level_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_progresses');
        Schema::dropIfExists('game_levels');
        Schema::dropIfExists('games');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('majors');
    }
};

