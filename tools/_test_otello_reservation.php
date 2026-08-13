<?php

declare(strict_types=1);

require dirname(__DIR__) . '/api/otello-lib.php';

$input = [
    'merchantOrderReference' => 'TEST-MARIGONA-' . gmdate('YmdHis'),
    'roomType' => 'superior-double',
    'checkin' => '2026-10-10',
    'checkout' => '2026-10-12',
    'nights' => 2,
    'firstname' => 'MARIGONA',
    'lastname' => 'MUSLIU',
    'email' => 'marigona.musliu.test@derandhotel.com',
    'tel' => '+38344123456',
    'totalpax' => 1,
    'totalchd1' => 0,
    'total' => 300,
    'amount' => 300,
    'paidAmount' => 300,
    'note' => 'API test booking - please ignore',
];

$result = otello_dispatch_reservation($input);
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
exit(!empty($result['ok']) ? 0 : 1);
