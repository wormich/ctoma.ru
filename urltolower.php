<?php
/**
 * Created by PhpStorm.
 * User: user848
 * Date: 20.07.2018
 * Time: 11:38
 */

if(isset($_GET['rewrite-strtolower-url'])) {
    $url = $_GET['rewrite-strtolower-url'];
    unset($_GET['rewrite-strtolower-url']);
    $params = http_build_query($_GET);
    if(strlen($params)) {
        $params = '?' . $params;
    }
	if (substr($url,-1,1)=='/'){

		$url=substr($url,0,strlen($url)-1);


	}

	if (strpos($url,'entity_reference_autocomplete')==false){
	      // if you don't have SSL/a security certificate at the destination change https:// to http:// below
    header('Location: https://' . $_SERVER['HTTP_HOST'] . '/' . strtolower($url) . $params, true, 301);
    exit;

	}

}
header("HTTP/1.0 404 Not Found");
die('Unable to convert the URL to lowercase. You must supply a URL to work upon.');
