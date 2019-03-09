// pages/ruzhu/ruzhu.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeCount:false,
    hour: 0,
    minute: 0,
    second:0,
    mop: [
      {
        url: '湖北省武汉市蔡甸大街208号',
        phone: '027-25412587'
      }
    ]
  },
  
  // 点击取消订单
  click2: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.oid
    console.log(order_id)
    app.util.request({
      'url': 'entry/wxapp/cancelorder',
      'cachetime': '0',
      data: { order_id: order_id },
      success: function (res) {
        console.log(res)
        wx:wx.reLaunch({
          url: '../mylist/mylist',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var order_id = options.order_id
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    // 获取订单详情
    app.util.request({
      'url': 'entry/wxapp/orderdetails',
      'cachetime': '0',
      data: { order_id: order_id },
      success: function (res) {
        console.log(res)
        // var arrival_time = getel(arrival_time)
        var order = res.data
        order.arrival_time = order.arrival_time.slice(0,10)
        order.departure_time = order.departure_time.slice(0, 10)
        var addtime = parseInt(order.addtime)
        var nowtime = parseInt(order.nowtime)
        var lasttime = addtime +30 * 60-nowtime;
        console.log(addtime)
        console.log(nowtime)
        console.log(lasttime)
        clearInterval(that.data.timer);
        if(order.status==0&&lasttime>0){
          var r = setInterval(function () {
            lasttime -= 1
            if (lasttime >= 0) {
              that.formatSeconds(lasttime)
            }
          }, 1e3)
        }
        
        that.setData({
          order:res.data,
          // arrival_time: arrival_time
        })
        app.util.request({
          'url': 'entry/wxapp/gethotel',
          'cachetime': '0',
          data:{id:that.data.order.seller_id},
          success: function (res) {
            console.log(res)
            var seller = []
            for(let index in res.data){
              if (order.seller_id == res.data[index].id){
                  seller.push(res.data[index])
              }
            }
            console.log(seller)
            that.setData({
              seller: seller[0]
            })
          },
        })
      },
    })
  },
  formatSeconds: function (value) {
    var t = this;
    var theTime = parseInt(value);
    var theTime1 = 0;
    var theTime2 = 0;
    if (theTime > 60) {
      theTime1 = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60);
        theTime1 = parseInt(theTime1 % 60)
      }
    }
    console.log(parseInt(value))
    var order = t.data.order;
    if (parseInt(value)>0){
      var timeCount = true
    }else{
      var timeCount = false
      app.util.request({
        'url': 'entry/wxapp/cancelorder',
        'cachetime': '0',
        data: { order_id: order.id },
        success: function (res) {
          console.log(res)
           order.status= 2;
          t.setData({
            order:order
          })
        },
      })
    }
    t.setData({
      hour: theTime2 < 10 ? '0' + theTime2 : theTime2,
      minute: theTime1 < 10 ? '0' + theTime1 : theTime1,
      second: theTime < 10 ? '0' + theTime : theTime,
      timeCount: timeCount
    })
  },
  dizhi: function (e) {
    var that = this
    var latitude = that.data.seller.locations.lat
    var longitude = that.data.seller.locations.lng
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: that.data.seller.name,
      address: that.data.seller.address,
      scale: 28
    })

  },
  // 拨打电话
  call_phone: function () {
    var that = this
    console.log(that)
    wx.makePhoneCall({
      phoneNumber: that.data.seller.link_tel
    })
  },
  pay:function(e){
    var that = this
    console.log(that.data)
    // 订单id
    var order_id = that.data.order.id
    // 订单金额
    var money = that.data.order.dis_cost
    // 获取用户openid
    var openid = wx.getStorageSync('users').openid
    var user_id = wx.getStorageSync('users').id
    var types = wx.getStorageSync('users').type
    app.util.request({
      'url': 'entry/wxapp/pay',
      'cachetime': '0',
      data: { openid: openid, money: money },
      success: function (res) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              duration: 1000
            })
            console.log(order_id)
            // 改变订单状态
            app.util.request({
              'url': 'entry/wxapp/completeorder',
              'cachetime': '0',
              data: { order_id: order_id, types: types, user_id: user_id, pay_way: 'wechat'},
              success: function (res) {
                console.log(res)
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }, 1000)

              },
            })
          },

          'fail': function (res) {
            console.log(res);
            wx.showToast({
              title: '支付失败',
              duration: 1000
            })
            console.log(form_id)
            setTimeout(function () {
              wx.reLaunch({
                url: '../index/index',
              })
            },
            )

          },
        })
      },
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