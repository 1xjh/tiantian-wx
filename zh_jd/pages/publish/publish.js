// zh_jd/pages/check/check.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasimg:false,
    tempimg:[],
    uploadimg:[],
    index: 0,
    inde: 0,
    prompt: false,
    choice: true,
    interval: 'interval2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    // 获取用户openid
    var openid = wx.getStorageSync("openid")
    // 获取用户id
    var user_id = wx.getStorageSync("users").id
    console.log('用户的openid为' + ' ' + openid + ' ' + '用户的user_id为' + ' ' + user_id)
    that.setData({
      user_id:user_id
    })
    // 获取上传图片所需的链接
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    var location = wx.getStorageSync('location')
    let op = location.lat + ',' + location.lng;
    app.util.request({
      'url': 'entry/wxapp/map',
      'cachetime': '0',
      data: { op: op },
      success: res => {
        console.log(res)
        that.setData({
          city: res.data.result.ad_info.city,
        })

      }
    })
  },
  // 选择酒店成立时间
  startDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  // 上传图片
  upload:function(imgs){
    console.log(imgs)
    var that = this
    var url = that.data.url
    var uniacid = wx.getStorageSync("users").uniacid
    var i=imgs.i? imgs.i : 0;
    var uploadimg = that.data.uploadimg
    var tempimg = that.data.tempimg
    wx.uploadFile({
      url: url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_jd',
      filePath: imgs.path[i],
      name: 'upfile',
      formData: {},
      success: function (res) {
        console.log(res)
        uploadimg.push(res.data)
        tempimg.push(imgs.path[i])
        that.setData({
          uploadimg: uploadimg,
          tempimg: tempimg,
          hasimg:true
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete:function(res){
        i++;
        if(i==imgs.path.length){
          console.log('上传完成')
        }else{
          console.log(i)
          imgs.i=i
          that.upload(imgs)
        }
      }
    })
  },
  // 选择图片
  choose: function (e) {
    var that = this
    var url = that.data.url
    var uniacid = wx.getStorageSync("users").uniacid
    console.log(url)
    console.log(uniacid)
    that.setData({
      tempimg:[],
      uploadimg:[],
      hasimg:false
    })
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imags=[]
         imags.path = res.tempFilePaths
         console.log(imags);
        that.upload(imags)
        console.log(that.data.uploadimg)
      }
    })
  },
  // 上传图片
  choose1: function (e) {
    var that = this
    console.log(that.data)
    var url = that.data.url
    var uniacid = wx.getStorageSync("users").uniacid
    // console.log(uniacid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_jd',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              uplogo2: res.data
            })
          },
          fail: function (res) {
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
  choose2: function (e) {
    var that = this
    var url = that.data.url
    var uniacid = wx.getStorageSync("users").uniacid
    // console.log(uniacid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_jd',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              uplogo3: res.data
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
        that.setData({
          logo2: tempFilePaths
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
   
    // 标题
    var title = e.detail.value.title
    // 出行天数
    var days = e.detail.value.days
    // 出行人数
    var people = e.detail.value.people
    // 人均费用
    var travel_fee = e.detail.value.travel_fee
    //出发城市
    var city = e.detail.value.city
    var location = that.data.city
    console.log(e.detail.value)
    //出发日期
    var travel_time = that.data.dates
    // 酒店图片
    // var tempFilePaths1 = that.data.tempFilePaths1
    // 图片1 封面图片
    var img = that.data.uplogo2
    // 图片2
    // var img1 = that.data.uplogo2
    // // 图片4
    // var img2 = that.data.uplogo3
    // 随机6位数
    var uploadimg = that.data.uploadimg.toString()
    console.log(uploadimg)
    var num = that.data.num
    // 补充说明
    var textarea = e.detail.value.textarea
    if (textarea == '' || textarea==null){
      textarea=''
    }
    
    var showtitle = ''
    if (title == '') {
      showtitle = '请输入标题'
    }
     if (days == '') {
      // showtitle = '请输入出行天数'
    } 
    if (people == '') {
      // showtitle = '请输入出行人数'
    }  
    if (travel_fee == '') {
      // showtitle = '请输入人均费用'
    }
    if(city==''){
      showtitle = '请输入目的地'
    } 
    if (travel_time == '') {
      // showtitle = '请输入出发时间'
    }
    if (img == '' || img == null ) {
      showtitle = '请上传封面图片'
    }
    if (showtitle != '') {
      wx: wx.showModal({
        title: '提示',
        content: showtitle,
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
        'url': 'entry/wxapp/savetravel',
        'cachetime': '0',
        data: {
          user_id:that.data.user_id,
          title: title,
          days: days,
          people: people,
          city:city,
          imgs:uploadimg,
          travel_fee: travel_fee,
          img: img,
          travel_time: travel_time,
          // img1: img1,
          content: textarea,
          // img2: img2,
          location:location
        },
        success: function (res) {
          wx:wx.reLaunch({
            url: '../travel/travel',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      })
    }
    
   
  },
  reset: function (e) {
    // this.onload()
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