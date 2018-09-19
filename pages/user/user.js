// pages/user/user.js
//获取应用实例
var api = require('../../api.js');
var app = getApp();
var p = 1;
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    menuTapCurrent:0,
    url: 'https://hx.possji.cn/Upload/',
    fabu:'',
    hufu:'',
    shetu:'',
    curr_id: 0,
    jiazai: '下拉加载更多',
    jiazait: '下拉加载更多',
    jiazaitt: '下拉加载更多',
    shenstatus: 0
  },
  onReady: function () {  //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options) {
      this.setData({
        menuTapCurrent: options.id 
      })
    }
    var page = this;
    app.util.footer(this);
    page.loadData();
    page.shen();
  },
  loadData:function(){
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo == ''){
         is_login:!1
    }
    this.setData({
      userInfo: userInfo
    })
    this.reloads(wx.getStorageSync('userInfo').uid);
    this.hufu(wx.getStorageSync('userInfo').uid)
    this.shetua(wx.getStorageSync('userInfo').uid)

  },
  videoPlay: function (e) {
    var length = this.data.fabu.length
    if (!this.data.curr_id) {
      this.setData({
        curr_id: e.currentTarget.dataset.id,
      })
      var videoContext = wx.createVideoContext('index' + this.data.curr_id);
      videoContext.play()
    } else {
      var videoContextPrev = wx.createVideoContext('index' + this.data.curr_id)
      videoContextPrev.seek(0)
      videoContextPrev.pause()
      this.setData({
        curr_id: e.currentTarget.dataset.id,
      })
      var videoContextCurrent = wx.createVideoContext('index' + this.data.curr_id)
      videoContextCurrent.play()
    }
  },
  bindplay: function (e) {
    this.setData({
      curr_id: e.currentTarget.dataset.id,
    })
  },
  bindended: function (e) {
    this.setData({
      curr_id: ''
    });
  },
  onPageScroll: function (e) {
    var a = this;
    // if (e.scrollTop == 200){
    //       console.log('111111111111111')
    //  }
  },
  // bindpause:function(e){
  //   this.setData({
  //      curr_id:''
  //   });
  // },
  clickvideo: function (e) {
    console.log(e)
  },
  menuTap: function (t) {
    var a = t.currentTarget.dataset.current;
    this.setData({
      menuTapCurrent: a,
      currentPageNumber: 1
    })
  },
  cha: function (e) {
    var cid = e.currentTarget.dataset.cid
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/shetuan/xianqing?cid=' + cid + '&title=' + title,
    })

  },
  goview: function (e) {
    var id = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '/pages/tiezi/view?op=' + id,
    })
  },
  reloads:function(e){
      var page = this;
      app.request({
          url:api.Wxapp.userlist,
          data:{uid:e},
          method:'post',
          success:function(e){
            var l = e.data.fabu;
            for (var a in l) {
              l[a].image = l[a].image.split(",");
              l[a].video = l[a].video.split(",");
            }
            page.setData({
              fabu:l
            })
          }
      })
  },
  previewImg: function (t) {
    var e = t.currentTarget.dataset.id;
    var a = this;
    var n = a.data.url;
    var i = [];
    var o = t.currentTarget.dataset.inde;
    var s = a.data.fabu;
    for (var c in s) if (s[c].id == e) {
      var r = s[c].image;
      for (var u in r) i.push(n + r[u]);
      wx.previewImage({
        current: n + r[o],
        urls: i
      })
    }
  },
  views: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/tiezi/view?op=' + id,
    })
  },
  edits:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/tiezi/edit?op='+ id,
    })
  },
  //
  moress: function () {
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.request({
      url: api.Wxapp.more_myxlist,
      cachetime: "0",
      data: {
        uid: wx.getStorageSync('userInfo').uid,
        pageNo: p,
      },
      success: function (res) {
        wx.hideLoading();
        var z = res.data.list
        if (z == '') {
          page.setData({
            jiazai: '已全部加载'
          })
          return false;
        }
        for (var a in z) {
          z[a].image = z[a].image.split(",");
          z[a].video = z[a].video.split(",");
        }
        for (var i = 0; i < res.data.length; i++) {
          z.push(res.data[i])
        }
        page.setData({
          fabu: page.data.fabu.concat(z)
        });
        p++;
      }
    });

  },
  moresss: function () {
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.request({
      url: api.Wxapp.more_myhlist,
      cachetime: "0",
      data: {
        uid: wx.getStorageSync('userInfo').uid,
        pageNo: p,
      },
      success: function (res) {
        wx.hideLoading();
        var z = res.data.hufu
        if (z == '') {
          page.setData({
            jiazait: '已全部加载'
          })
          return false;
        }
        for (var i = 0; i < res.data.length; i++) {
          z.push(res.data[i])
        }
        page.setData({
          hufu: page.data.hufu.concat(z)
        });
        p++;
      }
    });

  },
  morese: function () {
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.request({
      url: api.Wxapp.more_myslist,
      cachetime: "0",
      data: {
        uid: wx.getStorageSync('userInfo').uid,
        pageNo: p,
      },
      success: function (res) {
        wx.hideLoading();
        var z = res.data.shet
        if (z == '') {
          page.setData({
            jiazaitt: '已全部加载'
          })
          return false;
        }
        for (var i = 0; i < res.data.length; i++) {
          z.push(res.data[i])
        }
        page.setData({
          shetu: page.data.shetu.concat(z)
        });
        p++;
      }
    });

  },
  hufu:function(e){
    var page = this;
    app.request({
      url: api.Wxapp.userhufu,
      data: { uid: e },
      method: 'post',
      success: function (e) {
       // console.log(e)
        page.setData({
          hufu: e.data
        })
      }
    })
  },
  shetua:function(e){
     var page = this;
     app.request({
       url: api.Wxapp.usershetu,
       data: { uid: e },
       method: 'post',
       success: function (e) {
         //console.log(e.data)
         page.setData({
           shetu: e.data
         })
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
  shen: function () {
    var a = this;
    app.request({
      url: api.Wxapp.shen,
      success: function (res) {
        console.log(res.status.status);
        app.globalData.shenstatus = res.status.status
        a.setData({
          shenstatus: res.status.status
        })
      }
    })
  },
  delhf:function(e){
    let getid = e.currentTarget.dataset.fid;
    let id=e.currentTarget.dataset.id;
    var a = this;
    wx.showModal({
      title: '删除提示',
      content: '是否删除该回复？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          app.request({
            url: api.Wxapp.deletehf,
            data: { hid: getid,id:id },
            success: function (res) {
              console.log(res);
              if(res.code==1){
                a.loadData();
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })
   
    console.log('得到回复的id'+getid); 
  },
  onShow: function () {
    this.shen();
    this.onLoad();
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
    let index = this.data.menuTapCurrent
    if (!index) {
      index = 0
    }
    console.log(index)
    switch (Number(index)) {
      case 0:
        this.moress()
        break
      case 1:
        this.moresss()
        break
      case 2:
        this.morese()
        break
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})