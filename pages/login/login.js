Page({
  login(e) {
    const userInfo = e.detail.userInfo;
    if (userInfo) {
      wx.setStorageSync("userInfo", userInfo);
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.showToast({
        title: "登录失败"
      });
    }
  }
});
