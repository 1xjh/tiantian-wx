// zh_jd/pages/logs/member/charge.js
var app = getApp()
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
    // 用户的id、
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    var user_id = wx.getStorageSync("users").id

    console.log('用户的id为' + ' ' + user_id)
    // 余额总额
    app.util.request({
      'url': 'entry/wxapp/getbalance',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          balance: res.data.amount,
        })
      },
    })

    //获取充值活动
    app.util.request({
      'url': 'entry/wxapp/getactions',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          enough: res.data.enough,
          give: res.data.give,
        })
      },
    })


    var re = wx.getStorageSync('platform')
    console.log(re)
  },
money:function(e){
  console.log(e)
  var money = e.detail.value;
  this.setData({
    money:money
  })
},
submit:function(e){
  var money = this.data.money
  var openid = wx.getStorageSync('users').openid
  var user_id = wx.getStorageSync('users').id
  if (!money||money == 0 || money == '') {
    wx.showToast({
      title: '请输入金额',
      duration: 2000
    })
    return false
  }else{
    app.util.request({
      'url': 'entry/wxapp/pay',
      'cachetime': '0',
      data: { openid: openid, money: money, recharge: true },
      success: function (res) {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            console.log(res)
            app.util.request({
              'url': 'entry/wxapp/balancepayrecord',
              'cachetime': '0',
              data: { user_id: user_id, money: money, types: 2 },
              succss: function (res) {

                wx.showToast({
                  title: '充值 成功',
                  duration: 2000
                })

              }
            })

          },
          'fail': function (res) {
            // setTimeout(function () {
            //   wx.reLaunch({
            //     url: '../logs',
            //   })
            // }, 1000)
            wx.showToast({
              title: '支付失败',
              duration: 2000
            })
          },
          'complete': function (e) {
            setTimeout(function () {
              wx.reLaunch({
                url: '../logs',
              })
            }, 1000)
          }
        })
      },
    })
  }
  
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