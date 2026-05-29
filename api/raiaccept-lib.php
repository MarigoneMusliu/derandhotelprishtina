<?php

declare(strict_types=1);

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

function raiaccept_load_config(): array
{
    $paths = [
        __DIR__ . '/raiaccept-config.php',
        __DIR__ . '/_raiaccept-config.local.php',
        dirname(__DIR__) . '/raiaccept-private-config.php',
    ];

    $config = null;
    foreach ($paths as $path) {
        if (!is_file($path)) {
            continue;
        }
        $loaded = require $path;
        if (is_array($loaded)) {
            $config = $loaded;
            break;
        }
    }

    if (!is_array($config)) {
        raiaccept_json_response(500, [
            'error' => 'RaiAccept config file is missing. Add api/raiaccept-config.php or raiaccept-private-config.php on the server.',
        ]);
    }

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
        'is_production' => !empty($config['is_production']),
    ];
}

function raiaccept_request(string $method, string $url, ?array $body, array $headers = []): array
{
    $ch = curl_init($url);
    if ($ch === false) {
        return ['ok' => false, 'status' => 0, 'data' => null, 'raw' => 'curl_init failed'];
    }

    $defaultHeaders = ['Accept: application/json'];
    if ($body !== null) {
        $defaultHeaders[] = 'Content-Type: application/json';
    }

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => strtoupper($method),
        CURLOPT_HTTPHEADER => array_merge($defaultHeaders, $headers),
        CURLOPT_TIMEOUT => 45,
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

function raiaccept_get_token(array $config): string
{
    $response = raiaccept_request(
        'POST',
        'https://authenticate.raiaccept.com',
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

function raiaccept_map_payment_status(string $orderStatus): string
{
    $status = strtoupper(trim($orderStatus));
    if ($status === 'PAID') {
        return 'paid';
    }
    if ($status === 'CANCELED' || $status === 'CANCELLED') {
        return 'cancelled';
    }
    if (in_array($status, ['FAILED', 'ABANDONED'], true)) {
        return 'failed';
    }
    return 'pending';
}

function raiaccept_return_url(string $baseUrl, string $returnPath, string $paymentState, string $merchantOrderReference): string
{
    $path = '/' . ltrim($returnPath !== '' ? $returnPath : '/extra.html', '/');
    $query = http_build_query([
        'payment' => $paymentState,
        'orderRef' => $merchantOrderReference,
    ]);

    return $baseUrl . $path . '?' . $query;
}

function raiaccept_build_order_payload(array $input, array $config, string $merchantOrderReference): array
{
    $lastName = trim((string) ($input['lastName'] ?? 'Guest'));
    if ($lastName === '') {
        $lastName = 'Guest';
    }

    $deliveryDate = trim((string) ($input['deliveryDate'] ?? ''));
    $deliveryTime = trim((string) ($input['deliveryTime'] ?? ''));
    $message = trim((string) ($input['message'] ?? ''));
    $productName = trim((string) ($input['productName'] ?? 'Extra cart order'));

    $invoiceItems = [];
    $amount = 0.0;
    $items = $input['items'] ?? [];
    if (!is_array($items)) {
        $items = [];
    }

    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }
        $qty = max(0, (int) ($item['quantity'] ?? 0));
        $unitPrice = (float) ($item['unitPrice'] ?? 0);
        if ($qty < 1 || $unitPrice <= 0) {
            continue;
        }
        $lineTotal = round($qty * $unitPrice, 2);
        $amount += $lineTotal;
        $invoiceItems[] = [
            'description' => substr(trim((string) ($item['description'] ?? 'Extra item')), 0, 200),
            'numberOfItems' => $qty,
            'price' => round($unitPrice, 2),
        ];
    }

    $amount = round($amount, 2);
    if ($amount <= 0) {
        raiaccept_json_response(400, ['error' => 'Cart total must be greater than zero.']);
    }

    if (!$invoiceItems) {
        raiaccept_json_response(400, ['error' => 'No billable cart items were provided.']);
    }

    $returnPath = trim((string) ($input['returnPath'] ?? '/extra.html'));
    if ($returnPath === '') {
        $returnPath = '/extra.html';
    }

    $baseUrl = $config['site_base_url'];
    $description = $productName;
    if ($deliveryDate !== '' || $deliveryTime !== '') {
        $description .= ' — delivery ' . trim($deliveryDate . ' ' . $deliveryTime);
    }

    return [
        'consumer' => [
            'lastName' => substr($lastName, 0, 32),
        ],
        'invoice' => [
            'merchantOrderReference' => $merchantOrderReference,
            'amount' => $amount,
            'currency' => $config['currency'],
            'description' => substr($description, 0, 200),
            'items' => $invoiceItems,
        ],
        'paymentMethodPreference' => 'CARD',
        'urls' => [
            'successUrl' => raiaccept_return_url($baseUrl, $returnPath, 'success', $merchantOrderReference),
            'cancelUrl' => raiaccept_return_url($baseUrl, $returnPath, 'cancel', $merchantOrderReference),
            'failUrl' => raiaccept_return_url($baseUrl, $returnPath, 'fail', $merchantOrderReference),
        ],
    ];
}

function raiaccept_create_checkout(array $input): array
{
    $config = raiaccept_load_config();
    $token = raiaccept_get_token($config);

    $merchantOrderReference = 'EXTRA-' . gmdate('YmdHis') . '-' . bin2hex(random_bytes(4));
    $orderBody = raiaccept_build_order_payload($input, $config, $merchantOrderReference);

    $authHeader = ['Authorization: Bearer ' . $token];
    $orderResponse = raiaccept_request('POST', 'https://trapi.raiaccept.com/orders', $orderBody, $authHeader);
    if (!$orderResponse['ok'] || !is_array($orderResponse['data'])) {
        raiaccept_json_response(502, [
            'error' => 'Could not create RaiAccept order.',
            'details' => $orderResponse['raw'],
        ]);
    }

    $orderIdentification = (string) ($orderResponse['data']['orderIdentification'] ?? '');
    if ($orderIdentification === '') {
        raiaccept_json_response(502, ['error' => 'RaiAccept order response was incomplete.']);
    }

    $checkoutResponse = raiaccept_request(
        'POST',
        'https://trapi.raiaccept.com/orders/' . rawurlencode($orderIdentification) . '/checkout',
        $orderBody,
        $authHeader
    );

    if (!$checkoutResponse['ok'] || !is_array($checkoutResponse['data'])) {
        raiaccept_json_response(502, [
            'error' => 'Could not create RaiAccept payment session.',
            'details' => $checkoutResponse['raw'],
        ]);
    }

    $checkoutUrl = (string) ($checkoutResponse['data']['paymentRedirectURL'] ?? '');
    if ($checkoutUrl === '') {
        raiaccept_json_response(502, ['error' => 'RaiAccept checkout URL was missing from the response.']);
    }

    return [
        'checkoutUrl' => $checkoutUrl,
        'orderIdentification' => $orderIdentification,
        'merchantOrderReference' => $merchantOrderReference,
        'amount' => $orderBody['invoice']['amount'],
        'currency' => $orderBody['invoice']['currency'],
    ];
}

function raiaccept_get_order_payment_status(string $orderIdentification): array
{
    $config = raiaccept_load_config();
    $token = raiaccept_get_token($config);

    $response = raiaccept_request(
        'GET',
        'https://trapi.raiaccept.com/orders/' . rawurlencode($orderIdentification),
        null,
        ['Authorization: Bearer ' . $token]
    );

    if (!$response['ok'] || !is_array($response['data'])) {
        raiaccept_json_response(502, [
            'error' => 'Could not retrieve RaiAccept order status.',
            'details' => $response['raw'],
        ]);
    }

    $orderStatus = (string) ($response['data']['status'] ?? '');
    $merchantOrderReference = (string) ($response['data']['invoice']['merchantOrderReference'] ?? '');

    return [
        'paymentStatus' => raiaccept_map_payment_status($orderStatus),
        'orderStatus' => $orderStatus,
        'merchantOrderReference' => $merchantOrderReference,
        'orderIdentification' => $orderIdentification,
    ];
}
