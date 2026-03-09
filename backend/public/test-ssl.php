<?php
echo "<h2>SSL Configuration Test</h2>";
echo "curl.cainfo = " . ini_get('curl.cainfo') . "<br>";
echo "File exists: " . (file_exists(ini_get('curl.cainfo')) ? 'YES' : 'NO') . "<br>";
echo "File readable: " . (is_readable(ini_get('curl.cainfo')) ? 'YES' : 'NO') . "<br>";
echo "File size: " . filesize(ini_get('curl.cainfo')) . " bytes<br>";

echo "<h2>cURL Version</h2>";
$curl_version = curl_version();
echo "Version: " . $curl_version['version'] . "<br>";
echo "SSL Version: " . $curl_version['ssl_version'] . "<br>";

echo "<h2>Test SSL Connection</h2>";
$ch = curl_init('https://api.cloudinary.com');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_VERBOSE, true);
$response = curl_exec($ch);
$error = curl_error($ch);
$info = curl_getinfo($ch);
curl_close($ch);

if ($error) {
    echo "<span style='color:red'>❌ Connection Failed: $error</span><br>";
} else {
    echo "<span style='color:green'>✅ Connection Successful!</span><br>";
    echo "HTTP Code: " . $info['http_code'] . "<br>";
}
?>