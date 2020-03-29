import { request } from "../../request/index.js";
Page({
  data: {
    //传给子组件的数据
    tabs: [
      { id: 0, value: "综合", isActive: true },
      { id: 1, value: "销量", isActive: false },
      { id: 2, value: "价格", isActive: false }
    ],
    //商品数据
    goodsList: []
  },
  //请求的参数
  queryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,

  onLoad: function(options) {
    //页面初始化加载函数
    this.queryParams.cid = options.cid;
    this.getGoodsList();
  },
  tabsItemTapChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach(item => {
      item.id === index ? (item.isActive = true) : (item.isActive = false);
    });
    this.setData({
      tabs
    });
  },
  getGoodsList() {
    request({
      url: "/goods/search",
      data: this.queryParams
    }).then(result => {
      //获取总条数
      const { total } = result.data.message;
      // 计算总页数
      this.totalPages = Math.ceil(total / this.queryParams.pagesize);
      this.setData({
        goodsList: [...this.data.goodsList, ...result.data.message.goods]
      });
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function(options) {
    //页面触底触发函数
    if (this.queryParams.pagenum >= this.totalPages) {
      wx.showToast({ title: "没有更多商品啦" });
    } else {
      this.queryParams.pagenum++;
      this.getGoodsList();
    }
  },
  onPullDownRefresh: function(options) {
    //下拉刷新

    this.setData({
      goodsList: []
    });
    this.queryParams.pagenum = 1;
    this.getGoodsList();
  }
});
