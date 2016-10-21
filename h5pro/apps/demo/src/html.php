<?php

$post = $_GET;
$html = '';
if(!empty($post) && isset($post['page']) &&!empty($post['page'])){
    $html = file_get_contents('./dom/'.$post['page'].'.html'.'?v='.$post['v']);
}
echo $html;
?>