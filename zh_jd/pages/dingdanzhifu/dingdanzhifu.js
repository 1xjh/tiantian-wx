// pages/daodianzhifu/daodianzhifu.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:'',
    hidden: false,
    fouhidden: true,
    timer: '',//定时器名字
    countDownNum: '0'
  },
  click1: function() {
    this.setData({
      hidden: false,
      fouhidden: true
    })
  },
  click2: function() {
    this.setData({
      hidden: true,
      fouhidden: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 支付按钮
  payment: function() {
    console.log(this.data.order_id);
    // console.log(1111)
    app.util.request({
      'url': 'index/Pay/wxpay',
      data: { order_id: this.data.order_id},
      "method":"post",
      success: function(res) { //后端返回的数据
      console.log(res)
        var data = res.data;
        wx.requestPayment({
          timeStamp: data['timeStamp'],
          nonceStr: data['nonceStr'],
          package: data['package'],
          signType: data['signType'],
          paySign: data['paySign'],
          success: function(res) {
            if (res.errMsg == "requestPayment:ok"){
                wx.navigateTo({
                  url: '../yuding/yuding',
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
            }
            wx.showModal({
              title: '支付成功',
              content: '',
            })

          },
          fail: function(res) {
           
          }
        })
      }
    })
  },

  onLoad: function(options) {
    console.log(options)
    var that = this;
    that.setData({
      countDownNum:options.number,
      price: options.price,
      order_id:options.order_id,
    })
  },

  countDown: function () {
    let that = this;
    var  time = that.data.countDownNum
    let countDownNum = time;//获取倒计时初始值
    that.setData({
      timer: setInterval(function () {
        countDownNum--;
        var times = timestampToTime(countDownNum)
        that.setData({
          countDownNum: times
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          wx.switchTab({
            url: '../index/index',   
          })
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
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
    this.countDown();
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
    wx.reLaunch({
      url: '../index/index'
    })
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

// 时间转换
function timestampToTime(s) {
  var min = Math.floor(s / 60) % 60;
  var sec = s % 60;
  min = add(min);
  sec = add(sec);
  return   min + ':' + sec
}

// 添 0
function add(m) {
  return m < 10 ? '0' + m : m
}