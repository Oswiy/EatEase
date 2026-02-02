<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class AutoCancelExpiredHolds extends Command
{
    protected $signature = 'holds:auto-cancel';
    protected $description = 'Auto-cancel pending holds where restaurant didnt respond in 10 minutes';

    public function handle()
    {
        try {
            $expiredHolds = Reservation::where('status', 'pending_hold')
                ->where('hold_status', 'pending')
                ->where('original_expires_at', '<', now())
                ->get();

            $count = 0;
            
            foreach ($expiredHolds as $hold) {
                $hold->update([
                    'status' => 'cancelled',
                    'hold_status' => 'expired',
                    'cancelled_at' => now()
                ]);
                $count++;
                
                Log::info("Auto-cancelled hold ID {$hold->id} - Restaurant didn't respond in time");
            }

            $this->info("Auto-cancelled {$count} expired holds");
            return 0;
        } catch (\Exception $e) {
            Log::error('Auto-cancel error: ' . $e->getMessage());
            $this->error('Failed to auto-cancel holds: ' . $e->getMessage());
            return 1;
        }
    }
}