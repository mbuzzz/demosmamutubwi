<?php

/*
|--------------------------------------------------------------------------
| Override Dompdf config for this Laravel 13 + PHP 8.4 + alpine
|--------------------------------------------------------------------------
|
| Symfony 6.4+ and the laravel-dompdf 3.1.2 default config produce
| blank PDFs in the production container: Dompdf builds a single
| page with fonts/encoding but emits a zero-length content stream.
| That happens because the default chroot resolves to "/" and
| defaultMediaType is "print"; the renderer cannot resolve the
| document tree on first pass and silently drops it.
|
| Forcing `chroot` to the project root and `defaultMediaType` to
| "screen" keeps the parser in the same mode the browser uses and
| makes it render the document body normally.
|
| We also pin a writable temp directory inside /tmp so the renderer
| can stream image/font lookups without hitting "no writeable
| temporary directory" warnings on read-only container layers.
*/

return [

    'show_warnings' => false,
    'public_path'   => null,
    'convert_entities' => true,

    'options' => [
        'font_dir'    => storage_path('fonts'),
        'font_cache'  => storage_path('fonts'),
        'chroot'      => base_path(),
        'temp_dir'    => '/tmp',
        'defaultMediaType' => 'screen',
        'isHtml5ParserEnabled' => true,
        'isRemoteEnabled' => true,
        'isJavascriptEnabled' => false,
        'isPhpEnabled' => false,
    ],

];
