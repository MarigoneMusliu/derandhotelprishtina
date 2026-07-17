<?php
/**
 * Career open application → hr@derandhotel.com (with CV attachment).
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

function career_trim($value): string
{
    return trim((string) $value);
}

function career_json(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$honeypot = career_trim($_POST['botcheck'] ?? '');
if ($honeypot !== '') {
    career_json(200, ['success' => true, 'message' => 'Application received.']);
}

$firstName = career_trim($_POST['firstName'] ?? '');
$lastName = career_trim($_POST['lastName'] ?? '');
$email = career_trim($_POST['email'] ?? '');
$phone = career_trim($_POST['phone'] ?? '');
$department = career_trim($_POST['department'] ?? '');
$otherRole = career_trim($_POST['otherRole'] ?? $_POST['other_role'] ?? '');

if ($firstName === '' || $lastName === '' || $email === '' || $phone === '' || $department === '') {
    career_json(400, ['success' => false, 'message' => 'Please complete all required fields.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    career_json(400, ['success' => false, 'message' => 'Please enter a valid email address.']);
}

if (strcasecmp($department, 'Other') === 0 && $otherRole === '') {
    career_json(400, ['success' => false, 'message' => 'Please describe the role you are applying for.']);
}

if (!isset($_FILES['attachment']) || !is_array($_FILES['attachment'])) {
    career_json(400, ['success' => false, 'message' => 'Please upload your CV.']);
}

$file = $_FILES['attachment'];
if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    career_json(400, ['success' => false, 'message' => 'CV upload failed. Please try again.']);
}

$maxBytes = 5 * 1024 * 1024;
$size = (int) ($file['size'] ?? 0);
if ($size <= 0 || $size > $maxBytes) {
    career_json(400, ['success' => false, 'message' => 'Please upload a CV smaller than 5 MB.']);
}

$originalName = career_trim($file['name'] ?? 'cv');
$tmpPath = (string) ($file['tmp_name'] ?? '');
if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
    career_json(400, ['success' => false, 'message' => 'Invalid CV upload.']);
}

$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
$allowedExt = ['pdf', 'doc', 'docx'];
if (!in_array($ext, $allowedExt, true)) {
    career_json(400, ['success' => false, 'message' => 'CV must be a PDF or Word document.']);
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($tmpPath) ?: 'application/octet-stream';
$allowedMime = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream',
];
if (!in_array($mime, $allowedMime, true)) {
    // Soft check: some hosts report Word MIME inconsistently; extension already validated.
    if (!in_array($ext, $allowedExt, true)) {
        career_json(400, ['success' => false, 'message' => 'Unsupported CV file type.']);
    }
}

$roleLine = $department;
if (strcasecmp($department, 'Other') === 0) {
    $roleLine = 'Other — ' . $otherRole;
}

$to = 'hr@derandhotel.com';
$subject = 'Career application — ' . $roleLine . ' — ' . $firstName . ' ' . $lastName;
$subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$bodyText = implode("\r\n", [
    'New open application from derandhotel.com/careers.html',
    '',
    'Name: ' . $firstName,
    'Surname: ' . $lastName,
    'Email: ' . $email,
    'Phone: ' . $phone,
    'Department: ' . $department,
    'Applying for: ' . $roleLine,
    '',
    'Sent: ' . gmdate('Y-m-d H:i:s') . ' UTC',
]);

$fileData = file_get_contents($tmpPath);
if ($fileData === false) {
    career_json(500, ['success' => false, 'message' => 'Could not read the uploaded CV.']);
}

$boundary = '=_DerandCareer_' . bin2hex(random_bytes(12));
$safeFilename = preg_replace('/[^A-Za-z0-9._-]+/', '_', $originalName) ?: ('cv.' . $ext);

$headers = [
    'From: Derand Hotel Careers <noreply@derandhotel.com>',
    'Reply-To: ' . $firstName . ' ' . $lastName . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
    'X-Mailer: DerandHotelCareers/1.0',
];

$message = '';
$message .= '--' . $boundary . "\r\n";
$message .= "Content-Type: text/plain; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$message .= $bodyText . "\r\n\r\n";
$message .= '--' . $boundary . "\r\n";
$message .= 'Content-Type: ' . $mime . '; name="' . $safeFilename . "\"\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n";
$message .= 'Content-Disposition: attachment; filename="' . $safeFilename . "\"\r\n\r\n";
$message .= chunk_split(base64_encode($fileData)) . "\r\n";
$message .= '--' . $boundary . "--\r\n";

function career_formsubmit_ok(?array $json): bool
{
    if (!is_array($json)) {
        return false;
    }
    $success = $json['success'] ?? null;
    return $success === true || $success === 'true' || $success === 1 || $success === '1';
}

$formSubmitSent = false;
$formSubmitNeedsActivation = false;

if (function_exists('curl_init')) {
    $payload = [
        'name' => $firstName . ' ' . $lastName,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'department' => $department,
        'applying_for' => $roleLine,
        'message' => $bodyText,
        '_subject' => 'Career application — ' . $roleLine,
        '_template' => 'table',
        '_captcha' => 'false',
        'attachment' => new CURLFile($tmpPath, $mime, $safeFilename),
    ];

    $ch = curl_init('https://formsubmit.co/ajax/hr@derandhotel.com');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 45,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $raw = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $json = is_string($raw) ? json_decode($raw, true) : null;
    if ($status >= 200 && $status < 300 && career_formsubmit_ok($json)) {
        $formSubmitSent = true;
    } elseif (is_array($json) && isset($json['message']) && stripos((string) $json['message'], 'activat') !== false) {
        $formSubmitNeedsActivation = true;
    }
}

if ($formSubmitSent) {
    career_json(200, [
        'success' => true,
        'message' => 'Application sent successfully.',
    ]);
}

if ($formSubmitNeedsActivation) {
    career_json(503, [
        'success' => false,
        'message' => 'Please check hr@derandhotel.com and click the FormSubmit activation link once, then submit again.',
    ]);
}

// Fallback when FormSubmit is unavailable: PHP mail() with attachment.
$sent = @mail($to, $subject, $message, implode("\r\n", $headers));
if (!$sent) {
    career_json(500, [
        'success' => false,
        'message' => 'Could not send the application right now. Please email hr@derandhotel.com directly.',
    ]);
}

career_json(200, [
    'success' => true,
    'message' => 'Application sent successfully.',
]);
