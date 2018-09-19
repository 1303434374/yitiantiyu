//获取应用实例
var api = require('../../api.js');
var app = getApp();
var p = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:'',
     lists:'',
     hid:true,
     cateid:'',
     search: ''
     //tuid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
         var page = this;
         //var title = options.title
         var cateid = options.cateid
         app.request({
           url: api.Wxapp.seach_st,
           data: { cateid: cateid },
           method: 'post',
           success: function (e) {
             page.setData({
               list: e.data.list,
               lists: e.data.list
             })
           }
         })
         page.setData({
           cateid: options.cateid
         })
       //  this.joinsu();
  },
  //搜索
  clickon:function(e){
    var content = this.data.list;
    var val = e.detail.value;
    this.search(e.detail.value)
    console.log(this.data.list)
    this.setData({
        search: e.detail.value
    })
  },
  reset: function (event) {
    if (event.detail.value && !this.data.hid) {
      this.setData({
        search: '',
        hid: true 
      })
    }
  },
  search: function (key) {//搜索方法 key 用户输入的查询字段
    var This = this;

    var content = this.data.list;
    var key = key;
      if (key == "") {//用户没有输入 全部显示
        This.setData({
          list: this.data.lists
        })
        return;
      }
    var list = this.data.list;
    var arr = [];//临时数组 用于存放匹配到的数据
    var array = [];
    list.forEach((value, index, array) => {
      if (value.title.indexOf(key) != -1) {
        arr.push(value.title);
        console.log(arr)
      }
    })
    if(arr != ''){
      for (var i = 0; i < content.length; i++) {
        for (var j = 0; j < arr.length; j++) {
          if (content[i].title == arr[j]) {
            array.push(content[i])
            console.log(array)
          }
        }
      }
      This.setData({
        list: array,
        hid:true
      })
    }else{
      This.setData({
        hid: false
      })
    }
  },
  // joinsu:function(){
  //     var page = this;
  //     var uid = wx.getStorageSync('userInfo').uid
  //     app.request({
  //       url: api.Wxapp.jiaru,
  //       data: { uid: uid},
  //       method: 'post',
  //       success: function (e) {
  //         page.setData({
  //           tuid: e.data.tuid
  //         })
  //       }
  //     })
  // },
  xiangq: function (e) {
    var cid = e.currentTarget.dataset.cid
    var title = e.currentTarget.dataset.title
    var uid = wx.getStorageSync('userInfo').uid
    app.request({
      url: api.Wxapp.jiaru,
      data: { uid: uid,cid:cid },
      method: 'post',
      success: function (e) {
        if(e.code == 0){
          wx.navigateTo({
            url: '/pages/shetuan/xianqing?cid=' + cid + '&title=' + title,
          })
        }
        if(e.code == 1){
          wx.showToast({
            title: '无法查看',
            image: "../../image/icon-warning.png",
          });
          return false;
        }
      }
    })
  },

  join: function (e) {
    var a = this;
    var uid = wx.getStorageSync("userInfo").uid
    var sid = e.currentTarget.dataset.sid
    // wx.showToast({
    //   title: "提交中...",
    //   icon: "loading",
    // })
    app.request({
      url: api.Wxapp.join_shetuan,
      data: {
        uid: uid,
        sid: sid,
        cateid: this.data.cateid
      },
      method: 'post',
      success: function (res) {
        // wx.hideToast()
        if (res.code == 0) {
          wx.showToast({
            title: res.msg,
            icon: 'success',
            duration: 2000
          })
          ///这个方法？？？
         /// a.loadData();
        }
        if (res.code == 1) {
          wx.showToast({
            title: res.msg,
            icon: 'loading',
            duration: 2000
          })
        }
      }
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
    if (p > 1) {
      p = 1;
    }
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
    var e = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.request({
      url: api.Wxapp.more_shetuan,
      cachetime: "0",
      data: {
        pageNo: p,
        cateid: e.data.cateid
      },
      success: function (res) {
        wx.hideLoading();
        var z = res.data.list
        if (z == '' || z == null) {
          wx.showToast({
            title: '没有更多了',
            image: "../../image/icon-warning.png",
          });
          return false;
        }
        for (var i = 0; i < res.data.length; i++) {
          z.push(res.data[i])
        }
        e.setData({
          list: e.data.list.concat(z)
        });
        p++;
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})