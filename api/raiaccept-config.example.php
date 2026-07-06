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
    'web3forms_access_key' => 'YOUR_WEB3FORMS_ACCESS_KEY',
    'raiaccept_auth_url' => 'https://authenticate.raiaccept.com',
    'raiaccept_api_base_url' => 'https://trapi.raiaccept.com',
    // Optional server-side overrides for room booking prices.
    'booking_room_rates' => [
        'junior-suite' => ['single' => 119, 'double' => 125],
        'deluxe-double' => ['single' => 88, 'double' => 93],
        'premium-double' => ['single' => 104, 'double' => 104, 'triple' => 140],
        'superior-twin' => ['single' => 72, 'double' => 84],
        'superior-double' => ['single' => 84, 'double' => 84],
    ],
    'booking_tax_rate' => 0,
    'is_production' => false,
];
