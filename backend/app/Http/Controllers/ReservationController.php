<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Rules\NoBadWords;

class ReservationController extends Controller
{
    /**
     * Display a listing of the user's reservations.
     */
    public function index()
    {
        try {
            // First, auto-update any expired holds
            $expiredHolds = Reservation::where('user_id', Auth::id())
                ->where('status', 'pending_hold')
                ->where('expires_at', '<', now())
                ->get();

            foreach ($expiredHolds as $hold) {
                $hold->status = 'cancelled';
                $hold->hold_status = 'rejected';
                $hold->save();
            }

            // Now get non-hidden reservations
            $reservations = Reservation::with(['restaurant' => function ($query) {
                $query->select('id', 'name', 'address', 'profile_image');
            }])
                ->where('user_id', Auth::id())
                ->where('is_hidden', false)
                ->orderBy('reservation_date', 'desc')
                ->orderBy('reservation_time', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'reservations' => $reservations,
                'auto_updated_expired' => $expiredHolds->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch reservations: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reservations'
            ], 500);
        }
    }

    /**
     * Store a newly created reservation.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'restaurant_id' => 'required|exists:restaurants,id',
            'party_size' => 'required|integer|min:1|max:30',
            'reservation_date' => 'required|date|after_or_equal:today',
            'reservation_time' => 'required|date_format:H:i',
            'special_requests' => [
                'nullable',
                'string',
                'max:500',
                new NoBadWords('special requests')
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $restaurant = Restaurant::findOrFail($request->restaurant_id);

            // Check if restaurant is open (basic check)
            $currentTime = now();
            $reservationDateTime = $request->reservation_date . ' ' . $request->reservation_time;

            if (
                strtotime($reservationDateTime) < strtotime('today 17:00') ||
                strtotime($reservationDateTime) > strtotime('today 22:00')
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant is only open from 5:00 PM to 10:00 PM'
                ], 422);
            }

            // Check capacity
            $existingReservations = Reservation::where('restaurant_id', $restaurant->id)
                ->where('reservation_date', $request->reservation_date)
                ->where('reservation_time', $request->reservation_time)
                ->whereIn('status', ['pending', 'confirmed'])
                ->sum('party_size');

            $totalOccupancy = $existingReservations + $request->party_size;

            if ($totalOccupancy > $restaurant->max_capacity) {
                return response()->json([
                    'success' => false,
                    'message' => 'No available tables for your party size at this time. Please try another time.',
                    'available_capacity' => $restaurant->max_capacity - $existingReservations
                ], 422);
            }

            $reservation = Reservation::create([
                'user_id' => Auth::id(),
                'restaurant_id' => $request->restaurant_id,
                'party_size' => $request->party_size,
                'reservation_date' => $request->reservation_date,
                'reservation_time' => $request->reservation_time,
                'special_requests' => $request->special_requests,
                'status' => 'confirmed',
                'confirmation_code' => Reservation::generateConfirmationCode()
            ]);

            // Update restaurant current occupancy (optional)
            $restaurant->current_occupancy = min(
                $restaurant->current_occupancy + $request->party_size,
                $restaurant->max_capacity
            );
            $restaurant->save();

            // Load relationship for response
            $reservation->load('restaurant');

            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully!',
                'reservation' => $reservation,
                'confirmation_code' => $reservation->confirmation_code
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified reservation.
     */
    public function show($id)
    {
        try {
            $reservation = Reservation::with('restaurant')
                ->where('user_id', Auth::id())
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'reservation' => $reservation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }
    }

    public function holdSpot(Request $request)
    {
        try {
            Log::info('HoldSpot Request Data:', $request->all());

            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'restaurant_id' => 'required|exists:restaurants,id',
                'party_size' => 'required|integer|min:1|max:10',
                'hold_type' => 'required|in:quick_10min,extended_20min',
                'special_requests' => 'nullable|string|max:200',
                'hold_fee' => 'nullable|numeric|min:0'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            // Check if user already has an active hold at this restaurant
            $existingHold = Reservation::where('user_id', $user->id)
                ->where('restaurant_id', $data['restaurant_id'])
                ->where('hold_status', 'pending')
                ->where(function ($query) {
                    $query->where('original_expires_at', '>', now())
                        ->orWhereNull('original_expires_at');
                })
                ->first();

            if ($existingHold) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an active hold at this restaurant'
                ], 400);
            }

            // ✅ FIXED: Set original_expires_at (10 minutes for restaurant to respond)
            $originalExpiresAt = now()->addMinutes(10);

            // ✅ FIXED: expires_at should be NULL initially
            // Timer only starts when restaurant accepts

            // Create hold
            $holdData = [
                'user_id' => $user->id,
                'restaurant_id' => $data['restaurant_id'],
                'party_size' => $data['party_size'],
                'hold_type' => $data['hold_type'],
                'status' => 'pending_hold',
                'hold_status' => 'pending',
                'expires_at' => null, // ✅ IMPORTANT: NULL until accepted
                'original_expires_at' => $originalExpiresAt, // ✅ 10-min restaurant response deadline
                'reservation_date' => now()->format('Y-m-d'),
                'reservation_time' => now()->format('H:i:s'),
                'special_requests' => $data['special_requests'] ?? null,
                'hold_fee' => $data['hold_fee'] ?? 0,
                'confirmation_code' => 'HOLD-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'notification_count' => 0,
                'last_notified_at' => null,
            ];

            Log::info('Creating hold with data:', $holdData);

            try {
                $hold = Reservation::create($holdData);

                Log::info('Hold created successfully:', ['hold_id' => $hold->id]);

                return response()->json([
                    'success' => true,
                    'message' => 'Spot hold created successfully. Restaurant has 10 minutes to accept.',
                    'hold' => $hold->load('restaurant'),
                    'confirmation_code' => $hold->confirmation_code,
                    'restaurant_response_deadline' => $originalExpiresAt->toDateTimeString(),
                    'hold_duration' => $data['hold_type'] === 'quick_10min' ? '10 minutes' : '20 minutes'
                ], 201);
            } catch (\Exception $dbError) {
                Log::error('Database error creating hold:', [
                    'error' => $dbError->getMessage(),
                    'trace' => $dbError->getTraceAsString(),
                    'data' => $holdData
                ]);

                if (strpos($dbError->getMessage(), 'Unknown column') !== false) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Database configuration issue. Please run migrations or add missing columns.',
                        'error_details' => $dbError->getMessage()
                    ], 500);
                }

                throw $dbError;
            }
        } catch (\Exception $e) {
            Log::error('Hold spot error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create spot hold: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Cancel the specified reservation.
     */
    public function destroy($id)
    {
        try {
            $reservation = Reservation::where('user_id', Auth::id())->find($id);

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hold not found'
                ], 404);
            }

            // Check if it's already cancelled or expired
            if ($reservation->status === 'cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => 'This hold is already cancelled'
                ], 422);
            }

            // Check if it's already expired
            if ($reservation->status === 'pending_hold' && $reservation->expires_at) {
                $expiresAt = new \DateTime($reservation->expires_at);
                $now = new \DateTime();
                if ($expiresAt < $now) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This hold has already expired'
                    ], 422);
                }
            }

            // Cancel the hold
            $reservation->status = 'cancelled';
            $reservation->hold_status = 'cancelled_by_user';
            $reservation->save();

            return response()->json([
                'success' => true,
                'message' => 'Hold cancelled successfully.'
            ]);
        } catch (\Exception $e) {
            Log::error('Hold cancellation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel hold'
            ], 500);
        }
    }
    /**
     * Remove/hide a reservation from user's view
     */
    public function removeFromView($id)
    {
        try {
            $user = Auth::user();

            // Find reservation owned by user
            $reservation = Reservation::where('user_id', $user->id)->find($id);

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservation not found'
                ], 404);
            }

            // Check if reservation can be removed
            $canRemove = false;

            // Always allow: cancelled, rejected, completed
            if (in_array($reservation->status, ['cancelled', 'rejected', 'completed'])) {
                $canRemove = true;
            }

            // Check if it's an expired hold
            if ($reservation->status === 'pending_hold') {
                // Check original_expires_at first
                if ($reservation->original_expires_at) {
                    $expiresAt = new \DateTime($reservation->original_expires_at);
                    $now = new \DateTime();
                    if ($expiresAt < $now) {
                        $canRemove = true;
                    }
                }
                // Check expires_at for old holds
                elseif ($reservation->expires_at) {
                    $expiresAt = new \DateTime($reservation->expires_at);
                    $now = new \DateTime();
                    if ($expiresAt < $now) {
                        $canRemove = true;
                    }
                }
                // If both are NULL, check if hold was created more than 10 minutes ago
                else if ($reservation->created_at) {
                    $createdAt = new \DateTime($reservation->created_at);
                    $now = new \DateTime();
                    $minutesSinceCreation = ($now->getTimestamp() - $createdAt->getTimestamp()) / 60;

                    // If hold was created more than 10 minutes ago
                    if ($minutesSinceCreation > 10) {
                        $canRemove = true;
                    }
                }
            }

            // Also allow expired holds (status changed to 'expired')
            if ($reservation->status === 'expired') {
                $canRemove = true;
            }

            if (!$canRemove) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only cancelled, rejected, completed, or expired reservations can be removed. ' .
                        'Current status: ' . $reservation->status .
                        ', Hold status: ' . $reservation->hold_status .
                        ', Created: ' . $reservation->created_at
                ], 422);
            }

            // Mark as hidden
            $reservation->is_hidden = true;
            $reservation->save();

            return response()->json([
                'success' => true,
                'message' => 'Reservation removed from view'
            ]);
        } catch (\Exception $e) {
            Log::error('Remove reservation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove reservation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check availability for a restaurant.
     */
    public function checkAvailability(Request $request, $restaurantId)
    {
        Log::info('🔍 checkAvailability called', [
            'restaurantId' => $restaurantId,
            'date' => $request->date,
            'party_size' => $request->party_size,
            'fullUrl' => $request->fullUrl()
        ]);

        try {
            $validator = Validator::make($request->all(), [
                'date' => 'required|date|after_or_equal:today',
                'party_size' => 'required|integer|min:1|max:30'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $restaurant = Restaurant::findOrFail($restaurantId);

            Log::info('Restaurant found', [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'max_capacity' => $restaurant->max_capacity
            ]);

            // Generate time slots (5 PM to 10 PM, every 30 minutes)
            $timeSlots = [];
            $startTime = '17:00';
            $endTime = '22:00';

            $current = strtotime($startTime);
            $end = strtotime($endTime);

            while ($current <= $end) {
                $time = date('H:i', $current);

                // Check capacity for this time slot
                $existingReservations = Reservation::where('restaurant_id', $restaurantId)
                    ->where('reservation_date', $request->date)
                    ->where('reservation_time', $time)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->sum('party_size');

                $availableCapacity = $restaurant->max_capacity - $existingReservations;
                $isAvailable = $availableCapacity >= $request->party_size;

                $timeSlots[] = [
                    'time' => $time,
                    'available' => $isAvailable,
                    'available_capacity' => $availableCapacity,
                    'formatted_time' => date('g:i A', $current)
                ];

                $current = strtotime('+30 minutes', $current);
            }

            Log::info('Availability calculated', [
                'time_slots_count' => count($timeSlots),
                'has_availability' => collect($timeSlots)->where('available', true)->count() > 0
            ]);

            return response()->json([
                'success' => true,
                'restaurant' => [
                    'id' => $restaurant->id,
                    'name' => $restaurant->name,
                    'max_capacity' => $restaurant->max_capacity
                ],
                'date' => $request->date,
                'party_size' => $request->party_size,
                'time_slots' => $timeSlots,
                'has_availability' => collect($timeSlots)->where('available', true)->count() > 0
            ]);
        } catch (\Exception $e) {
            Log::error('checkAvailability failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check availability: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getRestaurantSpotHolds(Request $request)
    {
        // Use Log facade (without backslash)
        Log::info('========== getRestaurantSpotHolds CALLED ==========');

        try {
            // Check authentication
            if (!Auth::check()) {
                Log::error('User not authenticated');
                return response()->json([
                    'success' => false,
                    'message' => 'Not authenticated'
                ], 401);
            }

            $user = Auth::user();
            Log::info('User info', [
                'id' => $user->id,
                'email' => $user->email,
                'user_type' => $user->user_type
            ]);

            // Check if user is a restaurant owner
            if ($user->user_type !== 'restaurant_owner') {
                Log::warning('User is not restaurant owner', [
                    'actual_type' => $user->user_type,
                    'required_type' => 'restaurant_owner'
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Restaurant owners only.',
                    'user_type' => $user->user_type
                ], 403);
            }

            // Get the restaurant owned by this user
            Log::info('Looking for restaurant with owner_id', ['owner_id' => $user->id]);
            $restaurant = Restaurant::where('owner_id', $user->id)->first();

            if (!$restaurant) {
                Log::warning('No restaurant found for user', [
                    'user_id' => $user->id,
                    'user_email' => $user->email
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'No restaurant found for this user.',
                    'user_id' => $user->id
                ], 404);
            }

            Log::info('Restaurant found', [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'owner_id' => $restaurant->owner_id
            ]);

            // Get active spot holds (NOT expired)
            $query = Reservation::with(['user' => function ($q) {
                $q->select('id', 'name', 'email');
            }])
                ->where('restaurant_id', $restaurant->id)
                ->where('status', 'pending_hold')
                ->where('hold_status', 'pending');

            // Show holds where restaurant still has time to respond
            $query->where(function ($q) {
                $q->where('original_expires_at', '>', now())
                    ->orWhere(function ($q2) {
                        // For backward compatibility with old holds
                        $q2->whereNull('original_expires_at')
                            ->where('expires_at', '>', now());
                    });
            });

            // Filter by hold type if specified
            if ($request->has('hold_type')) {
                $query->where('hold_type', $request->hold_type);
            }

            // Order by expiration (soonest first)
            $reservations = $query->orderBy('original_expires_at', 'asc')->get();

            Log::info('Found reservations', [
                'count' => $reservations->count(),
                'restaurant_id' => $restaurant->id
            ]);

            // ✅ FIXED: Calculate time remaining based on correct field
            $reservations->each(function ($reservation) {
                if ($reservation->hold_status === 'pending') {
                    // For pending holds, use original_expires_at (restaurant response deadline)
                    $reservation->time_remaining = now()->diffInMinutes($reservation->original_expires_at, false);
                    $reservation->is_expired = $reservation->time_remaining <= 0;
                } elseif ($reservation->hold_status === 'accepted' && $reservation->expires_at) {
                    // For accepted holds, use expires_at (timer from acceptance)
                    $reservation->time_remaining = now()->diffInMinutes($reservation->expires_at, false);
                    $reservation->is_expired = $reservation->time_remaining <= 0;
                } else {
                    $reservation->time_remaining = null;
                    $reservation->is_expired = false;
                }
            });

            Log::info('========== REQUEST COMPLETED SUCCESSFULLY ==========');

            return response()->json([
                'success' => true,
                'restaurant' => [
                    'id' => $restaurant->id,
                    'name' => $restaurant->name,
                    'max_capacity' => $restaurant->max_capacity,
                    'current_occupancy' => $restaurant->current_occupancy
                ],
                'spot_holds' => $reservations,
                'counts' => [
                    'active_holds' => $reservations->count(),
                    'expired_holds' => Reservation::where('restaurant_id', $restaurant->id)
                        ->where('status', 'pending_hold')
                        ->where('expires_at', '<=', now())
                        ->count(),
                    'total_confirmed' => Reservation::where('restaurant_id', $restaurant->id)
                        ->where('status', 'confirmed')
                        ->count(),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getRestaurantSpotHolds: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Accept a spot hold (convert to confirmed reservation)
     */
    public function acceptSpotHold($id)
    {
        try {
            Log::info('Accepting spot hold:', ['hold_id' => $id]);

            $user = Auth::user();
            $restaurant = Restaurant::where('owner_id', $user->id)->first();

            if (!$restaurant) {
                Log::error('No restaurant found for user:', ['user_id' => $user->id]);
                return response()->json([
                    'success' => false,
                    'message' => 'No restaurant found'
                ], 404);
            }

            $hold = Reservation::where('id', $id)
                ->where('restaurant_id', $restaurant->id)
                ->where('status', 'pending_hold')
                // Remove the expires_at check since we'll reset it
                // ->where('expires_at', '>', now())
                ->first();

            if (!$hold) {
                Log::error('Hold not found or not pending:', ['hold_id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Spot hold not found or already processed'
                ], 404);
            }

            // Check restaurant capacity
            $currentOccupancy = $restaurant->current_occupancy;
            $availableCapacity = $restaurant->max_capacity - $currentOccupancy;

            if ($availableCapacity < $hold->party_size) {
                Log::warning('Not enough capacity', [
                    'available' => $availableCapacity,
                    'needed' => $hold->party_size
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough capacity to accept this hold. Available: ' . $availableCapacity
                ], 422);
            }

            // ✅ TIMER RESET LOGIC:
            // 1. Store original expiry (for record keeping)
            // 2. Set new expiry based on when accepted + hold duration
            $holdDuration = $hold->hold_type === 'quick_10min' ? 10 : 20;
            $now = now();

            // Store original expiry if not already stored
            if (!$hold->original_expires_at && $hold->expires_at) {
                $hold->original_expires_at = $hold->expires_at;
            }

            // Set new expiry (starts now, not from when hold was created)
            $hold->expires_at = $now->copy()->addMinutes($holdDuration);
            $hold->accepted_at = $now;

            // Convert hold to confirmed reservation
            $hold->status = 'confirmed';
            $hold->hold_status = 'accepted';
            $hold->save();

            // Update restaurant occupancy
            $restaurant->current_occupancy = $currentOccupancy + $hold->party_size;
            $restaurant->save();

            // Create notification for diner
            $this->createHoldNotification($hold, 'accepted');

            Log::info('Hold accepted successfully', [
                'hold_id' => $hold->id,
                'new_expiry' => $hold->expires_at,
                'hold_duration' => $holdDuration,
                'party_size' => $hold->party_size
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Spot hold accepted! Reservation confirmed.',
                'reservation' => $hold->load('user'),
                'restaurant_occupancy' => [
                    'current' => $restaurant->current_occupancy,
                    'max' => $restaurant->max_capacity,
                    'available' => $restaurant->max_capacity - $restaurant->current_occupancy
                ],
                'expires_at' => $hold->expires_at,
                'time_remaining' => now()->diffInMinutes($hold->expires_at, false)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to accept spot hold:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept spot hold: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject a spot hold
     */
    public function rejectSpotHold($id)
    {
        try {
            $user = Auth::user();
            $restaurant = Restaurant::where('owner_id', $user->id)->first();

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'No restaurant found'
                ], 404);
            }

            $hold = Reservation::where('id', $id)
                ->where('restaurant_id', $restaurant->id)
                ->where('status', 'pending_hold')
                ->first();

            if (!$hold) {
                return response()->json([
                    'success' => false,
                    'message' => 'Spot hold not found or already processed'
                ], 404);
            }

            // Reject the hold
            $hold->status = 'cancelled';
            $hold->hold_status = 'rejected';
            $hold->save();

            // Create notification for diner
            $this->createHoldNotification($hold, 'rejected');

            return response()->json([
                'success' => true,
                'message' => 'Spot hold rejected.',
                'reservation' => $hold
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject spot hold: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get today's confirmed reservations (from accepted holds)
     */
    public function getTodaysReservations()
    {
        try {
            $user = Auth::user();
            $restaurant = Restaurant::where('owner_id', $user->id)->first();

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'No restaurant found'
                ], 404);
            }

            $today = now()->toDateString();

            $reservations = Reservation::with(['user' => function ($q) {
                $q->select('id', 'name', 'email');
            }])
                ->where('restaurant_id', $restaurant->id)
                ->where('status', 'confirmed')
                ->where('reservation_date', $today)
                ->orderBy('reservation_time')
                ->get();

            return response()->json([
                'success' => true,
                'date' => $today,
                'reservations' => $reservations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch today\'s reservations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get expired spot holds (for cleanup/reporting)
     */
    public function getExpiredSpotHolds()
    {
        try {
            $user = Auth::user();
            $restaurant = Restaurant::where('owner_id', $user->id)->first();

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'No restaurant found'
                ], 404);
            }

            // Get ALL expired holds
            $expiredHolds = Reservation::with(['user'])
                ->where('restaurant_id', $restaurant->id)
                ->where(function ($query) {
                    $query->where(function ($q) {
                        // Restaurant didn't respond in time
                        $q->where('status', 'pending_hold')
                            ->where('hold_status', 'pending')
                            ->where('original_expires_at', '<=', now());
                    })->orWhere(function ($q) {
                        // Hold expired after acceptance
                        $q->where('status', 'confirmed')
                            ->where('hold_status', 'accepted')
                            ->where('expires_at', '<=', now());
                    })->orWhere(function ($q) {
                        // Already marked as expired or rejected
                        $q->where('hold_status', 'expired')
                            ->orWhere('hold_status', 'rejected');
                    });
                })
                ->orderBy('original_expires_at', 'desc')
                ->limit(50)
                ->get();

            return response()->json([
                'success' => true,
                'expired_holds' => $expiredHolds
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch expired holds: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper: Create notification for diner about hold status
     */
    private function createHoldNotification($reservation, $action)
    {
        try {
            // You'll need to implement this based on your notification system
            $message = '';
            $notificationType = '';

            if ($action === 'accepted') {
                $message = "Your spot hold at {$reservation->restaurant->name} has been accepted! Your table for {$reservation->party_size} is confirmed.";
                $notificationType = 'hold_accepted';
            } else {
                $message = "Your spot hold at {$reservation->restaurant->name} was not accepted. Please try another restaurant.";
                $notificationType = 'hold_rejected';
            }

            // Create notification in your notification_logs table
            \App\Models\NotificationLog::create([
                'user_id' => $reservation->user_id,
                'type' => $notificationType,
                'title' => 'Spot Hold Update',
                'message' => $message,
                'related_id' => $reservation->id,
                'related_type' => 'App\Models\Reservation',
                'is_read' => false,
                'metadata' => json_encode([
                    'reservation_id' => $reservation->id,
                    'restaurant_name' => $reservation->restaurant->name,
                    'party_size' => $reservation->party_size,
                    'confirmation_code' => $reservation->confirmation_code
                ])
            ]);
        } catch (\Exception $e) {
            // Log error but don't fail the main operation
            Log::error('Failed to create hold notification: ' . $e->getMessage());
        }
    }
}
