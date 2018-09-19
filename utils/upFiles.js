var chooseImage = (t, count) => {
  wx.chooseImage({
    count: count,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      wx.showToast({
          icon: "loading",
          title: "正在上传"
        });
      var imgArr = t.data.upImgArr || [];
      let arr = res.tempFiles;
      arr.map(function (v, i) {
        v['progress'] = 0;
        imgArr.push(v)
      })
      t.setData({
        upImgArr: imgArr
      })
      let upFilesArr = getPathArr(t);
     // if (upFilesArr.length > count - 1) {
      if (upFilesArr.length > count) {
        let imgArr = t.data.upImgArr;
        let newimgArr = imgArr.slice(0, count)
        wx.showToast({
          title: '只能上传3张',
          image: "/image/icon-warning.png",
        });
        t.setData({
          upFilesBtn: false,
          upImgArr: newimgArr
        })
      }
    },
  });
}
var chooseVideo = (t, count) => {
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 30,
    compressed: true,
    camera: 'back',
    success: function (res) {
      wx.showToast({
        icon: "loading",
        title: "正在上传"
      });
      let videoArr = t.data.upVideoArr || [];
      let videoInfo = {};
      videoInfo['tempFilePath'] = res.tempFilePath;
      videoInfo['size'] = res.size;
      videoInfo['height'] = res.height;
      videoInfo['width'] = res.width;
      videoInfo['thumbTempFilePath'] = res.thumbTempFilePath;
      videoInfo['progress'] = 0;
      videoArr.push(videoInfo)
      t.setData({
        upVideoArr: videoArr
      })
      let upFilesArr = getPathArr(t);
      // if (upFilesArr.length > count - 1) {
      if (upFilesArr.length > count) {
        wx.showToast({
          title: '只能上传3个',
          image: "/image/icon-warning.png",
        });
        t.setData({
          upFilesBtn: false,
        })
      }
      // console.log(res)
    }
  })
}
// 获取 图片数组 和 视频数组 以及合并数组
var getPathArr = t => {
  let imgarr = t.data.upImgArr || [];
  let upVideoArr = t.data.upVideoArr || [];
  let imgPathArr = [];
  let videoPathArr = [];
  imgarr.map(function (v, i) {
    imgPathArr.push(v.path)
  })
  upVideoArr.map(function (v, i) {
    videoPathArr.push(v.tempFilePath)
  })
  let filesPathsArr = imgPathArr.concat(videoPathArr);
  return filesPathsArr;
}

/**
 * upFilesFun(this,object)
 * object:{
 *    url     ************   上传路径 (必传)
 *    filesPathsArr  ******  文件路径数组
 *    name           ******  wx.uploadFile name
 *    formData     ******    其他上传的参数
 *    startIndex     ******  开始上传位置 0
 *    successNumber  ******     成功个数
 *    failNumber     ******     失败个数
 *    completeNumber  ******    完成个数
 * }
 * progress:上传进度
 * success：上传完成之后
 */

var upFilesFun = (t, data, progress, success) => {
  let _this = t;
  let url = data.url;
  let filesPath = data.filesPathsArr ? data.filesPathsArr : getPathArr(t);
  let name = data.name || 'file';
  let formData = data.formData || {};
  let startIndex = data.startIndex ? data.startIndex : 0;
  let successNumber = data.successNumber ? data.successNumber : 0;
  let failNumber = data.failNumber ? data.failNumber : 0;
  const uploadTask = wx.uploadFile({
    url: url,
    filePath: filesPath[startIndex],
    name: name,
    formData: formData,
    success: function (res) {
      
      wx.hideLoading()
      var data = res.data
      successNumber++;
      let uploaded = t.data.uploadedPathArr || [];
        uploaded.push(res.data)
        t.setData({
          uploadedPathArr: uploaded
        })
        console.log(uploaded)
    },
    fail: function (res) {
      failNumber++;
    },
    // complete: function (res) {
    //   if (startIndex == filesPath.length - 1) {
    //     let sucPathArr = t.data.uploadedPathArr;
    //     success(sucPathArr);
    //     t.setData({
    //       uploadedPathArr: []
    //     })
        
    //     if (0 == sucPathArr.length) { I = ""; }
    //     else { var I = sucPathArr.join(","); }
    //     if (t.data.title == '' || t.data.content == ''){
    //         wx.showModal({
    //           title: '提示',
    //           content: '标题或内容不能为空',
    //           showCancel:false,
    //           success: function (res) {
    //           if (res.confirm) {
    //             console.log('用户点击确定')
    //           } else if (res.cancel) {
               
    //           }
    //         }
    //       })
    //       return false;
    //     }
    //     wx.showLoading({
    //       title: '发布中...',
    //     })
    //     wx.request({
    //       url: "https://hx.possji.cn/admin.php/Wxapp/fabuhandle",
    //       method: 'GET',
    //       data: {uid:t.uid,image: I, title: t.data.title,content: t.data.content },
    //       success: function (res) {
    //             wx.hideLoading();
    //               wx.showToast({
    //                 title: '发布成功',
    //               })
    //               setTimeout(function(){
    //                  wx.navigateTo({
    //                       url:'/pages/index/index'
    //                  })
    //               },1000)
    //       }

    //     });
    //   } else {
    //     startIndex++;
    //     data.startIndex = startIndex;
    //     data.successNumber = successNumber;
    //     data.failNumber = failNumber;
    //    // upFilesFun(t, data, progress, success);
      
    //     // wx.hideLoading();
        
    //   }
    // }
  })
//  uploadTask.onProgressUpdate((res) => {
//   res['index'] = startIndex;
//    if (typeof (progress) == 'function') {
//      progress(res);
//    }
//  })

}
module.exports = { chooseImage, chooseVideo, upFilesFun, getPathArr }