// pages/shetuan/shetuan.js
var api = require('../../api.js');
var app = getApp();
var p = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.footer(this);
    this.loadData();
  },
  loadData:function(){
    var a = this;
    app.request({
      url: api.Wxapp.shetuan,
      success: function (res) {
       console.log(res.shetuan)
        a.setData({
          list: res.shetuan
        })
      }
    })
  },
  xiangq:function(e){
      var cid = e.currentTarget.dataset.cid
      var title = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '/pages/shetuan/xianqing?cid=' + cid + '&title=' + title,
      })

  },
  sxcateid:function(){
     wx.navigateTo({
       url: '/pages/shetuan/cateid',
     })
  },
  join:function(e){
      var a = this;
      var uid = wx.getStorageSync("userInfo").uid
      var sid = e.currentTarget.dataset.sid
      // wx.showToast({
      //   title: "提交中...",
      //   icon: "loading",
      // })
      app.request({
        url: api.Wxapp.join_shetuan,
        data:{
            uid:uid,
            sid:sid
        },
        method:'post',
        success: function (res) {
         // wx.hideToast()
            if(res.code == 0){
              wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 2000
              })
              a.loadData();
            }
            if (res.code == 1){
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