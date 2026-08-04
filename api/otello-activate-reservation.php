<?php

declare(strict_types=1);

/**
 * Complete Otello activation for an existing temporary reservation (steps 2–5),
 * or the full 5-step flow when reservatGid is omitted.
 *
 * Hotech sequential workflow:
 *   1. POST /reservat/list/ins
 *   2. POST /client/list/ins            -> accid
 *   3. GET /contactype/list + POST /contact/ins
 *   4. POST /resname/list/ins
 *   5. PATCH /reservat/list/patch       -> status "A" + accid
 *
 * POST JSON (activation only — reservation already created):
 * {
 *   "reservatGid": 123456,
 *   "firstname": "...",
 *   "lastname": "...",
 *   "email": "...",
 *   "tel": "...",
 *   "checkin": "2026-08-01",
 *   "checkout": "2026-08-02",
 *   "merchantOrderReference": "optional-dedupe-key"
 * }
 *
 * Omit reservatGid to run the complete flow from step 1.
 */
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
