import { request, login } from "../../request/index.js";
Page({
  data: {},
  onLoad: function(options) {},
  handleGetUserInfo(e) {
    // 授权获取用户信息，以及登录的code值
    const { encryptedData, rawData, iv, signature } = e.detail;
    login().then(result => {
      const { code } = result;
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // console.log(loginParams);
      request({
        url: "/users/wxlogin",
        data: loginParams,
        method: "POST"
      }).then(result => {
        console.log(result);
        const token = result.data.token;
        if (!token) {
          wx.showToast({
            title: "个人微信小程序无法创建订单",
            icon: "none",
            duration: 1500
          });
        } else {
          // 获取到token，把token存入本地，但是个人微信号为主体的小程序无法创建订单获取token
          wx.setStorageSync("token", token);
        }
      });
    });
  }
});
