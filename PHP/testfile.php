<html>
    
    <body>
        <div style="width:800px;">
<pre>
<?php

require_once 'ZohoDesk_API.php';

$me=new stdClass();
$me->accountName="Vijay's PHP ac";
$me->phone="2727982";
$me->email="vijayphp@php.net";

$som=new zohodeskAPI('59550a0e2b1a864a31bef962363e029f',652853630);
$som->createAccount($me);

$myn="1234567";
//echo substr($myn, 0, strlen($myn)-1);
?>
</pre>
        </div>
    </body>
    </html>