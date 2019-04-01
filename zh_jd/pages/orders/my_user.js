// zh_jd/pages/orders/my_user.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    noSelect: '../../images/yuandian.png',
    hasSelect: '../../images/yuandian1.png',
    items: [],
    tapIndex:[],
    name_id:"0"
  },
  xuan:function(e){
    console.log(e)
    var that =this
    var i = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var items = that.data.items;
    items[i].check = !items[i].check;
    that.setData({
      items: items
    })
    console.log(that.data.items);
    if(items[i].check==true){
      that.data.tapIndex.push(id);
      that.setData({
        tapIndex: that.data.tapIndex
      })
    }else{
      var data=that.data.tapIndex.filter(item => item!=id)
      that.setData({
        tapIndex: data
      })
    }
    var tapIndex = that.data.tapIndex.join(",",tapIndex)
    that.setData({
      name_id: tapIndex
    })
    console.log(that.data.name_id)
  },
  baoCun:function(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var name_num = this.data.name_id.split(",")
    prevPage.setData({
      name_id: this.data.name_id,
      name_num:name_num
    })
    wx: wx.navigateBack({
      url: '../orders/orders'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function(options) {
    var that =this
    that.reload()
  },
  reload:function(){
    var that = this
    app.util.request({
      'url': 'index/Accommoda/getUserChech',
      'cachetime': '0',
      success: function (res) {
        var data = res.data.data;

        for (var i = 0; i < data.length; i++) {
          data[i].check = false;
        }

        that.setData({
          items: res.data.data
        })
        console.log(that.data.items);
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
    var that = this
    that.reload()
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