<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Add accepted_at timestamp (null until accepted)
            $table->timestamp('accepted_at')->nullable()->after('expires_at');
            // Add hold_fee column for the fee system
            $table->decimal('hold_fee', 8, 2)->default(0)->after('party_size');
            // Add original_expires_at to track when hold was originally set to expire
            $table->timestamp('original_expires_at')->nullable()->after('expires_at');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['accepted_at', 'hold_fee', 'original_expires_at']);
        });
    }
};