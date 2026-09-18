<?php

declare(strict_types=1);

require_once __DIR__ . '/otello-lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    raiaccept_json_response(405, ['error' => 'Method not allowed. Use POST.']);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    raiaccept_json_response(400, ['error' => 'Invalid JSON body.']);
}

raiaccept_send_webhook_email($input);

$merchantOrderReference = raiaccept_trimmed_string(
    raiaccept_first_by_key($input, 'merchantOrderReference')
);
if (
    raiaccept_successful_purchase($input)
    && $merchantOrderReference !== ''
    && raiaccept_webhook_is_room_booking(['merchantOrderReference' => $merchantOrderReference])
    && raiaccept_load_booking_confirmation($merchantOrderReference) !== null
) {
    otello_dispatch_from_booking_confirmation($merchantOrderReference, [
        'orderIdentification' => raiaccept_trimmed_string(
            raiaccept_first_by_key($input, 'orderIdentification')
        ),
    ]);
}

raiaccept_json_response(200, [
    'received' => true,
]);
