//app.js
var api;

//
App({
  data:{
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLaunch: function () {
    // 展示本地存储能力
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: res => {
    //           this.globalData.userInfo = res.userInfo
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  onShow: function (e) {
    var s = this;
    wx.getSystemInfo({
      success: function (e) {
        -1 != e.model.search("iPhone X") && (s.globalData.isIphoneX = !0);
      }
    });
  },
  globalData: {
    userInfo: null,
    shenstatus:0
  },
  util:require('utils.js'),
  api: require('api.js'),
  setApi: function () {
    var siteroot = this.siteInfo.siteroot;
    function getNewApiUri(api) {
      for (var i in api) {
        if (typeof api[i] === 'string') {
          api[i] = api[i].replace('{$_api_root}', siteroot);
        } else {
          api[i] = getNewApiUri(api[i]);
        }
      }
      return api;
    }

    this.api = getNewApiUri(this.api);
  },
  siteInfo: require('siteinfo.js'),
  pageOnLoad: function (page) {
    console.log('--------pageOnLoad----------');
    //this.setNavigationBarColor();
    //this.setPageNavbar(page);
  },
  pageOnReady: function (page) {
    console.log('--------pageOnReady----------');

  },
  pageOnShow: function (page) {
    console.log('--------pageOnShow----------');

  },
  pageOnHide: function (page) {
    console.log('--------pageOnHide----------');

  },
  pageOnUnload: function (page) {
    console.log('--------pageOnUnload----------');

  },
  request: function (object) {
    if (!object.data)
      object.data = {};
    wx.request({
      url: object.url,
      header: object.header || {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: object.data || {},
      method: object.method || "GET",
      dataType: object.dataType || "json",
      success: function (res) {
        if (res.code == 1) {
          getApp().login();
        } else {
          if (object.success)
            object.success(res.data);
        }
      },
      fail: function (res) {
        var app = getApp();
        wx.showToast({
          title: res.errMsg,
          image: "../../image/icon-warning.png",
        });
        if (object.fail)
          object.fail(res);
      },
      complete: function (res) {
        if (object.complete)
          object.complete(res);
      }
    });
  },
   "tabBar": {
    "selectedColor": "#ff4544",
    "color": "#999",
    "borderStyle": "#F2F2F2",
    "backgroundColor": "#FAFAFA",
    "list": [
      {
        "pagePath": "/pages/indexx/indexx",
        "text": "朋友圈",
        "iconPath": "/image/tab/circle.png",
        "selectedIconPath": "/image/tab/circle_hl.png"
      },
      {
        "pagePath": "/pages/shetuan/cateid",
        "text": "团队",
        "iconPath": "/image/tab/team.png",
        "selectedIconPath": "/image/tab/team_hl.png"
      },
      {
        "pagePath": "pages/book/index/index",
        "text": "活动",
        "iconPath": "/image/tab/flag.png",
        "selectedIconPath": "/image/tab/flag_hl.png",
        "type": 1
      },
      {
        "pagePath": "pages/index/index",
        "text": "商城",
        "iconPath": "/image/tab/index.png",
        "selectedIconPath": "/image/tab/index_hl.png",
        "type": 1
      },
      {
        "pagePath": "/pages/user/user",
        "text": "我",
        "iconPath": "/image/tab/my.png",
        "selectedIconPath": "/image/tab/my_hl.png",
        "type": 1
      }
    ]
  },
  // getauth: function (object) {
  //   wx.showModal({
  //     title: '是否打开设置页面重新授权',
  //     content: object.content,
  //     confirmText: '去设置',
  //     success: function (e) {
  //       if (e.confirm) {
  //         wx.openSetting({
  //           success: function (res) {
  //             if (object.success) {
  //               object.success(res);
  //             }
  //           },
  //           fail: function (res) {
  //             if (object.fail) {
  //               object.fail(res);
  //             }
  //           },
  //           complete: function (res) {
  //             if (object.complete)
  //               object.complete(res);
  //           }
  //         })
  //       } else {
  //         if (object.cancel) {
  //           getApp().getauth(object);
  //         }
  //       }
  //     }
  //   })
  // },
  //登录成功后不刷新的页面
  loginRefreshPage: [
    //'pages/index/index',
    //'pages/user/user',
  ],
  globalData: {
    isIphoneX: !1,
  }
})