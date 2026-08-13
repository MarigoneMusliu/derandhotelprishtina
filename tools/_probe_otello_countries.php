<?php

declare(strict_types=1);

require __DIR__ . '/../api/otello-lib.php';

$config = otello_load_config();
$base = otello_api_base($config);
$hotelrefno = (int) ($config['hotelrefno'] ?? 0);

$all = [];
for ($start = 0; $start <= 400; $start += 100) {
    $url = $base . '/country/list?hotelrefno=' . $hotelrefno . '&start=' . $start . '&count=100';
    $result = otello_api_request('GET', $url, null, $config);
    $rows = $result['response']['data'] ?? [];
    foreach ($rows as $row) {
        if (is_array($row)) {
            $all[] = $row;
        }
    }
}

foreach ($all as $row) {
    if ((string) ($row['itu'] ?? '') === '383') {
        echo json_encode($row, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    }
}

foreach ($all as $row) {
    $desc = strtoupper((string) ($row['description'] ?? ''));
    if (strpos($desc, 'KOSOVO') !== false || strpos($desc, 'SERBIA') !== false) {
        echo json_encode($row, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    }
}
