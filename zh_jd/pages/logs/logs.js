//logs.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: '',
    nickName: '',
    isLogin:false,
    vip:"普通会员"
  },
  // 优惠券
  collect: function() {
    wx.navigateTo({
      url: '../mycollect/mycollect',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this
    wx.getSetting({
      success(res) {
        var islogin = wx.getStorageSync("is_lgoin")
        if (islogin == true) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          var user_info = wx.getStorageSync('user_info')
          var vip = wx.getStorageSync('vip')
          var avatarUrl = user_info.avatarUrl;
          var nickName = user_info.nickName;
          that.setData({
            avatarUrl: avatarUrl,
            nickName: nickName,
            isLogin: !that.data.isLogin,
            vip: vip
          })
        }
      }
    })
    that.reload()
  },
  // 登录
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
      success: function(res) {
        console.log(res)
        var code = res.code
        if (code) {
          app.util.request({
            'url': 'index/Info/getWxUserInfo',
            'cachetime': '0',
            data: {
              code: code
            },
            success: function(res) {
              console.log(res,"kkkkkkkkkkkkkkkkkkk")
              wx.setStorageSync("is_lgoin", true)
                that.setData({
                  isLogin:!that.data.isLogin
                })
              if(res.data.success==2){
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
                success: function(res) {
                  // 异步保存用户登录信息
                  wx.setStorageSync('token', res.data.data.user_token);
                  wx.setStorageSync('users', res.data.data);
                  console.log("我又在跟新了会员我是2号")
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
            success: function(res) {
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
  // 退出
  secLogin(e){
    var that=this
    wx.showModal({
      title: '请确认是否退出登录',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync("user_info")
          wx.removeStorageSync("is_lgoin")
          wx.removeStorageSync('users')
          wx.removeStorageSync("token")
          that.setData({
            isLogin: false,
            avatarUrl: '',
            nickName: '',
            vip:''
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 意见反馈
  jumpFeedback:function(){
      if(this.data.isLogin){
       wx.navigateTo({
         url:"../feedback/feedback",
       })
      }else{
        wx.navigateTo({
          url: '../auth/auth',
        })
      }
  },
  // 我的优惠卷
  jumpCoupon: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '../coupon/coupon',
      })
    } else {
      wx.navigateTo({
        url: '../auth/auth',
      })
    }
  },
  // 名宿入驻
  jumpCheck: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '../check/check',
      })
    } else {
      wx.navigateTo({
        url: '../auth/auth',
      })
    }
  },
  // 会员升级
  jumpMember:function(){
    if (this.data.isLogin) {
      wx.navigateTo({
        url:'../member/member',
      })
    } else {
      wx.navigateTo({
        url: '../auth/auth',
      })
    }
  },
  // 开具发票
  // 会员升级
  jumpCheck: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        // url:'../member/member'
         url: '../check/check',
      })
    } else {
      wx.navigateTo({
        url: '../auth/auth',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // 刷新
  reload:function(){
    var that =this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.screenHeight,
          screenWidth: res.screenWidth,
        });
      }
    })
  },

  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that =this
    var isToKen = wx.getStorageSync("token")
    console.log(isToKen,"有没有")
    if (isToKen!=""){
      app.util.request({
        'url': 'index/Info/getUserBytoken',
        'cachetime': '0',
        data: {},
        success: function (res) {
          console.log(res, "购买的数据")
          var isLogin = wx.getSStorageSync("is_lgoin")
          var avatarUrl = wx.getStorageSync("user_info")
          wx.setStorageSync('vip', res.data.data.member.name)
          that.setData({
            vip: res.data.data.member.name,
            nickName: res.data.data.name,
            avatarUrl: avatarUrl.avatarUrl,
            isLogin: isLogin
          })
        },
      })
    }

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
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    that.reload()
    wx.stopPullDownRefresh();
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