<?php
// app/Models/IotDevice.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IotDevice extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_id',
        'device_id',
        'device_name',
        'device_type',
        'api_key',
        'ip_address',
        'is_active',
        'last_seen',
        'config'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_seen' => 'datetime',
        'config' => 'array'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function isOnline()
    {
        if (!$this->last_seen) {
            return false;
        }
        return $this->last_seen->gt(now()->subMinutes(5));
    }

    public function updateLastSeen()
    {
        $this->update(['last_seen' => now()]);
    }
}