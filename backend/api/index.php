<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

// TEMP DEBUG
echo json_encode([
    'base_path' => $app->basePath(),
    'routes_exist' => file_exists($app->basePath('routes/api.php')),
    'bootstrap_path' => $app->bootstrapPath(),
]);
die();