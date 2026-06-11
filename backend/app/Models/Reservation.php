<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;

    // ─── Mass-assignable fields ────────────────────────────────────────────────

    protected $fillable = [
        'user_id',
        'restaurant_id',
        'party_size',
        'reservation_date',
        'reservation_time',
        'status',
        'special_requests',
        'confirmation_code',
        'notification_count',
        'last_notified_at',
        'hold_type',
        'expires_at',
        'hold_status',
        'original_expires_at',
        'accepted_at',
        'is_hidden',
        'hold_fee',
        'cancelled_at',
    ];

    // ─── Casts ─────────────────────────────────────────────────────────────────
    // FIX: Added missing casts so Carbon comparisons work correctly throughout
    //      the app without manual `new \DateTime()` construction.

    protected $casts = [
        'reservation_date'   => 'date',
        'expires_at'         => 'datetime',
        'original_expires_at' => 'datetime',
        'accepted_at'        => 'datetime',
        'cancelled_at'       => 'datetime',
        'last_notified_at'   => 'datetime',
        'party_size'         => 'integer',
        'notification_count' => 'integer',
        'hold_fee'           => 'float',
        'is_hidden'          => 'boolean',
    ];

    // ─── Appended computed attributes ─────────────────────────────────────────
    // FIX: time_remaining and is_expired were calculated ad-hoc in both the
    //      controller (getRestaurantSpotHolds) and the frontend. Defining them
    //      as appends means every query result carries them automatically,
    //      removing the need for the each() transform in the controller.

    protected $appends = ['time_remaining', 'is_expired'];

    public function getTimeRemainingAttribute(): ?int
    {
        // Accepted holds count down against expires_at (arrival window).
        // Pending holds count down against original_expires_at (restaurant response window).
        if ($this->hold_status === 'accepted' && $this->expires_at) {
            return now()->diffInMinutes($this->expires_at, false);
        }

        if ($this->hold_status === 'pending' && $this->original_expires_at) {
            return now()->diffInMinutes($this->original_expires_at, false);
        }

        return null;
    }

    public function getIsExpiredAttribute(): bool
    {
        $remaining = $this->getTimeRemainingAttribute();
        return $remaining !== null && $remaining <= 0;
    }

    // ─── Relationships ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    // ─── Boot hook ─────────────────────────────────────────────────────────────
    // The boot() saving observer auto-transitions expired holds to cancelled.
    // IMPORTANT: All cancel-only operations (removeFromView, hideExpiredHold,
    // rejectSpotHold, destroy) use saveQuietly() to bypass this hook entirely,
    // so cancelled_at is only set when a hold expires naturally through save().

    public static function boot(): void
    {
        parent::boot();

        static::saving(function (Reservation $reservation) {
            // Auto-expire pending holds whose restaurant-response window has closed.
            if (
                $reservation->status === 'pending_hold' &&
                $reservation->hold_status === 'pending' &&
                $reservation->original_expires_at &&
                now()->greaterThan($reservation->original_expires_at)
            ) {
                $reservation->status       = 'cancelled';
                $reservation->hold_status  = 'expired';
                $reservation->cancelled_at = now();
                return; // No need to check the second condition
            }

            // Auto-expire accepted holds whose arrival window has closed.
            if (
                $reservation->status === 'confirmed' &&
                $reservation->hold_status === 'accepted' &&
                $reservation->expires_at &&
                now()->greaterThan($reservation->expires_at)
            ) {
                $reservation->status       = 'cancelled';
                $reservation->hold_status  = 'expired';
                $reservation->cancelled_at = now();
            }
        });
    }

    // ─── Helper methods ────────────────────────────────────────────────────────

    public function isExpired(): bool
    {
        return $this->getIsExpiredAttribute();
    }

    public function canBeCancelled(): bool
    {
        if ($this->status !== 'pending_hold') {
            return false;
        }

        // FIX: Original checked expires_at, but pending holds have expires_at = null
        //      until accepted. The correct field for the restaurant-response window
        //      is original_expires_at.
        $expiryField = $this->original_expires_at ?? $this->expires_at;

        if ($expiryField) {
            return now()->lessThan($expiryField);
        }

        return true;
    }

    // ─── Static helpers ────────────────────────────────────────────────────────

    public static function generateConfirmationCode(): string
    {
        return 'RES-' . strtoupper(substr(md5(uniqid()), 0, 8)) . '-' . date('md');
    }

    // ─── Query scopes ──────────────────────────────────────────────────────────

    public function scopeUpcoming($query)
    {
        return $query->where('reservation_date', '>=', now()->toDateString())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('reservation_date')
            ->orderBy('reservation_time');
    }

    public function scopePast($query)
    {
        return $query->where(function ($q) {
            $q->where('reservation_date', '<', now()->toDateString())
              ->orWhere(function ($q2) {
                  $q2->where('reservation_date', '=', now()->toDateString())
                     ->where('reservation_time', '<', now()->format('H:i'));
              });
        })
            ->orderBy('reservation_date', 'desc')
            ->orderBy('reservation_time', 'desc');
    }
}