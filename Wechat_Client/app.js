//app.js
var util = require("utils/util")
var socketMatters = require("utils/socketMatters.js")

App({
    url: "wss://127.0.0.1:7272",
    wsTaskFailed: true,
    lastPingPongTime: null,
    isConnecting : false,
    onLaunch: function () {
        // 建立服务器长连接
        try {
            socketMatters.reconnectWsTask(this)
        } catch (err) {
            util.logMessage(err, true)
        }
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null
    }
})