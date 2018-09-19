//获取应用实例
var api = require('../../api.js');
var upFiles = require('../../utils/upFiles.js');
var app = getApp();
var _imgArray = [];
var _videoArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upFilesBtn: true,
    upFilesProgress: false,
    maxUploadLen: 3,
    _imgArray: [],
    _videoArray: [],
    title: '',
    content: '',
    url: 'https://hx.possji.cn/Upload/',
    casIndex:0,
    casArray:[],
    weizhi:0,
    classMav:[],
    imgArray1: [],
    imgArray2: [],
    topimg: ''
  },
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  inputContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  
  // 预览图片
  // previewImg: function (e) {
  //   let imgsrc = e.currentTarget.dataset.presrc;
  //   let _this = this;
  //   let arr = _this.data.upImgArr;
  //   let preArr = [];
  //   arr.map(function (v, i) {
  //     preArr.push(v.path)
  //   })
  //   //   console.log(preArr)
  //   wx.previewImage({
  //     current: imgsrc,
  //     urls: preArr
  //   })
  // },
  // 删除上传图片 或者视频
  // delFile: function (e) {
  //   let _this = this;
  //   wx.showModal({
  //     title: '提示',
  //     content: '您确认删除嘛？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         let delNum = e.currentTarget.dataset.index;
  //         let delType = e.currentTarget.dataset.type;
  //         let upImgArr = _this.data.upImgArr;
  //         let upVideoArr = _this.data.upVideoArr;
  //         if (delType == 'image') {
  //           upImgArr.splice(delNum, 1)
  //           _this.setData({
  //             upImgArr: upImgArr,
  //           })
  //         } else if (delType == 'video') {
  //           upVideoArr.splice(delNum, 1)
  //           _this.setData({
  //             upVideoArr: upVideoArr,
  //           })
  //         }
  //         let upFilesArr = upFiles.getPathArr(_this);
  //         if (upFilesArr.length < _this.data.maxUploadLen) {
  //           _this.setData({
  //             upFilesBtn: true,
  //           })
  //         }
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
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
  // 选择图片或者视频
  uploadFiles: function (e) {
    var _this = this;
    if (this.data.imgArray1.length == 0 && this.data.imgArray2.length == 0) {
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
    } else if (this.data.imgArray1.length != 0) {
      wx.showActionSheet({
        itemList: ['选择图片'],
        success: function (res) {
          var xindex = res.tapIndex;
          if (xindex == 0) {
            // upFiles.chooseImage(_this, _this.data.maxUploadLen)
            _this.chooseImage(_this, _this.data.maxUploadLen)
          } 
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    } else if (this.data.imgArray2.length != 0) {
      wx.showModal({
        title: "上传提示",
        content: "最多上传1个视频",
        showCancel: !0,
        cancelText: "取消",
        confirmText: "确定",
        success: function (e) { },
        fail: function (e) { },
        complete: function (e) { }
      })
    }
  },
  //
  chooseImage: function (t, n) {
    var _imgArray = t.data._imgArray
    var t = this,
      n = 3 - _imgArray.length;
    n > 0 && n <= 9 ? wx.chooseImage({
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
  //上传封面
  uploadtopimg: function (img) {
    wx.uploadFile({
      url: api.Wxapp.upload,
      filePath: img,
      name: "upfile",
      success: (e) => {
        this.setData({
          topimg: e.data
        })
        this.submit();
      }
    })
  },
  // 点击发布
  subFormData: function () {
    var t = this;
    var image = t.data._imgArray
    var video = t.data._videoArray
    //var filePath = image.concat(video);
    if (0 == image.length) { I = ""; }
    else { var I = image.join(","); }
    if (0 == video.length) { J = ""; }
    else { var J = video.join(","); }
    if (t.data.title == '') {
      wx.showModal({
        title: '提示',
        content: '标题不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {

          }
        }
      })
      return false;
    }
    if (t.data.content == '') {
      wx.showModal({
        title: '提示',
        content: '内容不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {

          }
        }
      })
      return false;
    }
    if (t.data.imgArray2.length != 0 && t.data.topimg == '') {
      wx.showModal({
        title: '提示',
        content: '因为你上传了视频，请选择视频封面',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
              wx.chooseImage({
                count: 1,
                sizeType: ["compressed"],
                sourceType: ["album", "camera"],
                success: function (e) {
                  t.uploadtopimg(e.tempFilePaths[0]); 
                }
              })
          } else if (res.cancel) {

          }
        }
      })
      return false;
    }
    t.submit();

  },
  //上传发布
  submit: function (event) {
    var t = this;
    var image = t.data._imgArray
    var video = t.data._videoArray
    //var filePath = image.concat(video);
    if (0 == image.length) { I = ""; }
    else { var I = image.join(","); }
    if (0 == video.length) { J = ""; }
    else { var J = video.join(","); }
    wx.showLoading({
      title: '发布中...',
    })
    wx.request({
      url: api.Wxapp.fabu_handle,
      method: 'GET',
      data: { uid: t.uid, image: I, video: J, title: t.data.title, content: t.data.content, stype: t.data.weizhi, topimg:t.data.topimg },
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '发布成功',
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/indexx/indexx'
          })
        }, 1000)
        t.setData({
          _imgArray: [],
          _videoArray: []
        })
      }

    });
  },
  // subFormData:function(){
  //   //   let _this = this;
  // //   let upData = {};
  // //   let upImgArr = _this.data.upImgArr;
  // //   let upVideoArr = _this.data.upVideoArr;
  // //   _this.setData({
  // //     upFilesProgress: true,
  // //   })
  // //  upData['url'] = api.Wxapp.upload;
  // //   upFiles.upFilesFun(_this, upData, function (res) {
  // //     if (res.index < upImgArr.length) {
  // //       upImgArr[res.index]['progress'] = res.progress
  // //       _this.setData({
  // //         upImgArr: upImgArr,
  // //       })
  // //     } else {
  // //       let i = res.index - upImgArr.length;
  // //       upVideoArr[i]['progress'] = res.progress
  // //       _this.setData({
  // //         upVideoArr: upVideoArr,
  // //       })
  // //     }
  // //  }, function (arr) {
  // //     //console.log(arr)
  // //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log(this.data)
    this.uid = wx.getStorageSync('userInfo').uid
    // var _imgArray = [];
    // var _videoArray = [];
    this.setData({
      _imgArray: [],
      _videoArray: []
    })
    this.getClass()
    var n = this;
    setTimeout(function () {
      for (var a = n.data.classMav, t = n.data.casIndex, e = [], o = 0; o < a.length; o++) e.push(a[o].title);
      n.setData({
        casArray: e,
        weizhi: a[t].id
      });
    },500)
  },
  getClass:function(){
    var page = this;
    var uid = wx.getStorageSync('userInfo').uid
    console.log(uid);
    app.request({
      url: api.Wxapp.wode,
      data: { uid: uid },
      method: 'get',
      success: function (e) {
        console.log(e)
            page.setData({
              classMav: e.data,
           })
      }
    })
  },
  bindPickerChange: function (a) {
    console.log(a);
    var t = this;
    t.setData({
      casIndex: a.detail.value,
      index: a.detail.value
    });
    var e = t.data.classMav, o = t.data.casIndex;
    t.setData({
      weizhi: e[o].id
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
    _imgArray.splice(0, _imgArray.length)
    _videoArray.splice(0, _videoArray.length)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad(this)
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