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

raiaccept_json_response(200, raiaccept_create_checkout($input));
