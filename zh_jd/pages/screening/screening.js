// zh_jd/pages/screening/screening.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    moren:"无限",//默认显示为
    renShu:0, //入住人数
    chuangShu:0,//入住床数
    renStatus: 'disabled',
    chuangStatus:'disabled',
    huxing: ["一居", "二居", "三居", "四居", "四居以上"],
    discount: ["今日甩卖", "断房特惠","连住优惠"],
    housing:[
      {id:1, title: "整套出租", content: "独享整套房屋" },
      {id:2, title: "独立单间", content:"共享部分空间"}
    ],
    huIndex:0,//户型
    housingIndex:0,//出租类型
    discountIndex:0,//优惠类型
    leftMin: 0, 
    leftMax: 600, 
    rightMin: 600, 
    rightMax:1200,  
    leftValue: 0,
    rightValue: 1200,
    leftWidth: '40', 
    rightWidth: '40',
    sumPrice:"80000"
  },

  // 左边滑块滑动的值
  leftChange: function (e) {
    console.log('左边改变的值为：' + e.detail.value);
    var that = this;
    that.setData({
      leftValue: e.detail.value //设置左边当前值
    })
    if(this.data.rightValue<1200){
      var sum = this.data.rightValue - this.data.leftValue;
      this.setData({
        sumPrice:sum
      })
    }else{
      this.setData({
        sumPrice: 8000
      })
    }
    // console.log(this.data.rightValue)
    console.log(this.data.sumPrice)
    
  },
  // 右边滑块滑动的值
  rightChange: function (e) {
    console.log('右边改变的值为：' + e.detail.value);
    // console.log(this.data.rightValue)
    var that = this;
    that.setData({
      rightValue: e.detail.value,
    })
    if (this.data.rightValue < 1200) {
      var sum = this.data.rightValue - this.data.leftValue;
      this.setData({
        sumPrice: sum
      })
    } else {
      this.setData({
        sumPrice: 8000
      })
    }
    console.log(this.data.sumPrice)
  },
  // 户型
  huxing:function(e){
    this.setData({
      huIndex: e.currentTarget.id
    })
  },
  // 出租类
  housing:function(e){
    this.setData({
      housingIndex:e.currentTarget.id
    })
  },
  // 优惠
  discount:function(e){
    this.setData({
      discountIndex:e.currentTarget.id
    })
  },
  //保存
  jump_details:function(e){
    var that = this
    console.log(that.data.sumPrice)//价格
    console.log(that.data.huIndex)//户型
    console.log(that.data.renShu)//人数
    console.log(that.data.chuangShu)//床数
    console.log(that.data.housingIndex)//户型
    console.log(that.data.discountIndex)//优惠
    // wx.navigateTo({
    //   url: '../details/details',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  // 人数数量的加减
  bindMinus: function () {
    var renShu = this.data.renShu;
    // 如果大于1时，才可以减  
    if (renShu > 0) {
      renShu--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var renStatus = renShu <= 0 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      renShu: renShu,
      renStatus: renStatus
    });
    // console.log(renShu)
  },
  /* 点击加号 */
  bindPlus: function () {
    var renShu = this.data.renShu;
    // 不作过多考虑自增1  
    renShu++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var renStatus = renShu < 0 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      renShu: renShu,
      renStatus: renStatus
    });
    // console.log(renShu)
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var renShu = e.detail.value;
    // 将数值与状态写回  
    console.log(renShu)
    this.setData({
      renShu: renShu
    });
  } ,
  //床数数量的加减
    // 减
    bedMinus:function(){
      var chuangShu = this.data.chuangShu;
      if(chuangShu>0){
        chuangShu--;
      }
      var chuangStatus = chuangShu <= 0 ? "disabled" :"normal";
      this.setData({
        chuangShu:chuangShu,
        chuangStatus: chuangStatus
      })
      // chuangShu++;
    },
    // 加
    bedAdd:function(){
      var chuangShu = this.data.chuangShu;
      chuangShu++;
      var chuangStatus = chuangShu <= 0 ? "disabled" : "normal"
      this.setData({
        chuangShu:chuangShu,
        chuangStatus:chuangStatus
      })
    },
  /**1
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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