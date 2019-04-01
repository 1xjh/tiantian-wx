// zh_jd/pages/mylist/details.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      
  },
  d_call: function (e) {
    wx.makePhoneCall({
      phoneNumber: '88888' // 仅为示例，并非真实的电话号码
    })
  },
  jump_refund:function(e){
    var order_id = e.currentTarget.dataset.id
    wx.showModal({
      title: '退款申请',
      success(res) {
        if (res.confirm) {
          var that = this
          var refund = order_id
          app.util.request({
            'url': 'index/Order/drawback_order',
            'cachetime': '0',
            "method": "post",
            data: {
              order_id: refund
            },
            success: function (res) {
              console.log(res,"详情")
              if (res.data.success==1){
                  wx.navigateTo({
                    url: ' refund?order_id=' + refund
                  })
              }else if(res.data.success==-4){
                wx.showToast({
                  title: '离入住24小时，不能退款',
                  icon: 'none',
                  duration: 1000,
                  mask: true,
                })
              }else{
                wx.showToast({
                  title: '退款失败',
                  icon: 'none',
                  duration: 1000,
                  mask: true,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  refund_details:function(e){
    var order_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: ' refund?order_id=' + order_id
    })
  },
  // 查看地图
  intoMap: function () {
    var that = this
    wx.openLocation({
      latitude: parseFloat(that.data.order.longitude),
      longitude: parseFloat(that.data.order.latitude),
      name: that.data.order.address,
      address: that.data.order.seller_name,
      scale: 28
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this
    var order_id = options.order_id
    app.util.request({
      'url': 'index/Order/orderDetail',
      'cachetime': '0',
      data: {
        order_id: order_id
      },
      success: function (res) {
        console.log(res.data.data)
       that.setData({
            order:res.data.data
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