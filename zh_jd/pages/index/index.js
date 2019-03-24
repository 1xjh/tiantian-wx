//index.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
//获取应用实例
var app = getApp();
var Data = require("../../utils/data.js");
Page({
  // ________位置——————————
  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function(res) {
        // console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        city = city.substring(0, city.length - 1);
        wx.setStorageSync("city", city);
        jia(vm, city)
        pintai(vm, city)
        recommend(vm, city)
        quna(vm, city)
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })

      },
      fail: function(res) {
        // console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  },
  data: {
    quan_arr: [], //去哪
    recommend: [], //热门推荐
    types: "",
    platform: [],
    family: [],
    searchName: '',
    hotels: false,
    data: [],
    tips: '选择日期',
    date: '',
    tomorrow: '',
    userInfo: {},
    name: '',
    province: '',
    city: '',
    latitude: '',
    longitude: '',

  },
  // ——————————日历点击事件————————
  //事件处理函数
  bindViewTap: function() {
    var that = this;
    var startDate = that.data.date;
    var endDate = that.data.tomorrow;
    // console.log(startDate);
    // console.log('入住时间礼拜' + new Date(startDate).getDay())
    // console.log('离店时间礼拜' + new Date(endDate).getDay())
    // console.log(endDate);
    wx.navigateTo({
      url: '../calendar/calendar?startDate=' + startDate + "&endDate=" + endDate
    })
  },
  canvasIdErrorCallback: function(e) {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      destWidth: 100,
      destHeight: 100,
      canvasId: 'myCanvas',
      success: function(res) {
        // console.log(res.tempFilePath)
      }
    })
    const ctx = wx.createCanvasContext('myCanvas')
    wx.chooseImage({
      success: function(res) {
        // console.log(res)
        ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
        ctx.draw()
      }
    })
  },

  //事件处理函数
  onLoad: function(option) {
    console.log(option);
    if (option.city) {
      this.setData({
        city: option.city
      })
      jia(this, option.city)
      pintai(this, option.city)
      recommend(this, option.city)
      quna(this, option.city)
      wx.setStorageSync("city", option.city);
    } else {
      let vm = this;
      vm.getUserLocation();
    }

    qqmapsdk = new QQMapWX({
      key: 'QIVBZ-OMFCO-BQPWW-S3Y3M-4WOSS-TAFMG' //这里自己的key秘钥
    });
    // ------------
    var that = this
    wx.setStorageSync('startDate', '')
    wx.setStorageSync('endDate', '')

    // 获取用户登录信息
    // wx.login({
    //   success: function(res) {
    //     var code = res.code
    //     console.log(res)
    //     console.log(code,"codew d dddd033IyBcA0afdBe1B90gA0JVpcA0IyBcb")
    //     wx.setStorageSync("code", res.code)
    //     wx.getUserInfo({
    //       success: function(res) {
    //         var encryptedData = res.encryptedData
    //         // console.log(encryptedData)
    //         var iv = res.iv;
    //         // console.log(iv)

    //         wx.setStorageSync("user_info", res.userInfo)
    //         that.setData({
    //           avatarUrl: res.userInfo.avatarUrl,
    //           nickName: res.userInfo.nickName
    //         })

    //         app.util.request({
    //           'url': 'index/Info/getWxUserInfo',
    //           'cachetime': '0',
    //           data: {
    //             code: code
    //           },
    //           success: function(res) {
    //             console.log(res.data.data,"dddkkk")

    //             wx.setStorageSync("key", res.data.session_key)
    //             var session_key = res.data.data.session_key;

    //             var img = that.data.avatarUrl
    //             var name = that.data.nickName
    //             // 异步保存用户openid
    //             wx.setStorageSync("openid", res.data.data.openid)
    //             var openid = res.data.openid
    //             // console.log(openid)
    //             // 获取用户登录信息
    //             app.util.request({
    //               'url': 'index/Info/getallUserInfo',
    //               'cachetime': '0',
    //               method: "post",
    //               data: {
    //                 encryptedData: encryptedData,
    //                 iv: iv,
    //                 session_key: session_key
    //               },
    //               success: function(res) {
    //                 // console.log(res)
    //                 // 异步保存用户登录信息
    //                 wx.setStorageSync('token', res.data.data.user_token);
    //                 wx.setStorageSync('users', res.data.data);
    //               },
    //             })
    //           },
    //         })
    //       },
    //       fail: function(e) {
    //         // console.log(e)
    //         wx.showModal({
    //           title: '提示',
    //           content: '授权获取用户信息失败！',
    //           confirmText: '重新获取',
    //           success: function(res) {
    //             // console.log(res)
    //             if (res.confirm) {
    //               wx.reLaunch({
    //                 url: '../auth/auth',
    //               })
    //             } else if (res.cancel) {
    //               that.onLoad()
    //             }
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
    wx.getSystemInfo({
      success: function(res) {
        console.log(res, "[pppppp")
        that.setData({
          screenHeight: res.screenHeight,
          screenWidth: res.screenWidth,
        });
      }
    })

  },
  clickimg: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index
  },
  // 轮播图尺寸设置
  bannerImg: function(e) {
    var that = this
    //获取图片尺寸
    var width = e.detail.width;
    var height = e.detail.height;
    // 计算高宽比
    var ratio = height / width
    // 设置图片尺寸
    var bannerWidth = that.data.screenWidth
    var bannerHeight = bannerWidth * ratio;
    that.setData({
      bannerWidth: bannerWidth,
      bannerHeight: bannerHeight
    })
  },
  onsaleImg: function(e) {
    var that = this
    //获取图片尺寸
    var width = e.detail.width;
    var height = e.detail.height;
    // 计算高宽比
    var ratio = height / width
    // 设置图片尺寸

    var onsaleWidth = that.data.screenWidth
    var onsaleHeight = onsaleWidth * ratio;
    that.setData({
      onsaleWidth: onsaleWidth,
      onsaleHeight: onsaleHeight
    })
  },

  topImg: function(e) {
    var that = this
    //获取图片尺寸
    var width = e.detail.width;
    var height = e.detail.height;
    // 计算高宽比
    var ratio = height / width
    // 设置图片尺寸
    var topWidth = that.data.screenWidth
    var topHeight = topWidth * ratio;
    that.setData({
      topWidth: topWidth,
      topHeight: topHeight
    })
  },
  travelImg: function(e) {
    var that = this
    //获取图片尺寸
    var width = e.detail.width;
    var height = e.detail.height;
    // 计算高宽比
    var ratio = height / width
    // 设置图片尺寸
    var travelWidth = that.data.screenWidth
    var travelHeight = travelWidth * ratio;
    // console.log(travelHeight)
    var travelHeight = travelHeight < 200 ? travelHeight : 200;
    // console.log(travelHeight)
    that.setData({
      travelWidth: travelWidth,
      travelHeight: travelHeight
    })
  },
  // 处理图片
  imgsplit: function(data) {
    for (let i = 0; i < data.length; i++) {
      data[i].img = data[i].img.split(",")
    }
    return data
  },
  //搜索酒店
  searchTo: function() {
    var name = this.data.searchName;
    // console.log(name)
    wx.navigateTo({
      url: "../details/details?name=" + name + "&save=1",
    })
  },
  searchClick: function(e) {
    var that = this
    that.setData({
      hotels: false
    })
  },
  search: function(e) {
    var that = this
    var keywords = e.detail.value
    that.setData({
      searchName: keywords
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    var that = this
    that.onLoad()
    wx.stopPullDownRefresh();
  },
  onShow: function() {
    var startDate = this.data.startDate;
    var endDate = this.data.endDate;
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
      if (new Date(date).getDay() == 0) {
        starttime = date.slice(5, 10) + '周日';
      } else if (new Date(date).getDay() == 1) {
        starttime = date.slice(5, 10) + '周一';
      } else if (new Date(date).getDay() == 2) {
        starttime = date.slice(5, 10) + '周二';
      } else if (new Date(date).getDay() == 3) {
        starttime = date.slice(5, 10) + '周三';
      } else if (new Date(date).getDay() == 4) {
        starttime = date.slice(5, 10) + '周四';
      } else if (new Date(date).getDay() == 5) {
        starttime = date.slice(5, 10) + '周五';
      } else if (new Date(date).getDay() == 6) {
        starttime = date.slice(5, 10) + '周六';
      }
      if (new Date(tomorrow).getDay() == 0) {
        endtime = tomorrow.slice(5, 10) + '周日'
      } else if (new Date(tomorrow).getDay() == 1) {
        endtime = tomorrow.slice(5, 10) + '周一';
      } else if (new Date(tomorrow).getDay() == 2) {
        endtime = tomorrow.slice(5, 10) + '周二';
      } else if (new Date(tomorrow).getDay() == 3) {
        endtime = tomorrow.slice(5, 10) + '周三';
      } else if (new Date(tomorrow).getDay() == 4) {
        endtime = tomorrow.slice(5, 10) + '周四';
      } else if (new Date(tomorrow).getDay() == 5) {
        endtime = tomorrow.slice(5, 10) + '周五';
      } else if (new Date(tomorrow).getDay() == 6) {
        endtime = tomorrow.slice(5, 10) + '周六';
      }

      this.setData({
        startDate: date,
        endDate: tomorrow,
        date: starttime,
        tomorrow: endtime,
        time: time
      });
    } else {
      var s1 = new Date(startDate.replace(/-/g, "/"));
      var s2 = new Date(endDate.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      // 截取日期只显示月和日
      var seatr_time_one = startDate.slice(5, 10)
      var end_time_one = endDate.slice(5, 10)
      // console.log(seatr_time_one)
      // console.log(end_time_one)
      // 入住日期
      if (new Date(startDate).getDay() == 0) {
        var starttime = seatr_time_one + '周日'
      } else if (new Date(startDate).getDay() == 1) {
        var starttime = seatr_time_one + '周一'
      } else if (new Date(startDate).getDay() == 2) {
        var starttime = seatr_time_one + '周二'
      } else if (new Date(startDate).getDay() == 3) {
        var starttime = seatr_time_one + '周三'
      } else if (new Date(startDate).getDay() == 4) {
        var starttime = seatr_time_one + '周四'
      } else if (new Date(startDate).getDay() == 5) {
        var starttime = seatr_time_one + '周五'
      } else if (new Date(startDate).getDay() == 6) {
        var starttime = seatr_time_one + '周六'
      }

      // 离店日期
      if (new Date(endDate).getDay() == 0) {
        var endtime = end_time_one + '周日'
      } else if (new Date(endDate).getDay() == 1) {
        var endtime = end_time_one + '周一'
      } else if (new Date(endDate).getDay() == 2) {
        var endtime = end_time_one + '周二'
      } else if (new Date(endDate).getDay() == 3) {
        var endtime = end_time_one + '周三'
      } else if (new Date(endDate).getDay() == 4) {
        var endtime = end_time_one + '周四'
      } else if (new Date(endDate).getDay() == 5) {
        var endtime = end_time_one + '周五'
      } else if (new Date(endDate).getDay() == 6) {
        var endtime = end_time_one + '周六'
      }
      this.setData({
        startDate: startDate,
        endDate: endDate,
        date: starttime,
        tomorrow: endtime,
        time: time
      });
    }
  },

  onReady: function() {
    var that = this
    // console.log(that.data)
  },
  in_calendar: function() {
    wx.navigateTo({
      url: '../calendar/calendar',
    })
  },
  jumpto: function(e) {
    var is_onsale = e.currentTarget.dataset.onsale;
    var is_top = e.currentTarget.dataset.top;
    if (is_onsale) {
      wx.setStorageSync('is_onsale', is_onsale)
      wx.switchTab({
        url: '../hotel/hotel',

      })
    }
    if (is_top) {
      wx.setStorageSync('is_top', is_top)
      wx.switchTab({
        url: '../hotel/hotel',

      })
    }
  }
})
// 家庭定制
function jia(e, city) {
  app.util.request({
    'url': 'index/Accommoda/gethomelist',
    'cachetime': '0',
    data: {
      "city": city
    },
    success: function(res) {
      e.setData({
        family: res.data.data
      })
    },
  })
}
// 平台信息
function pintai(e, city) {
  app.util.request({
    'url': 'index/Info/getHomeSet',
    'cachetime': '0', //缓存时间 秒
    data: {
      "city": city
    },
    success: function(res) {
      // console.log(res,222)
      e.setData({
        getHomeSet: res
      })
      // wx.setStorageSync('platform', res.data)
      // wx.setStorageSync('platform_type', res.data.type)
      // if (res.data.db_color == '') {
      //   wx.setStorageSync('platform_color', '#F9882B')
      // } else {
      //   wx.setStorageSync('platform_color', res.data.db_color)
      // }

      wx.setNavigationBarTitle({
        title: "天天"
      })

      // wx.setNavigationBarColor({
      //   frontColor: '#ffffff',
      //   backgroundColor: wx.getStorageSync('platform_color'),
      //   animation: {
      //     duration: 0,
      //     timingFunc: 'easeIn'
      //   }
      // })
      if (res.data.type == 1) {
        wx: wx.setStorageSync('hotel', res.data.seller_id)
      }
      e.setData({
        platform: res.data.data,
        // types: res.data.type
      })
    },
  })
}
// 热门推荐
function recommend(e, city) {
  app.util.request({
    'url': 'index/Accommoda/getByHotAccommoda',
    'cachetime': '0',
    data: {
      "city": city
    },
    success: function(res) {
      wx.setStorageSync("url", res.data)
      e.setData({
        recommend: res.data.data
      })
    },
  })
}
// 周末去哪
function quna(e, city) {
  app.util.request({
    'url': 'index/Accommoda/getBywhereAccommoda',
    'cachetime': '0',
    data: {
      "city": city
    },
    success: function(res) {
      e.setData({
        quan_arr: res.data.data
      })
    },
  })
  console.log(e.data.quan_arr, "周末去哪");
}