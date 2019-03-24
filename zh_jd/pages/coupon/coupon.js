// zh_jd/pages/coupon/coupon.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noSelect: '../../images/coupon_1.png',
    hasSelect: '../../images/coupon_2.png',
    coupon: [],
    coupon_inex: 0,
    selected_effective: true,
    selected_already: false,
    selected_overdue: false
  },
  selected_effective: function(e) {
    var that = this
    that.setData({
      selected_effective: true,
      selected_already: false,
      selected_overdue: false,
    })
  },
  selected_already: function(e) {
    var that = this
    that.setData({
      selected_effective: false,
      selected_already: true,
      selected_overdue: false,
    })
  },
  selected_overdue: function(e) {
    var that = this
    that.setData({
      selected_effective: false,
      selected_already: false,
      selected_overdue: true,
    })
  },
  // 使用优惠券
  coupon: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index; //下标
    var coupon = that.data.coupon[index].preferential; //优惠价格
    var id = that.data.coupon[index].id; //优惠id
    // console.log(that.data.price)
    if (that.data.price != undefined) {
      console.log(999999)
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.setData({
        coupon_price: coupon,
        coupons_id: id
      })
      wx: wx.navigateBack({
        url: '../orders/orders'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options.price != undefined) {
      that.setData({
        price: options.price
      })
    }
    that.reload()
  },
  // 下拉刷新
  reload: function(e) {
    var that = this
    // 获取当前系统时间
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds();
      return currentdate;
    }
    var time = getNowFormatDate()
    var current_time = time.slice(0, 10) //当前时间
    console.log(time)
    // 获取优惠券集合
    app.util.request({
      'url': 'index/Info/coupon_list',
      'cachetime': '0',
      data: {},
      success: function(res) {
        that.setData({
          coupon: res.data.data
        })
      },
    })
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
    this.reload()
    wx.stopPullDownRefresh()
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