// zh_jd/pages/orders/append.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tapIndex: "身份证",
    bindKeyName: '',
    bindKeyCredentials: '',
    bindKeyPhone: [],
  },
  onlyType: function() {
    var that = this
    wx.showActionSheet({
      itemList: ['身份证', '护照', '军官证'],
      success(res) {
        console.log(res.tapIndex)
        if(res.tapIndex==0){
          that.setData({
            tapIndex:"身份证"
          })
        }else if(res.tapIndex==1){
          that.setData({
            tapIndex: "护照"
          })
        }else{
          that.setData({
            tapIndex: "军官证"
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 输入的姓名
  bindKeyName: function(e) {
    console.log(e.detail.value)
    this.setData({
      bindKeyName: e.detail.value
    })
  },
  // 输入的证件号
  bindKeyCredentials: function(e) {
    console.log(e.detail.value)
    this.setData({
      bindKeyCredentials: e.detail.value
    })
  },
  //输入的手机号
  bindKeyPhone: function(e) {
    this.setData({
      bindKeyPhone: e.detail.value
    })
    console.log(this.data.bindKeyPhone)
  },
  baoCun: function() {
    if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(this.data.bindKeyName))){
      wx.showToast({
        title: '姓名有误',
        duration: 2000,
        icon: 'none'
      });

    }else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.bindKeyCredentials))) {
      wx.showToast({
        title: '身份证有误',
        duration: 2000,
        icon: 'none'
      });
    } else if (!(/^1[34578]\d{9}$/.test(this.data.bindKeyPhone))){
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        icon: 'none'
      });
    } else{
      app.util.request({
        'url': 'index/Accommoda/subcheck_in',
        'cachetime': '0',
        "method": "post",
        data: {
          name:this.data.bindKeyName,
          credentials: this.data.tapIndex,
          credentials_num:this.data.bindKeyCredentials,
          phone:this.data.bindKeyPhone
        },
        success: function (res) {
          console.log(res)
          if (res.data.success==1){
            // wx.navigateTo({
            //   url: 'my_user',
            // })
            wx.navigateBack({
              delta: 1
            })
          }
        },
      })  
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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