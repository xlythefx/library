<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('membership_number')->unique();
            $table->date('membership_expiry');
            $table->enum('status', ['active', 'suspended', 'expired'])->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'membership_expiry']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
