import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow: function(options) {
    //从本地数据中获取地址信息存入data中
    const address = wx.getStorageSync("address");
    // 从本地中获取购物车数据
    let cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    });
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(i => {
      totalPrice += i.num * i.goods_price;
      totalNum += i.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum
    });
  },
  orderPay() {
    // 点击支付按钮 1，判断是否有token值，如果有正常执行支付请求，如果没有token值则跳转到授权页面申请授权
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/auth"
      });

      return;
    }
    // 如果获取到了，从本地中获取token值发起创建订单请求
    // 准备请求头和请求体参数
    const header = { Authorization: token };
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    let goods = [];
    cart.forEach(v =>
      goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      })
    );

    // 发起创建订单请求
    request({
      url: "/my/orders/create",
      method: "POST",
      header,
      data: { order_price, consignee_addr, gooods }
    })
      .then(result => {
        // 获取订单号
        const { order_number } = result.data;
        console.log(result.data.order_number);
        return order_number;
      })
      .then(re => {
        request({
          url: "/my/orders/req_unifiedorder",
          method: "POST",
          header,
          data: re
        })
          .then(result => {
            const { pay } = result.data;
            return pay;
          })
          .then(re => {
            // 使用微信内置方法发起支付
            wx.requestPayment({
              ...pay,
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          })
          .then(
            // 查询支付状态
            request({
              url: "/my/orders/chkOrder",
              method: "POST",
              header,
              data: re
            }).then(result => {
              console.log(result.data.message);
              if (result.data.message == "支付成功") {
                wx.showToast({
                  title: "支付成功"
                });
                // 支付成功后删除购物车中已支付的商品
                // 测试不了不写了
                // 支付成功后跳转到订单页面
                wx.navigateTo({
                  url: "/page/order/order"
                });
              } else {
                wx.showToast({
                  title: "支付失败"
                });
              }
            })
          );
      });
  }
});
