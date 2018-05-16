var util = require("util")
var com = require("socketCommands")
var dat = require("data")

function reconnectWsTask(App) {
  console.log("in reconnectWsTask")
  // Warning: 在这里把 var app = App 替换成 var app = getApp() 会出错，不知为何。所以只能在 app 的on函数里，把this 传进来
  if (App != undefined) {
    var app = App
  } else {
    app = getApp()
  }
  if (app.wsTaskFailed) {
    console.log("重连连接")
    // 因为官方不提供wsTask属性值的解释，所以自定义正在连接属性
    // 如果正在连接就不在创立新的连接
    if (app.isConnecting) {
      console.log("正在建立连接状态")
      return;
    }
    // console.log("不在建立连接状态，所以再new一个对象，并覆盖之前的")
    console.log("设置正在连接状态")
    app.isConnecting = true

    // 否则不论如何都重新创建并重置连接对象
    app.wsTask = wx.connectSocket(getWSConnectObjectParm(app))
    app.wsTask.onError(wsTaskOnError)
    app.wsTask.onOpen(wsTaskOnOpen)
    app.wsTask.onMessage(onMessage)
  } else {
    console.log("is false")
  }
}
// 心跳包设置
function startPingPong() {
  setInterval(function () {
    let app = getApp()
    if (!app.wsTaskFailed) {
      //console.log("任务没有失败！")
      if (app.lastPingPongTime != null) {
        var now_time = Date.parse(new Date())
        if (now_time - app.lastPingPongTime > 15000) {
          console.log("现在的时间是" + now_time)
          console.log("上次pingpong的时间是" + app.lastPingPongTime)
          app.wsTask.close({
            success: function () {
              console.log("socket 因为心跳包的原因成功close! ")
              util.logMessage("socket 因为心跳包的原因成功close! ", true),
                console.log("将wsTaskFailed = true")
              app.wsTaskFailed = true
              console.log("从心跳成功关闭处，重新建立连接")
              reconnectWsTask(app)
            },
            fail: function () {
              console.log("socket 因为心跳包的原因失败close! ")
              util.logMessage("socket 因为心跳包的原因失败close! ", true)
              console.log("将wsTaskFailed = true")
              app.wsTaskFailed = true
              console.log("从心跳失败关闭处，重新建立连接")
              reconnectWsTask(app)
            },
          })
        }
      }
    }
  }, 4000)
}


// 重新请求业务数据
function businessReconnect() {
  var app = getApp()
  var wsTask = app.wsTask

  console.log("businessReconnect")

  let name = "unknown" + Date.parse(new Date())

  let info = wx.getStorageSync("userinfo")
  console.log("app.userInfo == " + info)
  if (info)
    name = info.nickName
  // ID 绑定
  var ret = util.commandBuild(com.Command.C_Busniess_Reconnect, { id: name })
  send(ret)
}

// 包装带failLog的Send函数
function send(msgSend) {
  var app = getApp()
  var wsTask = app.wsTask

  // 不是断线状态 && 不是正在连接中
  if (msgSend["data"]) {
    console.log("app.wsTaskFailed == " + app.wsTaskFailed)
    console.log("app.isConnecting == " + app.isConnecting)
    console.log("msg == " + msgSend)
  }

  if (!app.wsTaskFailed) {
    console.log("send")
    wsTask.send({
      data: msgSend,
      fail: function () {
        util.logMessage(msgSend + "发送失败", true)
      }
    })
    return;
  } else if (app.isConnecting) {
    console.log("正在等待连接建立,先将msg存储在队列" + msgSend)
    app.reconnectMessageQueqe.push(msgSend)
  }
  else {
    console.log("enqueqe")
    // 提示用户等待断线重连
    app.reconnectMessageQueqe.push(msgSend)
    console.log("app.wsTaskFailed == " + app.wsTaskFailed)
    console.log("app.isConnecting == " + app.isConnecting)
    console.log("从发送失败处，重新建立连接，发送的东西是" + msgSend)
    reconnectWsTask(app)
  }
}

// -------- wxTask回调包装 -------
function getWSConnectObjectParm(App) {
  var app = App
  var wsConnectObjectParm = {
    url: app.url,
    success: function () {
      console.log("连接connect success")
      // app.wsTaskFailed = false;
      util.logMessage("Websocket to " + app.url + " is success Connected!")
      console.log("Websocket to " + app.url + " is success Connected!")
    },
    fail: function () {
      console.log("连接connect fail")
      console.log("将wsTaskFailed = true")

      app.wsTaskFailed = true;
      app.isConnecting = false

      util.logMessage("Websocket to " + app.url + " is fail Connected!", true)
      console.log("Websocket to " + app.url + " is fail Connected!")
      console.log("从连接失败处，重新建立连接")
      reconnectWsTask(app.url);
    },
    complete: function () {
      console.log("连接complete")

    }
  }
  return wsConnectObjectParm
}

function onMessage(msg) {
  var app = getApp()
  var data = JSON.parse(msg.data)
  const Command = com.Command
  const detailData = data["data"]

  switch (parseInt(data["commandNum"])) {
    case Command.Ping_Pong:
      onPing()
      break;
    case Command.S_Busniess_Reconnect_Info:
      onConnectDetailInfo(detailData)
      break
    case Command.S_Detail_Room_Info:
      onRoomDetailInfo(detailData)
      break
    case Command.S_Enter_Room_Response:
      onEnterRoomResponse(detailData)
      break
    case Command.S_Chat_Details:
      onChatDetails(detailData)
  }
}
function wsTaskOnOpen(header) {
  console.log("连接Open")
  var app = getApp()
  app.wsTaskFailed = false;
  app.isConnecting = false
  app.lastPingPongTime = Date.parse(new Date()) + 15000
  util.logMessage("wsTask.Open")
  console.log("wsTaskOnOpen -> businessReconnect")
  businessReconnect()
  startPingPong()
}
function wsTaskOnError(mess) {
  var app = getApp()
  console.log("将wsTaskFailed = true")
  app.wsTaskFailed = true;
  app.isConnecting = false
  app.lastPingPongTime = Date.parse(new Date()) + 15000
  util.logMessage("onwsTask.onError:" + mess.errMsg, true)
  console.log("onwsTask.onError:" + mess, true)

  console.log("从连接失败处，重新建立连接")
  setTimeout(function () {
    reconnectWsTask()
  }, 500)

}
// -------- 包发送入口 --------

// 直播间信息
function roomInfo(roomId) {
  console.log("roomInfo")
  var retCommand = util.commandBuild(com.Command.C_Detail_Room_Info, { roomId: roomId })
  send(retCommand)
}
// 进入直播间
function enterRoom(roomId) {
  console.log("enterRoom" + { roomId: roomId })
  let retCommand = util.commandBuild(com.Command.C_Enter_Room, { roomId: roomId })
  send(retCommand)
}
// 获取更多的聊天数据
function mooreChatDetail(chatId) {
  let retCommand = util.commandBuild(com.Command.C_More_Chat_Details, { roomId: 1, id: chatId })
  send(retCommand)
}
// 发送聊天消息
function chatMessageSend(contentStr, room) {
  // { roomId:..,content:..,time:..,contentType..,voiceTime..}
  let retCommand = util.commandBuild(com.Command.C_Chat,
    { content: contentStr, roomId: room, contentType: 1, time: (new Date()).valueOf() })
  send(retCommand)
}

function sendVoice(room,fileName, voiceDuration) {
  // { roomId:..,content:..,time:..,contentType..,voiceTime..}
  console.log("filename =="+ fileName)
  let retCommand = util.commandBuild(com.Command.C_Chat,
    { content: fileName, roomId: room, contentType: 2, time: (new Date()).valueOf(), voiceTime: voiceDuration })
  send(retCommand)
}
// -------- 具体数据包处理函数 -------- 
function onPing() {
  //console.log("接收到心跳数据")
  var app = getApp()
  app.lastPingPongTime = Date.parse(new Date())
  var retCommand = util.commandBuild(com.Command.Ping_Pong, {})
  send(retCommand)
}
function onConnectDetailInfo(data) {
  console.log("补发失效时的未发送的包")
  var app = getApp();

  // 发送失效队列
  for (var i = 0; i < app.reconnectMessageQueqe.length; i++) {
    send(app.reconnectMessageQueqe[i])
  }
  app.reconnectMessageQueqe = []

  // 断线重连成功回调
  let room = wx.getStorageSync("inRoom")
  if (room)
    enterRoom(room)
}
function onRoomDetailInfo(data) {
  console.log(data)
  if (data.success == 1 || data.success == 2) {
    // 浏览房间已经关闭，直播间不存在
    if (data.roomIdSearched == wx.getStorageSync("inRoom")) {
      clearRoomCache()
    }
    // 进入404
    wx.redirectTo({
      url: '/pages/notfound/notfound',
    })
  }
  if (data.success == -1) {
    console.log(data.detailInfo)
    util.getPage("detail").setData(data.detailInfo)
    console.log(data.detailInfo.roomId)
    enterRoom(data.detailInfo.roomId)
  }
}
function onEnterRoomResponse(data) {
  if (data.success == -1) {
    console.log("onEnterRoomResponse fail. 因为房间不不存在,房间号是" + data.roomId)
    // 进入404
    wx.redirectTo({
      url: '/pages/notfound/notfound',
    })
  } else if (data.success == 0) {
    console.log("onEnterRoomResponse success. 房间号是" + data.roomId)
  }
}
function onChatDetails(data) {
  //console.log(data)
  if (data[0] == undefined) {
    console.log("no more data..")
    return
  }
  let pageDetail = util.getPage("detail")
  // 防止这个时候detail还没有被初始化出来
  if (pageDetail == undefined){
    setTimeout(function(){
      console.log(util.logMessage("这个时候detail还没有被初始化出来,200ms后再执行相同命令"))
      onChatDetails(data)
    },200)
    return;
  }
  var detail = util.getPage("detail").data.chatDetail;
  //console.log("detail" + detail)

  var int_id = data[0]["id"];
  for (var i = 0; i < data.length; i++) {
    var index = data[i]["id"];

    //console.log("set chatDetail" + data[i]["id"] + "=" + data[i])
    detail[index] = data[i]
    detail[index]["id"] = index;
  }
  console.log("data[0].id ====" + data[0]["content"]);
  util.getPage("detail").setData({ chatDetail: detail, toView: "a" + detail[int_id]["id"] })
}

function clearRoomCache() {
  wx.removeStorageSync("inRoom")
  wx.removeStorageSync("src")
}

module.exports = {
  onMessage: onMessage,
  reconnectWsTask: reconnectWsTask,
  startPingPong: startPingPong,
  roomInfo: roomInfo,
  chatMessageSend: chatMessageSend,
  businessReconnect: businessReconnect,
  sendVoice:sendVoice
}
