<?php

if(!empty($_POST)) {
  $name = $_POST['name'];
  $email = $_POST['email'];
  $body = $_POST['body'];

  if (!empty($name) && !empty($email) && !empty($body)) {


    $to = "mattmammanoweb@gmail.com";
    $subject = "MATT MAMMANO - CONTACT!!!!!!!!!!!!!!!!!!!!!!!";
    $body = wordwrap($body, 70, "\r\n");
    $body = "Name: $name\nEmail: $email\n\n\n$body";

    mail($to, $subject, $body);

    echo "<meta http-equiv=\"refresh\" content=\".1;url=index.php\">";
  }
  else die("ERROR: invalid contact information entered, please try again");
}
else die("ERROR: no contact information entered, please try again");

?>
