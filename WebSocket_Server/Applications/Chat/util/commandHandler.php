<?php
	use \GatewayWorker\Lib\Gateway;

	require_once "commands.php";


	class Data{
		public const  ossAliyuncs = "http://soupu.oss-cn-shanghai.aliyuncs.com";
		public static $roomIds = ["anon"=>[1,2]];
		public static $roomInfo = [
			1=>[
			"imgUrl" => self::ossAliyuncs . "/images/Screenshot_2016-12-13-10-19-12-215.png",
			"title" => "《高山流水》 - 古筝", 
			"info" => "高山流水，梅花三弄，夕阳箫鼓，汉宫秋月，阳春白雪，渔樵问答，胡笳十八拍，广陵散，平沙落雁，十面埋伏。",
			"avatar" =>  self::ossAliyuncs . "/images/banner6.jpg",
			"uName" => "张珊珊",
			"isLive" => true,
			"videoUrl" => self::ossAliyuncs . "/videos/VID20161029121958.mp4",
			"browse" => 13299,
			"like" => 595,
			"commet" => 789,
			"time" => "刚刚" ],
			2=>[
			"imgUrl" => self::ossAliyuncs . "/images/Screenshot_2016-12-13-10-19-12-215.png",
			"title" => "《高山流水》 - 古筝", 
			"info" => "高山流水，梅花三弄，夕阳箫鼓，汉宫秋月，阳春白雪，渔樵问答，胡笳十八拍，广陵散，平沙落雁，十面埋伏。",
			"avatar" =>  self::ossAliyuncs . "/images/banner6.jpg",
			"uName" => "张珊珊",
			"isLive" => true,
			"videoUrl" => self::ossAliyuncs . "/videos/VID20161029121958.mp4",
			"browse" => 13299,
			"like" => 595,
			"commet" => 789,
			"time" => "刚刚" ],
			3=>[
			"imgUrl" => self::ossAliyuncs . "/images/Screenshot_2016-12-13-10-19-12-215.png",
			"title" => "你好", 
			"info" => "高山流水，梅花三弄，夕阳箫鼓，汉宫秋月，阳春白雪，渔樵问答，胡笳十八拍，广陵散，平沙落雁，十面埋伏。",
			"avatar" =>  self::ossAliyuncs . "/images/banner6.jpg",
			"uName" => "张珊珊",
			"isLive" => true,
			"videoUrl" => self::ossAliyuncs . "/videos/VID20161029121958.mp4",
			"browse" => 13299,
			"like" => 595,
			"commet" => 789,
			"time" => "刚刚" ],
			4=>[
			"imgUrl" => self::ossAliyuncs . "/images/Screenshot_2016-12-13-10-19-12-215.png",
			"title" => "《高山流水》 - 古筝", 
			"info" => "高山流水，梅花三弄，夕阳箫鼓，汉宫秋月，阳春白雪，渔樵问答，胡笳十八拍，广陵散，平沙落雁，十面埋伏。",
			"avatar" =>  self::ossAliyuncs . "/images/banner6.jpg",
			"uName" => "张珊珊",
			"isLive" => true,
			"videoUrl" => self::ossAliyuncs . "/videos/VID20161029121958.mp4",
			"browse" => 13299,
			"like" => 595,
			"commet" => 789,
			"time" => "刚刚" ],
		];
	}


	function handleMessage($client_id,$message)
	{
		$messageArr = json_decode($message,true);
		var_dump($messageArr);

		// 对于异样数据包暂时直接忽略
		if(!array_key_exists("commandNum", $messageArr)){
			echo "数据包出错 \n";
			var_dump($messageArr);
			return;
		}
		$commandNum = (int)$messageArr["commandNum"];

		$data = $messageArr["data"];
		switch ($commandNum) {
			case Commands::Ping_Pong:
				echo "on Ping_Pong";
				break;
			case Commands::C_Busniess_Reconnect:
				echo "on C_Busniess_Reconnect \n";
				onConnectRequestInfo($client_id,$data);
				break;
			case Commands::C_Detail_Room_Info:
				echo "on C_Detail_Room_Info \n";
				onDetailRoomInfo($client_id,$data);
				break;
			case Commands::C_Add_Room:
				echo "on C_Add_Room \n";
				onAddRoom($client_id,$data);
				break;
			default:
				# code...
				break;
		}
	}

	
	// -------- 具体数据包处理函数 -------- 

	function onConnectRequestInfo($client_id, $data){
		$uid = $data["id"];

		Gateway::bindUid($client_id, $uid);
		$_SESSION['uid'] = $uid;

		$retRoomIds =  Data::$roomIds[$uid];

		$commandSend = commandBuild(Commands::S_Busniess_Reconnect_Info, ["roomIds"=>$retRoomIds]);
		echo "currentSend == $commandSend";
		Gateway::sendToCurrentClient($commandSend);
	}

	function onDetailRoomInfo($client_id, $data){
		$uid = $_SESSION["uid"];

		$roomId = (int)$data["roomId"];

		$roomDetail = Data::$roomInfo[$roomId];

		$commandSend = commandBuild(Commands::S_Detail_Room_Info, ["roomId"=>$roomId,"detailInfo"=>$roomDetail]);
		echo "currentSend == $commandSend";
		Gateway::sendToCurrentClient($commandSend);
	}

	function onAddRoom($client_id,$data){
		if(!array_key_exists($data["roomId"], Data::$roomInfo)){
			$ret = ["success"=>0, "data"=>[]];
			$commandSend = commandBuild(Commands::S_Detail_Room_Info_And_Flush, $ret);
			echo "currentSend == $commandSend";
			Gateway::sendToCurrentClient($commandSend);
			return;
		}
		$uid = $_SESSION['uid'];
		if (in_array($data["roomId"], Data::$roomIds["$uid"])){
			$ret = ["success"=>-1, "data"=>[]];
			$commandSend = commandBuild(Commands::S_Detail_Room_Info_And_Flush, $ret);
			echo "currentSend == $commandSend";
			Gateway::sendToCurrentClient($commandSend);
			return;
		}

		Data::$roomIds["$uid"][] = $data["roomId"];

		$ret = ["success"=>true, "detailInfo"=>Data::$roomInfo[$data["roomId"]]];
		$commandSend = commandBuild(Commands::S_Detail_Room_Info_And_Flush, $ret);
		echo "currentSend == $commandSend";
		Gateway::sendToCurrentClient($commandSend);
	}
?>