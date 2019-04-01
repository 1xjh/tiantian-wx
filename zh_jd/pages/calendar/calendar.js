var app = getApp()
var Data = require("../../utils/data.js");
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date_string: '',
    start_string:'',
    days:[],
    alltime: [],
    length:'',
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //==================加载数据================
  onLoad: function(options) {
    if(options.id!=undefined){
      this.setData({
        id:options.id
      })
    }
    // 开始时间和结束时间
    if (options.startDate && options.endDate) {
      var startDate = Data.formatDate(options.startDate, "yyyy-MM-dd");
      var endDate = Data.formatDate(options.endDate, "yyyy-MM-dd");
      var end_date = options.endDate.split('-')
      var date_string = end_date[0] + '-' + parseInt(end_date[1]) + '-' + parseInt(end_date[2])
      this.setData({
        date_string: date_string,
      })
    }
    var date = new Date();
    //获取当前的年月
    var cur_year = date.getFullYear();
    var cur_month = date.getMonth() + 1;
    var cur_day = date.getDate();
    console.log(cur_year, cur_month, cur_day); //当前时间
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    //设置数据
    this.setData({
      org_year: date.getFullYear(), //现在时间的年月日
      org_month: date.getMonth(),
      org_day: cur_day,
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch
    })
    if(options.id!=undefined){
      arr(this,options.id)
    }else{
      this.initData(cur_year, cur_month);
    }
  },

  // ————————————日历——————————
  //初始化数据
  initData: function(cur_year, cur_month) {
    // 计算最近6个月的对象
    var mObject0 = this.calculateDays(cur_year, cur_month);
    if (cur_month + 1 > 12) {
      cur_year = cur_year + 1;
      cur_month = 1;
    } else {
      cur_month = cur_month + 1;
    }
    var mObject1 = this.calculateDays(cur_year, cur_month);
    if (cur_month + 1 > 12) { //月不能大于12
      cur_year = cur_year + 1;
      cur_month = 1;
    } else {
      cur_month = cur_month + 1;
    }
    var mObject2 = this.calculateDays(cur_year, cur_month);
    if (cur_month + 1 > 12) { //月不能大于12
      cur_year = cur_year + 1;
      cur_month = 1;
    } else {
      cur_month = cur_month + 1;
    }
    var mObject3 = this.calculateDays(cur_year, cur_month);
    if (cur_month + 1 > 12) { //月不能大于12
      cur_year = cur_year + 1;
      cur_month = 1;
    } else {
      cur_month = cur_month + 1;
    }
    var mObject4 = this.calculateDays(cur_year, cur_month);
    if (cur_month + 1 > 12) { //月不能大于12
      cur_year = cur_year + 1;
      cur_month = 1;
    } else {
      cur_month = cur_month + 1;
    }
    var mObject5 = this.calculateDays(cur_year, cur_month);
    this.setData({
      allDays: [mObject0, mObject1, mObject2, mObject3 , mObject4, mObject5]
    });
  },
  // =============获取当月有多少天（下个月月初是多少）==========
  getThisMonthDays: function(year, month) {
    // console.log(year, month,"dddddddd")
    return new Date(year, month, 0).getDate();
  },
  // =============获取当月第一周第一天是周几===========
  getFirstDayOfWeek: function(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  //====================计算当前年月空的几天 =============
  calculateEmptyGrids: function(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
    }
    return empytGrids;
  },
  // =====================计算当前年月有哪些天===========
  /**
   * 根据年月计算当前月的天对象状态返回对象
   */
  calculateDays: function(year, month) {
    var mObject = {}; //月对象
    mObject["year"] = year;  
    mObject["month"] = month;  
    //计算当前年月空的几天
    var empytGrids = this.calculateEmptyGrids(year, month);

    if (empytGrids.length > 0) {
      mObject["hasEmptyGrid"] = true;
      mObject["empytGrids"] = empytGrids;
    } else {
      mObject["hasEmptyGrid"] = false;
      mObject["empytGrids"] = [];
    }
    var days = [];

    var thisMonthDays = this.getThisMonthDays(year, month); //这个月有多少天

    var cusDate = new Date(this.data.org_year, this.data.org_month, this.data.org_day);    //现在的时间

    var startDate;
    var endDate;
    if (this.data.startDate && this.data.endDate) {
      startDate = Data.stringToDate(this.data.startDate);
      endDate = Data.stringToDate(this.data.endDate);
    }
    if (this.data.startDate) {
      startDate = Data.stringToDate(this.data.startDate);
    }
   // 获取被预约的时间
     var predetermine  = this.data.alltime //已经被人预定的时间  

    for (let i = 1; i <= thisMonthDays; i++) {
      var day = {};
      //加入的时间
      var date = new Date(year, month - 1, i);
      //status 0-不可选择 1-当前时间 2-可选择 3-被选中
      day["day"] = i;
      var y=year.toString(),m=month.toString(),d=day["day"].toString()
      var timeString = y+m+d;  //所有时间值
 
      //比现在的时间比较是大于还是小于，小于则不可点击
      var time = parseInt(Data.calculateTime(date, cusDate));
      // console.log(time)


      if (time < 0) {
        day["status"] = 0;
      } else if (time == 0) {
        day["status"] = 1;
      } else {
        day["status"] = 2;
      }
          // console.log(timeString)
      for (var t = 0; t < this.data.length; t++) {
        if (timeString == predetermine[t]){
          day["status"] = 4;
       }
      }
  
      if (this.data.startDate && this.data.endDate) {
        var stime = parseInt(Data.calculateTime(date, startDate));
        var etime = parseInt(Data.calculateTime(date, endDate));
        //
        if (stime >= 0 && etime <= 0) {
          day["status"] = 3;
        }
      } else if (this.data.startDate) {
        var stime = parseInt(Data.calculateTime(date, startDate));
        if (stime == 0) {
          day["status"] = 3;
        }
      }
      days.push(day);
    }
    mObject["days"] = days;
    return mObject;
  },
  // 选择时间
  selectAction: function(e) {
    console.log(e.currentTarget.dataset.object);
    var year = e.currentTarget.dataset.object.year;
    var month = e.currentTarget.dataset.object.month;
    var day = e.currentTarget.dataset.idx + 1;
    var selectDate = new Date(year, month - 1, day);
    //现在的时间
    var cusDate = new Date(this.data.org_year, this.data.org_month, this.data.org_day);
    var time = parseInt(Data.calculateTime(selectDate, cusDate));
    if (time < 0) {
      console.log("请选择合理的时间");
      wx.showToast({
        title: '请选择合理的时间',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    if (this.data.startDate && this.data.endDate) {
      this.data.startDate = Data.formatDate(selectDate, "yyyy-MM-dd");
      this.data.endDate = null;
    } else if (this.data.startDate) {
      this.data.endDate = Data.formatDate(selectDate, "yyyy-MM-dd");
    } else {
      this.data.startDate = Data.formatDate(selectDate, "yyyy-MM-dd");
    }
    this.initData(this.data.org_year, this.data.org_month + 1);
    //返回选择的时间（有起止时间的时候返回）
    if (this.data.startDate && this.data.endDate) {
      // console.log(this.data.startDate,"aaaaaaa");
      // console.log(this.data.endDate,"pppppppppp");
      var sDate = this.data.startDate;
      var eDate = this.data.endDate;
      var starttime = sDate.slice(5, 10)
      var endtime = eDate.slice(5, 10)
      var s1 = new Date(starttime.replace(/-/g, "/"));
      var s2 = new Date(endtime.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      if (sDate >= eDate) {

        this.setData({
          startDate: this.data.date,
          endDate: this.data.tomorrow,
          time: 0
        })
        wx: wx.showToast({
          title: '请选择合理的时间',
          icon: '',
          image: '',
          duration: 1000,
        })

      } else if (sDate < eDate) {
        var date_string = eDate.slice(0, 4) + '-' + parseInt(eDate.slice(5, 7)) + '-' + parseInt(eDate.slice(8, 10))
        var start_string = sDate.slice(0, 4) + '-' + parseInt(sDate.slice(5, 7)) + '-' + parseInt(sDate.slice(8, 10))
        this.setData({
          startDate: sDate,
          endDate: eDate,
          time: time,
          date_string: date_string,
          start_string: start_string
        })
      }

    }
  },
  // 确定
  sure: function(e) {
    var sDate = this.data.startDate;
    var eDate = this.data.endDate;
    if (sDate < eDate) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        startDate: sDate,
        endDate: eDate
      })
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
        success: function(res) {
          // success
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      })
    }
  },
  // 清空
  abrogate: function(e) {
    this.setData({
      startDate: this.data.date,
      endDate: this.data.tomorrow,
      time: 0
    })
    // this.selectActio(true)
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
    arr(this, this.data.id)
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

function arr(e,id){
  var arr= []
  app.util.request({
    'url': 'index/Info/getTargetDate',
    'cachetime': '0',
    data: { id: id },
    success: function (res) {
      for (var q = 0; q < res.data.data.length; q++) {
        var kkk = time.js_date_time(res.data.data[q].dateday)
        arr.push(kkk)
        e.setData({
          alltime: arr,
          length: res.data.data.length
        })
      }
      e.initData(e.data.cur_year, e.data.cur_month);
    },
  })
}
