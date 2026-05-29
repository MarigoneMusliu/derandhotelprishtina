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

raiaccept_json_response(200, raiaccept_get_order_payment_status($orderIdentification));
