var api = require('../../api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sx_01: '../../image/sx_01.gif',
    sx_02: '../../image/sx_02.gif',
    sx_03: '../../image/sx_03.gif',
    sx_04: '../../image/sx_04.gif',
    sx_05: '../../image/sx_05.gif',
    typedata:[],
    right: '../../image/right.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.footer(this);
    this.getTypeinfo();
  },
  getTypeinfo: function () {
    var a = this;
    app.request({
      url: api.Wxapp.cate,
      success: function (res) {
       // console.log(res.shetuantype)
        a.setData({
          typedata: res.shetuantype
        })
      }
    })
  },
  seach:function(e){
    var title = e.currentTarget.dataset.title
    var cateid = e.currentTarget.dataset.cateid
    wx.navigateTo({
      url: '/pages/seach/serach?title=' + title + '&cateid=' + cateid,
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})