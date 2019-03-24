// pages/daodianzhifu/daodianzhifu.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    fouhidden: true
  },
  click1: function() {
    this.setData({
      hidden: false,
      fouhidden: true
    })
  },
  click2: function() {
    this.setData({
      hidden: true,
      fouhidden: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 支付按钮
  payment: function() {
    console.log(1111)
    app.util.request({
      'url': 'index/Pay/wxpay',
      data: {order_id:49},
      "method":"post",
      success: function(res) { //后端返回的数据
      console.log(res)
        var data = res.data;
        wx.requestPayment({
          timeStamp: data['timeStamp'],
          nonceStr: data['nonceStr'],
          package: data['package'],
          signType: data['signType'],
          paySign: data['paySign'],
          success: function(res) {
            if (res.errMsg == "requestPayment:ok"){
                wx.navigateTo({
                  url: '../yuding/yuding',
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
            }
            wx.showModal({
              title: '支付成功',
              content: '',
            })

          },
          fail: function(res) {
           
          }
        })
      }
    })
  },

  onLoad: function(options) {
    console.log(options)
    var that = this;
    that.setData({
      price: options.price
    })
    // app.util.request({
    //   url: 'xxx',
    //   data: { xxx },
    //   success: function (result) {
    //     that.setData({
    //       dataSourcesArray: result.data.order // 请求到的数据
    //     });
    //     /**
    //     */
    //     that.serviceTime(function (res) {
    //       // 服务器的时间戳
    //       var nowYear = res.data.serviceTime.split(' ')[0];
    //       var nowTime = new Date(res.data.serviceTime).getTime();
    //       //  这里传入只有未结束的订单
    //       var orderDetail = [];
    //       for (var i = 0; i < result.data.order.length; i++) {
    //         // 如果订单未过期状态
    //         if (result.data.order[i].state == '待付款') {
    //           result.data.order[i].itemIndex = i;
    //           orderDetail.push(result.data.order[i]);
    //         }
    //       }
    //       result.data.order = orderDetail;
    //       that.operation(result);// 待付款的订单传入这个方法内
    //     });
    //   }
    // })
  },
  // operation: function (result) { // 接收到没有结束的订单信息
  //   var that = this;
  //   time = setInterval(function () { // 循环执行
  //     that.serviceTime(function (res) {// 获取服务器时间
  //       that.resetState(res, result); // 设置未到结束时间订单的状态
  //     });
  //   }, 1000);
  // },
  // resetState: function (res, result) {
  //   var nowTime = new Date(res.data.serviceTime).getTime();// 当前时间的时间戳

  //   for (let i = 0; i < result.data.order.length; i++) { // 循环添加 倒计时
  //     var index = result.data.order[i].itemIndex;
  //     var status = "dataSourcesArray[" + index + "]." + 'state';
  //     var showTime = "dataSourcesArray[" + index + "]." + 'showTime';
  //     var futureTime = new Date(result.data.order[i].expiryTime).getTime();
  //     // 未来的时间减去现在的时间 ;
  //     var resTime = (futureTime - nowTime) / 1000;
  //     // 结束时间
  //     var zero = futureTime - nowTime;
  //     if (zero >= 0) { // 认为还没有到达结束的时间
  //       var timeSeconds = timestampToTime(resTime);
  //       this.setData({
  //         [showTime]: timeSeconds
  //       })
  //     } else { // 结束的时间已经到了
  //       result.data.order.splice(i, 1); // 该订单自动结束时间 从这个列表中删除  就不必老是循环他
  //       this.setData({
  //         [showTime]: "超过时间  订单已经关闭",
  //         [status]: "订单过期"
  //       });
  //     }

  //     if (result.data.order.length == 0) {// 如果没有可支付订单 则停止这个订单
  //       clearInterval(time);
  //     }
  //   }
  // },
  // 请求到系统时间 调取成功之后执行回调函数
  // serviceTime: function (fn) {
  //   wx.request({
  //     url: 'https://www.xxx.cn/getTime', // 仅为示例，并非真实的接口地址
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       fn && fn(res);
  //     }
  //   })
  // },
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

// 时间转换
function timestampToTime(s) {
  var h = Math.floor(s / 3600 % 24);
  var min = Math.floor(s / 60) % 60;
  var sec = s % 60;
  h = add(h);
  min = add(min);
  sec = add(sec);
  return h + ':' + min + ':' + sec
}

// 添 0
function add(m) {
  return m < 10 ? '0' + m : m
}