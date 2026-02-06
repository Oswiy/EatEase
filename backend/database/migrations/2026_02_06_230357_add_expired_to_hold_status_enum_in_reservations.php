<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Use raw SQL to modify the enum
        DB::statement("ALTER TABLE reservations MODIFY COLUMN hold_status ENUM('pending', 'accepted', 'rejected', 'expired', 'cancelled_by_user') DEFAULT 'pending'");
    }

    public function down(): void
    {
        // Revert back to original enum
        DB::statement("ALTER TABLE reservations MODIFY COLUMN hold_status ENUM('pending', 'accepted', 'rejected', 'cancelled_by_user') DEFAULT 'pending'");
    }
};