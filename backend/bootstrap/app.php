<?php

$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

$tmpBootstrap = '/tmp/bootstrap/cache';
$tmpStorage = '/tmp/storage';

if (!is_dir($tmpBootstrap)) mkdir($tmpBootstrap, 0755, true);
if (!is_dir($tmpStorage . '/logs')) mkdir($tmpStorage . '/logs', 0755, true);
if (!is_dir($tmpStorage . '/framework/cache')) mkdir($tmpStorage . '/framework/cache', 0755, true);
if (!is_dir($tmpStorage . '/framework/sessions')) mkdir($tmpStorage . '/framework/sessions', 0755, true);
if (!is_dir($tmpStorage . '/framework/views')) mkdir($tmpStorage . '/framework/views', 0755, true);

$app->useStoragePath($tmpStorage);
$app->bootstrapPath('/tmp/bootstrap');

$app->bind(\Illuminate\Foundation\ProviderRepository::class, function($app) {
    return new \Illuminate\Foundation\ProviderRepository(
        $app,
        new \Illuminate\Filesystem\Filesystem,
        '/tmp/bootstrap/cache/services.php'
    );
});

$app->singleton(Illuminate\Contracts\Http\Kernel::class, App\Http\Kernel::class);
$app->singleton(Illuminate\Contracts\Console\Kernel::class, App\Console\Kernel::class);
$app->singleton(Illuminate\Contracts\Debug\ExceptionHandler::class, App\Exceptions\Handler::class);

return $app;