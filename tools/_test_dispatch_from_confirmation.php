<?php

declare(strict_types=1);

require __DIR__ . '/../api/otello-lib.php';

$ref = 'TEST-DISPATCH-' . gmdate('YmdHis');
$record = [
    'type' => 'booking',
    'guestFirstName' => 'TEST',
    'guestLastName' => 'GUEST',
    'guestEmail' => 'marigona.musliu.test@derandhotel.com',
    'guestPhone' => '38344111222',
    'roomType' => 'junior-suite',
    'roomName' => 'Junior Suite',
    'checkIn' => '2026-11-15',
    'checkOut' => '2026-11-16',
    'adults' => 2,
    'children' => 0,
    'nights' => 1,
    'total' => 140,
    'currency' => 'EUR',
    'notes' => 'Dispatch-from-confirmation test',
];

raiaccept_store_booking_confirmation($ref, $record);
$result = otello_dispatch_from_booking_confirmation($ref);

echo json_encode([
    'ok' => $result['ok'] ?? false,
    'ref' => $ref,
    'reservatno' => $result['reservatno'] ?? null,
    'error' => $result['error'] ?? null,
    'step' => $result['step'] ?? null,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
