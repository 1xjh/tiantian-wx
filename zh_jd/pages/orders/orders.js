// zh_jd/pages/orders/orders.js
var app = getApp();
var Data = require("../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrival_time: "",
    departure_time: "",
    total: [],
    date: '',
    name_id: "0",
    tomorrow: '', //时间
    people: 1, //入住人数
    room: 1, //房间数量人数
    roomStatus: 'normal',
    peopleStatus: 'normal',
    orders: [],
    id: 49,
    coupon_price: 0,
  },
  // 日历时间
  bindViewTap: function() {
    var that = this;
    var startDate = that.data.date;
    var endDate = that.data.tomorrow;
    wx.navigateTo({
      url: '../calendar/calendar?startDate=' + startDate + "&endDate=" + endDate
    })
  },
  // 房间数量加减
  roomMinus: function() {
    var room = this.data.room;
    if (room > 1) {
      room--;
    }
    var roomStatus = room < this.data.total.room_num ? "normal" : "disabled";
    this.setData({
      room: room,
      roomStatus: roomStatus
    })
    console.log(room)
  },
  roomAdd: function() {
    var room = this.data.room;
    if (room < this.data.total.room_num) {
      room++;
    }
    var roomStatus = room < this.data.total.room_num ? "normal" : "disabled"
    this.setData({
      room: room,
      roomStatus: roomStatus
    })
    console.log(room)
  },
  //人数的加减
  peopleMinus: function() {
    var people = this.data.people //人数
    var peopleAll = this.data.total.people_num * this.data.total.room_num //人数的上线
    console.log(peopleAll)
    if (people > 1) {
      people--;
    }
    var peopleStatus = people < peopleAll ? "normal" : "disabled";
    this.setData({
      people: people,
      peopleStatus: peopleStatus
    })
  },
  peopleAdd: function() {
    var people = this.data.people
    console.log(people)
    var peopleAll = this.data.total.people_num * this.data.total.room_num //人数的上线
    console.log(peopleAll)
    if (people < peopleAll) {
      people++;
    }
    var peopleStatus = people < peopleAll ? "normal" : "disabled";
    this.setData({
      people: people,
      peopleStatus: peopleStatus
    })
  },
  // 跳转添加
  jumpAdd: function() {
    wx.navigateTo({
      url: 'my_user',
    })
  },
  // 手机号
  bindPhone: function(e) {
    this.setData({
      bindPhone: e.detail.value
    })
  },
  // 提交订单
  submit: function() {
    var that = this
    var price = that.data.orders.original_price * that.data.room
    if (that.data.name_id == 0) {
      wx.showModal({
        content: '最少添加一位入住人信息',
      })
    } else if (!(/^1[34578]\d{9}$/.test(that.data.bindPhone))) {
      wx.showModal({
        title: '手机号输入错误',
        content: '手机号不能为空',
      })
    } else {
      app.util.request({
        'url': 'index/Order/submitorder',
        'cachetime': '0',
        "method": "post",
        data: {
          goods_id: 49,
          seller_id: that.data.orders.seller_id,
          room_name: that.data.orders.name,
          arrival_time: that.data.arrival_time,
          departure_time: that.data.departure_time,
          days: that.data.time,
          days:30,
          tel: that.data.bindPhone,
          checkids: that.data.name_id,
          room_num: that.data.room,
          people_num: that.data.people,
          seller_name: that.data.orders.s_name
        },
        success: function(res) {
          console.log(res.data.success)
          if (res.data.success == 1) {
            wx.navigateTo({
              url: '../dingdanzhifu/dingdanzhifu?price=' + price,
            })
          } else if (res.data.success == "notstock") {
            wx.showModal({
              title: '提示',
              content: '该时间段没有房源',
            })
          } else {
            wx.showToast({
              title: '系统错误',
              duration: 2000
            })
          }
        },
      })
    }
  },
  // 优惠券
  couponPrice: function() {
    var that = this
    var price = that.data.orders.original_price * that.data.room
    wx.navigateTo({
      url: '../coupon/coupon?price=' + price,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 入住人信息
    app.util.request({
      'url': 'index/Accommoda/getRoomDetail',
      'cachetime': '0',
      data: {
        id: 49
      },
      success: function(res) {
        that.setData({
          orders: res.data.data
        })
      },
    })
    // 床和人的总数量
    if (options.name_id === undefined) {
      return false;
    } else {
      var name_num = options.name_id.split(",")
      console.log(name_num)
      that.setData({
        name_id: options.name_id,
        name_num: name_num
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
    var tomorrow1 = new Date();
    // 默认显示离店日期为第二天
    tomorrow1.setDate((new Date()).getDate() + 1);
    var tomorrow = Data.formatDate(new Date(tomorrow1), "yyyy-MM-dd");
    if (startDate == null) {

      RoomNum(this, this.data.id, date, tomorrow)
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
      RoomNum(this, this.data.id, startDate, endDate)
      var s1 = new Date(startDate.replace(/-/g, "/"));
      var s2 = new Date(endDate.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      // 截取日期只显示月和日
      var seatr_time_one = startDate.slice(5, 10)
      var end_time_one = endDate.slice(5, 10)
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

function RoomNum(e, id, date, tomorrow) {
  app.util.request({
    'url': 'index/Accommoda/getRoomNum',
    'cachetime': '0',
    "method": "post",
    data: {
      id: id,
      arrival_time: date,
      departure_time: tomorrow
    },
    success: function(res) {
      // console.log(res)
      e.setData({
        total: res.data.data,
        arrival_time: date,
        departure_time: tomorrow
      })
    },
  })
}