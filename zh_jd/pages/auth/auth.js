var app = getApp();
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
    
  },
  bindGetUserInfo(e) {
    var that = this
    var user_info = e.detail.userInfo //用户信息
    wx.setStorageSync("user_info", user_info)
    that.setData({
      avatarUrl: user_info.avatarUrl,
      nickName: user_info.nickName
    })
    var encryptedData = e.detail.encryptedData
    var iv = e.detail.iv;
    // 发送请求
    wx.login({
      success: function (res) {
        console.log(res)
        var code = res.code
        if (code) {
          app.util.request({
            'url': 'index/Info/getWxUserInfo',
            'cachetime': '0',
            data: {
              code: code
            },
            success: function (res) {
              wx.setStorageSync("is_lgoin", true)
              that.setData({
                isLogin: !that.data.isLogin
              })
              // 返回上一页
              wx.navigateBack({
                delta: 1
              })
              if (res.data.success == 2) {
                // 异步保存用户登录信息
                wx.setStorageSync('token', res.data.data.user_token);
                wx.setStorageSync('users', res.data.data);
                console.log("我跟新了vip  1号")
                wx.setStorageSync('vip', res.data.data.member.name)
                that.setData({
                  vip: res.data.data.member.name
                })
                return 1;
              }
              wx.setStorageSync("key", res.data.session_key)
              var session_key = res.data.data.session_key;
              var img = that.data.avatarUrl
              var name = that.data.nickName
              // 异步保存用户openid
              wx.setStorageSync("openid", res.data.data.openid)
              var openid = res.data.openid
              // 获取用户登录信息
              app.util.request({
                'url': 'index/Info/getallUserInfo',
                'cachetime': '0',
                "method": "post",
                data: {
                  encryptedData: encryptedData,
                  iv: iv,
                  session_key: session_key
                },
                success: function (res) {
                  // 异步保存用户登录信息
                  wx.setStorageSync('token', res.data.data.user_token);
                  wx.setStorageSync('users', res.data.data);
                  wx.setStorageSync('vip', res.data.data.member.name)
                  that.setData({
                    vip: res.data.data.member.name
                  })
                },
              })
            },
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '授权获取用户信息失败！',
            confirmText: '重新获取',
            success: function (res) {
              // console.log(res)
              if (res.confirm) {
                wx.reLaunch({
                  url: '../auth/auth',
                })
              } else if (res.cancel) {
                that.onLoad()
              }
            }
          })
        }
      },
    })
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    wx.showShareMenu({
      withShareTicket: true
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