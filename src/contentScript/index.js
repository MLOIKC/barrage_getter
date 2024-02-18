console.info('contentScript is running')

// 定义 simulateClick 函数
function simulateClick() {
  // 延迟 2 秒等待页面加载完成
  setTimeout(() => {
    // 获取弹幕列表的元素
    const danmuListElement = document.querySelector('div.bui-collapse-header');
    if (danmuListElement) {
      // 创建鼠标点击事件
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });

      // 触发点击事件
      danmuListElement.dispatchEvent(clickEvent);
      console.log('成功打开弹幕列表');
    } else {
      console.log('未找到弹幕列表元素');
      // 延迟 5 秒后再次执行 simulateClick
      setTimeout(() => {
        simulateClick();
        console.log('延迟3秒后再次查找弹幕列表');
      }, 3000);
    }
  }, 2000);
}

simulateClick();
console.log('执行了 simulateClick 操作');
