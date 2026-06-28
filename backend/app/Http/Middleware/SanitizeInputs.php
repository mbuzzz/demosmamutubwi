<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInputs
{
    private array $excludedFields = [
        'password', 'password_confirmation', 'current_password',
        '_token', 'XSRF-TOKEN', 'foto',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$value, $key) {
            if (is_string($value) && !in_array($key, $this->excludedFields, true)) {
                $value = strip_tags($value);
                $value = trim($value);
            }
        });

        $request->merge($input);

        return $next($request);
    }
}
