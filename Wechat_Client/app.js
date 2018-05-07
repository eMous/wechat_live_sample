//app.js
var util = require("utils/util")
App({

  onLaunch: function () {

    // 建立服务器长连接
    try {
      // connect出错的话 会抛出异常使得,wsTask无法被获取,文档里没有写。
      // 并且，如果是无法解析DNS，但是域名结构正确 如 wss://example.qq.com这个网站一样会返回true。但实际上是fail的。
      var url = "wss://127.0.0.1:7272"
      this.wsTask = wx.connectSocket({
        url: url,
        success: function () {
          util.logMessage("Websocket to " + url + " is success Connected!")
        },
        fail: function () {
          util.logMessage("Websocket to " + url + " is fail Connected!", true)
        },
      })

      this.wsTask.onError(function (mess) {
        util.logMessage("onwsTask.onError:" + mess, true)
      })
      wx.onSocketError(function (mess) {
        util.logMessage("onwx.onSocketError:" + mess, true)
      });

      this.wsTask.onOpen(function (header) {
        util.logMessage("wsTask.Open")
      })
      var wsTask = this.wsTask
      this.wsTask.onMessage(function(msg){
        console.log(msg)
        console.log(JSON.parse(msg.data))

        wsTask.send({ data:"123"})
        var mCmd = { 1: "connect.getWlList", "data": { "mdd": "370600" } }
        wsTask.send( {data: JSON.stringify(mCmd)})

        console.log(JSON.stringify(mCmd))

      })

    } catch (err) {
      util.logMessage(err, true)
    }




    // //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
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