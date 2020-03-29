// 引入发送异步请求的方法
import { request } from "../../request/index.js";
Page({
  data: {
    //存储分类列表数据
    categoryList: [],
    // 右侧商品数据
    rightList: [],
    // ative类
    currentIndex: 0,
    //右侧滚读条设置值
    scrollTopRight: 0
  },
  cate: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.localStorage();
  },
  getcategories() {
    //异步请求分类页面数据
    request({
      url: "/categories"
    }).then(result => {
      this.cate = result.data.message;
      wx.setStorageSync("cates", {
        time: Date.now(),
        data: this.cate
      });
      let categoryList = this.cate.map(v => v.cat_name);
      let rightList = this.cate[0].children;
      this.setData({
        categoryList,
        rightList
      });
    });
  },
  leftTap(e) {
    //点击加载不同商品列表
    const { index } = e.currentTarget.dataset;
    let rightList = this.cate[index].children;
    this.setData({
      currentIndex: index,
      rightList,
      scrollTopRight: 0
    });
  },
  localStorage() {
    //本地数据的存取
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      //如果本地没有数据发送请求获取数据
      this.getcategories();
    } else {
      //如果本地有数据判断数据是否过期
      if (Date.now() - Cates.time > 1000 * 60 * 10) {
        //数据过期重新请求
        this.getcategories();
      } else {
        //本地有数据未过期，直接用
        this.cate = Cates.data;
        let categoryList = this.cate.map(v => v.cat_name);
        let rightList = this.cate[0].children;
        this.setData({
          categoryList,
          rightList
        });
      }
    }
  }
});
