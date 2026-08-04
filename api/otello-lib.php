<?php

declare(strict_types=1);

require __DIR__ . '/raiaccept-lib.php';

function otello_config_path(): string
{
    $local = __DIR__ . '/otello-config.php';
    if (is_file($local)) {
        return $local;
    }

    return __DIR__ . '/otello-config.example.php';
}

function otello_load_config(): array
{
    $config = require otello_config_path();
    if (!is_array($config)) {
        return [];
    }

    $config['hotelrefno'] = otello_resolve_hotelrefno($config);
    return $config;
}

function otello_resolve_hotelrefno(array $config): int
{
    $env = getenv('OTELLO_HOTELREFNO');
    if (is_string($env) && trim($env) !== '' && ctype_digit(trim($env))) {
        return (int) trim($env);
    }

    $raw = $config['hotelrefno'] ?? 0;
    if (is_numeric($raw) && (int) $raw > 0) {
        return (int) $raw;
    }

    return 0;
}

function otello_hotelrefno_is_configured(array $config): bool
{
    return (int) ($config['hotelrefno'] ?? 0) > 0;
}

function otello_config_error(array $config): ?string
{
    if (!otello_hotelrefno_is_configured($config)) {
        return 'Otello hotelrefno is not configured. Set OTELLO_HOTELREFNO on the server or hotelrefno in api/otello-config.php.';
    }

    return null;
}

function otello_sent_log_path(): string
{
    return __DIR__ . '/.otello-sent.json';
}

function otello_sent_log_entries(): array
{
    $path = otello_sent_log_path();
    if (!is_file($path)) {
        return [];
    }

    $contents = @file_get_contents($path);
    if (!is_string($contents) || trim($contents) === '') {
        return [];
    }

    $decoded = json_decode($contents, true);
    return is_array($decoded) ? $decoded : [];
}

function otello_already_sent(string $key): bool
{
    if ($key === '') {
        return false;
    }

    $entry = otello_sent_log_entries()[$key] ?? null;
    if (!is_array($entry)) {
        return false;
    }

    return ($entry['status'] ?? '') === 'A';
}

function otello_mark_sent(string $key, array $meta = []): void
{
    if ($key === '') {
        return;
    }

    $path = otello_sent_log_path();
    $storageDir = dirname($path);
    if (!is_dir($storageDir) && !@mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        return;
    }

    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return;
    }

    rewind($handle);
    $contents = stream_get_contents($handle);
    $entries = [];
    if (is_string($contents) && trim($contents) !== '') {
        $decoded = json_decode($contents, true);
        if (is_array($decoded)) {
            $entries = $decoded;
        }
    }

    $existing = is_array($entries[$key] ?? null) ? $entries[$key] : [];
    $entries[$key] = array_merge($existing, $meta, ['sentAt' => gmdate('c')]);
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($entries, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function otello_api_base(array $config): string
{
    $base = raiaccept_trimmed_string($config['api_base'] ?? '');
    if ($base !== '') {
        return rtrim($base, '/');
    }

    $legacy = raiaccept_trimmed_string($config['endpoint'] ?? '');
    if ($legacy !== '' && preg_match('#^(https?://[^/]+/orest)#i', $legacy, $matches)) {
        return rtrim($matches[1], '/');
    }

    return 'https://cloud.hotech.systems/orest';
}

function otello_endpoint_url(array $config, string $endpointKey): string
{
    $base = otello_api_base($config);
    $paths = $config['endpoints'] ?? [];
    $path = raiaccept_trimmed_string($paths[$endpointKey] ?? '');
    if ($path === '') {
        return '';
    }

    if ($path[0] !== '/') {
        $path = '/' . $path;
    }

    $hotelrefno = (int) ($config['hotelrefno'] ?? 999984);
    return $base . $path . '?hotelrefno=' . $hotelrefno;
}

function otello_room_type_id(string $roomSlug, array $config): int
{
    $slug = strtolower(preg_replace('/[^a-z0-9-]/', '', $roomSlug) ?? '');
    $map = $config['room_type_ids'] ?? [];
    if ($slug !== '' && isset($map[$slug]) && (int) $map[$slug] > 0) {
        return (int) $map[$slug];
    }

    return (int) ($config['default_room_type_id'] ?? 3304);
}

function otello_format_note(string $notes): string
{
    $base = trim($notes);
    $suffix = ' - [Website Direct Booking - Paid with CC]';

    if ($base === '') {
        return ltrim($suffix, ' ');
    }

    return $base . $suffix;
}

function otello_normalize_date(string $value): string
{
    $value = raiaccept_trimmed_string($value);
    if ($value === '') {
        return '';
    }

    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
    if ($date instanceof DateTimeImmutable) {
        return $date->format('Y-m-d');
    }

    return $value;
}

function otello_build_reservation_payload(array $input, array $config): array
{
    $roomSlug = raiaccept_booking_room_slug($input['roomType'] ?? $input['room'] ?? '');
    $roomTypeId = otello_room_type_id($roomSlug, $config);
    $note = otello_format_note(raiaccept_trimmed_string($input['note'] ?? $input['notes'] ?? $input['message'] ?? ''));

    return [
        'paytype' => '1510100',
        'sourceid' => 3622876,
        'agencysubid' => 101728125,
        'ressegmentid' => 223,
        'resdefinitid' => 24749,
        'rescountryid' => 441,
        'boardtypeid' => 46,
        'agencyid' => 121833980,
        'status' => 'T',
        'pricecurrid' => 3,
        'needinvoice' => true,
        'hotelrefno' => (int) ($config['hotelrefno'] ?? 999984),
        'totalroom' => 1,
        'checkin' => otello_normalize_date((string) ($input['checkin'] ?? $input['checkIn'] ?? '')),
        'checkout' => otello_normalize_date((string) ($input['checkout'] ?? $input['checkOut'] ?? '')),
        'firstname' => raiaccept_truncate(raiaccept_trimmed_string($input['firstname'] ?? $input['firstName'] ?? $input['guestFirstName'] ?? ''), 32),
        'lastname' => raiaccept_truncate(raiaccept_trimmed_string($input['lastname'] ?? $input['lastName'] ?? $input['guestLastName'] ?? ''), 32),
        'email' => raiaccept_truncate(raiaccept_trimmed_string($input['email'] ?? ''), 64),
        'tel' => raiaccept_truncate(raiaccept_trimmed_string($input['tel'] ?? $input['phone'] ?? ''), 32),
        'totalpax' => raiaccept_booking_positive_int($input['totalpax'] ?? $input['adults'] ?? 1, 1, 6, 1),
        'totalchd1' => raiaccept_booking_positive_int($input['totalchd1'] ?? $input['children'] ?? 0, 0, 2, 0),
        'roomtypeid' => $roomTypeId,
        'bookedrtypeid' => $roomTypeId,
        'note' => raiaccept_truncate($note, 500),
        'remarknote' => raiaccept_truncate($note, 500),
    ];
}

function otello_build_client_payload(array $reservationPayload, int $reservatGid, array $config): array
{
    return [
        'hotelrefno' => (int) ($config['hotelrefno'] ?? 999984),
        'reservatgid' => $reservatGid,
        'firstname' => $reservationPayload['firstname'],
        'lastname' => $reservationPayload['lastname'],
        'email' => $reservationPayload['email'],
        'tel' => $reservationPayload['tel'],
        'rescountryid' => (int) ($reservationPayload['rescountryid'] ?? 441),
        'totalpax' => (int) ($reservationPayload['totalpax'] ?? 1),
        'totalchd1' => (int) ($reservationPayload['totalchd1'] ?? 0),
    ];
}

function otello_build_contact_payload(int $accid, int $contactTypeId, string $value, array $config): array
{
    return [
        'hotelrefno' => (int) ($config['hotelrefno'] ?? 999984),
        'accid' => $accid,
        'contactypeid' => $contactTypeId,
        'contactypegid' => $contactTypeId,
        'contact' => $value,
        'contactvalue' => $value,
        'value' => $value,
    ];
}

function otello_build_resname_payload(
    array $reservationPayload,
    int $reservatGid,
    int $accid,
    array $config
): array {
    return [
        'hotelrefno' => (int) ($config['hotelrefno'] ?? 999984),
        'accid' => $accid,
        'reservatgid' => $reservatGid,
        'gid' => $reservatGid,
        'firstname' => $reservationPayload['firstname'],
        'lastname' => $reservationPayload['lastname'],
        'email' => $reservationPayload['email'],
        'tel' => $reservationPayload['tel'],
        'ismain' => true,
        'isprimary' => true,
        'totalpax' => (int) ($reservationPayload['totalpax'] ?? 1),
        'totalchd1' => (int) ($reservationPayload['totalchd1'] ?? 0),
    ];
}

function otello_build_activate_payload(int $reservatGid, int $accid): array
{
    return [
        'status' => 'A',
        'gid' => $reservatGid,
        'accid' => $accid,
    ];
}

function otello_validate_reservation_payload(array $payload): ?string
{
    if ($payload['checkin'] === '' || $payload['checkout'] === '') {
        return 'Check-in and check-out dates are required.';
    }
    if ($payload['firstname'] === '' || $payload['lastname'] === '') {
        return 'Guest first name and surname are required.';
    }
    if ($payload['email'] === '') {
        return 'Guest email is required.';
    }
    if ($payload['tel'] === '') {
        return 'Guest phone number is required.';
    }

    $checkIn = DateTimeImmutable::createFromFormat('!Y-m-d', $payload['checkin']);
    $checkOut = DateTimeImmutable::createFromFormat('!Y-m-d', $payload['checkout']);
    if (!$checkIn || !$checkOut || $checkOut <= $checkIn) {
        return 'Invalid stay dates.';
    }

    return null;
}

function otello_encode_body($payload): ?string
{
    if ($payload === null) {
        return '';
    }

    $body = json_encode($payload, JSON_UNESCAPED_SLASHES);
    return is_string($body) ? $body : null;
}

function otello_api_request(string $method, string $url, $payload, array $config): array
{
    if ($url === '') {
        return [
            'ok' => false,
            'error' => 'Otello endpoint is not configured.',
        ];
    }

    if (!function_exists('curl_init')) {
        return [
            'ok' => false,
            'error' => 'cURL is not available on the server.',
        ];
    }

    $method = strtoupper($method);
    $body = null;
    if ($method !== 'GET') {
        $body = otello_encode_body($payload);
        if ($body === null) {
            return [
                'ok' => false,
                'error' => 'Could not encode Otello payload.',
            ];
        }
    }

    $ch = curl_init($url);
    $headers = [
        'Content-Type: application/json',
        'Reqtype: Company',
        'User-Agent: GappWS v0.0.1',
    ];

    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_HTTPHEADER => $headers,
    ];

    if ($method === 'GET') {
        $options[CURLOPT_HTTPGET] = true;
    } elseif ($method === 'POST') {
        $options[CURLOPT_POST] = true;
        $options[CURLOPT_POSTFIELDS] = $body;
    } else {
        $options[CURLOPT_CUSTOMREQUEST] = $method;
        $options[CURLOPT_POSTFIELDS] = $body;
    }

    curl_setopt_array($ch, $options);

    $responseBody = curl_exec($ch);
    $curlError = curl_error($ch);
    $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($responseBody === false) {
        return [
            'ok' => false,
            'error' => $curlError !== '' ? $curlError : 'Otello request failed.',
            'statusCode' => $statusCode,
            'request' => $payload,
        ];
    }

    $decoded = json_decode($responseBody, true);
    $ok = $statusCode >= 200 && $statusCode < 300;

    return [
        'ok' => $ok,
        'statusCode' => $statusCode,
        'response' => $decoded !== null ? $decoded : $responseBody,
        'request' => $payload,
    ];
}

function otello_step_failure(string $step, array $result, array $context = []): array
{
    return array_merge([
        'ok' => false,
        'step' => $step,
        'error' => $result['error'] ?? otello_response_has_error($result['response'] ?? null) ?? 'Otello request failed.',
        'statusCode' => $result['statusCode'] ?? 0,
        'response' => $result['response'] ?? null,
        'request' => $result['request'] ?? null,
    ], $context);
}

function otello_response_has_error($response): ?string
{
    if (!is_array($response)) {
        return null;
    }

    if (isset($response['error']) && is_string($response['error']) && $response['error'] !== '') {
        return $response['error'];
    }
    if (isset($response['message']) && is_string($response['message']) && stripos($response['message'], 'error') !== false) {
        return $response['message'];
    }

    foreach ($response as $item) {
        if (!is_array($item)) {
            continue;
        }
        if (isset($item['error']) && is_string($item['error']) && $item['error'] !== '') {
            return $item['error'];
        }
        if (isset($item['success']) && $item['success'] === false) {
            $message = raiaccept_trimmed_string($item['message'] ?? $item['errormessage'] ?? 'Otello request failed.');
            return $message !== '' ? $message : 'Otello request failed.';
        }
    }

    return null;
}

function otello_extract_scalar($response, array $keys): ?int
{
    if (!is_array($response)) {
        return null;
    }

    foreach ($keys as $key) {
        if (isset($response[$key]) && is_numeric($response[$key]) && (int) $response[$key] > 0) {
            return (int) $response[$key];
        }
    }

    foreach ($response as $value) {
        if (!is_array($value)) {
            continue;
        }
        $found = otello_extract_scalar($value, $keys);
        if ($found !== null) {
            return $found;
        }
    }

    return null;
}

function otello_extract_gid($response): ?int
{
    if (is_int($response) || (is_string($response) && ctype_digit($response))) {
        return (int) $response;
    }

    return otello_extract_scalar($response, [
        'gid',
        'reservatgid',
        'reservatGid',
        'reservationgid',
        'reservationGid',
    ]);
}

function otello_extract_accid($response): ?int
{
    if (is_int($response) || (is_string($response) && ctype_digit($response))) {
        return (int) $response;
    }

    return otello_extract_scalar($response, [
        'accid',
        'accId',
        'accountid',
        'accountId',
        'clientaccid',
        'clientAccId',
    ]);
}

function otello_extract_reservation_number($response): ?int
{
    return otello_extract_scalar($response, [
        'reservatno',
        'reservationno',
        'reservationNo',
        'resno',
        'reservationnumber',
    ]);
}

function otello_parse_reservation_response($response): array
{
    return [
        'gid' => otello_extract_gid($response),
        'reservatno' => otello_extract_reservation_number($response),
    ];
}

function otello_create_temporary_reservation(array $payload, array $config): array
{
    $url = otello_endpoint_url($config, 'reservation_ins');
    $result = otello_api_request('POST', $url, [$payload], $config);
    if (empty($result['ok'])) {
        $result['step'] = 'reservation_ins';
        return $result;
    }

    $apiError = otello_response_has_error($result['response'] ?? null);
    if ($apiError !== null) {
        return otello_step_failure('reservation_ins', $result);
    }

    $parsed = otello_parse_reservation_response($result['response'] ?? null);
    $gid = $parsed['gid'];
    if ($gid === null) {
        return otello_step_failure('reservation_ins', $result, [
            'error' => 'Reservation was created but Otello did not return reservat gid.',
            'reservatno' => $parsed['reservatno'],
        ]);
    }

    $result['reservatGid'] = $gid;
    $result['reservatno'] = $parsed['reservatno'];
    $result['step'] = 'reservation_ins';
    return $result;
}

function otello_insert_client(array $clientPayload, array $config): array
{
    $url = otello_endpoint_url($config, 'client_ins');
    $result = otello_api_request('POST', $url, [$clientPayload], $config);
    $result['step'] = 'client_ins';

    if (empty($result['ok'])) {
        return $result;
    }

    $apiError = otello_response_has_error($result['response'] ?? null);
    if ($apiError !== null) {
        return otello_step_failure('client_ins', $result);
    }

    $accid = otello_extract_accid($result['response'] ?? null);
    if ($accid === null) {
        return otello_step_failure('client_ins', $result, [
            'error' => 'Client profile was created but Otello did not return accid.',
        ]);
    }

    $result['accid'] = $accid;
    $clientGid = otello_extract_gid($result['response'] ?? null);
    if ($clientGid !== null) {
        $result['clientGid'] = $clientGid;
    }

    return $result;
}

function otello_collect_contact_type_rows($response): array
{
    if (!is_array($response)) {
        return [];
    }

    if (isset($response['gid']) || isset($response['contactypeid']) || isset($response['name'])) {
        return [$response];
    }

    $rows = [];
    foreach ($response as $item) {
        if (is_array($item)) {
            if (isset($item['gid']) || isset($item['contactypeid']) || isset($item['name'])) {
                $rows[] = $item;
            } else {
                $rows = array_merge($rows, otello_collect_contact_type_rows($item));
            }
        }
    }

    return $rows;
}

function otello_contact_type_label(array $row): string
{
    $parts = [];
    foreach (['name', 'contactypename', 'typename', 'code', 'shortname', 'description'] as $key) {
        if (!empty($row[$key]) && is_string($row[$key])) {
            $parts[] = strtolower($row[$key]);
        }
    }

    return implode(' ', $parts);
}

function otello_match_contact_type_id(array $rows, array $keywords): ?int
{
    foreach ($rows as $row) {
        $label = otello_contact_type_label($row);
        foreach ($keywords as $keyword) {
            if ($keyword !== '' && strpos($label, strtolower($keyword)) !== false) {
                $id = otello_extract_scalar($row, ['gid', 'contactypeid', 'contactypegid', 'id']);
                if ($id !== null) {
                    return $id;
                }
            }
        }
    }

    return null;
}

function otello_fetch_contact_types(array $config): array
{
    $url = otello_endpoint_url($config, 'contactype_list');
    $result = otello_api_request('GET', $url, null, $config);
    $result['step'] = 'contactype_list';

    if (empty($result['ok'])) {
        $postResult = otello_api_request('POST', $url, [], $config);
        $postResult['step'] = 'contactype_list';
        if (!empty($postResult['ok'])) {
            $result = $postResult;
        }
    }

    if (empty($result['ok'])) {
        return $result;
    }

    $apiError = otello_response_has_error($result['response'] ?? null);
    if ($apiError !== null) {
        return otello_step_failure('contactype_list', $result);
    }

    $rows = otello_collect_contact_type_rows($result['response'] ?? null);
    if ($rows === []) {
        return otello_step_failure('contactype_list', $result, [
            'error' => 'Contact type list returned no rows.',
        ]);
    }

    $result['rows'] = $rows;
    return $result;
}

function otello_resolve_contact_type_ids(array $config): array
{
    $fallback = $config['contact_type_ids'] ?? [];
    $keywords = $config['contact_type_keywords'] ?? [
        'email' => ['email', 'e-mail', 'mail'],
        'phone' => ['phone', 'tel', 'mobile', 'gsm'],
    ];

    $emailId = (int) ($fallback['email'] ?? 0);
    $phoneId = (int) ($fallback['phone'] ?? 0);

    $listResult = otello_fetch_contact_types($config);
    if (!empty($listResult['ok']) && !empty($listResult['rows'])) {
        if ($emailId <= 0) {
            $emailId = otello_match_contact_type_id($listResult['rows'], $keywords['email'] ?? []) ?? 0;
        }
        if ($phoneId <= 0) {
            $phoneId = otello_match_contact_type_id($listResult['rows'], $keywords['phone'] ?? []) ?? 0;
        }
    }

    return [
        'ok' => $emailId > 0 && $phoneId > 0,
        'email' => $emailId,
        'phone' => $phoneId,
        'contactype_list' => $listResult,
    ];
}

function otello_insert_contact(int $accid, int $contactTypeId, string $value, array $config, string $label): array
{
    $url = otello_endpoint_url($config, 'contact_ins');
    $payload = otello_build_contact_payload($accid, $contactTypeId, $value, $config);
    $result = otello_api_request('POST', $url, [$payload], $config);
    $result['step'] = 'contact_ins_' . $label;

    if (empty($result['ok'])) {
        return $result;
    }

    $apiError = otello_response_has_error($result['response'] ?? null);
    if ($apiError !== null) {
        return otello_step_failure('contact_ins', $result, ['contactLabel' => $label]);
    }

    return $result;
}

function otello_insert_guest_contacts(int $accid, array $reservationPayload, array $config): array
{
    $types = otello_resolve_contact_type_ids($config);
    if (empty($types['ok'])) {
        return [
            'ok' => false,
            'step' => 'contactype_list',
            'error' => 'Could not resolve email/phone contact type IDs from Otello.',
            'contactTypes' => $types,
        ];
    }

    $emailResult = otello_insert_contact(
        $accid,
        (int) $types['email'],
        $reservationPayload['email'],
        $config,
        'email'
    );
    if (empty($emailResult['ok'])) {
        $emailResult['step'] = 'contact_ins';
        return $emailResult;
    }

    $phoneResult = otello_insert_contact(
        $accid,
        (int) $types['phone'],
        $reservationPayload['tel'],
        $config,
        'phone'
    );
    if (empty($phoneResult['ok'])) {
        $phoneResult['step'] = 'contact_ins';
        return $phoneResult;
    }

    return [
        'ok' => true,
        'step' => 'contact_ins',
        'contactTypes' => [
            'email' => (int) $types['email'],
            'phone' => (int) $types['phone'],
        ],
        'email' => $emailResult['response'] ?? null,
        'phone' => $phoneResult['response'] ?? null,
        'contactype_list' => $types['contactype_list']['response'] ?? null,
    ];
}

function otello_insert_resname(array $resnamePayload, array $config): array
{
    $url = otello_endpoint_url($config, 'resname_ins');
    $result = otello_api_request('POST', $url, [$resnamePayload], $config);
    $result['step'] = 'resname_ins';

    if (empty($result['ok'])) {
        return $result;
    }

    $apiError = otello_response_has_error($result['response'] ?? null);
    if ($apiError !== null) {
        return otello_step_failure('resname_ins', $result);
    }

    return $result;
}

function otello_activate_reservation(array $activatePayload, array $config): array
{
    $url = otello_endpoint_url($config, 'reservation_patch');
    $result = otello_api_request('PATCH', $url, [$activatePayload], $config);
    $result['step'] = 'reservation_patch';

    if (empty($result['ok'])) {
        return $result;
    }

    $apiError = otello_response_has_error($result['response'] ?? null);
    if ($apiError !== null) {
        return otello_step_failure('reservation_patch', $result);
    }

    return $result;
}

function otello_finish_activation(
    array $input,
    array $config,
    array $reservationPayload,
    int $reservatGid,
    ?array $tempResult = null
): array {
    $reference = raiaccept_trimmed_string(
        $input['merchantOrderReference'] ?? $input['orderRef'] ?? ''
    );

    $clientPayload = otello_build_client_payload($reservationPayload, $reservatGid, $config);
    $clientResult = otello_insert_client($clientPayload, $config);
    if (empty($clientResult['ok'])) {
        return otello_step_failure('client_ins', $clientResult, [
            'reservatGid' => $reservatGid,
            'reservatno' => $tempResult['reservatno'] ?? null,
            'hotelrefno' => (int) ($config['hotelrefno'] ?? 0),
            'temporaryReservation' => $tempResult['response'] ?? null,
        ]);
    }

    $accid = (int) ($clientResult['accid'] ?? 0);
    if ($accid <= 0) {
        return [
            'ok' => false,
            'step' => 'client_ins',
            'error' => 'Client insert succeeded but accid is missing.',
            'reservatGid' => $reservatGid,
            'response' => $clientResult['response'] ?? null,
        ];
    }

    $contactResult = otello_insert_guest_contacts($accid, $reservationPayload, $config);
    if (empty($contactResult['ok'])) {
        return array_merge($contactResult, [
            'reservatGid' => $reservatGid,
            'accid' => $accid,
            'reservatno' => $tempResult['reservatno'] ?? null,
            'clientInsert' => $clientResult['response'] ?? null,
        ]);
    }

    $resnamePayload = otello_build_resname_payload($reservationPayload, $reservatGid, $accid, $config);
    $resnameResult = otello_insert_resname($resnamePayload, $config);
    if (empty($resnameResult['ok'])) {
        return otello_step_failure('resname_ins', $resnameResult, [
            'reservatGid' => $reservatGid,
            'accid' => $accid,
            'reservatno' => $tempResult['reservatno'] ?? null,
            'clientInsert' => $clientResult['response'] ?? null,
            'contactInsert' => $contactResult,
        ]);
    }

    $activatePayload = otello_build_activate_payload($reservatGid, $accid);
    $activateResult = otello_activate_reservation($activatePayload, $config);
    if (empty($activateResult['ok'])) {
        return otello_step_failure('reservation_patch', $activateResult, [
            'reservatGid' => $reservatGid,
            'accid' => $accid,
            'reservatno' => $tempResult['reservatno'] ?? null,
            'clientInsert' => $clientResult['response'] ?? null,
            'contactInsert' => $contactResult,
            'resnameInsert' => $resnameResult['response'] ?? null,
        ]);
    }

    if ($reference !== '') {
        otello_mark_sent($reference, [
            'status' => 'A',
            'reservatGid' => $reservatGid,
            'reservatno' => $tempResult['reservatno'] ?? null,
            'accid' => $accid,
            'clientGid' => $clientResult['clientGid'] ?? null,
            'roomtypeid' => $reservationPayload['roomtypeid'],
            'checkin' => $reservationPayload['checkin'],
            'checkout' => $reservationPayload['checkout'],
            'hotelrefno' => (int) ($config['hotelrefno'] ?? 0),
        ]);
    }

    return [
        'ok' => true,
        'merchantOrderReference' => $reference,
        'reservatGid' => $reservatGid,
        'reservatno' => $tempResult['reservatno'] ?? null,
        'accid' => $accid,
        'clientGid' => $clientResult['clientGid'] ?? null,
        'status' => 'A',
        'hotelrefno' => (int) ($config['hotelrefno'] ?? 0),
        'activationFlow' => 'reservation_ins -> client_ins -> contactype_list/contact_ins -> resname_ins -> reservation_patch',
        'steps' => [
            'reservation_ins' => $tempResult['response'] ?? null,
            'client_ins' => $clientResult['response'] ?? null,
            'contactype_list' => $contactResult['contactype_list'] ?? null,
            'contact_ins' => [
                'email' => $contactResult['email'] ?? null,
                'phone' => $contactResult['phone'] ?? null,
            ],
            'resname_ins' => $resnameResult['response'] ?? null,
            'reservation_patch' => $activateResult['response'] ?? null,
        ],
        'message' => 'Active reservation created in Otello PMS successfully.',
    ];
}

function otello_dispatch_reservation(array $input): array
{
    $reference = raiaccept_trimmed_string(
        $input['merchantOrderReference'] ?? $input['orderRef'] ?? ''
    );
    if ($reference !== '' && otello_already_sent($reference)) {
        $entry = otello_sent_log_entries()[$reference] ?? [];
        return [
            'ok' => true,
            'alreadySent' => true,
            'merchantOrderReference' => $reference,
            'reservatGid' => $entry['reservatGid'] ?? null,
            'reservatno' => $entry['reservatno'] ?? null,
            'accid' => $entry['accid'] ?? null,
            'status' => $entry['status'] ?? 'A',
            'hotelrefno' => $entry['hotelrefno'] ?? null,
            'message' => 'Active reservation already sent to Otello PMS.',
        ];
    }

    $config = otello_load_config();
    $configError = otello_config_error($config);
    if ($configError !== null) {
        return [
            'ok' => false,
            'error' => $configError,
        ];
    }

    $reservationPayload = otello_build_reservation_payload($input, $config);
    $validationError = otello_validate_reservation_payload($reservationPayload);
    if ($validationError !== null) {
        return [
            'ok' => false,
            'error' => $validationError,
        ];
    }

    $existingGid = raiaccept_booking_positive_int(
        $input['reservatGid'] ?? $input['gid'] ?? $input['reservatgid'] ?? 0,
        0,
        PHP_INT_MAX,
        0
    );

    if ($existingGid > 0) {
        return otello_finish_activation($input, $config, $reservationPayload, $existingGid);
    }

    $tempResult = otello_create_temporary_reservation($reservationPayload, $config);
    if (empty($tempResult['ok'])) {
        $tempResult['hotelrefno'] = (int) ($config['hotelrefno'] ?? 0);
        return $tempResult;
    }

    $reservatGid = (int) ($tempResult['reservatGid'] ?? 0);
    return otello_finish_activation($input, $config, $reservationPayload, $reservatGid, $tempResult);
}
