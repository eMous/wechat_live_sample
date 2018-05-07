var ossAliyuncs = "http://soupu.oss-cn-shanghai.aliyuncs.com";

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
  logs.unshift(strAddTime(str))
  wx.setStorageSync('logs', logs);

  var isWarning = wx.getStorageSync('isWarning') || [];
  isWarning.unshift(bIsWarning)
  wx.setStorageSync('isWarning', isWarning);
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  ossAliyuncs: ossAliyuncs,
  logMessage: logMessage
}
