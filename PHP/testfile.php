<pre><code>
<?php

require_once 'ZohoDesk_API.php';

$som=new zohodeskAPI('59550a0e2b1a864a31bef962363e029f',652853630);
$som->createAccount(array('accountName'=>"hi"));

$myn="1234567";
//echo substr($myn, 0, strlen($myn)-1);
?>
</code></pre>