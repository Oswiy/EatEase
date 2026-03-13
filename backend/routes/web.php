<?php

use Illuminate\Support\Facades\Route;


Route::get('{any}', function($any) {
    return response()->json([
        'caught_by_web' => $any,
        'server' => $_SERVER['REQUEST_URI'] ?? 'unknown',
        'path_info' => $_SERVER['PATH_INFO'] ?? 'none',
    ]);
})->where('any', '.*');

Route::middleware('api')->get('/api-middleware-test', function() {
    return response()->json(['api_middleware' => 'working']);
});

Route::get('/api/test-web', function() {
    return response()->json(['message' => 'api prefix via web route']);
});

Route::get('/api-test', function() {
    return response()->json(['message' => 'web route working']);
});
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
