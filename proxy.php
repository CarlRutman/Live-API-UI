<?PHP
  $url = 'http://api.brightcove.com/services/post';
  
  //open connection
  $ch = curl_init($url);
  
  //set the url, number of POST vars, POST data
  curl_setopt($ch,CURLOPT_POST, 1);
  curl_setopt($ch,CURLOPT_POSTFIELDS, 'json=' . stripslashes($_POST['json']));
  curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
  
  // Enable for Charles debugging
  //curl_setopt($ch,CURLOPT_PROXY, '127.0.0.1:8888'); 
  
  $result = curl_exec($ch);
  curl_close($ch);
  
  print $result;
?>
