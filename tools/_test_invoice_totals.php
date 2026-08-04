<?php

declare(strict_types=1);

require dirname(__DIR__) . '/api/raiaccept-lib.php';

function testStay(string $room, int $adults, string $in, string $out): void
{
    $rooms = raiaccept_booking_rooms();
    $checkIn = DateTimeImmutable::createFromFormat('!Y-m-d', $in);
    $checkOut = DateTimeImmutable::createFromFormat('!Y-m-d', $out);
    $base = raiaccept_booking_rate_for_adults($rooms[$room], $adults);
    $stay = raiaccept_booking_stay_room_total($base, $checkIn, $checkOut);
    $nights = (int) $stay['nights'];
    $nightly = (float) $stay['average'];
    $roomSub = (float) $stay['total'];

    $items = [];
    if (!empty($stay['uniform'])) {
        $items[] = ['numberOfItems' => $nights, 'price' => $nightly];
    } else {
        $items[] = ['numberOfItems' => 1, 'price' => $roomSub];
    }

    $itemsSum = raiaccept_sum_invoice_items($items);
    $diff = round($roomSub - $itemsSum, 2);
    $label = $room . " {$adults}a {$in}->{$out}";
    if (abs($diff) > 0.01) {
        echo "MISMATCH {$label}: roomSub={$roomSub} itemsSum={$itemsSum} diff={$diff} uniform=" . ($stay['uniform'] ? '1' : '0') . PHP_EOL;
    } else {
        echo "OK {$label}: {$roomSub}" . PHP_EOL;
    }
}

testStay('superior-double', 2, '2026-07-30', '2026-08-03');
testStay('junior-suite', 1, '2026-07-28', '2026-07-30');
testStay('deluxe-double', 2, '2026-08-05', '2026-08-08');
testStay('premium-double', 2, '2026-07-31', '2026-08-02');
