<?php
	use \GatewayWorker\Lib\Gateway;
	use GlobalData\GlobalDataClient;
	require_once "commands.php";
	require_once __DIR__ . '/../globalData/GlobalDataClient.php';

	function onGatewayStart($worker){

		// debug
		echo("gateway start .. \n");

		$globalData = new GlobalDataClient('127.0.0.1:2307');
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
		$globalData->roomChatDetail = [
		1 => ["online_uids"=>[],
			"chats"=>[
					["system"=>true,"content"=>"4123","time"=>24124],
					["uid"=>"anon","content"=>"1","contentType"=>1,"time"=>23123],
					["uid"=>"anon","content"=>"2","contentType"=>2,"time"=>51242, "voiceTime"=>2000],
					["uid"=>"anon","content"=>"3","contentType"=>2,"time"=>51242, "voiceTime"=>2000],

					["uid"=>"anon","content"=>"4","contentType"=>2,"time"=>51242, "voiceTime"=>2000],

					["uid"=>"anon","content"=>"5","contentType"=>2,"time"=>51242, "voiceTime"=>2000],

					["uid"=>"anon","content"=>"6","contentType"=>2,"time"=>51242, "voiceTime"=>2000],

					["uid"=>"anon","content"=>"7","contentType"=>2,"time"=>51242, "voiceTime"=>2000],

				]
			]
		];


	}
	function onBusinessWorkerStart($worker){

		// debug
		echo("business worker start ..\n");
		Data::$globalData = new GlobalDataClient('127.0.0.1:2307');
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

		$data = $messageArr["data"];
		switch ($commandNum) {
			case Commands::Ping_Pong:
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
			case Commands::C_Chat:
				echo "on C_Chat_Room \n";
				onChat($client_id, $data);
				break;
			case Commands::C_More_Chat_Details:
				echo "on C_More_Chat_Details \n";
				onMoreChatDetails($client_id, $data);
				break;
			default:
				# code...
				break;
		}
	}

	function handleClose($client_id){
		onLeaveRoom($client_id);
	}
	// -------- 具体数据包处理函数 -------- 

	function onConnectRequestInfo($client_id, $data){
		
		// 如果是获取到了登录信息,则移出之前的 未注册id
		if(isset($_SESSION["uid"])){
		    echo("connection set uid and it is " . $_SESSION["uid"]  . "\n");
			if(isset($_SESSION["roomId"])){
                echo("connection set roomid and it is " . $_SESSION["roomId"]  . "\n");
				$roomId = $_SESSION["roomId"];
				// 如果他在房间之前，就把之前在房间未注册id移出，再把现在的id加进去
				onLeaveRoom($client_id);
				onEnterRoom($client_id,["roomId"=>$roomId]);
			}

		}

		$uid = $data["id"];

		Gateway::bindUid($client_id, $uid);
		$_SESSION['uid'] = $uid;

		$commandSend = commandBuild(Commands::S_Busniess_Reconnect_Info, []);
		Gateway::sendToCurrentClient($commandSend);
	}

	function onDetailRoomInfo($client_id, $data){
		$uid = $_SESSION["uid"];
		$globalData = Data::$globalData;

		$roomId = (int)$data["roomId"];

		$roomInfo = $globalData->roomInfo;
		
		$failCode = -1;
		// 房间不存在
		if(!array_key_exists($roomId, $roomInfo)){
			$failCode = 1;
		}else if(!$roomInfo[$roomId]["isLive"]){
			// 直播间关闭
			$failCode = 2;
		}

		// 出错
		if($failCode != -1){
			$commandSend = commandBuild(Commands::S_Detail_Room_Info, ["success"=> $failCode,"roomIdSearched"=>$roomId]);
		}
		else{
			$roomInfo[$roomId]["roomId"] = $roomId;
			$commandSend = commandBuild(Commands::S_Detail_Room_Info, ["success"=> -1, "detailInfo"=>$roomInfo[$roomId]]);
		}
		Gateway::sendToCurrentClient($commandSend);
	}

	function onLeaveRoom($client_id, $data = null){
	    if(!isset($_SESSION["uid"])){
            return;
        }
		$uid = $_SESSION["uid"];
        $globalData = Data::$globalData;

	    // 清除服务器历史里的房间的记录，同时一个人只能在一个直播间内
		if(isset($_SESSION["roomId"])){
            echo("onLeaveRoom\n");
		    $pre_room_id = $_SESSION["roomId"];
			if(isset($globalData->roomChatDetail[$pre_room_id])){
				$key = array_search($uid, $globalData->roomChatDetail[$pre_room_id]["online_uids"]);
				if($key != false){
					unset($globalData->roomChatDetail[$pre_room_id]["online_uids"][$key]);
				}
			}
			Gateway::leaveGroup($client_id,$pre_room_id);
			unset($_SESSION["roomId"]);
		}

		// 清除指定的
		if (isset($data["roomId"])) {
            echo("onLeaveRoom\n");
		    $roomId = $data["roomId"];
			if (isset($globalData->roomChatDetail[$roomId])) {
				$key = array_search($uid, $globalData->roomChatDetail[$roomId]["online_uids"]);
				if($key != false){
					unset($globalData->roomChatDetail[$roomId]["online_uids"][$key]);
				}
			}
			Gateway::leaveGroup($client_id,$roomId);
		}
	}

	function onEnterRoom($client_id, $data){
		$uid = $_SESSION['uid'];
		$globalData = Data::$globalData;
		$roomId = $data["roomId"];
		
		// 先退其他的房间
		onLeaveRoom($client_id);

		// 房间不存在
		if(!array_key_exists($roomId, $globalData->roomInfo)){
			$ret = ["success"=>-1,"roomId"=>$roomId];
			$commandSend = commandBuild(Commands::S_Enter_Room_Response, $ret);
			Gateway::sendToCurrentClient($commandSend);
			return;
		}
		// 房间存在就直接进去，暂时不考虑已经进入之类的
		else{
			$ret = ["success"=>0,"roomId"=>$roomId];
			$commandSend = commandBuild(Commands::S_Enter_Room_Response, $ret);
			Gateway::sendToCurrentClient($commandSend);

			// 之后用redis,这里要考虑上锁的问题
			$roomChatDetail = $globalData->roomChatDetail;
			// 建立聊天室
			if(!isset($roomChatDetail[$roomId])){
				$roomChatDetail[$roomId] = [];
				$roomChatDetail[$roomId]["online_uids"] = [];
				$roomChatDetail[$roomId]["chats"] = [];
			}
			$targetRoomChatDetail = &$roomChatDetail[$roomId];

			// 如果已经加入直播间，直接返回				
			Gateway::joinGroup($client_id,$roomId);
			$_SESSION["roomId"] = $roomId;
			if (in_array("$uid", $targetRoomChatDetail["online_uids"])) {
				echo("$uid already add in the live room \n");
				return;
			}else{
				// 加入直播间
				$targetRoomChatDetail["online_uids"][] = $uid;
				$arr = ["system"=>true,"content"=>"欢迎用户{$uid}进入直播间！","time"=>getMillisecond()];
				$targetRoomChatDetail["chats"][] = $arr;
				$globalData->roomChatDetail = $roomChatDetail;

				// 通知进入直播间
				$arr["id"] = array_search($arr, $targetRoomChatDetail["chats"]);
				$command = commandBuild(Commands::S_Chat_Details, [$arr]);
				Gateway::sendToGroup($roomId,$command);
			}
			
		}
		test();
	}

	function onChat($client_id,$data){
		$uid = $_SESSION['uid'];
		$globalData = Data::$globalData;
		$roomId = $data["roomId"];
		var_dump($data);
		// 房间不存在
		if(!array_key_exists($roomId, $globalData->roomInfo)){
			echo "no such a live room. $roomId \n";
			return;
		}

		$roomChatDetail = $globalData->roomChatDetail;
		// 聊天室未建立
		if(!isset($roomChatDetail[$roomId])){
			echo "no such a live chat room. $roomId \n";
			return;
		}
		// 人不在房间内
		if (!in_array($uid, $roomChatDetail[$roomId]["online_uids"])) {
			echo "onChat $uid is not in the room $roomId.\n";
			return;
		}

		echo("onClientChat!!! \n");
		var_dump($data);
		// 添加记录
		$arr = ["uid"=>$uid, "content"=>$data["content"], "time"=>getMillisecond(), "contentType"=>$data["contentType"]];
		if($data["contentType"] == 2) {
            $arr["voiceTime"] = $data["voiceTime"];
            $prefix = "http://tetaa.brightcloud-tech.com:55151/voices/";
            $arr["content"] = $prefix.$data["content"];
        }
		$roomChatDetail[$roomId]["chats"][] = $arr;
		$globalData->roomChatDetail = $roomChatDetail;

		$arr["id"] = array_search($arr, $roomChatDetail[$roomId]["chats"]);
		$command = commandBuild(Commands::S_Chat_Details, [$arr]);
		Gateway::sendToGroup($roomId,$command);
	}


	// 返回id之前的5条消息
	function onMoreChatDetails($client_id, $data){
		$uid = $_SESSION['uid'];
		$globalData = Data::$globalData;
		$roomId = $data["roomId"];
		$idBefore = $data["id"];
		// 房间不存在
		if(!array_key_exists($roomId, $globalData->roomInfo)){
			echo "no such a live room. $roomId \n";
			return;
		}

		$roomChatDetail = $globalData->roomChatDetail;
		// 聊天室未建立
		if(!isset($roomChatDetail[$roomId])){
			echo "no such a live chat room. $roomId \n";
			return;
		}
		// 人不在房间内
		if (!in_array($uid, $roomChatDetail[$roomId]["online_uids"])) {
			echo "onMoreChatDetails $uid is not in the room $roomId.\n";
			return;
		}

		$ret_arr = [];
		$targetChats = $roomChatDetail[$roomId]["chats"];
		$item = [];
		for($i = 1; $i <= 5; $i++){
			if(array_key_exists($idBefore-$i, $targetChats)){
				$item = $targetChats[$idBefore-$i];
				$item["id"] = $idBefore-$i;
				array_unshift($ret_arr, $item);
			}
		}
		var_dump($ret_arr);
		$command = commandBuild(Commands::S_Chat_Details, $ret_arr);
		Gateway::sendToCurrentClient($command);
	}

	function getMillisecond() {
		list($t1, $t2) = explode(' ', microtime());
		return (float)sprintf('%.0f',(floatval($t1)+floatval($t2))*1000);
	}

	function test(){
			$timer_id = \Workerman\Lib\Timer::add(6.5, function()use(&$timer_id){
                if(isset(Data::$globalData->chatTimer))
                    return;
			    Data::$globalData->chatTimer = $timer_id;

			$uid= "simulator";
			if (rand(0,5) > 2)
                $uid="bealiar";

			$arr_insert = ["uid"=>rand(0,5) > 2 ? "{}" :$uid, "content"=>"test".getMillisecond(), "time"=>getMillisecond(), "contentType"=>1];
			
			$roomChatDetail = Data::$globalData->roomChatDetail;
			array_push($roomChatDetail[1]["chats"], $arr_insert);
			
			$arr_insert["id"] = array_search($arr_insert, $roomChatDetail[1]["chats"]);
			$command = commandBuild(Commands::S_Chat_Details, [$arr_insert]);
			Gateway::sendToGroup(1,$command);

			Data::$globalData->roomChatDetail = $roomChatDetail;
		});
	}
?>