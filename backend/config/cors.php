<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*', 'camera/*'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => ['*'], // Allow all for now
    
    'allowed_origins_patterns' => [
        '/localhost:[0-9]+/',
        '/127\.0\.0\.1:[0-9]+/',
        '/\.test$/',
        '/192\.168\.0\.\d+:[0-9]+/',  // Your local network: 192.168.0.*
        '/192\.168\.\d+\.\d+:[0-9]+/', // Any local IP: 192.168.*.*
        '/172\.\d+\.\d+\.\d+:[0-9]+/',  // Docker/VM networks
        '/10\.\d+\.\d+\.\d+:[0-9]+/',   // Private networks
    ],
    
    'allowed_headers' => [
        '*', // Allow all headers for ESP32
        'X-API-Key',
        'X-Device-ID', 
        'X-Location',
        'Content-Type',
        'Authorization',
        'Accept',
        'Content-Length',
        'Origin',
        'User-Agent',
        'Cache-Control'
    ],
    
    'exposed_headers' => [
        'Content-Type',
        'Content-Length',
        'X-Request-ID'
    ],
    
    'max_age' => 86400, // 24 hours for preflight cache
    
    'supports_credentials' => true,
];