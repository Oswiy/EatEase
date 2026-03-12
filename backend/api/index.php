<?php
require __DIR__ . '/../vendor/autoload.php';

// Create /tmp directories
$dirs = [
    '/tmp/bootstrap/cache',
    '/tmp/storage/logs',
    '/tmp/storage/framework/cache',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/views',
];
foreach ($dirs as $dir) {
    if (!is_dir($dir)) mkdir($dir, 0755, true);
}

// Copy pre-generated cache files to /tmp so Laravel can read/write them
$cacheFiles = ['services.php', 'packages.php', 'config.php'];
foreach ($cacheFiles as $file) {
    $src = __DIR__ . '/../bootstrap/cache/' . $file;
    $dest = '/tmp/bootstrap/cache/' . $file;
    if (file_exists($src) && !file_exists($dest)) {
        copy($src, $dest);
    }
}

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);
$response->send();
$kernel->terminate($request, $response);