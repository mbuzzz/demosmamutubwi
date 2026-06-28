<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInputs
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        // Recursively sanitize string inputs
        array_walk_recursive($input, function (&$value, $key) {
            if (is_string($value)) {
                // Allow HTML only in specific rich-text fields
                $allowedHtmlFields = ['konten', 'deskripsi', 'catatan', 'keterangan', 'pertanyaan'];
                
                if (in_array($key, $allowedHtmlFields)) {
                    // Clean HTML to prevent XSS (basic sanitization)
                    $value = strip_tags($value, '<h1><h2><h3><h4><h5><h6><p><br><ul><ol><li><strong><em><u><a><img><iframe><table><thead><tbody><tr><th><td>');
                } else {
                    // For all other fields, completely strip tags and trim whitespace
                    $value = strip_tags(trim($value));
                }
            }
        });

        $request->merge($input);

        return $next($request);
    }
}
