<?php

declare(strict_types=1);

require dirname(__DIR__) . '/api/raiaccept-lib.php';

$cases = [
    '044123456' => '+38344123456',
    '38344123456' => '+38344123456',
    '+383 44 123 456' => '+38344123456',
    '44123456' => '+38344123456',
];

$ok = true;
foreach ($cases as $input => $expected) {
    $digits = raiaccept_booking_phone_digits($input);
    $actual = raiaccept_mobile_phone_for_raiaccept($digits);
    if ($actual !== $expected) {
        $ok = false;
        echo "FAIL {$input}: got {$actual}, expected {$expected}\n";
    } else {
        echo "OK {$input} -> {$actual}\n";
    }
}

exit($ok ? 0 : 1);
