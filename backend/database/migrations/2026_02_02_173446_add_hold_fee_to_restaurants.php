<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            // Add hold fee (default 0, free if not set)
            $table->decimal('hold_fee', 8, 2)->default(0)->after('subscription_ends_at');
            // Add min party size for fee
            $table->integer('min_party_for_fee')->default(1)->after('hold_fee');
            // Add fee description
            $table->string('fee_description', 100)->nullable()->after('min_party_for_fee');
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn(['hold_fee', 'min_party_for_fee', 'fee_description']);
        });
    }
};