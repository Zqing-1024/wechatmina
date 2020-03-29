// 搜索页面
import { request } from "../../request/index.js";
Page({
  data: {
    searchResult: {},
    isFocus: false,
    inputValue: ""
  },
  // 加入搜索防抖技术
  timeId: -1,
  // 输入框监听事件
  handleInput(e) {
    const { value } = e.detail;
    if (!value.trim()) {
      this.setData({
        searchResult: {},
        isFocus: false
      });
      // 值不合法
      clearTimeout(this.timeId);
      return;
    }
    // 用搜索字段发起请求 加入搜索防抖技术
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
    // 控制是否显示取消按钮
    this.setData({
      isFocus: true
    });
  },
  // 点击按钮清空数据，页面初始化
  handleTap() {
    this.setData({
      searchResult: {},
      isFocus: false,
      inputValue: ""
    });
  },
  // 用关键字发送请求
  qsearch(value) {
    request({ url: "/goods/qsearch", data: { query: value } }).then(result => {
      const searchResult = result.data.message;
      this.setData({
        searchResult
      });
    });
  }
});
