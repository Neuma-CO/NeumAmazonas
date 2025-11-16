<?php
// ---------------------------------------------
// formulaire.php - Traitement + sécurités
// ---------------------------------------------
session_start();

/*
 * À configurer :
 */
$to = "neumamazonas.travel@gmail.com";          // <-- Ton email de réception
$subject = "Nouvelle demande de contact";
$timezone = "Europe/Paris";          // Ton fuseau horaire

// ---------------------------------------------
// 1) Préparation & Sécurité
// ---------------------------------------------
mb_internal_encoding("UTF-8");
date_default_timezone_set($timezone);

// Empêche l'accès direct en GET
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  exit("Method non autorized.");
}

// ---- Protection anti-robots ----

// 1. Honeypot
$honeypot = trim($_POST['website'] ?? ''); 
if ($honeypot !== '') {
  http_response_code(400);
  exit("Request refused");
}

// 2. Délai minimum (3 sec)
$form_ts = intval($_POST['form_ts'] ?? 0);
if ($form_ts <= 0 || (time() - $form_ts) < 3) {
  http_response_code(400);
  exit("⛔ Form sent too much fast.");
}

// 3. Limite d’IP (max 5 tentatives / heure)
$maxAttempts = 5;
$timeWindow  = 3600; // 1h
$ip = $_SERVER['REMOTE_ADDR'] ?? "0.0.0.0";

if (!isset($_SESSION['ip_log'])) {
  $_SESSION['ip_log'] = [];
}
$_SESSION['ip_log'] = array_filter($_SESSION['ip_log'], function($t) use ($timeWindow) {
  return $t > time() - $timeWindow;
});
if (count($_SESSION['ip_log']) >= $maxAttempts) {
  http_response_code(429);
  exit("⛔ Too much requests from your IP address. Try later.");
}
$_SESSION['ip_log'][] = time();

// ---------------------------------------------
// 2) Récupération + validation
// ---------------------------------------------
function clean($key, $default = '') {
  return trim(filter_input(INPUT_POST, $key, FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? $default);
}
function strip_newlines($s) {
  return str_replace(["\r","\n"], '', $s);
}

$nom        = clean('Nom');
$prenom     = clean('Prénom');
$email      = filter_input(INPUT_POST, 'Email', FILTER_VALIDATE_EMAIL);
$telephone  = clean('Téléphone');
$arrivee    = clean("Date_d_arrivee") ?: clean("Date d'arrivée");
$depart     = clean("Date_de_depart") ?: clean("Date de départ");
$pays       = clean('Pays');
$personnes  = intval($_POST['Nombre_de_personnes'] ?? $_POST['Nombre de personnes'] ?? 0);
$tour       = clean('Tour_souhaite') ?: clean('Tour souhaité');
$message    = trim($_POST['Message'] ?? '');

$errors = [];
if (!$nom)       $errors[] = "Second name is required.";
if (!$prenom)    $errors[] = "First name required.";
if (!$email)     $errors[] = "Insert a valid email address.";
if (!$telephone) $errors[] = "Insert a phone number.";
if (!$arrivee)   $errors[] = "Insert a date of arrival.";
if (!$depart)    $errors[] = "Insert a date of departure.";
if (!$pays)      $errors[] = "Country of arrival in mandatory.";
if ($personnes < 1) $errors[] = "There must at least be one person.";
if (!$tour)      $errors[] = "Please, select one of the tours.";

try {
  $today = new DateTime('today');
  $dArr  = new DateTime($arrivee);
  $dDep  = new DateTime($depart);
  if ($dArr < $today)  $errors[] = "Date of arrival must not be in the past.";
  if ($dDep < $today)  $errors[] = "Date of departure must not be in the past.";
  if ($dDep < $dArr)   $errors[] = "Date of departure must be after the date of arrival.";
} catch (Exception $e) {
  $errors[] = "Date form is invalid.";
}

if ($telephone && !preg_match('/^[0-9+\s().-]{6,}$/', $telephone)) {
  $errors[] = "Phone number is invalid.";
}

if (!empty($errors)) {
  http_response_code(422);
  echo "<h2>Mistakes in the filling of the form :</h2><ul>";
  foreach ($errors as $err) echo "<li>" . htmlspecialchars($err) . "</li>";
  echo "</ul><p><a href='javascript:history.back()'>Retour</a></p>";
  exit;
}

// ---------------------------------------------
// 3) Construction & envoi email
// ---------------------------------------------
$from = strip_newlines($email);
$headers = [
  "MIME-Version: 1.0",
  "Content-Type: text/plain; charset=UTF-8",
  "From: " . mb_encode_mimeheader("$prenom $nom", 'UTF-8') . " <{$from}>",
  "Reply-To: " . mb_encode_mimeheader("$prenom $nom", 'UTF-8') . " <{$from}>",
  "X-Mailer: PHP/" . phpversion()
];

$body  = "Nouvelle demande de contact :\n\n";
$body .= "Nom : $nom\nPrénom : $prenom\nEmail : $from\nTéléphone : $telephone\n";
$body .= "Arrivée : " . $dArr->format('Y-m-d') . "\n";
$body .= "Départ : " . $dDep->format('Y-m-d') . "\n";
$body .= "Pays : $pays\nPersonnes : $personnes\nTour souhaité : $tour\n\n";
$body .= "Message :\n$message\n\n";
$body .= "----\nIP: $ip\nDate envoi : " . date('Y-m-d H:i:s') . "\n";

$sent = @mail($to, mb_encode_mimeheader($subject, 'UTF-8'), $body, implode("\r\n", $headers));

if (!$sent) {
  http_response_code(500);
  echo "<h2>There was a mistake during the process.</h2><p>Please, try later.</p>";
  exit;
}

// ---------------------------------------------
// 4) Confirmation
// ---------------------------------------------
echo "<h2>Thank you, $prenom $nom ✅</h2>
<p>Your message was sent. You will soon hear from us.</p>
<p><a href='Anglais.html'>Back to the web page.</a></p>";
