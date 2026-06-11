<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Restaurant;
use App\Models\UserNotification;
use App\Models\Bookmark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\NotificationLog; // Add this
use Illuminate\Support\Facades\DB; // Add this
use Illuminate\Support\Facades\Cache;

class NotificationController extends Controller
{
    // ========== BOOKMARK METHODS ==========

    /**
     * Toggle bookmark for a restaurant
     */
    public function toggleBookmark($restaurant_id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Check if restaurant exists
            $restaurant = Restaurant::find($restaurant_id);
            if (!$restaurant) {
                return response()->json(['message' => 'Restaurant not found'], 404);
            }

            // Check if already bookmarked
            $bookmark = Bookmark::where('user_id', $user->id)
                ->where('restaurant_id', $restaurant_id)
                ->first();

            if ($bookmark) {
                // Remove bookmark
                $bookmark->delete();
                $isBookmarked = false;
                $message = 'Bookmark removed';
            } else {
                // Add bookmark
                Bookmark::create([
                    'user_id' => $user->id,
                    'restaurant_id' => $restaurant_id,
                ]);
                $isBookmarked = true;
                $message = 'Bookmark added';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'isBookmarked' => $isBookmarked,
            ]);
        } catch (\Exception $e) {
            Log::error('Toggle bookmark error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update bookmark',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's bookmarked restaurants
     */
    public function getBookmarks()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Single query with left join — no per-bookmark restaurant lookup
            $bookmarks = Bookmark::where('bookmarks.user_id', $user->id)
                ->leftJoin('restaurants', 'bookmarks.restaurant_id', '=', 'restaurants.id')
                ->select(
                    'bookmarks.id',
                    'bookmarks.restaurant_id',
                    'bookmarks.created_at',
                    'restaurants.name as restaurant_name',
                    'restaurants.cuisine_type',
                    'restaurants.address',
                    'restaurants.phone',
                    'restaurants.hours',
                    'restaurants.profile_image',
                    'restaurants.banner_image',
                    'restaurants.crowd_status',
                    'restaurants.current_occupancy',
                    'restaurants.max_capacity'
                )
                ->orderBy('bookmarks.created_at', 'desc')
                ->get()
                ->map(function ($row) {
                    $isDeleted = is_null($row->restaurant_name);

                    if ($isDeleted) {
                        return [
                            'id'              => $row->id,
                            'restaurant_id'   => $row->restaurant_id,
                            'restaurant_name' => 'Restaurant no longer available',
                            'cuisine'         => 'Unknown',
                            'address'         => 'Not available',
                            'phone'           => null,
                            'hours'           => null,
                            'profile_image'   => null,
                            'banner_image'    => null,
                            'is_deleted'      => true,
                            'created_at'      => $row->created_at,
                        ];
                    }

                    $profileImageUrl = $row->profile_image
                        ? (filter_var($row->profile_image, FILTER_VALIDATE_URL)
                            ? $row->profile_image
                            : asset('storage/' . $row->profile_image))
                        : null;

                    $bannerImageUrl = $row->banner_image
                        ? (filter_var($row->banner_image, FILTER_VALIDATE_URL)
                            ? $row->banner_image
                            : asset('storage/' . $row->banner_image))
                        : null;

                    $occupancyPercentage = $row->max_capacity > 0
                        ? round(($row->current_occupancy / $row->max_capacity) * 100)
                        : 0;

                    return [
                        'id'                   => $row->id,
                        'restaurant_id'        => $row->restaurant_id,
                        'restaurant_name'      => $row->restaurant_name,
                        'cuisine'              => $row->cuisine_type,
                        'address'              => $row->address,
                        'phone'                => $row->phone,
                        'hours'                => $row->hours,
                        'profile_image'        => $profileImageUrl,
                        'banner_image'         => $bannerImageUrl,
                        'crowd_status'         => $row->crowd_status ?? 'green',
                        'occupancy_percentage' => $occupancyPercentage,
                        'is_deleted'           => false,
                        'created_at'           => $row->created_at,
                    ];
                })
                ->values();

            return response()->json([
                'success'          => true,
                'bookmarks'        => $bookmarks,
                'count'            => $bookmarks->count(),
                'active_bookmarks' => $bookmarks->where('is_deleted', false)->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Get bookmarks error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch bookmarks',
            ], 500);
        }
    }

    // Cleanup for deleted Restaurants
    public function cleanupOrphanedBookmarks()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            $deletedCount = Bookmark::where('user_id', $user->id)
                ->whereNotIn('restaurant_id', function ($query) {
                    $query->select('id')->from('restaurants');
                })
                ->delete();

            return response()->json([
                'success'       => true,
                'message'       => "Cleaned up {$deletedCount} orphaned bookmarks",
                'deleted_count' => $deletedCount,
            ]);
        } catch (\Exception $e) {
            Log::error('Cleanup orphaned bookmarks error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to cleanup bookmarks',
            ], 500);
        }
    }
    
    // ========== NOTIFICATION METHODS ==========

    /**
     * Set notification preference for a restaurant
     */
    public function setNotification(Request $request, $restaurant_id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Validate request
            $validated = $request->validate([
                'notify_when_status' => 'required|in:green,yellow,orange,red'
            ]);

            // Check if restaurant exists
            $restaurant = Restaurant::find($restaurant_id);
            if (!$restaurant) {
                return response()->json(['message' => 'Restaurant not found'], 404);
            }

            // Check if notification already exists
            $notification = UserNotification::where('user_id', $user->id)
                ->where('restaurant_id', $restaurant_id)
                ->first();

            if ($notification) {
                // Update existing notification
                $notification->update([
                    'notify_when_status' => $validated['notify_when_status'],
                    'is_active' => true
                ]);
                $message = 'Notification updated';
            } else {
                // Create new notification
                $notification = UserNotification::create([
                    'user_id' => $user->id,
                    'restaurant_id' => $restaurant_id,
                    'notify_when_status' => $validated['notify_when_status'],
                    'is_active' => true
                ]);
                $message = 'Notification set';
            }

            // CLEAR CACHE AFTER UPDATE
            Cache::forget("user_notifications_{$user->id}");

            return response()->json([
                'success' => true,
                'message' => $message,
                'notification' => [
                    'id' => $notification->id,
                    'restaurant_id' => $notification->restaurant_id,
                    'restaurant_name' => $restaurant->name,
                    'notify_when_status' => $notification->notify_when_status,
                    'status_text' => $this->getStatusText($notification->notify_when_status)
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Set notification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to set notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's notification preferences
     */
    public function getNotifications()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // USE CACHE - fetch with 60 second cache
            $notifications = Cache::remember("user_notifications_{$user->id}", 60, function () use ($user) {
                return UserNotification::with(['restaurant' => function ($query) {
                    $query->select('id', 'name', 'cuisine_type', 'address');
                }])
                    ->where('user_id', $user->id)
                    ->where('is_active', true)
                    ->get()
                    ->map(function ($notification) {
                        $restaurantName = $notification->restaurant ? $notification->restaurant->name : 'Unknown Restaurant';
                        $cuisine = $notification->restaurant ? $notification->restaurant->cuisine_type : 'Unknown';
                        $address = $notification->restaurant ? $notification->restaurant->address : 'Address not available';

                        return [
                            'id' => $notification->id,
                            'restaurant_id' => $notification->restaurant_id,
                            'restaurant_name' => $restaurantName,
                            'cuisine' => $cuisine,
                            'address' => $address,
                            'notify_when_status' => $notification->notify_when_status,
                            'status_text' => $this->getStatusText($notification->notify_when_status),
                            'created_at' => $notification->created_at
                        ];
                    })
                    ->filter(function ($notification) {
                        return $notification['restaurant_name'] !== 'Unknown Restaurant';
                    })
                    ->values();
            });

            return response()->json([
                'success' => true,
                'notifications' => $notifications,
                'count' => $notifications->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Get notifications error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notifications'
            ], 500);
        }
    }

    /**
     * Get actual notifications sent to user (NEW METHOD)
     */
    public function getUserNotifications()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Fetch from notification_logs table
            $notifications = DB::table('notification_logs')
                ->leftJoin('restaurants', 'notification_logs.restaurant_id', '=', 'restaurants.id')
                ->where('notification_logs.user_id', $user->id)
                ->select(
                    'notification_logs.id',
                    'notification_logs.notification_type',
                    'notification_logs.title',
                    'notification_logs.message',
                    'notification_logs.status',
                    'notification_logs.is_read',
                    'notification_logs.sent_at',
                    'notification_logs.created_at',
                    'restaurants.id as restaurant_id',
                    'restaurants.name as restaurant_name',
                    'restaurants.cuisine_type as cuisine',
                    'restaurants.address'
                )
                ->orderBy('notification_logs.sent_at', 'desc')
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'type' => $notification->notification_type,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'status' => $notification->status,
                        'status_text' => $this->getStatusText($notification->status),
                        'is_read' => (bool)$notification->is_read,
                        'sent_at' => $notification->sent_at,
                        'restaurant_id' => $notification->restaurant_id,
                        'restaurant_name' => $notification->restaurant_name,
                        'cuisine' => $notification->cuisine,
                        'address' => $notification->address
                    ];
                });

            return response()->json([
                'success' => true,
                'notifications' => $notifications,
                'unread_count' => collect($notifications)->where('is_read', false)->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Get user notifications error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a notification
     */
    /**
     * Remove a notification preference (NOT notification log)
     */
    public function removeNotification($notification_id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // This removes a NOTIFICATION PREFERENCE from user_notifications table
            $notification = UserNotification::where('id', $notification_id)
                ->where('user_id', $user->id)
                ->first();

            if (!$notification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification preference not found'
                ], 404);
            }

            // Soft delete by setting inactive
            $notification->update(['is_active' => false]);

            // CLEAR CACHE AFTER REMOVAL
            Cache::forget("user_notifications_{$user->id}");

            return response()->json([
                'success' => true,
                'message' => 'Notification preference removed'
            ]);
        } catch (\Exception $e) {
            Log::error('Remove notification preference error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove notification preference',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // ========== HELPER METHODS ==========

    /**
     * Convert status code to readable text
     */
    private function getStatusText($status)
    {
        switch ($status) {
            case 'green':
                return 'Low Crowd';
            case 'yellow':
                return 'Moderate Crowd';
            case 'orange':
                return 'Busy';
            case 'red':
                return 'Full';
            default:
                return 'Unknown';
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($notification_id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Update the notification
            $updated = DB::table('notification_logs')
                ->where('id', $notification_id)
                ->where('user_id', $user->id)
                ->update(['is_read' => 1]);

            if ($updated) {
                return response()->json([
                    'success' => true,
                    'message' => 'Notification marked as read'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Notification not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Mark as read error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark as read'
            ], 500);
        }
    }

        // ========== NEW DELETE METHODS ==========

    /**
     * Delete a single notification from notification_logs
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Find the notification in notification_logs
            $notification = DB::table('notification_logs')
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$notification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification not found'
                ], 404);
            }

            // Delete the notification
            DB::table('notification_logs')
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Delete notification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete ALL notifications for the current user
     */
    public function destroyAll()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Delete all notifications for this user from notification_logs
            $deleted = DB::table('notification_logs')
                ->where('user_id', $user->id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'All notifications deleted successfully',
                'deleted_count' => $deleted
            ]);
        } catch (\Exception $e) {
            Log::error('Delete all notifications error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete all notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
