<?php
/**
 * Copy this file to raiaccept-config.php and fill in credentials from the RaiAccept Merchant portal.
 * Do not commit raiaccept-config.php (it is listed in .gitignore).
 */
return [
    'username' => 'YOUR_RAIACCEPT_API_USERNAME',
    'password' => 'YOUR_RAIACCEPT_API_PASSWORD',
    'client_id' => 'kr2gs4117arvbnaperqff5dml',
    'currency' => 'EUR',
    // Public site URL with https (required by RaiAccept for redirect URLs).
    'site_base_url' => 'https://www.derandhotel.com',
    'is_production' => false,
];
