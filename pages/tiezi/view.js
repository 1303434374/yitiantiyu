var api = require('../../api.js');
var app = getApp();
var p = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     viesL:'',
     url: 'https://hx.possji.cn/Upload/',
     content:'',
     huda:'',
     id:'',
     
  },
  inputTitle:function(e){
     this.setData({
         content:e.detail.value
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var page = this;
      this.xiaoqing(options.op)
      this.hudalist(options.op)
      this.setData({ id: options.op})
      //console.log(options.op)
  },
  xiaoqing:function(t){
      var page = this
      app.request({
        url: api.Wxapp.listview,
        data:{id:t},
        method:"post",
        success: function (res) {
         // console.log(res.data)
          var l = res.data
          for (var a in l) {
            l[a].image = l[a].image.split(",");
            l[a].video = l[a].video.split(",");
           wx.setNavigationBarTitle({
             title: l[a].title
            })
          }
          page.setData({
            viesL: l
          })
          
        }
      })  
  },
  hudalist:function(t){
    var page = this
    app.request({
      url: api.Wxapp.hudahandle,
      data: { id: t },
      method: "post",
      success: function (res) {
         //console.log(res.data)
        page.setData({
          huda: res.data
        })

      }
    })  
  },
  gohandle:function(){
     var t = this;
    // var cid = t.options.op
     var cid = t.options.op
     var uid = wx.getStorageSync('userInfo').uid
     if(t.data.content == ''){
       wx.showModal({
         title: "提示",
         content: "内容不能为空",
         showCancel: false,
         success: function (t) {
           console.log('====return====')
         }
       })
       return false;
     }
     wx.showLoading({
       title: '发布中...',
     })
     app.request({
         url:api.Wxapp.tijiaohandle,
         method:'post',
         data:{cid:cid,uid:uid,content:t.data.content},
         success: function (res) {
           wx.hideLoading()
              if(res.code == 0){
                   wx.showToast({
                     title: '回复成功！',
                     icon: 'success',
                     duration: 2000
                   })
                   setTimeout(function(){
                     t.hudalist(cid)
                    // wx.navigateTo({
                      // url: '/pages/index/index',
                     //})
                   },1000)
                   
              }
              if (res.code == 1) {
                wx.showToast({
                  title: res.msg,
                  image: "/image/icon-warning.png",
                });
              }
         }
     })
     

  },
  previewImg: function (t) {
    var e = t.currentTarget.dataset.id;
    var a = this;
    var n = a.data.url;
    var i = [];
    var o = t.currentTarget.dataset.inde;
    var s = a.data.viesL;
    for (var c in s) if (s[c].id == e) {
      var r = s[c].image;
      for (var u in r) i.push(n + r[u]);
      wx.previewImage({
        current: n + r[o],
        urls: i
      })
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
    var id =this.data.id;
    //console.log(id)
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.request({
      url: api.Wxapp.more_huda,
      cachetime: "0",
      data: {
        pageNo: p,
        id: id
      },
      success: function (res) {
        wx.hideLoading();
        var z = res.data.list
        if (z == '' || z == null) {
          wx.showToast({
            title: '我也是有底线的',
            image: "../../image/icon-warning.png",
          });
          return false;
        }
        for (var i = 0; i < res.data.length; i++) {
          z.push(res.data[i])
        }
        e.setData({
          huda: e.data.huda.concat(z)
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