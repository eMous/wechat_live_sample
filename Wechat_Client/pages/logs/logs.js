//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    logs: [],
    isWarning:[]
  },
  onLoad: function () {
    this.setData(
    {
      logs: (wx.getStorageSync('logs') || []),

      isWarning: (wx.getStorageSync('isWarning') || [])
    });
  },
  tapClear: function(){
    wx.clearStorageSync("logs");
    wx.clearStorageSync("isWarning");
    this.setData({
      logs: (wx.getStorageSync('logs') || []),
      isWarning: (wx.getStorageSync('isWarning') || [])
    });

    wx.clear
  }


})
