// zh_jd/pages/yuanzi_details/dianping.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    id:65,
    info_one:[],
    toggleIndex:"",
  },
  toggle: function (e) {
    var value = !this.data.isShow;
    var index = e.target.dataset.index
    this.setData({
      toggleIndex:index,
      isShow: value
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    app.util.request({
      'url': 'index/Info/getComment',
      'cachetime': '0',
      data: { id: that.data.id },
      success: function (res) {

      var data=res.data.data;
        
        
      for(var i=0;i<data.info.length;i++){
        data["info"][i]["strleng"]=ziti(data["info"][i]["content"]);
      }

        that.setData({
          info_one: data
        })
        console.log(that.data.info_one)
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

function ziti(str) {
  // 获取还能输入多少字的标签
  var l = str.length;
  var blen = 0;
  for (var i = 0; i < l; i++) {
    if ((str.charCodeAt(i) & 0xff00) != 0) {
      blen++;
    }
    blen++;
  }
  return blen;
}