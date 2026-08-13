<?php

declare(strict_types=1);

require __DIR__ . '/raiaccept-lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    raiaccept_json_response(405, ['error' => 'Method not allowed. Use POST.']);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    raiaccept_json_response(400, ['error' => 'Invalid JSON body.']);
}

$merchantOrderReference = raiaccept_trimmed_string($input['merchantOrderReference'] ?? '');
if ($merchantOrderReference === '') {
    raiaccept_json_response(400, ['error' => 'merchantOrderReference is required.']);
}

$result = raiaccept_dispatch_paid_extra_emails($merchantOrderReference, [
    'orderIdentification' => raiaccept_trimmed_string($input['orderIdentification'] ?? ''),
    'guest' => is_array($input['guest'] ?? null) ? $input['guest'] : null,
    'cart' => is_array($input['cart'] ?? null) ? $input['cart'] : null,
]);

if (empty($result['ok'])) {
    raiaccept_json_response(empty($result['hotelSent']) ? 409 : 200, $result);
}

raiaccept_json_response(200, $result);
