console.log('background is running')

// 监听弹幕信息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'danmuData') {
    const danmuTitle = message.titledata;
    //console.log('Background Script 收到视频标题数据:', danmuTitle);
    const danmuTimes = message.timedata;
    //console.log('Background Script 收到弹幕时间数据:', danmuTimes);
    const danmuContents = message.contentdata;
    //console.log('Background Script 收到弹幕内容数据:', danmuContents);
    const danmuDates = message.datedata;
    //console.log('Background Script 收到弹幕日期数据:', danmuDates);


    // 在需要发送数据的地方，将数据打包成一个对象
    const danmuData = {
      titledata: danmuTitle,
      timedata: danmuTimes,
      contentdata: danmuContents,
      datedata: danmuDates,
    };

    console.log(danmuData)

    // 发送 POST 请求到 Flask 后端
    fetch('http://localhost:5000/receive-danmu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(danmuData),
    })
      .then(response => response.text())
      .then(data => {
        console.log(data)
        // 发送消息到前端
        chrome.runtime.sendMessage({ type: 'fetchDanmu', data: data });
      })
      .catch(error => console.error('Error:', error));
  }
});

// 监听弹幕信息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'danmuFullData') {
    // 在需要发送数据的地方，将数据打包成一个对象
    const danmuFullData = {
      bvid: message.bvid,
      contents: message.contents,
      times: message.times,
      modes: message.modes,
      fontSizes: message.fontSizes,
      colors: message.colors,
      timestamps: message.timestamps,
      pools: message.pools,
      senderIds: message.senderIds,
      rowIds: message.rowIds
    };

    console.log(danmuFullData);

    // 发送 POST 请求到 Flask 后端
    fetch('http://localhost:5000/receive-fulldanmu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(danmuFullData),
    })
      .then(response => response.text())
      .then(data => {
        console.log(data)
        // 发送消息到前端
        chrome.runtime.sendMessage({ type: 'fetchDanmu', data: data });
      })
      .catch(error => console.error('Error:', error));
  }
});