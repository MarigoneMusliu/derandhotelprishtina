<?php

declare(strict_types=1);

require __DIR__ . '/../api/otello-lib.php';

$config = otello_load_config();
$base = otello_api_base($config);
$hotelrefno = (int) ($config['hotelrefno'] ?? 0);

for ($start = 0; $start <= 200; $start += 100) {
    $url = $base . '/reservat/list?hotelrefno=' . $hotelrefno . '&start=' . $start . '&count=100';
    $result = otello_api_request('GET', $url, null, $config);
    $rows = $result['response']['data'] ?? $result['response'] ?? [];
    foreach ($rows as $row) {
        if (!is_array($row)) continue;
        if ((float)($row['advpayamount'] ?? 0) > 0) {
            echo 'reservatno=' . ($row['reservatno'] ?? '?') . ' total=' . ($row['totalprice'] ?? 0) . ' advpay=' . ($row['advpayamount'] ?? 0) . ' advpaytype=' . ($row['advpaytype'] ?? '') . PHP_EOL;
            break 2;
        }
    }
}

// Our test bookings with 0 price
$url = $base . '/reservat/list?hotelrefno=' . $hotelrefno . '&start=0&count=5';
$result = otello_api_request('GET', $url, null, $config);
foreach (($result['response']['data'] ?? []) as $row) {
    if (!is_array($row)) continue;
    if (stripos((string)($row['note'] ?? ''), 'derandhotel') !== false || stripos((string)($row['remarknote'] ?? ''), 'Website') !== false) {
        echo 'Website booking total=' . ($row['totalprice'] ?? 0) . ' note=' . substr((string)($row['note'] ?? ''), 0, 80) . PHP_EOL;
    }
}
