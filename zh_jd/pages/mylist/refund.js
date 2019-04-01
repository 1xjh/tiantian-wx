// zh_jd/pages/mylist/ refund.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      refund:[]
  },
  r_call: function (e) {
    wx.makePhoneCall({
      phoneNumber: '88888' // 仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var refund = options.order_id
    console.log(refund,"dfsdfsdfsdfsdfsd")
    app.util.request({
      'url': 'index/Order/drawback_detail',
      'cachetime': '0',
      "method": "post",
      data: {
        order_id: refund
      },
      success: function (res) {
        console.log(res,"pppppppppppppp")
        that.setData({
          refund: res.data.data
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
    wx.reLaunch({
      url: '../mylist/mylist'
    })
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