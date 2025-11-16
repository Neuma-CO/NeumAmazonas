<?php
if (!isset($_POST['token'])) {
    echo json_encode(["success" => false, "error" => "No token"]);
    exit;
}

$token = $_POST['token'];
$secretKey = "https://www.google.com/recaptcha/api.js?render=6LfR8fYrAAAAAMdgJgRxW9wZjnk8aMQdRI6GdfSd"; // Ta clé secrète fournie par Google

// Vérification auprès de Google
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'secret' => $secretKey,
    'response' => $token
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

// Retourne au client si c'est un humain ou un bot
echo json_encode($result);
