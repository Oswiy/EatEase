<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Helpers\BadWordFilter;

class FilterBadWords
{
    public function handle(Request $request, Closure $next)
    {
        // Only filter if enabled in config
        if (!config('badwords.enabled', true)) {
            return $next($request);
        }

        // Filter request inputs
        $inputs = $request->all();
        
        foreach ($inputs as $key => $value) {
            if (is_string($value)) {
                // Skip password and sensitive fields
                if (in_array($key, ['password', 'password_confirmation', 'current_password', 'new_password'])) {
                    continue;
                }
                
                // Filter the value
                $inputs[$key] = BadWordFilter::sanitize($value);
            }
        }
        
        // Replace the request inputs with filtered ones
        $request->replace($inputs);
        
        return $next($request);
    }
}