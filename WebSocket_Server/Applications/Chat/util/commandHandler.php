<?php
	use \GatewayWorker\Lib\Gateway;
	use GlobalData\GlobalDataClient;
	require_once "commands.php";
	require_once __DIR__ . '/../globalData/GlobalDataClient.php';

	function onGatewayStart($worker){

		// debug
		echo("gateway start .. \n");

		$globalData = new GlobalDataClient('127.0.0.1:2207');
		if(isset($globalData->ossAliyuncs ))
			return;
		$globalData->ossAliyuncs = "http://soupu.oss-cn-shanghai.aliyuncs.com";
		$globalData->roomIds = ["anon"=>[1,2]];
		$globalData->roomInfo = [
			1=>[
			"imgUrl" => $globalData->ossAliyuncs . "/images/Screenshot_2016-12-13-10-19-12-215.png",
			"title" => "《高山流水》 - 古筝", 
			"info" => "高山流水，梅花三弄，夕阳箫鼓，汉宫秋月，阳春白雪，渔樵问答，胡笳十八拍，广陵散，平沙落雁，十面埋伏。",
			"avatar" =>  $globalData->ossAliyuncs . "/images/banner6.jpg",
			"uName" => "张珊珊",
			"isLive" => true,
			"videoUrl" => $globalData->ossAliyuncs . "/videos/VID20161029121958.mp4",
			"browse" => 13299,
			"like" => 595,
			"commet" => 789,
			"time" => "刚刚" ],
			2=>[
			"imgUrl" => $globalData->ossAliyuncs . "/images/Screenshot_2016-12-13-10-19-12-215.png",
			"title" => "《高山流水》 - 古筝", 
			"info" => "高山流水，梅花三弄，夕阳箫鼓，汉宫秋月，阳春白雪，渔樵问答，胡笳十八拍，广陵散，平沙落雁，十面埋伏。",
			"avatar" =>  $globalData->ossAliyuncs . "/images/banner6.jpg",
			"uName" => "张珊珊",
			"isLive" => true,
			"videoUrl" => $globalData->ossAliyuncs . "/videos/VID20161029121958.mp4",
			"browse" => 13299,
			"like" => 595,
			"commet" => 789,
			"time" => "刚刚" ],
			3=>[
			"imgUrl" => $globalData->ossAliyuncs . "/images/Screenshot_2016-12-13-10-19-12-215.png",
			"title" => "你好", 
			"info" => "高山流水，梅花三弄，夕阳箫鼓，汉宫秋月，阳春白雪，渔樵问答，胡笳十八拍，广陵散，平沙落雁，十面埋伏。",
			"avatar" =>  $globalData->ossAliyuncs . "/images/banner6.jpg",
			"uName" => "张珊珊",
			"isLive" => true,
			"videoUrl" => $globalData->ossAliyuncs . "/videos/VID20161029121958.mp4",
			"browse" => 13299,
			"like" => 595,
			"commet" => 789,
			"time" => "刚刚" ],
			4=>[
			"imgUrl" => $globalData->ossAliyuncs . "/images/Screenshot_2016-12-13-10-19-12-215.png",
			"title" => "《高山流水》 - 古筝", 
			"info" => "高山流水，梅花三弄，夕阳箫鼓，汉宫秋月，阳春白雪，渔樵问答，胡笳十八拍，广陵散，平沙落雁，十面埋伏。",
			"avatar" =>  $globalData->ossAliyuncs . "/images/banner6.jpg",
			"uName" => "张珊珊",
			"isLive" => true,
			"videoUrl" => $globalData->ossAliyuncs . "/videos/VID20161029121958.mp4",
			"browse" => 13299,
			"like" => 595,
			"commet" => 789,
			"time" => "刚刚" ],
		];

		// $globalData->chatRoom[1] 用来存在1号房间看直播的用户id
		$globalData->chatRoom = [];
		// $globalData->chatRoomDetail[1][] = {"uid"=> "123", "content"=> "sdasd", "type"=>"1", "time"=> "123"} ,用来存具体聊天记录
		$globalData->chatRoomDetail = [];
	}
	function onBusinessWorkerStart($worker){

		// debug
		echo("business worker start ..\n");
		Data::$globalData = new GlobalDataClient('127.0.0.1:2207');
	}
	class Data{
		public static $globalData;
	}


	function handleMessage($client_id,$message)
	{
		$messageArr = json_decode($message,true);

		// 对于异样数据包暂时直接忽略
		if(!array_key_exists("commandNum", $messageArr)){
			echo "数据包出错 \n";
			var_dump($messageArr);
			return;
		}
		$commandNum = (int)$messageArr["commandNum"];

		if($commandNum == 0){
			var_dump($messageArr);
		}


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
			case Commands::C_Enter_Room:
				echo "on C_Enter_Room \n";
				onEnterRoom($client_id, $data);
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

		$retRoomIds =  Data::$globalData->roomIds[$uid];

		$commandSend = commandBuild(Commands::S_Busniess_Reconnect_Info, ["roomIds"=>$retRoomIds]);
		Gateway::sendToCurrentClient($commandSend);
	}

	function onDetailRoomInfo($client_id, $data){
		$uid = $_SESSION["uid"];

		$roomId = (int)$data["roomId"];

		$roomDetail = Data::$globalData->roomInfo[$roomId];

		$commandSend = commandBuild(Commands::S_Detail_Room_Info, ["roomId"=>$roomId,"detailInfo"=>$roomDetail]);
		Gateway::sendToCurrentClient($commandSend);
	}

	function onAddRoom($client_id,$data){
		$globalData = Data::$globalData;

		if(!array_key_exists($data["roomId"], $globalData->roomInfo)){
			$ret = ["success"=>0, "data"=>[]];
			$commandSend = commandBuild(Commands::S_Detail_Room_Info_And_Flush, $ret);
			Gateway::sendToCurrentClient($commandSend);
			return;
		}
		$uid = $_SESSION['uid'];
		if (in_array($data["roomId"], $globalData->roomIds["$uid"])){
			$ret = ["success"=>-1, "data"=>[]];
			$commandSend = commandBuild(Commands::S_Detail_Room_Info_And_Flush, $ret);
			Gateway::sendToCurrentClient($commandSend);
			return;
		}

		$globalData->roomIds["$uid"][] = $data["roomId"];

		$ret = ["success"=>true, "detailInfo"=>$globalData->roomInfo[$data["roomId"]]];
		$commandSend = commandBuild(Commands::S_Detail_Room_Info_And_Flush, $ret);
		Gateway::sendToCurrentClient($commandSend);
	}

	function onEnterRoom($client_id, $data){
		$globalData = Data::$globalData;
		$roomId = $data["roomId"];
		// 房间不存在
		if(!array_key_exists($roomId, $globalData->roomInfo)){
			$ret = ["success"=>0, "data"=>[]];
			$commandSend = commandBuild(Commands::S_Enter_Room_Response, $ret);
			Gateway::sendToCurrentClient($commandSend);
			return;
		}

		// 房间存在就直接进去，暂时不考虑已经进入之类的
		else{
			// 之后用redis,这里要考虑上锁的问题
			
			// 建立聊天室
			if(!isset($globalData->chatRoom[$roomId])){
				// 用来存在看直播的用户
				$globalData->chatRoom[$roomId] = [];

			}
		}
	}
?>