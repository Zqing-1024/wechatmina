// 引入发送异步请求的方法
import { request } from "../../request/index.js";
Page({
  data: {
    // 存储轮播图数据的数组
    swiperList: [],
    //存储导航数据的数组
    catesList: [],
    //存储楼层数据
    floorList: []
  },
  //options(Object)
  onLoad: function(options) {
    this.getSwiper();
    this.getcates();
    this.getfloor();
  },
  getSwiper() {
    //获取轮播图数据
    /* var reqTask = wx.request({
      url: "https://api.zbztb.cn/api/public/v1/home/swiperdata",
      data: {},
      header: { "content-type": "application/json" },
      method: "GET",
      dataType: "json",
      responseType: "text",
      success: result => {
        this.setData({
          swiperList: result.data.message
        });
      }
    }); */
    request({ url: "/home/swiperdata" }).then(result => {
      console.log("ok")
      this.setData({
        swiperList: result.data.message
      });
    });
  },
  getcates() {
    //获取导航数据
    request({ url: "/home/catitems" }).then(result => {
      this.setData({
        catesList: result.data.message
      });
    });
  },
  getfloor() {
    //获取楼层数据
    request({ url: "/home/floordata" }).then(result => {
      this.setData({
        floorList: result.data.message
      });
    });
  }
});
