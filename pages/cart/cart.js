Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow: function(options) {
    //从本地数据中获取地址信息存入data中
    const address = wx.getStorageSync("address");
    // 从本地中获取购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    });
    this.setCart(cart);
  },

  tapChooesAddress() {
    //用户授权地址信息，获取地址信息存入本地
    wx.getSetting({
      success: result => {
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress === undefined) {
          wx.chooseAddress({
            success: result1 => {
              const result = result1;
              result.all =
                result1.provinceName +
                result1.cityName +
                result1.countyName +
                result1.detailInfo;
              wx.setStorageSync("address", result);
            }
          });
        } else {
          wx.openSetting({
            success: result2 => {
              wx.chooseAddress({
                success: result3 => {
                  const result = result3;
                  result.all =
                    result3.provinceName +
                    result3.cityName +
                    result3.countyName +
                    result3.detailInfo;
                  wx.setStorageSync("address", result);
                }
              });
            }
          });
        }
      }
    });
  },
  allchk() {
    // 全选change事件
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(i => (i.checked = allChecked));
    this.setCart(cart);
  },
  itemChange(e) {
    // 点击单选框改变data以及本地中的checked数据,并重新进行计算总价格总件数
    let { cart } = this.data;
    const goods_id = e.currentTarget.dataset.id;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  setCart(cart) {
    // 如果所有数据都为选中状态，则全选按钮为选中
    // const allChecked = cart.length ? cart.every(v => v.checked) : false; 多次循环浪费性能
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
    cart.forEach(i => {
      if (i.checked) {
        totalPrice += i.num * i.goods_price;
        totalNum += i.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;

    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
  editNum(e) {
    // 编辑购物车商品数量，并调用方法算总价，以及把数据存入本地
    let { cart } = this.data;
    const { id, symbol } = e.currentTarget.dataset;
    const index = cart.findIndex(v => v.goods_id === id);
    if (symbol == "+") {
      cart[index].num += 1;
    } else if (symbol == "-") {
      cart[index].num -= 1;
    }
    if (cart[index].num <= 0) {
      wx.showModal({
        title: "提示",
        content: "是否从购物车移除",
        success: res => {
          if (res.confirm) {
            cart.splice(index, 1);
            this.setCart(cart);
          } else if (res.cancel) {
            cart[index].num = 1;
            this.setCart(cart);
          }
        }
      });
    }

    this.setCart(cart);
  },
  tapPay() {
    // 点击结算按钮，判断是否购物车中有商品和收货地址，有则跳转到支付页面，没有则弹框提示
    const { address, totalNum } = this.data;
    // 如果没有收货地址
    if (!address) {
      wx.showToast({
        title: "您还没有添加收货地址",
        icon: "none",
        duration: 2000,
        success: result => {},
        fail: () => {},
        complete: () => {}
      });
      return;
    }
    // 如果购物车没有商品
    if (totalNum === 0) {
      wx.showToast({
        title: "您还没有选择商品",
        icon: "none",
        duration: 2000,
        success: result => {},
        fail: () => {},
        complete: () => {}
      });
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: "/pages/pay/pay"
    });
  }
});
