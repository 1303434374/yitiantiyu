var api = require('../../api.js');
var app = getApp();
var p = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     sinfo:'',
     list:'',
     url: 'https://hx.possji.cn/Upload/',
     jiazai: '加载更多',
     cc:'',
     curr_id: 0,
  },
  onReady: function () {  //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
   })
   // console.log(options.cid)
   //options.cid
   this.setData({
       cc:options.cid
   })
    this.loadData(options.cid)
  },
  videoPlay: function (e) {
    var length = this.data.list.length
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
  loadData:function(e){
        var page = this;
        app.request({
            url:api.Wxapp.st_view,
            data:{id:e},
            method:'post',
            success: function (res) {
               var l = res.data.list;
              console.log(res)
              for (var a in l) {
                l[a].image = l[a].image.split(",");
                l[a].video = l[a].video.split(",");
               }
               page.setData({
                 sinfo: res.data.sinfo,
                 list:l,
              })
            }
        })
  },
  addst: function () {
    wx.navigateTo({
      url: '/pages/fabu/fabu',
    })

  },
  zans: function (e) {
    var page = this;
    var cid = e.currentTarget.dataset.id
    app.request({
      url: api.Wxapp.zan,
      method: "post",
      data: {
        id: cid,
        uid: wx.getStorageSync("userInfo").uid
      },
      success: function (res) {
        console.log(res.code)
        if (res.code == 0) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1500,
          })
          for (var i = 0; i < page.data.list.length; i++) {
            if (page.data.list[i].id == cid) {
              page.setData({
                ['list[' + i + '].is_zan']: res.data.zanr.is_zan
              })
            }
          }
        }else if (res.code == 1) {
          wx.showToast({
            title: '已取消',
            icon: 'success',
            duration: 1500,
          })
          for (var i = 0; i < page.data.list.length; i++) {
            if (page.data.list[i].id == cid) {
              page.setData({
                ['list[' + i + '].is_zan']: res.data.zanr.is_zan
              })
            }
          }
        }
      }
    });
  },
  previewImg: function (t) {
    var e = t.currentTarget.dataset.id;
    var a = this;
    var n = a.data.url;
    var i = [];
    var o = t.currentTarget.dataset.inde;
    var s = a.data.list;
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
 
  mores: function () {
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.request({
      url: api.Wxapp.more_stxlist,
      cachetime: "0",
      data: {
        id: this.data.cc,
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
          list: page.data.list.concat(z)
        });
        p++;
      }
    });

  },
  tui: function (e) {
    var getuid = wx.getStorageSync('userInfo').uid;
    var id = e.currentTarget.dataset.cid;
    var page = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出该社团吗？',
      success: function (sm) {
        if (sm.confirm) {
          app.request({
            url: api.Wxapp.tuituan,
            data: {
              uid: getuid,
              id: id
            },
            method: 'post',
            success: function (res) {
              console.log(res);
              if (res.code == 1) {
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.showToast({
                  title: '退团失败',
                })
              }
            }
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})