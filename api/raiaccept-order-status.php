<?php

declare(strict_types=1);

require __DIR__ . '/raiaccept-lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    raiaccept_json_response(405, ['error' => 'Method not allowed. Use GET.']);
}

$orderIdentification = trim((string) ($_GET['orderIdentification'] ?? ''));
if ($orderIdentification === '') {
    raiaccept_json_response(400, ['error' => 'orderIdentification query parameter is required.']);
}

$status = raiaccept_get_order_payment_status($orderIdentification);
$merchantOrderReference = raiaccept_trimmed_string($status['merchantOrderReference'] ?? '');

// The RaiAccept webhook is the primary notification path. This is a paid-only
// fallback for the browser return flow if the payment provider webhook was
// delayed or unavailable.
if (
    ($status['paymentStatus'] ?? '') === 'paid'
    && $merchantOrderReference !== ''
    && raiaccept_webhook_is_room_booking(['merchantOrderReference' => $merchantOrderReference])
    && raiaccept_load_booking_confirmation($merchantOrderReference) !== null
) {
    $emailResult = raiaccept_dispatch_paid_booking_emails($merchantOrderReference, [
        'orderIdentification' => $orderIdentification,
        'skipPaymentRecheck' => true,
    ]);
    $status['hotelEmailSent'] = !empty($emailResult['hotelSent']);
    $status['guestEmailSent'] = !empty($emailResult['guestSent']);
}

raiaccept_json_response(200, $status);
