<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        $origin = $request->headers->get('Origin');
        
        $allowedOrigin = null;
        
        // Allow any localhost port (development)
        if (preg_match('/^http:\/\/(localhost|127\.0\.0\.1|localhost\.local):[0-9]+$/', $origin)) {
            $allowedOrigin = $origin;
        }
        
        // Allow production Vercel URLs
        $productionOrigins = [
            'https://eatease-restaurant.vercel.app',
            'https://eatease-diner.vercel.app',
        ];
        
        if (in_array($origin, $productionOrigins)) {
            $allowedOrigin = $origin;
        }
        
        // Fallback
        if (!$allowedOrigin) {
            $allowedOrigin = 'http://localhost:5176';
        }
        
        $headers = [
            'Access-Control-Allow-Origin'      => $allowedOrigin,
            'Access-Control-Allow-Methods'     => 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
            'Access-Control-Allow-Headers'     => 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-TOKEN, X-XSRF-TOKEN, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Max-Age'           => '86400',
            'Access-Control-Expose-Headers'    => 'Authorization',
        ];
        
        if ($request->isMethod('OPTIONS')) {
            return response()->json(['method' => 'OPTIONS'], 200, $headers);
        }
        
        $response = $next($request);
        
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }
        
        return $response;
    }
}