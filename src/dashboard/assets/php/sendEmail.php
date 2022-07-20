<?php
if ($_REQUEST) {
    $name = $_REQUEST['name'];
    $email = $_REQUEST['email'];
    $message = $_REQUEST['message'];

    //send email

    $response_array['status'] = 'success'; 

    if(mail("ilia.m.composer@gmail.com", "My Subject:", $email, $message)){
        echo json_encode($response_array);
    }
    else{
        echo json_encode($response_array);
    }
}
else{
    echo 'error';
}
