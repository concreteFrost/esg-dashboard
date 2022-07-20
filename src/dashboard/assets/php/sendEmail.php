<?php
if($_POST){
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

//send email
    mail("ilia.m.composer@gmail.com","My Subject:",$email,$message);
}
?>