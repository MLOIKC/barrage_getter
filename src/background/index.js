console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})


// 监听弹幕信息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'danmuData') {
    const danmuTitle = message.titledata;
    console.log('Background Script 收到视频标题数据:', danmuTitle);
    const danmuTimes = message.timedata;
    console.log('Background Script 收到弹幕时间数据:', danmuTimes);
    const danmuContents = message.contentdata;
    console.log('Background Script 收到弹幕内容数据:', danmuContents);
    const danmuDates = message.datedata;
    console.log('Background Script 收到弹幕日期数据:', danmuDates);
  }
});


