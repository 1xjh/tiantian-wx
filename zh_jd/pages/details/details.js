
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
    vip:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isLogin = wx.getStorageSync("is_lgoin")
    var vip = wx.getStorageSync("users");
    if (vip){
      vip = vip.member.value == 10 ? 1 : vip.member.value * 0.1
      console.log(vip, "我的vip")
    }
    this.setData({
      isLogin: isLogin,
      vip:vip
    })
    //首页进来的条件，要缓存
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
    if (options.saixuan) {
      var saixuan=JSON.parse(options.saixuan);
      this.data.parameter.room_num = saixuan.room_num;
      this.data.parameter.room_price = saixuan.room_price;
      this.data.parameter.room_type = saixuan.room_type;
      if (saixuan.bed_num>0){
        this.data.parameter.bed_num = saixuan.bed_num;
      }
      if (saixuan.people_num>0){
       this.data.parameter.people_num = saixuan.people_num;
      }

    }

      request(this);
  },
  jumpDetails:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../yuanzi_details/yuanzi_details?id='+id
    })
  },
  // 搜索
  searchList:function(e){
    var value = e.detail.value
    var parameter = wx.getStorageSync("parameter")
    app.util.request({
      'url': 'index/Accommoda/getBywhereAccommoda',
      'cachetime': '0',
      data:parameter,
      success: function (res) {
        console.log(res,"搜索的实时数据")
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
    var that = this
    request(that,1);
    that.setData({
      page:1
    })
    wx.stopPullDownRefresh();
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
        console.log(res,"ddddddddddd");
        if(res.data.success==1){
          var res = res.data.data;
          if (e.data.page !=1) {
            var tmp = e.data.room_list;
            for (var i = 0; i < res.length; i++) {
              tmp.push(res[i]);
            }
            console.log("我的数据1")
            e.setData({
              room_list: tmp
            })
          }else{
            console.log("我的数据2")
            e.setData({
              room_list: res,
            })
          }
        }else{
          console.log("我的数据3")
          e.setData({
            isList:true
          })
        }
       
      },
    })
 
}