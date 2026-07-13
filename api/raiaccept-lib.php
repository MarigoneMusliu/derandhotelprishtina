<?php

declare(strict_types=1);

const RAIACCEPT_SUCCESS_CODE = '0000';

function raiaccept_json_response(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    if ($status >= 400 && !isset($payload['ok'])) {
        $payload['ok'] = false;
    }
    if ($status >= 200 && $status < 300 && !isset($payload['ok'])) {
        $payload['ok'] = true;
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function raiaccept_config_paths(): array
{
    $apiDir = __DIR__;
    $publicRoot = dirname($apiDir);
    $privateRoot = dirname($publicRoot);
    $accountRoot = dirname($privateRoot);
    $paths = [
        __DIR__ . '/raiaccept-config.php',
        __DIR__ . '/_raiaccept-config.local.php',
        $publicRoot . '/raiaccept-private-config.php',
        $privateRoot . '/raiaccept-private-config.php',
        $privateRoot . '/raiaccept-config.php',
        $accountRoot . '/raiaccept-private-config.php',
        $accountRoot . '/raiaccept-config.php',
    ];

    $envPath = getenv('RAIACCEPT_CONFIG_PATH');
    if (is_string($envPath) && trim($envPath) !== '') {
        array_unshift($paths, trim($envPath));
    }

    $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    if (is_string($documentRoot) && trim($documentRoot) !== '') {
        $documentRoot = rtrim(trim($documentRoot), "/\\");
        $documentRootParent = dirname($documentRoot);
        $documentRootGrandparent = dirname($documentRootParent);
        $paths[] = $documentRootParent . '/raiaccept-private-config.php';
        $paths[] = $documentRootParent . '/raiaccept-config.php';
        $paths[] = $documentRootGrandparent . '/raiaccept-private-config.php';
        $paths[] = $documentRootGrandparent . '/raiaccept-config.php';
    }

    return array_values(array_unique($paths));
}

function raiaccept_raw_config(): array
{
    static $config = null;

    if (is_array($config)) {
        return $config;
    }

    foreach (raiaccept_config_paths() as $path) {
        if (!is_file($path)) {
            continue;
        }
        $loaded = require $path;
        if (is_array($loaded)) {
            $config = $loaded;
            return $config;
        }
    }

    raiaccept_json_response(500, [
        'error' => 'RaiAccept config file is missing. Put raiaccept-private-config.php one folder above the public website root, set RAIACCEPT_CONFIG_PATH, or add api/raiaccept-config.php on the server.',
    ]);
}

function raiaccept_load_config(): array
{
    $config = raiaccept_raw_config();

    $username = trim((string) ($config['username'] ?? $config['raiaccept_username'] ?? ''));
    $password = (string) ($config['password'] ?? $config['raiaccept_password'] ?? '');
    if ($username === '' || $password === '') {
        raiaccept_json_response(500, [
            'error' => 'RaiAccept username or password is missing in the RaiAccept config file.',
        ]);
    }

    $baseUrl = rtrim(trim((string) ($config['site_base_url'] ?? $config['site_url'] ?? '')), '/');
    if ($baseUrl === '' || stripos($baseUrl, 'https://') !== 0) {
        $baseUrl = 'https://www.derandhotel.com';
    }

    return [
        'username' => $username,
        'password' => $password,
        'client_id' => trim((string) ($config['client_id'] ?? 'kr2gs4117arvbnaperqff5dml')),
        'currency' => strtoupper(trim((string) ($config['currency'] ?? 'EUR'))) ?: 'EUR',
        'site_base_url' => $baseUrl,
        'auth_url' => trim((string) ($config['raiaccept_auth_url'] ?? $config['auth_url'] ?? 'https://authenticate.raiaccept.com')),
        'api_base_url' => rtrim(trim((string) ($config['raiaccept_api_base_url'] ?? $config['api_base_url'] ?? 'https://trapi.raiaccept.com')), '/'),
        'web3forms_access_key' => trim((string) ($config['web3forms_access_key'] ?? '')),
        'web3forms_url' => trim((string) ($config['web3forms_url'] ?? 'https://api.web3forms.com/submit')),
        'order_notification_email' => trim((string) ($config['order_notification_email'] ?? 'info@derandhotel.com')),
        'booking_room_rates' => is_array($config['booking_room_rates'] ?? null) ? $config['booking_room_rates'] : [],
        'booking_tax_rate' => is_numeric($config['booking_tax_rate'] ?? null) ? max(0.0, (float) $config['booking_tax_rate']) : 0.0,
        'booking_allow_client_rates' => !empty($config['booking_allow_client_rates']),
        'is_production' => !empty($config['is_production']),
    ];
}

function raiaccept_has_header(array $headers, string $name): bool
{
    $needle = strtolower($name) . ':';
    foreach ($headers as $header) {
        if (stripos((string) $header, $needle) === 0) {
            return true;
        }
    }
    return false;
}

function raiaccept_request(string $method, string $url, ?array $body, array $headers = []): array
{
    $ch = curl_init($url);
    if ($ch === false) {
        return ['ok' => false, 'status' => 0, 'data' => null, 'raw' => 'curl_init failed'];
    }

    $defaultHeaders = ['Accept: application/json'];
    if ($body !== null && !raiaccept_has_header($headers, 'Content-Type')) {
        $defaultHeaders[] = 'Content-Type: application/json';
    }

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => strtoupper($method),
        CURLOPT_HTTPHEADER => array_merge($defaultHeaders, $headers),
        CURLOPT_TIMEOUT => 45,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    $raw = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($raw === false) {
        return ['ok' => false, 'status' => $status, 'data' => null, 'raw' => $error ?: 'request failed'];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        $data = null;
    }

    return ['ok' => $status >= 200 && $status < 300, 'status' => $status, 'data' => $data, 'raw' => $raw];
}

function raiaccept_trimmed_string($value): string
{
    return trim((string) ($value ?? ''));
}

function raiaccept_positive_number($value): float
{
    if (!is_numeric($value)) {
        return 0.0;
    }
    $number = (float) $value;
    return $number > 0 ? round($number, 2) : 0.0;
}

function raiaccept_truncate(string $value, int $maxLength): string
{
    $trimmed = trim($value);
    if (strlen($trimmed) <= $maxLength) {
        return $trimmed;
    }
    return rtrim(substr($trimmed, 0, max(0, $maxLength - 3))) . '...';
}

function raiaccept_get_token(array $config): string
{
    $response = raiaccept_request(
        'POST',
        $config['auth_url'],
        [
            'AuthFlow' => 'USER_PASSWORD_AUTH',
            'AuthParameters' => [
                'USERNAME' => $config['username'],
                'PASSWORD' => $config['password'],
            ],
            'ClientId' => $config['client_id'],
        ],
        [
            'Content-Type: application/x-amz-json-1.1',
            'X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth',
        ]
    );

    if (!$response['ok'] || !is_array($response['data'])) {
        raiaccept_json_response(502, [
            'error' => 'RaiAccept authentication failed.',
            'details' => $response['raw'],
        ]);
    }

    $token = $response['data']['AuthenticationResult']['IdToken'] ?? '';
    if (!is_string($token) || $token === '') {
        raiaccept_json_response(502, ['error' => 'RaiAccept authentication response was incomplete.']);
    }

    return $token;
}

function raiaccept_find_first($source, callable $predicate)
{
    if (!is_array($source)) {
        return null;
    }

    foreach ($source as $key => $value) {
        if ($predicate($key, $value) === true) {
            return $value;
        }
        $nested = raiaccept_find_first($value, $predicate);
        if ($nested !== null) {
            return $nested;
        }
    }

    return null;
}

function raiaccept_first_by_key($source, string $keyName)
{
    return raiaccept_find_first(
        $source,
        static function ($candidateKey, $candidateValue) use ($keyName): bool {
            return strtolower((string) $candidateKey) === strtolower($keyName)
                && $candidateValue !== null
                && $candidateValue !== '';
        }
    );
}

function raiaccept_extract_checkout_url(array $source): string
{
    $priorityKeys = ['checkoutUrl', 'paymentRedirectURL', 'paymentUrl', 'redirectUrl', 'sessionUrl', 'url'];
    foreach ($priorityKeys as $keyName) {
        $value = raiaccept_find_first(
            $source,
            static function ($candidateKey, $candidateValue) use ($keyName): bool {
                return strtolower((string) $candidateKey) === strtolower($keyName)
                    && is_string($candidateValue)
                    && stripos($candidateValue, 'https://') === 0;
            }
        );
        if (is_string($value) && $value !== '') {
            return $value;
        }
    }

    $fallback = raiaccept_find_first(
        $source,
        static function ($candidateKey, $candidateValue): bool {
            if (!is_string($candidateValue) || stripos($candidateValue, 'https://') !== 0) {
                return false;
            }
            $normalized = strtolower($candidateValue);
            return strpos($normalized, 'checkout') !== false
                && (strpos($normalized, 'paymentsession=') !== false || strpos($normalized, 'payment.raiaccept.com') !== false);
        }
    );

    return is_string($fallback) ? $fallback : '';
}

function raiaccept_status_summary(array $source): array
{
    $statusCode = raiaccept_trimmed_string(raiaccept_first_by_key($source, 'statusCode'));
    $statusMessage = raiaccept_trimmed_string(raiaccept_first_by_key($source, 'statusMessage'));
    $rawStatus = raiaccept_trimmed_string(raiaccept_first_by_key($source, 'status'));
    if ($rawStatus === '') {
        $rawStatus = raiaccept_trimmed_string(raiaccept_first_by_key($source, 'transactionStatus'));
    }
    if ($rawStatus === '') {
        $rawStatus = raiaccept_trimmed_string(raiaccept_first_by_key($source, 'orderStatus'));
    }

    $transactionId = raiaccept_trimmed_string(raiaccept_first_by_key($source, 'transactionId'));
    $normalizedStatus = strtolower($rawStatus);
    $paymentStatus = 'pending';

    if ($statusCode === RAIACCEPT_SUCCESS_CODE) {
        $paymentStatus = 'paid';
    } elseif ($statusCode !== '' && $statusCode !== RAIACCEPT_SUCCESS_CODE) {
        $paymentStatus = 'failed';
    } elseif (
        strpos($normalizedStatus, 'success') !== false
        || strpos($normalizedStatus, 'approved') !== false
        || strpos($normalizedStatus, 'paid') !== false
        || strpos($normalizedStatus, 'complete') !== false
    ) {
        $paymentStatus = 'paid';
    } elseif (strpos($normalizedStatus, 'cancel') !== false) {
        $paymentStatus = 'cancelled';
    } elseif (
        strpos($normalizedStatus, 'fail') !== false
        || strpos($normalizedStatus, 'declin') !== false
        || strpos($normalizedStatus, 'refus') !== false
        || strpos($normalizedStatus, 'error') !== false
        || strpos($normalizedStatus, 'exception') !== false
    ) {
        $paymentStatus = 'failed';
    }

    return [
        'paymentStatus' => $paymentStatus,
        'rawStatus' => $rawStatus,
        'statusCode' => $statusCode,
        'statusMessage' => $statusMessage,
        'transactionId' => $transactionId,
    ];
}

function raiaccept_return_url(string $baseUrl, string $returnPath, string $paymentState, string $merchantOrderReference): string
{
    $candidate = trim($returnPath !== '' ? $returnPath : '/extra.html');
    if ($candidate === '' || strpos($candidate, '://') !== false || strpos($candidate, '/api/') === 0) {
        $candidate = '/extra.html';
    }
    $path = '/' . ltrim($candidate, '/');
    $query = http_build_query([
        'payment' => $paymentState,
        'orderRef' => $merchantOrderReference,
    ]);
    $separator = strpos($path, '?') === false ? '?' : '&';

    return $baseUrl . $path . $separator . $query;
}

function raiaccept_merchant_order_reference(string $prefix): string
{
    $normalizedPrefix = preg_replace('/[^A-Z0-9_]/', '', strtoupper($prefix));
    if ($normalizedPrefix === '') {
        $normalizedPrefix = 'EXTRA';
    }
    return $normalizedPrefix . '-' . gmdate('YmdHis') . '-' . strtoupper(bin2hex(random_bytes(4)));
}

function raiaccept_normalize_invoice_items($items, string $fallbackDescription): array
{
    if (!is_array($items)) {
        return [];
    }

    $invoiceItems = [];
    foreach ($items as $index => $item) {
        if (!is_array($item)) {
            continue;
        }
        $qty = max(0, (int) ($item['quantity'] ?? $item['qty'] ?? 0));
        $unitPrice = raiaccept_positive_number($item['unitPrice'] ?? $item['price'] ?? 0);
        if ($qty < 1 || $unitPrice <= 0) {
            continue;
        }
        $description = raiaccept_trimmed_string($item['description'] ?? $item['label'] ?? '');
        if ($description === '') {
            $description = $fallbackDescription;
            if (count($items) > 1) {
                $description .= ' item ' . ($index + 1);
            }
        }
        $invoiceItems[] = [
            'description' => raiaccept_truncate($description, 100),
            'numberOfItems' => $qty,
            'price' => $unitPrice,
        ];
    }

    return $invoiceItems;
}

function raiaccept_sum_invoice_items(array $items): float
{
    $amount = 0.0;
    foreach ($items as $item) {
        $amount += ((int) $item['numberOfItems']) * ((float) $item['price']);
    }
    return round($amount, 2);
}

function raiaccept_order_urls(array $config, string $returnPath, string $merchantOrderReference): array
{
    $baseUrl = $config['site_base_url'];
    return [
        'successUrl' => raiaccept_return_url($baseUrl, $returnPath, 'success', $merchantOrderReference),
        'cancelUrl' => raiaccept_return_url($baseUrl, $returnPath, 'cancel', $merchantOrderReference),
        'failUrl' => raiaccept_return_url($baseUrl, $returnPath, 'fail', $merchantOrderReference),
        'notificationUrl' => $baseUrl . '/api/raiaccept-webhook.php',
    ];
}

function raiaccept_build_extra_order_payload(array $input, array $config, string $merchantOrderReference): array
{
    $firstName = raiaccept_truncate(raiaccept_trimmed_string($input['firstName'] ?? $input['guestFirstName'] ?? ''), 32);
    $lastName = raiaccept_truncate(raiaccept_trimmed_string($input['lastName'] ?? $input['surname'] ?? $input['guestLastName'] ?? 'Guest'), 32);
    if ($lastName === '') {
        $lastName = 'Guest';
    }

    $email = raiaccept_truncate(raiaccept_trimmed_string($input['email'] ?? ''), 64);
    $phone = raiaccept_truncate(raiaccept_trimmed_string($input['phone'] ?? $input['mobilePhone'] ?? ''), 32);
    $deliveryDate = raiaccept_trimmed_string($input['deliveryDate'] ?? '');
    $deliveryTime = raiaccept_trimmed_string($input['deliveryTime'] ?? '');
    $message = raiaccept_trimmed_string($input['message'] ?? '');
    $productName = raiaccept_trimmed_string($input['productName'] ?? 'Extra cart order');

    $invoiceItems = raiaccept_normalize_invoice_items($input['items'] ?? [], $productName);
    if ($invoiceItems === []) {
        raiaccept_json_response(400, ['error' => 'No billable cart items were provided.']);
    }

    $amount = raiaccept_sum_invoice_items($invoiceItems);
    if ($amount <= 0) {
        raiaccept_json_response(400, ['error' => 'Cart total must be greater than zero.']);
    }

    $returnPath = raiaccept_trimmed_string($input['returnPath'] ?? '/extra.html');
    if ($returnPath === '') {
        $returnPath = '/extra.html';
    }

    $descriptionParts = [$productName];
    if ($firstName !== '' || $lastName !== '') {
        $descriptionParts[] = trim($firstName . ' ' . $lastName);
    }
    if ($email !== '') {
        $descriptionParts[] = $email;
    }
    if ($phone !== '') {
        $descriptionParts[] = $phone;
    }
    if ($deliveryDate !== '' || $deliveryTime !== '') {
        $descriptionParts[] = 'delivery ' . trim($deliveryDate . ' ' . $deliveryTime);
    }
    if ($message !== '') {
        $descriptionParts[] = 'note ' . $message;
    }

    $consumer = ['lastName' => $lastName];
    if ($firstName !== '') {
        $consumer['firstName'] = $firstName;
    }
    if ($email !== '') {
        $consumer['email'] = $email;
    }
    if ($phone !== '') {
        $consumer['mobilePhone'] = $phone;
    }

    return [
        'payload' => [
            'consumer' => $consumer,
            'invoice' => [
                'merchantOrderReference' => $merchantOrderReference,
                'amount' => $amount,
                'currency' => $config['currency'],
                'description' => raiaccept_truncate(implode(' | ', array_filter($descriptionParts)), 200),
                'items' => $invoiceItems,
            ],
            'paymentMethodPreference' => 'CARD',
            'urls' => raiaccept_order_urls($config, $returnPath, $merchantOrderReference),
        ],
        'amount' => $amount,
    ];
}

function raiaccept_booking_rooms(): array
{
    return [
        'junior-suite' => ['label' => 'Junior Suite', 'single' => 131.0, 'double' => 138.0, 'max_adults' => 2],
        'deluxe-double' => ['label' => 'Deluxe Double Room', 'single' => 97.0, 'double' => 102.0, 'max_adults' => 2],
        'premium-double' => ['label' => 'Premium Room', 'single' => 114.0, 'double' => 114.0, 'triple' => 154.0, 'max_adults' => 3],
        'superior-twin' => ['label' => 'Superior Twin Room', 'single' => 79.0, 'double' => 92.0, 'max_adults' => 2],
        'superior-double' => ['label' => 'Superior Double Room', 'single' => 92.0, 'double' => 92.0, 'max_adults' => 2],
    ];
}

function raiaccept_booking_room_slug($value): string
{
    $slug = strtolower(raiaccept_trimmed_string($value));
    $slug = preg_replace('/[^a-z0-9-]/', '', $slug);
    return is_string($slug) ? $slug : '';
}

function raiaccept_booking_positive_int($value, int $minimum, int $maximum, int $fallback): int
{
    if (!is_numeric($value)) {
        return $fallback;
    }
    return max($minimum, min($maximum, (int) $value));
}

function raiaccept_booking_date($value, string $label): DateTimeImmutable
{
    $dateValue = raiaccept_trimmed_string($value);
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $dateValue);
    $errors = DateTimeImmutable::getLastErrors();

    if (
        !$date
        || (is_array($errors) && (($errors['warning_count'] ?? 0) > 0 || ($errors['error_count'] ?? 0) > 0))
        || $date->format('Y-m-d') !== $dateValue
    ) {
        raiaccept_json_response(400, ['error' => $label . ' must be a valid date.']);
    }

    return $date;
}

function raiaccept_booking_nights(DateTimeImmutable $checkInDate, DateTimeImmutable $checkOutDate): int
{
    $nights = (int) $checkInDate->diff($checkOutDate)->format('%r%a');
    if ($nights <= 0) {
        raiaccept_json_response(400, ['error' => 'Check-out must be after check-in.']);
    }
    if ($nights > 30) {
        raiaccept_json_response(400, ['error' => 'Bookings longer than 30 nights need direct confirmation from reception.']);
    }
    return $nights;
}

function raiaccept_booking_rate_for_adults($rateConfig, int $adults): float
{
    if (is_array($rateConfig)) {
        $singleRate = raiaccept_positive_number($rateConfig['single'] ?? 0);
        $doubleRate = raiaccept_positive_number($rateConfig['double'] ?? $rateConfig['standard'] ?? 0);
        $tripleRate = raiaccept_positive_number($rateConfig['triple'] ?? 0);
        if ($adults >= 3 && $tripleRate > 0) {
            return $tripleRate;
        }
        if ($adults <= 1 && $singleRate > 0) {
            return $singleRate;
        }
        if ($doubleRate > 0) {
            return $doubleRate;
        }
        return $singleRate;
    }

    return raiaccept_positive_number($rateConfig);
}

function raiaccept_booking_room_rate(string $roomSlug, int $adults, array $config, array $input): float
{
    $defaults = raiaccept_booking_rooms();
    $configuredRates = is_array($config['booking_room_rates'] ?? null) ? $config['booking_room_rates'] : [];
    $rate = 0.0;

    // Code defaults are the source of truth for room prices (keeps RaiAccept in sync with the site).
    if (isset($defaults[$roomSlug])) {
        $rate = raiaccept_booking_rate_for_adults($defaults[$roomSlug], $adults);
    }
    // Config may fill in a room that is not in the defaults map.
    if ($rate <= 0 && isset($configuredRates[$roomSlug])) {
        $rate = raiaccept_booking_rate_for_adults($configuredRates[$roomSlug], $adults);
    }
    if ($rate <= 0 && !empty($config['booking_allow_client_rates'])) {
        $rate = raiaccept_positive_number($input['nightlyRate'] ?? 0);
    }

    if ($rate <= 0) {
        raiaccept_json_response(400, [
            'error' => 'Room rate is not configured for this room. Please contact reception before continuing to payment.',
        ]);
    }

    return $rate;
}

function raiaccept_booking_child_ages($value, int $children): array
{
    if ($children <= 0) {
        return [];
    }
    if (!is_array($value)) {
        raiaccept_json_response(400, ['error' => 'Child ages are required for bookings with children.']);
    }

    $ages = [];
    foreach ($value as $age) {
        if (!is_numeric($age)) {
            raiaccept_json_response(400, ['error' => 'Each child age must be a number.']);
        }
        $ages[] = max(0, min(17, (int) $age));
    }

    if (count($ages) !== $children) {
        raiaccept_json_response(400, ['error' => 'Please provide an age for each child.']);
    }

    return $ages;
}

function raiaccept_booking_child_surcharge_per_night(string $roomSlug, array $childAges): float
{
    if ($roomSlug !== 'premium-double') {
        return 0.0;
    }

    $surcharge = 0.0;
    foreach ($childAges as $age) {
        if ((int) $age > 3) {
            $surcharge += 20.0;
        }
    }
    return $surcharge;
}

function raiaccept_split_full_name(string $value): array
{
    $parts = preg_split('/\s+/', trim($value));
    $parts = is_array($parts)
        ? array_values(array_filter($parts, static function ($part): bool {
            return $part !== '';
        }))
        : [];
    $firstName = (string) array_shift($parts);
    return [
        'firstName' => $firstName,
        'lastName' => implode(' ', $parts) ?: $firstName,
    ];
}

function raiaccept_build_booking_order_payload(array $input, array $config, string $merchantOrderReference): array
{
    $rooms = raiaccept_booking_rooms();
    $roomSlug = raiaccept_booking_room_slug($input['roomType'] ?? $input['room'] ?? '');
    if ($roomSlug === '' || !isset($rooms[$roomSlug])) {
        raiaccept_json_response(400, ['error' => 'Please select a valid room type.']);
    }

    $checkIn = raiaccept_trimmed_string($input['checkIn'] ?? $input['checkin'] ?? '');
    $checkOut = raiaccept_trimmed_string($input['checkOut'] ?? $input['checkout'] ?? '');
    $checkInDate = raiaccept_booking_date($checkIn, 'Check-in');
    $checkOutDate = raiaccept_booking_date($checkOut, 'Check-out');
    $nights = raiaccept_booking_nights($checkInDate, $checkOutDate);

    $maxAdults = (int) ($rooms[$roomSlug]['max_adults'] ?? 2);
    $adults = raiaccept_booking_positive_int($input['adults'] ?? 1, 1, $maxAdults, 1);
    $children = raiaccept_booking_positive_int($input['children'] ?? 0, 0, 2, 0);
    if ($children > 0 && $roomSlug !== 'premium-double') {
        raiaccept_json_response(400, ['error' => 'Children can only be added to Premium Room bookings.']);
    }
    $childAges = raiaccept_booking_child_ages($input['childAges'] ?? [], $children);

    $guestFirstName = raiaccept_trimmed_string($input['guestFirstName'] ?? $input['firstName'] ?? '');
    $guestLastName = raiaccept_trimmed_string($input['guestLastName'] ?? $input['lastName'] ?? '');
    if ($guestFirstName === '' || $guestLastName === '') {
        $nameParts = raiaccept_split_full_name(raiaccept_trimmed_string($input['fullName'] ?? $input['name'] ?? ''));
        if ($guestFirstName === '') {
            $guestFirstName = $nameParts['firstName'];
        }
        if ($guestLastName === '') {
            $guestLastName = $nameParts['lastName'];
        }
    }

    $guestFirstName = raiaccept_truncate($guestFirstName, 32);
    $guestLastName = raiaccept_truncate($guestLastName, 32);
    $email = raiaccept_truncate(raiaccept_trimmed_string($input['email'] ?? ''), 64);
    $phone = raiaccept_truncate(raiaccept_trimmed_string($input['phone'] ?? $input['mobilePhone'] ?? ''), 32);
    $message = raiaccept_truncate(raiaccept_trimmed_string($input['message'] ?? $input['notes'] ?? ''), 160);

    if ($guestFirstName === '' || $guestLastName === '' || $email === '' || $phone === '') {
        raiaccept_json_response(400, ['error' => 'Guest name, email, and phone are required.']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        raiaccept_json_response(400, ['error' => 'Please enter a valid guest email address.']);
    }

    $roomName = raiaccept_truncate(raiaccept_trimmed_string($input['roomName'] ?? $rooms[$roomSlug]['label']), 80);
    if ($roomName === '') {
        $roomName = $rooms[$roomSlug]['label'];
    }

    $nightlyRate = raiaccept_booking_room_rate($roomSlug, $adults, $config, $input);
    $roomSubtotal = round($nightlyRate * $nights, 2);
    $childSurchargePerNight = raiaccept_booking_child_surcharge_per_night($roomSlug, $childAges);
    $childSurcharge = round($childSurchargePerNight * $nights, 2);
    $fees = round(($roomSubtotal + $childSurcharge) * (float) $config['booking_tax_rate'], 2);

    $extraItems = raiaccept_normalize_invoice_items($input['extras'] ?? $input['extraItems'] ?? [], 'Concierge extra');
    $extrasTotal = raiaccept_sum_invoice_items($extraItems);

    if ($extraItems !== []) {
        $deliveryDate = raiaccept_trimmed_string($input['extrasDeliveryDate'] ?? $input['deliveryDate'] ?? '');
        $deliveryTime = raiaccept_trimmed_string($input['extrasDeliveryTime'] ?? $input['deliveryTime'] ?? '');
        if ($deliveryDate === '' || $deliveryTime === '') {
            raiaccept_json_response(400, ['error' => 'Delivery date and time are required for booking extras.']);
        }
        $delivery = raiaccept_booking_date($deliveryDate, 'Extras delivery date');
        if ($delivery < $checkInDate || $delivery > $checkOutDate) {
            raiaccept_json_response(400, ['error' => 'Extras delivery date must be within the stay dates.']);
        }
    }

    $total = round($roomSubtotal + $childSurcharge + $fees + $extrasTotal, 2);
    if ($total <= 0) {
        raiaccept_json_response(400, ['error' => 'The booking total must be greater than zero.']);
    }

    $items = [
        [
            'description' => raiaccept_truncate($roomName . ' | ' . $checkIn . ' to ' . $checkOut . ' | ' . $adults . ' adult' . ($adults === 1 ? '' : 's'), 100),
            'numberOfItems' => $nights,
            'price' => $nightlyRate,
        ],
    ];

    if ($childSurchargePerNight > 0) {
        $items[] = [
            'description' => 'Children surcharge',
            'numberOfItems' => $nights,
            'price' => $childSurchargePerNight,
        ];
    }
    if ($fees > 0) {
        $items[] = [
            'description' => 'Taxes and fees',
            'numberOfItems' => 1,
            'price' => $fees,
        ];
    }
    foreach ($extraItems as $extraItem) {
        $items[] = $extraItem;
    }

    $returnPath = raiaccept_trimmed_string($input['returnPath'] ?? '/booking-details.html');
    if ($returnPath === '') {
        $returnPath = '/booking-details.html';
    }

    $guestName = trim($guestFirstName . ' ' . $guestLastName);
    $descriptionParts = [
        'Room booking',
        $roomName,
        $checkIn . ' to ' . $checkOut,
        $nights . ' night' . ($nights === 1 ? '' : 's'),
        $adults . ' adult' . ($adults === 1 ? '' : 's'),
    ];
    if ($children > 0) {
        $descriptionParts[] = $children . ' child' . ($children === 1 ? '' : 'ren');
    }
    if ($extrasTotal > 0) {
        $descriptionParts[] = 'extras ' . $config['currency'] . ' ' . number_format($extrasTotal, 2, '.', '');
    }
    $descriptionParts[] = $guestName;
    $descriptionParts[] = $email;
    $descriptionParts[] = $phone;
    if ($message !== '') {
        $descriptionParts[] = 'note ' . $message;
    }

    return [
        'payload' => [
            'consumer' => [
                'firstName' => $guestFirstName,
                'lastName' => $guestLastName,
                'email' => $email,
                'mobilePhone' => $phone,
            ],
            'invoice' => [
                'merchantOrderReference' => $merchantOrderReference,
                'amount' => $total,
                'currency' => $config['currency'],
                'description' => raiaccept_truncate(implode(' | ', array_filter($descriptionParts)), 200),
                'items' => $items,
            ],
            'paymentMethodPreference' => 'CARD',
            'urls' => raiaccept_order_urls($config, $returnPath, $merchantOrderReference),
        ],
        'amount' => $total,
    ];
}

function raiaccept_is_booking_order(array $input): bool
{
    $orderType = strtolower(raiaccept_trimmed_string($input['orderType'] ?? ''));
    return in_array($orderType, ['booking', 'room', 'room-booking'], true);
}

function raiaccept_order_prefix(array $input): string
{
    if (raiaccept_is_booking_order($input)) {
        return 'ROOM';
    }
    $returnPath = strtolower(raiaccept_trimmed_string($input['returnPath'] ?? ''));
    $productName = strtolower(raiaccept_trimmed_string($input['productName'] ?? ''));
    if (strpos($returnPath, 'sunnyhill') !== false || strpos($productName, 'sunny hill') !== false) {
        return 'SUNNYHILL';
    }
    return 'EXTRA';
}

function raiaccept_create_checkout(array $input): array
{
    $config = raiaccept_load_config();
    $token = raiaccept_get_token($config);

    $merchantOrderReference = raiaccept_merchant_order_reference(raiaccept_order_prefix($input));
    $prepared = raiaccept_is_booking_order($input)
        ? raiaccept_build_booking_order_payload($input, $config, $merchantOrderReference)
        : raiaccept_build_extra_order_payload($input, $config, $merchantOrderReference);

    $authHeader = ['Authorization: Bearer ' . $token];
    $orderResponse = raiaccept_request('POST', $config['api_base_url'] . '/orders', $prepared['payload'], $authHeader);
    if (!$orderResponse['ok'] || !is_array($orderResponse['data'])) {
        raiaccept_json_response(502, [
            'error' => 'Could not create RaiAccept order.',
            'details' => $orderResponse['raw'],
        ]);
    }

    $orderIdentification = raiaccept_trimmed_string(raiaccept_first_by_key($orderResponse['data'], 'orderIdentification'));
    if ($orderIdentification === '') {
        raiaccept_json_response(502, ['error' => 'RaiAccept order response was incomplete.']);
    }

    $checkoutResponse = raiaccept_request(
        'POST',
        $config['api_base_url'] . '/orders/' . rawurlencode($orderIdentification) . '/checkout',
        $prepared['payload'],
        $authHeader
    );

    if (!$checkoutResponse['ok'] || !is_array($checkoutResponse['data'])) {
        raiaccept_json_response(502, [
            'error' => 'Could not create RaiAccept payment session.',
            'details' => $checkoutResponse['raw'],
        ]);
    }

    $checkoutUrl = raiaccept_extract_checkout_url($checkoutResponse['data']);
    if ($checkoutUrl === '') {
        raiaccept_json_response(502, ['error' => 'RaiAccept checkout URL was missing from the response.']);
    }

    return [
        'checkoutUrl' => $checkoutUrl,
        'orderIdentification' => $orderIdentification,
        'merchantOrderReference' => $merchantOrderReference,
        'amount' => $prepared['amount'],
        'currency' => $prepared['payload']['invoice']['currency'],
    ];
}

function raiaccept_get_order_payment_status(string $orderIdentification): array
{
    $config = raiaccept_load_config();
    $token = raiaccept_get_token($config);

    $response = raiaccept_request(
        'GET',
        $config['api_base_url'] . '/orders/' . rawurlencode($orderIdentification),
        null,
        ['Authorization: Bearer ' . $token]
    );

    if (!$response['ok'] || !is_array($response['data'])) {
        raiaccept_json_response(502, [
            'error' => 'Could not retrieve RaiAccept order status.',
            'details' => $response['raw'],
        ]);
    }

    $summary = raiaccept_status_summary($response['data']);
    $source = 'order';

    if (($summary['paymentStatus'] ?? 'pending') === 'pending') {
        $transactionResponse = raiaccept_request(
            'POST',
            $config['api_base_url'] . '/orders/' . rawurlencode($orderIdentification) . '/transactions',
            null,
            ['Authorization: Bearer ' . $token]
        );
        if ($transactionResponse['ok'] && is_array($transactionResponse['data'])) {
            $transactionSummary = raiaccept_status_summary($transactionResponse['data']);
            if (($transactionSummary['paymentStatus'] ?? 'pending') !== 'pending') {
                $summary = $transactionSummary;
                $source = 'transactions';
            }
        }
    }

    return [
        'paymentStatus' => $summary['paymentStatus'] ?? 'pending',
        'orderStatus' => $summary['rawStatus'] ?? '',
        'rawStatus' => $summary['rawStatus'] ?? '',
        'statusCode' => $summary['statusCode'] ?? '',
        'statusMessage' => $summary['statusMessage'] ?? '',
        'transactionId' => $summary['transactionId'] ?? '',
        'source' => $source,
        'merchantOrderReference' => raiaccept_trimmed_string(raiaccept_first_by_key($response['data'], 'merchantOrderReference')),
        'orderIdentification' => $orderIdentification,
    ];
}

function raiaccept_webhook_is_room_booking(array $payload): bool
{
    $merchantOrderReference = strtoupper(raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'merchantOrderReference')));
    return strpos($merchantOrderReference, 'ROOM-') === 0
        || strpos($merchantOrderReference, 'ROOM_') === 0
        || strpos($merchantOrderReference, 'BOOKING-') === 0
        || strpos($merchantOrderReference, 'BOOKING_') === 0;
}

function raiaccept_successful_purchase(array $payload): bool
{
    $summary = raiaccept_status_summary($payload);
    $transactionType = strtoupper(raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'transactionType')));
    return ($summary['paymentStatus'] ?? 'pending') === 'paid'
        && ($transactionType === '' || $transactionType === 'PURCHASE');
}

function raiaccept_webhook_log_path(): string
{
    return __DIR__ . '/_storage/processed-webhooks.json';
}

function raiaccept_is_duplicate_webhook(string $key): bool
{
    if ($key === '') {
        return false;
    }

    $storageDir = dirname(raiaccept_webhook_log_path());
    if (!is_dir($storageDir) && !@mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        return false;
    }

    $handle = @fopen(raiaccept_webhook_log_path(), 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return false;
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

    if (isset($entries[$key])) {
        flock($handle, LOCK_UN);
        fclose($handle);
        return true;
    }

    $entries[$key] = gmdate('c');
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($entries, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return false;
}

function raiaccept_webhook_message(array $payload): string
{
    $isRoomBooking = raiaccept_webhook_is_room_booking($payload);
    $order = is_array($payload['order'] ?? null) ? $payload['order'] : [];
    $invoice = is_array($order['invoice'] ?? null) ? $order['invoice'] : [];
    $consumer = is_array($order['consumer'] ?? null) ? $order['consumer'] : [];
    $items = is_array($invoice['items'] ?? null) ? $invoice['items'] : [];
    $summary = raiaccept_status_summary($payload);

    $itemLines = [];
    foreach ($items as $index => $item) {
        if (!is_array($item)) {
            continue;
        }
        $quantity = (int) ($item['numberOfItems'] ?? 0);
        $price = (float) ($item['price'] ?? 0);
        $itemLines[] = ($index + 1) . '. '
            . raiaccept_trimmed_string($item['description'] ?? 'Item')
            . ' | ' . $quantity . ' x ' . number_format($price, 2, '.', '') . ' EUR';
    }
    if ($itemLines === []) {
        $itemLines[] = 'No line items were included in the webhook payload.';
    }

    return implode("\n", [
        $isRoomBooking ? 'A RaiAccept room booking payment was confirmed.' : 'A RaiAccept purchase was confirmed.',
        '',
        'Order reference: ' . raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'merchantOrderReference')),
        'RaiAccept order ID: ' . raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'orderIdentification')),
        'Transaction ID: ' . ($summary['transactionId'] ?? ''),
        'Status: ' . ($summary['rawStatus'] ?? '') . ' (' . ($summary['statusCode'] ?? '') . ')',
        'Status message: ' . ($summary['statusMessage'] ?? ''),
        'Guest last name: ' . raiaccept_trimmed_string($consumer['lastName'] ?? ''),
        'Guest email: ' . raiaccept_trimmed_string($consumer['email'] ?? ''),
        'Guest mobile: ' . raiaccept_trimmed_string($consumer['mobilePhone'] ?? ''),
        'Order description: ' . raiaccept_trimmed_string($invoice['description'] ?? ''),
        '',
        'Items:',
        implode("\n", $itemLines),
    ]);
}

function raiaccept_send_webhook_email(array $payload): void
{
    if (!raiaccept_successful_purchase($payload)) {
        return;
    }

    $dedupeKey = raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'transactionId'));
    if ($dedupeKey === '') {
        $dedupeKey = raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'orderIdentification'));
    }
    if ($dedupeKey === '') {
        $dedupeKey = raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'merchantOrderReference'));
    }
    if (raiaccept_is_duplicate_webhook($dedupeKey)) {
        return;
    }

    $config = raiaccept_load_config();
    if ($config['web3forms_access_key'] === '') {
        return;
    }

    $merchantOrderReference = raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'merchantOrderReference'));
    if ($merchantOrderReference === '') {
        $merchantOrderReference = raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'orderIdentification'));
    }
    $isRoomBooking = raiaccept_webhook_is_room_booking($payload);

    $response = raiaccept_request(
        'POST',
        $config['web3forms_url'] ?: 'https://api.web3forms.com/submit',
        [
            'access_key' => $config['web3forms_access_key'],
            'subject' => ($isRoomBooking ? '[Paid Room Booking] ' : '[Paid Order] ') . ($merchantOrderReference !== '' ? $merchantOrderReference : 'RaiAccept checkout'),
            'from_name' => 'Derand Hotel Website (RaiAccept)',
            'email' => $config['order_notification_email'],
            'to_email' => $config['order_notification_email'],
            'recipient' => $config['order_notification_email'],
            'message' => raiaccept_webhook_message($payload),
        ]
    );

    if (!$response['ok']) {
        raiaccept_json_response(502, [
            'error' => 'Web3Forms did not confirm the notification email.',
            'details' => $response['raw'],
        ]);
    }
}
