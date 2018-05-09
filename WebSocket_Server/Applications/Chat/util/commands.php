<?php 
	
	class Commands{
		const Ping_Pong = 0;
		
		const C_Busniess_Reconnect = 1;

		const S_Busniess_Reconnect_Info = -1;

		const C_Detail_Room_Info = 2;
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
	
	}

	function commandBuild($commandNum, $commandDetial){
		$retArr = [];
		$retArr["commandNum"] = $commandNum;
		$retArr["data"] = $commandDetial;


		$ret = json_encode($retArr);
		return $ret;
	}

?>