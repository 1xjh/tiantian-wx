// zh_jd/pages/merchant/merchant.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mycollectId:[],
    mycollect:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this


    app.util.request({
      'url': 'index/Accommoda/getCollRoom',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        var mycollect = res.data.data
        var mycollectId = res.data
        that.setData({
          mycollect:mycollect,
          mycollectId: mycollectId
        })
        console.log(that.data.mycollect)
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