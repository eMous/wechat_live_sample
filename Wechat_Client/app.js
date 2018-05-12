//app.js
var util = require("utils/util")
var socketMatters = require("utils/socketMatters.js")

App({
    url: "ws://120.24.241.6:7272",
    wsTaskFailed: true,
    lastPingPongTime: null,
    isConnecting : false,
    room: undefined,
    reconnectMessageQueqe:[],
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
    onShow: function (info){
        console.log(info)
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

    enterLiveRoom:function(info){
        // 如果是来自二维码，则判断二维码所携带的参数合法与否，存储直播间ID，请求……
        if (info.scene == "1012" || info.scene == "1011" || info.scene == "1013")
        {
            console.log(util.logMessage("用户登陆程序来自二维码"))
            if (info.path != "pages/details/detail")
            {
                console.log(util.logMessage("页面不是detail而是"+ info.path,true))
            }
            if (!info.query.room){
                console.log(util.logMessage("页面不带Room参数" + info.path, true))
            }else{
                this.room = info.query.room
                console.log("123456")
                wx.setStorageSync('inRoom', this.room)
            }
        }else{
            var room = this.room
            console.log("正常启动")
            console.log(room)
            
            if(!room){
                // 进入404
                wx.redirectTo({
                    url: '/pages/notfound/notfound',
                })
            }
            else{
                // 进入房间，之后在判断是否房间还正在直播
                console.log('/pages/details/detail?room=' + room)
                wx.redirectTo({
                    url: '/pages/details/detail?room='+room,
                })
            }
        }
        
        // 如果不是二维码，则看本地有没有缓存直播间号，如果有就询问服务器有没有直播，如果没有就提示等待邀请
    }
})