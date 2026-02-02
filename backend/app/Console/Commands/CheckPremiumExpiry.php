<?php

namespace App\Console\Commands;

use App\Models\Restaurant;
use Illuminate\Console\Command;
use Carbon\Carbon;

class CheckPremiumExpiry extends Command
{
    protected $signature = 'premium:check-expiry';
    protected $description = 'Check and auto-downgrade expired premium subscriptions';

    public function handle()
    {
        $this->info('Checking for expired premium subscriptions...');
        
        $expiredRestaurants = Restaurant::where('subscription_tier', 'premium')
            ->whereNotNull('subscription_ends_at')
            ->where('subscription_ends_at', '<=', Carbon::now())
            ->get();

        $count = 0;
        
        foreach ($expiredRestaurants as $restaurant) {
            $restaurant->autoDowngradeIfExpired();
            $count++;
            
            $this->info("Auto-downgraded: {$restaurant->name} (ID: {$restaurant->id})");
        }
        
        $this->info("Completed! Auto-downgraded {$count} expired premium restaurants.");
        
        return 0;
    }
}