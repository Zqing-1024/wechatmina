// 意见反馈页面
import { request } from "../../request/index.js";
Page({
  data: {
    tabs: [
      { id: 0, value: "体验问题", isActive: true },
      { id: 1, value: "商品、商家投诉", isActive: false }
    ],
    // 用户选择图片的路径
    chooseImages: [],
    // 文本域内容
    textValue: ""
  },
  // 图片上传后的外网路径
  upLoadImgs: [],
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
  },
  chooseImages() {
    // 点击“+” 触发选择图片事件
    wx.chooseImage({
      // 小程序内置api 选择图片
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: result => {
        this.setData({
          // 新添加的图片路径和原数组进行拼接
          chooseImages: [...this.data.chooseImages, ...result.tempFilePaths]
        });
      }
    });
  },
  removeImage(e) {
    // 点击删除图片
    const { index } = e.currentTarget.dataset;
    let { chooseImages } = this.data;
    chooseImages.splice(index, 1);
    this.setData({
      chooseImages
    });
  },
  textInputchange(e) {
    // 文本域内容改变触发事件，同步修改data中数据
    this.setData({
      textValue: e.detail.value
    });
  },
  formSubmit() {
    // 没有后台接口，前端模拟伪提交
    const { textValue, chooseImages } = this.data;
    // 简单合法性验证
    if (!textValue.trim()) {
      // 输入不合法
      wx.showToast({
        title: "输入为空",
        icon: "none",
        mask: true
      });
      return;
    }
    // 如果合法，上传图片至服务器 ,内置api不支持多张同时上传
    // 判断有没有需要上传的图片数组

    //由于图床接口404了，所以注释了

    /* if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: "https://images.ac.cn/Home/Index/UploadAction/",
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件  file
          name: "file",
          // 顺带的文本信息
          formData: {},
          success: result => {
            console.log(result);
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);

            // 所有的图片都上传完毕了才触发
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();

              console.log("把文本的内容和外网的图片数组 提交到后台中");
              //  提交都成功了
              // 重置页面
              this.setData({
                textValue: "",
                chooseImgs: []
              });
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      });
    } else {
      wx.hideLoading();

      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });
    } */
  }
});
