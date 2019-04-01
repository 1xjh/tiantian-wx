// zh_jd/pages/mylist/comment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    upload_picture_list: [],
    all: [],
    flag1: 5,
    flag2: 5,
    flag3: 5,
    flag4: 5,
    images1: "../../images/xing-hong@3x.png",
    images2: "../../images/xing-hui@3x.png",
    order_id:'',
    content:"此用户没有填写评价内容"
  },
  changeSanitation1: function() {
    var that = this;
    that.setData({
      flag1: 1
    });
  },
  changeSanitation2: function() {
    var that = this;
    that.setData({
      flag1: 2
    });
  },
  changeSanitation3: function() {
    var that = this;
    that.setData({
      flag1: 3
    });
  },
  changeSanitation4: function() {
    var that = this;
    that.setData({
      flag1: 4
    });
  },
  changeSanitation5: function() {
    var that = this;
    that.setData({
      flag1: 5
    });
  },
  changeTraffic1: function() {
    var that = this;
    that.setData({
      flag2: 1
    });
  },
  changeTraffic2: function() {
    var that = this;
    that.setData({
      flag2: 2
    });
  },
  changeTraffic3: function() {
    var that = this;
    that.setData({
      flag2: 3
    });
  },
  changeTraffic4: function() {
    var that = this;
    that.setData({
      flag2: 4
    });
  },
  changeTraffic5: function() {
    var that = this;
    that.setData({
      flag2: 5
    });
  },
  changeServe1: function() {
    var that = this;
    that.setData({
      flag3: 1
    });
  },
  changeServe2: function() {
    var that = this;
    that.setData({
      flag3: 2
    });
  },
  changeServe3: function() {
    var that = this;
    that.setData({
      flag3: 3
    });
  },
  changeServe4: function() {
    var that = this;
    that.setData({
      flag3: 4
    });
  },
  changeServe5: function() {
    var that = this;
    that.setData({
      flag3: 5
    });
  },
  changeDecorate1: function() {
    var that = this;
    that.setData({
      flag4: 1
    });
  },
  changeDecorate2: function() {
    var that = this;
    that.setData({
      flag4: 2
    });
  },
  changeDecorate3: function() {
    var that = this;
    that.setData({
      flag4: 3
    });
  },
  changeDecorate4: function() {
    var that = this;
    that.setData({
      flag4: 4
    });
  },
  changeDecorate5: function() {
    var that = this;
    that.setData({
      flag4: 5
    });
  },
  
  // 获取文本内容
  bindText(e){
    console.log(e.detail.value)
    this.setData({
      content:e.detail.value
    })
  },
  //选择图片方法
  uploadpic: function(e) {
    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
    var all = that.data.all
    //选择图片
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      count: 9,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: "https://www.tiantiandj.com/xcx/index.php/index/Tool/upload_goodsimg?img_type=comment",
          filePath: tempFilePaths,
          name: 'file',
          formData: {},
          success: function(res) {
            var img_url = JSON.parse(res.data)
            var img = img_url.data.src;
            all.push(img)
            that.setData({
              all: all,
            });
          },
          fail: function(res) {
          },
        })
        that.setData({
          logo2: tempFilePaths
        })
        var tempFiles = res.tempFiles
        //把选择的图片 添加到集合里
        for (var i in tempFiles) {
          tempFiles[i]['upload_percent'] = 0
          tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])
        }
        //显示
        that.setData({
          upload_picture_list: upload_picture_list,
        });
      }
    })
  },
  //点击上传事件 
  uploadimages: function() {
    var that = this
    app.util.request({
      'url': 'index/Tool/comment',
      'cachetime': '0',
      "method":"post",
      data: {
        order_id: that.data.order_id,
        health: that.data.flag1,
        traffic: that.data.flag2,
        landlord: that.data.flag3,
        indoor: that.data.flag4,
        img: that.data.all,
        content:that.data.content,
      },
      success: function(res) {
        if(res.data.success==1){
          wx.showToast({
            title: '评论成功',
            icon: 'none',
            duration: 1000,
            success: function(res) {
              wx.reLaunch({
                url: '../mylist/mylist',
              })

            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }else{
          wx.showToast({
            title: '评论失败',
          })
        }
      },
    })
  },

  // 删除图片
  deleteImg: function(e) {
    let upload_picture_list = this.data.upload_picture_list;
    let all = this.data.all;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    all.splice(index, 1)
    this.setData({
      all: all,
      upload_picture_list: upload_picture_list
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log()
    this.setData({
      order_id: options.order_id
    })
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

function upload_file_server(url, that, upload_picture_list, j) {
  //上传返回值
  const upload_task = wx.uploadFile({
    // 模拟https
    url: url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
    filePath: upload_picture_list[j]['path'], //上传的文件本地地址    
    name: 'file',
    formData: {
      'num': j
    },
    //附近数据，这里为路径     
    success: function(res) {
      var data = JSON.parse(res.data);
      // //字符串转化为JSON  
      if (data.Success == true) {
        var filename = data.file //存储地址 显示
        upload_picture_list[j]['path_server'] = filename
      } else {
        upload_picture_list[j]['path_server'] = filename
      }
      that.setData({
        upload_picture_list: upload_picture_list
      });
      wx.setStorageSync('imgs', upload_picture_list);
    }
  })
  //上传 进度方法
  upload_task.onProgressUpdate((res) => {
    upload_picture_list[j]['upload_percent'] = res.progress
    that.setData({
      upload_picture_list: upload_picture_list
    });
  });
}