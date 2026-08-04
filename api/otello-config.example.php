<?php

declare(strict_types=1);

/**
 * Copy to otello-config.php on the server.
 *
 * Hotech testing hotelrefno: 999984
 * Production: set OTELLO_HOTELREFNO or replace hotelrefno below.
 */
$hotelrefno = getenv('OTELLO_HOTELREFNO');
if (!is_string($hotelrefno) || trim($hotelrefno) === '') {
    $hotelrefno = 999984;
} else {
    $hotelrefno = (int) trim($hotelrefno);
}

return [
    'api_base' => 'https://cloud.hotech.systems/orest',
    'hotelrefno' => is_int($hotelrefno) ? $hotelrefno : (int) $hotelrefno,
    'default_room_type_id' => 3304,
    'room_type_ids' => [
        'junior-suite' => 3304,
        'deluxe-double' => 3304,
        'premium-double' => 3304,
        'superior-twin' => 3304,
        'superior-double' => 3304,
    ],
    'endpoints' => [
        'reservation_ins' => '/reservat/list/ins',
        'client_ins' => '/client/list/ins',
        'contactype_list' => '/contactype/list',
        'contact_ins' => '/contact/ins',
        'resname_ins' => '/resname/list/ins',
        'reservation_patch' => '/reservat/list/patch',
    ],
    'contact_type_ids' => [
        'email' => 0,
        'phone' => 0,
    ],
    'contact_type_keywords' => [
        'email' => ['email', 'e-mail', 'mail'],
        'phone' => ['phone', 'tel', 'mobile', 'gsm'],
    ],
];
