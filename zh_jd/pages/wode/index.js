var app = getApp()
Page({
  data: {
    info: [
      {
        payment: '到店付',
        img: '../../images/daodianfu.png',
        id: '1',
        state: '1',
        price: ''
      },
      {
        payment: '在线付',
        img: '../../images/zaixianfu.png',
        id: '2',
        state: '2'
      }
    ],
    star1: [
      { num: '../../images/xing-hui@2x.png' },
      { num: '../../images/xing-hui@2x.png' },
      { num: '../../images/xing-hui@2x.png' },
      { num: '../../images/xing-hui@2x.png' },
      { num: '../../images/xing-hui@2x.png' },
    ],
    selected: true,
    selected1: false,
    hidden: false,
    toastHidden: true,
  },
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.setNavigationBarTitle({
      title: '酒店详情'
    })
    that.refresh()
    that.setData({
      index_info: options
    })
  },
  refresh: function (e) {
    var that = this
    var url = wx.getStorageSync("url")
    var hotel_id = wx.getStorageSync('hotel')
    that.setData({
      url: url,
      hotel_id: hotel_id
    })
    // 获取当前时间
    var myDate = new Date().toLocaleDateString().replace(/\//g, "-");
    // 获取房间信息
    app.util.request({
      'url': 'entry/wxapp/getroom',
      'cachetime': '0',
      data: { seller_id: hotel_id },
      success: function (res) {
        console.log('这是房型列表')
        console.log(res)
        var newarr = res.data
        for (let i = 0; i < newarr.length; i++) {
          // 获取今日房间价格
          app.util.request({
            'url': 'entry/wxapp/todaycost',
            'cachetime': '0',
            data: { room_id: newarr[i].id, day: myDate },
            success: function (res) {
              console.log('这是今日价格')
              console.log(res)
              console.log(newarr[i])
              var today_cost = res.data
              if (today_cost.name == null) {
                newarr[i].online_price = today_cost

              }
              newarr[i].img = newarr[i].img.split(",")
              that.setData({
                room: newarr
              })
            },
          })

        }

      },
    })
    // 获取酒店信息
    app.util.request({
      'url': 'entry/wxapp/gethotel',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          if (hotel_id == res.data[i].id) {
            console.log(res.data[i])
            res.data[i].img = res.data[i].img.split(",")
            // 获取酒店的经纬度
            var lat = res.data[i].coordinates
            var ss = lat.split(",")
            console.log(ss)
            // 获取两者之间的距离
            var lat1 = wx.getStorageSync("location").lat
            var lng1 = wx.getStorageSync("location").lng
            var lat2 = ss[0]
            var lng2 = ss[1]
            var radLat1 = lat1 * Math.PI / 180.0;
            var radLat2 = lat2 * Math.PI / 180.0;
            var a = radLat1 - radLat2;
            var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * 6378.137;
            s = Math.round(s * 10000) / 10000;
            res.data[i].s = s.toFixed(2)
            that.setData({
              seller: res.data[i],
            })
          }
        }
      },
    })
    // 获取评价信息
    app.util.request({
      'url': 'entry/wxapp/assessList',
      'cachetime': '0',
      data: { seller_id: hotel_id },
      success: function (res) {
        var len = res.data.length
        that.setData({
          assesslist: res.data[0],
          ass: res.data,
          len: len
        })
      },
    })
    //  获取酒店评分
    app.util.request({
      'url': 'entry/wxapp/jdscore',
      'cachetime': '0',
      data: { seller_id: hotel_id },
      success: function (res) {
        var score = res.data
        var star1 = that.data.star1
        var img = '../../images/xing-hong@2x.png'
        if (score == 0) {
          star1 = star1
        } else if (score == 1) {
          star1[0].num = img
        } else if (score == 2) {
          star1[0].num = img
          star1[1].num = img
        } else if (score == 3) {
          star1[0].num = img
          star1[1].num = img
          star1[2].num = img
        } else if (score == 4) {
          star1[0].num = img
          star1[1].num = img
          star1[2].num = img
          star1[3].num = img
        } else if (score == 5) {
          star1[0].num = img
          star1[1].num = img
          star1[2].num = img
          star1[3].num = img
          star1[4].num = img
        }
        that.setData({
          score: score,
          star1: star1,
        })
      },
    })
    //  获取评价数量
    app.util.request({
      'url': 'entry/wxapp/assesscount',
      'cachetime': '0',
      data: { seller_id: hotel_id },
      success: function (res) {
        that.setData({
          total: res.data.total
        })
      },
    })
  },
  // ---------------------切换-------------------
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true,
      hidden: false,
      toastHidden: true,
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true,
      hidden: true,
      toastHidden: false,
    })
  },
  // ------------------------房型显示----------------
  kindToggle: function (e) {
    var id = e.currentTarget.id
    var room = this.data.room
    for (var i = 0, len = room.length; i < len; ++i) {
      if (room[i].id == id) {
        room[i].open = !room[i].open
      } else {
        room[i].open = false
      }
    }
    this.setData({
      room: room,
      id: e.currentTarget.id
    });
  },
  // 弹框显示
  kindToggle1: function (e) {
    var id = e.currentTarget.id
    var room = this.data.room
    for (var i = 0, len = room.length; i < len; ++i) {
      if (room[i].id == id) {
        room[i].openr = !room[i].openr
      } else {
        room[i].openr = false
      }
    }
    this.setData({
      room: room,
      id: e.currentTarget.id
    });
  },
  ejectblock: function (e) {
    var id = e.currentTarget.id
    var room = this.data.room
    for (var i = 0, len = room.length; i < len; ++i) {
      if (room[i].id == id) {
        room[i].openr = !room[i].openr
      } else {
        room[i].openr = false
      }
    }
    this.setData({
      room: room,
      id: e.currentTarget.id
    });
  },
  info: function (e) {
    wx: wx.navigateTo({
      url: '../introduce/introduce?hotel_id' + this.data.hotel_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  hotel_info: function (e) {
    wx: wx.navigateTo({
      url: '../introduce/introduce?hotel_id' + this.data.hotel_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  dizhi: function (e) {
    var that = this
    var lat2 = Number(that.data.seller.coordinates.split(",")[0])
    var lng2 = Number(that.data.seller.coordinates.split(",")[1])
    wx.openLocation({
      latitude: lat2,
      longitude: lng2,
      name: that.data.seller.name,
      address: that.data.seller.address
    })
  },
  phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.seller.link_tel
    })
  },
  //----------------------------跳转订单页面---------------------------
  book: function (e) {
    var id = this.data.id
    var oid = e.currentTarget.dataset.oid
    var room = this.data.room
    // 是否开启入驻押金
    var is_deposit = this.data.seller.is_deposit
    // 是否可以退押金
    var is_refund = this.data.seller.is_refund
    // 押金
    var yj_cost = this.data.seller.yj_cost
    console.log(this.data)
    if (this.data.id == e.currentTarget.id) {
      for (var i = 0; i < room.length; i++) {
        if (room[i].id == id) {
          if (oid == 1) {
            wx.navigateTo({
              url: '../book/book?yj_cost=' + yj_cost + '&price=' + room[i].shop_price + '&name=' + room[i].name + '&oid=' + 1 + '&id=' + room[i].id + '&hotel_name=' + this.data.hotel_name + '&hotel_id=' + this.data.hotel_id + '&is_deposit=' + is_deposit + '&is_refund=' + is_refund
            })
          } else {
            wx.navigateTo({
              url: '../book/book?price=' + room[i].online_price + '&name=' + room[i].name + '&num=' + room[i].total_num + '&oid=' + 2 + '&id=' + room[i].id + '&hotel_name=' + this.data.hotel_name + '&hotel_id=' + this.data.hotel_id + '&is_deposit=' + is_deposit + '&is_refund=' + is_refund + '&yj_cost=' + yj_cost + '&time=' + this.data.index_info.time
            })
          }
        }
      }

    }



  },
  // 下拉刷新
  onPullDownRefresh() {
    var that = this
    that.refresh()
    wx.stopPullDownRefresh();
  },
})