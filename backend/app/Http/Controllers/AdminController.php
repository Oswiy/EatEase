<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class AdminController extends Controller
{
    // ==================== EXISTING METHODS (keep as is) ====================
    
    // Get all restaurants for admin
    public function getAllRestaurants()
    {
        try {
            $restaurants = Restaurant::with(['owner' => function ($query) {
                $query->select('id', 'name', 'email');
            }])->get();

            $formattedRestaurants = $restaurants->map(function ($restaurant) {
                return [
                    'id' => $restaurant->id,
                    'name' => $restaurant->name,
                    'owner_id' => $restaurant->owner_id,
                    'owner_name' => $restaurant->owner->name ?? 'Unknown',
                    'cuisine_type' => $restaurant->cuisine_type,
                    'address' => $restaurant->address,
                    'phone' => $restaurant->phone,
                    'current_occupancy' => $restaurant->current_occupancy,
                    'max_capacity' => $restaurant->max_capacity,
                    'crowd_status' => $restaurant->crowd_status,
                    'is_verified' => $restaurant->is_verified ?? false,
                    'is_suspended' => $restaurant->is_suspended ?? false,
                    'is_featured' => $restaurant->is_featured ?? false,
                    'created_at' => $restaurant->created_at,
                    'updated_at' => $restaurant->updated_at
                ];
            });

            return response()->json([
                'success' => true,
                'restaurants' => $formattedRestaurants,
                'count' => $formattedRestaurants->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Admin get restaurants error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch restaurants'
            ], 500);
        }
    }

    // Get all users for admin
    public function getAllUsers()
    {
        try {
            $users = User::all()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                    'is_admin' => $user->is_admin ?? false,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ];
            });

            return response()->json([
                'success' => true,
                'users' => $users,
                'count' => $users->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Admin get users error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users'
            ], 500);
        }
    }

    /**
     * Get all pending feature requests
     */
    public function getFeatureRequests()
    {
        try {
            // Get feature requests
            $requests = DB::table('feature_requests')
                ->where('status', 'pending')
                ->orderBy('submitted_at', 'desc')
                ->get()
                ->map(function ($request) {
                    // Initialize default values
                    $restaurantName = 'Unknown Restaurant';
                    $restaurantIsFeatured = false;
                    $ownerName = 'Unknown Owner';
                    $ownerEmail = 'Unknown';
                    $cuisine = 'Unknown';

                    try {
                        // Get restaurant info safely
                        $restaurant = DB::table('restaurants')
                            ->where('id', $request->restaurant_id)
                            ->first();

                        if ($restaurant) {
                            $restaurantName = $restaurant->name ?? 'Unknown Restaurant';
                            $restaurantIsFeatured = $restaurant->is_featured ?? false;
                            $cuisine = $restaurant->cuisine_type ?? 'Unknown';

                            // Get owner info safely
                            if ($restaurant->owner_id) {
                                $owner = DB::table('users')
                                    ->where('id', $restaurant->owner_id)
                                    ->first();

                                if ($owner) {
                                    $ownerName = $owner->name ?? 'Unknown Owner';
                                    $ownerEmail = $owner->email ?? 'Unknown';
                                }
                            }
                        }
                    } catch (\Exception $e) {
                        // Silently continue if there's an error fetching restaurant/owner
                        error_log('Error fetching restaurant/owner for request ' . $request->id . ': ' . $e->getMessage());
                    }

                    return [
                        'id' => $request->id,
                        'restaurant_id' => $request->restaurant_id,
                        'restaurant_name' => $restaurantName,
                        'restaurant_is_featured' => $restaurantIsFeatured,
                        'owner_name' => $ownerName,
                        'owner_email' => $ownerEmail,
                        'cuisine' => $cuisine,
                        'featured_description' => $request->featured_description,
                        'submitted_at' => $request->submitted_at,
                        'status' => $request->status
                    ];
                });

            return response()->json([
                'success' => true,
                'feature_requests' => $requests,
                'count' => $requests->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch feature requests'
            ], 500);
        }
    }

    /**
     * Approve a feature request
     */
    public function approveFeatureRequest($id)
    {
        try {
            $admin = Auth::user();
            
            // Get the feature request
            $featureRequest = DB::table('feature_requests')->find($id);
            
            if (!$featureRequest) {
                return response()->json(['message' => 'Feature request not found'], 404);
            }
            
            if ($featureRequest->status !== 'pending') {
                return response()->json(['message' => 'Request already processed'], 400);
            }
            
            // Count currently featured restaurants
            $featuredCount = DB::table('restaurants')->where('is_featured', true)->count();
            if ($featuredCount >= 10) {
                return response()->json([
                    'success' => false,
                    'message' => 'Maximum of 10 featured restaurants reached'
                ], 400);
            }
            
            // Update feature request status
            DB::table('feature_requests')
                ->where('id', $id)
                ->update([
                    'status' => 'approved',
                    'reviewed_by' => $admin->id,
                    'reviewed_at' => now()
                ]);
            
            // Update restaurant to be featured
            DB::table('restaurants')
                ->where('id', $featureRequest->restaurant_id)
                ->update([
                    'is_featured' => true,
                    'featured_description' => $featureRequest->featured_description
                ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Feature request approved! Restaurant is now featured.'
            ]);
            
        } catch (\Exception $e) {
            error_log('Approve feature request error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve feature request'
            ], 500);
        }
    }

    /**
     * Reject a feature request
     */
    public function rejectFeatureRequest($id)
    {
        try {
            $admin = Auth::user();
            
            // Get the feature request
            $featureRequest = DB::table('feature_requests')->find($id);
            
            if (!$featureRequest) {
                return response()->json(['message' => 'Feature request not found'], 404);
            }
            
            if ($featureRequest->status !== 'pending') {
                return response()->json(['message' => 'Request already processed'], 400);
            }
            
            // Update feature request to rejected (no reason needed)
            DB::table('feature_requests')
                ->where('id', $id)
                ->update([
                    'status' => 'rejected',
                    'reviewed_by' => $admin->id,
                    'reviewed_at' => now()
                ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Feature request rejected.'
            ]);
            
        } catch (\Exception $e) {
            error_log('Reject feature request error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject feature request'
            ], 500);
        }
    }

    // Verify a restaurant
    public function verifyRestaurant($id)
    {
        try {
            $restaurant = Restaurant::find($id);

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant not found'
                ], 404);
            }

            $restaurant->update([
                'is_verified' => true,
                'verified_at' => now(),
                'verified_by' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Restaurant verified successfully',
                'restaurant' => $restaurant
            ]);
        } catch (\Exception $e) {
            Log::error('Verify restaurant error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify restaurant'
            ], 500);
        }
    }

    // Suspend a restaurant
    public function suspendRestaurant(Request $request, $id)
    {
        try {
            $restaurant = Restaurant::find($id);

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant not found'
                ], 404);
            }

            $suspended = !$restaurant->is_suspended; // Toggle
            $reason = $request->input('reason', '');

            $restaurant->update([
                'is_suspended' => $suspended,
                'suspended_reason' => $suspended ? $reason : null,
                'suspended_at' => $suspended ? now() : null
            ]);

            $action = $suspended ? 'suspended' : 'unsuspended';

            return response()->json([
                'success' => true,
                'message' => "Restaurant {$action} successfully",
                'restaurant' => $restaurant
            ]);
        } catch (\Exception $e) {
            Log::error('Suspend restaurant error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update restaurant status'
            ], 500);
        }
    }

    // Get all pending verification requests
    public function getVerificationRequests()
    {
        try {
            $requests = Restaurant::where('verification_status', 'pending')
                ->with(['owner' => function ($query) {
                    $query->select('id', 'name', 'email');
                }])
                ->orderBy('verification_requested_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'requests' => $requests,
                'count' => $requests->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Get verification requests error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch verification requests'
            ], 500);
        }
    }

    // Approve verification
    public function approveVerification($id)
    {
        try {
            $restaurant = Restaurant::find($id);

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant not found'
                ], 404);
            }

            $restaurant->update([
                'verification_status' => 'approved',
                'is_verified' => true,
                'verified_at' => now(),
                'verified_by' => Auth::id(),
                'verification_processed_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Restaurant verification approved',
                'restaurant' => $restaurant
            ]);
        } catch (\Exception $e) {
            Log::error('Approve verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve verification'
            ], 500);
        }
    }

    // Reject verification
    public function rejectVerification(Request $request, $id)
    {
        try {
            $user = Auth::user();

            $restaurant = Restaurant::find($id);

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restaurant not found'
                ], 404);
            }

            // Get reason from request or use default
            $reason = $request->input('rejection_reason', 'Verification request rejected by admin.');

            // Update restaurant - reset verification request
            $restaurant->update([
                'verification_requested' => false,
                'is_verified' => false,
                'suspended_reason' => $reason,
                'verification_requested_at' => null,
                'admin_notes' => $restaurant->admin_notes . ' [REJECTED: ' . $reason . ']'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Verification request rejected successfully',
                'restaurant' => $restaurant
            ]);
        } catch (\Exception $e) {
            Log::error('Reject verification error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    // ==================== NEW BAD WORD MANAGEMENT METHODS ====================
    
    /**
     * Get all bad words from config
     */
    public function getBadWords()
    {
        try {
            // Check if user is admin
            if (!Auth::user()->is_admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            $badWords = config('badwords.words', []);
            
            return response()->json([
                'success' => true,
                'bad_words' => $badWords,
                'count' => count($badWords),
                'enabled' => config('badwords.enabled', true),
                'strict_mode' => config('badwords.strict_mode', true)
            ]);
        } catch (\Exception $e) {
            Log::error('Admin get bad words error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch bad words'
            ], 500);
        }
    }

    /**
     * Add a bad word to the list
     */
    public function addBadWord(Request $request)
    {
        try {
            // Check if user is admin
            if (!Auth::user()->is_admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            $request->validate([
                'word' => 'required|string|max:50'
            ]);
            
            $word = strtolower(trim($request->word));
            
            // Validate word format
            if (!preg_match('/^[a-z0-9\*]+$/', $word)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Word can only contain letters, numbers, and asterisks'
                ], 422);
            }
            
            $badWords = config('badwords.words', []);
            
            if (in_array($word, $badWords)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Word already exists in the list'
                ], 422);
            }
            
            $badWords[] = $word;
            sort($badWords); // Keep list sorted
            
            // Update config file
            $this->updateBadWordsConfigFile($badWords);
            
            Log::info('Bad word added by admin', [
                'admin_id' => Auth::id(),
                'word' => $word,
                'total_words' => count($badWords)
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Bad word added successfully',
                'total_words' => count($badWords),
                'word' => $word
            ]);
        } catch (\Exception $e) {
            Log::error('Add bad word error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add bad word'
            ], 500);
        }
    }

    /**
     * Remove a bad word from the list
     */
    public function removeBadWord(Request $request)
    {
        try {
            // Check if user is admin
            if (!Auth::user()->is_admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            $request->validate([
                'word' => 'required|string|max:50'
            ]);
            
            $word = strtolower(trim($request->word));
            $badWords = config('badwords.words', []);
            
            $index = array_search($word, $badWords);
            if ($index === false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Word not found in the list'
                ], 404);
            }
            
            unset($badWords[$index]);
            $badWords = array_values($badWords); // Reindex array
            
            // Update config file
            $this->updateBadWordsConfigFile($badWords);
            
            Log::info('Bad word removed by admin', [
                'admin_id' => Auth::id(),
                'word' => $word,
                'total_words' => count($badWords)
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Bad word removed successfully',
                'total_words' => count($badWords)
            ]);
        } catch (\Exception $e) {
            Log::error('Remove bad word error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove bad word'
            ], 500);
        }
    }

    /**
     * Toggle bad word filter on/off
     */
    public function toggleBadWordFilter(Request $request)
    {
        try {
            // Check if user is admin
            if (!Auth::user()->is_admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            $request->validate([
                'enabled' => 'required|boolean'
            ]);
            
            $currentSetting = config('badwords.enabled', true);
            $newSetting = $request->enabled;
            
            // Only update if different
            if ($currentSetting !== $newSetting) {
                $this->updateBadWordsConfigSetting('enabled', $newSetting);
                
                Log::info('Bad word filter toggled by admin', [
                    'admin_id' => Auth::id(),
                    'from' => $currentSetting ? 'enabled' : 'disabled',
                    'to' => $newSetting ? 'enabled' : 'disabled'
                ]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Bad word filter ' . ($newSetting ? 'enabled' : 'disabled'),
                'enabled' => $newSetting
            ]);
        } catch (\Exception $e) {
            Log::error('Toggle bad word filter error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle filter'
            ], 500);
        }
    }

    /**
     * Toggle strict mode on/off
     */
    public function toggleBadWordStrictMode(Request $request)
    {
        try {
            // Check if user is admin
            if (!Auth::user()->is_admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            $request->validate([
                'strict_mode' => 'required|boolean'
            ]);
            
            $currentSetting = config('badwords.strict_mode', true);
            $newSetting = $request->strict_mode;
            
            // Only update if different
            if ($currentSetting !== $newSetting) {
                $this->updateBadWordsConfigSetting('strict_mode', $newSetting);
                
                Log::info('Bad word strict mode toggled by admin', [
                    'admin_id' => Auth::id(),
                    'from' => $currentSetting ? 'strict' : 'normal',
                    'to' => $newSetting ? 'strict' : 'normal'
                ]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Strict mode ' . ($newSetting ? 'enabled' : 'disabled'),
                'strict_mode' => $newSetting
            ]);
        } catch (\Exception $e) {
            Log::error('Toggle strict mode error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle strict mode'
            ], 500);
        }
    }

    /**
     * Test bad word filter with sample text
     */
    public function testBadWordFilter(Request $request)
    {
        try {
            // Check if user is admin
            if (!Auth::user()->is_admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            $request->validate([
                'text' => 'required|string|max:1000'
            ]);
            
            $text = $request->text;
            $badWords = config('badwords.words', []);
            $containsBadWords = false;
            $foundWords = [];
            
            // Check for bad words
            foreach ($badWords as $badWord) {
                $pattern = '/\b' . preg_quote($badWord, '/') . '\b/i';
                if (preg_match($pattern, strtolower($text))) {
                    $containsBadWords = true;
                    $foundWords[] = $badWord;
                }
            }
            
            // Filter the text
            $filteredText = \App\Helpers\BadWordFilter::filter($text);
            
            return response()->json([
                'success' => true,
                'test_results' => [
                    'original_text' => $text,
                    'filtered_text' => $filteredText,
                    'contains_bad_words' => $containsBadWords,
                    'found_words' => $foundWords,
                    'total_bad_words_in_list' => count($badWords),
                    'filter_enabled' => config('badwords.enabled', true),
                    'strict_mode' => config('badwords.strict_mode', true)
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Test bad word filter error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to test filter'
            ], 500);
        }
    }

    // ==================== HELPER METHODS ====================
    
    /**
     * Helper: Update bad words config file
     */
    private function updateBadWordsConfigFile($badWords)
    {
        $config = "<?php\n\nreturn [\n    'words' => [\n";
        
        foreach ($badWords as $word) {
            $config .= "        '" . addslashes($word) . "',\n";
        }
        
        $config .= "    ],\n    \n    'enabled' => " . (config('badwords.enabled', true) ? 'true' : 'false') . ",\n";
        $config .= "    'strict_mode' => " . (config('badwords.strict_mode', true) ? 'true' : 'false') . ",\n];\n";
        
        file_put_contents(config_path('badwords.php'), $config);
        
        // Clear config cache
        Artisan::call('config:clear');
    }

    /**
     * Helper: Update a specific setting in bad words config
     */
    private function updateBadWordsConfigSetting($key, $value)
    {
        $config = file_get_contents(config_path('badwords.php'));
        
        if ($key === 'enabled') {
            $config = preg_replace(
                "/'enabled' => (true|false)/",
                "'enabled' => " . ($value ? 'true' : 'false'),
                $config
            );
        } elseif ($key === 'strict_mode') {
            $config = preg_replace(
                "/'strict_mode' => (true|false)/",
                "'strict_mode' => " . ($value ? 'true' : 'false'),
                $config
            );
        }
        
        file_put_contents(config_path('badwords.php'), $config);
        
        // Clear config cache
        Artisan::call('config:clear');
    }
}