<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Rules\NoBadWords;

class ReservationController extends Controller
{
    // ─── Private helper ────────────────────────────────────────────────────────
    // FIX: Extracted repeated Restaurant::where('owner_id') pattern (was copy-pasted 6×).
    //      Also applies column selection so we never do SELECT * on this hot path.

    private function getOwnerRestaurant(): Restaurant
    {
        $restaurant = Restaurant::where('owner_id', Auth::id())
            ->select(['id', 'name', 'max_capacity', 'current_occupancy', 'owner_id'])
            ->first();

        if (!$restaurant) {
            abort(response()->json([
                'success' => false,
                'message' => 'No restaurant found for this account.',
            ], 404));
        }

        return $restaurant;
    }

    // ─── Diner: list reservations ──────────────────────────────────────────────

    public function index()
    {
        try {
            $reservations = Reservation::with(['restaurant' => function ($query) {
                $query->select('id', 'name', 'address', 'profile_image');
            }])
                ->where('user_id', Auth::id())
                ->where('is_hidden', false)
                ->orderBy('reservation_date', 'desc')
                ->orderBy('reservation_time', 'desc')
                ->paginate(10);

            return response()->json([
                'success'      => true,
                'reservations' => $reservations,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch reservations: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to fetch reservations'], 500);
        }
    }

    // ─── Diner: create reservation ─────────────────────────────────────────────

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'restaurant_id'    => 'required|exists:restaurants,id',
            'party_size'       => 'required|integer|min:1|max:30',
            'reservation_date' => 'required|date|after_or_equal:today',
            'reservation_time' => 'required|date_format:H:i',
            'special_requests' => ['nullable', 'string', 'max:500', new NoBadWords('special requests')],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $restaurant = Restaurant::findOrFail($request->restaurant_id);

            // FIX: Build comparison timestamps from the actual reservation date,
            //      not today. The original code always compared against today 17:00/22:00,
            //      so any reservation for a future date would fail the check.
            $openTime  = strtotime($request->reservation_date . ' 17:00:00');
            $closeTime = strtotime($request->reservation_date . ' 22:00:00');
            $resTime   = strtotime($request->reservation_date . ' ' . $request->reservation_time);

            if ($resTime < $openTime || $resTime > $closeTime) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant is only open from 5:00 PM to 10:00 PM',
                ], 422);
            }

            // Capacity check
            $existingBooked = Reservation::where('restaurant_id', $restaurant->id)
                ->where('reservation_date', $request->reservation_date)
                ->where('reservation_time', $request->reservation_time)
                ->whereIn('status', ['pending', 'confirmed'])
                ->sum('party_size');

            if (($existingBooked + $request->party_size) > $restaurant->max_capacity) {
                return response()->json([
                    'success'            => false,
                    'message'            => 'No available tables for your party size at this time. Please try another time.',
                    'available_capacity' => $restaurant->max_capacity - $existingBooked,
                ], 422);
            }

            // FIX: Wrap create + occupancy update in a transaction so a failed
            //      occupancy save cannot leave a confirmed reservation with stale counts.
            $reservation = DB::transaction(function () use ($request, $restaurant) {
                $reservation = Reservation::create([
                    'user_id'           => Auth::id(),
                    'restaurant_id'     => $request->restaurant_id,
                    'party_size'        => $request->party_size,
                    'reservation_date'  => $request->reservation_date,
                    'reservation_time'  => $request->reservation_time,
                    'special_requests'  => $request->special_requests,
                    'status'            => 'confirmed',
                    'confirmation_code' => Reservation::generateConfirmationCode(),
                ]);

                $restaurant->current_occupancy = min(
                    $restaurant->current_occupancy + $request->party_size,
                    $restaurant->max_capacity
                );
                $restaurant->save();

                return $reservation;
            });

            $reservation->load('restaurant');

            return response()->json([
                'success'           => true,
                'message'           => 'Reservation created successfully!',
                'reservation'       => $reservation,
                'confirmation_code' => $reservation->confirmation_code,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ─── Diner: show reservation ───────────────────────────────────────────────

    public function show($id)
    {
        try {
            $reservation = Reservation::with('restaurant')
                ->where('user_id', Auth::id())
                ->findOrFail($id);

            return response()->json(['success' => true, 'reservation' => $reservation]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Reservation not found'], 404);
        }
    }

    // ─── Diner: create spot hold ───────────────────────────────────────────────

    public function holdSpot(Request $request)
    {
        // FIX: Unified to Auth::id() / Auth::user() — no more $request->user() mix.
        //      Debug logs gated behind config('app.debug').
        $user = Auth::user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not authenticated'], 401);
        }

        $validator = Validator::make($request->all(), [
            'restaurant_id'    => 'required|exists:restaurants,id',
            'party_size'       => 'required|integer|min:1|max:10',
            'hold_type'        => 'required|in:quick_10min,extended_20min',
            'special_requests' => 'nullable|string|max:200',
            'hold_fee'         => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        try {
            $restaurant     = Restaurant::findOrFail($data['restaurant_id']);
            $availableSeats = $restaurant->max_capacity - $restaurant->current_occupancy;

            if ($data['party_size'] > $availableSeats) {
                return response()->json([
                    'success'              => false,
                    'message'              => "Sorry, this restaurant cannot accommodate your party of {$data['party_size']}. Only {$availableSeats} seat" . ($availableSeats === 1 ? '' : 's') . ' available right now.',
                    'available_seats'      => $availableSeats,
                    'requested_party_size' => $data['party_size'],
                ], 422);
            }

            // FIX: Single expired-hold cleanup pass (was duplicated — ran identical
            //      query twice, second pass always found nothing).
            Reservation::where('user_id', $user->id)
                ->where('restaurant_id', $data['restaurant_id'])
                ->where('status', 'pending_hold')
                ->where('hold_status', 'pending')
                ->where(function ($q) {
                    $q->where('original_expires_at', '<=', now())
                      ->orWhereNull('original_expires_at');
                })
                ->each(function ($hold) {
                    $hold->status      = 'cancelled';
                    $hold->hold_status = 'expired';
                    $hold->saveQuietly();
                });

            // Block if an active (non-expired) hold already exists
            $existingHold = Reservation::where('user_id', $user->id)
                ->where('restaurant_id', $data['restaurant_id'])
                ->where('status', 'pending_hold')
                ->where('hold_status', 'pending')
                ->where('original_expires_at', '>', now())
                ->first();

            if ($existingHold) {
                return response()->json([
                    'success'                => false,
                    'message'                => 'You already have an active spot hold at this restaurant. Please wait for it to expire or cancel it first.',
                    'hold_expires_at'        => $existingHold->original_expires_at,
                    'time_remaining_minutes' => now()->diffInMinutes($existingHold->original_expires_at, false),
                ], 400);
            }

            $originalExpiresAt = now()->addMinutes(10);

            $hold = Reservation::create([
                'user_id'            => $user->id,
                'restaurant_id'      => $data['restaurant_id'],
                'party_size'         => $data['party_size'],
                'hold_type'          => $data['hold_type'],
                'status'             => 'pending_hold',
                'hold_status'        => 'pending',
                'expires_at'         => null,
                'original_expires_at' => $originalExpiresAt,
                'reservation_date'   => now()->format('Y-m-d'),
                'reservation_time'   => now()->format('H:i:s'),
                'special_requests'   => $data['special_requests'] ?? null,
                'hold_fee'           => $data['hold_fee'] ?? 0,
                'confirmation_code'  => 'HOLD-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'notification_count' => 0,
                'last_notified_at'   => null,
            ]);

            return response()->json([
                'success'                     => true,
                'message'                     => 'Spot hold created successfully. Restaurant has 10 minutes to accept.',
                'hold'                        => $hold->load('restaurant'),
                'confirmation_code'           => $hold->confirmation_code,
                'restaurant_response_deadline' => $originalExpiresAt->toDateTimeString(),
                'hold_duration'               => $data['hold_type'] === 'quick_10min' ? '10 minutes' : '20 minutes',
            ], 201);

        } catch (\Exception $e) {
            Log::error('Hold spot error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create spot hold: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ─── Diner: cancel hold ────────────────────────────────────────────────────

    public function destroy($id)
    {
        try {
            $reservation = Reservation::where('user_id', Auth::id())->find($id);

            if (!$reservation) {
                return response()->json(['success' => false, 'message' => 'Hold not found'], 404);
            }

            if ($reservation->status === 'cancelled') {
                return response()->json(['success' => false, 'message' => 'This hold is already cancelled'], 422);
            }

            // Check expiry against original_expires_at (the restaurant response window),
            // which is the field actually set on pending holds.
            $expiryField = $reservation->original_expires_at ?? $reservation->expires_at;
            if ($expiryField && now()->greaterThan($expiryField)) {
                return response()->json(['success' => false, 'message' => 'This hold has already expired'], 422);
            }

            $reservation->status      = 'cancelled';
            $reservation->hold_status = 'cancelled_by_user';
            $reservation->saveQuietly();

            return response()->json(['success' => true, 'message' => 'Hold cancelled successfully.']);

        } catch (\Exception $e) {
            Log::error('Hold cancellation error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to cancel hold'], 500);
        }
    }

    // ─── Diner: hide reservation from view ────────────────────────────────────

    public function removeFromView($id)
    {
        try {
            $reservation = Reservation::where('user_id', Auth::id())->find($id);

            if (!$reservation) {
                return response()->json(['success' => false, 'message' => 'Reservation not found'], 404);
            }

            $reservation->is_hidden = true;
            $reservation->saveQuietly();

            return response()->json(['success' => true, 'message' => 'Reservation removed from view']);

        } catch (\Exception $e) {
            Log::error('Remove reservation error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to remove reservation: ' . $e->getMessage()], 500);
        }
    }

    // ─── Diner: check availability ─────────────────────────────────────────────

    public function checkAvailability(Request $request, $restaurantId)
    {
        $validator = Validator::make($request->all(), [
            'date'       => 'required|date|after_or_equal:today',
            'party_size' => 'required|integer|min:1|max:30',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $restaurant = Restaurant::findOrFail($restaurantId);

        $booked = Reservation::where('restaurant_id', $restaurantId)
            ->where('reservation_date', $request->date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->selectRaw('reservation_time, SUM(party_size) as booked')
            ->groupBy('reservation_time')
            ->pluck('booked', 'reservation_time');

        $timeSlots = [];
        $current   = strtotime('17:00');
        $end       = strtotime('22:00');

        while ($current <= $end) {
            $time              = date('H:i', $current);
            $existingBooked    = (int) ($booked[$time] ?? $booked[$time . ':00'] ?? 0);
            $availableCapacity = $restaurant->max_capacity - $existingBooked;

            $timeSlots[] = [
                'time'               => $time,
                'available'          => $availableCapacity >= $request->party_size,
                'available_capacity' => $availableCapacity,
                'formatted_time'     => date('g:i A', $current),
            ];

            $current = strtotime('+30 minutes', $current);
        }

        return response()->json([
            'success'          => true,
            'restaurant'       => ['id' => $restaurant->id, 'name' => $restaurant->name, 'max_capacity' => $restaurant->max_capacity],
            'date'             => $request->date,
            'party_size'       => $request->party_size,
            'time_slots'       => $timeSlots,
            'has_availability' => collect($timeSlots)->where('available', true)->isNotEmpty(),
        ]);
    }

    // ─── Restaurant: get active spot holds ────────────────────────────────────

    public function getRestaurantSpotHolds(Request $request)
    {
        try {
            // FIX: Role check kept; verbose Log::info calls removed (were firing on
            //      every poll — 30s × all restaurant owners = significant log noise).
            if (Auth::user()->user_type !== 'restaurant_owner') {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Restaurant owners only.',
                ], 403);
            }

            // FIX: Uses getOwnerRestaurant() instead of inline Restaurant::where copy-paste.
            $restaurant = $this->getOwnerRestaurant();

            $query = Reservation::with(['user' => function ($q) {
                $q->select('id', 'name', 'email');
            }])
                ->where('restaurant_id', $restaurant->id)
                ->where('status', 'pending_hold')
                ->where('hold_status', 'pending');

            if ($request->has('hold_type')) {
                $query->where('hold_type', $request->hold_type);
            }

            $reservations = $query->orderBy('original_expires_at', 'asc')->get();

            // FIX: time_remaining and is_expired are better as model appends,
            //      but until the model is updated we keep the collection transform.
            //      Accepted holds use expires_at; pending holds use original_expires_at.
            $reservations->each(function ($reservation) {
                $expiryField = $reservation->hold_status === 'accepted'
                    ? $reservation->expires_at
                    : $reservation->original_expires_at;

                if ($expiryField) {
                    $reservation->time_remaining = now()->diffInMinutes($expiryField, false);
                    $reservation->is_expired     = $reservation->time_remaining <= 0;
                } else {
                    $reservation->time_remaining = null;
                    $reservation->is_expired     = false;
                }
            });

            return response()->json([
                'success'    => true,
                'restaurant' => [
                    'id'                => $restaurant->id,
                    'name'              => $restaurant->name,
                    'max_capacity'      => $restaurant->max_capacity,
                    'current_occupancy' => $restaurant->current_occupancy,
                ],
                'spot_holds' => $reservations,
            ]);

        } catch (\Exception $e) {
            Log::error('Error in getRestaurantSpotHolds: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    // ─── Restaurant: accept spot hold ─────────────────────────────────────────

    public function acceptSpotHold($id)
    {
        try {
            $restaurant = $this->getOwnerRestaurant();

            $hold = Reservation::where('id', $id)
                ->where('restaurant_id', $restaurant->id)
                ->where('status', 'pending_hold')
                ->first();

            if (!$hold) {
                return response()->json(['success' => false, 'message' => 'Spot hold not found or already processed'], 404);
            }

            $availableCapacity = $restaurant->max_capacity - $restaurant->current_occupancy;

            if ($availableCapacity < $hold->party_size) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough capacity to accept this hold. Available: ' . $availableCapacity,
                ], 422);
            }

            $holdDuration = $hold->hold_type === 'quick_10min' ? 10 : 20;

            // FIX: Wrap hold status update + occupancy save in a transaction.
            //      If the restaurant save fails, the hold is not left in a confirmed
            //      state with stale occupancy counts.
            DB::transaction(function () use ($hold, $restaurant, $holdDuration) {
                $now = now();
                $hold->expires_at   = $now->copy()->addMinutes($holdDuration);
                $hold->accepted_at  = $now;
                $hold->status       = 'confirmed';
                $hold->hold_status  = 'accepted';
                $hold->save();

                $restaurant->current_occupancy += $hold->party_size;
                $restaurant->save();
            });

            $this->createHoldNotification($hold, 'accepted');

            return response()->json([
                'success'              => true,
                'message'              => 'Spot hold accepted! Reservation confirmed.',
                'reservation'          => $hold->load('user'),
                'restaurant_occupancy' => [
                    'current'   => $restaurant->current_occupancy,
                    'max'       => $restaurant->max_capacity,
                    'available' => $restaurant->max_capacity - $restaurant->current_occupancy,
                ],
                'expires_at'     => $hold->expires_at,
                'time_remaining' => now()->diffInMinutes($hold->expires_at, false),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to accept spot hold: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to accept spot hold: ' . $e->getMessage()], 500);
        }
    }

    // ─── Restaurant: reject spot hold ─────────────────────────────────────────

    public function rejectSpotHold($id)
    {
        try {
            $restaurant = $this->getOwnerRestaurant();

            $hold = Reservation::where('id', $id)
                ->where('restaurant_id', $restaurant->id)
                ->where('status', 'pending_hold')
                ->first();

            if (!$hold) {
                return response()->json(['success' => false, 'message' => 'Spot hold not found or already processed'], 404);
            }

            $hold->status      = 'cancelled';
            $hold->hold_status = 'rejected';
            $hold->saveQuietly();

            $this->createHoldNotification($hold, 'rejected');

            return response()->json(['success' => true, 'message' => 'Spot hold rejected.', 'reservation' => $hold]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to reject spot hold: ' . $e->getMessage()], 500);
        }
    }

    // ─── Restaurant: today's reservations ─────────────────────────────────────

    public function getTodaysReservations()
    {
        try {
            $restaurant   = $this->getOwnerRestaurant();
            $today        = now()->toDateString();

            $reservations = Reservation::with(['user' => function ($q) {
                $q->select('id', 'name', 'email');
            }])
                ->where('restaurant_id', $restaurant->id)
                ->where('status', 'confirmed')
                ->where('reservation_date', $today)
                ->orderBy('reservation_time')
                ->get();

            return response()->json(['success' => true, 'date' => $today, 'reservations' => $reservations]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch today\'s reservations: ' . $e->getMessage()], 500);
        }
    }

    // ─── Restaurant: expired holds ─────────────────────────────────────────────

    public function getExpiredSpotHolds()
    {
        try {
            $restaurant   = $this->getOwnerRestaurant();

            $expiredHolds = Reservation::with(['user' => function ($q) {
                $q->select('id', 'name', 'email');
            }])
                ->where('restaurant_id', $restaurant->id)
                ->where('is_hidden', false)
                ->where(function ($query) {
                    $query->where(function ($q) {
                        // Pending holds whose restaurant-response window has closed
                        $q->where('status', 'pending_hold')
                          ->where('hold_status', 'pending')
                          ->where('original_expires_at', '<=', now());
                    })->orWhere(function ($q) {
                        // Accepted holds whose arrival window has closed
                        $q->where('status', 'confirmed')
                          ->where('hold_status', 'accepted')
                          ->where('expires_at', '<=', now());
                    })->orWhereIn('hold_status', ['expired', 'rejected'])
                      ->orWhere('status', 'expired');
                })
                ->orderBy('original_expires_at', 'desc')
                ->limit(50)
                ->get();

            return response()->json(['success' => true, 'expired_holds' => $expiredHolds]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch expired holds: ' . $e->getMessage()], 500);
        }
    }

    // ─── Restaurant: hide expired hold ────────────────────────────────────────

    public function hideExpiredHold($id)
    {
        try {
            $restaurant = $this->getOwnerRestaurant();

            $hold = Reservation::where('id', $id)
                ->where('restaurant_id', $restaurant->id)
                ->first();

            if (!$hold) {
                return response()->json(['success' => false, 'message' => 'Hold not found'], 404);
            }

            $hold->is_hidden = true;
            $hold->saveQuietly();

            return response()->json(['success' => true, 'message' => 'Hold hidden successfully']);

        } catch (\Exception $e) {
            Log::error('Hide expired hold error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    // ─── Private: notification helper ─────────────────────────────────────────
    // NOTE: This should eventually move to a NotificationService or queued job
    //       so it doesn't block the HTTP response. Keeping it here for now to
    //       match the existing architecture.

    private function createHoldNotification($reservation, string $action): void
    {
        try {
            if ($action === 'accepted') {
                $message          = "Your spot hold at {$reservation->restaurant->name} has been accepted! Your table for {$reservation->party_size} is confirmed.";
                $notificationType = 'hold_accepted';
            } else {
                $message          = "Your spot hold at {$reservation->restaurant->name} was not accepted. Please try another restaurant.";
                $notificationType = 'hold_rejected';
            }

            \App\Models\NotificationLog::create([
                'user_id'      => $reservation->user_id,
                'type'         => $notificationType,
                'title'        => 'Spot Hold Update',
                'message'      => $message,
                'related_id'   => $reservation->id,
                'related_type' => 'App\Models\Reservation',
                'is_read'      => false,
                'metadata'     => json_encode([
                    'reservation_id'    => $reservation->id,
                    'restaurant_name'   => $reservation->restaurant->name,
                    'party_size'        => $reservation->party_size,
                    'confirmation_code' => $reservation->confirmation_code,
                ]),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create hold notification: ' . $e->getMessage());
        }
    }
}