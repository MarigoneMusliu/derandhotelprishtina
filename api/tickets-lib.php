<?php

declare(strict_types=1);

/*
 * Festival ticket store shared by the admin panel (tickets-admin.php), the public
 * ticket list (tickets-public.php) and the RaiAccept checkout (raiaccept-lib.php).
 * Data lives in api/_storage/tickets/*.json, which is never part of the upload zip.
 */

const TICKETS_PENDING_HOLD_SECONDS = 1800;
const TICKETS_SESSION_NAME = 'DERANDTIX';
const TICKETS_SESSION_IDLE_SECONDS = 43200;
const TICKETS_LOGIN_MAX_FAILS = 8;
const TICKETS_LOGIN_WINDOW_SECONDS = 900;
const TICKETS_ROLES = ['admin', 'staff', 'partner'];
const TICKETS_BADGE_STYLES = ['rose', 'cyan', 'purple', 'emerald'];
const TICKETS_PAYMENT_METHODS = ['online', 'cash', 'card', 'bank', 'complimentary'];

function tickets_storage_dir(): string
{
    return __DIR__ . '/_storage/tickets';
}

function tickets_ensure_storage(): void
{
    $dir = tickets_storage_dir();
    if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
        throw new RuntimeException('Ticket storage folder could not be created.');
    }
    $guard = $dir . '/.htaccess';
    if (!is_file($guard)) {
        @file_put_contents($guard, "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n");
    }
}

function tickets_path(string $name): string
{
    return tickets_storage_dir() . '/' . $name . '.json';
}

function tickets_decode(string $raw): ?array
{
    if (trim($raw) === '') {
        return null;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : null;
}

function tickets_encode(array $data): string
{
    return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

/* Shared-lock read. Returns $default() when the file does not exist yet. */
function tickets_read(string $name, callable $default): array
{
    $path = tickets_path($name);
    if (!is_file($path)) {
        return $default();
    }
    $handle = @fopen($path, 'rb');
    if ($handle === false) {
        return $default();
    }
    flock($handle, LOCK_SH);
    $raw = stream_get_contents($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return tickets_decode(is_string($raw) ? $raw : '') ?? $default();
}

/*
 * Exclusive read-modify-write. $fn receives the data by reference and may return a value.
 * The previous version is kept as <name>.bak.json so one bad save can always be undone.
 */
function tickets_update(string $name, callable $default, callable $fn)
{
    tickets_ensure_storage();
    $path = tickets_path($name);
    $handle = @fopen($path, 'c+b');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        throw new RuntimeException('Ticket storage is not writable.');
    }
    try {
        $raw = stream_get_contents($handle);
        $raw = is_string($raw) ? $raw : '';
        $data = tickets_decode($raw) ?? $default();
        $result = $fn($data);
        $encoded = tickets_encode($data);
        if ($encoded !== $raw) {
            if (trim($raw) !== '') {
                @file_put_contents(tickets_storage_dir() . '/' . $name . '.bak.json', $raw, LOCK_EX);
            }
            rewind($handle);
            ftruncate($handle, 0);
            fwrite($handle, $encoded);
            fflush($handle);
        }
        return $result;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function tickets_now(): string
{
    return gmdate('c');
}

function tickets_id(string $prefix): string
{
    return $prefix . '-' . gmdate('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
}

function tickets_str($value, int $max = 200): string
{
    $s = is_scalar($value) ? trim((string) $value) : '';
    $s = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $s) ?? '';
    return function_exists('mb_substr') ? mb_substr($s, 0, $max) : substr($s, 0, $max);
}

function tickets_slug($value): string
{
    $s = strtolower(tickets_str($value, 60));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
    return trim($s, '-');
}

/* ------------------------------------------------------------------ Festivals */

function tickets_default_festivals(): array
{
    $unsplash = static function (string $id): string {
        return 'https://images.unsplash.com/' . $id . '?auto=format&fit=crop&w=1200&q=80';
    };
    $tier = static function (string $key, string $label, string $note, float $price): array {
        return ['key' => $key, 'label' => $label, 'note' => $note, 'price' => $price, 'capacity' => null, 'active' => true];
    };
    $festival = static function (array $f) {
        return $f + ['active' => true, 'salesOpen' => true, 'organizer' => '', 'organizerEmail' => '', 'organizerPhone' => '', 'createdAt' => tickets_now()];
    };

    return [
        'transferPrice' => 25.0,
        'festivals' => [
            $festival([
                'id' => 'sunnyhill', 'name' => 'Sunny Hill Festival', 'city' => 'Prishtina', 'month' => 7,
                'dates' => '30 Jul – 1 Aug 2027', 'days' => 3, 'nights' => 3, 'genre' => 'Pop · Hip-hop · Electronic',
                'img' => $unsplash('photo-1501281668745-f7f57925c3b4'),
                'badge' => ['text' => 'Selling Fast', 'style' => 'rose', 'icon' => 'flame'],
                'tiers' => [
                    $tier('regular', 'Regular', '3-day pass · all stages', 195),
                    $tier('vip-c4', 'VIP C4 Stage', '3-day pass · C4 VIP area', 400),
                    $tier('vip-main', 'VIP Sunny Hill Stage', '3-day pass · main-stage VIP platform', 500),
                    $tier('vip-bundle', 'VIP Bundle', '3-day pass · both VIP areas', 800),
                ],
            ]),
            $festival([
                'id' => 'dokufest', 'name' => 'DokuFest', 'city' => 'Prizren', 'month' => 8,
                'dates' => '6 – 14 Aug 2027', 'days' => 9, 'nights' => 9, 'genre' => 'Documentary film · Live music',
                'img' => $unsplash('photo-1489599849927-2ee91cede3ba'),
                'badge' => ['text' => 'Festival Pass', 'style' => 'cyan', 'icon' => 'film'],
                'tiers' => [
                    $tier('film', 'Film Pass', '10 film screenings', 25),
                    $tier('night', 'DokuNight Pass', '4 DokuNight music events', 25),
                    $tier('both', 'Film + DokuNight Pass', '10 films + 4 DokuNights', 50),
                ],
            ]),
            $festival([
                'id' => 'jazz', 'name' => 'Prishtina Jazz Festival', 'city' => 'Prishtina', 'month' => 11,
                'dates' => 'Mid-November 2027', 'days' => 5, 'nights' => 5, 'genre' => 'Jazz · Soul · World',
                'img' => $unsplash('photo-1514525253161-7a46d19cd819'),
                'badge' => ['text' => 'Intimate Venues', 'style' => 'purple', 'icon' => 'music'],
                'tiers' => [
                    $tier('concert', 'Concert Ticket', 'One evening concert', 10),
                    $tier('headliner', 'Headliner Concert', 'International headliner night', 15),
                    $tier('all', 'All-Concerts Pass', 'All 7 concerts · jam sessions free', 80),
                ],
            ]),
            $festival([
                'id' => 'unum', 'name' => 'UNUM Festival', 'city' => 'Shëngjin, Albania', 'month' => 6,
                'dates' => '3 – 7 Jun 2027', 'days' => 5, 'nights' => 5, 'genre' => 'Techno · House',
                'img' => $unsplash('photo-1540039155733-5bb30b53aa14'),
                'badge' => ['text' => 'Selling Fast', 'style' => 'rose', 'icon' => 'flame'],
                'tiers' => [
                    $tier('pass', 'Full Festival Pass', 'All days · unlimited re-entry', 117),
                    $tier('vip', 'VIP Festival Pass', 'Full pass + VIP stage upgrade', 217),
                ],
            ]),
            $festival([
                'id' => 'kala', 'name' => 'Kala Festival', 'city' => 'Dhërmi, Albania', 'month' => 6,
                'dates' => '2 – 9 Jun 2027', 'days' => 7, 'nights' => 7, 'genre' => 'House · Disco · Balearic',
                'img' => $unsplash('photo-1533174072545-7a4b6ad7a6c3'),
                'badge' => ['text' => 'Locals Ticket', 'style' => 'emerald', 'icon' => 'badge-check'],
                'tiers' => [
                    $tier('local', 'Full-Week Local Wristband', 'Kosovo / Albania / N. Macedonia / Montenegro ID required', 55),
                ],
            ]),
        ],
    ];
}

function tickets_catalog(): array
{
    return tickets_read('festivals', 'tickets_default_festivals');
}

function tickets_find_festival(array $catalog, string $id): ?array
{
    foreach ($catalog['festivals'] ?? [] as $festival) {
        if (($festival['id'] ?? '') === $id) {
            return $festival;
        }
    }
    return null;
}

function tickets_find_tier(array $festival, string $key): ?array
{
    foreach ($festival['tiers'] ?? [] as $tier) {
        if (($tier['key'] ?? '') === $key) {
            return $tier;
        }
    }
    return null;
}

/* Validates a festival posted by the admin form and returns the clean record. */
function tickets_clean_festival(array $in, ?array $existing): array
{
    $id = $existing['id'] ?? tickets_slug($in['id'] ?? ($in['name'] ?? ''));
    $name = tickets_str($in['name'] ?? '', 80);
    if ($name === '') {
        throw new InvalidArgumentException('Festival name is required.');
    }
    if ($id === '') {
        throw new InvalidArgumentException('Festival ID is required (letters, numbers and dashes).');
    }

    $nights = max(1, min(30, (int) ($in['nights'] ?? 1)));
    $days = max(1, min(30, (int) ($in['days'] ?? $nights)));
    $month = (int) ($in['month'] ?? 0);
    $badge = is_array($in['badge'] ?? null) ? $in['badge'] : [];
    $style = in_array($badge['style'] ?? '', TICKETS_BADGE_STYLES, true) ? $badge['style'] : 'purple';

    $tiers = [];
    $keys = [];
    foreach (is_array($in['tiers'] ?? null) ? $in['tiers'] : [] as $t) {
        if (!is_array($t)) {
            continue;
        }
        $label = tickets_str($t['label'] ?? '', 80);
        if ($label === '') {
            continue;
        }
        $key = tickets_slug(($t['key'] ?? '') !== '' ? $t['key'] : $label);
        if ($key === '' || isset($keys[$key])) {
            throw new InvalidArgumentException('Every ticket type needs a unique code ("' . $label . '").');
        }
        $price = round((float) ($t['price'] ?? 0), 2);
        if ($price < 0 || $price > 100000) {
            throw new InvalidArgumentException('Price for "' . $label . '" is not valid.');
        }
        $capacityRaw = $t['capacity'] ?? null;
        $capacity = ($capacityRaw === null || $capacityRaw === '') ? null : max(0, (int) $capacityRaw);
        $keys[$key] = true;
        $tiers[] = [
            'key' => $key,
            'label' => $label,
            'note' => tickets_str($t['note'] ?? '', 160),
            'price' => $price,
            'capacity' => $capacity,
            'active' => !isset($t['active']) || (bool) $t['active'],
        ];
    }
    if ($tiers === []) {
        throw new InvalidArgumentException('Add at least one ticket type.');
    }

    $email = tickets_str($in['organizerEmail'] ?? '', 120);
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Organizer email is not valid.');
    }

    return [
        'id' => $id,
        'name' => $name,
        'city' => tickets_str($in['city'] ?? '', 80),
        'month' => ($month >= 1 && $month <= 12) ? $month : 0,
        'dates' => tickets_str($in['dates'] ?? '', 80),
        'days' => $days,
        'nights' => $nights,
        'genre' => tickets_str($in['genre'] ?? '', 120),
        'img' => tickets_str($in['img'] ?? '', 500),
        'badge' => [
            'text' => tickets_str($badge['text'] ?? '', 40),
            'style' => $style,
            'icon' => tickets_slug($badge['icon'] ?? '') ?: 'ticket',
        ],
        'active' => !empty($in['active']),
        'salesOpen' => !empty($in['salesOpen']),
        'organizer' => tickets_str($in['organizer'] ?? '', 120),
        'organizerEmail' => $email,
        'organizerPhone' => tickets_str($in['organizerPhone'] ?? '', 40),
        'tiers' => $tiers,
        'createdAt' => $existing['createdAt'] ?? tickets_now(),
        'updatedAt' => tickets_now(),
    ];
}

/* --------------------------------------------------------------------- Orders */

function tickets_default_orders(): array
{
    return ['orders' => [], 'deliveries' => []];
}

function tickets_orders(): array
{
    return tickets_read('orders', 'tickets_default_orders');
}

function tickets_order_is_holding(array $order, int $now): bool
{
    if (($order['status'] ?? '') !== 'pending') {
        return false;
    }
    $created = strtotime((string) ($order['createdAt'] ?? '')) ?: 0;
    return $now - $created < TICKETS_PENDING_HOLD_SECONDS;
}

/*
 * Per festival and ticket type: sold (paid), held (unpaid checkout in progress),
 * received from the organizer, handed to guests, ticket revenue.
 */
function tickets_stats(array $catalog, array $store): array
{
    $now = time();
    $stats = [];
    foreach ($catalog['festivals'] ?? [] as $f) {
        $tiers = [];
        foreach ($f['tiers'] ?? [] as $t) {
            $tiers[$t['key']] = ['sold' => 0, 'held' => 0, 'received' => 0, 'collected' => 0, 'revenue' => 0.0, 'orders' => 0];
        }
        $stats[$f['id']] = ['tiers' => $tiers];
    }

    foreach ($store['orders'] ?? [] as $o) {
        $fid = $o['festivalId'] ?? '';
        $key = $o['tierKey'] ?? '';
        if (!isset($stats[$fid]['tiers'][$key])) {
            if (!isset($stats[$fid])) {
                continue;
            }
            $stats[$fid]['tiers'][$key] = ['sold' => 0, 'held' => 0, 'received' => 0, 'collected' => 0, 'revenue' => 0.0, 'orders' => 0];
        }
        $row = &$stats[$fid]['tiers'][$key];
        $qty = (int) ($o['quantity'] ?? 0);
        if (($o['status'] ?? '') === 'paid') {
            $row['sold'] += $qty;
            $row['orders']++;
            $row['revenue'] += (float) ($o['unitPrice'] ?? 0) * $qty;
            if (!empty($o['collected'])) {
                $row['collected'] += $qty;
            }
        } elseif (tickets_order_is_holding($o, $now)) {
            $row['held'] += $qty;
        }
        unset($row);
    }

    foreach ($store['deliveries'] ?? [] as $d) {
        $fid = $d['festivalId'] ?? '';
        $key = $d['tierKey'] ?? '';
        if (isset($stats[$fid]['tiers'][$key])) {
            $stats[$fid]['tiers'][$key]['received'] += (int) ($d['quantity'] ?? 0);
        }
    }

    foreach ($catalog['festivals'] ?? [] as $f) {
        $total = ['sold' => 0, 'held' => 0, 'received' => 0, 'collected' => 0, 'revenue' => 0.0, 'orders' => 0, 'toBring' => 0, 'readyAtHotel' => 0];
        foreach ($stats[$f['id']]['tiers'] as $key => &$row) {
            $tier = tickets_find_tier($f, (string) $key);
            $capacity = $tier['capacity'] ?? null;
            $row['capacity'] = $capacity;
            $row['remaining'] = $capacity === null ? null : max(0, (int) $capacity - $row['sold'] - $row['held']);
            $row['toBring'] = max(0, $row['sold'] - $row['received']);
            $row['readyAtHotel'] = max(0, min($row['received'], $row['sold']) - $row['collected']);
            $row['revenue'] = round($row['revenue'], 2);
            foreach (['sold', 'held', 'received', 'collected', 'revenue', 'orders', 'toBring', 'readyAtHotel'] as $k) {
                $total[$k] += $row[$k];
            }
        }
        unset($row);
        $total['revenue'] = round($total['revenue'], 2);
        $stats[$f['id']]['total'] = $total;
    }

    return $stats;
}

/* How many tickets of a type can still be sold (null = no limit set). */
function tickets_available(string $festivalId, string $tierKey): ?int
{
    $catalog = tickets_catalog();
    $stats = tickets_stats($catalog, tickets_orders());
    return $stats[$festivalId]['tiers'][$tierKey]['remaining'] ?? null;
}

/* Called by the RaiAccept checkout once the payment session exists. */
function tickets_record_online_order(array $record): void
{
    tickets_update('orders', 'tickets_default_orders', static function (array &$data) use ($record): void {
        foreach ($data['orders'] as $o) {
            if (($o['id'] ?? '') === $record['id']) {
                return;
            }
        }
        $data['orders'][] = $record + [
            'source' => 'online',
            'paymentMethod' => 'online',
            'status' => 'pending',
            'collected' => false,
            'collectedAt' => null,
            'collectedBy' => '',
            'note' => '',
            'createdAt' => tickets_now(),
            'paidAt' => null,
        ];
    });
}

/* Moves an online order to paid / failed / cancelled. Paid is final (never downgraded by a late status). */
function tickets_set_payment_status(string $reference, string $status, array $meta = []): bool
{
    if ($reference === '' || !in_array($status, ['paid', 'failed', 'cancelled'], true)) {
        return false;
    }
    if (!is_file(tickets_path('orders'))) {
        return false;
    }
    return (bool) tickets_update('orders', 'tickets_default_orders', static function (array &$data) use ($reference, $status, $meta): bool {
        foreach ($data['orders'] as &$o) {
            if (($o['id'] ?? '') !== $reference) {
                continue;
            }
            $current = $o['status'] ?? '';
            if (in_array($current, ['paid', 'refunded'], true) || ($status !== 'paid' && $current !== 'pending')) {
                return false;
            }
            $o['status'] = $status;
            if ($status === 'paid') {
                $o['paidAt'] = tickets_now();
                if (!empty($meta['transactionId'])) {
                    $o['transactionId'] = tickets_str($meta['transactionId'], 80);
                }
            }
            $o['updatedAt'] = tickets_now();
            return true;
        }
        return false;
    });
}

function tickets_is_ticket_reference(string $reference): bool
{
    $ref = strtoupper(trim($reference));
    return strpos($ref, 'TICKETS-') === 0 || strpos($ref, 'TICKETS_') === 0;
}

/* ------------------------------------------------------------- Users & login */

function tickets_default_users(): array
{
    return [
        'users' => [[
            'id' => 'u-admin',
            'username' => 'admin',
            'name' => 'Hotel Admin',
            'role' => 'admin',
            'festivals' => [],
            'passwordHash' => password_hash('1234', PASSWORD_DEFAULT),
            'mustChangePassword' => true,
            'active' => true,
            'sessionVersion' => 1,
            'createdAt' => tickets_now(),
            'lastLoginAt' => null,
        ]],
    ];
}

function tickets_users(): array
{
    return tickets_read('users', 'tickets_default_users');
}

function tickets_public_user(array $u): array
{
    return [
        'id' => $u['id'],
        'username' => $u['username'],
        'name' => $u['name'] ?? $u['username'],
        'role' => $u['role'],
        'festivals' => array_values($u['festivals'] ?? []),
        'active' => !empty($u['active']),
        'mustChangePassword' => !empty($u['mustChangePassword']),
        'createdAt' => $u['createdAt'] ?? null,
        'lastLoginAt' => $u['lastLoginAt'] ?? null,
    ];
}

function tickets_password_problem(string $password, string $username): ?string
{
    if (strlen($password) < 8) {
        return 'Password must be at least 8 characters.';
    }
    if (strcasecmp($password, $username) === 0 || in_array(strtolower($password), ['12345678', 'password', 'derand123', 'admin1234'], true)) {
        return 'Please choose a less obvious password.';
    }
    return null;
}

function tickets_client_ip(): string
{
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 0, 64);
}

function tickets_login_blocked(string $ip): int
{
    $data = tickets_read('login-attempts', static fn(): array => []);
    $cutoff = time() - TICKETS_LOGIN_WINDOW_SECONDS;
    $recent = array_filter($data[$ip] ?? [], static fn($t): bool => (int) $t > $cutoff);
    if (count($recent) < TICKETS_LOGIN_MAX_FAILS) {
        return 0;
    }
    return max(60, min($recent) + TICKETS_LOGIN_WINDOW_SECONDS - time());
}

function tickets_login_failed(string $ip): void
{
    tickets_update('login-attempts', static fn(): array => [], static function (array &$data) use ($ip): void {
        $cutoff = time() - TICKETS_LOGIN_WINDOW_SECONDS;
        foreach ($data as $key => $times) {
            $data[$key] = array_values(array_filter((array) $times, static fn($t): bool => (int) $t > $cutoff));
            if ($data[$key] === []) {
                unset($data[$key]);
            }
        }
        $data[$ip][] = time();
    });
}

function tickets_login_cleared(string $ip): void
{
    if (!is_file(tickets_path('login-attempts'))) {
        return;
    }
    tickets_update('login-attempts', static fn(): array => [], static function (array &$data) use ($ip): void {
        unset($data[$ip]);
    });
}

/* -------------------------------------------------------------------- Audit */

function tickets_audit(array $user, string $action, string $details = ''): void
{
    try {
        tickets_update('audit', static fn(): array => ['entries' => []], static function (array &$data) use ($user, $action, $details): void {
            $data['entries'][] = [
                'at' => tickets_now(),
                'user' => $user['username'] ?? 'system',
                'action' => $action,
                'details' => tickets_str($details, 300),
            ];
            if (count($data['entries']) > 2000) {
                $data['entries'] = array_slice($data['entries'], -2000);
            }
        });
    } catch (Throwable $e) {
        // The audit trail must never block the action itself.
    }
}
