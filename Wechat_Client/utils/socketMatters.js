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
                app.lastPingPongTime = Date.parse(new Date()) + 15000
                util.logMessage("wsTask.Open")
                businessReconnect()
                startPingPong()
            })
            app.wsTask.onMessage(function (msg) {
                onMessage(msg)
            })

        }, 500)
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
                            reconnectWsTask(app.url)
                        },
                        fail: function () {
                            console.log("socket 因为心跳包的原因失败close! ")
                            util.logMessage("socket 因为心跳包的原因失败close! ", true)
                            app.wsTaskFailed = true
                            reconnectWsTask(app.url)
                        },
                    })
                }
            }
        }
    }, 4000)
}

function onMessage(msg) {
    var app = getApp()
    var data = JSON.parse(msg.data)

    if (data.hasOwnProperty("type")) {
        if (data["type"] == "ping") {
            console.log("send ping-pong ..")
            send(0, "pong")
            app.lastPingPongTime = Date.parse(new Date())
        }
    }
    // 因为可能还有PingPong，要一些逻辑处理暂时不写
    // console.assert(data["commandNum"],"服务端发送的消息")
    const Command = com.Command
    const detailData = data["data"]
    switch (parseInt(data["commandNum"])) {
        case Command.S_Busniess_Reconnect_Info:
            onConnectDetailInfo(detailData)
            break
        case Command.S_Detail_Room_Info:
            onRoomDetailInfo(detailData)
            console.log("room  === " + JSON.stringify(detailData))
            break
        case Command.S_Detail_Room_Info_And_Flush:
            onRoomDetailInfoAndFlush(detailData)
            console.log("room and Flush === " + JSON.stringify(detailData))
            break
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
// -------- 包发送入口 --------
function addRoom(roomId) {
    var retCommand = util.commandBuild(com.Command.C_Add_Room, { roomId: roomId })
    send(retCommand)
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
    startPingPong: startPingPong
}
