<?php

// Fix for Vercel's read-only filesystem
$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

// Redirect writable directories to /tmp (Vercel's only writable location)
$app->useStoragePath('/tmp/storage');
$app->bootstrapPath('/tmp/bootstrap');

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Override paths AFTER app is created
$app->useStoragePath('/tmp/storage');
$app->bootstrapPath('/tmp/bootstrap');

// Create required directories in /tmp
$dirs = [
    '/tmp/storage/logs',
    '/tmp/storage/framework/cache',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/views',
    '/tmp/bootstrap/cache',
];
foreach ($dirs as $dir) {
    if (!is_dir($dir)) mkdir($dir, 0755, true);
}

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);
$response->send();
$kernel->terminate($request, $response);