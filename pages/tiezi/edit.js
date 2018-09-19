//获取应用实例
var api = require('../../api.js');
var app = getApp();
var p = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cha:'',
    _imgArray: [],
    _videoArray: [],
    url: 'https://hx.possji.cn/Upload/',
    content:'',
    ops:'',
  },
  inputContent:function(e){
       this.setData({
         content:e.detail.value  
       })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //  var a = this;
       //options.op
    this.loadData(options.op)
       this.setData({
         ops: options.op
       })
  },
  loadData:function(e){
    var page = this;
    app.request({
      url: api.Wxapp.edit_view,
      data: {
        id: e
      },
      method: 'post',
      success: function (res) {
        var l = res.data;
        for (var a in l) {
          l.image = l[a].image.split(",");
          l.video = l[a].video.split(",");
        }
        if (l.video == '' || l.video == null){
             var video = '';
        } else { var video = l.video;}
        if (l.image == '' || l.image == null) {
          var image = '';
        } else { var image = l.image; }
        //console.log(l[0].content)
        page.setData({
          cha: l,
          imgArray1: image,
          imgArray2: video,
          _imgArray: l.image,
          _videoArray: video,
          content: l[0].content
        })
      }
    })
  },
  delFile: function (e) {
    //console.log(e)
    var t = this;
    Array.prototype.indexOf = function (e) {
      for (var t = 0; t < this.length; t++) if (this[t] == e) return t;
      return -1
    }, Array.prototype.remove = function (e) {
      var t = this.indexOf(e);
      t > -1 && this.splice(t, 1)
    };
    var a = e.currentTarget.dataset.inde;
    if (e.currentTarget.dataset.type == "image") {
      t.data._imgArray.remove(t.data._imgArray[a]), t.setData({
        imgArray1: t.data._imgArray
      })
    }
    if (e.currentTarget.dataset.type == "video") {
      t.data._videoArray.remove(t.data._videoArray[a]), t.setData({
        imgArray2: t.data._videoArray
      })
    }
  },
  //
  del: function(){
      var page = this;
      app.request({
        url: api.Wxapp.tiezidel,
        data: { id: page.data.ops },
        method: 'post',
        success: function (e) {
            if(e.code == 0){
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500,
              })
              setTimeout(function(){
                    wx.navigateTo({
                      url: '/pages/user/user',
                    })
              },1000)
            }else{
              wx.showToast({
                title: '删除失败',
                icon: 'loading',
                duration: 1000,
              })
             return false;
            }
        }
      })
  },
  // 选择图片或者视频
  uploadFiles: function (e) {
    var _this = this;
    wx.showActionSheet({
      itemList: ['选择图片', '选择视频'],
      success: function (res) {
        var xindex = res.tapIndex;
        if (xindex == 0) {
          // upFiles.chooseImage(_this, _this.data.maxUploadLen)
          _this.chooseImage(_this, _this.data.maxUploadLen)
        } else if (xindex == 1) {
          //  upFiles.chooseVideo(_this, _this.data.maxUploadLen)
          _this.chooseVideo(_this, _this.data.maxUploadLen)
        }

      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //
  chooseImage: function (t, n) {
    var _imgArray = t.data._imgArray
    var t = this,
      n = 3 - _imgArray.length;
    n > 0 && n <= 3 ? wx.chooseImage({
      count: n,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (e) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        });
        var n = e.tempFilePaths;
        //console.log(n);
        t.uploadimg({
          url: api.Wxapp.upload,
          path: n
        })
      }
    }) : wx.showModal({
      title: "上传提示",
      content: "最多上传3张图片",
      showCancel: !0,
      cancelText: "取消",
      confirmText: "确定",
      success: function (e) { },
      fail: function (e) { },
      complete: function (e) { }
    })
  },
  chooseVideo: function (t, n) {
    var t = this
    var _videoArray = t.data._videoArray
    n = 1 - _videoArray.length;
    n > 0 && n <= 1 ? wx.chooseVideo({
      count: n,
      //sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      maxDuration: 30,
      compressed: true,
      camera: ['front', 'back'],
      success: function (e) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        });
        var n = e.tempFilePath;
        // t.uploadimgs({
        //   url: api.Wxapp.upload,
        //   path: n
        // })
        wx.uploadFile({
          url: api.Wxapp.upload,
          filePath: n,
          name: "parkingPhoto",
          formData: {
            'token': t.token,//
          },
          success: function (e) {
            "" != e.data ? (n++ , t.data._videoArray.push(e.data), t.setData({
              imgArray2: t.data._videoArray
            })) : wx.showToast({
              icon: "loading",
              title: "请重试"
            })
          }
        })
      }
    }) : wx.showModal({
      title: "上传提示",
      content: "最多上传1个视频",
      showCancel: !0,
      cancelText: "取消",
      confirmText: "确定",
      success: function (e) { },
      fail: function (e) { },
      complete: function (e) { }
    })
  },
  uploadimg: function (e) {
    var t = this
    var a = e.i ? e.i : 0
    var n = e.success ? e.success : 0
    var i = e.fail ? e.fail : 0
    wx.uploadFile({
      url: e.url,
      filePath: e.path[a],
      name: "upfile",
      formData: null,
      success: function (e) {
        "" != e.data ? (n++ , t.data._imgArray.push(e.data), t.setData({
          imgArray1: t.data._imgArray
        })) : wx.showToast({
          icon: "loading",
          title: "请重试"
        })
      },
      fail: function (e) {
        i++
      },
      complete: function () {
        ++a == e.path.length ? (t.setData({
          images: e.path
        }), wx.hideToast()) : (e.i = a, e.success = n, e.fail = i, t.uploadimg(e))
      }
    })
  },
  formReport: function (a) {
      var page = this
      if (a.detail.value.content == '') { var memo = page.data.content } else { var memo = a.detail.value.content}
      var image = page.data._imgArray
      var video = page.data._videoArray
      if (0 == image.length) { I = ""; }
      else { var I = image.join(","); }
      if (0 == video.length) { J = ""; }
      else { var J = video.join(","); }
      wx.showLoading({
        title: '更新中...',
      });
      wx.request({
        url: api.Wxapp.tiezi_edit_handle,
        method: 'GET',
        data: { id: a.detail.value.id, image: I, video: J, title: a.detail.value.title, content: memo },
        success: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '更新成功',
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/user/user'
            })
          }, 1000)
          page.setData({
            _imgArray: [],
            _videoArray: []
          })
        }

      });
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