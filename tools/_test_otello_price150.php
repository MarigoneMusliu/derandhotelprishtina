<?php

declare(strict_types=1);

require __DIR__ . '/../api/otello-lib.php';

$config = otello_load_config();
$defaults = otello_reservation_defaults($config);

$payload = array_merge([
    'paytype' => $defaults['paytype'],
    'sourceid' => $defaults['sourceid'],
    'agencysubid' => $defaults['agencysubid'],
    'ressegmentid' => $defaults['ressegmentid'],
    'resdefinitid' => $defaults['resdefinitid'],
    'boardtypeid' => $defaults['boardtypeid'],
    'status' => 'T',
    'pricecurrid' => $defaults['pricecurrid'],
    'needinvoice' => true,
    'hotelrefno' => otello_config_hotelrefno($config),
    'totalroom' => 1,
    'checkin' => '2026-12-01',
    'checkout' => '2026-12-02',
    'firstname' => 'PRICE',
    'lastname' => 'TEST150',
    'email' => 'price150.test@derandhotel.com',
    'tel' => '+491701234567',
    'totalpax' => 1,
    'totalchd1' => 0,
    'roomtypeid' => 22524,
    'bookedrtypeid' => 22524,
    'note' => 'Price field test 150 EUR - please ignore/cancel',
    'remarknote' => 'Price field test 150 EUR - please ignore/cancel',
    'totalprice' => 150.0,
    'subtotal' => 150.0,
    'dailyprice' => 150.0,
    'ispricelocked' => true,
], []);

$temp = otello_create_temporary_reservation($payload, $config);
echo json_encode($temp, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
if (empty($temp['ok']) || empty($temp['reservatGid'])) {
    exit(1);
}

$gid = $temp['reservatGid'];
$finish = otello_finish_activation([
    'merchantOrderReference' => 'TEST-PRICE150-FIELD-' . gmdate('YmdHis'),
    'note' => $payload['note'],
], $config, $payload, $gid, $temp);

echo PHP_EOL . json_encode($finish, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;

if (!empty($finish['reservatno'])) {
    $base = otello_api_base($config);
    $url = $base . '/reservat/list?hotelrefno=' . (int)$config['hotelrefno'] . '&start=0&count=20';
    $check = otello_api_request('GET', $url, null, $config);
    foreach (($check['response']['data'] ?? []) as $row) {
        if (is_array($row) && (int)($row['reservatno'] ?? 0) === (int)$finish['reservatno']) {
            echo PHP_EOL . 'Verified: totalprice=' . ($row['totalprice'] ?? '?') . ' subtotal=' . ($row['subtotal'] ?? '?') . ' dailyprice=' . ($row['dailyprice'] ?? '?') . PHP_EOL;
            break;
        }
    }
}

exit(!empty($finish['ok']) ? 0 : 1);
