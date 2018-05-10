<?php 
	
	class Commands{
		const Ping_Pong = 0;
		
		const C_Busniess_Reconnect = 1;

		const S_Busniess_Reconnect_Info = -1;

		const C_Detail_Room_Info = 2;
    	 /*
    	 *   DATA：{
       success: -1,
       detailInfo:{roomId : 1,
    	imgUrl:"...",
    	title:"sss",
    	info:"...",
    	avatar:"sss",
    	uName:"2ss",
    	isLive:true,
    	videoUrl:"sdasdas",
    	browse:123,
    	like:123,
    	comment:123,
    	time:"刚刚"}
      }
    	*/
   		const S_Detail_Room_Info = -2;
   		/*
 	   	*   DATA:{roomId:..}
 	   	*/
 	  	const C_Add_Room= 3;
 	   	/*
 	   	 *   DATA：{roomId : 1,
 	   	imgUrl:"...",
 	   	title:"sss",
 	   	info:"...",
 	   	avatar:"sss",
 	   	uName:"2ss",
 	   	isLive:true,
 	   	videoUrl:"sdasdas",
 	   	browse:123,
 	   	like:123,
 	   	comment:123,
 	   	time:"刚刚"}
    	*/
   		const S_Detail_Room_Info_And_Flush= -3;
   		/*
   		*   客户端请求进入某直播间
   		*   DATA:{roomId:..}
   		*/
   		const C_Enter_Room = 4;

      /*
      * 服务端回应客户端请求进入某个直播间
      * DATA:{success:..}
      */
   		const S_Enter_Room_Response = -4;
      
      /*
      * DATA: {roomId:..,uid:..,content:..,time:..,contentType..,voiceTime..}
      */
      const C_Chat = 5;
      /*
      * DATA: [{content:..,time:..,contentType..,voiceTime..,system..,id..},]
      */
      const S_Chat_Details = -5;

      /*
      * DATA: {"roomId":1,"id":23}
      */
      const C_More_Chat_Details = 6;
	
	}

	function commandBuild($commandNum, $commandDetial){
		$retArr = [];
		$retArr["commandNum"] = $commandNum;
		$retArr["data"] = $commandDetial;


		$ret = json_encode($retArr);
		return $ret;
	}

?>