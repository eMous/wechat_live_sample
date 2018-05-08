var util = require("util")
var com = require("socketCommands")
var dat = require("data")

function reconnectWsTask(url) {
    var app = getApp()
    console.log("in reconnectWsTask")
    if (app.wsTaskFailed) {
        setTimeout(function () {
            app.wsTask = wx.connectSocket({
                url: url,
                success: function () {
                    util.logMessage("Websocket to " + url + " is success reconnected but not open!")
                    console.log("Websocket to " + url + " is success reconnected but not open!")
                },
                fail: function () {
                    app.wsTaskFailed = true;
                    util.logMessage("Websocket to " + url + " is fail Reconnected!", true)
                    console.log("Websocket to " + url + " is fail Reconnected!")

                    reconnectWsTask(url);
                },
            })

            app.wsTask.onError(function (mess) {
                app.wsTaskFailed = true;
                util.logMessage("onwsTask.onError:" + mess, true)
                console.log("onwsTask.onError:" + mess, true)
                reconnectWsTask(url);
            })
            wx.onSocketError(function (mess) {
                // 这个函数先放着不用，先用上面的具体Task的
                util.logMessage("onwx.onSocketError:" + mess, true)
            });

            app.wsTask.onOpen(function (header) {
                app.wsTaskFailed = false;
                util.logMessage("wsTask.Open")
                businessReconnect()
            })
            app.wsTask.onMessage(function (msg) {
                onMessage(msg)
            })

        }, 500)
    }
}

function onMessage(msg) {
    var app = getApp()
    var data = JSON.parse(msg.data)

    // 因为可能还有PingPong，要一些逻辑处理暂时不写
    // console.assert(data["commandNum"],"服务端发送的消息")
    const Command = com.Command
    const detailData = data["data"]
    switch (parseInt(data["commandNum"])) {
        case Command.S_Busniess_Reconnect_Info:
            onConnectDetailInfo(detailData)
            break;
        case Command.S_Detail_Room_Info:
            onRoomDetailInfo(detailData)
            console.log("room  === " + JSON.stringify(detailData))
            
    }

    // console.log(msg)
    // console.log()
    // var wsTask = app.wsTask

    //wsTask.send({ data: "123" })
    // var mCmd = { 1: "connect.getWlList", "data": { "mdd": "370600" } }
    // wsTask.send({ data: JSON.stringify(mCmd) })

    // console.log(JSON.stringify(mCmd))
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

// -------- 具体数据包处理函数 -------- 
function onConnectDetailInfo(data) {
    var roomIds = data["roomIds"] || []
    console.log("room ids === " + roomIds)
    dat.dataInstance.roomIds = roomIds

    roomIds.forEach(function (roomId) {
        var retCommand = util.commandBuild(com.Command.C_Detail_Room_Info, { roomId: roomId })
        send(retCommand)
    })
}
function onRoomDetailInfo(data){
    console.log("ssssssssss" + dat.dataInstance.roomDetailInfo)
    dat.dataInstance.roomDetailInfo.push(data.detailInfo);
}
module.exports = {
    onMessage: onMessage,
    reconnectWsTask: reconnectWsTask,
    businessReconnect: businessReconnect
}
