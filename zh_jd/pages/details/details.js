
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    parameter:{},
    page:1,
    room_list:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //家庭定制
    var that=this;
    options.is_home = 1
      this.setData({
        "parameter" :options       
      })
      request(this);

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
    request(this,1);
    this.setData({
      page:1
    })
    wx.stopPullDownRefresh
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page:this.data.page+1
    })
    request(this,this.data.page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  
})

function request(e,page=1){
  if (e.data.parameter.is_home) {
    app.util.request({
      'url': 'index/Accommoda/gethomelist',
      'cachetime': '0',
      data: {
        page: page
      },
      success: function (res) {
        console.log(res);
        if(res.data.success="1"){
          var res = res.data.data;
          if (e.data.page !=1) {
            var tmp = e.data.room_list;

            for (var i = 0; i < res.length; i++) {
              tmp.push(res[i]);
            }
            e.setData({
              room_list: tmp
            })
          }else{
            e.setData({
              room_list: res
            })
          }
        

        }
       
      },
    })
  }
}