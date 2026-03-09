<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use App\Models\RestaurantPhoto;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RestaurantPhotoController extends Controller
{
    // Get all photos for a restaurant
    public function index($restaurantId)
    {
        $restaurant = Restaurant::findOrFail($restaurantId);

        // Check if user owns the restaurant or is admin
        $user = Auth::user();
        if ($user->id !== $restaurant->owner_id && $user->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // FIXED: Simple order by created_at, no ordered() scope
        $photos = RestaurantPhoto::where('restaurant_id', $restaurantId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($photos);
    }

    // Upload new photos
public function store(Request $request, $restaurantId)
{
    Log::info('=== PHOTO UPLOAD START ===');
    Log::info('Restaurant ID: ' . $restaurantId);
    Log::info('User ID: ' . Auth::id());
    Log::info('Request has files: ' . ($request->hasFile('photos') ? 'YES' : 'NO'));

    $restaurant = Restaurant::findOrFail($restaurantId);
    $user = Auth::user();

    // Check authorization
    if ($user->id !== $restaurant->owner_id && $user->user_type !== 'admin') {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    // Validate request
    $request->validate([
        'photos' => 'required|array|min:1|max:10',
        'photos.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        'captions' => 'nullable|array',
        'captions.*' => 'nullable|string|max:255'
    ]);

    $uploadedPhotos = [];
    $cloudName = env('CLOUDINARY_CLOUD_NAME');
    $apiKey = env('CLOUDINARY_API_KEY');
    $apiSecret = env('CLOUDINARY_API_SECRET');

    foreach ($request->file('photos') as $index => $photo) {
        try {
            $timestamp = time();
            $folder = "restaurant-gallery/{$restaurantId}";
            $publicId = uniqid() . '_' . time() . '_' . ($index + 1);
            
            // Generate signature
            $signature = sha1("folder={$folder}&public_id={$publicId}&timestamp={$timestamp}{$apiSecret}");
            
            // Use cURL directly (same as working uploadImage method)
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/{$cloudName}/image/upload");
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            
            $postFields = [
                'file' => new \CURLFile($photo->getRealPath()),
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
                'folder' => $folder,
                'public_id' => $publicId,
                'signature' => $signature
            ];
            
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);
            
            if ($error) {
                throw new \Exception('cURL Error: ' . $error);
            }
            
            if ($httpCode !== 200) {
                throw new \Exception('HTTP Error: ' . $httpCode . ' - ' . $response);
            }
            
            $result = json_decode($response, true);
            $imageUrl = $result['secure_url'];
            
            // Get caption if provided
            $caption = $request->input("captions.{$index}", null);

            // Create photo record
            $restaurantPhoto = RestaurantPhoto::create([
                'restaurant_id' => $restaurantId,
                'image_url' => $imageUrl,
                'caption' => $caption,
                'is_primary' => false,
                'uploaded_by' => $user->id,
            ]);

            $uploadedPhotos[] = $restaurantPhoto;
            
        } catch (\Exception $e) {
            Log::error('Photo upload error: ' . $e->getMessage());
            continue;
        }
    }

    Log::info('Uploaded photos count: ' . count($uploadedPhotos));
    Log::info('=== PHOTO UPLOAD END ===');

    return response()->json([
        'success' => true,
        'message' => count($uploadedPhotos) . ' photos uploaded successfully',
        'photos' => $uploadedPhotos,
        'debug' => [
            'files_received' => count($request->file('photos')),
            'files_uploaded' => count($uploadedPhotos)
        ]
    ]);
}

    // Set a photo as primary
    public function setPrimary($restaurantId, $photoId)
    {
        $restaurant = Restaurant::findOrFail($restaurantId);

        // Check if user owns the restaurant or is admin
        $user = Auth::user();
        if ($user->id !== $restaurant->owner_id && $user->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // First, unset any existing primary photo
        RestaurantPhoto::where('restaurant_id', $restaurantId)
            ->where('is_primary', true)
            ->update(['is_primary' => false]);

        // Set the new primary photo
        $photo = RestaurantPhoto::where('restaurant_id', $restaurantId)
            ->where('id', $photoId)
            ->firstOrFail();

        $photo->is_primary = true;
        $photo->save();

        return response()->json([
            'success' => true,
            'message' => 'Photo set as primary successfully',
            'photo' => $photo
        ]);
    }

    // Delete a photo
    public function destroy($restaurantId, $photoId)
    {
        $restaurant = Restaurant::findOrFail($restaurantId);

        // Check if user owns the restaurant or is admin
        $user = Auth::user();
        if ($user->id !== $restaurant->owner_id && $user->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $photo = RestaurantPhoto::where('restaurant_id', $restaurantId)
            ->where('id', $photoId)
            ->firstOrFail();

        // Delete file from storage
        if (Storage::disk('public')->exists($photo->image_url)) {
            Storage::disk('public')->delete($photo->image_url);
        }

        // Delete record
        $photo->delete();

        // If this was primary, set another photo as primary if available
        if ($photo->is_primary) {
            $newPrimary = RestaurantPhoto::where('restaurant_id', $restaurantId)
                ->first();

            if ($newPrimary) {
                $newPrimary->is_primary = true;
                $newPrimary->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Photo deleted successfully'
        ]);
    }

    // Update photo caption or order
    public function update(Request $request, $restaurantId, $photoId)
    {
        $restaurant = Restaurant::findOrFail($restaurantId);

        // Check if user owns the restaurant or is admin
        $user = Auth::user();
        if ($user->id !== $restaurant->owner_id && $user->user_type !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'caption' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer'
        ]);

        $photo = RestaurantPhoto::where('restaurant_id', $restaurantId)
            ->where('id', $photoId)
            ->firstOrFail();

        if ($request->has('caption')) {
            $photo->caption = $request->input('caption');
        }

        if ($request->has('display_order')) {
            $photo->display_order = $request->input('display_order');
        }

        $photo->save();

        return response()->json([
            'success' => true,
            'message' => 'Photo updated successfully',
            'photo' => $photo
        ]);
    }
}
