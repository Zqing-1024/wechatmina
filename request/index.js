// 手动封装Pormise异步方法
let ajaxTimes = 0;
export const request = params => {
  ajaxTimes++;
  //设置请求根路径
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  //开启loading图标
  wx.showLoading({
    title: "加载中",
    mask: true
  });

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: result => {
        resolve(result);
      },
      fail: err => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //关闭loading图标

          wx.hideLoading();
        }
      }
    });
  });
};

export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: result => {
        resolve(result);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};
