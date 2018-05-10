const Command = {
    /*
    * 心跳包
    */
    Ping_Pong: 0,
    /*
    *   客户端（重新）连接成功，请求服务器传送所有业务数据
    *   DATA：{id : $id} , 用户id用于识别并从服务端检索数据后回传
    */
    C_Busniess_Reconnect: 1,
    /*
    *   客户端（重新）连接成功，服务端根据客户端ID，返回客户端，关注的房间ID列表（等）
    *   DATA：{roomIds : [1,2,3]}
    */
    S_Busniess_Reconnect_Info: -1,
    /*
    *   客户端请求具体房间信息，服务端根据房间号，返回具体房间信息
    *   DATA:{roomId:1}
    */
    C_Detail_Room_Info: 2,
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
    S_Detail_Room_Info: -2,
    /*
    *   客户端请求关注某直播间
    *   DATA:{roomId:..}
    */
    C_Add_Room: 3,
    /*
    *   具体直播间信息，且刷新客户端列表
    *   DATA：{success:true ,detailInfo:{roomId : 1,
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
    S_Detail_Room_Info_And_Flush: -3,
    /*
    *   客户端请求进入某直播间
    *   DATA:{roomId:..}
    */
    C_Enter_Room: 4,
    /*
    * 服务端回应客户端请求进入某个直播间
    * DATA:{success:..}
    */
    S_Enter_Room_Response: -4,

    /*
    * 客户端发送聊天
    * DATA: {roomId:..,uid:..,content:..,time:..,contentType..,voiceTime..}
    */
    C_Chat: 5,
    
    /*
    * 服务端推送聊天数据
    * DATA: [{content:..,time:..,contentType..,voiceTime..,system..,id..},]
    */
    S_Chat_Details: -5,

    /*
    * 客户端请求更多聊天数据
    * DATA: {"roomId":1,"id":23}
    */
    C_More_Chat_Details: 6
}


module.exports = {
    Command
}