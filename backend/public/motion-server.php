<?php
// motion-server.php - 4 Level System
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Device-ID, X-Location, Content-Type, *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

// Simple router
if (strpos($path, '/api/motion/update') !== false && $method === 'POST') {
    handleMotionUpdate();
} elseif (strpos($path, '/api/motion/test') !== false && $method === 'POST') {
    handleMotionTest();
} elseif (strpos($path, '/api/motion/status') !== false && $method === 'GET') {
    handleMotionStatus();
} else {
    echo json_encode([
        'status' => 'online',
        'service' => '4-Level Crowd Detection',
        'levels' => [
            'Low (0-25%)' => '🟢 Quiet',
            'Medium (25-50%)' => '🟡 Moderate',
            'High (50-75%)' => '🟠 Busy',
            'Full (75-100%)' => '🔴 Very Busy'
        ]
    ]);
}

function handleMotionUpdate() {
    $deviceId = $_SERVER['HTTP_X_DEVICE_ID'] ?? 'esp32-cam-001';
    $location = $_SERVER['HTTP_X_LOCATION'] ?? 'entrance';
    
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data) {
        echo json_encode(['error' => 'Invalid JSON']);
        return;
    }
    
    // Create logs directory
    $logDir = __DIR__ . '/../motion-logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0777, true);
    }
    
    // Save detailed log
    $logEntry = sprintf(
        "%s | %s | %s | %s | Value: %d | Capacity: %d%%\n",
        date('Y-m-d H:i:s'),
        $deviceId,
        $location,
        $data['crowd_status'] ?? 'Unknown',
        $data['motion_value'] ?? 0,
        $data['capacity_percentage'] ?? 0
    );
    
    file_put_contents($logDir . '/motion.log', $logEntry, FILE_APPEND);
    
    // Save latest status
    $latest = [
        'device_id' => $deviceId,
        'location' => $location,
        'motion_active' => $data['motion_active'] ?? false,
        'motion_level' => $data['motion_level'] ?? 'Low',
        'crowd_status' => $data['crowd_status'] ?? 'Quiet',
        'motion_value' => $data['motion_value'] ?? 0,
        'capacity_percentage' => $data['capacity_percentage'] ?? 0,
        'color_code' => getColorCode($data['crowd_status'] ?? 'Quiet'),
        'timestamp' => time(),
        'last_update' => date('H:i:s')
    ];
    
    file_put_contents($logDir . '/latest.json', json_encode($latest));
    
    echo json_encode([
        'success' => true,
        'message' => '4-level motion data saved',
        'status' => $latest['crowd_status'],
        'color' => $latest['color_code'],
        'capacity' => $latest['capacity_percentage'] . '%'
    ]);
}

function handleMotionTest() {
    echo json_encode([
        'status' => 'success',
        'message' => '✅ 4-Level Crowd Detection Active',
        'levels' => [
            'Low' => '🟢 Quiet (0-25% capacity)',
            'Medium' => '🟡 Moderate (25-50% capacity)',
            'High' => '🟠 Busy (50-75% capacity)',
            'Full' => '🔴 Very Busy (75-100% capacity)'
        ]
    ]);
}

function handleMotionStatus() {
    $latestFile = __DIR__ . '/../motion-logs/latest.json';
    
    if (file_exists($latestFile)) {
        $data = json_decode(file_get_contents($latestFile), true);
        
        // Calculate time ago
        $secondsAgo = time() - $data['timestamp'];
        $data['seconds_ago'] = $secondsAgo;
        $data['time_ago'] = formatTimeAgo($secondsAgo);
        
        // Add emoji and description
        $data['emoji'] = getStatusEmoji($data['crowd_status']);
        $data['description'] = getStatusDescription($data['crowd_status']);
        
        echo json_encode($data);
    } else {
        echo json_encode([
            'motion_active' => false,
            'motion_level' => 'Low',
            'crowd_status' => 'Quiet',
            'capacity_percentage' => 0,
            'color_code' => '#10b981',
            'emoji' => '🟢',
            'description' => 'Restaurant is quiet',
            'message' => 'No motion data yet'
        ]);
    }
}

function getColorCode($status) {
    switch($status) {
        case 'Quiet': return '#10b981';      // Green
        case 'Moderate': return '#f59e0b';   // Yellow
        case 'Busy': return '#f97316';       // Orange
        case 'Very Busy': return '#ef4444';  // Red
        default: return '#6b7280';           // Gray
    }
}

function getStatusEmoji($status) {
    switch($status) {
        case 'Quiet': return '🟢';
        case 'Moderate': return '🟡';
        case 'Busy': return '🟠';
        case 'Very Busy': return '🔴';
        default: return '⚪';
    }
}

function getStatusDescription($status) {
    switch($status) {
        case 'Quiet': return 'Restaurant is quiet. Good time to visit!';
        case 'Moderate': return 'Moderate activity. Short wait times expected.';
        case 'Busy': return 'Restaurant is busy. Consider making a reservation.';
        case 'Very Busy': return 'Very busy! Long wait times expected.';
        default: return 'Status unknown';
    }
}

function formatTimeAgo($seconds) {
    if ($seconds < 60) return $seconds . ' seconds ago';
    if ($seconds < 3600) return floor($seconds / 60) . ' minutes ago';
    return floor($seconds / 3600) . ' hours ago';
}