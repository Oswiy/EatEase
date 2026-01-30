<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RestaurantController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\RestaurantPhotoController;
use App\Http\Controllers\ReservationController;

// ==================== ESP32-CAMERA ROUTES ====================
Route::post('/camera/upload', function (Request $request) {
    // Log the connection
    \Log::info('📸 ESP32-CAM Connected', [
        'ip' => $request->ip(),
        'headers' => array_keys($request->headers->all()),
        'content_type' => $request->header('Content-Type'),
        'content_length' => $request->header('Content-Length')
    ]);
    
    // Simple security - you can enable later
    // $apiKey = $request->header('X-API-Key');
    // if ($apiKey !== env('ESP32_API_KEY', 'esp32-default-key')) {
    //     return response()->json(['error' => 'Unauthorized'], 401);
    // }
    
    $deviceId = $request->header('X-Device-ID', 'esp32-cam-001');
    $location = $request->header('X-Location', 'kitchen');
    
    // Method 1: Raw image data (most common for ESP32)
    if ($request->header('Content-Type') === 'image/jpeg') {
        $imageData = $request->getContent();
        
        if (!empty($imageData)) {
            // Create storage directory if it doesn't exist
            $storagePath = storage_path('app/public/camera-uploads');
            if (!file_exists($storagePath)) {
                mkdir($storagePath, 0777, true);
            }
            
            $fileName = 'cam_' . $deviceId . '_' . time() . '.jpg';
            $path = 'camera-uploads/' . $fileName;
            
            // Save the image
            Storage::disk('public')->put($path, $imageData);
            
            return response()->json([
                'success' => true,
                'message' => 'Image received from ESP32-CAM',
                'file_path' => $path,
                'file_url' => url('storage/' . $path),
                'device_id' => $deviceId,
                'location' => $location,
                'size_bytes' => strlen($imageData),
                'timestamp' => date('Y-m-d H:i:s')
            ], 200);
        }
    }
    
    // Method 2: Form data with file
    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $path = $file->store('camera-uploads', 'public');
        
        return response()->json([
            'success' => true,
            'message' => 'Image uploaded via form',
            'file_path' => $path,
            'file_url' => url('storage/' . $path),
            'original_name' => $file->getClientOriginalName(),
            'device_id' => $deviceId,
            'location' => $location
        ], 200);
    }
    
    // If no image data
    return response()->json([
        'error' => 'No image data received',
        'received_content_type' => $request->header('Content-Type'),
        'content_length' => $request->header('Content-Length'),
        'help' => 'Send image/jpeg with raw bytes or multipart/form-data with "image" field'
    ], 400);
});

// Simple test endpoint
Route::post('/camera/test', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'message' => '✅ Laravel backend is ready for ESP32-CAM!',
        'server_ip' => $_SERVER['SERVER_ADDR'] ?? 'localhost',
        'client_ip' => $request->ip(),
        'timestamp' => now()->toDateTimeString(),
        'endpoints' => [
            'upload' => 'POST /api/camera/upload',
            'test' => 'POST /api/camera/test'
        ],
        'instructions' => 'Send image/jpeg data to /api/camera/upload'
    ]);
});

Route::get('/camera/images', function () {
    $files = Storage::files('public/camera-uploads');
    $imageUrls = [];
    
    foreach ($files as $file) {
        $imageUrls[] = [
            'url' => url(str_replace('public/', 'storage/', $file)),
            'name' => basename($file),
            'size' => Storage::size($file)
        ];
    }
    
    return response()->json([
        'count' => count($imageUrls),
        'images' => $imageUrls
    ]);
});

// ==================== EXISTING ROUTES ====================

Route::middleware(['auth:sanctum', 'throttle:60,1']) // 60 requests per minute
    ->group(function () {
    // Your protected routes
});

// For status endpoint specifically (public), add higher limit:
Route::get('/restaurants/{id}/status', [RestaurantController::class, 'getStatus'])
    ->middleware('throttle:300,1'); // 120 requests per minute

Route::middleware('auth:sanctum')->get('/debug-protected', function() {
    $user = auth()->user();
    return response()->json([
        'message' => '✅ Protected route works',
        'user' => $user ? ['id' => $user->id, 'email' => $user->email] : null,
        'auth_working' => !is_null($user)
    ]);
});

Route::middleware('auth:sanctum')->get('/debug-reservations-test', [ReservationController::class, 'index']);

//Reservation Availability check
Route::get('/restaurants/{restaurant}/availability', [ReservationController::class, 'checkAvailability']);

Route::get('/test-db', function () {
    try {
        $databaseName = DB::connection()->getDatabaseName();
        return response()->json([
            'status' => 'success',
            'message' => 'Database connected successfully!',
            'database' => $databaseName
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Database connection failed',
            'error' => $e->getMessage()
        ]);
    }
});

Route::get('/test-api', function () {
    return response()->json([
        'message' => '✅ API is working!',
        'timestamp' => now()
    ]);
});

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/signup', [AuthController::class, 'signup']);


// Public restaurant routes
// Add these routes in routes/api.php
Route::get('/restaurants', [RestaurantController::class, 'getAllRestaurants']);
Route::get('/restaurants/cuisines', [RestaurantController::class, 'getAvailableCuisines']);

Route::get('/restaurants/{id}', [RestaurantController::class, 'getRestaurantById']);
Route::get('/restaurants/{id}/menu', [RestaurantController::class, 'getMenuItems']);
Route::get('/restaurants/{id}/photos', [RestaurantController::class, 'getPhotos']);
Route::get('/restaurants/{id}/stats', [RestaurantController::class, 'getRestaurantStats']);
Route::get('/restaurants/{id}/reviews', [ReviewController::class, 'index']);
Route::get('/restaurants/{id}/menu-text', [MenuController::class, 'show']);
Route::get('/restaurants/premium/recommendations', [RecommendationController::class, 'getPremiumRecommendations']);
Route::get('/restaurants/{id}/menu', [MenuController::class, 'show']);
// Add this with other public restaurant routes (around line 50)
Route::get('/restaurants/{id}/status', [RestaurantController::class, 'getStatus']);


// ==================== PROTECTED ROUTES ====================
Route::middleware('auth:sanctum')->group(function () {
    // Restaurant management routes
    Route::get('/restaurant/my', [RestaurantController::class, 'getMyRestaurant']);
    Route::post('/restaurant/save', [RestaurantController::class, 'saveRestaurant']);
    Route::put('/restaurant/occupancy', [RestaurantController::class, 'updateOccupancy']);
    Route::post('/restaurant/request-verification', [RestaurantController::class, 'requestVerification']);
    Route::post('/restaurant/request-feature', [RestaurantController::class, 'requestFeature']);
      // Add these new routes
    Route::post('/restaurant/feature', [RestaurantController::class, 'featureRestaurant']);
    Route::post('/restaurant/unfeature', [RestaurantController::class, 'unfeatureRestaurant']);
    
    // Restaurant owner only routes
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
    
    // ========== RESERVATION ROUTES ==========
    // User reservation routes
    Route::prefix('reservations')->group(function () {
        Route::get('/', [ReservationController::class, 'index']);
        Route::post('/', [ReservationController::class, 'store']);
        Route::get('/{id}', [ReservationController::class, 'show']);
        Route::delete('/{id}', [ReservationController::class, 'destroy']);
        Route::post('/hold-spot', [ReservationController::class, 'holdSpot']);
        Route::delete('/{id}/remove', [ReservationController::class, 'removeFromView']);
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
    
    // ========== NOTIFICATION & BOOKMARK ROUTES ==========
    Route::post('/bookmarks/{restaurant_id}', [NotificationController::class, 'toggleBookmark']);
    Route::get('/bookmarks', [NotificationController::class, 'getBookmarks']);
    Route::delete('/bookmarks/cleanup', [NotificationController::class, 'cleanupOrphanedBookmarks']);
    
    Route::post('/notifications/{restaurant_id}', [NotificationController::class, 'setNotification']);
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::delete('/notifications/{notification_id}', [NotificationController::class, 'removeNotification']);
    Route::put('/notifications/{notification_id}/mark-read', [NotificationController::class, 'markAsRead']);
    
    Route::get('/user-notifications', [NotificationController::class, 'getUserNotifications']);
    Route::delete('/user-notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/user-notifications', [NotificationController::class, 'destroyAll']);
    
    // ========== REVIEW ROUTES ==========
    Route::post('/restaurants/{id}/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'updateReview']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'deleteReview']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    
    // ========== SUBSCRIPTION ROUTES ==========
    Route::get('/subscription/tier', [SubscriptionController::class, 'getCurrentTier']);
    Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgradeToPremium']);
    Route::get('/subscription/can-apply-featured', [SubscriptionController::class, 'canApplyForFeatured']);
    
    // ========== DEBUG ROUTES ==========
    Route::post('/debug-save', function (Request $request) {
        try {
            $user = Auth::user();
            if (!$user) return response()->json(['error' => 'Not authenticated'], 401);
            
            $receivedValue = $request->input('current_occupancy');
            $restaurant = \App\Models\Restaurant::create([
                'owner_id' => $user->id,
                'name' => 'Debug Test ' . time(),
                'cuisine_type' => 'Debug',
                'address' => 'Debug',
                'phone' => '123',
                'hours' => '9-5',
                'max_capacity' => 100,
                'current_occupancy' => 88,
            ]);
            
            return response()->json([
                'success' => true,
                'debug_info' => [
                    'received_current_occupancy' => $receivedValue,
                    'type_of_received' => gettype($receivedValue),
                    'hardcoded_saved_value' => 88,
                    'actual_saved_value' => $restaurant->current_occupancy,
                    'all_attributes' => $restaurant->getAttributes()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    });
    
    Route::post('/debug-simple', function (Request $request) {
        $receivedValue = $request->input('current_occupancy');
        return response()->json([
            'success' => true,
            'received_current_occupancy' => $receivedValue,
            'type_of_value' => gettype($receivedValue),
            'all_request_data' => $request->all(),
            'raw_post_data' => file_get_contents('php://input'),
            'server_time' => now()
        ]);
    });
    
    Route::get('/debug/restaurant-owner', function() {
        $user = Auth::user();
        return response()->json([
            'user_id' => $user->id,
            'user_type' => $user->user_type,
            'email' => $user->email,
            'restaurant' => \App\Models\Restaurant::where('owner_id', $user->id)->first(),
            'has_restaurant' => \App\Models\Restaurant::where('owner_id', $user->id)->exists(),
            'total_reservations' => \App\Models\Reservation::count(),
            'pending_holds_for_restaurant_14' => \App\Models\Reservation::where('restaurant_id', 14)
                ->where('status', 'pending_hold')
                ->count()
        ]);
    });
});

// ========== ADMIN ROUTES ==========
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/restaurants', [AdminController::class, 'getAllRestaurants']);
    Route::post('/suspend-restaurant/{id}', [AdminController::class, 'suspendRestaurant']);
    Route::get('/users', [AdminController::class, 'getAllUsers']);
    Route::get('/verification-requests', [AdminController::class, 'getVerificationRequests']);
    Route::post('/verify-restaurant/{id}', [AdminController::class, 'verifyRestaurant']);
    Route::post('/reject-verification/{id}', [AdminController::class, 'rejectVerification']);
    Route::get('/feature-requests', [AdminController::class, 'getFeatureRequests']);
    Route::post('/approve-feature-request/{id}', [AdminController::class, 'approveFeatureRequest']);
    Route::post('/reject-feature-request/{id}', [AdminController::class, 'rejectFeatureRequest']);
});
// ========== MOTION DETECTION ROUTES ==========

// Test endpoint
Route::post('/motion/test', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'message' => 'Motion detection API ready',
        'device' => $request->input('device', 'unknown'),
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Receive motion updates from ESP32
Route::post('/motion/update', function (Request $request) {
    \Log::info('Motion detection update', $request->all());
    
    $data = $request->validate([
        'motion_value' => 'required|integer',
        'motion_level' => 'required|in:Low,Medium,High',
        'motion_active' => 'required|boolean',
        'timestamp' => 'required'
    ]);
    
    $deviceId = $request->header('X-Device-ID', 'esp32-unknown');
    $location = $request->header('X-Location', 'unknown');
    
    // Store in database (optional)
    $motionLog = \App\Models\MotionLog::create([
        'device_id' => $deviceId,
        'location' => $location,
        'motion_value' => $data['motion_value'],
        'motion_level' => $data['motion_level'],
        'is_active' => $data['motion_active'],
        'recorded_at' => now()
    ]);
    
    // Determine crowd status based on motion
    $crowdStatus = determineCrowdStatus($data['motion_value'], $data['motion_level']);
    
    // For PWA integration - return status
    return response()->json([
        'success' => true,
        'message' => 'Motion data received',
        'crowd_status' => $crowdStatus,
        'motion_data' => $data,
        'device_info' => [
            'id' => $deviceId,
            'location' => $location
        ]
    ]);
});

// Get current motion status
Route::get('/motion/status', function () {
    $latest = \App\Models\MotionLog::latest()->first();
    
    if (!$latest) {
        return response()->json([
            'motion_active' => false,
            'motion_level' => 'Low',
            'crowd_status' => 'Quiet',
            'last_update' => null,
            'message' => 'No motion data yet'
        ]);
    }
    
    return response()->json([
        'motion_active' => (bool)$latest->is_active,
        'motion_level' => $latest->motion_level,
        'crowd_status' => determineCrowdStatus($latest->motion_value, $latest->motion_level),
        'last_update' => $latest->created_at->diffForHumans(),
        'data' => [
            'value' => $latest->motion_value,
            'location' => $latest->location,
            'device' => $latest->device_id
        ]
    ]);
});

// Helper function to determine crowd status
function determineCrowdStatus($motionValue, $motionLevel) {
    if ($motionLevel === 'High') {
        return 'Busy';
    } elseif ($motionLevel === 'Medium') {
        return 'Moderate';
    } else {
        return 'Quiet';
    }
}