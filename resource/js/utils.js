var util = {
  footer : function (e) {
    var t = getApp(), n = e, a = t.tabBar, r = t.globalData.isIphoneX;
    for (var i in a.list) a.list[i].pageUrl = a.list[i].pagePath.replace(/(\?|#)[^"]*/g, ""),
      a.isIphoneX = r;
    n.setData({
      tabBar: a,
      "tabBar.thisurl": n.__route__
    });
  }
};module.exports = util;