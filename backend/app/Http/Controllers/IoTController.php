<?php
// app/Http/Controllers/IoTController.php

namespace App\Http\Controllers;

use App\Models\IotDevice;
use App\Models\Restaurant;
use App\Models\OccupancyLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IoTController extends Controller
{
    /**
     * Get IoT devices for restaurant owner
     * GET /api/iot/devices
     */
    public function getDevices(Request $request)
    {
        Log::info('IoT getDevices called');

        try {
            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not authenticated'
                ], 401);
            }

            if ($user->user_type !== 'restaurant_owner') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only restaurant owners can access IoT devices'
                ], 403);
            }

            $restaurant = Restaurant::where('owner_id', $user->id)->first();

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant not found'
                ], 404);
            }

            // Get devices - PHP 7.4 COMPATIBLE
            $devices = IotDevice::where('restaurant_id', $restaurant->id)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($device) {
                    return [
                        'id' => $device->id,
                        'device_id' => $device->device_id,
                        'device_name' => $device->device_name,
                        'device_type' => $device->device_type,
                        'is_active' => $device->is_active,
                        'is_online' => $device->last_seen && $device->last_seen->gt(now()->subMinutes(5)),
                        'last_seen' => $device->last_seen ? $device->last_seen->format('Y-m-d H:i:s') : null,
                        'created_at' => $device->created_at->format('Y-m-d H:i:s'),
                        'config' => $device->config
                    ];
                });

            return response()->json([
                'success' => true,
                'restaurant' => [
                    'id' => $restaurant->id,
                    'name' => $restaurant->name,
                    'current_occupancy' => $restaurant->current_occupancy,
                    'max_capacity' => $restaurant->max_capacity
                ],
                'devices' => $devices,
                'count' => $devices->count()
            ]);
        } catch (\Exception $e) {
            Log::error('getDevices error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Register a new IoT device
     * POST /api/iot/register-device
     */
    public function registerDevice(Request $request)
    {
        Log::info('IoT registerDevice called');

        try {
            $user = auth()->user();

            if (!$user || $user->user_type !== 'restaurant_owner') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only restaurant owners can register devices'
                ], 403);
            }

            $restaurant = Restaurant::where('owner_id', $user->id)->first();

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'You need to create a restaurant first'
                ], 404);
            }

            $validated = $request->validate([
                'device_id' => 'required|string|max:100',
                'device_name' => 'nullable|string|max:100',
                'device_type' => 'in:esp32_button,esp32_camera,other'
            ]);

            // Create simple API key
            $apiKey = 'iot_' . bin2hex(random_bytes(16));

            // Create device
            $device = IotDevice::create([
                'restaurant_id' => $restaurant->id,
                'device_id' => $validated['device_id'],
                'device_name' => $validated['device_name'] ?? 'ESP32 Button Counter',
                'device_type' => $validated['device_type'] ?? 'esp32_button',
                'api_key' => $apiKey,
                'ip_address' => $request->ip(),
                'last_seen' => now(),
                'config' => [
                    'button_type' => 'entry_exit',
                    'max_capacity' => $restaurant->max_capacity,
                    'polling_interval' => 30,
                    'led_feedback' => true
                ]
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Device registered successfully',
                'device' => [
                    'id' => $device->id,
                    'device_id' => $device->device_id,
                    'device_name' => $device->device_name,
                    'api_key' => $device->api_key,
                    'restaurant_id' => $device->restaurant_id,
                    'restaurant_name' => $restaurant->name
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('registerDevice error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to register device: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update occupancy from ESP32
     * POST /api/iot/update-occupancy
     */
    public function updateOccupancy(Request $request)
    {
        // Log immediately
        Log::info('📡 ESP32 Request:', $request->all());

        // Quick minimal validation
        $data = $request->all();

        if (!isset($data['device_id']) || !isset($data['restaurant_id'])) {
            return response()->json([
                'success' => false,
                'message' => 'Missing fields'
            ], 400);
        }

        // Find or create restaurant
        $restaurant = \App\Models\Restaurant::find($data['restaurant_id']);

        if (!$restaurant) {
            return response()->json([
                'success' => false,
                'message' => 'Restaurant not found'
            ], 404);
        }

        // Update occupancy - use current_count from ESP32
        $newOccupancy = $data['current_count'] ?? 0;

        // Ensure occupancy doesn't exceed max capacity
        if ($newOccupancy > $restaurant->max_capacity) {
            $newOccupancy = $restaurant->max_capacity;
        }

        if ($newOccupancy < 0) {
            $newOccupancy = 0;
        }

        $restaurant->update([
            'current_occupancy' => $newOccupancy
        ]);

        Log::info('✅ Updated restaurant ' . $restaurant->id . ' to ' . $restaurant->current_occupancy);

        // Also create an occupancy log
        OccupancyLog::create([
            'device_id' => $data['device_id'] ?? 'unknown',
            'restaurant_id' => $restaurant->id,
            'action' => $data['action'] ?? 'unknown',
            'capacity_before' => $restaurant->getOriginal('current_occupancy'),
            'capacity_after' => $restaurant->current_occupancy,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => '✅ IoT Update Successful!',
            'data' => [
                'restaurant_id' => $restaurant->id,
                'restaurant_name' => $restaurant->name,
                'current_occupancy' => $restaurant->current_occupancy,
                'max_capacity' => $restaurant->max_capacity,
                'updated_at' => now()->format('H:i:s')
            ]
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    /**
     * Reset IoT device counters
     * POST /api/iot/reset-counters
     */
    public function resetCounters(Request $request)
    {
        try {
            $user = auth()->user();
            if (!$user || $user->user_type !== 'restaurant_owner') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only restaurant owners can reset counters'
                ], 403);
            }

            $restaurant = Restaurant::where('owner_id', $user->id)->first();

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant not found'
                ], 404);
            }

            $validated = $request->validate([
                'device_id' => 'required|string',
                'reason' => 'nullable|string|max:200'
            ]);

            $device = IotDevice::where('device_id', $validated['device_id'])
                ->where('restaurant_id', $restaurant->id)
                ->first();

            if (!$device) {
                return response()->json([
                    'success' => false,
                    'message' => 'Device not found'
                ], 404);
            }

            // Reset restaurant occupancy to 0
            $restaurant->update(['current_occupancy' => 0]);
            $restaurant->refresh();

            // Log the reset
            OccupancyLog::create([
                'restaurant_id' => $restaurant->id,
                'occupancy_count' => 0,
                'occupancy_percentage' => 0,
                'crowd_status' => 'green',
                'source_type' => 'manual',
                'is_estimated' => true,
                'notes' => "Counter reset. Reason: " . ($validated['reason'] ?? 'Manual reset')
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Counters reset successfully',
                'data' => [
                    'restaurant_id' => $restaurant->id,
                    'new_occupancy' => 0,
                    'crowd_status' => 'green'
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('resetCounters error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset counters'
            ], 500);
        }
    }

    /**
     * Sync pending counts from ESP32
     * POST /api/iot/sync-counts
     */
    public function syncCounts(Request $request)
    {
        try {
            $validated = $request->validate([
                'device_id' => 'required|string',
                'restaurant_id' => 'required|integer|exists:restaurants,id',
                'pending_entries' => 'required|integer|min:0',
                'pending_exits' => 'required|integer|min:0',
                'current_count' => 'required|integer|min:0'
            ]);

            // Call updateOccupancy with the current count
            return $this->updateOccupancy($request);
        } catch (\Exception $e) {
            Log::error('syncCounts error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
