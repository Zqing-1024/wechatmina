Page({
  data: {
    collectGoods: [],
    tabs: [
      { id: 0, value: "商品收藏", isActive: true },
      { id: 1, value: "品牌收藏", isActive: false },
      { id: 2, value: "店铺收藏", isActive: false },
      { id: 3, value: "浏览足迹", isActive: false }
    ]
  },
  onShow: function() {
    const collectGoods = wx.getStorageSync("collectGoods") || [];
    this.setData({
      collectGoods
    });
  },
  onLoad: function(options) {},
  tabsItemTapChange(e) {
    // 点击切换
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach(item => {
      item.id === index ? (item.isActive = true) : (item.isActive = false);
    });
    this.setData({
      tabs
    });
  }
});
