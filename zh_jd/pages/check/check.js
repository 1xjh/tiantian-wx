// zh_jd/pages/check/check.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    inde: 0,
    prompt: false,
    choice: true,
    getmsg: "获取验证码",
    interval: 'interval2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 获取用户openid
    var openid = wx.getStorageSync("openid")
    // 获取用户id
    var user_id = wx.getStorageSync("users").id
    console.log('用户的openid为' + ' ' + openid + ' ' + '用户的user_id为' + ' ' + user_id)
    that.setData({
      user_id: user_id
    })
  },
  // 选择名宿名称
  bindRegionChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      inde: e.detail.value
    })
  },
  // 选择酒店成立时间
  startDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  // 选择酒店设施
  choice: function(e) {
    this.setData({
      choice: true
    })
  },
  // 关闭酒店设施
  complete: function(e) {
    var that = this
    that.setData({
      choice: false
    })
  },
  // 上传图片
  choose: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: "https://www.tiantiandj.com/xcx/index.php/index/Tool/upload_goodsimg?img_type=enter",
          filePath: tempFilePaths,
          name: 'file',
          formData: {},
          success: function(res) {
           var img_url  = JSON.parse(res.data)
            that.setData({
              uplogo1: img_url.data.src,
            })
          },
          fail: function(res) {
            console.log(res)
          },
        })
        that.setData({
          logo: tempFilePaths
        })
      }
    })
  },
  // 上传图片
  choose1: function(e) {
    var that = this
    // var url = that.data.url
    var uniacid = wx.getStorageSync("users").uniacid
    // console.log(uniacid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: "https://www.tiantiandj.com/xcx/index.php/index/Tool/upload_goodsimg?img_type=enter",
          filePath: tempFilePaths,
          name: 'file',
          formData: {},
          success: function(res) {
            var img_url = JSON.parse(res.data)
            that.setData({
              uplogo2: img_url.data.src,
            })
          },
          fail: function(res) {
            console.log(res)
          },
        })
        that.setData({
          logo1: tempFilePaths
        })
      }
    })
  },
  // 上传图片
  choose2: function(e) {
    var that = this
    // var url = that.data.url
    var uniacid = wx.getStorageSync("users").uniacid
    // console.log(uniacid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: "https://www.tiantiandj.com/xcx/index.php/index/Tool/upload_goodsimg?img_type=enter",
          filePath: tempFilePaths,
          name: 'file',
          formData: {},
          success: function(res) {
            var img_url = JSON.parse(res.data)
            that.setData({
              uplogo3: img_url.data.src
            })
          },
          fail: function(res) {
            console.log(res)
          },
        })
        that.setData({
          logo2: tempFilePaths
        })
      }
    })
  },
  // 多选框
  checkboxChange: function(e) {
    var that = this
    console.log(e)
    var facilities = e.detail.value
    that.setData({
      facilities: facilities
    })
  },
  // 获取用户输入的手机号
  user_name: function(e) {
    var that = this
    console.log(e)
    var name = e.detail.value
    that.setData({
      name: name
    })
  },
  // 验证码
  sendmessg: function(e) {
    var that = this
    console.log(that.data)
    var name = that.data.name
    if (name == '' || name == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    else {
      // 随机数传给后台
      app.util.request({
        'url': 'index/Tool/sendCode',
        'cachetime': '0',
        data: {
          phone: name
        },
        success: function(res) {
          console.log(res)
          if (res.data.success==1) {
            that.setData({
              num: res.data.data
            })
            wx: wx.showToast({
              title: '发送成功',
              icon: '',
              image: '',
              duration: 2000,
            })
          }
          else {
            wx: wx.showToast({
              title: '发送失败',
              icon: '',
              image: '',
              duration: 2000,
            })
          }
        },
      })
      var time = 300
      // 60秒倒计时
      var inter = setInterval(function() {
        var times= timestampToTime(time)
        that.setData({
          getmsg: times + "后重新发送",
          send: true
        })
        time--
        if (time <= 0) {
          // 停止倒计时
          clearInterval(inter)
          that.setData({
            getmsg: "获取验证码",
            send: false,
            num: 0
          })
        }
      }, 1000)
    }

  },
  formSubmit: function(e) {
    var that = this
    // 具体地址
    var hotel_address = e.detail.value.hotel_address
    // 名宿名称
    var hotel_name = e.detail.value.hotel_name
    // 酒店邮箱
    var hotel_mail = e.detail.value.hotel_mail
    // 验证码
    var yz_code = e.detail.value.yz_code
    // 输入的手机号
    var yz_tel = e.detail.value.yz_tel
    // 名宿地区
    var address = e.detail.value.address
    //民宿成立时间
    var dates = that.data.dates
    // 名宿的设施
    // var facilities = that.data.facilities
    // 名宿图片
    // var tempFilePaths1 = that.data.tempFilePaths1
    // 证件-------------------------营业执照
    var logo = that.data.uplogo1
    // 证件-------------------------身份证正面
    var logo1 = that.data.uplogo2
    // 证件-------------------------身份证反面
    var logo2 = that.data.uplogo3
    // 随机6位数
    var num = that.data.num
    // 补充说明
    var textarea = e.detail.value.textarea
    if (textarea == '' || textarea == null) {
      textarea = '没有'
    }
    var reg_email = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
    var title = ''
    if (hotel_name == '') {
      title = '请输入名宿名称'
    } else if (address == '') {
      title = '名宿地区'
    } else if (hotel_address == '') {
      title = '请输入名宿具体地址'
    } else if (reg_email.test(hotel_mail) == false) {
      title = '请输入正确名宿邮箱'
    } else if (dates == '' || dates == null) {
      title = '名宿开业时间'
    } else if (logo == '' || logo == null) {
      title = '请上传营业执照'
    } else if (logo1 == '' || logo1 == null) {
      title = '请上传身份证正面'
    } else if (logo2 == '' || logo2 == null) {
      title = '请上传身份证反面'
    } else if (yz_tel == '') {
      title = '请输入名宿电话'
    } else if (yz_code == '') {
      title = '请输入验证码'
    } else if (yz_code != num) {
      title = '输入验证码错误'
    }
    if (title != '') {
      wx: wx.showModal({
        title: '提示',
        content: title,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      app.util.request({
        'url': 'index/Tool/enter',
        'cachetime': '0',
        "method":"post",
        data: {
          name: hotel_name,
          city: address,
          address: hotel_address,
          cl_date: dates,
          mail: hotel_mail,
          img: logo,
          card_img1: logo1,
          card_img2: logo2,
          jd_tel: yz_tel,
          code: num,
          other: textarea,
        },
        success: function(res) {
          if(res.data.success==1){
            wx: wx.navigateTo({
              url: 'check_s',
            })
          }else{
            wx.showToast({
              title: '验证码错误',
              icon: 'none',
              duration: 1000,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        }
      })
    }


  },
  reset: function(e) {
    // this.onload()
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
  var min = Math.floor(s / 60) % 60;
  var sec = s % 60;
  min = add(min);
  sec = add(sec);
  return min + ':' + sec
}

// 添 0
function add(m) {
  return m < 10 ? '0' + m : m
}