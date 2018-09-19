var utils = {
    scene_decode: function (scene) {
        var _str = scene + "";
        var _str_list = _str.split(",");
        var res = {};
        for (var i in _str_list) {
            var _tmp_str = _str_list[i];
            var _tmp_str_list = _tmp_str.split(":");
            if (_tmp_str_list.length > 0&&_tmp_str_list[0]) {
                res[_tmp_str_list[0]] = _tmp_str_list[1] || null;
            }
        }
        return res;
    },
    footer: function (e) {
      var t = getApp(), n = e, a = t.tabBar, r = t.globalData.isIphoneX;
      for (var i in a.list) a.list[i].pageUrl = a.list[i].pagePath.replace(/(\?|#)[^"]*/g, ""),
      a.isIphoneX = r;
      n.setData({
        tabBar: a,
        "tabBar.thisurl": n.__route__
      });
    }
    
};
module.exports = utils;