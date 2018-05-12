var ossAliyuncs = "http://soupu.oss-cn-shanghai.aliyuncs.com";

function iGetInnerText(testStr) {

    
    var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
    console.log("去掉空格以后是"+resultStr)
    resultStr = resultStr.replace(/[ ]/g, "");    //去掉空格
    console.log("去掉空格以后是" + resultStr)
    
    resultStr = resultStr.replace(/[\r\n]/g, ""); //去掉回车换行
    console.log("去掉回车换行以后是" + resultStr)
    
    return resultStr;
}
function dump_obj(myObject) {
    var s = "";
    for (var property in myObject) {
        s = s + "\n " + property + ": " + myObject[property];
    }
    console.log(s)
}  

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function strAddTime(str){
  return formatTime(new Date()) + "\t" + str;
}

function logMessage(str,bIsWarning = false) {
  var logs = wx.getStorageSync('logs') || []
  if(logs.length> 120){
      wx.setStorageSync("logs", [])
      wx.setStorageSync('isWarning', []);
      logs = []
  }
  logs.unshift(strAddTime(str))
  wx.setStorageSync('logs', logs)

  var isWarning = wx.getStorageSync('isWarning') || [];
  isWarning.unshift(bIsWarning)
  wx.setStorageSync('isWarning', isWarning);

  return strAddTime(str)
}

function commandBuild(commandNum,data){
  // var stringDetailCommand = JSON.stringify(data)
  // var jsonDetailCommand = JSON.parse(stringDetailCommand)
  var jsonDetailCommand = {"commandNum" : 1, "data": 1};
  jsonDetailCommand["commandNum"] = commandNum
  jsonDetailCommand["data"] = data
  
  var ret = JSON.stringify(jsonDetailCommand)
  
  return ret
}

// 使得可以在任何页面渲染，任何页面，只要页面是活着的
function getPage(name){
    var pagesArray = getCurrentPages() || []
    
    for(var i = 0; i < pagesArray.length; i++){
        var route = pagesArray[i].route;
        var page_name = route.split("/").pop()
        if (name == page_name) {
            return pagesArray[i];
        }
    }
    return null;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  ossAliyuncs: ossAliyuncs,
  logMessage: logMessage,
  commandBuild: commandBuild,
  getPage: getPage,
  dump_obj: dump_obj,
  iGetInnerText: iGetInnerText
}
