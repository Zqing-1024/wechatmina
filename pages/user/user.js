Page({
  data: {
    userInfo: {},
    collectGoodsNum: 0
  },
  onShow: function(options) {
    const userInfo = wx.getStorageSync("userInfo");
    const collectGoods = wx.getStorageSync("collectGoods");

    this.setData({ userInfo, collectGoodsNum: collectGoods.length });
  }
});
