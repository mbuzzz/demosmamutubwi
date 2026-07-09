<?php
$file = 'backend/app/Http/Controllers/Api/LmsTugasController.php';
$content = file_get_contents($file);

// Load pengumpulanTugas so frontend knows submission status
$content = str_replace(
    "\$query = Tugas::with(['guru', 'mapel', 'kelas']);",
    "\$query = Tugas::with(['guru', 'mapel', 'kelas', 'pengumpulanTugas' => function(\$q) use (\$request) {\n            if (\$request->user() && \$request->user()->role === 'siswa') {\n                \$q->where('siswa_id', \$request->user()->id);\n            }\n        }]);",
    $content
);

// Map deskripsi to instruksi on create
$content = preg_replace(
    "/'deskripsi' => 'nullable\|string',/",
    "'instruksi' => 'nullable|string',",
    $content
);

file_put_contents($file, $content);
