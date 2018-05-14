<?php
/**
 * This file is part of workerman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link http://www.workerman.net/
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 */
use \Workerman\Worker;
use \Workerman\WebServer;
use \GatewayWorker\Gateway;
use \GatewayWorker\BusinessWorker;
use \Workerman\Autoloader;


// 自动加载类
require_once __DIR__ . '/../../vendor/autoload.php';
// 证书最好是申请的证书
$context = array(
    'ssl' => array(
        'local_cert'  => '/etc/apache2/cert/public.pem', // 也可以是crt文件
        'local_pk'    => '/etc/apache2/cert/214675772330006.key',
        'verify_peer' => false,
    )
);
// WebServer
$web = new WebServer("http://0.0.0.0:55151",$context);
$web->transport = 'ssl';
// WebServer数量
$web->count = 2;
// 设置站点根目录
$web->addRoot('tetaa.brightcloud-tech.com', __DIR__.'/Web');

// 如果不是在根目录启动，则运行runAll方法
if(!defined('GLOBAL_START'))
{
    Worker::runAll();
}

