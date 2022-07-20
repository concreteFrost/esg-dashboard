
<?php
header('Content-Type: application/json; charset=UTF-8');

$uName = $_REQUEST['name'];
$uEmail = $_REQUEST['email'];

$body = $_REQUEST['message'];

if (!filter_var($uEmail, FILTER_VALIDATE_EMAIL)) {

    echo '*Invalid email format';
    exit;
}
if (empty($uName) || empty($uEmail) || empty($body)) {

    echo '*Please fill all required fields.';
    exit;
}

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n";
$headers .= "From: " . $uEmail . "\r\n" .
    "Reply-To: " . $uEmail . "\r\n" .
    "X-Mailer: PHP/" . phpversion();

$mail = 'ilia.m.composer@gmail.com';

if (mail($mail,'sbj', $body, $headers)) {

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";

    echo json_encode($output);

} else {
    echo 'Unable to send email';
}