<?php

/**
 * After a room booking payment is confirmed as paid:
 * - notify info@derandhotel.com
 * - email the guest a confirmation
 *
 * Safe to call more than once (sends are de-duplicated per order reference).
 */
declare(strict_types=1);

require __DIR__ . '/raiaccept-lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    raiaccept_json_response(405, ['error' => 'Method not allowed. Use POST.']);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    raiaccept_json_response(400, ['error' => 'Invalid JSON body.']);
}

$merchantOrderReference = raiaccept_trimmed_string(
    $input['merchantOrderReference'] ?? $input['orderRef'] ?? ''
);
$orderIdentification = raiaccept_trimmed_string($input['orderIdentification'] ?? '');

if ($merchantOrderReference === '') {
    raiaccept_json_response(400, ['error' => 'Missing booking reference.']);
}

$guestName = raiaccept_trimmed_string($input['guestName'] ?? $input['fullName'] ?? '');
$nameParts = preg_split('/\s+/', $guestName, 2);
if (!is_array($nameParts)) {
    $nameParts = [];
}

$result = raiaccept_dispatch_paid_booking_emails($merchantOrderReference, [
    'orderIdentification' => $orderIdentification,
    'guestName' => $guestName,
    'guestFirstName' => raiaccept_trimmed_string($input['guestFirstName'] ?? ($nameParts[0] ?? '')),
    'guestLastName' => raiaccept_trimmed_string($input['guestLastName'] ?? ($nameParts[1] ?? '')),
    'guestEmail' => raiaccept_trimmed_string($input['guestEmail'] ?? $input['email'] ?? ''),
    'guestPhone' => raiaccept_trimmed_string($input['guestPhone'] ?? $input['phone'] ?? ''),
    'roomName' => raiaccept_trimmed_string($input['roomName'] ?? ''),
    'checkIn' => raiaccept_trimmed_string($input['checkIn'] ?? $input['checkin'] ?? ''),
    'checkOut' => raiaccept_trimmed_string($input['checkOut'] ?? $input['checkout'] ?? ''),
    'adults' => $input['adults'] ?? '',
    'children' => $input['children'] ?? '',
    'nights' => $input['nights'] ?? '',
    'total' => $input['total'] ?? $input['amount'] ?? '',
    'currency' => raiaccept_trimmed_string($input['currency'] ?? 'EUR') ?: 'EUR',
    'notes' => raiaccept_trimmed_string($input['notes'] ?? ''),
]);

raiaccept_json_response(!empty($result['ok']) ? 200 : 409, $result);
