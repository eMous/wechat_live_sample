var util = require("util")
function reconnectWsTask(url){
  var app = getApp()
  console.log("in reconnectWsTask")
  if (app.wsTaskFailed){
    setTimeout(function(){
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
      })
      app.wsTask.onMessage(function (msg) {
        onMessage(msg)
      })

    },500)
  }  
}

function onMessage(msg){
  var app = getApp()
  console.log(msg)
  console.log(JSON.parse(msg.data))

  wsTask.send({ data: "123" })
  var mCmd = { 1: "connect.getWlList", "data": { "mdd": "370600" } }
  wsTask.send({ data: JSON.stringify(mCmd) })

  console.log(JSON.stringify(mCmd))
} 

module.exports = {
  onMessage: onMessage,
  reconnectWsTask: reconnectWsTask
}
