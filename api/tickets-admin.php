<?php

declare(strict_types=1);

require_once __DIR__ . '/tickets-lib.php';

header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('Cache-Control: no-store');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

function tix_json(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload + ['ok' => $status < 400], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function tix_fail(int $status, string $message): void
{
    tix_json($status, ['error' => $message]);
}

function tix_start_session(): void
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name(TICKETS_SESSION_NAME);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

/* Logged-in user, re-read from disk so disabled users and changed passwords take effect immediately. */
function tix_current_user(): ?array
{
    $uid = $_SESSION['tix_uid'] ?? '';
    if ($uid === '') {
        return null;
    }
    if (time() - (int) ($_SESSION['tix_seen'] ?? 0) > TICKETS_SESSION_IDLE_SECONDS) {
        $_SESSION = [];
        return null;
    }
    foreach (tickets_users()['users'] as $u) {
        if ($u['id'] === $uid) {
            if (empty($u['active']) || (int) ($u['sessionVersion'] ?? 1) !== (int) ($_SESSION['tix_ver'] ?? 0)) {
                $_SESSION = [];
                return null;
            }
            $_SESSION['tix_seen'] = time();
            return $u;
        }
    }
    $_SESSION = [];
    return null;
}

function tix_require_user(): array
{
    $user = tix_current_user();
    if ($user === null) {
        tix_fail(401, 'Your session has ended. Please sign in again.');
    }
    return $user;
}

function tix_require_role(array $user, array $roles): void
{
    if (!in_array($user['role'], $roles, true)) {
        tix_fail(403, 'You do not have permission for this action.');
    }
}

/* Festivals this user may see: partners only their own, hotel staff all. */
function tix_can_see(array $user, string $festivalId): bool
{
    return $user['role'] !== 'partner' || in_array($festivalId, $user['festivals'] ?? [], true);
}

function tix_require_festival(array $user, string $festivalId): array
{
    $festival = tickets_find_festival(tickets_catalog(), $festivalId);
    if ($festival === null || !tix_can_see($user, $festivalId)) {
        tix_fail(404, 'Festival not found.');
    }
    return $festival;
}

/* Partners see what they need to deliver tickets, not guest contact details or hotel room revenue. */
function tix_order_for(array $user, array $o): array
{
    $out = [
        'id' => $o['id'],
        'festivalId' => $o['festivalId'],
        'festivalName' => $o['festivalName'] ?? '',
        'tierKey' => $o['tierKey'],
        'tierLabel' => $o['tierLabel'] ?? '',
        'quantity' => (int) $o['quantity'],
        'unitPrice' => (float) ($o['unitPrice'] ?? 0),
        'ticketTotal' => round((float) ($o['unitPrice'] ?? 0) * (int) $o['quantity'], 2),
        'status' => $o['status'],
        'source' => $o['source'] ?? 'online',
        'guestName' => trim(($o['guest']['firstName'] ?? '') . ' ' . ($o['guest']['lastName'] ?? '')),
        'collected' => !empty($o['collected']),
        'collectedAt' => $o['collectedAt'] ?? null,
        'createdAt' => $o['createdAt'] ?? null,
        'paidAt' => $o['paidAt'] ?? null,
    ];
    if ($user['role'] === 'partner') {
        return $out;
    }
    return $out + [
        'guest' => $o['guest'] ?? [],
        'paymentMethod' => $o['paymentMethod'] ?? 'online',
        'total' => (float) ($o['total'] ?? 0),
        'mode' => $o['mode'] ?? 'tickets',
        'roomLabel' => $o['roomLabel'] ?? '',
        'nights' => $o['nights'] ?? null,
        'transfer' => !empty($o['transfer']),
        'orderIdentification' => $o['orderIdentification'] ?? '',
        'collectedBy' => $o['collectedBy'] ?? '',
        'note' => $o['note'] ?? '',
        'createdBy' => $o['createdBy'] ?? '',
        'cancelReason' => $o['cancelReason'] ?? '',
    ];
}

function tix_bootstrap(array $user): array
{
    $catalog = tickets_catalog();
    $store = tickets_orders();
    $stats = tickets_stats($catalog, $store);

    $festivals = [];
    foreach ($catalog['festivals'] as $f) {
        if (tix_can_see($user, $f['id'])) {
            $f['stats'] = $stats[$f['id']];
            $festivals[] = $f;
        }
    }

    $orders = [];
    foreach (array_reverse($store['orders']) as $o) {
        if (!tix_can_see($user, $o['festivalId'] ?? '')) {
            continue;
        }
        if ($user['role'] === 'partner' && ($o['status'] ?? '') !== 'paid') {
            continue;
        }
        $orders[] = tix_order_for($user, $o);
    }

    $deliveries = [];
    foreach (array_reverse($store['deliveries']) as $d) {
        if (tix_can_see($user, $d['festivalId'] ?? '')) {
            $deliveries[] = $d;
        }
    }

    $out = [
        'user' => tickets_public_user($user),
        'csrf' => $_SESSION['tix_csrf'],
        'festivals' => $festivals,
        'orders' => $orders,
        'deliveries' => $deliveries,
        'holdMinutes' => (int) (TICKETS_PENDING_HOLD_SECONDS / 60),
    ];

    if ($user['role'] === 'admin') {
        $out['transferPrice'] = (float) ($catalog['transferPrice'] ?? 25);
        $out['users'] = array_map('tickets_public_user', tickets_users()['users']);
        $audit = tickets_read('audit', static fn(): array => ['entries' => []]);
        $out['audit'] = array_reverse(array_slice($audit['entries'], -300));
    }
    return $out;
}

function tix_order_csv(array $user, ?string $festivalId): void
{
    $catalog = tickets_catalog();
    $rows = [];
    foreach (tickets_orders()['orders'] as $o) {
        $fid = $o['festivalId'] ?? '';
        if (!tix_can_see($user, $fid) || ($festivalId !== null && $fid !== $festivalId)) {
            continue;
        }
        if ($user['role'] === 'partner' && ($o['status'] ?? '') !== 'paid') {
            continue;
        }
        $rows[] = tix_order_for($user, $o);
    }

    $name = 'derand-tickets-' . ($festivalId ?? 'all') . '-' . date('Y-m-d') . '.csv';
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $name . '"');
    header('Cache-Control: no-store');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    $partner = $user['role'] === 'partner';
    $head = ['Reference', 'Festival', 'Ticket type', 'Quantity', 'Unit price EUR', 'Tickets total EUR', 'Status', 'Guest', 'Handed to guest', 'Ordered at', 'Paid at'];
    if (!$partner) {
        $head = array_merge($head, ['Email', 'Phone', 'Payment', 'Order total EUR', 'Hotel room', 'Note']);
    }
    fputcsv($out, $head);
    foreach ($rows as $r) {
        $festival = tickets_find_festival($catalog, $r['festivalId']);
        $line = [
            $r['id'], $festival['name'] ?? $r['festivalName'], $r['tierLabel'], $r['quantity'], $r['unitPrice'], $r['ticketTotal'],
            $r['status'], $r['guestName'], $r['collected'] ? 'yes' : 'no', $r['createdAt'], $r['paidAt'],
        ];
        if (!$partner) {
            $line = array_merge($line, [
                $r['guest']['email'] ?? '', $r['guest']['phone'] ?? '', $r['paymentMethod'], $r['total'],
                $r['roomLabel'] !== '' ? $r['roomLabel'] . ' (' . $r['nights'] . ' nights)' : '', $r['note'],
            ]);
        }
        fputcsv($out, array_map(static function ($v) {
            $v = (string) $v;
            return preg_match('/^[=+\-@]/', $v) ? "'" . $v : $v;
        }, $line));
    }
    fclose($out);
    exit;
}

function tix_upload_image(): string
{
    $file = $_FILES['image'] ?? null;
    if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        tix_fail(400, 'Please choose an image file.');
    }
    if ((int) $file['size'] > 6 * 1024 * 1024) {
        tix_fail(400, 'Image is too large (max 6 MB).');
    }
    $info = @getimagesize($file['tmp_name']);
    $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    if (!is_array($info) || !isset($types[$info['mime']])) {
        tix_fail(400, 'Only JPG, PNG or WEBP images are allowed.');
    }
    $dir = dirname(__DIR__) . '/uploads/festivals';
    if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
        tix_fail(500, 'Upload folder could not be created.');
    }
    $guard = dirname($dir) . '/.htaccess';
    if (!is_file($guard)) {
        @file_put_contents($guard, "# Uploaded images only: never run scripts from here.\n<FilesMatch \"\\.(php\\d?|phtml|phar|cgi|pl|py|sh)$\">\n  <IfModule mod_authz_core.c>\n    Require all denied\n  </IfModule>\n  <IfModule !mod_authz_core.c>\n    Order allow,deny\n    Deny from all\n  </IfModule>\n</FilesMatch>\nOptions -Indexes -ExecCGI\n");
    }
    $name = 'festival-' . date('Ymd') . '-' . bin2hex(random_bytes(4)) . '.' . $types[$info['mime']];
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
        tix_fail(500, 'Image could not be saved.');
    }
    return 'uploads/festivals/' . $name;
}

/* ============================================================== Routing */

tix_start_session();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string) ($_GET['action'] ?? '');
$input = [];
if ($method === 'POST') {
    $contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    if (strpos($contentType, 'application/json') !== false) {
        $decoded = json_decode(file_get_contents('php://input') ?: '', true);
        $input = is_array($decoded) ? $decoded : [];
    } else {
        $input = $_POST;
    }
    $action = (string) ($input['action'] ?? $action);
} elseif ($method !== 'GET') {
    tix_fail(405, 'Method not allowed.');
}

try {
    if ($action === 'session') {
        $user = tix_current_user();
        if ($user === null) {
            tix_json(200, ['user' => null]);
        }
        tix_json(200, tix_bootstrap($user));
    }

    if ($action === 'login') {
        if ($method !== 'POST') {
            tix_fail(405, 'Use POST.');
        }
        $ip = tickets_client_ip();
        $wait = tickets_login_blocked($ip);
        if ($wait > 0) {
            tix_fail(429, 'Too many failed attempts. Try again in ' . (int) ceil($wait / 60) . ' minutes.');
        }
        $username = strtolower(tickets_str($input['username'] ?? '', 60));
        $password = (string) ($input['password'] ?? '');
        $found = null;
        foreach (tickets_users()['users'] as $u) {
            if (strtolower($u['username']) === $username) {
                $found = $u;
            }
        }
        $hash = $found['passwordHash'] ?? password_hash('unknown-user', PASSWORD_DEFAULT);
        $valid = password_verify($password, $hash) && $found !== null;
        if (!$valid || empty($found['active'])) {
            tickets_login_failed($ip);
            usleep(400000);
            tix_fail(401, $valid ? 'This account is disabled. Please contact the hotel.' : 'Wrong username or password.');
        }
        tickets_login_cleared($ip);
        $user = tickets_update('users', 'tickets_default_users', static function (array &$data) use ($found, $password): array {
            foreach ($data['users'] as &$u) {
                if ($u['id'] === $found['id']) {
                    $u['lastLoginAt'] = tickets_now();
                    if (password_needs_rehash($u['passwordHash'], PASSWORD_DEFAULT)) {
                        $u['passwordHash'] = password_hash($password, PASSWORD_DEFAULT);
                    }
                    return $u;
                }
            }
            return $found;
        });
        session_regenerate_id(true);
        $_SESSION['tix_uid'] = $user['id'];
        $_SESSION['tix_ver'] = (int) ($user['sessionVersion'] ?? 1);
        $_SESSION['tix_seen'] = time();
        $_SESSION['tix_csrf'] = bin2hex(random_bytes(24));
        tickets_audit($user, 'login');
        tix_json(200, tix_bootstrap($user));
    }

    $user = tix_require_user();

    if ($action === 'export') {
        $festivalId = tickets_str($_GET['festival'] ?? '', 60);
        tix_order_csv($user, $festivalId === '' ? null : $festivalId);
    }

    if ($method !== 'POST') {
        tix_fail(405, 'Use POST.');
    }
    $csrf = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($input['csrf'] ?? ''));
    if (empty($_SESSION['tix_csrf']) || !hash_equals((string) $_SESSION['tix_csrf'], $csrf)) {
        tix_fail(419, 'Your session expired. Please reload the page.');
    }

    switch ($action) {
        case 'logout':
            tickets_audit($user, 'logout');
            $_SESSION = [];
            session_regenerate_id(true);
            tix_json(200, ['user' => null]);

        case 'change_password':
            $current = (string) ($input['current'] ?? '');
            $new = (string) ($input['new'] ?? '');
            if (!password_verify($current, $user['passwordHash'])) {
                tix_fail(400, 'Current password is not correct.');
            }
            if (($problem = tickets_password_problem($new, $user['username'])) !== null) {
                tix_fail(400, $problem);
            }
            if (password_verify($new, $user['passwordHash'])) {
                tix_fail(400, 'The new password must be different from the current one.');
            }
            $user = tickets_update('users', 'tickets_default_users', static function (array &$data) use ($user, $new): array {
                foreach ($data['users'] as &$u) {
                    if ($u['id'] === $user['id']) {
                        $u['passwordHash'] = password_hash($new, PASSWORD_DEFAULT);
                        $u['mustChangePassword'] = false;
                        $u['sessionVersion'] = (int) ($u['sessionVersion'] ?? 1) + 1;
                        return $u;
                    }
                }
                return $user;
            });
            $_SESSION['tix_ver'] = (int) $user['sessionVersion'];
            session_regenerate_id(true);
            tickets_audit($user, 'password changed');
            tix_json(200, tix_bootstrap($user));
    }

    if (!empty($user['mustChangePassword'])) {
        tix_fail(403, 'Please change your password first.');
    }

    switch ($action) {
        case 'festival_save':
            tix_require_role($user, ['admin']);
            $posted = is_array($input['festival'] ?? null) ? $input['festival'] : [];
            $originalId = tickets_str($input['originalId'] ?? '', 60);
            $usedTiers = [];
            foreach (tickets_orders()['orders'] as $o) {
                if ($originalId !== '' && ($o['festivalId'] ?? '') === $originalId) {
                    $usedTiers[$o['tierKey']] = true;
                }
            }
            $saved = tickets_update('festivals', 'tickets_default_festivals', static function (array &$catalog) use ($posted, $originalId, $usedTiers): array {
                $index = null;
                foreach ($catalog['festivals'] as $i => $f) {
                    if ($originalId !== '' && $f['id'] === $originalId) {
                        $index = $i;
                    }
                }
                if ($originalId !== '' && $index === null) {
                    throw new InvalidArgumentException('This festival no longer exists. Please reload.');
                }
                $clean = tickets_clean_festival($posted, $index === null ? null : $catalog['festivals'][$index]);
                if ($index === null) {
                    if (tickets_find_festival($catalog, $clean['id']) !== null) {
                        throw new InvalidArgumentException('A festival with the ID "' . $clean['id'] . '" already exists.');
                    }
                    $catalog['festivals'][] = $clean;
                } else {
                    $keys = array_column($clean['tiers'], 'key');
                    foreach (array_keys($usedTiers) as $key) {
                        if (!in_array($key, $keys, true)) {
                            throw new InvalidArgumentException('Ticket type "' . $key . '" already has orders. Switch it off instead of deleting it.');
                        }
                    }
                    $catalog['festivals'][$index] = $clean;
                }
                return $clean;
            });
            tickets_audit($user, $originalId === '' ? 'festival created' : 'festival updated', $saved['name']);
            tix_json(200, tix_bootstrap($user) + ['saved' => $saved['id']]);

        case 'festival_delete':
            tix_require_role($user, ['admin']);
            $id = tickets_str($input['id'] ?? '', 60);
            foreach (tickets_orders()['orders'] as $o) {
                if (($o['festivalId'] ?? '') === $id) {
                    tix_fail(400, 'This festival has orders, so it cannot be deleted. Hide it from the website instead.');
                }
            }
            $name = tickets_update('festivals', 'tickets_default_festivals', static function (array &$catalog) use ($id): string {
                foreach ($catalog['festivals'] as $i => $f) {
                    if ($f['id'] === $id) {
                        array_splice($catalog['festivals'], $i, 1);
                        return $f['name'];
                    }
                }
                throw new InvalidArgumentException('Festival not found.');
            });
            tickets_update('users', 'tickets_default_users', static function (array &$data) use ($id): void {
                foreach ($data['users'] as &$u) {
                    $u['festivals'] = array_values(array_diff($u['festivals'] ?? [], [$id]));
                }
            });
            tickets_audit($user, 'festival deleted', $name);
            tix_json(200, tix_bootstrap($user));

        case 'festival_move':
            tix_require_role($user, ['admin']);
            $id = tickets_str($input['id'] ?? '', 60);
            $dir = (int) ($input['dir'] ?? 0) < 0 ? -1 : 1;
            tickets_update('festivals', 'tickets_default_festivals', static function (array &$catalog) use ($id, $dir): void {
                foreach ($catalog['festivals'] as $i => $f) {
                    $j = $i + $dir;
                    if ($f['id'] === $id && isset($catalog['festivals'][$j])) {
                        [$catalog['festivals'][$i], $catalog['festivals'][$j]] = [$catalog['festivals'][$j], $catalog['festivals'][$i]];
                        return;
                    }
                }
            });
            tix_json(200, tix_bootstrap($user));

        case 'festival_toggle':
            tix_require_role($user, ['admin']);
            $id = tickets_str($input['id'] ?? '', 60);
            $field = ($input['field'] ?? '') === 'active' ? 'active' : 'salesOpen';
            $value = !empty($input['value']);
            $name = tickets_update('festivals', 'tickets_default_festivals', static function (array &$catalog) use ($id, $field, $value): string {
                foreach ($catalog['festivals'] as &$f) {
                    if ($f['id'] === $id) {
                        $f[$field] = $value;
                        $f['updatedAt'] = tickets_now();
                        return $f['name'];
                    }
                }
                throw new InvalidArgumentException('Festival not found.');
            });
            tickets_audit($user, ($field === 'active' ? 'website visibility ' : 'online sales ') . ($value ? 'on' : 'off'), $name);
            tix_json(200, tix_bootstrap($user));

        case 'transfer_price':
            tix_require_role($user, ['admin']);
            $price = round((float) ($input['price'] ?? 0), 2);
            if ($price < 0 || $price > 1000) {
                tix_fail(400, 'Transfer price is not valid.');
            }
            tickets_update('festivals', 'tickets_default_festivals', static function (array &$catalog) use ($price): void {
                $catalog['transferPrice'] = $price;
            });
            tickets_audit($user, 'airport transfer price', number_format($price, 2) . ' EUR');
            tix_json(200, tix_bootstrap($user));

        case 'upload_image':
            tix_require_role($user, ['admin']);
            $path = tix_upload_image();
            tickets_audit($user, 'image uploaded', $path);
            tix_json(200, ['path' => $path]);

        case 'order_manual':
            tix_require_role($user, ['admin', 'staff']);
            $festival = tix_require_festival($user, tickets_str($input['festivalId'] ?? '', 60));
            $tier = tickets_find_tier($festival, tickets_str($input['tierKey'] ?? '', 60));
            if ($tier === null) {
                tix_fail(400, 'Choose a ticket type.');
            }
            $qty = (int) ($input['quantity'] ?? 0);
            if ($qty < 1 || $qty > 100) {
                tix_fail(400, 'Quantity must be between 1 and 100.');
            }
            $remaining = tickets_available($festival['id'], $tier['key']);
            if ($remaining !== null && $qty > $remaining && empty($input['overrideStock'])) {
                tix_fail(409, 'Only ' . $remaining . ' tickets of this type are left.');
            }
            $method = in_array($input['paymentMethod'] ?? '', TICKETS_PAYMENT_METHODS, true) && $input['paymentMethod'] !== 'online' ? $input['paymentMethod'] : 'cash';
            $guest = is_array($input['guest'] ?? null) ? $input['guest'] : [];
            $first = tickets_str($guest['firstName'] ?? '', 60);
            $last = tickets_str($guest['lastName'] ?? '', 60);
            if ($first === '' && $last === '') {
                tix_fail(400, 'Guest name is required.');
            }
            $email = tickets_str($guest['email'] ?? '', 120);
            if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                tix_fail(400, 'Guest email is not valid.');
            }
            $unit = $method === 'complimentary' ? 0.0 : (float) $tier['price'];
            $order = [
                'id' => tickets_id('MANUAL'),
                'source' => 'manual',
                'paymentMethod' => $method,
                'status' => 'paid',
                'festivalId' => $festival['id'],
                'festivalName' => $festival['name'],
                'tierKey' => $tier['key'],
                'tierLabel' => $tier['label'],
                'quantity' => $qty,
                'unitPrice' => $unit,
                'total' => round($unit * $qty, 2),
                'mode' => 'tickets',
                'guest' => ['firstName' => $first, 'lastName' => $last, 'email' => $email, 'phone' => tickets_str($guest['phone'] ?? '', 40)],
                'collected' => !empty($input['collected']),
                'collectedAt' => !empty($input['collected']) ? tickets_now() : null,
                'collectedBy' => !empty($input['collected']) ? $user['username'] : '',
                'note' => tickets_str($input['note'] ?? '', 500),
                'createdAt' => tickets_now(),
                'paidAt' => tickets_now(),
                'createdBy' => $user['username'],
            ];
            tickets_update('orders', 'tickets_default_orders', static function (array &$data) use ($order): void {
                $data['orders'][] = $order;
            });
            tickets_audit($user, 'manual sale', $order['id'] . ' · ' . $festival['name'] . ' · ' . $tier['label'] . ' × ' . $qty);
            tix_json(200, tix_bootstrap($user));

        case 'order_update':
            tix_require_role($user, ['admin', 'staff']);
            $id = tickets_str($input['id'] ?? '', 60);
            $result = tickets_update('orders', 'tickets_default_orders', static function (array &$data) use ($id, $input, $user): ?array {
                foreach ($data['orders'] as &$o) {
                    if ($o['id'] !== $id) {
                        continue;
                    }
                    if (!tix_can_see($user, $o['festivalId'])) {
                        return null;
                    }
                    if (array_key_exists('collected', $input)) {
                        if (!empty($input['collected']) && ($o['status'] ?? '') !== 'paid') {
                            throw new InvalidArgumentException('Only paid orders can be handed to the guest.');
                        }
                        $o['collected'] = !empty($input['collected']);
                        $o['collectedAt'] = $o['collected'] ? tickets_now() : null;
                        $o['collectedBy'] = $o['collected'] ? $user['username'] : '';
                    }
                    if (array_key_exists('note', $input)) {
                        $o['note'] = tickets_str($input['note'], 500);
                    }
                    $o['updatedAt'] = tickets_now();
                    return $o;
                }
                return null;
            });
            if ($result === null) {
                tix_fail(404, 'Order not found.');
            }
            if (array_key_exists('collected', $input)) {
                tickets_audit($user, $result['collected'] ? 'handed to guest' : 'hand-over undone', $id);
            }
            tix_json(200, tix_bootstrap($user));

        case 'order_cancel':
            tix_require_role($user, ['admin']);
            $id = tickets_str($input['id'] ?? '', 60);
            $status = ($input['status'] ?? '') === 'refunded' ? 'refunded' : 'cancelled';
            $reason = tickets_str($input['reason'] ?? '', 300);
            $found = tickets_update('orders', 'tickets_default_orders', static function (array &$data) use ($id, $status, $reason, $user): bool {
                foreach ($data['orders'] as &$o) {
                    if ($o['id'] === $id) {
                        if (!empty($o['collected'])) {
                            throw new InvalidArgumentException('This ticket was already handed to the guest. Undo the hand-over first.');
                        }
                        $o['status'] = $status;
                        $o['cancelReason'] = $reason;
                        $o['cancelledBy'] = $user['username'];
                        $o['updatedAt'] = tickets_now();
                        return true;
                    }
                }
                return false;
            });
            if (!$found) {
                tix_fail(404, 'Order not found.');
            }
            tickets_audit($user, 'order ' . $status, $id . ($reason !== '' ? ' · ' . $reason : ''));
            tix_json(200, tix_bootstrap($user));

        case 'delivery_add':
            tix_require_role($user, ['admin', 'staff']);
            $festival = tix_require_festival($user, tickets_str($input['festivalId'] ?? '', 60));
            $tier = tickets_find_tier($festival, tickets_str($input['tierKey'] ?? '', 60));
            if ($tier === null) {
                tix_fail(400, 'Choose a ticket type.');
            }
            $qty = (int) ($input['quantity'] ?? 0);
            if ($qty === 0 || abs($qty) > 10000) {
                tix_fail(400, 'Enter how many tickets were received (use a minus number to correct a mistake).');
            }
            $delivery = [
                'id' => tickets_id('DLV'),
                'festivalId' => $festival['id'],
                'tierKey' => $tier['key'],
                'tierLabel' => $tier['label'],
                'quantity' => $qty,
                'broughtBy' => tickets_str($input['broughtBy'] ?? '', 80),
                'note' => tickets_str($input['note'] ?? '', 300),
                'at' => tickets_now(),
                'by' => $user['username'],
            ];
            tickets_update('orders', 'tickets_default_orders', static function (array &$data) use ($delivery): void {
                $data['deliveries'][] = $delivery;
            });
            tickets_audit($user, 'tickets received', $festival['name'] . ' · ' . $tier['label'] . ' × ' . $qty);
            tix_json(200, tix_bootstrap($user));

        case 'delivery_delete':
            tix_require_role($user, ['admin']);
            $id = tickets_str($input['id'] ?? '', 60);
            tickets_update('orders', 'tickets_default_orders', static function (array &$data) use ($id): void {
                $data['deliveries'] = array_values(array_filter($data['deliveries'], static fn($d): bool => ($d['id'] ?? '') !== $id));
            });
            tickets_audit($user, 'delivery removed', $id);
            tix_json(200, tix_bootstrap($user));

        case 'user_save':
            tix_require_role($user, ['admin']);
            $catalogIds = array_column(tickets_catalog()['festivals'], 'id');
            $posted = is_array($input['user'] ?? null) ? $input['user'] : [];
            $saved = tickets_update('users', 'tickets_default_users', static function (array &$data) use ($posted, $catalogIds, $user): array {
                $id = tickets_str($posted['id'] ?? '', 40);
                $username = strtolower(tickets_str($posted['username'] ?? '', 40));
                if (!preg_match('/^[a-z0-9._-]{3,40}$/', $username)) {
                    throw new InvalidArgumentException('Username must be 3–40 characters: letters, numbers, dot, dash or underscore.');
                }
                $role = in_array($posted['role'] ?? '', TICKETS_ROLES, true) ? $posted['role'] : 'partner';
                $festivals = array_values(array_intersect((array) ($posted['festivals'] ?? []), $catalogIds));
                if ($role === 'partner' && $festivals === []) {
                    throw new InvalidArgumentException('Choose at least one festival for a festival partner.');
                }
                if ($role !== 'partner') {
                    $festivals = [];
                }
                $password = (string) ($posted['password'] ?? '');
                $active = !isset($posted['active']) || (bool) $posted['active'];

                $index = null;
                foreach ($data['users'] as $i => $u) {
                    if ($id !== '' && $u['id'] === $id) {
                        $index = $i;
                    } elseif (strtolower($u['username']) === $username) {
                        throw new InvalidArgumentException('The username "' . $username . '" is already taken.');
                    }
                }
                if ($password !== '' && ($problem = tickets_password_problem($password, $username)) !== null) {
                    throw new InvalidArgumentException($problem);
                }

                if ($index === null) {
                    if ($password === '') {
                        throw new InvalidArgumentException('Set a starting password for the new user.');
                    }
                    $record = [
                        'id' => 'u-' . bin2hex(random_bytes(5)),
                        'username' => $username,
                        'name' => tickets_str($posted['name'] ?? '', 80) ?: $username,
                        'role' => $role,
                        'festivals' => $festivals,
                        'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
                        'mustChangePassword' => !empty($posted['mustChangePassword']),
                        'active' => $active,
                        'sessionVersion' => 1,
                        'createdAt' => tickets_now(),
                        'createdBy' => $user['username'],
                        'lastLoginAt' => null,
                    ];
                    $data['users'][] = $record;
                    return $record;
                }

                $record = &$data['users'][$index];
                if ($record['id'] === $user['id'] && ($role !== 'admin' || !$active)) {
                    throw new InvalidArgumentException('You cannot remove your own admin access.');
                }
                $kick = $record['role'] !== $role || $record['festivals'] !== $festivals || (bool) $record['active'] !== $active || $password !== '';
                $record['username'] = $username;
                $record['name'] = tickets_str($posted['name'] ?? '', 80) ?: $username;
                $record['role'] = $role;
                $record['festivals'] = $festivals;
                $record['active'] = $active;
                if ($password !== '') {
                    $record['passwordHash'] = password_hash($password, PASSWORD_DEFAULT);
                    $record['mustChangePassword'] = !empty($posted['mustChangePassword']);
                }
                if ($kick && $record['id'] !== $user['id']) {
                    $record['sessionVersion'] = (int) ($record['sessionVersion'] ?? 1) + 1;
                }
                $record['updatedAt'] = tickets_now();
                return $record;
            });
            tickets_audit($user, ($input['user']['id'] ?? '') === '' ? 'user created' : 'user updated', $saved['username'] . ' (' . $saved['role'] . ')');
            tix_json(200, tix_bootstrap($user));

        case 'user_delete':
            tix_require_role($user, ['admin']);
            $id = tickets_str($input['id'] ?? '', 40);
            if ($id === $user['id']) {
                tix_fail(400, 'You cannot delete your own account.');
            }
            $name = tickets_update('users', 'tickets_default_users', static function (array &$data) use ($id): string {
                foreach ($data['users'] as $i => $u) {
                    if ($u['id'] === $id) {
                        array_splice($data['users'], $i, 1);
                        return $u['username'];
                    }
                }
                throw new InvalidArgumentException('User not found.');
            });
            tickets_audit($user, 'user deleted', $name);
            tix_json(200, tix_bootstrap($user));
    }

    tix_fail(400, 'Unknown action.');
} catch (InvalidArgumentException $e) {
    tix_fail(400, $e->getMessage());
} catch (Throwable $e) {
    error_log('tickets-admin: ' . $e->getMessage());
    tix_fail(500, 'Something went wrong on the server. Please try again.');
}
