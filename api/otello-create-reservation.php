<?php

declare(strict_types=1);

require __DIR__ . '/otello-lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    raiaccept_json_response(405, ['error' => 'Method not allowed. Use POST.']);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    raiaccept_json_response(400, ['error' => 'Invalid JSON body.']);
}

$result = otello_dispatch_reservation($input);
$status = !empty($result['ok']) ? 200 : 502;
raiaccept_json_response($status, $result);
