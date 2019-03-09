// zh_jd/pages/travel/travel.js
//获取应用实例
var app = getApp();
var Data = require("../../utils/data.js");
Page({
  data: {
    is_top: false,
    data: [],
    tips: '选择日期',
    date: '',
    tomorrow: '',
    userInfo: {},
    name: '',
    currentTab: 0,
    keyword: ''
  },

  // ——————————日历点击事件————————
  // //事件处理函数
  // bindViewTap: function () {
  //   var that = this;
  //   var startDate = that.data.date;
  //   var endDate = that.data.tomorrow;
  //   console.log(startDate);
  //   console.log('入住时间礼拜' + new Date(startDate).getDay())
  //   console.log('离店时间礼拜' + new Date(endDate).getDay())
  //   console.log(endDate);
  //   wx.navigateTo({
  //     url: '../calendar/calendar?startDate=' + startDate + "&endDate=" + endDate
  //   })
  // },
  // canvasIdErrorCallback: function (e) {
  //   wx.canvasToTempFilePath({
  //     x: 0,
  //     y: 0,
  //     width: 50,
  //     height: 50,
  //     destWidth: 100,
  //     destHeight: 100,
  //     canvasId: 'myCanvas',
  //     success: function (res) {
  //       console.log(res.tempFilePath)
  //     }
  //   })
  //   const ctx = wx.createCanvasContext('myCanvas')
  //   wx.chooseImage({
  //     success: function (res) {
  //       console.log(res)
  //       ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
  //       ctx.draw()
  //     }
  //   })
  // },
  //事件处理函数
  onLoad: function () {
    var that = this

    // var context = wx.createCanvasContext('firstCanvas')
    // console.log(context)

    // wx.canvasToTempFilePath({
    //   x: 100,
    //   y: 200,
    //   width: 50,
    //   height: 50,
    //   destWidth: 100,
    //   destHeight: 100,
    //   canvasId: 'myCanvas',
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    // 获取网址信息
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
    if (re.type == 1) {
      wx: wx.setStorageSync('hotel', re.seller_id)
    }
    // var location = wx.getStorageSync('location')
    console.log(location);
    that.setData({
      platform: re,
      types: re.type,
      // location: location
    })

    //地理位置
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     console.log(res);
    //     let latitude = res.latitude
    //     let longitude = res.longitude
    //     let op = latitude + ',' + longitude;
    //     app.util.request({
    //       'url': 'entry/wxapp/map',
    //       'cachetime': '0',
    //       data: { op: op },
    //       success: res => {
    //         console.log(res.data);
    //         wx.setStorageSync("location", res.data.result.location)
    //         that.setData({
    //           city: res.data.result.ad_info.city,
    //           location: res.data.result.location
    //         })
    //       }
    //     })
    //   }
    // })
    this.reload()
  },
  reload: function (e) {
    var that = this
    console.log(that.data)
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/gettravel',
      'cachetime': '1800',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        var hotel = res.data
        if (hotel.length == 0) {
          wx.showToast({
            title: '暂无相关信息',
          })
          return false;
        }
        for (let i = 0; i < hotel.length; i++) {
          console.log(hotel);
          if (typeof hotel[i].img == 'string') {
            hotel[i].img = hotel[i].img.split(",")
          }
          /**
          // 获取酒店的经纬度
          var lat = hotel[i].coordinates
          var ss = lat.split(",")
          hotel[i].lat2 = ss[0]
          hotel[i].lng2 = ss[1]
          // 获取两者之间的距离
          var lat1 = that.data.location.lat
          var lng1 = that.data.location.lng
          var lat2 = ss[0]
          var lng2 = ss[1]
          var radLat1 = lat1 * Math.PI / 180.0;
          var radLat2 = lat2 * Math.PI / 180.0;
          var a = radLat1 - radLat2;
          var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
          var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
          s = s * 6378.137;
          s = Math.round(s * 10000) / 10000;
          var s = s.toFixed(2)
          hotel[i].distance = s
        **/
        }
        that.setData({
          hotel: hotel
        })
        console.log(hotel)
      }
    })
    console.log(this.data)
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
