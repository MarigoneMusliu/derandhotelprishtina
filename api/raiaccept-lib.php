<?php

declare(strict_types=1);

require_once __DIR__ . '/tickets-lib.php';

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

    $web3formsAccessKey = trim((string) ($config['web3forms_access_key'] ?? ''));
    if ($web3formsAccessKey === '') {
        $web3formsAccessKey = trim((string) (getenv('WEB3FORMS_ACCESS_KEY') ?: ''));
    }
    if ($web3formsAccessKey === '') {
        // Public Web3Forms form key already used by the site's NOYA reservation form.
        $web3formsAccessKey = '761d8dce-87b2-4534-bc76-77ec2305d4ec';
    }

    return [
        'username' => $username,
        'password' => $password,
        'client_id' => trim((string) ($config['client_id'] ?? 'kr2gs4117arvbnaperqff5dml')),
        'currency' => strtoupper(trim((string) ($config['currency'] ?? 'EUR'))) ?: 'EUR',
        'site_base_url' => $baseUrl,
        'auth_url' => trim((string) ($config['raiaccept_auth_url'] ?? $config['auth_url'] ?? 'https://authenticate.raiaccept.com')),
        'api_base_url' => rtrim(trim((string) ($config['raiaccept_api_base_url'] ?? $config['api_base_url'] ?? 'https://trapi.raiaccept.com')), '/'),
        'web3forms_access_key' => $web3formsAccessKey,
        'web3forms_url' => trim((string) ($config['web3forms_url'] ?? 'https://api.web3forms.com/submit')),
        'order_notification_email' => trim((string) ($config['order_notification_email'] ?? 'info@derandhotel.com')),
        // Room rates always come from raiaccept_booking_rooms() so RaiAccept matches the website.
        'booking_room_rates' => raiaccept_booking_room_rate_map(),
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

function raiaccept_booking_phone_digits(string $phone): string
{
    $digits = preg_replace('/\D+/', '', $phone);
    return is_string($digits) ? $digits : '';
}

function raiaccept_mobile_phone_for_raiaccept(string $digits): string
{
    $normalized = $digits;

    // Kosovo local numbers often start with 0 — RaiAccept rejects +0…, so use +383…
    if (str_starts_with($normalized, '0') && strlen($normalized) >= 9) {
        $normalized = '383' . substr($normalized, 1);
    } elseif (
        strlen($normalized) >= 8
        && strlen($normalized) <= 9
        && !str_starts_with($normalized, '383')
    ) {
        $normalized = '383' . ltrim($normalized, '0');
    }

    if (str_starts_with($normalized, '383') && strlen($normalized) >= 11) {
        return '+' . $normalized;
    }

    // RaiAccept also accepts plain 8–16 digit numbers without a + prefix.
    return $normalized;
}

function raiaccept_normalize_booking_phone(string $phone): array
{
    $raw = raiaccept_trimmed_string($phone);
    $digits = raiaccept_booking_phone_digits($raw);
    $length = strlen($digits);
    if ($length < 5 || $length > 20) {
        raiaccept_json_response(400, [
            'error' => 'Please enter a phone number with 5 to 20 digits.',
        ]);
    }

    $mobilePhone = raiaccept_mobile_phone_for_raiaccept($digits);

    return [
        'display' => raiaccept_truncate($raw !== '' ? $raw : $digits, 20),
        'digits' => $digits,
        'mobilePhone' => $mobilePhone,
    ];
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
    $candidate = trim($returnPath !== '' ? $returnPath : '/Concierge');
    if ($candidate === '' || strpos($candidate, '://') !== false || strpos($candidate, '/api/') === 0) {
        $candidate = '/Concierge';
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
    $roomNumber = raiaccept_truncate(raiaccept_trimmed_string($input['roomNumber'] ?? $input['room'] ?? ''), 16);
    $message = raiaccept_trimmed_string($input['message'] ?? '');
    $productName = raiaccept_trimmed_string($input['productName'] ?? 'Extra cart order');

    $invoiceItems = raiaccept_normalize_invoice_items($input['items'] ?? [], $productName);
    if ($invoiceItems === []) {
        raiaccept_json_response(400, ['error' => 'No billable cart items were provided.']);
    }

    if (raiaccept_extra_cart_requires_advance_delivery($input)) {
        raiaccept_validate_flowers_perfume_delivery($deliveryDate, $deliveryTime);
    }

    $amount = raiaccept_sum_invoice_items($invoiceItems);
    if ($amount <= 0) {
        raiaccept_json_response(400, ['error' => 'Cart total must be greater than zero.']);
    }

    $returnPath = raiaccept_trimmed_string($input['returnPath'] ?? '/Concierge');
    if ($returnPath === '') {
        $returnPath = '/Concierge';
    }

    $descriptionParts = [$productName];
    if ($firstName !== '' || $lastName !== '') {
        $descriptionParts[] = trim($firstName . ' ' . $lastName);
    }
    if ($roomNumber !== '') {
        $descriptionParts[] = 'room ' . $roomNumber;
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
        'confirmation' => [
            'type' => 'extra',
            'lastName' => $lastName,
            'roomNumber' => $roomNumber,
            'deliveryDate' => $deliveryDate,
            'deliveryTime' => $deliveryTime,
            'message' => $message,
            'productName' => $productName,
            'cart' => is_array($input['cartItems'] ?? null) ? $input['cartItems'] : [],
            'total' => $amount,
            'currency' => $config['currency'],
            'hotelEmailSent' => false,
        ],
    ];
}

function raiaccept_booking_rooms(): array
{
    return [
        'junior-suite' => ['label' => 'Junior Suite', 'single' => 140.0, 'double' => 140.0, 'max_adults' => 2],
        'deluxe-double' => ['label' => 'Deluxe Double Room', 'single' => 105.0, 'double' => 105.0, 'max_adults' => 2],
        'premium-double' => ['label' => 'Premium Room', 'single' => 120.0, 'double' => 130.0, 'triple' => 140.0, 'max_adults' => 3],
        'superior-twin' => ['label' => 'Superior Twin Room', 'single' => 95.0, 'double' => 105.0, 'max_adults' => 2],
        'superior-double' => ['label' => 'Superior Double Room', 'single' => 80.0, 'double' => 90.0, 'max_adults' => 2],
    ];
}

function raiaccept_booking_room_rate_map(): array
{
    $rates = [];
    foreach (raiaccept_booking_rooms() as $slug => $room) {
        $entry = [];
        if (isset($room['single'])) {
            $entry['single'] = $room['single'];
        }
        if (isset($room['double'])) {
            $entry['double'] = $room['double'];
        }
        if (isset($room['triple'])) {
            $entry['triple'] = $room['triple'];
        }
        $rates[$slug] = $entry;
    }
    return $rates;
}

function raiaccept_special_rate_nights(): array
{
    return [];
}

function raiaccept_special_rate_eur(): float
{
    return 0.0;
}

function raiaccept_august_reduced_rate_nights(): array
{
    return [];
}

function raiaccept_august_reduced_rate_eur(): float
{
    return 0.0;
}

function raiaccept_junior_suite_blocked_nights(): array
{
    return [];
}

function raiaccept_booking_each_night(DateTimeImmutable $checkInDate, DateTimeImmutable $checkOutDate): array
{
    $nights = [];
    $cursor = $checkInDate;
    while ($cursor < $checkOutDate) {
        $nights[] = $cursor->format('Y-m-d');
        $cursor = $cursor->modify('+1 day');
    }
    return $nights;
}

function raiaccept_stay_hits_junior_suite_block(DateTimeImmutable $checkInDate, DateTimeImmutable $checkOutDate): bool
{
    $blocked = array_flip(raiaccept_junior_suite_blocked_nights());
    foreach (raiaccept_booking_each_night($checkInDate, $checkOutDate) as $night) {
        if (isset($blocked[$night])) {
            return true;
        }
    }
    return false;
}

function raiaccept_booking_nightly_rate_for_date(float $baseRate, string $nightIso): float
{
    return $baseRate;
}

function raiaccept_booking_stay_room_total(float $baseRate, DateTimeImmutable $checkInDate, DateTimeImmutable $checkOutDate): array
{
    $nightRates = [];
    $total = 0.0;
    foreach (raiaccept_booking_each_night($checkInDate, $checkOutDate) as $nightIso) {
        $rate = raiaccept_booking_nightly_rate_for_date($baseRate, $nightIso);
        $nightRates[] = $rate;
        $total += $rate;
    }
    $nights = count($nightRates);
    $average = $nights > 0 ? round($total / $nights, 2) : $baseRate;
    return [
        'total' => round($total, 2),
        'nights' => $nights,
        'average' => $average,
        'rates' => $nightRates,
        'uniform' => $nights > 0 && count(array_unique($nightRates)) === 1,
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
    $rate = 0.0;

    // Website + RaiAccept checkout both use raiaccept_booking_rooms() as the only source of truth.
    if (isset($defaults[$roomSlug])) {
        $rate = raiaccept_booking_rate_for_adults($defaults[$roomSlug], $adults);
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

    if ($roomSlug === 'junior-suite' && raiaccept_stay_hits_junior_suite_block($checkInDate, $checkOutDate)) {
        raiaccept_json_response(400, [
            'error' => 'The Junior Suite is fully booked for these dates. Please search for another room.',
        ]);
    }

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
    $phoneData = raiaccept_normalize_booking_phone($input['phone'] ?? $input['mobilePhone'] ?? '');
    $phone = $phoneData['display'];
    $mobilePhone = $phoneData['mobilePhone'];
    $message = raiaccept_truncate(raiaccept_trimmed_string($input['message'] ?? $input['notes'] ?? ''), 160);

    if ($guestFirstName === '' || $guestLastName === '' || $email === '') {
        raiaccept_json_response(400, ['error' => 'Guest name, email, and phone are required.']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        raiaccept_json_response(400, ['error' => 'Please enter a valid guest email address.']);
    }

    $roomName = raiaccept_truncate(raiaccept_trimmed_string($input['roomName'] ?? $rooms[$roomSlug]['label']), 80);
    if ($roomName === '') {
        $roomName = $rooms[$roomSlug]['label'];
    }

    $baseNightlyRate = raiaccept_booking_room_rate($roomSlug, $adults, $config, $input);
    $stayPricing = raiaccept_booking_stay_room_total($baseNightlyRate, $checkInDate, $checkOutDate);
    $nightlyRate = (float) $stayPricing['average'];
    $roomSubtotal = (float) $stayPricing['total'];
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

    $items = [];
    if (!empty($stayPricing['uniform'])) {
        $items[] = [
            'description' => raiaccept_truncate($roomName . ' | ' . $checkIn . ' to ' . $checkOut . ' | ' . $adults . ' adult' . ($adults === 1 ? '' : 's'), 100),
            'numberOfItems' => $nights,
            'price' => $nightlyRate,
        ];
    } else {
        $items[] = [
            'description' => raiaccept_truncate($roomName . ' | ' . $checkIn . ' to ' . $checkOut . ' | ' . $nights . ' night' . ($nights === 1 ? '' : 's'), 100),
            'numberOfItems' => 1,
            'price' => $roomSubtotal,
        ];
    }

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

    $returnPath = raiaccept_trimmed_string($input['returnPath'] ?? '/Booking-Details');
    if ($returnPath === '') {
        $returnPath = '/Booking-Details';
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
                'mobilePhone' => $mobilePhone,
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
        'roomSubtotal' => $roomSubtotal,
        'nightlyRate' => $nightlyRate,
        'childSurcharge' => $childSurcharge,
        'extrasTotal' => $extrasTotal,
        'confirmation' => [
            'type' => 'booking',
            'guestFirstName' => $guestFirstName,
            'guestLastName' => $guestLastName,
            'guestName' => $guestName,
            'guestEmail' => $email,
            'guestPhone' => $phone,
            'roomType' => $roomSlug,
            'roomName' => $roomName,
            'checkIn' => $checkIn,
            'checkOut' => $checkOut,
            'checkInTime' => '15:00',
            'checkOutTime' => '11:00',
            'adults' => $adults,
            'children' => $children,
            'nights' => $nights,
            'total' => $total,
            'currency' => $config['currency'],
            'notes' => $message,
            'hotelAddress' => 'Bekim Fehmiu Str. 30, Pristina 10000, Kosovo',
            'hotelPhone' => '+383 (0) 41 111 222',
        ],
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
    if (strpos($returnPath, 'derandtickets') !== false) {
        return 'TICKETS';
    }
    if (strpos($returnPath, 'sunnyhill') !== false || strpos($productName, 'sunny hill') !== false) {
        return 'SUNNYHILL';
    }
    return 'EXTRA';
}

function raiaccept_is_ticket_order(array $input): bool
{
    return !raiaccept_is_booking_order($input)
        && strpos(strtolower(raiaccept_trimmed_string($input['returnPath'] ?? '')), 'derandtickets') !== false;
}

/* Festivals, ticket types and prices are managed in the ticket admin panel (/TicketsAdmin). */
function raiaccept_ticket_festivals(): array
{
    $festivals = [];
    foreach (tickets_catalog()['festivals'] as $f) {
        if (empty($f['active']) || empty($f['salesOpen'])) {
            continue;
        }
        $tiers = [];
        foreach ($f['tiers'] as $t) {
            if (!empty($t['active'])) {
                $tiers[$t['key']] = ['label' => $t['label'], 'price' => (float) $t['price']];
            }
        }
        $festivals[$f['id']] = ['name' => $f['name'], 'nights' => (int) $f['nights'], 'tiers' => $tiers];
    }
    return $festivals;
}

function raiaccept_ticket_transfer_price(): float
{
    return (float) (tickets_catalog()['transferPrice'] ?? 25.0);
}

/* Replaces the browser-supplied items and product name with server-side prices. */
function raiaccept_apply_ticket_pricing(array $input): array
{
    $ticket = is_array($input['ticketOrder'] ?? null) ? $input['ticketOrder'] : null;
    if ($ticket === null) {
        raiaccept_json_response(400, ['error' => 'Ticket order details are missing. Please refresh the page and try again.']);
    }

    $festivals = raiaccept_ticket_festivals();
    $festivalId = raiaccept_trimmed_string($ticket['festival'] ?? '');
    $festival = $festivals[$festivalId] ?? null;
    if ($festival === null) {
        raiaccept_json_response(400, ['error' => 'Unknown festival. Please refresh the page and try again.']);
    }

    $tierKey = raiaccept_trimmed_string($ticket['tier'] ?? '');
    $tier = $festival['tiers'][$tierKey] ?? null;
    if ($tier === null) {
        raiaccept_json_response(400, ['error' => 'Unknown ticket tier. Please refresh the page and try again.']);
    }

    $guests = (int) ($ticket['guests'] ?? 0);
    if ($guests < 1 || $guests > 10) {
        raiaccept_json_response(400, ['error' => 'Guests must be between 1 and 10.']);
    }

    $remaining = tickets_available($festivalId, $tierKey);
    if ($remaining !== null && $guests > $remaining) {
        raiaccept_json_response(409, ['error' => $remaining > 0
            ? 'Only ' . $remaining . ' tickets of this type are left. Please choose fewer guests.'
            : 'This ticket type is sold out.']);
    }

    $items = [[
        'description' => $festival['name'] . ' - ' . $tier['label'] . ' ticket',
        'quantity' => $guests,
        'unitPrice' => $tier['price'],
    ]];
    $title = $festival['name'] . ' — ' . $tier['label'];
    $record = [
        'festivalId' => $festivalId,
        'festivalName' => $festival['name'],
        'tierKey' => $tierKey,
        'tierLabel' => $tier['label'],
        'quantity' => $guests,
        'unitPrice' => (float) $tier['price'],
        'mode' => 'tickets',
        'roomLabel' => '',
        'nights' => null,
        'transfer' => !empty($ticket['transfer']),
        'guest' => [
            'firstName' => raiaccept_trimmed_string($input['firstName'] ?? ''),
            'lastName' => raiaccept_trimmed_string($input['lastName'] ?? ''),
            'email' => raiaccept_trimmed_string($input['email'] ?? ''),
            'phone' => raiaccept_trimmed_string($input['phone'] ?? ''),
        ],
    ];

    if (raiaccept_trimmed_string($ticket['mode'] ?? '') === 'bundle') {
        $rooms = raiaccept_booking_rooms();
        $roomSlug = raiaccept_trimmed_string($ticket['room'] ?? '');
        $room = $rooms[$roomSlug] ?? null;
        if ($room === null) {
            raiaccept_json_response(400, ['error' => 'Unknown room type. Please refresh the page and try again.']);
        }
        $nights = (int) $festival['nights'];
        $items[] = [
            'description' => 'Derand Hotel - ' . $room['label'] . ', ' . $nights . ' nights x ' . number_format((float) $room['single'], 0) . ' EUR',
            'quantity' => $guests,
            'unitPrice' => round((float) $room['single'] * $nights, 2),
        ];
        $title .= ' + ' . $room['label'] . ' (' . $nights . ' nights)';
        $record['mode'] = 'bundle';
        $record['roomLabel'] = $room['label'];
        $record['nights'] = $nights;
    }

    if (!empty($ticket['transfer'])) {
        $items[] = [
            'description' => 'Airport transfer PRN - hotel, round trip',
            'quantity' => $guests,
            'unitPrice' => raiaccept_ticket_transfer_price(),
        ];
    }

    $input['items'] = $items;
    $input['productName'] = 'Derand Tickets — ' . $title . ' — ' . $guests . ($guests > 1 ? ' guests' : ' guest');
    $record['total'] = round(array_sum(array_map(static function (array $item): float {
        return (float) $item['unitPrice'] * (int) $item['quantity'];
    }, $items)), 2);
    $input['_ticketRecord'] = $record;
    return $input;
}

function raiaccept_raiaccept_error_message(string $fallback, $details): string
{
    if (!is_string($details) || trim($details) === '') {
        return $fallback;
    }

    $decoded = json_decode($details, true);
    if (!is_array($decoded)) {
        return $fallback;
    }

    $parts = [];
    if (!empty($decoded['message']) && is_string($decoded['message'])) {
        $parts[] = $decoded['message'];
    }
    if (!empty($decoded['errors']) && is_array($decoded['errors'])) {
        foreach ($decoded['errors'] as $error) {
            if (!is_array($error)) {
                continue;
            }
            $field = raiaccept_trimmed_string($error['fieldName'] ?? '');
            $message = raiaccept_trimmed_string($error['message'] ?? '');
            if ($field !== '' && $message !== '') {
                $parts[] = $field . ': ' . $message;
            } elseif ($message !== '') {
                $parts[] = $message;
            }
        }
    }

    if ($parts === []) {
        return $fallback;
    }

    return $fallback . ' ' . implode(' ', array_unique($parts));
}

function raiaccept_create_checkout(array $input): array
{
    if (raiaccept_is_ticket_order($input)) {
        $input = raiaccept_apply_ticket_pricing($input);
    }

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
            'error' => raiaccept_raiaccept_error_message(
                'Could not create RaiAccept order.',
                $orderResponse['raw'] ?? ''
            ),
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

    if (is_array($input['_ticketRecord'] ?? null)) {
        try {
            tickets_record_online_order($input['_ticketRecord'] + [
                'id' => $merchantOrderReference,
                'orderIdentification' => $orderIdentification,
            ]);
        } catch (Throwable $e) {
            error_log('tickets: could not record ' . $merchantOrderReference . ': ' . $e->getMessage());
        }
    }

    if (
        raiaccept_is_booking_order($input)
        && !empty($prepared['confirmation'])
        && is_array($prepared['confirmation'])
    ) {
        raiaccept_store_booking_confirmation($merchantOrderReference, array_merge($prepared['confirmation'], [
            'merchantOrderReference' => $merchantOrderReference,
            'orderIdentification' => $orderIdentification,
            'createdAt' => gmdate('c'),
            'guestEmailSent' => false,
            'hotelEmailSent' => false,
        ]));
    } elseif (
        !raiaccept_is_booking_order($input)
        && !empty($prepared['confirmation'])
        && is_array($prepared['confirmation'])
    ) {
        raiaccept_store_extra_confirmation($merchantOrderReference, array_merge($prepared['confirmation'], [
            'merchantOrderReference' => $merchantOrderReference,
            'orderIdentification' => $orderIdentification,
            'createdAt' => gmdate('c'),
            'hotelEmailSent' => false,
        ]));
    }

    return [
        'checkoutUrl' => $checkoutUrl,
        'orderIdentification' => $orderIdentification,
        'merchantOrderReference' => $merchantOrderReference,
        'amount' => $prepared['amount'],
        'currency' => $prepared['payload']['invoice']['currency'],
        'roomSubtotal' => $prepared['roomSubtotal'] ?? null,
        'nightlyRate' => $prepared['nightlyRate'] ?? null,
        'childSurcharge' => $prepared['childSurcharge'] ?? null,
        'extrasTotal' => $prepared['extrasTotal'] ?? null,
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

function raiaccept_webhook_log_entries(): array
{
    $contents = @file_get_contents(raiaccept_webhook_log_path());
    if (!is_string($contents) || trim($contents) === '') {
        return [];
    }

    $decoded = json_decode($contents, true);
    return is_array($decoded) ? $decoded : [];
}

function raiaccept_webhook_already_processed(string $key): bool
{
    if ($key === '') {
        return false;
    }

    return isset(raiaccept_webhook_log_entries()[$key]);
}

function raiaccept_mark_webhook_processed(string $key): void
{
    if ($key === '') {
        return;
    }

    $storageDir = dirname(raiaccept_webhook_log_path());
    if (!is_dir($storageDir) && !@mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        return;
    }

    $handle = @fopen(raiaccept_webhook_log_path(), 'c+');
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

    $entries[$key] = gmdate('c');
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($entries, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
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
    if ($dedupeKey !== '' && raiaccept_webhook_already_processed($dedupeKey)) {
        return;
    }

    $config = raiaccept_load_config();
    $merchantOrderReference = raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'merchantOrderReference'));
    if ($merchantOrderReference === '') {
        $merchantOrderReference = raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'orderIdentification'));
    }
    $orderIdentification = raiaccept_trimmed_string(raiaccept_first_by_key($payload, 'orderIdentification'));
    $isRoomBooking = raiaccept_webhook_is_room_booking($payload);

    $order = is_array($payload['order'] ?? null) ? $payload['order'] : [];
    $consumer = is_array($order['consumer'] ?? null) ? $order['consumer'] : [];
    $hotelOk = false;

    if ($isRoomBooking && $merchantOrderReference !== '') {
        // Use the stored booking record so the hotel receives the guest's full
        // name, room, dates, party size, nights, and final paid total.
        $bookingEmails = raiaccept_dispatch_paid_booking_emails($merchantOrderReference, [
            'orderIdentification' => $orderIdentification,
            'guestEmail' => raiaccept_trimmed_string($consumer['email'] ?? ''),
            'guestFirstName' => raiaccept_trimmed_string($consumer['firstName'] ?? ''),
            'guestLastName' => raiaccept_trimmed_string($consumer['lastName'] ?? ''),
            'guestPhone' => raiaccept_trimmed_string($consumer['mobilePhone'] ?? ''),
            'skipPaymentRecheck' => true,
        ]);
        $hotelOk = !empty($bookingEmails['hotelSent']);
    } elseif (
        raiaccept_is_extra_order_reference($merchantOrderReference)
        && raiaccept_load_extra_confirmation($merchantOrderReference) !== null
    ) {
        // Shares the stored hotelEmailSent flag with the browser-return path, so only one email goes out.
        $extraEmails = raiaccept_dispatch_paid_extra_emails($merchantOrderReference, [
            'orderIdentification' => $orderIdentification,
            'skipPaymentRecheck' => true,
        ]);
        $hotelOk = !empty($extraEmails['hotelSent']);
    } else {
        $hotelEmail = $config['order_notification_email'] ?: 'info@derandhotel.com';
        $hotelOk = raiaccept_send_plaintext_mail(
            $hotelEmail,
            ($isRoomBooking ? '[Paid Room Booking] ' : '[Paid Order] ') . ($merchantOrderReference !== '' ? $merchantOrderReference : 'RaiAccept checkout'),
            raiaccept_webhook_message($payload),
            $hotelEmail,
            'Derand Hotel Website'
        );
    }

    if (!$hotelOk) {
        raiaccept_json_response(502, [
            'error' => 'The hotel notification email could not be sent.',
        ]);
    }

    if ($dedupeKey !== '') {
        raiaccept_mark_webhook_processed($dedupeKey);
    }
}

function raiaccept_booking_confirmation_dir(): string
{
    return __DIR__ . '/_storage/booking-confirmations';
}

function raiaccept_booking_confirmation_path(string $merchantOrderReference): string
{
    $safe = preg_replace('/[^A-Za-z0-9._-]+/', '_', $merchantOrderReference) ?: 'unknown';
    return raiaccept_booking_confirmation_dir() . '/' . $safe . '.json';
}

function raiaccept_store_booking_confirmation(string $merchantOrderReference, array $data): void
{
    if ($merchantOrderReference === '') {
        return;
    }
    $dir = raiaccept_booking_confirmation_dir();
    if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
        return;
    }
    @file_put_contents(
        raiaccept_booking_confirmation_path($merchantOrderReference),
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

function raiaccept_load_booking_confirmation(string $merchantOrderReference): ?array
{
    if ($merchantOrderReference === '') {
        return null;
    }
    $path = raiaccept_booking_confirmation_path($merchantOrderReference);
    if (!is_file($path)) {
        return null;
    }
    $raw = @file_get_contents($path);
    if (!is_string($raw) || trim($raw) === '') {
        return null;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : null;
}

function raiaccept_extra_confirmation_dir(): string
{
    return __DIR__ . '/_storage/extra-confirmations';
}

function raiaccept_extra_confirmation_path(string $merchantOrderReference): string
{
    $safe = preg_replace('/[^A-Za-z0-9._-]+/', '_', $merchantOrderReference) ?: 'unknown';
    return raiaccept_extra_confirmation_dir() . '/' . $safe . '.json';
}

function raiaccept_store_extra_confirmation(string $merchantOrderReference, array $data): void
{
    if ($merchantOrderReference === '') {
        return;
    }
    $dir = raiaccept_extra_confirmation_dir();
    if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
        return;
    }
    @file_put_contents(
        raiaccept_extra_confirmation_path($merchantOrderReference),
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

function raiaccept_load_extra_confirmation(string $merchantOrderReference): ?array
{
    if ($merchantOrderReference === '') {
        return null;
    }
    $path = raiaccept_extra_confirmation_path($merchantOrderReference);
    if (!is_file($path)) {
        return null;
    }
    $raw = @file_get_contents($path);
    if (!is_string($raw) || trim($raw) === '') {
        return null;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : null;
}

function raiaccept_is_extra_order_reference(string $merchantOrderReference): bool
{
    $reference = strtoupper(raiaccept_trimmed_string($merchantOrderReference));
    return strpos($reference, 'EXTRA-') === 0 || strpos($reference, 'EXTRA_') === 0;
}

function raiaccept_extra_cart_requires_advance_delivery(array $input): bool
{
    $items = $input['cartItems'] ?? [];
    if (!is_array($items)) {
        return false;
    }

    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }
        $category = strtolower(raiaccept_trimmed_string($item['category'] ?? ''));
        if (in_array($category, ['flowers', 'flower', 'perfumes', 'perfume'], true)) {
            return true;
        }
    }

    return false;
}

function raiaccept_validate_flowers_perfume_delivery(string $deliveryDate, string $deliveryTime): void
{
    if ($deliveryDate === '' || $deliveryTime === '') {
        return;
    }

    $hotelZone = new DateTimeZone('Europe/Belgrade');
    $timePart = substr($deliveryTime, 0, 5);
    $delivery = DateTimeImmutable::createFromFormat('!Y-m-d H:i', $deliveryDate . ' ' . $timePart, $hotelZone);
    if (!$delivery) {
        raiaccept_json_response(400, [
            'error' => 'Invalid delivery date or time.',
        ]);
    }

    // Allow a few minutes of slack for the time the guest spends at the payment page.
    $minimum = (new DateTimeImmutable('now', $hotelZone))->modify('+25 minutes');
    if ($delivery < $minimum) {
        raiaccept_json_response(400, [
            'error' => 'Delivery needs at least 30 minutes from now. Please choose a later time.',
        ]);
    }
}

function raiaccept_format_guest_date(string $iso): string
{
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $iso);
    return $date ? $date->format('j F Y') : $iso;
}

function raiaccept_send_plaintext_mail(string $to, string $subject, string $body, string $fromEmail, string $fromName): bool
{
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . $fromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $fromEmail,
        'Return-Path: ' . $fromEmail,
        'X-Mailer: DerandHotelBooking/1.0',
    ];
    $headerString = implode("\r\n", $headers);
    if (stripos(PHP_OS, 'WIN') === 0) {
        return @mail($to, $encodedSubject, $body, $headerString);
    }

    return @mail($to, $encodedSubject, $body, $headerString, '-f ' . $fromEmail);
}

function raiaccept_send_guest_confirmation_via_formsubmit(string $guestEmail, string $subject, string $body): bool
{
    if ($guestEmail === '' || !filter_var($guestEmail, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $response = raiaccept_request(
        'POST',
        'https://formsubmit.co/ajax/' . rawurlencode($guestEmail),
        [
            '_subject' => $subject,
            '_captcha' => 'false',
            '_template' => 'box',
            'name' => 'Derand Hotel',
            'message' => $body,
        ]
    );
    if (!$response['ok']) {
        return false;
    }

    $data = is_array($response['data']) ? $response['data'] : [];
    return !empty($data['success']);
}

function raiaccept_guest_confirmation_message(array $booking): string
{
    $guestName = trim((string) ($booking['guestName'] ?? ''));
    if ($guestName === '') {
        $guestName = trim(
            raiaccept_trimmed_string($booking['guestFirstName'] ?? '') . ' ' .
            raiaccept_trimmed_string($booking['guestLastName'] ?? '')
        );
    }
    if ($guestName === '') {
        $guestName = 'Guest';
    }

    $roomName = raiaccept_trimmed_string($booking['roomName'] ?? '');
    $checkIn = raiaccept_format_guest_date((string) ($booking['checkIn'] ?? ''));
    $checkOut = raiaccept_format_guest_date((string) ($booking['checkOut'] ?? ''));
    $checkInTime = raiaccept_trimmed_string($booking['checkInTime'] ?? '15:00') ?: '15:00';
    $checkOutTime = raiaccept_trimmed_string($booking['checkOutTime'] ?? '11:00') ?: '11:00';
    $phone = raiaccept_trimmed_string($booking['hotelPhone'] ?? '+383 (0) 41 111 222');
    $reference = raiaccept_trimmed_string($booking['merchantOrderReference'] ?? '');
    $nights = (string) ($booking['nights'] ?? '');
    $adults = (string) ($booking['adults'] ?? '');
    $children = (string) ($booking['children'] ?? '');
    $currency = raiaccept_trimmed_string($booking['currency'] ?? 'EUR') ?: 'EUR';
    $totalValue = (float) ($booking['total'] ?? $booking['amount'] ?? 0);
    $total = $totalValue > 0 ? number_format($totalValue, 2, '.', '') : '';
    $notes = raiaccept_trimmed_string($booking['notes'] ?? '');

    $lines = [
        'Booking Confirmed!',
        '',
        'Dear ' . $guestName . ',',
        '',
        'Thank you for choosing Derand Hotel. We have received your reservation and payment — your stay is confirmed.',
        '',
    ];
    if ($roomName !== '') {
        $lines[] = 'Room: ' . $roomName;
    }
    $lines[] = 'Check-in: ' . $checkIn . ' from ' . $checkInTime;
    $lines[] = 'Check-out: ' . $checkOut . ' until ' . $checkOutTime;
    if ($nights !== '') {
        $lines[] = 'Nights: ' . $nights;
    }
    if ($adults !== '') {
        $guestLine = 'Guests: ' . $adults . ' adult' . ($adults === '1' ? '' : 's');
        if ($children !== '' && $children !== '0') {
            $guestLine .= ', ' . $children . ' child' . ($children === '1' ? '' : 'ren');
        }
        $lines[] = $guestLine;
    }
    if ($total !== '') {
        $lines[] = 'Total paid: ' . $total . ' ' . $currency;
    }
    if ($reference !== '') {
        $lines[] = 'Booking reference: ' . $reference;
    }
    if ($notes !== '') {
        $lines[] = 'Your notes: ' . $notes;
    }
    $lines[] = '';
    $lines[] = 'Need to change anything? Reply to this email or call us at ' . $phone . '.';
    $lines[] = '';
    $lines[] = 'We look forward to welcoming you.';
    $lines[] = '';
    $lines[] = '— Derand Hotel';
    $lines[] = raiaccept_trimmed_string($booking['hotelAddress'] ?? 'Bekim Fehmiu Str. 30, Pristina 10000, Kosovo');
    $lines[] = 'info@derandhotel.com';

    return implode("\n", $lines);
}

function raiaccept_notify_guest_confirmation(array $booking, array $config): bool
{
    $guestEmail = raiaccept_trimmed_string($booking['guestEmail'] ?? '');
    if ($guestEmail === '') {
        return false;
    }

    $guestName = trim((string) ($booking['guestName'] ?? ''));
    if ($guestName === '') {
        $guestName = trim(
            raiaccept_trimmed_string($booking['guestFirstName'] ?? '') . ' ' .
            raiaccept_trimmed_string($booking['guestLastName'] ?? '')
        );
    }

    $subject = 'Booking Confirmed — Derand Hotel';
    $body = raiaccept_guest_confirmation_message($booking);
    $fromEmail = $config['order_notification_email'] ?: 'info@derandhotel.com';

    if (raiaccept_send_plaintext_mail($guestEmail, $subject, $body, $fromEmail, 'Derand Hotel')) {
        return true;
    }

    return raiaccept_send_guest_confirmation_via_formsubmit($guestEmail, $subject, $body);
}

function raiaccept_notify_hotel_paid_booking(array $booking, array $config): bool
{
    $reference = raiaccept_trimmed_string($booking['merchantOrderReference'] ?? '');
    $guestName = raiaccept_trimmed_string($booking['guestName'] ?? '');
    if ($guestName === '') {
        $guestName = trim(
            raiaccept_trimmed_string($booking['guestFirstName'] ?? '') . ' ' .
            raiaccept_trimmed_string($booking['guestLastName'] ?? '')
        );
    }
    $guestFirstName = raiaccept_trimmed_string($booking['guestFirstName'] ?? '');
    $guestLastName = raiaccept_trimmed_string($booking['guestLastName'] ?? '');
    if ($guestFirstName === '' || $guestLastName === '') {
        $nameParts = raiaccept_split_full_name($guestName);
        if ($guestFirstName === '') {
            $guestFirstName = $nameParts['firstName'];
        }
        if ($guestLastName === '') {
            $guestLastName = $nameParts['lastName'];
        }
    }
    $guestEmail = raiaccept_trimmed_string($booking['guestEmail'] ?? '');
    $guestPhone = raiaccept_trimmed_string($booking['guestPhone'] ?? '');
    $roomName = raiaccept_trimmed_string($booking['roomName'] ?? '');
    $checkIn = raiaccept_trimmed_string($booking['checkIn'] ?? '');
    $checkOut = raiaccept_trimmed_string($booking['checkOut'] ?? '');
    $adults = (string) ($booking['adults'] ?? '');
    $children = (string) ($booking['children'] ?? '');
    $nights = (string) ($booking['nights'] ?? '');
    $currency = raiaccept_trimmed_string($booking['currency'] ?? 'EUR') ?: 'EUR';
    $total = number_format((float) ($booking['total'] ?? 0), 2, '.', '');

    $message = implode("\n", [
        'DERAND HOTEL — paid room reservation',
        '',
        'Name: ' . $guestFirstName,
        'Surname: ' . $guestLastName,
        'Email: ' . $guestEmail,
        'Phone: ' . $guestPhone,
        '',
        'Room: ' . $roomName,
        'Check-in: ' . $checkIn . ' (' . raiaccept_trimmed_string($booking['checkInTime'] ?? '15:00') . ')',
        'Check-out: ' . $checkOut . ' (' . raiaccept_trimmed_string($booking['checkOutTime'] ?? '11:00') . ')',
        'Adults: ' . $adults,
        'Children: ' . $children,
        'Nights: ' . $nights,
        'Total price: ' . $total . ' ' . $currency,
        'Payment: PAID',
        'Reservation reference: ' . $reference,
        'Notes: ' . (raiaccept_trimmed_string($booking['notes'] ?? '') !== '' ? (string) $booking['notes'] : '(none)'),
        '',
        'Recipient: ' . ($config['order_notification_email'] ?: 'info@derandhotel.com'),
    ]);

    $hotelEmail = $config['order_notification_email'] ?: 'info@derandhotel.com';
    $subject = 'Room reservation — ' . ($guestName !== '' ? $guestName : $reference);

    // Web3Forms blocks server-side (non-browser) submissions on the free plan,
    // so the hotel notification is sent with PHP mail() like the guest email.
    $sent = raiaccept_send_plaintext_mail(
        $hotelEmail,
        $subject,
        $message,
        $hotelEmail,
        'Derand Hotel Website'
    );

    // Optional secondary channel if a server-approved Web3Forms key exists.
    if ($config['web3forms_access_key'] !== '') {
        $response = raiaccept_request(
            'POST',
            $config['web3forms_url'] ?: 'https://api.web3forms.com/submit',
            [
                'access_key' => $config['web3forms_access_key'],
                'subject' => $subject,
                'from_name' => 'Derand Hotel Room Reservation',
                'name' => $guestName,
                'email' => $guestEmail !== '' ? $guestEmail : $hotelEmail,
                'phone' => $guestPhone,
                'replyto' => $guestEmail,
                'room' => $roomName,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'adults' => $adults,
                'children' => $children,
                'nights' => $nights,
                'total_price' => $total . ' ' . $currency,
                'payment_status' => 'PAID',
                'reservation_reference' => $reference,
                'message' => $message,
            ]
        );
        $sent = $sent || !empty($response['ok']);
    }

    return $sent;
}

function raiaccept_dispatch_paid_booking_emails(string $merchantOrderReference, array $fallback = []): array
{
    $config = raiaccept_load_config();
    $stored = raiaccept_load_booking_confirmation($merchantOrderReference) ?: [];

    $booking = $stored;
    foreach ($fallback as $key => $value) {
        if ($value === null || $value === '') {
            continue;
        }
        if (in_array($key, ['hotelAlreadyNotified', 'skipPaymentRecheck'], true)) {
            continue;
        }
        $booking[$key] = $value;
    }
    $booking['merchantOrderReference'] = $merchantOrderReference;

    if (empty($booking['guestName'])) {
        $booking['guestName'] = trim(
            raiaccept_trimmed_string($booking['guestFirstName'] ?? '') . ' ' .
            raiaccept_trimmed_string($booking['guestLastName'] ?? '')
        );
    }

    $orderIdentification = raiaccept_trimmed_string($booking['orderIdentification'] ?? ($fallback['orderIdentification'] ?? ''));
    $skipRecheck = !empty($fallback['skipPaymentRecheck']);
    if (!$skipRecheck && $orderIdentification !== '') {
        $status = raiaccept_get_order_payment_status($orderIdentification);
        if (($status['paymentStatus'] ?? '') !== 'paid') {
            return [
                'ok' => false,
                'guestSent' => false,
                'hotelSent' => false,
                'error' => 'Payment is not confirmed as paid yet.',
                'paymentStatus' => $status['paymentStatus'] ?? 'pending',
            ];
        }
    }

    $guestSent = !empty($booking['guestEmailSent']);
    $hotelSent = !empty($booking['hotelEmailSent']) || !empty($fallback['hotelAlreadyNotified']);

    if (!$hotelSent) {
        $hotelSent = raiaccept_notify_hotel_paid_booking($booking, $config);
    }

    if (!$guestSent) {
        $guestSent = raiaccept_notify_guest_confirmation($booking, $config);
    }

    $booking['guestEmailSent'] = !empty($booking['guestEmailSent']) || $guestSent;
    $booking['hotelEmailSent'] = !empty($booking['hotelEmailSent']) || $hotelSent;
    $booking['confirmedAt'] = gmdate('c');
    raiaccept_store_booking_confirmation($merchantOrderReference, $booking);

    return [
        'ok' => $guestSent || $hotelSent,
        'guestSent' => $guestSent,
        'hotelSent' => $hotelSent,
        'merchantOrderReference' => $merchantOrderReference,
    ];
}

function raiaccept_build_extra_hotel_email_message(array $extra): string
{
    $cart = is_array($extra['cart'] ?? null) ? $extra['cart'] : [];
    $orderLines = [];
    $grandTotal = 0.0;

    foreach ($cart as $index => $item) {
        if (!is_array($item)) {
            continue;
        }
        $title = raiaccept_trimmed_string($item['productBase'] ?? 'Extra item');
        $variant = raiaccept_trimmed_string($item['variantLabel'] ?? '');
        if ($variant !== '' && stripos($variant, 'ml') === false) {
            $title .= ' (' . $variant . ')';
        } elseif ($variant !== '') {
            $title .= ' — ' . $variant;
        }
        $qty = max(0, (int) ($item['qty'] ?? 0));
        $price = (float) ($item['price'] ?? 0);
        $lineTotal = round($qty * $price, 2);
        $grandTotal += $lineTotal;
        $line = ($index + 1) . '. ' . $title . ': ' . $qty . ' x '
            . number_format($price, 2, '.', '') . ' EUR = '
            . number_format($lineTotal, 2, '.', '') . ' EUR';
        $description = raiaccept_trimmed_string($item['description'] ?? '');
        if ($description !== '') {
            $line .= "\n   Note: " . $description;
        }
        $orderLines[] = $line;
    }

    if ($orderLines === []) {
        $orderLines[] = raiaccept_trimmed_string($extra['productName'] ?? 'Extra order');
        $grandTotal = (float) ($extra['total'] ?? 0);
    }

    $reference = raiaccept_trimmed_string($extra['merchantOrderReference'] ?? '');
    $hotelEmail = 'info@derandhotel.com';

    return implode("\n", [
        'EXTRA ORDER — PAID',
        '==================',
        '',
        'Recipient: ' . $hotelEmail,
        '',
        'Order reference: ' . $reference,
        '',
        'Guest details',
        '-------------',
        'Name on reservation: ' . raiaccept_trimmed_string($extra['lastName'] ?? ''),
        'Room number: ' . raiaccept_trimmed_string($extra['roomNumber'] ?? ''),
        'Delivery date: ' . raiaccept_trimmed_string($extra['deliveryDate'] ?? ''),
        'Delivery time: ' . raiaccept_trimmed_string($extra['deliveryTime'] ?? ''),
        '',
        'Cart items (' . count($cart) . ' product line(s))',
        '----------',
        implode("\n", $orderLines),
        '',
        'Total: ' . number_format($grandTotal > 0 ? $grandTotal : (float) ($extra['total'] ?? 0), 2, '.', '') . ' EUR',
        'Payment: Card — PAID',
        '',
        'Guest message:',
        raiaccept_trimmed_string($extra['message'] ?? '') !== '' ? (string) $extra['message'] : '(none)',
        '',
        'Sent from: /extra (Derand Hotel website)',
        'Time: ' . gmdate('Y-m-d H:i:s') . ' UTC',
    ]);
}

function raiaccept_notify_hotel_paid_extra(array $extra, array $config): bool
{
    $hotelEmail = $config['order_notification_email'] ?: 'info@derandhotel.com';
    $roomNumber = raiaccept_trimmed_string($extra['roomNumber'] ?? '?');
    $lastName = raiaccept_trimmed_string($extra['lastName'] ?? 'Guest');
    $reference = raiaccept_trimmed_string($extra['merchantOrderReference'] ?? '');
    $cartCount = is_array($extra['cart'] ?? null) ? count($extra['cart']) : 0;
    $subject = '[Extra PAID] Room ' . $roomNumber . ' — ' . $lastName . ' — '
        . $cartCount . ' item(s) — ' . $reference;
    $message = raiaccept_build_extra_hotel_email_message($extra);

    $sent = raiaccept_send_plaintext_mail(
        $hotelEmail,
        $subject,
        $message,
        $hotelEmail,
        'Derand Hotel — Extra Cart'
    );

    if ($config['web3forms_access_key'] !== '') {
        $response = raiaccept_request(
            'POST',
            $config['web3forms_url'] ?: 'https://api.web3forms.com/submit',
            [
                'access_key' => $config['web3forms_access_key'],
                'subject' => $subject,
                'from_name' => 'Derand Hotel — Extra Cart',
                'to_email' => $hotelEmail,
                'recipient' => $hotelEmail,
                'notify_email' => $hotelEmail,
                'name' => $lastName,
                'room_number' => $roomNumber,
                'delivery_date' => raiaccept_trimmed_string($extra['deliveryDate'] ?? ''),
                'delivery_time' => raiaccept_trimmed_string($extra['deliveryTime'] ?? ''),
                'order_reference' => $reference,
                'payment_method' => 'Card — PAID',
                'message' => $message,
            ]
        );
        $sent = $sent || !empty($response['ok']);
    }

    return $sent;
}

function raiaccept_dispatch_paid_extra_emails(string $merchantOrderReference, array $fallback = []): array
{
    $config = raiaccept_load_config();
    $stored = raiaccept_load_extra_confirmation($merchantOrderReference) ?: [];

    $extra = $stored;
    foreach ($fallback as $key => $value) {
        if ($value === null || $value === '') {
            continue;
        }
        if (in_array($key, ['hotelAlreadyNotified', 'skipPaymentRecheck'], true)) {
            continue;
        }
        $extra[$key] = $value;
    }
    $extra['merchantOrderReference'] = $merchantOrderReference;

    if ($extra === [] && !empty($fallback['guest']) && is_array($fallback['guest'])) {
        $guest = $fallback['guest'];
        $extra = [
            'lastName' => raiaccept_trimmed_string($guest['lastName'] ?? ''),
            'roomNumber' => raiaccept_trimmed_string($guest['roomNumber'] ?? ''),
            'deliveryDate' => raiaccept_trimmed_string($guest['deliveryDate'] ?? ''),
            'deliveryTime' => raiaccept_trimmed_string($guest['deliveryTime'] ?? ''),
            'message' => raiaccept_trimmed_string($guest['message'] ?? ''),
            'cart' => is_array($fallback['cart'] ?? null) ? $fallback['cart'] : [],
        ];
    } elseif (!empty($fallback['cart']) && is_array($fallback['cart']) && empty($extra['cart'])) {
        $extra['cart'] = $fallback['cart'];
    }

    $orderIdentification = raiaccept_trimmed_string(
        $extra['orderIdentification'] ?? ($fallback['orderIdentification'] ?? '')
    );
    $skipRecheck = !empty($fallback['skipPaymentRecheck']);
    if (!$skipRecheck && $orderIdentification !== '') {
        $status = raiaccept_get_order_payment_status($orderIdentification);
        if (($status['paymentStatus'] ?? '') !== 'paid') {
            return [
                'ok' => false,
                'hotelSent' => false,
                'error' => 'Payment is not confirmed as paid yet.',
                'paymentStatus' => $status['paymentStatus'] ?? 'pending',
            ];
        }
    }

    $hotelSent = !empty($extra['hotelEmailSent']) || !empty($fallback['hotelAlreadyNotified']);
    if (!$hotelSent) {
        $hotelSent = raiaccept_notify_hotel_paid_extra($extra, $config);
    }

    if ($merchantOrderReference !== '' && $hotelSent) {
        $extra['hotelEmailSent'] = true;
        $extra['confirmedAt'] = gmdate('c');
        raiaccept_store_extra_confirmation($merchantOrderReference, $extra);
    }

    return [
        'ok' => $hotelSent,
        'hotelSent' => $hotelSent,
        'merchantOrderReference' => $merchantOrderReference,
    ];
}
