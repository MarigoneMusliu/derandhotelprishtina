<?php

declare(strict_types=1);

require_once __DIR__ . '/raiaccept-lib.php';

function otello_config_paths(): array
{
    $apiDir = __DIR__;
    $publicRoot = dirname($apiDir);
    $privateRoot = dirname($publicRoot);
    $accountRoot = dirname($privateRoot);
    $paths = [
        $privateRoot . '/otello-private-config.php',
        $publicRoot . '/otello-private-config.php',
        $accountRoot . '/otello-private-config.php',
        __DIR__ . '/otello-config.php',
        __DIR__ . '/_otello-config.local.php',
        $privateRoot . '/otello-config.php',
        $accountRoot . '/otello-config.php',
    ];

    $envPath = getenv('OTELLO_CONFIG_PATH');
    if (is_string($envPath) && trim($envPath) !== '') {
        array_unshift($paths, trim($envPath));
    }

    $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    if (is_string($documentRoot) && trim($documentRoot) !== '') {
        $documentRoot = rtrim(trim($documentRoot), "/\\");
        $documentRootParent = dirname($documentRoot);
        $documentRootGrandparent = dirname($documentRootParent);
        $paths[] = $documentRootParent . '/otello-private-config.php';
        $paths[] = $documentRootParent . '/otello-config.php';
        $paths[] = $documentRootGrandparent . '/otello-private-config.php';
        $paths[] = $documentRootGrandparent . '/otello-config.php';
    }

    return array_values(array_unique($paths));
}

function otello_config_path(): string
{
    foreach (otello_config_paths() as $path) {
        if (is_file($path)) {
            return $path;
        }
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
    $config['api_token'] = otello_resolve_api_token($config);
    $config['username'] = otello_resolve_username($config);
    $config['password'] = otello_resolve_password($config);
    return $config;
}

function otello_resolve_username(array $config): string
{
    $env = getenv('OTELLO_USERNAME');
    if (is_string($env) && trim($env) !== '') {
        return trim($env);
    }

    return raiaccept_trimmed_string($config['username'] ?? '');
}

function otello_resolve_password(array $config): string
{
    $env = getenv('OTELLO_PASSWORD');
    if (is_string($env) && trim($env) !== '') {
        return trim($env);
    }

    return raiaccept_trimmed_string($config['password'] ?? '');
}

function otello_resolve_api_token(array $config): string
{
    $env = getenv('OTELLO_API_TOKEN');
    if (is_string($env) && trim($env) !== '') {
        return trim($env);
    }

    return raiaccept_trimmed_string($config['api_token'] ?? '');
}

function otello_token_cache_path(): string
{
    return __DIR__ . '/.otello-token.json';
}

function otello_read_token_cache(): ?array
{
    $path = otello_token_cache_path();
    if (!is_file($path)) {
        return null;
    }

    $contents = @file_get_contents($path);
    if (!is_string($contents) || trim($contents) === '') {
        return null;
    }

    $decoded = json_decode($contents, true);
    return is_array($decoded) ? $decoded : null;
}

function otello_write_token_cache(array $cache): void
{
    $path = otello_token_cache_path();
    $storageDir = dirname($path);
    if (!is_dir($storageDir) && !@mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        return;
    }

    @file_put_contents(
        $path,
        json_encode($cache, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

function otello_clear_token_cache(): void
{
    $path = otello_token_cache_path();
    if (is_file($path)) {
        @unlink($path);
    }
}

function otello_login_query_params(array $config, string $username, string $password): array
{
    $clientId = raiaccept_trimmed_string($config['client_id'] ?? 'orestClient');
    if ($clientId === '') {
        $clientId = 'orestClient';
    }

    return [
        'hotelrefno' => (int) ($config['hotelrefno'] ?? 0),
        'grant_type' => 'password',
        'client_id' => $clientId,
        'username' => $username,
        'password' => $password,
    ];
}

function otello_login_url(array $config, string $username = '', string $password = ''): string
{
    $base = otello_api_base($config);
    $loginPath = raiaccept_trimmed_string($config['login_path'] ?? 'auth/login');
    if ($loginPath === '') {
        $loginPath = 'auth/login';
    }
    if ($loginPath[0] !== '/') {
        $loginPath = '/' . $loginPath;
    }

    if ($username === '') {
        $username = otello_resolve_username($config);
    }
    if ($password === '') {
        $password = otello_resolve_password($config);
    }

    $query = http_build_query(otello_login_query_params($config, $username, $password));
    return $base . $loginPath . '?' . $query;
}

function otello_login(array $config, bool $forceRefresh = false): array
{
    $staticToken = otello_resolve_api_token($config);
    if ($staticToken !== '') {
        return [
            'ok' => true,
            'access_token' => $staticToken,
            'static' => true,
        ];
    }

    if (!$forceRefresh) {
        $cache = otello_read_token_cache();
        $expiresAt = (int) ($cache['expires_at'] ?? 0);
        $accessToken = raiaccept_trimmed_string($cache['access_token'] ?? '');
        if ($accessToken !== '' && $expiresAt > (time() + 60)) {
            return [
                'ok' => true,
                'access_token' => $accessToken,
                'refresh_token' => raiaccept_trimmed_string($cache['refresh_token'] ?? ''),
                'cached' => true,
                'expires_at' => $expiresAt,
            ];
        }
    } else {
        otello_clear_token_cache();
    }

    $username = otello_resolve_username($config);
    $password = otello_resolve_password($config);
    if ($username === '' || $password === '') {
        return [
            'ok' => false,
            'error' => 'Otello login credentials are not configured.',
        ];
    }

    if (!function_exists('curl_init')) {
        return [
            'ok' => false,
            'error' => 'cURL is not available on the server.',
        ];
    }

    $clientId = raiaccept_trimmed_string($config['client_id'] ?? 'orestClient');
    if ($clientId === '') {
        $clientId = 'orestClient';
    }
    $appName = raiaccept_trimmed_string($config['app_name'] ?? 'GappWS');

    $payload = [
        'username' => $username,
        'password' => $password,
        'grant_type' => 'password',
        'client_id' => $clientId,
    ];
    if ($appName !== '') {
        $payload['app_name'] = $appName;
    }

    $body = otello_encode_body($payload);
    if ($body === null) {
        return [
            'ok' => false,
            'error' => 'Could not encode Otello login payload.',
        ];
    }

    $ch = curl_init(otello_login_url($config));
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'User-Agent: GappWS v0.0.1',
        ],
    ]);

    $responseBody = curl_exec($ch);
    $curlError = curl_error($ch);
    $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($responseBody === false) {
        return [
            'ok' => false,
            'error' => $curlError !== '' ? $curlError : 'Otello login request failed.',
            'statusCode' => $statusCode,
        ];
    }

    $decoded = json_decode($responseBody, true);
    if (!is_array($decoded)) {
        return [
            'ok' => false,
            'error' => 'Otello login response was not valid JSON.',
            'statusCode' => $statusCode,
            'response' => $responseBody,
        ];
    }

    $accessToken = raiaccept_trimmed_string($decoded['access_token'] ?? '');
    if ($statusCode < 200 || $statusCode >= 300 || $accessToken === '') {
        return [
            'ok' => false,
            'error' => raiaccept_trimmed_string(
                $decoded['error_description'] ?? $decoded['message'] ?? $decoded['error'] ?? 'Otello login failed.'
            ),
            'statusCode' => $statusCode,
            'response' => $decoded,
        ];
    }

    $expiresIn = (int) ($decoded['expires_in'] ?? 3600);
    if ($expiresIn <= 0) {
        $expiresIn = 3600;
    }

    $cache = [
        'access_token' => $accessToken,
        'refresh_token' => raiaccept_trimmed_string($decoded['refresh_token'] ?? ''),
        'expires_at' => time() + $expiresIn,
        'fetched_at' => gmdate('c'),
        'username' => raiaccept_trimmed_string($decoded['username'] ?? $username),
    ];
    otello_write_token_cache($cache);

    return [
        'ok' => true,
        'access_token' => $accessToken,
        'refresh_token' => $cache['refresh_token'],
        'expires_in' => $expiresIn,
        'expires_at' => $cache['expires_at'],
        'response' => $decoded,
    ];
}

function otello_get_access_token(array $config, bool $forceRefresh = false): string
{
    $login = otello_login($config, $forceRefresh);
    if (empty($login['ok'])) {
        return '';
    }

    return raiaccept_trimmed_string($login['access_token'] ?? '');
}

function otello_api_headers(array $config, bool $forceRefresh = false): array
{
    $headers = [
        'Content-Type: application/json',
        'User-Agent: GappWS v0.0.1',
    ];

    $token = otello_get_access_token($config, $forceRefresh);
    if ($token !== '') {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    return $headers;
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
        return 'Otello hotelrefno is not configured. Set OTELLO_HOTELREFNO on the server or hotelrefno in otello-private-config.php (one folder above public_html).';
    }

    if (otello_resolve_api_token($config) !== '') {
        return null;
    }

    if (otello_resolve_username($config) === '' || otello_resolve_password($config) === '') {
        return 'Otello login credentials are not configured. Set OTELLO_USERNAME and OTELLO_PASSWORD on the server or username/password in otello-private-config.php.';
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

    return 'https://balkan.hotech.systems/orest';
}

function otello_config_hotelrefno(array $config): int
{
    return (int) ($config['hotelrefno'] ?? 0);
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

    $hotelrefno = otello_config_hotelrefno($config);
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

function otello_format_note(string $notes, string $orderReference = '', bool $isPaid = true): string
{
    $guestNotes = trim($notes);
    $tags = ['Booked on derandhotel.com'];

    if ($isPaid) {
        $tags[] = 'Paid online by card';
    } else {
        $tags[] = 'Website test booking (no payment)';
    }

    if ($orderReference !== '') {
        $tags[] = 'Ref: ' . $orderReference;
    }

    $autoNote = '[' . implode(' | ', $tags) . ']';

    if ($guestNotes === '') {
        return $autoNote;
    }

    return $guestNotes . ' — ' . $autoNote;
}

function otello_country_dial_cache_path(): string
{
    return __DIR__ . '/.otello-country-dial-index.json';
}

function otello_read_country_dial_cache(): ?array
{
    $path = otello_country_dial_cache_path();
    if (!is_file($path)) {
        return null;
    }

    $contents = @file_get_contents($path);
    if (!is_string($contents) || trim($contents) === '') {
        return null;
    }

    $decoded = json_decode($contents, true);
    return is_array($decoded) ? $decoded : null;
}

function otello_write_country_dial_cache(array $cache): void
{
    $path = otello_country_dial_cache_path();
    @file_put_contents(
        $path,
        json_encode($cache, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

function otello_fetch_country_rows(array $config): array
{
    $base = otello_api_base($config);
    $hotelrefno = (int) ($config['hotelrefno'] ?? 0);
    if ($base === '' || $hotelrefno <= 0) {
        return [];
    }

    $rows = [];
    for ($start = 0; $start <= 2000; $start += 100) {
        $url = $base . '/country/list?hotelrefno=' . $hotelrefno . '&start=' . $start . '&count=100';
        $result = otello_api_request('GET', $url, null, $config);
        $batch = $result['response']['data'] ?? [];
        if (!is_array($batch) || $batch === []) {
            break;
        }

        foreach ($batch as $row) {
            if (is_array($row)) {
                $rows[] = $row;
            }
        }

        if (count($batch) < 100) {
            break;
        }
    }

    return $rows;
}

function otello_build_country_dial_index(array $config): array
{
    $cache = otello_read_country_dial_cache();
    if (is_array($cache) && (int) ($cache['expires_at'] ?? 0) > time()) {
        return $cache;
    }

    $map = [];
    foreach (otello_fetch_country_rows($config) as $row) {
        $countryId = (int) ($row['id'] ?? 0);
        $itu = raiaccept_trimmed_string((string) ($row['itu'] ?? ''));
        if ($countryId <= 0 || $itu === '' || $itu === '�') {
            continue;
        }

        $prefix = preg_replace('/\D/', '', $itu) ?? '';
        if ($prefix === '') {
            continue;
        }

        $iso2 = raiaccept_trimmed_string((string) ($row['iso2'] ?? ''));
        if ($iso2 === '' && isset($map[$prefix])) {
            continue;
        }

        $map[$prefix] = $countryId;
    }

    $overrides = $config['phone_dial_to_rescountryid'] ?? [];
    if (is_array($overrides)) {
        foreach ($overrides as $prefix => $countryId) {
            $prefix = preg_replace('/\D/', '', (string) $prefix) ?? '';
            $countryId = (int) $countryId;
            if ($prefix !== '' && $countryId > 0) {
                $map[$prefix] = $countryId;
            }
        }
    }

    $prefixes = array_keys($map);
    usort($prefixes, static function (string $a, string $b): int {
        return strlen($b) <=> strlen($a);
    });

    $cache = [
        'map' => $map,
        'prefixes' => $prefixes,
        'expires_at' => time() + (7 * 86400),
    ];
    otello_write_country_dial_cache($cache);

    return $cache;
}

function otello_phone_digits_for_dial_match(string $tel): string
{
    $tel = trim($tel);
    if ($tel === '') {
        return '';
    }

    $hasPlus = strpos($tel, '+') !== false;
    $digits = preg_replace('/\D/', '', $tel) ?? '';
    if ($digits === '') {
        return '';
    }

    // Only infer country when the guest entered an international number.
    if ($hasPlus || strlen($digits) > 10) {
        return $digits;
    }

    return '';
}

function otello_rescountryid_from_phone(string $tel, array $config): int
{
    $digits = otello_phone_digits_for_dial_match($tel);
    if ($digits === '') {
        return 0;
    }

    $index = otello_build_country_dial_index($config);
    $map = $index['map'] ?? [];
    $prefixes = $index['prefixes'] ?? array_keys($map);
    if (!is_array($prefixes)) {
        $prefixes = [];
    }

    foreach ($prefixes as $prefix) {
        $prefix = (string) $prefix;
        if ($prefix !== '' && strpos($digits, $prefix) === 0) {
            return (int) ($map[$prefix] ?? 0);
        }
    }

    return 0;
}

function otello_apply_rescountryid(array &$payload, int $rescountryid): void
{
    if ($rescountryid > 0) {
        $payload['rescountryid'] = $rescountryid;
    }
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

function otello_round_money(float $value): float
{
    return round($value, 2);
}

function otello_parse_amount($value): ?float
{
    if (is_int($value) || is_float($value)) {
        $amount = (float) $value;
        return $amount > 0 ? otello_round_money($amount) : null;
    }

    if (!is_string($value)) {
        return null;
    }

    $clean = trim($value);
    if ($clean === '') {
        return null;
    }

    $clean = str_replace(',', '.', preg_replace('/[^\d.,-]/', '', $clean) ?? '');
    if ($clean === '' || !is_numeric($clean)) {
        return null;
    }

    $amount = (float) $clean;
    return $amount > 0 ? otello_round_money($amount) : null;
}

function otello_stay_nights(string $checkin, string $checkout): int
{
    $start = DateTimeImmutable::createFromFormat('!Y-m-d', $checkin);
    $end = DateTimeImmutable::createFromFormat('!Y-m-d', $checkout);
    if (!$start || !$end || $end <= $start) {
        return 1;
    }

    return max(1, (int) $start->diff($end)->format('%a'));
}

function otello_resolve_stay_nights(array $input, string $checkin, string $checkout): int
{
    $nights = raiaccept_booking_positive_int($input['nights'] ?? null, 1, 365, 0);
    if ($nights > 0) {
        return $nights;
    }

    return otello_stay_nights($checkin, $checkout);
}

/** Amount the guest actually paid online (card total), not a per-night rate. */
function otello_resolve_booking_total(array $input): ?float
{
    foreach (['paidAmount', 'amount', 'total', 'totalPrice', 'totalprice', 'grandTotal'] as $key) {
        $parsed = otello_parse_amount($input[$key] ?? null);
        if ($parsed !== null) {
            return $parsed;
        }
    }

    return null;
}

function otello_apply_price_fields(array &$payload, ?float $paidTotal, bool $isPaid, int $nights): void
{
    if ($paidTotal === null || $paidTotal <= 0) {
        return;
    }

    $nights = max(1, $nights);
    $dailyAverage = otello_round_money($paidTotal / $nights);

    // Total = full amount paid on the website; daily = that total split across nights.
    $payload['totalprice'] = $paidTotal;
    $payload['subtotal'] = $paidTotal;
    $payload['dailyprice'] = $dailyAverage;
    $payload['ispricelocked'] = true;

    if ($isPaid) {
        $payload['advpayamount'] = $paidTotal;
        if (!empty($payload['pricecurrid'])) {
            $payload['advpaycurrid'] = (int) $payload['pricecurrid'];
        }
    }
}

function otello_reservation_defaults(array $config): array
{
    $defaults = $config['reservation_defaults'] ?? [];
    if (!is_array($defaults)) {
        $defaults = [];
    }

    return [
        'paytype' => raiaccept_trimmed_string($defaults['paytype'] ?? '1510100'),
        'sourceid' => (int) ($defaults['sourceid'] ?? 0),
        'agencysubid' => (int) ($defaults['agencysubid'] ?? 0),
        'agencyid' => (int) ($defaults['agencyid'] ?? 0),
        'ressegmentid' => (int) ($defaults['ressegmentid'] ?? 0),
        'resdefinitid' => (int) ($defaults['resdefinitid'] ?? 0),
        'rescountryid' => (int) ($defaults['rescountryid'] ?? 0),
        'boardtypeid' => (int) ($defaults['boardtypeid'] ?? 0),
        'pricecurrid' => (int) ($defaults['pricecurrid'] ?? 0),
    ];
}

function otello_build_reservation_payload(array $input, array $config): array
{
    $roomSlug = raiaccept_booking_room_slug($input['roomType'] ?? $input['room'] ?? '');
    $roomTypeId = otello_room_type_id($roomSlug, $config);
    $orderReference = raiaccept_trimmed_string(
        $input['merchantOrderReference'] ?? $input['orderRef'] ?? ''
    );
    $isPaid = $orderReference === '' || !preg_match('/^TEST-/i', $orderReference);
    $tel = raiaccept_truncate(raiaccept_trimmed_string($input['tel'] ?? $input['phone'] ?? ''), 32);
    $note = otello_format_note(
        raiaccept_trimmed_string($input['note'] ?? $input['notes'] ?? $input['message'] ?? ''),
        $orderReference,
        $isPaid
    );
    $defaults = otello_reservation_defaults($config);
    $guestCountryId = otello_rescountryid_from_phone($tel, $config);
    $checkin = otello_normalize_date((string) ($input['checkin'] ?? $input['checkIn'] ?? ''));
    $checkout = otello_normalize_date((string) ($input['checkout'] ?? $input['checkOut'] ?? ''));
    $paidTotal = otello_resolve_booking_total($input);
    $stayNights = otello_resolve_stay_nights($input, $checkin, $checkout);

    $payload = [
        'paytype' => $defaults['paytype'] !== '' ? $defaults['paytype'] : '1510100',
        'sourceid' => $defaults['sourceid'],
        'agencysubid' => $defaults['agencysubid'],
        'ressegmentid' => $defaults['ressegmentid'],
        'resdefinitid' => $defaults['resdefinitid'],
        'boardtypeid' => $defaults['boardtypeid'],
        'status' => 'T',
        'pricecurrid' => $defaults['pricecurrid'],
        'needinvoice' => true,
        'hotelrefno' => otello_config_hotelrefno($config),
        'totalroom' => 1,
        'checkin' => $checkin,
        'checkout' => $checkout,
        'firstname' => raiaccept_truncate(raiaccept_trimmed_string($input['firstname'] ?? $input['firstName'] ?? $input['guestFirstName'] ?? ''), 32),
        'lastname' => raiaccept_truncate(raiaccept_trimmed_string($input['lastname'] ?? $input['lastName'] ?? $input['guestLastName'] ?? ''), 32),
        'email' => raiaccept_truncate(raiaccept_trimmed_string($input['email'] ?? ''), 64),
        'tel' => $tel,
        'totalpax' => raiaccept_booking_positive_int($input['totalpax'] ?? $input['adults'] ?? 1, 1, 6, 1),
        'totalchd1' => raiaccept_booking_positive_int($input['totalchd1'] ?? $input['children'] ?? 0, 0, 2, 0),
        'roomtypeid' => $roomTypeId,
        'bookedrtypeid' => $roomTypeId,
        'note' => raiaccept_truncate($note, 500),
        'remarknote' => raiaccept_truncate($note, 500),
    ];

    if ($guestCountryId <= 0 && $defaults['rescountryid'] > 0) {
        $guestCountryId = $defaults['rescountryid'];
    }
    otello_apply_rescountryid($payload, $guestCountryId);

    if ($defaults['agencyid'] > 0) {
        $payload['agencyid'] = $defaults['agencyid'];
    }

    otello_apply_price_fields($payload, $paidTotal, $isPaid, $stayNights);

    return $payload;
}

function otello_build_client_payload(array $reservationPayload, string $reservatGid, array $config): array
{
    $payload = [
        'hotelrefno' => otello_config_hotelrefno($config),
        'reservatgid' => $reservatGid,
        'firstname' => $reservationPayload['firstname'],
        'lastname' => $reservationPayload['lastname'],
        'email' => $reservationPayload['email'],
        'tel' => $reservationPayload['tel'],
        'totalpax' => (int) ($reservationPayload['totalpax'] ?? 1),
        'totalchd1' => (int) ($reservationPayload['totalchd1'] ?? 0),
    ];

    otello_apply_rescountryid(
        $payload,
        (int) ($reservationPayload['rescountryid'] ?? 0)
    );

    return $payload;
}

function otello_build_contact_payload(int $accid, int $contactTypeId, string $value, array $config, ?int $masterid = null): array
{
    $payload = [
        'hotelrefno' => otello_config_hotelrefno($config),
        'accid' => $accid,
        'contactypeid' => $contactTypeId,
        'contactypegid' => $contactTypeId,
        'contact' => $value,
        'contactvalue' => $value,
        'value' => $value,
    ];

    if ($masterid !== null && $masterid > 0) {
        $payload['masterid'] = $masterid;
    }

    return $payload;
}

function otello_build_resname_payload(
    array $reservationPayload,
    string $reservatGid,
    int $accid,
    array $config
): array {
    return [
        'hotelrefno' => otello_config_hotelrefno($config),
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

function otello_build_activate_payload(string $reservatGid, int $accid): array
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

function otello_api_request(string $method, string $url, $payload, array $config, bool $forceRefreshToken = false): array
{
    $result = otello_api_request_once($method, $url, $payload, $config, $forceRefreshToken);
    $statusCode = (int) ($result['statusCode'] ?? 0);
    $usesLogin = otello_resolve_api_token($config) === '';

    if (
        !$result['ok']
        && $statusCode === 0
        && raiaccept_trimmed_string($result['error'] ?? '') !== ''
    ) {
        usleep(750000);
        $result = otello_api_request_once($method, $url, $payload, $config, $forceRefreshToken);
        $statusCode = (int) ($result['statusCode'] ?? 0);
    }

    if (!$result['ok'] && $statusCode === 401 && $usesLogin && !$forceRefreshToken) {
        otello_clear_token_cache();
        return otello_api_request_once($method, $url, $payload, $config, true);
    }

    return $result;
}

function otello_api_request_once(string $method, string $url, $payload, array $config, bool $forceRefreshToken = false): array
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
    $headers = otello_api_headers($config, $forceRefreshToken);

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

    if (isset($response['success']) && $response['success'] === false) {
        if (!empty($response['exceptions']) && is_array($response['exceptions'])) {
            foreach ($response['exceptions'] as $exception) {
                if (!is_array($exception)) {
                    continue;
                }
                $message = raiaccept_trimmed_string($exception['exception'] ?? $exception['message'] ?? '');
                if ($message !== '') {
                    return $message;
                }
            }
        }

        $message = raiaccept_trimmed_string($response['msg'] ?? $response['message'] ?? 'Otello request failed.');
        return $message !== '' ? $message : 'Otello request failed.';
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

function otello_unwrap_response_records($response): array
{
    if (!is_array($response)) {
        return [];
    }

    if (isset($response['data']) && is_array($response['data'])) {
        return $response['data'];
    }

    if (isset($response[0]) && is_array($response[0])) {
        return $response;
    }

    return [$response];
}

function otello_first_response_record($response): ?array
{
    foreach (otello_unwrap_response_records($response) as $record) {
        if (is_array($record)) {
            return $record;
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

function otello_extract_gid($response): ?string
{
    if (is_string($response) && raiaccept_trimmed_string($response) !== '') {
        return raiaccept_trimmed_string($response);
    }

    $record = otello_first_response_record($response);
    if ($record !== null) {
        foreach (['gid', 'reservatgid', 'reservatGid', 'reservationgid', 'reservationGid'] as $key) {
            if (!isset($record[$key])) {
                continue;
            }
            $value = raiaccept_trimmed_string((string) $record[$key]);
            if ($value !== '') {
                return $value;
            }
        }
    }

    if (!is_array($response)) {
        return null;
    }

    foreach (['gid', 'reservatgid', 'reservatGid', 'reservationgid', 'reservationGid'] as $key) {
        if (isset($response[$key])) {
            $value = raiaccept_trimmed_string((string) $response[$key]);
            if ($value !== '') {
                return $value;
            }
        }
    }

    foreach ($response as $value) {
        if (!is_array($value)) {
            continue;
        }
        $found = otello_extract_gid($value);
        if ($found !== null) {
            return $found;
        }
    }

    return null;
}

function otello_extract_accid($response): ?int
{
    if (is_int($response) || (is_string($response) && ctype_digit($response))) {
        return (int) $response;
    }

    $record = otello_first_response_record($response);
    if ($record !== null) {
        foreach (['accid', 'accId', 'accountid', 'accountId', 'clientaccid', 'clientAccId', 'id'] as $key) {
            if (isset($record[$key]) && is_numeric($record[$key]) && (int) $record[$key] > 0) {
                return (int) $record[$key];
            }
        }
    }

    return otello_extract_scalar($response, [
        'accid',
        'accId',
        'accountid',
        'accountId',
        'clientaccid',
        'clientAccId',
        'id',
    ]);
}

function otello_extract_reservation_number($response): ?int
{
    $record = otello_first_response_record($response);
    if ($record !== null) {
        foreach (['reservno', 'reservatno', 'reservationno', 'reservationNo', 'resno', 'reservationnumber'] as $key) {
            if (isset($record[$key]) && is_numeric($record[$key]) && (int) $record[$key] > 0) {
                return (int) $record[$key];
            }
        }
    }

    return otello_extract_scalar($response, [
        'reservno',
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
    if ($gid === null || $gid === '') {
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
    $clientMid = otello_extract_client_mid($result['response'] ?? null);
    if ($clientMid !== null) {
        $result['clientMid'] = $clientMid;
    }
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

function otello_extract_client_mid($response): ?int
{
    $record = otello_first_response_record($response);
    if ($record !== null && isset($record['mid']) && is_numeric($record['mid'])) {
        return (int) $record['mid'];
    }

    return null;
}

function otello_insert_contact(int $accid, int $contactTypeId, string $value, array $config, string $label, ?int $masterid = null): array
{
    $url = otello_endpoint_url($config, 'contact_ins');
    $payload = otello_build_contact_payload($accid, $contactTypeId, $value, $config, $masterid);
    $body = $config['contact_ins_as_array'] ?? false ? [$payload] : $payload;
    $result = otello_api_request('POST', $url, $body, $config);
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

function otello_contact_error_is_skippable(array $result): bool
{
    $status = (int) ($result['statusCode'] ?? 0);
    if ($status === 403) {
        return true;
    }

    $response = $result['response'] ?? null;
    if (!is_array($response)) {
        return false;
    }

    $message = strtolower(
        raiaccept_trimmed_string($response['message'] ?? $response['error'] ?? '')
    );

    return str_contains($message, 'permission')
        || str_contains($message, 'no access')
        || str_contains($message, 'insufficient')
        || str_contains($message, 'masterid');
}

function otello_insert_guest_contacts(int $accid, array $reservationPayload, array $config, ?int $masterid = null): array
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

    $skipped = [];
    $emailResult = otello_insert_contact(
        $accid,
        (int) $types['email'],
        $reservationPayload['email'],
        $config,
        'email',
        $masterid
    );
    if (empty($emailResult['ok'])) {
        if (otello_contact_error_is_skippable($emailResult)) {
            $skipped[] = 'email';
        } else {
            $emailResult['step'] = 'contact_ins';
            return $emailResult;
        }
    }

    $phoneResult = otello_insert_contact(
        $accid,
        (int) $types['phone'],
        $reservationPayload['tel'],
        $config,
        'phone',
        $masterid
    );
    if (empty($phoneResult['ok'])) {
        if (otello_contact_error_is_skippable($phoneResult)) {
            $skipped[] = 'phone';
        } else {
            $phoneResult['step'] = 'contact_ins';
            return $phoneResult;
        }
    }

    if ($skipped !== [] && empty($emailResult['ok']) && empty($phoneResult['ok'])) {
        return [
            'ok' => true,
            'step' => 'contact_ins',
            'skipped' => true,
            'warning' => 'Contact insert skipped (insufficient API permissions). Guest email/phone were already saved on the client profile.',
            'skippedContacts' => $skipped,
            'contactTypes' => [
                'email' => (int) $types['email'],
                'phone' => (int) $types['phone'],
            ],
            'email' => $emailResult['response'] ?? null,
            'phone' => $phoneResult['response'] ?? null,
            'contactype_list' => $types['contactype_list']['response'] ?? null,
        ];
    }

    return [
        'ok' => true,
        'step' => 'contact_ins',
        'skipped' => $skipped !== [],
        'warning' => $skipped !== []
            ? 'Some contact inserts were skipped due to API permissions. Guest details remain on the client profile.'
            : null,
        'skippedContacts' => $skipped,
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
    string $reservatGid,
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

    $contactResult = otello_insert_guest_contacts(
        $accid,
        $reservationPayload,
        $config,
        isset($clientResult['clientMid']) ? (int) $clientResult['clientMid'] : null
    );
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
        'warning' => !empty($contactResult['warning']) ? $contactResult['warning'] : null,
    ];
}

function otello_resolve_room_slug_from_booking(array $booking): string
{
    $slug = raiaccept_booking_room_slug($booking['roomType'] ?? $booking['room'] ?? '');
    if ($slug !== '' && isset(raiaccept_booking_rooms()[$slug])) {
        return $slug;
    }

    $roomName = strtolower(raiaccept_trimmed_string($booking['roomName'] ?? ''));
    if ($roomName === '') {
        return '';
    }

    foreach (raiaccept_booking_rooms() as $candidateSlug => $room) {
        $label = strtolower(raiaccept_trimmed_string($room['label'] ?? ''));
        if ($label !== '' && ($roomName === $label || strpos($roomName, $label) !== false)) {
            return $candidateSlug;
        }
    }

    return '';
}

function otello_booking_record_to_dispatch_input(string $merchantOrderReference, array $booking): array
{
    $roomSlug = otello_resolve_room_slug_from_booking($booking);

    return [
        'merchantOrderReference' => $merchantOrderReference,
        'roomType' => $roomSlug,
        'checkin' => raiaccept_trimmed_string($booking['checkIn'] ?? $booking['checkin'] ?? ''),
        'checkout' => raiaccept_trimmed_string($booking['checkOut'] ?? $booking['checkout'] ?? ''),
        'firstname' => raiaccept_trimmed_string($booking['guestFirstName'] ?? $booking['firstName'] ?? ''),
        'lastname' => raiaccept_trimmed_string($booking['guestLastName'] ?? $booking['lastName'] ?? ''),
        'email' => raiaccept_trimmed_string($booking['guestEmail'] ?? $booking['email'] ?? ''),
        'tel' => raiaccept_trimmed_string($booking['guestPhone'] ?? $booking['phone'] ?? ''),
        'totalpax' => $booking['adults'] ?? 1,
        'totalchd1' => $booking['children'] ?? 0,
        'nights' => $booking['nights'] ?? '',
        'paidAmount' => $booking['total'] ?? '',
        'amount' => $booking['total'] ?? '',
        'total' => $booking['total'] ?? '',
        'currency' => raiaccept_trimmed_string($booking['currency'] ?? 'EUR') ?: 'EUR',
        'note' => raiaccept_trimmed_string($booking['notes'] ?? $booking['note'] ?? ''),
    ];
}

function otello_dispatch_from_booking_confirmation(string $merchantOrderReference, array $fallback = []): array
{
    if ($merchantOrderReference === '') {
        return [
            'ok' => false,
            'error' => 'Missing booking reference.',
        ];
    }

    $stored = raiaccept_load_booking_confirmation($merchantOrderReference);
    if ($stored === null && $fallback === []) {
        return [
            'ok' => false,
            'error' => 'No stored booking confirmation found for this reference.',
        ];
    }

    $booking = array_merge($stored ?? [], $fallback);
    $booking['merchantOrderReference'] = $merchantOrderReference;

    if (empty($booking['guestName'])) {
        $booking['guestName'] = trim(
            raiaccept_trimmed_string($booking['guestFirstName'] ?? '') . ' ' .
            raiaccept_trimmed_string($booking['guestLastName'] ?? '')
        );
    }

    return otello_dispatch_reservation(
        otello_booking_record_to_dispatch_input($merchantOrderReference, $booking)
    );
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

    $existingGid = raiaccept_trimmed_string(
        $input['reservatGid'] ?? $input['gid'] ?? $input['reservatgid'] ?? ''
    );

    if ($existingGid !== '') {
        return otello_finish_activation($input, $config, $reservationPayload, $existingGid);
    }

    $tempResult = otello_create_temporary_reservation($reservationPayload, $config);
    if (empty($tempResult['ok'])) {
        $tempResult['hotelrefno'] = (int) ($config['hotelrefno'] ?? 0);
        return $tempResult;
    }

    $reservatGid = raiaccept_trimmed_string($tempResult['reservatGid'] ?? '');
    if ($reservatGid === '') {
        return otello_step_failure('reservation_ins', $tempResult, [
            'error' => 'Reservation was created but reservat gid is missing.',
        ]);
    }

    return otello_finish_activation($input, $config, $reservationPayload, $reservatGid, $tempResult);
}
