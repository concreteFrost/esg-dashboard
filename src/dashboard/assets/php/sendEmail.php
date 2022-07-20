<?php
if ($_POST) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    //send email

    $response_array['status'] = 'success'; 

    if(mail("ilia.m.composer@gmail.com", "My Subject:", $email, $message)){
        echo json_encode($response_array);
    }
    else{
        echo json_encode($response_array);
    }
}
