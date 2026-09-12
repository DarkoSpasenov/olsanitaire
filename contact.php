<?php
// Formulaire de contact OL Chauffage — PHP 7.4+
// Nécessite que la fonction mail() soit configurée par l'hébergeur.
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

function clean_text($value, $max = 3000) {
    $value = is_string($value) ? trim($value) : '';
    $value = str_replace(["\r\0", "\n\0"], '', $value);
    if (function_exists('mb_substr')) return mb_substr($value, 0, $max, 'UTF-8');
    return substr($value, 0, $max);
}

// Honeypot anti-spam : si rempli, on répond comme si tout allait bien.
if (!empty($_POST['website'] ?? '')) {
    echo json_encode(['ok' => true]);
    exit;
}

$name = clean_text($_POST['name'] ?? '', 120);
$phone = clean_text($_POST['phone'] ?? '', 40);
$email = clean_text($_POST['email'] ?? '', 160);
$service = clean_text($_POST['service'] ?? '', 80);
$message = clean_text($_POST['message'] ?? '', 3000);
$privacy = $_POST['privacy'] ?? '';

$allowedServices = ['Chauffage', 'Sanitaire', 'Ventilation', 'Dépannage sanitaire', 'Autre'];

if ($name === '' || $phone === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !in_array($service, $allowedServices, true) || $privacy !== '1') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Données incomplètes ou invalides.']);
    exit;
}

$to = 'olchauffage@gmail.com';
$host = preg_replace('/[^a-z0-9.-]/i', '', $_SERVER['HTTP_HOST'] ?? 'olchauffage.com');
$host = preg_replace('/^www\./i', '', $host);
if ($host === '' || strpos($host, '.') === false) $host = 'olchauffage.com';

$subject = 'Nouvelle demande de devis — ' . $service;
if (function_exists('mb_encode_mimeheader')) {
    $encodedSubject = mb_encode_mimeheader($subject, 'UTF-8');
} else {
    $encodedSubject = $subject;
}

$body = "Nouvelle demande depuis le site OL Chauffage\n\n";
$body .= "Nom : {$name}\n";
$body .= "Téléphone : {$phone}\n";
$body .= "E-mail : {$email}\n";
$body .= "Service : {$service}\n\n";
$body .= "Message :\n{$message}\n\n";
$body .= "---\nEnvoyé le " . date('d.m.Y à H:i') . " depuis " . ($_SERVER['REMOTE_ADDR'] ?? 'IP inconnue') . "\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: Site OL Chauffage <no-reply@' . $host . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$sent = @mail($to, $encodedSubject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Le serveur n’a pas confirmé l’envoi.']);
    exit;
}

echo json_encode(['ok' => true]);
