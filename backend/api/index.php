<?php
require __DIR__ . '/../vendor/autoload.php';

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

$cacheFiles = ['services.php', 'packages.php'];
foreach ($cacheFiles as $file) {
    $src = __DIR__ . '/../bootstrap/cache/' . $file;
    $dest = '/tmp/bootstrap/cache/' . $file;
    if (file_exists($src) && !file_exists($dest)) {
        copy($src, $dest);
    }
}

try {
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $request = Illuminate\Http\Request::capture();
    echo json_encode([
        'step' => 'request_captured',
        'url' => $request->fullUrl(),
        'path' => $request->path(),
        'method' => $request->method(),
    ]);
} catch (\Throwable $e) {
    echo json_encode([
        'step' => 'request_failed',
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
    ]);
}
die();