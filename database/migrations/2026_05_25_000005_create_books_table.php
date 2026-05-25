<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('isbn')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->unsignedSmallInteger('published_year')->nullable();
            $table->unsignedInteger('copies_total')->default(1);
            $table->unsignedInteger('copies_available')->default(1);
            $table->foreignId('publisher_id')->nullable()->constrained('publishers')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('title');
            $table->index('copies_available');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
