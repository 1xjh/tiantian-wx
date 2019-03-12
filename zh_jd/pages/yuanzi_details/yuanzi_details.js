// zh_jd/pages/yuanzi_details/yuanzi_details.js
var Data = require("../../utils/data.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    art:'',
    date: '',
    tomorrow: '',
    id:49,
    details:[],
  },
  bindViewTap: function () {
    var that = this;
    var startDate = that.data.date;
    var endDate = that.data.tomorrow;
    // console.log(startDate);
    // console.log('入住时间礼拜' + new Date(startDate).getDay())
    // console.log('离店时间礼拜' + new Date(endDate).getDay())
    // console.log(endDate);
    wx.navigateTo({
      url: '../calendar/calendar?startDate=' + startDate + "&endDate=" + endDate
    })
  },
  synopsis: function (e) {
    var that = this
    wx.navigateTo({
      url: 'synopsis?art=' + that.data.art,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.id=49;
    var that=this;
    app.util.request({
      'url': 'index/Accommoda/getRoomDetail',
      'cachetime': '0',
      data: { id: options.id},
      success: function (res) {
        
        console.log(res.data)
        var art = app.convertHtmlToText(res.data.data.introduction)
        that.setData({
          details:res.data.data,
          art: art
        })
      },
    })
  },
  intoMap: function () {
    wx.openLocation({
      latitude: 22.363480,
      longitude: 113.244220,
      name: "广州市黄埔大道中309-315号",
      address: "广州市黄埔大道中309-315号",
      scale: 28
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
    var startDate = this.data.startDate;
    var endDate = this.data.endDate;
    // 默认显示入住时间为当天
    var date = Data.formatDate(new Date(), "yyyy-MM-dd");
    // console.log(date)
    var tomorrow1 = new Date();
    // 默认显示离店日期为第二天
    tomorrow1.setDate((new Date()).getDate() + 1);
    var tomorrow = Data.formatDate(new Date(tomorrow1), "yyyy-MM-dd");
    console.log(tomorrow)
    if (startDate == null) {
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