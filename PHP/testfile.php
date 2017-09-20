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

$options=new stdClass();
$options->limit=1;

$som=new zohodeskAPI('59550a0e2b1a864a31bef962363e029f',652853630);
$som->ticketTasks('215666000000154051',$options);




//echo substr($myn, 0, strlen($myn)-1);
?>
</pre>
        </div>
    </body>
    </html>