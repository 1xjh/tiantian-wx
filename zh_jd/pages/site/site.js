var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItems: '',
    navIndex: 0,
    res: [],
    SlideActive: "",
  },
  tapJump(e) {
    let that = this;
    var index = e.target.dataset.index;
    console.log(index)
    if (index > that.data.navIndex) {
      that.setData({
        navItems:this.data.res[index]["son"],
        SlideActive: "activeUp"
      })
    } else {
      that.setData({
        SlideActive: "activeDn"
      })
    }
    that.setData({
      navIndex: index
    })
  },
  category(e){
    console.log(e)
  }, 
  // getDetails() {
  //   wx.request({
  //     url: 'http://192.168.43.137:7070/category',
  //     success: res => {
  //       console.log(res.data)
  //       this.setData({
  //         res: res.data.data.ctgList
  //       })
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.util.request({
      'url': 'index/Info/getTourist',
      'cachetime': '0',
      data: {},
      success: function (res) {
      console.log(res)
      
        that.setData({
          navItems: res.data.data[0]["son"],
          res:res.data.data
        })
        console.log(that.data.navItems)
        console.log(that.data.res)
      }
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