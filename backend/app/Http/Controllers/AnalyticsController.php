<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\Review;
use App\Models\Reservation;
use App\Models\OccupancyLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnalyticsController extends Controller
{
        public function getRestaurantAnalytics($restaurantId, Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'restaurant_owner') {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 403);
        }

        $restaurant = Restaurant::find($restaurantId);
        if (!$restaurant || $restaurant->owner_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 403);
        }

        if ($restaurant->subscription_tier !== 'premium') {
            return response()->json(['success' => false, 'message' => 'Analytics available for Premium tier only'], 403);
        }

        $range     = $request->get('range', 'week');
        $cacheKey  = "analytics_{$restaurantId}_{$range}";

        $analytics = \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function () use ($restaurant, $range) {
            return $this->calculateAnalytics($restaurant, $range);
        });

        return response()->json([
            'success'         => true,
            'analytics'       => $analytics,
            'time_range'      => $range,
            'restaurant_name' => $restaurant->name,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    private function calculateAnalytics($restaurant, $range)
{
    $startDate = $this->getStartDate($range);

    // Fetch logs ONCE and reuse
    $logs = OccupancyLog::where('restaurant_id', $restaurant->id)
        ->where('created_at', '>=', $startDate)
        ->orderBy('created_at')
        ->get();

    return [
        'occupancy'      => $this->getOccupancyData($restaurant, $range, $logs, $startDate),
        'peakHours'      => $this->getPeakHours($restaurant, $startDate),
        'reviews'        => $this->getReviewData($restaurant, $range),
        'customers'      => $this->getCustomerData($restaurant, $range),
        'summary'        => $this->getAnalyticsSummary($restaurant, $range),
        'crowdBreakdown' => $this->getCrowdBreakdown($logs),
        'recentLogs'     => $this->getRecentLogs($logs),
        'sensorCount'    => $logs->where('source_type', 'sensor')->count(),
        'manualCount'    => $logs->where('source_type', '!=', 'sensor')->count(),
    ];
}

    private function getStartDate($range)
    {
        return match ($range) {
            'week'  => now()->subDays(6)->startOfDay(),  // last 7 full days incl. today
            'month' => now()->subDays(27)->startOfDay(), // last 4 full weeks
            'year'  => now()->subMonths(11)->startOfMonth(),
            default => now()->subDays(6)->startOfDay(),
        };
    }

    // ── Occupancy ─────────────────────────────────────────────────────────────
    // Always returns a full array of slots (7 days / 4 weeks / 12 months)
    // so the chart never shows fewer bars than expected.
        private function getOccupancyData($restaurant, $range, $logs, $startDate)
    {
        // Build slots (unchanged)
        $slots = [];
        $now   = now();
        if ($range === 'week') {
            for ($i = 6; $i >= 0; $i--) $slots[] = $now->copy()->subDays($i)->format('Y-m-d');
        } elseif ($range === 'month') {
            for ($i = 3; $i >= 0; $i--) $slots[] = $now->copy()->subWeeks($i)->format('Y-W');
        } else {
            for ($i = 11; $i >= 0; $i--) $slots[] = $now->copy()->subMonths($i)->format('Y-m');
        }

        if ($logs->isEmpty()) {
            return [
                'daily'    => array_fill(0, count($slots), 0),
                'weekly'   => array_fill(0, count($slots), 0),
                'monthly'  => array_fill(0, count($slots), 0),
                'current'  => $restaurant->occupancy_percentage ?? 0,
                'average'  => 0, 'peak' => 0, 'low' => 0,
                'has_data' => false, 'total_logs' => 0,
            ];
        }

        $grouped = [];
        foreach ($logs as $log) {
            $key = match($range) {
                'week'  => $log->created_at->format('Y-m-d'),
                'month' => $log->created_at->format('Y-W'),
                default => $log->created_at->format('Y-m'),
            };
            $grouped[$key][] = $log->occupancy_percentage;
        }

        $avg    = fn($arr) => count($arr) ? round(array_sum($arr) / count($arr), 1) : 0;
        $values = array_map(fn($slot) => $avg($grouped[$slot] ?? []), $slots);

        return [
            'daily'      => $values,
            'weekly'     => $values,
            'monthly'    => $values,
            'current'    => $restaurant->occupancy_percentage ?? 0,
            'average'    => round($logs->avg('occupancy_percentage'), 1),
            'peak'       => round($logs->max('occupancy_percentage'), 1),
            'low'        => round($logs->min('occupancy_percentage'), 1),
            'has_data'   => true,
            'total_logs' => $logs->count(),
        ];
    }

    // ── Peak Hours ────────────────────────────────────────────────────────────
    private function getPeakHours($restaurant, $startDate)
    {
        $logs = OccupancyLog::where('restaurant_id', $restaurant->id)
            ->where('created_at', '>=', $startDate)
            ->selectRaw('EXTRACT(HOUR FROM created_at) as hour, AVG(occupancy_percentage) as avg_occupancy')
            ->groupByRaw('EXTRACT(HOUR FROM created_at)')
            ->orderBy('avg_occupancy', 'DESC')
            ->limit(6)
            ->get();

        if ($logs->isEmpty()) return [];

        return $logs->map(function ($log) {
            $h = (int) $log->hour;
            $label = $h === 0  ? '12 AM'
                   : ($h < 12  ? "{$h} AM"
                   : ($h === 12 ? '12 PM'
                   : (($h - 12) . ' PM')));
            return ['hour' => $label, 'occupancy' => round($log->avg_occupancy, 1)];
        })->values()->toArray();
    }

    // ── Crowd Status Breakdown ────────────────────────────────────────────────
    private function getCrowdBreakdown($logs)
    {
        $counts = $logs->groupBy('crowd_status')->map->count();
        return [
            'green'  => (int) ($counts['green']  ?? 0),
            'yellow' => (int) ($counts['yellow'] ?? 0),
            'orange' => (int) ($counts['orange'] ?? 0),
            'red'    => (int) ($counts['red']    ?? 0),
        ];
    }

    // ── Recent Logs ───────────────────────────────────────────────────────────
    private function getRecentLogs($logs)
    {
        return $logs->sortByDesc('created_at')
            ->take(10)
            ->values()
            ->map(fn($l) => [
                'occupancy_count' => $l->occupancy_count,
                'source_type'     => $l->source_type,
                'sensor_id'       => $l->sensor_id,
                'notes'           => $l->notes,
                'created_at'      => $l->created_at,
            ])->toArray();
    }

    // ── Reviews ───────────────────────────────────────────────────────────────
    private function getReviewData($restaurant, $range)
    {
        $start       = $this->getStartDate($range);
        $allReviews  = Review::where('restaurant_id', $restaurant->id)->get();
        $periodReviews = $allReviews->filter(fn($r) => $r->created_at >= $start);

        $prevStart   = (clone $start)->subDays(match($range) {
            'week' => 7, 'month' => 30, 'year' => 365, default => 7
        });
        $prevReviews = $allReviews->filter(
            fn($r) => $r->created_at >= $prevStart && $r->created_at < $start
        );

        return [
            'average'      => $periodReviews->avg('rating')
                                ? round($periodReviews->avg('rating'), 1) : 0,
            'total'        => $periodReviews->count(),
            'trend'        => $periodReviews->count() - $prevReviews->count(),
            'distribution' => $this->getRatingDistribution($periodReviews),
        ];
    }

    private function getRatingDistribution($reviews)
    {
        $dist = [0, 0, 0, 0, 0];
        foreach ($reviews as $r) {
            if ($r->rating >= 1 && $r->rating <= 5) $dist[$r->rating - 1]++;
        }
        return $dist;
    }

    // ── Customers ─────────────────────────────────────────────────────────────
    private function getCustomerData($restaurant, $range)
    {
        $reservations = Reservation::where('restaurant_id', $restaurant->id)
            ->where('created_at', '>=', $this->getStartDate($range))->get();

        $total  = $reservations->sum('party_size');
        $unique = $reservations->groupBy('user_id')->count();

        return [
            'repeat' => $total > 0 ? round(($unique / $total) * 100) : 0,
            'new'    => $total > 0 ? round((($reservations->count() - $unique) / $total) * 100) : 100,
            'total'  => $total,
        ];
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    private function getAnalyticsSummary($restaurant, $range)
    {
        return [
            'best_day'        => $this->getBestDay($restaurant, $range),
            'recommendations' => $this->getRecommendations($restaurant, $range),
        ];
    }

    private function getBestDay($restaurant, $range)
    {
        $log = OccupancyLog::where('restaurant_id', $restaurant->id)
            ->where('created_at', '>=', $this->getStartDate($range))
            ->selectRaw("TO_CHAR(created_at, 'Day') as day, AVG(occupancy_percentage) as avg_occupancy")
            ->groupByRaw("TO_CHAR(created_at, 'Day')")
            ->orderBy('avg_occupancy', 'DESC')
            ->first();

        return $log ? trim($log->day) . ' (' . round($log->avg_occupancy) . '% avg)' : 'No data yet';
    }

    private function getRecommendations($restaurant, $range)
    {
        $avg = OccupancyLog::where('restaurant_id', $restaurant->id)
            ->where('created_at', '>=', $this->getStartDate($range))
            ->avg('occupancy_percentage') ?? 0;

        $recs = [];
        if ($avg === 0)  $recs[] = 'Start logging occupancy data to get personalised recommendations';
        if ($avg < 50)   $recs[] = 'Consider running promotions during off-peak hours';
        if ($avg > 80)   $recs[] = "You're consistently busy! Consider expanding capacity";
        return $recs;
    }
}