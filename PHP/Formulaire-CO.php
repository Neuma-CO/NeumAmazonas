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
  exit("Método no autorizado.");
}

// ---- Protection anti-robots ----

// 1. Honeypot
$honeypot = trim($_POST['website'] ?? ''); 
if ($honeypot !== '') {
  http_response_code(400);
  exit("Solicitud rechazada");
}

// 2. Délai minimum (3 sec)
$form_ts = intval($_POST['form_ts'] ?? 0);
if ($form_ts <= 0 || (time() - $form_ts) < 3) {
  http_response_code(400);
  exit("⛔ Formulario enviado demasiado rápido.");
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
  exit("⛔ Demasiadas solicitudes desde su dirección IP. Intente más tarde.");
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
if (!$nom)       $errors[] = "El apellido es obligatorio.";
if (!$prenom)    $errors[] = "El nombre es obligatorio.";
if (!$email)     $errors[] = "Introduzca una dirección de correo electrónico válida.";
if (!$telephone) $errors[] = "Introduzca un número de teléfono.";
if (!$arrivee)   $errors[] = "Introduzca una fecha de llegada.";
if (!$depart)    $errors[] = "Introduzca una fecha de salida.";
if (!$pays)      $errors[] = "El país de llegada es obligatorio.";
if ($personnes < 1) $errors[] = "Debe haber al menos una persona.";
if (!$tour)      $errors[] = "Por favor, seleccione uno de los tours.";

try {
  $today = new DateTime('today');
  $dArr  = new DateTime($arrivee);
  $dDep  = new DateTime($depart);
  if ($dArr < $today)  $errors[] = "La fecha de llegada no debe estar en el pasado.";
  if ($dDep < $today)  $errors[] = "La fecha de salida no debe estar en el pasado.";
  if ($dDep < $dArr)   $errors[] = "La fecha de salida debe ser posterior a la fecha de llegada.";
} catch (Exception $e) {
  $errors[] = "El formulario de fecha no es válido.";
}

if ($telephone && !preg_match('/^[0-9+\s().-]{6,}$/', $telephone)) {
  $errors[] = "El número de teléfono no es válido.";
}

if (!empty($errors)) {
  http_response_code(422);
  echo "<h2>Errores en el llenado del formulario :</h2><ul>";
  foreach ($errors as $err) echo "<li>" . htmlspecialchars($err) . "</li>";
  echo "</ul><p><a href='javascript:history.back()'>Volver</a></p>";
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

$body  = "Nueva solicitud de contacto :\n\n";
$body .= "Apellido: $nom\nNombre: $prenom\nEmail: $from\nTeléfono: $telephone\n";
$body .= "Llegada: " . $dArr->format('Y-m-d') . "\n";
$body .= "Salida: " . $dDep->format('Y-m-d') . "\n";
$body .= "País: $pays\nPersonas: $personnes\nTour deseado: $tour\n\n";
$body .= "Mensaje:\n$message\n\n";
$body .= "----\nIP: $ip\nFecha de envío: " . date('Y-m-d H:i:s') . "\n";

$sent = @mail($to, mb_encode_mimeheader($subject, 'UTF-8'), $body, implode("\r\n", $headers));

if (!$sent) {
  http_response_code(500);
  echo "<h2>Hubo un error durante el proceso.</h2><p>Por favor, intente más tarde.</p>";
  exit;
}

// ---------------------------------------------
// 4) Confirmation
// ---------------------------------------------
echo "<h2>Gracias, $prenom $nom ✅</h2>
<p>Su mensaje ha sido enviado. Pronto nos pondremos en contacto con usted.</p>
<p><a href='Anglais.html'>Volver a la página web.</a></p>";
