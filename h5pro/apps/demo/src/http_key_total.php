<?php 
$share_url=$_POST;
$url= 'http://wxlk.chetuobang.com/web_weixinlukuang/index.php?c=edog&m=xxx';
echo json_encode(callHttpPost($url,$share_url));
function callHttpPost($url, $params = null) {
	$header = array (
			"Content-Type: application/x-www-form-urlencoded;"
	);
	$post_url = '';
// 	$params ['app_id'] = 1;
	foreach ( $params as $key => $value )
		$post_url .= $key . '=' . $value . '&';
	$post_url = rtrim ( $post_url, '&' );
	$result = callHttpCommon ( $url, 'POST', '', $post_url, $header, 'gzip' );
	return $result = json_decode ( $result, true );
}
function callHttpCommon($url, $type = 'GET', $useragent = '', $params = null, $header = '', $encoding = '', $referer = '', $cookie = '') {
	$ch = curl_init ();

	$timeout = 10;
	curl_setopt ( $ch, CURLOPT_URL, $url );
	if ('' != $useragent) {
		curl_setopt ( $ch, CURLOPT_USERAGENT, $useragent );
	}

	curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, $timeout );
	curl_setopt ( $ch, CURLOPT_TIMEOUT, $timeout );
	if ('' != $encoding) {
		curl_setopt ( $ch, CURLOPT_ENCODING, $encoding );
	}

	if ('' != $header) {
		curl_setopt ( $ch, CURLOPT_HTTPHEADER, $header );
	}
	if (null != $params) {
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, $params );
	}
	if ('' != $referer) {
		curl_setopt ( $ch, CURLOPT_REFERER, $referer );
	}
	if ('' != $cookie) {
		curl_setopt ( $ch, CURLOPT_COOKIE, $cookie );
	}

	switch ($type) {
		case "GET" :
			curl_setopt ( $ch, CURLOPT_HTTPGET, true );
			break;
		case "POST" :
			curl_setopt ( $ch, CURLOPT_POST, true );
			break;
		case "PUT" :
			curl_setopt ( $ch, CURLOPT_CUSTOMREQUEST, "PUT" );
			break;
		case "DELETE" :
			curl_setopt ( $ch, CURLOPT_CUSTOMREQUEST, "DELETE" );
			break;
	}
	$result = curl_exec ( $ch );
	$curl_errno = curl_errno ( $ch );
	curl_close ( $ch );
	if ($curl_errno > 0) {
		return false;
	}
	return $result;
}



?>