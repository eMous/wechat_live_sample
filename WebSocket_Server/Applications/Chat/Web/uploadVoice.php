<?php
    // 例如保存到/tmp目录下
    foreach($_FILES as $key => $file_info)
    {
        // TODO：LOCK AQUIRE
        file_put_contents(__DIR__.'/voices/'.$file_info['file_name'], $file_info['file_data']);
        unset($_FILES[$key]);
        echo($file_info['file_name']);
    }
?>