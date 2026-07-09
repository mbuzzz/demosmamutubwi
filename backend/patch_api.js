const fs = require('fs');
const file = 'routes/api.php';
let content = fs.readFileSync(file, 'utf8');

// Add Prestasi routes
if (!content.includes('PrestasiController')) {
  content = content.replace(
    "use App\\Http\\Controllers\\GaleriController;",
    "use App\\Http\\Controllers\\GaleriController;\nuse App\\Http\\Controllers\\PrestasiController;"
  );
  
  content = content.replace(
    "Route::apiResource('faqs', FaqController::class);",
    "Route::apiResource('faqs', FaqController::class);\n    Route::apiResource('prestasi', PrestasiController::class);"
  );
}

fs.writeFileSync(file, content);
