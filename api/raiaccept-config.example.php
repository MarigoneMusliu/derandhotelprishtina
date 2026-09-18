<?php
/**
 * Copy this file to raiaccept-config.php and fill in credentials from the RaiAccept Merchant portal.
 * Safer production setup: name the private file raiaccept-private-config.php and place it
 * one folder above the public website root. Do not commit real credentials.
 */
return [
    'username' => 'YOUR_RAIACCEPT_API_USERNAME',
    'password' => 'YOUR_RAIACCEPT_API_PASSWORD',
    'client_id' => 'kr2gs4117arvbnaperqff5dml',
    'currency' => 'EUR',
    // Public site URL with https (required by RaiAccept for redirect URLs).
    'site_base_url' => 'https://www.derandhotel.com',
    'order_notification_email' => 'info@derandhotel.com',
    // Enable Web3Forms Auto Responder on this access key so guests receive
    // booking confirmations when browser fallback submissions are used.
    'web3forms_access_key' => 'YOUR_WEB3FORMS_ACCESS_KEY',
    'raiaccept_auth_url' => 'https://authenticate.raiaccept.com',
    'raiaccept_api_base_url' => 'https://trapi.raiaccept.com',
    // Reference only — checkout ignores this and uses raiaccept_booking_rooms() in raiaccept-lib.php.
    'booking_room_rates' => [
        'junior-suite' => ['single' => 140, 'double' => 140],
        'deluxe-double' => ['single' => 105, 'double' => 105],
        'premium-double' => ['single' => 120, 'double' => 130, 'triple' => 140],
        'superior-twin' => ['single' => 95, 'double' => 105],
        'superior-double' => ['single' => 95, 'double' => 105],
    ],
    'booking_tax_rate' => 0,
    'is_production' => false,
];
