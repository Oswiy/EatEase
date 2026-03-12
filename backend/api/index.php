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

// Copy pre-generated cache files to /tmp
$cacheFiles = ['services.php', 'packages.php', 'config.php'];
$copyLog = [];
foreach ($cacheFiles as $file) {
    $src = __DIR__ . '/../bootstrap/cache/' . $file;
    $dest = '/tmp/bootstrap/cache/' . $file;
    $copyLog[$file] = [
        'src_exists' => file_exists($src),
        'dest_exists' => file_exists($dest),
        'copied' => file_exists($src) ? copy($src, $dest) : false,
    ];
}

echo json_encode([
    'step' => 'before_app_load',
    'copy_log' => $copyLog,
    'tmp_writable' => is_writable('/tmp'),
]);
die();