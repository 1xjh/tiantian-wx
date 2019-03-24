// zh_jd/pages/yuanzi_details/facility.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    app.util.request({
      'url': 'index/Accommoda/getRoomDetail',
      'cachetime': '0',
      data: {
        id: 49
      },
      success: function (res) {
        that.setData({
          icon: res.data.data.setting,
        })
        console.log(that.data.icon)
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