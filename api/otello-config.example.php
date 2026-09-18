<?php

declare(strict_types=1);

/**
 * Legacy local fallback only. Production: copy otello-private-config.example.php
 * to otello-private-config.php one folder above public_html.
 *
 * Override via env: OTELLO_API_BASE, OTELLO_HOTELREFNO, OTELLO_USERNAME, OTELLO_PASSWORD
 */
$hotelrefno = getenv('OTELLO_HOTELREFNO');
if (!is_string($hotelrefno) || trim($hotelrefno) === '') {
    $hotelrefno = 0;
} else {
    $hotelrefno = (int) trim($hotelrefno);
}

$username = getenv('OTELLO_USERNAME');
if (!is_string($username) || trim($username) === '') {
    $username = '';
}

$password = getenv('OTELLO_PASSWORD');
if (!is_string($password) || trim($password) === '') {
    $password = '';
}

$apiBase = getenv('OTELLO_API_BASE');
if (!is_string($apiBase) || trim($apiBase) === '') {
    $apiBase = 'https://balkan.hotech.systems/orest';
}

return [
    'api_base' => rtrim(trim($apiBase), '/'),
    'login_path' => 'auth/login',
    'hotelrefno' => is_int($hotelrefno) ? $hotelrefno : (int) $hotelrefno,
    'username' => trim($username),
    'password' => trim($password),
    'client_id' => 'orestClient',
    'app_name' => 'GappWS',
    'default_room_type_id' => 0,
    'room_type_ids' => [
        'junior-suite' => 0,
        'deluxe-double' => 0,
        'premium-double' => 0,
        'superior-twin' => 0,
        'superior-double' => 0,
    ],
    'reservation_defaults' => [
        'paytype' => '1510100',
        'sourceid' => 0,
        'agencysubid' => 0,
        'ressegmentid' => 0,
        'resdefinitid' => 0,
        // 0 = do not force one country on every guest. otello-lib.php detects
        // rescountryid from the phone number prefix when possible.
        'rescountryid' => 0,
        'boardtypeid' => 0,
        'pricecurrid' => 0,
    ],
    // Optional manual overrides when Otello has no row for a dial code (e.g. Kosovo +383).
    'phone_dial_to_rescountryid' => [
        // '383' => 0,
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
