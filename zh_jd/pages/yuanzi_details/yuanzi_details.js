// zh_jd/pages/yuanzi_details/yuanzi_details.js
var Data = require("../../utils/data.js");
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    art: '',
    date: '',
    tomorrow: '',
    id: "",
    details: [],
    message: [],
    quan_arr: [],
    noSelect: '../../images/coupon_1.png',
    hasSelect: '../../images/coupon_2.png',
    coupon_index: true,
    isCoupon: false,
    lianZhuTian: ["1"],
    lianZhuzhe: ["1"]
  },
  // 图放大
  previewImg: function (e) {
    var src = e.currentTarget.dataset.src;
    var imgList = e.currentTarget.dataset.effect_pic;
    wx.previewImage({
      current: src, 
      urls: imgList 
    })
  },
  // 跳转到日历
  bindViewTap: function() {
    var that = this;
    var startDate = that.data.date;
    var endDate = that.data.tomorrow;
    wx.navigateTo({
      url: '../calendar/calendar?startDate=' + startDate + "&endDate=" + endDate + "&id=" + that.data.id
    })
  },
  synopsis: function(e) {
    var that = this
    wx.navigateTo({
      url: 'synopsis?art=' + that.data.art,
    })
  },
  // 立即预定
  submitOrder: function(e) {
    var that = this
    if(that.data.isLogin){
      app.util.request({
        "url": "index/Info/chestock",
        'cachetime': '0',
        'method': "post",
        data: {
          id: that.data.id,
          arrival_time: that.data.arrival_time,
          departure_time: that.data.departure_time
        },
        success: function (res) {
          if (res.data.success == 1) {
            wx.navigateTo({
              url: '../orders/orders?date=' + that.data.date + "&tomorrow=" + that.data.tomorrow + "&id=" + that.data.id + "&time=" + that.data.time + "&arrival_time=" + that.data.arrival_time + "&departure_time=" + that.data.departure_time + "&price=" + that.data.price
            })
          } else {
            wx.showToast({
              title: '该时间段无房源',
              icon: 'none',
              duration: 1000,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '../auth/auth',
      })
    }
   
  },
  // 便利设施
  facility: function(e) {
    var that = this
    wx.navigateTo({
      url: 'facility?id=' + that.data.details.id,
    })
  },
  // 评论
  jump_dianping: function(e) {
    var that = this
    wx.navigateTo({
      url: 'dianping?id=' + that.data.details.id,
    })
  },

  jump_call: function(e) {
    wx.makePhoneCall({
      phoneNumber: '88888' // 仅为示例，并非真实的电话号码
    })
  },
  // 优惠卷
  coupon: function(e) {
    var that = this
    if(that.data.isLogin){
      var index = e.currentTarget.dataset.index;
      var coupon = that.data.coupon;
      console.log(coupon[index].state)
      if (coupon[index].state === 0) {
        app.util.request({
          'url': 'index/Accommoda/drawcoupon',
          'cachetime': '0',
          'method': "post",
          data: {
            id: coupon[index].id
          },
          success: function (res) {
            if (res.data.success == 1) {
              coupon[index].state = 2
              that.setData({
                coupon: coupon,
              })
            } else {
              console.log("优惠券以使用")
            }
          },
        })
      } else {
        wx.showToast({
          title: '优惠卷以领取',
          icon: "none",
          duration: 500,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }else{
      wx.navigateTo({
        url: '../auth/auth',
      })
    }
  },
  junmpCoupon: function(e) {
    var that = this
    var isShow = that.data.coupon_index ? false : true;
    that.setData({
      coupon_index: isShow
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id,"这是什么id")
    var that = this;
    var isLogin = wx.getStorageSync("is_lgoin")
    that.setData({
      isLogin: isLogin
    })
    that.setData({
      id: options.id
    })
    that.reload(options)
  },
  // 下拉刷新
  reload: function (options){
    //获取数据
    var that = this
    var isLogin = wx.getStorageSync("is_lgoin")
    that.setData({
      isLogin: isLogin
    })
    app.util.request({
      'url': 'index/Accommoda/getRoomDetail',
      'cachetime': '0',
      data: {
        id: that.data.id
      },
      success: function (res) {
        var art = app.convertHtmlToText(res.data.data.introduction)
        that.setData({
          details: res.data.data,
          art: art,
          coupon: res.data.data.coupon
        })
        // 获取连住优惠
        var favourable = res.data.data.favourable
        for (var b = 0; b < favourable.length; b++) {
          var a = favourable[b].day
          var b = favourable[b].Sale
          that.data.lianZhuTian.push(a)
          that.data.lianZhuzhe.push(b)
        }
        prices(that, false)
      },
    })
    //留言
    app.util.request({
      'url': 'index/Info/getComment',
      'cachetime': '0',
      data: {
        id: that.data.id
      },
      success: function (res) {
        // var message = res.data.data.info
        that.setData({
          message: res.data.data.info
        })
        // 周边
        wx.getStorage({
          key: 'city',
          success: function (res) {
            quna(that, res.data)
          }
        })
      },
    })
  },
  // 地图定位
  intoMap: function() {
    var that = this
    wx.openLocation({
      latitude: parseFloat(that.data.details.longitude),
      longitude: parseFloat(that.data.details.latitude),
      name: that.data.details.address,
      address: that.data.details.name,
      scale: 28
    })
  },
  jumpdDetails:function(e){
    wx.navigateTo({
      url: '../yuanzi_details/yuanzi_details?id=' + e.currentTarget.dataset.id
    })
  },
  // 收藏
  collect: function(e) {
    var that = this
    if(that.data.isLogin){
      var url = this.data.details.collect ? 'index/Accommoda/quxiaoCollRomm' : 'index/Accommoda/collectRoom';
      app.util.request({
        'url': url,
        "method": "post",
        data: {
          id: that.data.details.id,
        },
        success: function (res) {
          if (res.data.success == 1) {
            that.data.details.collect = !that.data.details.collect;
            that.setData({
              details: that.data.details
            })
            // 返回更新数据
            var pages = getCurrentPages();
            if (pages.length > 1) {
              var prePage = pages[pages.length - 2];
              prePage.onLoad()
            }
          }
          wx.showToast({
            title: res.data.msg,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '../auth/auth',
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var startDate = this.data.startDate;
    var endDate = this.data.endDate;
    // 默认显示入住时间为当天
    var date = Data.formatDate(new Date(), "yyyy-MM-dd");
    // console.log(date,999999999999)
    var tomorrow1 = new Date();
    // 默认显示离店日期为第二天
    tomorrow1.setDate((new Date()).getDate() + 1);
    var tomorrow = Data.formatDate(new Date(tomorrow1), "yyyy-MM-dd");
    // console.log(tomorrow,"999999999")

    if (startDate == null) {
      this.setData({
        arrival_time: date,
        departure_time: tomorrow
      })
      console.log(1111111111111111111111111)
      var s1 = new Date(date.replace(/-/g, "/"));
      var s2 = new Date(tomorrow.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      if (new Date(date).getDay() == 0) {
        starttime = date.slice(5, 10) + '日';
      } else if (new Date(date).getDay() == 1) {
        starttime = date.slice(5, 10) + '日';
      } else if (new Date(date).getDay() == 2) {
        starttime = date.slice(5, 10) + '日';
      } else if (new Date(date).getDay() == 3) {
        starttime = date.slice(5, 10) + '日';
      } else if (new Date(date).getDay() == 4) {
        starttime = date.slice(5, 10) + '日';
      } else if (new Date(date).getDay() == 5) {
        starttime = date.slice(5, 10) + '日';
      } else if (new Date(date).getDay() == 6) {
        starttime = date.slice(5, 10) + '日';
      }
      if (new Date(tomorrow).getDay() == 0) {
        endtime = tomorrow.slice(5, 10) + '日'
      } else if (new Date(tomorrow).getDay() == 1) {
        endtime = tomorrow.slice(5, 10) + '日';
      } else if (new Date(tomorrow).getDay() == 2) {
        endtime = tomorrow.slice(5, 10) + '日';
      } else if (new Date(tomorrow).getDay() == 3) {
        endtime = tomorrow.slice(5, 10) + '日';
      } else if (new Date(tomorrow).getDay() == 4) {
        endtime = tomorrow.slice(5, 10) + '日';
      } else if (new Date(tomorrow).getDay() == 5) {
        endtime = tomorrow.slice(5, 10) + '日';
      } else if (new Date(tomorrow).getDay() == 6) {
        endtime = tomorrow.slice(5, 10) + '日';
      }
      // console.log(starttime.replace(/-/g, '月'))
      var starttime = starttime.replace(/-/g, '月'); //转成月份
      var endtime = endtime.replace(/-/g, '月'); //转成月份

      this.setData({
        startDate: date,
        endDate: tomorrow,
        date: starttime,
        tomorrow: endtime,
        time: time
      });
    } else {
      this.setData({
        arrival_time: startDate,
        departure_time: endDate
      })
      console.log(date, 113333333333333321111)
      var s1 = new Date(startDate.replace(/-/g, "/"));
      var s2 = new Date(endDate.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      // 截取日期只显示月和日
      var seatr_time_one = startDate.slice(5, 10)
      var end_time_one = endDate.slice(5, 10)
      // console.log(seatr_time_one)
      // console.log(end_time_one)
      // 入住日期
      if (new Date(startDate).getDay() == 0) {
        var starttime = seatr_time_one + '日'
      } else if (new Date(startDate).getDay() == 1) {
        var starttime = seatr_time_one + '日'
      } else if (new Date(startDate).getDay() == 2) {
        var starttime = seatr_time_one + '日'
      } else if (new Date(startDate).getDay() == 3) {
        var starttime = seatr_time_one + '日'
      } else if (new Date(startDate).getDay() == 4) {
        var starttime = seatr_time_one + '日'
      } else if (new Date(startDate).getDay() == 5) {
        var starttime = seatr_time_one + '日'
      } else if (new Date(startDate).getDay() == 6) {
        var starttime = seatr_time_one + '日'
      }

      // 离店日期
      if (new Date(endDate).getDay() == 0) {
        var endtime = end_time_one + '日'
      } else if (new Date(endDate).getDay() == 1) {
        var endtime = end_time_one + '日'
      } else if (new Date(endDate).getDay() == 2) {
        var endtime = end_time_one + '日'
      } else if (new Date(endDate).getDay() == 3) {
        var endtime = end_time_one + '日'
      } else if (new Date(endDate).getDay() == 4) {
        var endtime = end_time_one + '日'
      } else if (new Date(endDate).getDay() == 5) {
        var endtime = end_time_one + '日'
      } else if (new Date(endDate).getDay() == 6) {
        var endtime = end_time_one + '日'
      }
      var starttime = starttime.replace(/-/g, '月'); //转成月份
      var endtime = endtime.replace(/-/g, '月');
      this.setData({
        startDate: startDate,
        endDate: endDate,
        date: starttime,
        tomorrow: endtime,
        time: time
      });
    }
    prices(this, true)
    var that =this
    that.reload()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    that.reload()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
// 周边房态
function quna(e, city) {
  app.util.request({
    'url': 'index/Accommoda/getBywhereAccommoda',
    'cachetime': '0',
    data: {
      "city": city
    },
    success: function(res) {
      e.setData({
        quan_arr: res.data.data
      })
    },
  })
}
function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}
// 计算价格
function prices(e, isPrice) {
    var k = e.data
  if (e.data.isLogin){
    var vip = wx.getStorageSync("users")
    vip = vip.member.value == 10 ? 1 : vip.member.value * 0.1
    if (isPrice) {
      for (var m = 0; m < k.lianZhuTian.length; m++) {
        if (k.time >= k.lianZhuTian[m]) {
          var a = k.lianZhuzhe[m]
        }
      }
      var a = a == 1 ? a : parseFloat(a * 0.1)
      var price = k.details.online_price * k.time * vip * a
      price = toDecimal2(price)
      e.setData({
        price: price
      })
    } else {
      for (var m = 0; m < k.lianZhuTian.length; m++) {
        if (k.time >= k.lianZhuTian[m]) {
          var a = k.lianZhuzhe[m]
        }
      }
      var a = a == 1 ? a : parseFloat(a * 0.1)
      var price = k.details.online_price * k.time * vip * a
      price = toDecimal2(price)
      e.setData({
        price: price
      })
    }
  } else {
    if (isPrice){
      for (var m = 0; m < k.lianZhuTian.length; m++) {
        if (k.time >= k.lianZhuTian[m]) {
          var a = k.lianZhuzhe[m]
        }
      }
      var a = a == 1 ? a : parseFloat(a * 0.1)
      var price= k.details.online_price * k.time * a
      price = toDecimal2(price)
      e.setData({
        price: price
      })
    }else{
      for (var m = 0; m < k.lianZhuTian.length; m++) {
        if (k.time >= k.lianZhuTian[m]) {
          var a = k.lianZhuzhe[m]
        }
      }
      var a = a == 1 ? a : parseFloat(a * 0.1)
      var price = k.details.online_price * k.time * a
      price = toDecimal2(price)
      e.setData({
        price: price
      })
    }
  }
 
}