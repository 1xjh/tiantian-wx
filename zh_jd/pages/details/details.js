
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
    
    //首页进来的条件，要缓存
    console.log(options)
    if(options.save==1){
      delete options.save; 
      wx.setStorageSync("parameter", options);
    } 
    if(options.name!=undefined){
      this.setData({
        name:options.name
      })
    }
    this.setData({
      parameter: wx.getStorageSync("parameter"),
    })
    if (options.order_id){
      this.data.parameter.order_id = options.order_id;
    }
    //位置
    if (options.tourist_id) {
      this.data.parameter.tourist_id = options.tourist_id;
    }
      request(this);

  },
  jumpDetails:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../yuanzi_details/yuanzi_details?id='+id
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
  e.data.parameter.city=wx.getStorageSync("city");
  e.data.parameter.page=page;
    app.util.request({
      'url': 'index/Accommoda/getBywhereAccommoda',
      'cachetime': '0',
      data: e.data.parameter,
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