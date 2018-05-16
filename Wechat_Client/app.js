//app.js
var util = require("utils/util")
var socketMatters = require("utils/socketMatters.js")

App({
  url: "wss://tetaa.brightcloud-tech.com/wss",
  wsTaskFailed: true,
  lastPingPongTime: null,
  isConnecting: false,
  room: undefined,
  reconnectMessageQueqe: [],
  onLaunch: function (info) {
    // 建立服务器长连接
    try {
      console.log("从launch出，重新建立连接")
      socketMatters.reconnectWsTask(this)
    } catch (err) {
      util.logMessage(err, true)
    }

    this.room = wx.getStorageSync('inRoom')
  },
  onShow: function (info) {
    this.enterLiveRoom(info)
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
    userInfo: null,
  },

  enterLiveRoom: function (info) {
    // 如果是来自二维码，则判断二维码所携带的参数合法与否，存储直播间ID，请求……
    if (info.scene == "1012" || info.scene == "1011" || info.scene == "1013") {
      console.log(util.logMessage("用户登陆程序来自二维码"))
      if (info.path != "pages/details/detail") {
        console.log(util.logMessage("页面不是detail而是" + info.path, true))
      }
      if (!info.query.room) {
        console.log(util.logMessage("页面不带Room参数" + info.path, true))
      } else {
        this.room = info.query.room
        console.log("123456")
        wx.setStorageSync('inRoom', this.room)
        wx.setStorageSync("src", info.query.live_src)
      }
    } else {
      var room = this.room
      console.log("正常启动")
      console.log("且存储过的房间号是"+room)

      if (info.path.search("detail") != -1) {
        // 说明是已经打开过直播间页面 就直接进去，在detail的里面去抓 room 和 src 如果没有抓到就直接404
        return;
      }else{
        // 如果不是直播间页面，那就先看看什么页面在处理吧


      }
    }
    // 如果不是二维码，则看本地有没有缓存直播间号，如果有就询问服务器有没有直播，如果没有就提示等待邀请
  }
})