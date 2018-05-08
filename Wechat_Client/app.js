//app.js
var util = require("utils/util")
var socketMatters = require("utils/socketMatters.js")

App({
  wsTaskFailed : false,
  onLaunch: function () {

    // 建立服务器长连接
    try {
      // connect出错的话 会抛出异常使得,wsTask无法被获取,文档里没有写。
      // 并且，如果是无法解析DNS，但是域名结构正确 如 wss://example.qq.com这个网站一样会返回true。但实际上是fail的。
      var url = "wss://127.0.0.1:7272"
      var that = this
      this.wsTask = wx.connectSocket({
        url: url,
        success: function () {
          that.wsTaskFailed = false;
          util.logMessage("Websocket to " + url + " is success Connected!")
          console.log("Websocket to " + url + " is success Connected!")
          
        },
        fail: function () {
          that.wsTaskFailed = true;
          util.logMessage("Websocket to " + url + " is fail Connected!", true)
          console.log("Websocket to " + url + " is fail Connected!")
          socketMatters.reconnectWsTask(url);
        },
      })

      that.wsTask.onError(function (mess) {
        util.logMessage("onwsTask.onError:" + mess, true)
        console.log("onwsTask.onError:" + mess, true)
        that.wsTaskFailed = true;
        socketMatters.reconnectWsTask(url);
      })
      wx.onSocketError(function (mess) {
        // 这个函数先放着不用，先用上面的具体Task的
        util.logMessage("onwx.onSocketError:" + mess, true)
      });

      that.wsTask.onOpen(function (header) {
        that.wsTaskFailed = false;
        util.logMessage("wsTask.Open")
        socketMatters.businessReconnect()
      })
      that.wsTask.onMessage(function(msg){
        socketMatters.onMessage(msg)
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