// zh_jd/pages/system_notice/system_notice.js
//获取应用实例
var app = getApp();
var WxParse = require('../../resource/wxParse/wxParse.js');
Page({
  data: {
    data: [],
  },


  //事件处理函数
  onLoad: function (options) {
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
    that.setData({
      id:options.id
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
      data:{id:that.data.id},
      success: function (res) {
        var travel = res.data
        var article = travel[0].content
        WxParse.wxParse('article', 'html', article, that, 5);
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
