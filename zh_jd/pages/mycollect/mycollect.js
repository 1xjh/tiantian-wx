// zh_jd/pages/merchant/merchant.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotel: [],
  },
  onLoad: function (options) {
    var that = this
    console.log(options)
    
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    console.log(that.data)
    var user_id = wx.getStorageSync('users').id
    // 获取多商家集合
    app.util.request({
      'url': 'entry/wxapp/getmycollect',
      'cachetime': '0',
      data:{user_id:user_id},
      success: function (res) {
        console.log(res)
        var hotel = res.data
      /** 计算距离 查找最低价格
        for (let i = 0; i < hotel.length; i++) {
          // 获取酒店的经纬度
          var lat = hotel[i].coordinates
          var ss = lat.split(",")
          hotel[i].lat2 = ss[0]
          hotel[i].lng2 = ss[1]
          // 获取两者之间的距离
          var lat1 = that.data.lat1
          var lng1 = that.data.lng1
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
          // 获取最低价格
          app.util.request({
            'url': 'entry/wxapp/getroom',
            'cachetime': '0',
            data: { seller_id: res.data[i].id },
            success: function (res) {
              // 改变数据结构
              var list = []
              res.data.map(function (item) {
                var obj = {};
                obj = item.online_price;
                list.push(obj);
              })
              //数组进行排序，得到最小的数值
              var compare = function (a, b) {
                var a = a.price
                var b = b.price
                if (a < b) {
                  return -1
                } else if (a > b) {
                  return 1
                } else {
                  return 0
                }
              }
              var list = list.sort(compare)
              console.log(list)
              if (list.length == null || list.length == 0) {
                var price = 0
              } else {
                var price = list[0]
              }
              hotel[i].price = Number(price)
              if (hotel[i].star == '暂无星级(经济型)') {
                hotel[i].num = 1
              } else if (hotel[i].star == '三星级') {
                hotel[i].num = 3
              } else if (hotel[i].star == '四星级') {
                hotel[i].num = 4
              } else if (hotel[i].star == '五星级') {
                hotel[i].num = 5
              }
              // 获取评价数量
              app.util.request({
                'url': 'entry/wxapp/assesscount',
                'cachetime': '0',
                data: { seller_id: hotel[i].id },
                success: function (res) {
                  hotel[i].total = res.data.total
                  hotel[i].ol = '不知道什么'
                  that.setData({
                    hotel: hotel,
                    hotel1: hotel
                  })
                },
              })
            }
          })
        }
      **/
        that.setData({
          hotel: hotel
        })
        console.log(hotel)
      }
    })
    app.util.request({
      'url': 'entry/wxapp/attachurl',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    that.reload()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})