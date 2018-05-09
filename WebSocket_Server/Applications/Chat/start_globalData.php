<?php
use Workerman\Worker;
use GlobalData\Server;
// 自动加载类
require_once __DIR__ . '/../../vendor/autoload.php';
// require_once __DIR__ . '/../../Workerman/Autoloader.php';
require_once __DIR__ . '/globalData/Server.php';
$worker = new Server();
Worker::runAll();
