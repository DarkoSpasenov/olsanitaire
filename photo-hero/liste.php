<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

$allowed = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
$files = [];

foreach (scandir(__DIR__) as $file) {
    if ($file === '.' || $file === '..') {
        continue;
    }

    $path = __DIR__ . DIRECTORY_SEPARATOR . $file;
    if (!is_file($path)) {
        continue;
    }

    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed, true)) {
        continue;
    }

    $files[] = $file;
}

natcasesort($files);
$files = array_values($files);

echo json_encode([
    'photos' => $files
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
