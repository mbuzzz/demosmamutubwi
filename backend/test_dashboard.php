<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$controller = new App\Http\Controllers\DashboardController();
// Fake request for superadmin
$request = Illuminate\Http\Request::create('/api/dashboard/stats', 'GET');
$user = App\Models\User::where('role', 'superadmin')->first();
$request->setUserResolver(function() use ($user) { return $user; });

echo "Superadmin stats:\n";
print_r($controller->getStats($request)->getData(true));

// Fake request for siswa
$user = App\Models\User::where('role', 'siswa')->first();
$request->setUserResolver(function() use ($user) { return $user; });

echo "\nSiswa stats:\n";
print_r($controller->getStats($request)->getData(true));

// Fake request for bendahara
$user = App\Models\User::where('role', 'bendahara')->first();
$request->setUserResolver(function() use ($user) { return $user; });

echo "\nBendahara stats:\n";
print_r($controller->getStats($request)->getData(true));

