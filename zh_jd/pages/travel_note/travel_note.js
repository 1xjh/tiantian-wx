// zh_jd/pages/travel_note/travel_note.js
var app = getApp()
var WxParse = require('../../resource/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    console.log(id)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    app.util.request({
      url: 'entry/wxapp/gettravel',
      'cachetime': '0',
      data:{id:id},
      success:function(res){
        var travel = res.data[0]
        if (typeof travel.img == 'string') {
          travel.img = travel.img.split(",")
        }
        var article = travel.content
        WxParse.wxParse('article', 'html', article, that, 5);
        travel.create_time = travel.create_time.slice(0,10)
        // console.log(travel)
        that.setData({
          travel:travel
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/attachurl',
      'cachetime': '0',
      success: function (res) {
        // console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
  },
  wxParseImgLoad:function(e){
    console.log(e)
    WxParse.wxParseImgLoad(e)
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