<?php
// ESP32-CAM Server - Place in public folder
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Device-ID, X-Location, Content-Type, Authorization, *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

// Simple router
if (strpos($path, '/api/camera/upload') !== false && $method === 'POST') {
    handleCameraUpload();
} elseif (strpos($path, '/api/camera/test') !== false && $method === 'POST') {
    handleTest();
} else {
    echo json_encode([
        'status' => 'online',
        'message' => 'Camera server running',
        'endpoints' => [
            'POST /api/camera/upload' => 'Upload image from ESP32',
            'POST /api/camera/test' => 'Test connection',
            'GET /' => 'This message'
        ]
    ]);
}

function handleCameraUpload() {
    // Get headers
    $deviceId = $_SERVER['HTTP_X_DEVICE_ID'] ?? 'esp32-cam-001';
    $location = $_SERVER['HTTP_X_LOCATION'] ?? 'kitchen';
    
    // Get image data
    $imageData = file_get_contents('php://input');
    
    if (empty($imageData)) {
        http_response_code(400);
        echo json_encode(['error' => 'No image data received']);
        return;
    }
    
    // Create upload directory
    $uploadDir = __DIR__ . '/../storage/app/public/camera-uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    // Save file
    $filename = 'cam_' . $deviceId . '_' . time() . '.jpg';
    $filepath = $uploadDir . '/' . $filename;
    
    if (file_put_contents($filepath, $imageData)) {
        // Make symlink if needed
        $publicDir = __DIR__ . '/camera-uploads';
        if (!is_dir($publicDir)) {
            mkdir($publicDir, 0777, true);
        }
        
        // Create symlink for public access
        if (!file_exists($publicDir . '/' . $filename)) {
            copy($filepath, $publicDir . '/' . $filename);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'filename' => $filename,
            'device_id' => $deviceId,
            'location' => $location,
            'size_bytes' => strlen($imageData),
            'url' => 'http://' . $_SERVER['HTTP_HOST'] . '/camera-uploads/' . $filename,
            'server_time' => date('Y-m-d H:i:s'),
            'server_path' => $filepath
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save image']);
    }
}

function handleTest() {
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    
    echo json_encode([
        'status' => 'success',
        'message' => '✅ ESP32-CAM Server is READY!',
        'server_ip' => $_SERVER['SERVER_ADDR'] ?? gethostbyname(gethostname()),
        'client_ip' => $_SERVER['REMOTE_ADDR'],
        'timestamp' => date('Y-m-d H:i:s'),
        'received_data' => $data,
        'headers_received' => [
            'device_id' => $_SERVER['HTTP_X_DEVICE_ID'] ?? 'not set',
            'location' => $_SERVER['HTTP_X_LOCATION'] ?? 'not set',
            'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set'
        ],
        'instructions' => 'Send image/jpeg data to /api/camera/upload'
    ]);
}