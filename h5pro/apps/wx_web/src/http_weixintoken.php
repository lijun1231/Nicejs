<?php 
$share_url=trim($_GET['url']);
function get_url($url){
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$url");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPGET, true);
curl_setopt($ch, CURLOPT_HEADER, 0);
$output = curl_exec($ch);
curl_close($ch);
$result = json_decode(trim($output,chr(239).chr(187).chr(191)),true);
return $result;
}
$url= 'http://wxlk.chetuobang.com/web_weixinlukuang/index.php?c=js_sdk&m=wxlk_getJsApi_new&url='.$share_url;



echo json_encode(get_url($url));
?>