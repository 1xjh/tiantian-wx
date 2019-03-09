// pages/dingdan/dingdan.js
var app = getApp()
var util = require('../../utils/util.js');
var Data = require("../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['1间', '2间', '3间', '4间', '5间', '6间', '7间', '8间', '9间', '10间', '11间', '12间'],
    index: 0,
    coupon: 0,
    coupons_id: '',
    nn:1,
    user_name:'',
    idcardnum:'',
    phone:'',
    chooseShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // --------------------------入驻的日期
    var startDate = wx.getStorageSync('startDate')
    var endDate = wx.getStorageSync('endDate')
    var day = wx.getStorageSync('day')
    // console.log(startDate)
    // console.log(endDate)
    // console.log(day)
    var that = this
    // 是否开启入驻押金
    var is_deposit = options.is_deposit
    // 是否可以退押金
    var is_refund = options.is_refund
    // 押金
    if (is_deposit == 2) {
      var yj_cost = Number(options.yj_cost)
    } else {
      var yj_cost = 0
    }
    that.setData({
      is_deposit: is_deposit,
      is_refund: is_refund,
      yj_cost: yj_cost
    })
    // 查看会员的折扣
    var discount = wx.getStorageSync('users').discount
    var member_rebate = wx.getStorageSync('users').rebate;
    var types = wx.getStorageSync('users').type
    console.log('折扣')
    console.log(discount)
    console.log(types)
    console.log(member_rebate);
    if (types == 1) {
      var discounts = 1
      var dis = 0
      that.setData({
        discount: 1,
        dis: 0
      })
    } else {
      if (discount == '' || discount == null||discount ==0) {
        var discounts = 1
        var dis = 0
        that.setData({
          discount: 1,
          dis: 0
        })
      } else {
        var discounts = Number(wx.getStorageSync('users').discount) / 10
        console.log(discounts)
        var dis = 1 - discounts
        that.setData({
          discount: discounts,
          dis: dis,
        })
      }
    }
    // --------------------获取当前时间----------------------
    var time = util.formatTime(new Date());
    // --------------------改变导航栏颜色----------------------
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    // 这是酒店的id
    var hotel_id =options.hotel_id
    // 到店付的价格
    var price = options.price
    console.log('优惠券的金额'+that.data.coupon)
    var user_id = wx.getStorageSync('users').id;
    console.log(user_id+hotel_id)
    app.util.request({//获取最近提交的入驻信息
      'url': 'entry/wxapp/orderdetails',
      data: { user_id: user_id, seller_id: hotel_id},
      success: function (res) {
        console.log(res)
        var name = res.data.name;
        var tel = res.data.tel;
        var idcard = res.data.idcard;
        that.setData({
          user_name:name,
          phone:tel,
          idcardnum:idcard,
        })
      },
    })
    that.setData({
      oid:options.oid,
      price:options.price,
      hotel_id:options.hotel_id,
      room_id:options.id,
      total_num: options.num,
      room_name: options.name,
      name: options.name,
      hotel_name: options.hotel_name,
      startDate: startDate,
      endDate: endDate,
      types:types,
      member_rebate:member_rebate,
    })
    var that = this
    app.util.request({
      'url': 'entry/wxapp/gethotel',
      'cachetime': '0',
      success: function (res) {
        // console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          if (hotel_id == res.data[i].id) {
            that.setData({
              room: res.data[i]
            })
            wx.setNavigationBarTitle({
              title: res.data[i].name
            })
          }
        }
      },
    })
    // 获取房间信息
  },
  // 使用优惠券
  coupon: function (e) {
    wx: wx.navigateTo({
      url: '../coupon/coupon?hotel_id=' + this.data.hotel_id + '&money=' + this.data.total_price,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  bindPickerChange: function (e) {
    console.log(this.data)
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var num = Number(e.detail.value)
    console.log(num)
    if(num>0){
      var nn = num + 1
    }else{
      var nn = 1
    } 
    // 住的天数
    var day = this.data.day
    // 计算房间的原本价格
    var price = Number(this.data.price)
    
    // 计算总价格
    if (this.data.oid == 1) {// 计算折扣的价格
      var rebate = this.data.none_cost * nn
      var original_price = this.data.original_price
      var money = rebate.toFixed(2)
      console.log(money)
      var shoping = Number(this.data.cost_price*nn)+this.data.yj_cost
      shoping = shoping.toFixed(2)
      console.log(shoping)
      this.setData({
        index: e.detail.value,
        total_price: shoping,
        original_price:original_price,
        nn: nn,
        rebate: rebate,
        money: Number(money)
      })
    } else {
      // var shoping = this.data.rebate * nn
      // var shoping = this.data.cost_price*nn;
     
      // var rebate = this.data.rebate * nn
     
      var day_price = this.data.price*this.data.day
      var shoping = day_price * nn;
      var original_price = day_price*nn;
      var rebate =shoping - this.data.money;
      // var money = (this.data.no_cost * nn).toFixed(2)
      var money = (this.data.money).toFixed(2)
      shoping = shoping - this.data.coupon + this.data.yj_cost-money
      shoping = shoping.toFixed(2)
      console.log(shoping)
      this.setData({
        index: e.detail.value,
        total_price: shoping,
        original_price:original_price,
        nn: nn,
        rebate: rebate,
        money: Number(money)
      })
    }
  },
  // ——————————日历点击事件————————
  //事件处理函数
  bindViewTap: function () {
    var that = this;
    var startDate = that.data.stime;
    var endDate = that.data.etime;
    console.log(startDate);
    console.log('入住时间礼拜' + new Date(startDate).getDay())
    console.log('离店时间礼拜' + new Date(endDate).getDay())
    console.log(endDate);
    wx.navigateTo({
      url: '../calendar/calendar?startDate=' + startDate + "&endDate=" + endDate
    })
  },

choosePay:function(e){
  this.setData({
    chooseShow:true,
    priceShow: false
  })
},
chooseClose: function (e) {
  this.setData({
    chooseShow: false
  })
},
priceClose: function (e) {
  this.setData({
   priceShow: false
  })
},
priceShow: function (e) {
  this.setData({
    priceShow: true
  })
},
  // 提交订单
  formSubmit: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    // 支付方式
    var payway = e.detail.target.id
    // 优惠券id
    var coupons_id = that.data.coupons_id
    // 优惠券抵扣的金额
    var yhq_cost = that.data.coupon
    // 折扣的金额
    var zk_cost = that.data.money
    // 折扣
    var discount = that.data.discount
    // 房间的价格  不包括押金
    var price = that.data.price
    //房间原价
    var original_price = that.data.original_price
    // console.log('不包括押金的房间价格'+rebate)
    // 应该付款的总金额
    var total_price = that.data.total_price
    if (total_price <= 0) {
      total_price = 0.01
    }
    // 是否开启到店付支付押金
    var is_deposit = that.data.is_deposit
    // 用户应该支付的押金
    var yj_cost = that.data.yj_cost
    // 获取提交的form_id
    var form_id = e.detail.formId
    // console.log('用户的form——id是' + form_id)
    // 判断用户输入的名字以及手机号
    var user_tel = e.detail.value.user_tel
    var user_name = e.detail.value.user_name
    var user_idcard = e.detail.value.user_idcard
    //判断会员
    var types = that.data.types
    // console.log(user_name.length)
    this.setData({
      chooseShow: false
    })
    if (user_name.length == 0) {
      wx: wx.showToast({
        title: '请输入名字',
        icon: '',
        image: '',
        duration: 1500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (user_name.length > 6) {
      wx.showToast({
        title: '名字太长啦',
        icon: 'success',
        duration: 1500
      })
    } else if (user_name.length <= 6) {
      var iscard_reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      console.log(iscard_reg.test(user_idcard))
      if(!iscard_reg.test(user_idcard)){
        wx.showToast({
          title: '请输入身份证号',
          icon: 'success',
          duration: 1500
        })
        return false;
      }
      if (user_tel.length > 0) {
        // -------------------------------------判断用户输入的手机号是否正确
        var myreg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (user_tel.length == 0) {
          wx.showToast({
            title: '手机号不能为空',
            icon: 'success',
            duration: 1500
          })
          return false;
        } else if (user_tel.length < 11) {
          wx.showToast({
            title: '手机号长度有误！',
            icon: 'success',
            duration: 1500
          })
          return false;
        } else if (!myreg.test(user_tel)) {
          wx.showToast({
            title: '手机号格式错误！',
            icon: 'success',
            duration: 1500
          })
          return false;
        } else {
          // 用户的openid
          var openid = wx.getStorageSync('users').openid
          // 用户的id
          var uese_id = wx.getStorageSync('users').id
          // 得到用户入住的天数
          var days = that.data.day
          // 得到该房型的剩余数量
          var total_num = that.data.total_num
          // 得到该订单的金额以及用户下单的房间数
          if (that.data.nn == null) {
            var room_num = 1
          } else {
            var room_num = that.data.nn
          }
          // 得到用户入住酒店的时间起止
          var start_time = that.data.stime
          var end_time = that.data.etime
          // console.log(start_time + ' ' + end_time)
          // 获取商家的id以及名字
          console.log(that.data)
          var hotel_id = that.data.hotel_id
          var hotel_name = that.data.hotel_name
          // 获取房间的id级房间型号
          var room_id = that.data.room_id
          var room_name = that.data.room_name
          // return false
          // 用户输入的名字以及手机号
          var user_tel = e.detail.value.user_tel
          var user_name = e.detail.value.user_name

          // 判断用户选择的是到店付还是在线付
          var oid = that.data.oid
          // 判断保留的日期
          if (oid == 1) {
            var cerated_time = that.data.etime
          } else {
            var cerated_time = that.data.stime
          }
          if (total_num < room_num) {
            wx: wx.showToast({
              title: '该房型剩余' + total_num + '间',
              icon: '',
              image: '',
              duration: 1000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else {
            if (form_id == '') {
              wx: wx.showToast({
                title: '网络有波动',
                icon: '',
                image: '',
                duration: 1000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            } else {
              if (oid == 1) {
                var user_id = wx.getStorageSync('users').id
                // console.log('用户选择到店付')
                if (is_deposit == 2) {
                  // 支付押金的接口
                  app.util.request({
                    'url': 'entry/wxapp/pay2',
                    'cachetime': '0',
                    data: { openid: openid, money: yj_cost },
                    success: function (res) {
                      console.log(res)
                      // ---------需要传给后台的值------------
                      var out_trade_no = res.data.n
                      wx.requestPayment({
                        'timeStamp': res.data.y.timeStamp,
                        'nonceStr': res.data.y.nonceStr,
                        'package': res.data.y.package,
                        'signType': res.data.y.signType,
                        'paySign': res.data.y.paySign,
                        'success': function (res) {
                          //  提交订单
                          app.util.request({
                            'url': 'entry/wxapp/addorder',
                            'cachetime': '0',
                            data: {
                              user_id: user_id,
                              online_price: original_price,
                              seller_id: hotel_id,
                              seller_name: hotel_name,
                              arrival_time: start_time,
                              departure_time: end_time,
                              tel: user_tel,
                              days: days,
                              name: user_name,
                              room_type: room_name,
                              room_num: room_num,
                              type: oid,
                              persist: cerated_time,
                              goods_id: room_id,
                              dis_cost: total_price,
                              coupons_id: coupons_id,
                              zk_cost: zk_cost,
                              yhq_cost: yhq_cost,
                              yj_cost:yj_cost,
                              out_trade_no: out_trade_no
                            },
                            success: function (res) {
                              console.log('这是查询房间数量')
                              console.log(res)
                              var order_id = res.data
                              var length = typeof (order_id)
                              console.log(length)
                              if (length == "string") {
                                console.log('order_id')
                                wx: wx.showModal({
                                  title: '提示',
                                  content: order_id,
                                  showCancel: true,
                                  cancelText: '取消',
                                  cancelColor: '',
                                  confirmText: '确定',
                                  confirmColor: '',
                                  success: function (res) { },
                                  fail: function (res) { },
                                  complete: function (res) { },
                                })
                              } else {
                                app.util.request({
                                  'url': 'entry/wxapp/roomnum',
                                  'cachetime': '0',
                                  data: { order_id: order_id },
                                  success: function (res) {
                                    console.log('这是改变房间数量')
                                    console.log(res)
                                  },
                                })
                                if (res.data != "error") {
                                  app.util.request({
                                    'url': 'entry/wxapp/message',
                                    'cachetime': '0',
                                    data: { form_id: form_id, id: order_id, openid: openid },
                                    success: function (res) {
                                      app.util.request({
                                        'url': 'entry/wxapp/sms',
                                        'cachetime': '0',
                                        data: { seller_id: hotel_id },
                                        success: function (res) {
                                          setTimeout(function () {
                                            wx.reLaunch({
                                              url: '../yuding/yuding?start_time=' + start_time + '&end_time=' + end_time + '&day=' + that.data.day + '&money=' + total_price + '&room_name=' + room_name + '&hotel_name=' + hotel_name
                                            })
                                          }, 1000)
                                        },
                                      })
                                    },
                                  })
                                } else {
                                  // 发送模板消息
                                  app.util.request({
                                    'url': 'entry/wxapp/message',
                                    'cachetime': '0',
                                    data: { form_id: form_id, id: order_id, openid: openid },
                                    success: function (res) {
                                    },
                                  })
                                  wx: wx.showToast({
                                    title: '订单生成失败',
                                    icon: '',
                                    image: '',
                                    duration: 1000,
                                    mask: true,
                                    success: function (res) { },
                                    fail: function (res) { },
                                    complete: function (res) { },
                                  })
                                }
                              }

                            },
                          })
                        },

                        'fail': function (res) {
                          // console.log(res);
                          wx.showToast({
                            title: '支付失败',
                            duration: 1000
                          })
                        },
                      })
                    },
                  })
                } else {
                  //  提交订单
                  app.util.request({
                    'url': 'entry/wxapp/addorder',
                    'cachetime': '0',
                    data: {
                      user_id: user_id,
                      online_price: original_price,
                      seller_id: hotel_id,
                      seller_name: hotel_name,
                      arrival_time: start_time,
                      departure_time: end_time,
                      tel: user_tel,
                      days: days,
                      name: user_name,
                      room_type: room_name,
                      room_num: room_num,
                      type: oid,
                      persist: cerated_time,
                      goods_id: room_id,
                      dis_cost: total_price,
                      coupons_id: coupons_id,
                      zk_cost: zk_cost,
                      yhq_cost: yhq_cost,
                      yj_cost:yj_cost
                    },
                    success: function (res) {
                      console.log('这是查询房间数量')
                      console.log(res)
                      var order_id = res.data
                      var length = typeof (order_id)
                      console.log(length)
                      if (length == "string") {
                        wx: wx.showModal({
                          title: '提示',
                          content: order_id,
                          showCancel: true,
                          cancelText: '取消',
                          cancelColor: '',
                          confirmText: '确定',
                          confirmColor: '',
                          success: function (res) { },
                          fail: function (res) { },
                          complete: function (res) { },
                        })
                      } else {
                        if (res.data != "error") {
                          app.util.request({
                            'url': 'entry/wxapp/message',
                            'cachetime': '0',
                            data: { form_id: form_id, id: order_id, openid: openid },
                            success: function (res) {
                              // console.log(res)
                              app.util.request({
                                'url': 'entry/wxapp/sms',
                                'cachetime': '0',
                                data: { seller_id: hotel_id },
                                success: function (res) {
                                  setTimeout(function () {
                                    // console.log('这是发送短信')
                                    // console.log(res)
                                    // console.log('这是商家id' + hotel_id)
                                    wx.reLaunch({
                                      url: '../yuding/yuding?start_time=' + start_time + '&end_time=' + end_time + '&day=' + that.data.day + '&money=' + total_price + '&room_name=' + room_name + '&hotel_name=' + hotel_name
                                    })
                                  }, 1000)
                                },
                              })
                            }
                          })
                        } else {
                          // 
                          app.util.request({
                            'url': 'entry/wxapp/message',
                            'cachetime': '0',
                            data: { form_id: form_id, id: order_id, openid: openid },
                            success: function (res) {
                              // console.log(res)
                            },
                          })
                          wx: wx.showToast({
                            title: '订单生成失败',
                            icon: '',
                            image: '',
                            duration: 1000,
                            mask: true,
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { },
                          })
                        }
                      }

                    },
                  })
                }

              } else {
                // console.log('用户选择在线付')
                var user_id = wx.getStorageSync('users').id
                // console.log('用户的id为' + ' ' + user_id)
                //  提交订单
                app.util.request({
                  'url': 'entry/wxapp/addorder',
                  'cachetime': '0',
                  data: {
                    user_id: user_id,
                    online_price: original_price,
                    seller_id: hotel_id,
                    seller_name: hotel_name,
                    arrival_time: start_time,
                    departure_time: end_time,
                    tel: user_tel,
                    days: days,
                    name: user_name,
                    room_type: room_name,
                    room_num: room_num,
                    type: oid,
                    persist: cerated_time,
                    goods_id: room_id,
                    dis_cost: total_price,
                    coupons_id: coupons_id,
                    zk_cost: zk_cost,
                    yhq_cost: yhq_cost,
                    yj_cost:yj_cost,
                    is_online:1,
                    idcard:user_idcard
                  },
                  success: function (res) {
                    console.log('这是查询房间数量')
                    console.log(res)
                    var order_id = res.data
                    var length = typeof (order_id)
                    console.log(length)
                    if (length == "string") {
                      console.log('order_id')
                      wx: wx.showModal({
                        title: '提示',
                        content: order_id,
                        showCancel: true,
                        cancelText: '取消',
                        cancelColor: '',
                        confirmText: '确定',
                        confirmColor: '',
                        success: function (res) { 
                        },
                        fail: function (res) { },
                        complete: function (res) { },
                      })
                    } else {
                      console.log(order_id)
                      app.util.request({
                        'url': 'entry/wxapp/updateroomnum',
                        'cachetime': '0',
                        data: { order_id: order_id },
                        success: function (res) {
                          console.log(res)
                        }
                      })
                      
                      if (res.data != "error") {
                        if(payway=='wechat'){
                          console.log(payway)
                          app.util.request({
                            'url': 'entry/wxapp/pay',
                            'cachetime': '0',
                            data: { openid: openid, money: total_price, order_id: order_id },
                            success: function (res) {
                              console.log(res)
                              wx.requestPayment({
                                'timeStamp': res.data.timeStamp,
                                'nonceStr': res.data.nonceStr,
                                'package': res.data.package,
                                'signType': res.data.signType,
                                'paySign': res.data.paySign,
                                'success': function (res) {
                                  console.log(res)
                                  // app.util.request({
                                  //   'url': 'entry/wxapp/checkprint',
                                  //   'cachetime': '0',
                                  //   data: { seller_id: hotel_id },
                                  //   success: function (res) {
                                  //     if (res.data == 2) {
                                  //       app.util.request({
                                  //         'url': 'entry/wxapp/print',
                                  //         'cachetime': '0',
                                  //         data: { order_id: order_id },
                                  //         success: function (res) {
                                  //         }
                                  //       })
                                  //     }
                                  //   }
                                  // })
                                  // 会员等级
                                  app.util.request({
                                    'url': 'entry/wxapp/memberlevel',
                                    'cachetime': '0',
                                    data: { user_id: user_id },
                                    success: function (res) {
                                    }
                                  })
                                  // 改变订单状态
                                  app.util.request({
                                    'url': 'entry/wxapp/completeorder',
                                    'cachetime': '0',
                                    data: { order_id: order_id, types: types, user_id: user_id, pay_way: 'wechat' },
                                    success: function (res) {
                                      app.util.request({
                                        'url': 'entry/wxapp/message',
                                        'cachetime': '0',
                                        data: { form_id: form_id, id: order_id, openid: openid },
                                        success: function (res) {
                                          setTimeout(function () {
                                            wx.reLaunch({
                                              url: '../ruzhu/ruzhu?order_id=' + order_id
                                            })
                                          }, 1000)
                                          wx.showToast({
                                            title: '支付成功',
                                            duration: 1000
                                          })
                                        }
                                      })
                                      // app.util.request({
                                      //   'url': 'entry/wxapp/sms',
                                      //   'cachetime': '0',
                                      //   data: { seller_id: hotel_id },
                                      //   success: function (res) {
                                      //     setTimeout(function () {
                                      //       wx.reLaunch({
                                      //         url: '../index/index',
                                      //       })
                                      //     }, 1000)
                                      //   },
                                      // })
                                      // app.util.request({
                                      //   'url': 'entry/wxapp/sendmail',
                                      //   'cachetime': '0',
                                      //   data: { seller_id: hotel_id },
                                      //   success: function (res) {
                                      //     setTimeout(function () {
                                      //     }, 1000)
                                      //   },
                                      // })
                                    },
                                  })
                                },

                                'fail': function (res) {
                                  setTimeout(function () {
                                    wx.reLaunch({
                                      url: '../ruzhu/ruzhu?order_id=' + order_id
                                    })
                                  }, 1000)
                                  wx.showToast({
                                    title: '支付失败',
                                    duration: 1000
                                  })
                                },
                              })
                            },
                          })
                        }else{//余额付
                          console.log(payway)
                          app.util.request({
                            'url': 'entry/wxapp/balancepayrecord',
                            'cachetime': '0',
                            data: { openid: openid, money: total_price, order_id: order_id,user_id:user_id,types:1 },
                            success: function (res) {
                              console.log(res)
                              if(res.data.code==0){
                                // app.util.request({
                                //   'url': 'entry/wxapp/checkprint',
                                //   'cachetime': '0',
                                //   data: { seller_id: hotel_id },
                                //   success: function (res) {
                                //     if (res.data == 2) {
                                //       app.util.request({
                                //         'url': 'entry/wxapp/print',
                                //         'cachetime': '0',
                                //         data: { order_id: order_id },
                                //         success: function (res) {
                                //         }
                                //       })
                                //     }
                                //   }
                                // })
                                // 会员等级
                                app.util.request({
                                  'url': 'entry/wxapp/memberlevel',
                                  'cachetime': '0',
                                  data: { user_id: user_id },
                                  success: function (res) {
                                  }
                                })
                                // 改变订单状态
                                app.util.request({
                                  'url': 'entry/wxapp/completeorder',
                                  'cachetime': '0',
                                  data: { order_id: order_id, types: types, user_id: user_id,pay_way: 'balance' },
                                  success: function (res) {
                                    app.util.request({
                                      'url': 'entry/wxapp/message',
                                      'cachetime': '0',
                                      data: { form_id: form_id, id: order_id, openid: openid },
                                      success: function (res) {
                                        setTimeout(function () {
                                          wx.reLaunch({
                                            url: '../ruzhu/ruzhu?order_id=' + order_id
                                          })
                                        }, 1000)
                                        wx.showToast({
                                          title: '支付成功',
                                          duration: 2000
                                        })
                                      }
                                    })
                                    // app.util.request({
                                    //   'url': 'entry/wxapp/sms',
                                    //   'cachetime': '0',
                                    //   data: { seller_id: hotel_id },
                                    //   success: function (res) {
                                    //     setTimeout(function () {
                                    //       wx.reLaunch({
                                    //         url: '../index/index',
                                    //       })
                                    //     }, 1000)
                                    //   },
                                    // })
                                    // app.util.request({
                                    //   'url': 'entry/wxapp/sendmail',
                                    //   'cachetime': '0',
                                    //   data: { seller_id: hotel_id },
                                    //   success: function (res) {
                                    //     setTimeout(function () {
                                    //     }, 1000)
                                    //   },
                                    // })
                                  },
                                })
                              }else{
                                setTimeout(function () {
                                  wx.reLaunch({
                                    url: '../ruzhu/ruzhu?order_id=' + order_id
                                  })
                                }, 1000)
                                wx.showToast({
                                  title: res.data.msg,
                                  duration: 1000
                                })
                              }
                            },
                          })
                        }
                      } else {
                        wx: wx.showToast({
                          title: '订单生成失败',
                          icon: '',
                          image: '',
                          duration: 1000,
                          mask: true,
                          success: function (res) { },
                          fail: function (res) { },
                          complete: function (res) { },
                        })
                      }
                    }

                  },
                })
              }
            }
          }
        }
      } else {
        wx.showToast({
          title: '请输入手机号',
          icon: 'success',
          duration: 1500
        })
      }
    }
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
    var that = this;
    var startDate = this.data.startDate;
    var endDate = this.data.endDate;
    console.log(that.data)
    // 默认显示入住时间为当天
    var date = Data.formatDate(new Date(), "yyyy-MM-dd");
    var tomorrow1 = new Date();
    // 默认显示离店日期为第二天
    tomorrow1.setDate((new Date()).getDate() + 1);
    var tomorrow = Data.formatDate(new Date(tomorrow1), "yyyy-MM-dd");
    if (startDate == null) {
      var s1 = new Date(date.replace(/-/g, "/"));
      var s2 = new Date(tomorrow.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      var starttime = date.slice(0, 10)
      var endtime = tomorrow.slice(0, 10)
      wx.setStorageSync('startDate', date)
      wx.setStorageSync('endDate', tomorrow)
      wx.setStorageSync('day', time)
      console.log(time)
      this.setData({
        stime: starttime,
        etime: endtime,
        day: time
      });
    } else {
      var s1 = new Date(startDate.replace(/-/g, "/"));
      var s2 = new Date(endDate.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      // 截取日期只显示年月日
      var starttime = startDate.slice(0, 10)
      var endtime = endDate.slice(0, 10)
      wx.setStorageSync('startDate', startDate)
      wx.setStorageSync('endDate', endDate)
      wx.setStorageSync('day', time)
      console.log(time)
      this.setData({
        stime: starttime,
        etime: endtime,
        day: time
      });
    }

    // 计算金额
    var oid = that.data.oid;
    var price = that.data.price;
    var day = that.data.day;
    var dis = that.data.dis;
    var discount = that.data.discount;//折扣
    var member_rebate =that.data.member_rebate;//下单减免金额
    console.log(member_rebate)
    var hotel_id = that.data.hotel_id;
    var room_id = that.data.room_id;
    var nn = that.data.nn//房间数
    if (oid == 1) { //到店付
      // var dis_price = price * day * dis*nn//折扣
      var dis_price = member_rebate;//直接减免金额
      dis_price = dis_price.toFixed(2)
      dis_price = Number(dis_price)
      var shoping = price * day*nn - that.data.coupon - dis_price + that.data.yj_cost
      // ---------------有折扣的金额(实际优惠)
      // var none_cost = price * day * dis*nn;//折扣金额
      var none_cost = member_rebate;//实际减免金额
      none_cost = none_cost.toFixed(2)
      // ---------------折扣后的金额（实际金额 不含优惠券 押金）
      var cost_price = price * day*nn - none_cost
      console.log(cost_price)
      console.log(none_cost)
      cost_price = cost_price.toFixed(2)
      shoping = shoping.toFixed(2)
      that.setData({
        total_price: shoping,
        money: dis_price,
        none_cost: none_cost,
        cost_price: cost_price,
      })
    } else { //在线付
      // 计算折扣的价格
      var prix = []
      // 获取今日房间价格
      var shoping = 0
      app.util.request({
        'url': 'entry/wxapp/getroomcost',
        'cachetime': '0',
        data: { room_id: room_id, start: startDate, end: endDate },
        success: function (res) {
          console.log('这是今日价格')
          console.log(res)
          res.data.map(function (item) {
            var arr = {}
            arr.price = Number(item.mprice)
            prix.push(arr)
          })
          console.log(prix)
          for (var i in prix) {
            shoping += (prix[i].price);
          }
          // 这是折扣的金额
          console.log(shoping)
          // var money = shoping * dis*nn//实际优惠的金额(会员折扣)
          var money = Number(member_rebate) //下单减免金额
          console.log('这是折扣的金额' + money)
          money = money.toFixed(2)
          // 这是折扣后的金额   不包含押金和优惠券的金额 （会员价）
          // var rebate = shoping *discount*nn;
          var rebate = shoping-money;
          // 这是总价格   不包含房间数量 
          // var total_price = shoping * discount*nn - that.data.coupon + that.data.yj_cost
          var total_price = shoping * nn - that.data.coupon + that.data.yj_cost-money
          // 单间总价
          // var cost_price = shoping*discount;
          var cost_price = shoping - money;
          //总原价
          var original_price = shoping*nn
          console.log(original_price)
          // var no_cost = shoping*dis;
          var no_cost = Number(money);
          no_cost = no_cost.toFixed(2)
          cost_price = cost_price.toFixed(2)
          total_price = total_price.toFixed(2);
          that.setData({
            dailyPrice:res.data,
            original_price:original_price,
            money: Number(money),
            total_price: Number(total_price),
            rebate: rebate,
            cost_price:cost_price,
            no_cost:no_cost
          })
        },
      })
    }
    // 余额总额
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/getbalance',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          balance: res.data.amount,
        })
      },
    })
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