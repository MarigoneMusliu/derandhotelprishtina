<?php

declare(strict_types=1);

require __DIR__ . '/../api/otello-lib.php';

$config = otello_load_config();

$cases = [
    ['tel' => '+38344123456', 'ref' => 'DH-123', 'note' => 'Late arrival'],
    ['tel' => '+491701234567', 'ref' => 'DH-124', 'note' => ''],
    ['tel' => '+441234567890', 'ref' => 'DH-125', 'note' => ''],
    ['tel' => '044123456', 'ref' => 'DH-126', 'note' => ''],
    ['tel' => '+903121234567', 'ref' => 'DH-127', 'note' => ''],
];

foreach ($cases as $case) {
    $payload = otello_build_reservation_payload([
        'roomType' => 'superior-double',
        'checkin' => '2026-10-10',
        'checkout' => '2026-10-11',
        'firstname' => 'TEST',
        'lastname' => 'GUEST',
        'email' => 'test@example.com',
        'tel' => $case['tel'],
        'merchantOrderReference' => $case['ref'],
        'note' => $case['note'],
    ], $config);

    echo $case['tel'] . PHP_EOL;
    echo '  rescountryid: ' . ($payload['rescountryid'] ?? '(omitted)') . PHP_EOL;
    echo '  note: ' . ($payload['note'] ?? '') . PHP_EOL . PHP_EOL;
}
