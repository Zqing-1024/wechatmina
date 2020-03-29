import { request } from "../../request/index.js";

Page({
  data: {
    goodsDetail: {},
    isCollect: false
  },
  onShow: function(options) {
    // 获取页面传的goods_id
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let PageOptions = currentPage.options;

    const goods_id = PageOptions.goods_id;
    this.getGoodsDatail(goods_id);
  },
  goodsInfo: [],
  getGoodsDatail(goods_id) {
    //根据商品ID参数获取商品详情，把需要的数据存入data中
    request({ url: "/goods/detail", data: { goods_id } }).then(result => {
      this.goodsInfo = result.data.message;
      this.setData({
        goodsDetail: {
          goods_id: this.goodsInfo.goods_id,
          goods_name: this.goodsInfo.goods_name,
          goods_price: this.goodsInfo.goods_price,
          goods_introduce: this.goodsInfo.goods_introduce.replace(
            /\.webp/g,
            ".jpg"
          ),
          pics: this.goodsInfo.pics
        }
      });
    });
    // 如果本地收藏中是否有此数据改变isCollect
    let storageCollect = wx.getStorageSync("collectGoods") || [];
    storageCollect.forEach(v => {
      if (v.goods_id == goods_id) {
        this.setData({
          isCollect: true
        });
      }
    });
  },
  TapPreviewImage(e) {
    //点击图片展示大图
    const urls = this.data.goodsDetail.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls
    });
  },
  cartAdd() {
    //点击加入购物车，把数据存入本地
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id);
    if (index === -1) {
      this.goodsInfo.num = 1;
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo);
    } else {
      cart[index].num++;
    }

    wx.setStorageSync("cart", cart);

    wx.showToast({
      title: "加入成功",
      icon: "success",
      duration: 1500,
      mask: true
    });
  },
  tapCollect() {
    // 点击收藏按钮把商品数据存入本地，如果本地数据中有则从本地中删除
    const { isCollect } = this.data;
    let collectGooods = wx.getStorageSync("collectGoods") || [];
    if (!isCollect) {
      collectGooods.push(this.goodsInfo);
      wx.setStorageSync("collectGoods", collectGooods);
      this.setData({
        isCollect: true
      });
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        duration: 1500,
        mask: true
      });
    } else {
      collectGooods.some((v, i) => {
        if (v.goods_id == this.data.goodsDetail.goods_id) {
          collectGooods.splice(i, 1);
          wx.setStorageSync("collectGoods", collectGooods);
        }
      });
      this.setData({
        isCollect: false
      });
      wx.showToast({
        title: "取消收藏",
        icon: "success",
        duration: 1500,
        mask: true
      });
    }
  }
});
