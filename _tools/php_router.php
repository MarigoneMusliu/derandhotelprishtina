<?php
// Local PHP preview with the API working: php -S 127.0.0.1:8766 -t . _tools/php_router.php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pages = ['/TicketsAdmin' => 'ticketsadmin.html', '/Derandtickets' => 'derandtickets.html'];
if (isset($pages[$path])) {
    header('Content-Type: text/html; charset=utf-8');
    readfile(dirname(__DIR__) . '/' . $pages[$path]);
    return true;
}
return false;
