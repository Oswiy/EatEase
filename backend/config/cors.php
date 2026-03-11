<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'https://eatease-restaurant.vercel.app',
        'https://eatease-diner.vercel.app',
    ],
    'allowed_origins_patterns' => [
        '#^http://(localhost|127\.0\.0\.1):[0-9]+$#'
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Authorization'],
    'max_age' => 86400,
    'supports_credentials' => true,
];