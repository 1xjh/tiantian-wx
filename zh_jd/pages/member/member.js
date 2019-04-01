// zh_jd/pages/member/member.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:[],
    price:'0',
    navIndex:0,
  },
  price:function(e){
      console.log(e)
      this.setData({
        navIndex: e.currentTarget.dataset.index,
        price:e.currentTarget.dataset.price,
        id:e.currentTarget.dataset.id,
      })
  },
  // 支付接口
  playgo:function(e){
    var that = this

    app.util.request({
      'url': 'index/Pay/recharge_member',
      data: { id: that.data.id },
      "method": "post",
      success: function (res) { //后端返回的数据
        console.log(res)
        var data = res.data;
        wx.requestPayment({
          timeStamp: data['timeStamp'],
          nonceStr: data['nonceStr'],
          package: data['package'],
          signType: data['signType'],
          paySign: data['paySign'],
          success: function (res) {
            if (res.errMsg == "requestPayment:ok") {            
              that.onLoad()
              wx.redirectTo({
                url: '../yuding/yuding',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })

            }
            wx.showModal({
              title: '支付成功',
              content: '',
            })

          },
          fail: function (res) {

          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    app.util.request({
      'url': 'index/Info/getLevel',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          member:res.data.data,
          price: res.data.data[0].recharge,
          id: res.data.data[0].id
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