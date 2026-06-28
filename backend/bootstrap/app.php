<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        
        // Enable sessions on API routes for Sanctum SPA cookie persistence
        $middleware->api(prepend: [
            \Illuminate\Session\Middleware\StartSession::class,
        ]);
        
        // Register global middleware
        $middleware->append(\App\Http\Middleware\SanitizeInputs::class);

        // Exclude XSRF-TOKEN from encryption so Axios can read it for CSRF
        $middleware->encryptCookies(except: ['XSRF-TOKEN']);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
