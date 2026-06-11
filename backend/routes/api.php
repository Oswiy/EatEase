<?php

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RestaurantController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\RestaurantPhotoController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\IoTController;
use Illuminate\Support\Facades\Log;

// ==================== PUBLIC ROUTES (No Auth) ====================
// ── Development-only routes (never exposed in production) ──
if (app()->environment('local')) {
    Route::get('/test', function () {
        return response()->json(['message' => 'Laravel is working!']);
    });

    Route::get('/list-routes', function () {
        $routes = [];
        foreach (Route::getRoutes() as $route) {
            if (str_contains($route->uri(), 'reservation')) {
                $routes[] = [
                    'uri'     => $route->uri(),
                    'methods' => $route->methods(),
                    'name'    => $route->getName(),
                ];
            }
        }
        return response()->json(['reservation_routes' => $routes, 'count' => count($routes)]);
    });

    Route::post('/iot/quick', function (Request $request) {
        return response()->json(['status' => 'success', 'received' => $request->all()]);
    });

    Route::post('/iot/test-ultra-simple', function (Request $request) {
        return response()->json(['status' => 'success', 'received' => $request->all()]);
    });

    Route::post('/iot/log', function (Request $request) {
        Log::info('ESP32 DEBUG LOG:', ['data' => $request->all()]);
        return response()->json(['success' => true]);
    });
}

// Public IoT endpoints (device authentication via device_id + api_key)
Route::post('/iot/update-occupancy', [IoTController::class, 'updateOccupancy']);
Route::post('/iot/sync-counts', [IoTController::class, 'updateOccupancy']); // Reuse same logic

// ========== FAST IOT ROUTES FOR ESP32 ==========
Route::match(['get', 'post'], '/iot/quick-update', function (Request $request) {
    $secret = $request->input('secret') ?? $request->query('secret');
    if ($secret !== env('IOT_SECRET_KEY')) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $restaurantId = $request->input('restaurant_id') ?? $request->query('restaurant_id');
    $count        = $request->input('count') ?? $request->query('count');
    $action       = $request->input('action') ?? $request->query('action') ?? 'unknown';
    $deviceId     = $request->input('device_id') ?? $request->query('device_id') ?? 'esp32_unknown';

    $restaurant = \App\Models\Restaurant::find($restaurantId);
    if (!$restaurant) {
        return response()->json(['error' => 'Restaurant not found'], 404);
    }

    $oldOccupancy = $restaurant->current_occupancy;
    $mode  = $request->input('mode')  ?? $request->query('mode')  ?? 'set';
    $count = $request->input('count') ?? $request->query('count') ?? 0;

    if ($mode === 'increment') {
        $newCount = min($restaurant->current_occupancy + 1, $restaurant->max_capacity);
    } elseif ($mode === 'decrement') {
        $newCount = max($restaurant->current_occupancy - 1, 0);
    } else {
        // legacy 'set' mode — absolute value sent by old firmware
        $newCount = max(0, min((int)$count, $restaurant->max_capacity));
    }

    DB::table('restaurants')
        ->where('id', $restaurantId)
        ->update(['current_occupancy' => $newCount, 'updated_at' => now()]);

    // Compute analytics fields
    $maxCap    = $restaurant->max_capacity;
    $percentage = $maxCap > 0 ? round(($newCount / $maxCap) * 100, 1) : 0;
    $crowdStatus = $newCount >= $maxCap * 0.9 ? 'red'
                 : ($newCount >= $maxCap * 0.7 ? 'orange'
                 : ($newCount >= $maxCap * 0.4 ? 'yellow' : 'green'));

    // Write log with all fields required by AnalyticsController
    \App\Models\OccupancyLog::create([
        'restaurant_id'        => $restaurantId,
        'occupancy_count'      => $newCount,
        'occupancy_percentage' => $percentage,
        'crowd_status'         => $crowdStatus,
        'source_type'          => 'sensor',
        'sensor_id'            => $deviceId,       // identifies entry/exit button
        'is_estimated'         => false,
        'notes'                => "{$action} – from {$oldOccupancy} to {$newCount}",
    ]);

    return response()->json([
        'success' => true,
        'new_occupancy' => $newCount
    ]);
});

Route::get('/iot/ping', function (Request $request) {
    return response()->json(['success' => true, 'time' => now()]);
});

// Protected IoT endpoints (restaurant owner only)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/iot/register-device', [IoTController::class, 'registerDevice']);
    Route::get('/iot/devices', [IoTController::class, 'getDevices']);
    Route::post('/iot/reset-counters', [IoTController::class, 'resetCounters']);
    Route::delete('/iot/devices/{deviceId}', [IoTController::class, 'deleteDevice']);
});

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/signup', [AuthController::class, 'signup']);

// Public restaurant routes
Route::get('/restaurants', [RestaurantController::class, 'getAllRestaurants']);
Route::get('/restaurants/cuisines', [RestaurantController::class, 'getAvailableCuisines']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'getRestaurantById']);
Route::get('/restaurants/{id}/menu', [RestaurantController::class, 'getMenuItems']);
Route::get('/restaurants/{id}/photos', [RestaurantController::class, 'getPhotos']);
Route::get('/restaurants/{id}/stats', [RestaurantController::class, 'getRestaurantStats']);
Route::get('/restaurants/{id}/reviews', [ReviewController::class, 'index']);
Route::get('/restaurants/{id}/menu-text', [MenuController::class, 'show']);
Route::get('/restaurants/{id}/menu', [MenuController::class, 'show']);

// ✅ ADD THIS NEW PUBLIC ROUTE FOR DINERS
Route::get('/restaurants/{id}/fee-settings', [RestaurantController::class, 'getFeeSettingsForDiner']);

// Status endpoints with higher rate limits
Route::get('/restaurants/{id}/status', [RestaurantController::class, 'getStatus'])
    ->middleware('throttle:300,1');

Route::get('/restaurants/{id}/current-status', [RestaurantController::class, 'getRestaurantCurrentStatus'])
    ->middleware('throttle:300,1');

// Reservation Availability check
Route::get('/restaurants/{restaurant}/availability', [ReservationController::class, 'checkAvailability']);

// ==================== PROTECTED ROUTES ====================
Route::middleware('auth:sanctum')->group(function () {
    // Debug routes

    Route::get('/restaurant/fee-settings', [RestaurantController::class, 'getFeeSettings']);
    Route::put('/restaurant/update-fee', [RestaurantController::class, 'updateFeeSettings']);

    Route::post('/restaurant/renew-premium', [RestaurantController::class, 'renewPremium']);

    Route::put('/restaurant/promo', [RestaurantController::class, 'updatePromoText']);

    // ========== RESTAURANT MANAGEMENT ROUTES (OUTSIDE FILTER GROUP) ==========
    Route::get('/restaurant/my', [RestaurantController::class, 'getMyRestaurant']);
    Route::post('/restaurant/save', [RestaurantController::class, 'saveRestaurant']);
    Route::put('/restaurant/occupancy', [RestaurantController::class, 'updateOccupancy']);
    Route::post('/restaurant/request-verification', [RestaurantController::class, 'requestVerification']);
    Route::post('/restaurant/request-feature', [RestaurantController::class, 'requestFeature']);
    Route::post('/restaurant/feature', [RestaurantController::class, 'featureRestaurant']);
    Route::post('/restaurant/unfeature', [RestaurantController::class, 'unfeatureRestaurant']);

    // ========== ROUTES WITH BAD WORD FILTERING ==========
    // Apply bad word filtering to user-generated content routes
    Route::middleware(['filter.badwords', 'throttle:60,1'])->group(function () {
        // User registration/profile updates
        Route::post('/auth/signup', [AuthController::class, 'signup'])->withoutMiddleware('auth:sanctum');

        // Restaurant management (with filtering)
        Route::post('/restaurant/save', [RestaurantController::class, 'saveRestaurant']);
        Route::post('/restaurant/request-verification', [RestaurantController::class, 'requestVerification']);
        Route::post('/restaurant/request-feature', [RestaurantController::class, 'requestFeature']);
        Route::put('/restaurant/occupancy', [RestaurantController::class, 'updateOccupancy']);
        Route::post('/restaurant/feature', [RestaurantController::class, 'featureRestaurant']);
        Route::post('/restaurant/unfeature', [RestaurantController::class, 'unfeatureRestaurant']);

        // Reviews (with filtering)
        Route::post('/restaurants/{id}/reviews', [ReviewController::class, 'store']);
        Route::put('/reviews/{id}', [ReviewController::class, 'updateReview']);

        // Menu updates (with filtering)
        Route::put('/restaurants/{id}/menu-text', [MenuController::class, 'update']);
        Route::put('/restaurants/{id}/menu', [MenuController::class, 'update']);

        // Reservations (with filtering)
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::post('/reservations/hold-spot', [ReservationController::class, 'holdSpot']);
        // reserve hide expired holds:
        Route::delete('/my-restaurant/expired-holds/{id}/hide', [ReservationController::class, 'hideExpiredHold']);
    });

    // ========== RESTAURANT OWNER ROUTES ==========
    Route::middleware('business.only')->group(function () {
        Route::post('/restaurant/upload/{type}', [RestaurantController::class, 'uploadImage']);
        Route::post('/restaurant/banner-position', [RestaurantController::class, 'updateBannerPosition']);

        Route::prefix('restaurant/{restaurant}/photos')->group(function () {
            Route::get('/', [RestaurantPhotoController::class, 'index']);
            Route::post('/', [RestaurantPhotoController::class, 'store']);
            Route::put('/{photo}/primary', [RestaurantPhotoController::class, 'setPrimary']);
            Route::put('/{photo}', [RestaurantPhotoController::class, 'update']);
            Route::delete('/{photo}', [RestaurantPhotoController::class, 'destroy']);
        });

        Route::put('/restaurants/{id}/menu-text', [MenuController::class, 'update']);
        Route::get('/restaurants/{id}/analytics', [AnalyticsController::class, 'getRestaurantAnalytics']);
    });

    // ========== RESERVATION ROUTES (without filtering for GET requests) ==========
    Route::prefix('reservations')->group(function () {
        Route::get('/', [ReservationController::class, 'index']);
        Route::post('/', [ReservationController::class, 'store']);
        Route::post('/hold-spot', [ReservationController::class, 'holdSpot']);
        Route::delete('/my-restaurant/expired-holds/{id}/hide', [ReservationController::class, 'hideExpiredHold']);
        Route::delete('/{id}/remove', [ReservationController::class, 'removeFromView']); // ← specific first
        Route::get('/{id}', [ReservationController::class, 'show']);
        Route::delete('/{id}', [ReservationController::class, 'destroy']);         // ← wildcard last
    });

    // ========== RESTAURANT OWNER RESERVATION MANAGEMENT ==========
    Route::prefix('my-restaurant')->group(function () {
        Route::get('/spot-holds', [ReservationController::class, 'getRestaurantSpotHolds']);
        Route::get('/spot-holds/expired', [ReservationController::class, 'getExpiredSpotHolds']);
        Route::put('/spot-holds/{id}/accept', [ReservationController::class, 'acceptSpotHold']);
        Route::put('/spot-holds/{id}/reject', [ReservationController::class, 'rejectSpotHold']);
        Route::get('/todays-reservations', [ReservationController::class, 'getTodaysReservations']);
        Route::get('/capacity-status', [ReservationController::class, 'getCapacityStatus']);
    });

    Route::get('/restaurants/{id}/capacity', [ReservationController::class, 'getCapacityStatus']);

    // ========== NOTIFICATION & BOOKMARK ROUTES WITH HIGH LIMIT ==========
    // ========== NOTIFICATION & BOOKMARK ROUTES ==========
    Route::middleware(['auth:sanctum', 'throttle:300,1'])->group(function () {
        // Notification preferences
        Route::post('/notifications/{restaurant_id}', [NotificationController::class, 'setNotification']);
        Route::get('/notifications', [NotificationController::class, 'getNotifications']);
        Route::delete('/notifications/{notification_id}', [NotificationController::class, 'removeNotification']);
        Route::put('/notifications/{notification_id}/mark-read', [NotificationController::class, 'markAsRead']);

        // Actual notification logs (sent notifications)
        Route::get('/user-notifications', [NotificationController::class, 'getUserNotifications']);
        Route::delete('/user-notifications/{id}', [NotificationController::class, 'destroy']);
        Route::delete('/user-notifications', [NotificationController::class, 'destroyAll']);

        // Bookmarks
        Route::post('/bookmarks/{restaurant_id}', [NotificationController::class, 'toggleBookmark']);
        Route::get('/bookmarks', [NotificationController::class, 'getBookmarks']);
        Route::delete('/bookmarks/cleanup', [NotificationController::class, 'cleanupOrphanedBookmarks']);
    });
    
    // ========== REVIEW ROUTES (without filtering for DELETE) ==========
    Route::post('/restaurants/{id}/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'updateReview']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // ========== SUBSCRIPTION ROUTES ==========
    Route::get('/subscription/tier', [SubscriptionController::class, 'getCurrentTier']);
    Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgradeToPremium']);
    Route::get('/subscription/can-apply-featured', [SubscriptionController::class, 'canApplyForFeatured']);

    // ========== DEBUG ROUTES ==========
    if (app()->environment('local')) {
    Route::get('/debug-protected', function () {
        $user = auth()->user();
        return response()->json([
            'message'      => 'Protected route works',
            'user'         => $user ? ['id' => $user->id, 'email' => $user->email] : null,
            'auth_working' => !is_null($user),
        ]);
    });

    Route::get('/debug-reservations-test', [ReservationController::class, 'index']);

    Route::get('/debug/restaurant-owner', function () {
        $user = Auth::user();
        return response()->json([
            'user_id'      => $user->id,
            'user_type'    => $user->user_type,
            'email'        => $user->email,
            'has_restaurant' => \App\Models\Restaurant::where('owner_id', $user->id)->exists(),
        ]);
    });

    Route::post('/debug-save', function (Request $request) {
        return response()->json(['message' => 'Debug route — local only']);
    });

    Route::post('/debug-simple', function (Request $request) {
        return response()->json([
            'received'  => $request->all(),
            'server_time' => now(),
        ]);
    });
}

    // ========== ADMIN BAD WORD MANAGEMENT ROUTES ==========
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/bad-words', [AdminController::class, 'getBadWords']);
        Route::post('/bad-words', [AdminController::class, 'addBadWord']);
        Route::delete('/bad-words', [AdminController::class, 'removeBadWord']);
        Route::post('/bad-words/toggle', [AdminController::class, 'toggleFilter']);
    });
});

// ========== ADMIN ROUTES (Rest of the admin routes) ==========
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Existing admin routes
    Route::get('/restaurants', [AdminController::class, 'getAllRestaurants']);
    Route::post('/suspend-restaurant/{id}', [AdminController::class, 'suspendRestaurant']);
    Route::get('/users', [AdminController::class, 'getAllUsers']);
    Route::get('/verification-requests', [AdminController::class, 'getVerificationRequests']);
    Route::post('/verify-restaurant/{id}', [AdminController::class, 'verifyRestaurant']);
    Route::post('/reject-verification/{id}', [AdminController::class, 'rejectVerification']);
    Route::get('/feature-requests', [AdminController::class, 'getFeatureRequests']);
    Route::post('/approve-feature-request/{id}', [AdminController::class, 'approveFeatureRequest']);
    Route::post('/reject-feature-request/{id}', [AdminController::class, 'rejectFeatureRequest']);

    // NEW: Bad word management routes
    Route::get('/bad-words', [AdminController::class, 'getBadWords']);
    Route::post('/bad-words', [AdminController::class, 'addBadWord']);
    Route::delete('/bad-words', [AdminController::class, 'removeBadWord']);
    Route::post('/bad-words/toggle-filter', [AdminController::class, 'toggleBadWordFilter']);
    Route::post('/bad-words/toggle-strict-mode', [AdminController::class, 'toggleBadWordStrictMode']);
    Route::post('/bad-words/test', [AdminController::class, 'testBadWordFilter']);
});
