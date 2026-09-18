<?php

declare(strict_types=1);

require_once __DIR__ . '/otello-lib.php';

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
    $otelloResult = otello_dispatch_from_booking_confirmation($merchantOrderReference, [
        'orderIdentification' => $orderIdentification,
    ]);
    $status['otello'] = $otelloResult;
    $status['otelloSent'] = !empty($otelloResult['ok']);
} elseif (
    ($status['paymentStatus'] ?? '') === 'paid'
    && $merchantOrderReference !== ''
    && raiaccept_is_extra_order_reference($merchantOrderReference)
) {
    $emailResult = raiaccept_dispatch_paid_extra_emails($merchantOrderReference, [
        'orderIdentification' => $orderIdentification,
        'skipPaymentRecheck' => true,
    ]);
    $status['hotelEmailSent'] = !empty($emailResult['hotelSent']);
}

raiaccept_json_response(200, $status);
