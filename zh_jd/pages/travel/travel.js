// zh_jd/pages/travel/travel.js
//获取应用实例
var app = getApp();
var Data = require("../../utils/data.js");
Page({
  data: {
    is_top:false,
    data: [],
    typeid:3
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
    var banner = re.travelbanner.split(',')
    this.setData({
      banner:banner
    })
    this.reload()
  },
  reload: function (e) {
    var that = this
    var typeid = that.data.typeid
    console.log(that.data)
    // 获取多商家集合
    app.util.request({
      'url': 'entry/wxapp/gettravel',
      'cachetime': '0',
      data: {
        typeid: typeid
      },
      success: function (res) {
        console.log(res.data)
        var travel = res.data
        for (let i = 0; i < travel.length; i++) {
          // if (typeof travel[i].img == 'string') {
          //   travel[i].img = travel[i].img.split(",")
          // }
        }
        that.setData({
          travel: travel
        })
        console.log(travel)
      }
    })
    console.log(this.data)
  },
  jumpto: function (e) {
    var top = e.detail.scrollTop
    console.log(top)
    if (top >= 150) {
      this.setData({
        is_top: true,
      })
    }else{
      this.setData({
        is_top: false,
      })
    }
  },
  swichNav:function(e){
    var typeid = e.currentTarget.dataset.current
    console.log(typeid)
    this.setData({
      typeid:typeid
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
  /** 打开当前位置
  tomap: function (e) {

    var that = this
    console.log(e)
    console.log(that.data)
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (e) {
        console.log(e)
        var latitude = e.latitude
        var longitude = e.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: that.data.store.name,
          address: that.data.store.address,
          scale: 28
        })
      }
    })

  },
 */
})
