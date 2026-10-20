<?php

declare(strict_types=1);

require_once __DIR__ . '/tickets-lib.php';

/* Festivals, ticket types, prices and availability shown on /Derandtickets. */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Use GET.']);
    exit;
}

try {
    $catalog = tickets_catalog();
    $stats = tickets_stats($catalog, tickets_orders());
    $festivals = [];

    foreach ($catalog['festivals'] as $f) {
        if (empty($f['active'])) {
            continue;
        }
        $tiers = [];
        foreach ($f['tiers'] as $t) {
            if (empty($t['active'])) {
                continue;
            }
            $remaining = $stats[$f['id']]['tiers'][$t['key']]['remaining'] ?? null;
            $tiers[] = [
                'key' => $t['key'],
                'label' => $t['label'],
                'note' => $t['note'],
                'price' => (float) $t['price'],
                'soldOut' => $remaining !== null && $remaining <= 0,
                'left' => ($remaining !== null && $remaining <= 20) ? $remaining : null,
            ];
        }
        if ($tiers === []) {
            continue;
        }
        $festivals[] = [
            'id' => $f['id'],
            'name' => $f['name'],
            'city' => $f['city'],
            'month' => (int) $f['month'],
            'dates' => $f['dates'],
            'days' => (int) $f['days'],
            'nights' => (int) $f['nights'],
            'genre' => $f['genre'],
            'img' => $f['img'],
            'badge' => $f['badge'],
            'salesOpen' => !empty($f['salesOpen']),
            'tiers' => $tiers,
        ];
    }

    echo json_encode([
        'ok' => true,
        'transferPrice' => (float) ($catalog['transferPrice'] ?? 25),
        'festivals' => $festivals,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Ticket list unavailable.']);
}
