var util = require("../../utils/util")
var socketMatters = require("../../utils/socketMatters")

Page({
  data: {
    isShow: true,//控制emoji表情是否显示
    isLoad: true,//解决初试加载时emoji动画执行一次
    content: "",//评论框的内容
    isLoading: true,//是否显示加载数据提示
    disabled: true,
    cfBg: false,
    _index: 0,
    livePlayersHeight: 240, //播放器的高
    barHeight: 40, // 控制条的高
    isBarShow: false,// 控制条是否显示
    isPauseButtonShow: true, //是否显示的是暂停按钮
    isFullScreen: false, // 是否是全屏
    isShowLoadingGif: false, // 是否显示loading的动画（卡的时候要）
    pauseButtonSrc: "/images/common/pauseButton.png",
    playButtonSrc: "/images/common/playButton.png",
    live: true,
    second_height: 0, // 滚动框的高度
    isRecording: false, // 是否正在录音

    isTapEnd: false, // 因为voice的录制是非阻塞的，所以可能会先touchend 后完成开始录制，从而导致一直在录制。用来fix这个问题


    // { "system": true, "content": "4123", "time": 24124, "id":0 },
    // { "uid": "anon", "content": "1", "contentType": 1, "time": 23123, "id":1  },
    // { "uid": "xiaoming", "content": "2", "contentType": 2, "time": 51242, "voiceTime": 2000, "id": 2  },
    chatDetail: [{ "uid": "xiaoming", "content": "2", "contentType": 2, "time": 51242, "voiceTime": 2000, "id": 2 },],
    detail:
    {
      imgUrl: util.ossAliyuncs + "/images/bg0.jpg",
      title: "犯错-双管巴乌",
      info: "小哥的声音真好。《一剪梅》改了这么多版，还是这版耐听。如泣如诉，余音袅袅。",
      avatar: util.ossAliyuncs + "/images/banner4.jpg",
      uName: "雨碎江南",
      videoUrl: util.ossAliyuncs + "/videos/%E7%AD%89%E4%BD%A0%E7%AD%89%E4%BA%86%E9%82%A3%E4%B9%88%E4%B9%85.mp4",
      browse: 4299,
      like: 2113,
      comment: 789,
      time: "昨天"
    },
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [],//qq、微信原始表情
    alipayEmoji: [],//支付宝表情
    title: ''//页面标题
  },
  tapLog: function () {
    wx.navigateTo({ url: '../logs/logs' });
  },
  play(e) {
    console.log("play!!!!!!!!!");
  },
  onLoad: function (options) {
    // 参数已经被 app.js 捕获过了，不重复获取，并且如果是后台打开的话是没有参数的，直接读本地缓存。
    let room = wx.getStorageSync("inRoom")
    let src = wx.getStorageSync("src")

    if (room == undefined) {
      console.log(util.logMessage("room not defined by query", true))
    }
    if (src == undefined) {
      console.log(util.logMessage("src not defined by query", true))
    }
    socketMatters.roomInfo(room)

    // 页面初始化 options为页面跳转所带来的参数
    var that = this, videoUrl = that.data.detail.videoUrl;
    that.data.title = options.title;
    switch (options.id) {
      case "0":
        videoUrl = util.ossAliyuncs + "/videos/VID20161029121958.mp4"
        break;
      case "1"://女儿情
        videoUrl = util.ossAliyuncs + "/videos/%E5%A5%B3%E5%84%BF%E6%83%85.mp4"
        break;
      case "2"://犯错
        videoUrl = util.ossAliyuncs + "/videos/%E7%8A%AF%E9%94%99-%E5%8F%8C%E7%AE%A1%E5%B7%B4%E4%B9%8C.mp4"
        break;
      case "3"://车站
        videoUrl = util.ossAliyuncs + "/videos/%E8%BD%A6%E7%AB%99-%E5%8F%8C%E7%AE%A1%E5%B7%B4%E4%B9%8C.mp4"
        break;
    }
    that.data.detail.videoUrl = videoUrl;

    var em = {}, that = this, emChar = that.data.emojiChar.split("-");
    var emojis = []
    that.data.emoji.forEach(function (v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v
      };
      emojis.push(em)
    });
    that.setData({
      emojis: emojis
    })
    //alipayEmoji
    // for (var j = 1; j <= 121; j++) {
    //   if (j < 10) j = "0" + j;
    //   that.data.alipayEmoji.push("emotion_small_" + j)
    // }

    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight - 240 / 750 * 300
        })
      }
    })

    util.logMessage(this.data.live_src)
  },
  onReady: function () {

    let info = wx.getStorageSync("userinfo")
    if (info != undefined && info.nickName != undefined)
      this.setData({ nickName: info.nickName })

    // 页面渲染完成
    //设置当前标题
    wx.setNavigationBarTitle({
      title: "小王的直播间"
    })

    //获取直播组件上下文
    this.ctx = wx.createLivePlayerContext('detailLivePlayer')
    // 录音管理器
    this.recorderManager = wx.getRecorderManager()
    // 音频播放组件
    this.innerAudioContext = wx.createInnerAudioContext()
    let that = this
    let innerAudioContext = this.innerAudioContext
    this.recorderManager.onStart(() => {
      console.log("onstartonstartonstartonstartonstartonstart")
      that.data.startRecordTime = Date.parse(new Date())
      wx.showToast({
        title:"录音中",
        image:"/images/common/voiceToast.png"
      })
      console.log(util.logMessage("开始录音"))
      if (that.data.isTapEnd) {
        that.recorderManager.stop()
      }
    })
    this.recorderManager.onStop((res) => {
      wx.hideToast()

      console.log(util.logMessage("结束录音"))

      let endRecordTime = Date.parse(new Date())
      let duration = (endRecordTime - that.data.startRecordTime) / 1000
      that.data.startRecordTime = 0

      let tempFilePath = res.tempFilePath
      console.log("tempFilePath ===" + tempFilePath)
      let fileName = tempFilePath.split("/").pop()
      console.log("fileName ===" + fileName)

      wx.uploadFile({
        url: "https://tetaa.brightcloud-tech.com/uploadVoice.php",
        filePath: tempFilePath,
        success: function (res) {

          console.log("success upload file,data =" + res.data + " code = " + res.statusCode)
          console.log("innerAudioContext.duration =" + duration)
          socketMatters.sendVoice(wx.getStorageSync("inRoom"), fileName, duration)
        },
        fail: function () { console.log("fail upload file") },
        name: fileName
      })
    })

    var src = wx.getStorageSync("src")
    console.log("src ====" + src)
    this.setData({ liveplayersrc: src });
  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    let roomId = wx.getStorageSync("inRoom")
    if (!roomId) {
      console.log(util.logMessage("缓存中没有房间信息", true));
      wx.redirectTo({
        url: '/pages/notfound/notfound',
      })
    }

    console.log(util.logMessage("下拉刷新，重新连接获取，通过本地ID和ROOM进入房间"));
    socketMatters.businessReconnect()
    this.ctx.stop({ sucess: function () { console.log("抢救无效手动停止成功") }, fail: function () { console.log("抢救无效手动停止失败") } });
    this.ctx.play({ sucess: function () { console.log("抢救无效手动开启成功") }, fail: function () { console.log("抢救无效手动开启失败") } });
    wx.stopPullDownRefresh()
  },

  //上拉加载
  onReachBottom: function () {
    var conArr = [], that = this;
    that.data.cfBg = false;
    console.log("onReachBottom")
    if (that.data._index < 5) {
      for (var i = 0; i < 5; i++) {
        conArr.push({
          avatar: util.ossAliyuncs + "/images/banner5.jpg",
          uName: "雨碎江南",
          time: util.formatTime(new Date()),
          content: "我是上拉加载的新数据" + i
        })

      }
      //模拟网络加载
      setTimeout(function () {
        that.setData({
          //comments: that.data.comments.concat(conArr)
        })
      }, 1000)
    } else {
      that.setData({
        isLoading: false
      })
    }
    ++that.data._index;
  },
  //解决滑动穿透问题
  emojiScroll: function (e) {
    console.log(e)
  },
  //文本域失去焦点时 事件处理
  textAreaBlur: function (e) {
    //获取此时文本域值
    console.log("获取此时文本域值" + e.detail.value)
    this.setData({
      content: e.detail.value
    })

  },
  //文本域获得焦点事件处理
  textAreaFocus: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },
  //点击表情显示隐藏表情盒子
  emojiShowHide: function () {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.false
    })
  },
  //表情选择
  emojiChoose: function (e) {
    //当前输入内容和表情合并
    this.setData({
      content: this.data.content + e.currentTarget.dataset.emoji
    })
  },
  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },
  //发送文字聊天 事件处理
  send: function () {
    var that = this, conArr = [];
    //此处延迟的原因是 在点发送时 先执行失去文本焦点 再执行的send 事件 此时获取数据不正确 故手动延迟100毫秒
    setTimeout(function () {
      console.log(that.data.content)

      let content = that.data.content
      console.log("now content = " + content)
      let new_content = util.iGetInnerText(content)
      console.log("now content = " + new_content)

      socketMatters.chatMessageSend(new_content, wx.getStorageSync("inRoom"));
      that.setData({ content: "" })
    }, 100)
  },

  // 点击直播区域
  tapLivePlayerArea: function () {
    // 已经存在一个TimeOut
    if(this.barUnShowTimeOut != undefined){
      clearTimeout(this.barUnShowTimeOut)
      this.barUnShowTimeOut = undefined
    }
    this.setData({
      isBarShow: !this.data.isBarShow
    })
    let that = this
    this.barUnShowTimeOut = setTimeout(()=>{
      that.setData({
        isBarShow: false
      })
    }, 5000)
  },
  tapPauseButton: function () {
    if (this.data.isPauseButtonShow) {
      this.ctx.pause({
        success: function () { util.logMessage("播放器暂停成功！"); },
        fail: function () { util.logMessage("播放器暂停失败！", true); }
      });
    } else {
      this.ctx.resume({
        success: function () { util.logMessage("播放器继续播放成功！"); },
        fail: function () { util.logMessage("播放器继续播放失败！", true); }
      });
    }

    this.setData({
      isPauseButtonShow: !this.data.isPauseButtonShow
    })
  },
  tapFullScreenButton: function () {
    this.tapLivePlayerArea();

    var __this = this;
    setTimeout(function () {
      if (!__this.data.isFullScreen) {
        __this.ctx.requestFullScreen({
          direction: 90,
          success: function () {
            util.logMessage("播放器全屏成功！");
            __this.setData({
              isFullScreen: !__this.data.isFullScreen
            })
          },
          fail: function () { util.logMessage("播放器全屏失败！", true); }
        });
      } else {
        __this.ctx.exitFullScreen({
          success: function () {
            util.logMessage("播放器退出全屏成功！");
            __this.setData({
              isFullScreen: !__this.data.isFullScreen
            })
            util.logMessage("这个时候是否显示gif的值是" + __this.data.isShowLoadingGif);

          },
          fail: function () { util.logMessage("播放器退出全屏失败！", true); }
        });
      }
    }, 100);

  },

  stateChange: function (e) {

    util.logMessage("直播状态变化")
    switch (e.detail.code) {
      case 2001:
        util.logMessage("已经连接服务器");
        break;
      case 2002:
        util.logMessage("已经连接服务器,开始拉流");
        break;
      case 2003:
        util.logMessage("网络接收到首个视频数据包(IDR)");
        break;
      case 2004:
        util.logMessage("视频播放开始");
        this.setData({
          isShowLoadingGif: false
        })
        break;
      case 2005:
        util.logMessage("视频播放进度");
        break;
      case 2006:
        util.logMessage("视频播放结束");
        break;
      case 2007:
        util.logMessage("视频播放Loading", true);
        this.setData({
          isShowLoadingGif: true
        })
        break;
      case 2008:
        util.logMessage("解码器启动");
        break;
      case 2009:
        util.logMessage("视频分辨率改变", true);
        break;
      case -2301:
        util.logMessage("网络断连，且经多次重连抢救无效，更多重试请自行重启播放,调用下拉刷新", true);
        this.onPullDownRefresh()
        break;
      case -2302:
        util.logMessage("获取加速拉流地址失败", true);
        break;
      case 2101:
        util.logMessage("当前视频帧解码失败", true);
        break;
      case 2102:
        util.logMessage("当前音频帧解码失败", true);
        break;
      case 2103:
        util.logMessage("网络断连, 已启动自动重连", true);
        break;
      case 2104:
        util.logMessage("网络来包不稳：可能是下行带宽不足，或由于主播端出流不均匀", true);
        break;
      case 2105:
        util.logMessage("当前视频播放出现卡顿", true);
        this.setData({
          isShowLoadingGif: true
        })
        var that = this;
        setTimeout(function () {
          that.setData({ isShowLoadingGif: false })
          util.logMessage("卡后的200ms取消显示gif", true);
        }, 200);
        break;
      case 2106:
        util.logMessage("硬解启动失败，采用软解", true);
        break;
      case 2107:
        util.logMessage("当前视频帧不连续，可能丢帧", true);
        break;
      case 2108:
        util.logMessage("当前流硬解第一个I帧失败，SDK自动切软解", true);
        break;
      case 3001:
        util.logMessage("RTMP -DNS解析失败", true);
        break;
      case 3002:
        util.logMessage("RTMP服务器连接失败", true);
        break;
      case 3003:
        util.logMessage("RTMP服务器握手失败", true);
        break;
      case 3005:
        util.logMessage("RTMP 读/写失败", true);
        break;
    }
  },

  // TODO ： 要先知道帧率 码率 才知道视频卡没卡
  netStateChange: function (e) {
    var currentFPS = e.detail.info['videoFPS'];
    if (currentFPS < 10) {
      this.setData({
        isShowLoadingGif: true
      })
    } else {
      this.setData({
        isShowLoadingGif: false
      })
    }
    util.logMessage("当前帧率是：" + currentFPS)

  },

  userInfoHandler: function (e
  ) {
    let obj = e.detail
    console.log(obj.userInfo.nickName)
    let app = getApp()
    app.userinfo = obj.userInfo
    wx.setStorageSync("userinfo", app.userinfo)
    // 先把旧的UID洗掉
    socketMatters.businessReconnect()

    let room = wx.getStorageSync("inRoom")
    if (room)
      setTimeout(function () {
        socketMatters.enterRoom(room)
        console.log(util.logMessage("获取用户信息后,刷新服务端的uid,先让之前的uid退出房间,再让这个uid进入房间"))
      }, 100)
  },

  startRecord: function (e) {
    this.data.isTapEnd = false;
    console.log("startstartstartstartstartstart")
    // 先获得授权
    let that = this
    wx.authorize(
      {
        scope: "scope.record",
        success: () => {
          that.recorderManager.start({ duration: 15000, format: "mp3" })
        }, fail: () => {
          wx.openSetting();
        }
      }
    )
  },

  tapDetailVoicePlay: function (e) {
    console.log("tapDetailVoicePlay")
    console.log("url=====" + e.currentTarget.dataset.url)
    this.innerAudioContext.src = e.currentTarget.dataset.url
    this.innerAudioContext.play()
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  endRecord: function (e) {
    this.data.isTapEnd = true;
    console.log("endRecordendRecord")
    this.recorderManager.stop()
  },
  voiceButtonTap: function (e) {
    console.log("taptaptaptaptaptaptap")
  }
})