// zh_jd/pages/system_notice/system_notice.js
//获取应用实例
var app = getApp();
var Data = require("../../utils/data.js");
Page({
  data: {
    is_top: false,
    data: [],
    typeid: 2
  },


  //事件处理函数
  onLoad: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/attachurl',
      'cachetime': '3600',
      success: function (res) {
        console.log(res);
        wx.setStorageSync("url", res.data)
        that.setData({
          url: res.data
        })
      },
    })
    //  获取平台信息
    var re = wx.getStorageSync('platform');
    if (re.db_color == '') {
      wx.setStorageSync('platform_color', '#F9882B')
    } else {
      wx.setStorageSync('platform_color', re.db_color)
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    this.reload()
  },
  reload: function (e) {
    var that = this
    console.log(that.data)
    // 获取多商家集合
    app.util.request({
      'url': 'entry/wxapp/getsystemnotice',
      'cachetime': '0',
      success: function (res) {
        var travel = res.data
        console.log(travel)
        that.setData({
          travel: travel
        })
        console.log(travel)
      }
    })
    console.log(this.data)
  },
  swichNav: function (e) {
    var typeid = e.currentTarget.dataset.current
    console.log(typeid)
    this.setData({
      typeid: typeid
    })
    this.reload()
  },
  // 下拉刷新
  onPullDownRefresh() {
    var that = this
    that.onLoad()
    wx.stopPullDownRefresh();
  },
  onShow: function () {

  },
  onReady: function () {
    var that = this
    console.log(that.data)

  },
})
