<?php

declare(strict_types=1);

require dirname(__DIR__) . '/api/raiaccept-lib.php';

$rooms = raiaccept_booking_rooms();
$expected = [
    'junior-suite' => ['single' => 140.0, 'double' => 140.0],
    'deluxe-double' => ['single' => 105.0, 'double' => 105.0],
    'premium-double' => ['single' => 120.0, 'double' => 130.0, 'triple' => 140.0],
    'superior-twin' => ['single' => 95.0, 'double' => 95.0],
    'superior-double' => ['single' => 95.0, 'double' => 95.0],
];

$ok = true;
foreach ($expected as $slug => $rates) {
    $single = raiaccept_booking_rate_for_adults($rooms[$slug], 1);
    $double = raiaccept_booking_rate_for_adults($rooms[$slug], 2);
    if ($single !== $rates['single'] || $double !== $rates['double']) {
        $ok = false;
        echo "FAIL {$slug}: got {$single}/{$double}, expected {$rates['single']}/{$rates['double']}\n";
    } else {
        echo "OK {$slug}: {$single}/{$double}\n";
    }

    if (isset($rates['triple'])) {
        $triple = raiaccept_booking_rate_for_adults($rooms[$slug], 3);
        if ($triple !== $rates['triple']) {
            $ok = false;
            echo "FAIL {$slug} triple: got {$triple}, expected {$rates['triple']}\n";
        } else {
            echo "OK {$slug} triple: {$triple}\n";
        }
    }
}

$checkIn = DateTimeImmutable::createFromFormat('!Y-m-d', '2026-07-30');
$checkOut = DateTimeImmutable::createFromFormat('!Y-m-d', '2026-08-04');
$base = raiaccept_booking_rate_for_adults($rooms['superior-double'], 2);
$stay = raiaccept_booking_stay_room_total($base, $checkIn, $checkOut);
$expectedTotal = 95.0 * 5;
if ($stay['total'] !== $expectedTotal) {
    $ok = false;
    echo "FAIL flat stay total: got {$stay['total']}, expected {$expectedTotal}\n";
} else {
    echo "OK flat stay total: {$stay['total']}\n";
}

exit($ok ? 0 : 1);
