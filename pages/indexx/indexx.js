//index.js
//获取应用实例
var api = require('../../api.js');
var app = getApp();
var p = 1;
Page({

  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_login: 1,
    indicatorDots: true,
    autoplay: true, 
    interval: 3000, 
    duration: 1000,
    user_info:'',
    list:'',
    url:'https://hx.possji.cn/Upload/',
    is_hidden: 0,
    tab_image:"block",
    is_video:0,
    prevVideoId:0,
    curr_id:0,
    playTime: '',
    jiazai:'下拉加载更多',
    shenstatus: 0
  },
  onReady: function () {  //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo')
  },
  //事件处理函数
  onLoad: function () {
     var page = this;
     var user = wx.getStorageSync("userInfo");
    this.shen();
     this.loadData();
     this.list();
     this.banner();
     app.util.footer(this);
     if (user){
       this.setData({
         is_hidden:1
       })
     }
  },
  videoPlay:function(e) {
    console.log('点击播放')
    var length = this.data.list.length
    if(!this.data.curr_id){
      console.log('当前没有播放其他视频')
      this.setData({
        curr_id: e.currentTarget.dataset.id,
      })
      var videoContext = wx.createVideoContext('index' + this.data.curr_id)
      this.videoContext.play()
    }else{
      console.log('当前正在播放其他视频')      
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
     console.log('视频播放' + e.currentTarget.dataset.id)
     this.setData({
       curr_id: e.currentTarget.dataset.id,
     })
  },
  bindended:function(e){
    console.log('视频结束' + e.currentTarget.dataset.id)
    this.setData({
      curr_id:''
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
  clickvideo:function(e){
     console.log(e)
  },
  loadData:function(){
    var page = this;
    var user = wx.getStorageSync("userInfo");
    if(user !=''){
          page.setData({
            is_login: 1,
            user_info:wx.getStorageSync("userInfo")
          })
    }else{
      page.setData({
        is_login: 0,
      })
    }
  },
  banner:function(){
      var a = this;
      app.request({
        url: api.Wxapp.banners,
        success: function (res) {
           //console.log(res.banner)
           a.setData({
            banner: res.banner
          })
        }
      })
  },
  list:function(){
    var page = this;
    app.request({
      url: api.Wxapp.indexList,
      data:{
        uid: wx.getStorageSync("userInfo").uid
      },
      method:'post',
      success: function (res) {
       // console.log(res.data)
        var l = res.data;
        for (var a in l) {
          l[a].image = l[a].image.split(",");
          l[a].video = l[a].video.split(",");
        }
        page.setData({
          list:l
        })
      }
    })
  },
  zans:function(e){
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
        if (res.code == 0) {
          wx.showToast({
            title: '点赞成功',  
            icon: 'success', 
            duration: 1500,
          })
          for (var i = 0; i < page.data.list.length; i++) {
            if (page.data.list[i].id == cid){
                  page.setData({
                    ['list[' + i + '].is_zan']: res.data.zanr.is_zan
                  })
            }
          }
        } 
        if (res.code == 1) {
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
  getUserInfo:function(t){
    var page = this;
    wx.login({
      success: function (res) {
        wx.showToast({
               title: "登录中",
               icon: "loading",
        })
        if (res.code) {
          var code = res.code;
          app.request({
            url: api.Wxapp.login,
            method: "post",
            data: {
              code: code,
              nickName: t.detail.userInfo.nickName,
              avatarUrl: t.detail.userInfo.avatarUrl,
              gender: t.detail.userInfo.gender,
            },
            success: function (res) {
              //wx.hideLoading();
              console.log(res)
              if (res.code == 0) {
                wx.setStorageSync("userInfo", res.user_info);
                page.close_login();
                page.setData({
                   user_info: wx.getStorageSync("userInfo"),
                   is_login: 1,
                   is_hidden: 1,
                })
              }else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                });
              }
              //page.pullDown(res.user_info.openid);
            }
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
  // pullDown: function (t) {
  //   console.log("首次登录后请求"), this.onLoad("op=" + t), this.setData({
  //     is_login: 1
  //   });
  // },
  close_login:function(){
      var page = this;
      page.setData({
            is_login:1
      })
  },
  addst:function(){
     wx.navigateTo({
       url: '/pages/fabu/fabu',
     })

  },
  views:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/tiezi/view?op=' + id,
    })
  },
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    
    var e = this;
    if (e.data.is_login == 1) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      app.pageOnLoad(this);
      this.onLoad();
      p = 1;
      setTimeout(function () {
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }, 1000)
    }
  },
  more:function(){
    if (this.data.jiazai == '全部加载完毕') {
      return
    }
     var page = this;
     wx.showLoading({
       title: '正在拼命加载',
       mask: true
     })
     app.request({
       url: api.Wxapp.more_list,
       cachetime: "0",
       data: {
         pageNo: p,
       },
       success: function (res) {
         wx.hideLoading();
         var z = res.data.lists
         if (z == '') {
          page.setData({
            jiazai:'全部加载完毕'
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
        //  if (res.code == 1) {

        //  }
       }
     });

  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },
  onReachBottom: function (event) {
    this.more()
  },
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
  onShow: function () {
    this.shen();
  }
})
