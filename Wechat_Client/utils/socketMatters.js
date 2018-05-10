var util = require("util")
var com = require("socketCommands")
var dat = require("data")

function reconnectWsTask(App) {
    // Warning: 在这里把 var app = App 替换成 var app = getApp() 会出错，不知为何。所以只能在 app 的on函数里，把this 传进来
    if (App != undefined){
        var app = App
    }else{
        app = getApp()
    }
    if (app.wsTaskFailed) {
        setTimeout(function () {
            // 因为官方不提供wsTask属性值的解释，所以自定义正在连接属性
            // 如果正在连接就不在创立新的连接
            if (app.isConnecting)
            {
                console.log("正在建立连接状态")
                return;
            }
            console.log("不在建立连接状态，所以再new一个对象，并覆盖之前的")
            
            app.isConnecting = true
            // 否则不论如何都重新创建并重置连接对象
            app.wsTask = wx.connectSocket(getWSConnectObjectParm())
            app.wsTask.onError(wsTaskOnError)
            app.wsTask.onOpen(wsTaskOnOpen)
            app.wsTask.onMessage(onMessage)
        }, 200)
    }else{
        console.log("is false")
    }
}
// 心跳包设置
function startPingPong() {
    setInterval(function () {
        let app = getApp()
        if (!app.wsTaskFailed) {
            console.log("任务没有失败！")
            if (app.lastPingPongTime != null) {
                var now_time = Date.parse(new Date())
                if (now_time - app.lastPingPongTime > 15000) {
                    console.log("现在的时间是" + now_time)
                    console.log("上次pingpong的时间是" + app.lastPingPongTime)
                    app.wsTask.close({
                        success: function () {
                            console.log("socket 因为心跳包的原因成功close! ")
                            util.logMessage("socket 因为心跳包的原因成功close! ", true),
                            app.wsTaskFailed = true
                            reconnectWsTask(app)
                        },
                        fail: function () {
                            console.log("socket 因为心跳包的原因失败close! ")
                            util.logMessage("socket 因为心跳包的原因失败close! ", true)
                            app.wsTaskFailed = true
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

    var ret = util.commandBuild(com.Command.C_Busniess_Reconnect, { id: "anon" })
    console.log(ret)
    send(ret)
}

// 包装带failLog的Send函数
function send(msgSend) {
    var app = getApp()
    var wsTask = app.wsTask

    wsTask.send({
        data: msgSend,
        fail: function () {
            util.logMessage(msgSend + "发送失败", true)
        }
    })
}

// -------- wxTask回调包装 -------
function getWSConnectObjectParm(){
    var app = getApp()
    var wsConnectObjectParm = {
        url: app.url,
        success: function () {
            // app.wsTaskFailed = false;
            util.logMessage("Websocket to " + app.url + " is success Connected!")
            console.log("Websocket to " + app.url + " is success Connected!")
        },
        fail: function () {
            app.wsTaskFailed = true;
            util.logMessage("Websocket to " + app.url + " is fail Connected!", true)
            console.log("Websocket to " + app.url + " is fail Connected!")
            reconnectWsTask(app.url);
        },
        complete:function(){
            app.isConnecting = false
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
        case Command.S_Detail_Room_Info_And_Flush:
            onRoomDetailInfoAndFlush(detailData)
            break
    }
}
function wsTaskOnOpen(header){
    var app = getApp()
    app.wsTaskFailed = false;
    app.lastPingPongTime = Date.parse(new Date()) + 15000
    util.logMessage("wsTask.Open")
    businessReconnect()
    startPingPong()
}
function wsTaskOnError(mess){
    var app = getApp()
    app.wsTaskFailed = true;
    app.lastPingPongTime = Date.parse(new Date()) + 15000
    util.logMessage("onwsTask.onError:" + mess, true)
    console.log("onwsTask.onError:" + mess, true)
    reconnectWsTask();
}
// -------- 包发送入口 --------
function addRoom(roomId) {
    var retCommand = util.commandBuild(com.Command.C_Add_Room, { roomId: roomId })
    send(retCommand)
}
function enterRoom(roomId){
    var retCommand = util.commandBuild(com.Command.C_Enter_Room, { roomId: roomId })
    send(retCommand)
}
// -------- 具体数据包处理函数 -------- 
function onPing(){
    console.log("接收到心跳数据")
    var app = getApp()
    app.lastPingPongTime = Date.parse(new Date())
    var retCommand = util.commandBuild(com.Command.Ping_Pong, {})
    send(retCommand)
}
function onConnectDetailInfo(data) {
    var roomIds = data["roomIds"] || []
    console.log("room ids === " + roomIds)
    dat.dataInstance.roomIds = roomIds

    roomIds.forEach(function (roomId) {
        var retCommand = util.commandBuild(com.Command.C_Detail_Room_Info, { roomId: roomId })
        send(retCommand)
    })
}
function onRoomDetailInfo(data) {
    console.log("ssssssssss" + dat.dataInstance.roomDetailInfo)
    dat.dataInstance.roomDetailInfo.push(data.detailInfo);
}
function onRoomDetailInfoAndFlush(data) {
    if (data.success == true) {
        console.log("ssssssssss" + dat.dataInstance.roomDetailInfo)
        dat.dataInstance.roomDetailInfo.push(data.detailInfo);
        // Most Beautiful Hack.
        currentPage: getCurrentPages()[0].setData({ lists: dat.dataInstance.roomDetailInfo })
        wx.showToast({
            title: "添加成功",
            icon: "success",
            duration: 1000
        })
        // wx.reLaunch({url:"index"})
    } else if (data.success == 0) {
        wx.showToast({
            title: "房间号不存在",
            icon: "none",
            duration: 2000
        })
    } else if (data.success == -1) {
        wx.showToast({
            title: "您已关注该直播间",
            icon: "none",
            duration: 2000
        })
    }

}
module.exports = {
    onMessage: onMessage,
    reconnectWsTask: reconnectWsTask,
    businessReconnect: businessReconnect,
    addRoom: addRoom,
    startPingPong: startPingPong,
    wsTaskOnOpen: wsTaskOnOpen,
    enterRoom: enterRoom,
}
