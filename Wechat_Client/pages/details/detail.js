var util = require("../../utils/util")
var socketMatters = require("../../utils/socketMatters")

Page({
    data: {
        isShow: false,//控制emoji表情是否显示
        isLoad: true,//解决初试加载时emoji动画执行一次
        content: "",//评论框的内容
        isLoading: true,//是否显示加载数据提示
        disabled: true,
        cfBg: false,
        _index: 0,
        livePlayersHeight: 240, //播放器的高
        barHeight: 40, // 控制条的高
        isBarShow: true,// 控制条是否显示
        isPauseButtonShow: true, //是否显示的是暂停按钮
        isFullScreen: false, // 是否是全屏
        isShowLoadingGif: false, // 是否显示loading的动画（卡的时候要）
        pauseButtonSrc: "/images/common/pauseButton.png",
        playButtonSrc: "/images/common/playButton.png",
        live_src: "",
        live:true,
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
        // comments: [
        //   {
        //     avatar: util.ossAliyuncs + "/images/banner4.jpg",
        //     uName: "😝雨碎江南",
        //     time: "2016-12-11",
        //     content: "九九八十一难，最难过的，其实是女儿国这一关，因为比起其他的艰难困苦来说，此时的唐僧是真的动心了，一句“来生若有缘分”道尽一切，只是为了心中崇高的理想，纵使心动也要断绝柔情继续西行。为国王惋惜，同时也对唐僧充满崇敬，尤其是了解了史上真实的唐玄奘以后，更是觉得此人了不起。"
        //   },
        //   {
        //     avatar: util.ossAliyuncs + "/images/banner6.jpg",
        //     uName: "张珊珊",
        //     time: "2016-12-11",
        //     content: "音乐不分年纪，不过令人开心的是你们也不会年轻太久。😝😝😝😝"
        //   },
        //   {
        //     avatar: util.ossAliyuncs + "/images/banner2.jpg",
        //     uName: "麦田的守望者",
        //     time: "2016-12-11",
        //     content: "看的时候还很小，不太明白里面的故事，长大后才发现西游记里水太深了。😢😢😡😡😼😼🍆🍇🍇🍆👧👰👨💑💇💅🐶🐶🙏✈🚲🚲😡😅👿😖😨😢😻🚃🚃🚌"
        //   },
        //   {
        //     avatar: util.ossAliyuncs + "/images/Screenshot_2016-12-13-10-13-16-926.png",
        //     uName: "~LUCK",
        //     time: "2016-12-11",
        //     content: "86版《西游记》绝对是那代人的国民记忆，放假天天等着看，一遍又一遍，悟空被压在五指山下经历春夏秋冬，寒冬大雪里一个人吃雪，路过的小牧童送来水果，那一段我和小伙伴们哭的稀里哗啦，当年的特技后期制作还很落后，但所有演员都是用心在塑造角色，没有艳俗的服装造型，良心制作！ 以后会陪孩子再看"
        //   },
        //   {
        //     avatar: util.ossAliyuncs + "/images/banner3.jpg",
        //     uName: "沃德天·娜么帥",
        //     time: "2016-12-11",
        //     content: "想起，小时候，父亲教我这首歌的样子。"
        //   },
        //   {
        //     avatar: util.ossAliyuncs + "/images/Screenshot_2016-12-13-10-13-38-305.png",
        //     uName: "雨碎江南",
        //     time: "2016-12-11",
        //     content: "我的宿命，分两段， 未遇见你时，和遇见你以后。 你治好我的忧郁，而后赐我悲伤。 忧郁和悲伤之间的片刻欢喜， 透支了我生命全部的热情储蓄。 想饮一些酒，让灵魂失重，好被风吹走。 可一想到终将是你的路人， 便觉得，沦为整个世界的路人。 风虽大，都绕过我灵魂。"
        //   },
        //   {
        //     avatar: util.ossAliyuncs + "/images/banner5.jpg",
        //     uName: "雨碎江南",
        //     time: "2016-12-01",
        //     content: "九九八十一难，最难过的，其实是女儿国这一关，因为比起其他的艰难困苦来说，此时的唐僧是真的动心了，一句“来生若有缘分”道尽一切，只是为了心中崇高的理想，纵使心动也要断绝柔情继续西行。为国王惋惜，同时也对唐僧充满崇敬，尤其是了解了史上真实的唐玄奘以后，更是觉得此人了不起。"
        //   }
        // ],
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
    play(e) {
        console.log("play!!!!!!!!!");
    },
    onLoad: function (options) {

        // option : room, src, title
        console.log
        util.getPage("detail").setData(options)
        
        socketMatters.roomInfo(options.room)

        // 页面初始化 options为页面跳转所带来的参数
        var that = this,videoUrl = that.data.detail.videoUrl;
        that.data.title = options.title;
        switch(options.id){
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
    },
    onReady: function () {
        // 页面渲染完成
        //设置当前标题
        wx.setNavigationBarTitle({
            title: "小王的直播间"
        })

        //获取直播组件上下文
        this.ctx = wx.createLivePlayerContext('detailLivePlayer');


    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
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
                    comments: that.data.comments.concat(conArr)
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
        console.log(e.detail.value)
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
    //发送评论评论 事件处理
    send: function () {
        var that = this, conArr = [];
        //此处延迟的原因是 在点发送时 先执行失去文本焦点 再执行的send 事件 此时获取数据不正确 故手动延迟100毫秒
        setTimeout(function () {
            if (that.data.content.trim().length > 0) {
                conArr.push({
                    avatar: util.ossAliyuncs + "/images/banner5.jpg",
                    uName: "雨碎江南",
                    time: util.formatTime(new Date()),
                    content: that.data.content
                })
                that.setData({
                    comments: that.data.comments.concat(conArr),
                    content: "",//清空文本域值
                    isShow: false,
                    cfBg: false
                })
            } else {
                that.setData({
                    content: ""//清空文本域值
                })
            }
        }, 100)
    },

    // 点击直播区域
    tapLivePlayerArea: function () {
        this.setData({
            isBarShow: !this.data.isBarShow
        })
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
                util.logMessage("网络断连，且经多次重连抢救无效，更多重试请自行重启播放", true);
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
        this.setData({
        });

    }
})