<template>
  <main>
    <h3>弹幕实时分析系统</h3>

    <el-button color="#42b983" type="primary" plain @click="getDanmuData">获取弹幕列表信息</el-button>
    <div>
      <el-text class="mx-1">请点击视频下方分享视频中的嵌入代码然后将剪切板中的内容复制到此处:</el-text>
      <el-input v-model="iframeCode" placeholder="Enter iframe code" />
      <el-button color="#42b983" type="primary" plain @click="getCidBvid">获取详细弹幕信息</el-button>
      <div>
        <label>Extracted Cid:</label>
        <div>{{ extractedCid }}</div>
      </div>
      <div>
        <label>Extracted Bvid:</label>
        <div>{{ extractedBvid }}</div>
      </div>
      <div v-if="comments && comments.length">
        <label>Comments:</label>
        <ul>
          <li v-for="(comment, index) in comments" :key="index">
            <div>
              <strong>Content:</strong> {{ comment.content }}<br>
              <strong>Time:</strong> {{ comment.time }} seconds<br>
              <strong>Mode:</strong> {{ comment.mode }}<br>
              <strong>Font Size:</strong> {{ comment.fontSize }}<br>
              <strong>Color:</strong> {{ comment.color }}<br>
              <strong>Timestamp:</strong> {{ comment.timestamp }}<br>
              <strong>Pool:</strong> {{ comment.pool }}<br>
              <strong>Sender ID:</strong> {{ comment.senderId }}<br>
              <strong>Row ID:</strong> {{ comment.rowId }}
            </div>
          </li>
        </ul>
      </div>
      <div v-else>No comments available</div>
    </div>
    <div>
      <el-text class="mx-1">请点击视频下方分享视频中的嵌入代码然后将剪切板中的内容复制到此处:</el-text>
      <el-input v-model="inputCode" placeholder="Enter iframe code" />
      <el-button color="#42b983" type="primary" plain @click="getAidCidBvid">获取全部弹幕</el-button>
      <div>
        <label>Extracted Aid:</label>
        <div>{{ extractedAid }}</div>
      </div>
      <div>
        <label>Extracted Cid:</label>
        <div>{{ extractedCid }}</div>
      </div>
      <div>
        <label>Extracted Bvid:</label>
        <div>{{ extractedBvid }}</div>
      </div>
      <div v-if="responseData">
        <pre>{{ responseData }}</pre>
      </div>
    </div>

  </main>
</template>


<script setup lang="js">
import { ref, watch, onMounted, onUnmounted } from 'vue'
// 导入 Element UI 的按钮组件
import { ElButton } from 'element-plus';

const iframeCode = ref("");
const extractedAid = ref("");
const extractedCid = ref("");
const extractedBvid = ref("");
const comments = ref("");

// 执行获取弹幕信息并发送的逻辑
const getDanmuData = () => {
  // 查询当前活动标签页
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    // 使用 chrome.scripting.executeScript
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {

        // 获取视频标题数据
        let danmuTitle = "hello";
        const danmuTitleElement = document.querySelector('#viewbox_report > h1');

        if (danmuTitleElement) {
          danmuTitle = danmuTitleElement.innerText;
        } else {
          danmuTitle = '未找到视频标题数据';
        }

        // 获取弹幕列表
        const danmuListElement = document.querySelector('div.bui-long-list-wrap');

        // 获取可滚动元素的总高度
        let totalHeight = 0;

        // 安全判断
        if (danmuListElement) {
          // 获取可滚动元素的总高度
          totalHeight = danmuListElement.scrollHeight;
        }

        // 模拟滚动函数
        const simulateScroll = () => {

          if (danmuListElement) {
            // 创建鼠标滚轮事件
            const wheelEvent = new WheelEvent('wheel', {
              bubbles: true,
              cancelable: true,
              view: window,
              deltaY: 24 * 14, // 适当调整滚动距离
            });

            // 触发滚轮事件
            danmuListElement.dispatchEvent(wheelEvent);
            // console.log('模拟滚动事件成功');

          } else {
            console.log('未找到可滚动元素');
          }
        };

        // 弹幕时间
        let danmuTimeElements = document.querySelectorAll('li > div > span.dm-info-time');
        let danmuTimes = [];

        // 弹幕内容
        let danmuContentElements = document.querySelectorAll('li > div > span.dm-info-dm');
        let danmuContents = [];

        // 弹幕日期
        let danmuDateElements = document.querySelectorAll('li > div > span.dm-info-date');
        let danmuDates = [];

        // 模拟滚动多次，以确保加载更多的弹幕
        for (let i = 0; i < totalHeight / 24 / 14; i++) {
          simulateScroll();

          // 获取弹幕时间
          danmuTimeElements = document.querySelectorAll('li > div > span.dm-info-time');

          danmuTimeElements.forEach((element) => {
            danmuTimes.push(element.innerText);
          });
          if (danmuTimes) {
            // console.log('弹幕时间列表:', danmuTimes);
          } else {
            console.log('未找到弹幕时间列表');
          }

          // 获取弹幕内容
          danmuContentElements = document.querySelectorAll('li > div > span.dm-info-dm');

          danmuContentElements.forEach((element) => {
            danmuContents.push(element.innerText);
          });
          if (danmuContents) {
            // console.log('弹幕内容列表:', danmuContents);
          } else {
            console.log('未找到弹幕内容列表');
          }

          // 获取弹幕日期
          danmuDateElements = document.querySelectorAll('li > div > span.dm-info-date');

          danmuDateElements.forEach((element) => {
            danmuDates.push(element.innerText);
          });
          if (danmuDates) {
            // console.log('弹幕日期列表:', danmuDates);
          } else {
            console.log('未找到弹幕日期列表');
          }
        }

        // 向 Background Script 发送弹幕数据
        chrome.runtime.sendMessage({ type: 'danmuData', titledata: danmuTitle, timedata: danmuTimes, contentdata: danmuContents, datedata: danmuDates });
      },
    });
  });
};

const getCidBvid = () => {
  const regex_cid = /cid=(\d+)/;
  const match_cid = iframeCode.value.match(regex_cid);

  const regex_bvid = /bvid=([^&]+)/;
  const match_bvid = iframeCode.value.match(regex_bvid);

  if (match_cid && match_cid[1] && match_bvid && match_bvid[1]) {
    extractedCid.value = match_cid[1];
    console.log("Extracted Cid:", match_cid[1]);

    extractedBvid.value = match_bvid[1];
    console.log("Extracted Cid:", match_bvid[1]);

    // 根据提取到的 cid 获取评论内容
    fetchComments(match_cid[1], match_bvid[1]);
  } else {
    console.error("Unable to extract Cid from iframe code");
  }
};

const fetchComments = async (cid, bvid) => {
  const url = `https://comment.bilibili.com/${cid}.xml`;

  try {
    const response = await fetch(url);
    const xmlData = await response.text();

    // 解析XML数据
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const commentNodes = xmlDoc.querySelectorAll('d');

    // 将解析的评论数据放入 comments 数组中
    comments.value = Array.from(commentNodes).map((node) => {
      return {
        content: node.textContent,
        time: parseFloat(node.getAttribute('p').split(',')[0]), // 解析时间参数
        mode: parseInt(node.getAttribute('p').split(',')[1]),
        fontSize: parseInt(node.getAttribute('p').split(',')[2]),
        color: parseInt(node.getAttribute('p').split(',')[3]),
        timestamp: parseInt(node.getAttribute('p').split(',')[4]),
        pool: parseInt(node.getAttribute('p').split(',')[5]),
        senderId: node.getAttribute('p').split(',')[6],
        rowId: parseInt(node.getAttribute('p').split(',')[7])
      };
    });

    console.log("Comments:", comments);

    // 初始化空数组
    const contents = [];
    const times = [];
    const modes = [];
    const fontSizes = [];
    const colors = [];
    const timestamps = [];
    const pools = [];
    const senderIds = [];
    const rowIds = [];

    // 使用 forEach 遍历 comments 数组
    comments.value.forEach((comment) => {
      // 将每个字段的值分别存储在对应的数组中
      contents.push(comment.content);
      times.push(comment.time);
      modes.push(comment.mode);
      fontSizes.push(comment.fontSize);
      colors.push(comment.color);
      timestamps.push(comment.timestamp);
      pools.push(comment.pool);
      senderIds.push(comment.senderId);
      rowIds.push(comment.rowId);
    });

    // 向 Background Script 发送弹幕数据
    chrome.runtime.sendMessage({
      type: 'danmuFullData', bvid: bvid, contents: contents, times: times, modes: modes, fontSizes: fontSizes,
      colors: colors, timestamps: timestamps, pools: pools, senderIds: senderIds, rowIds: rowIds
    });
  } catch (error) {
    console.error("Error fetching comments", error);
    comments.value = []; // 清空评论内容
  }
};

const inputCode = ref("");
const responseData = ref(null);

const getAidCidBvid = () => {
  const regex_aid = /aid=(\d+)/;
  const match_aid = inputCode.value.match(regex_aid);

  const regex_cid = /cid=(\d+)/;
  const match_cid = inputCode.value.match(regex_cid);

  const regex_bvid = /bvid=([^&]+)/;
  const match_bvid = inputCode.value.match(regex_bvid);

  if (match_aid && match_aid[1] && match_cid && match_cid[1] && match_bvid && match_bvid[1]) {
    extractedAid.value = match_aid[1];
    console.log("Extracted Aid:", match_aid[1]);

    extractedCid.value = match_cid[1];
    console.log("Extracted Cid:", match_cid[1]);

    extractedBvid.value = match_bvid[1];
    console.log("Extracted Bvid:", match_bvid[1]);

    // 根据提取到的 cid 获取评论内容
    fetchData(match_aid[1], match_cid[1], match_bvid[1]);
  } else {
    console.error("Unable to extract Cid from iframe code");
  }
};

const fetchData = async (aid, cid, bvid) => {
  const url = `https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=${cid}&pid=${aid}&segment_index=1`;

  try {
    const response = await fetch(url);
    const data = await response.arrayBuffer();

    // 构建 POST 请求
    const formData = new FormData();
    formData.append('protobufData', new Blob([data]));

    // 发送 POST 请求到 Flask 后端
    fetch('http://localhost:5000/receive-rawdanmu', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
</script>

<style>
:root {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;

  color-scheme: light dark;
  background-color: #242424;
}

@media (prefers-color-scheme: light) {
  :root {
    background-color: #fafafa;
  }

  a:hover {
    color: #42b983;
  }
}

body {
  min-width: 20rem;
  color-scheme: light dark;
}

main {
  text-align: center;
  padding: 1em;
  margin: 0 auto;
}

h3 {
  color: #42b983;
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 200;
  line-height: 1.2rem;
  margin: 2rem auto;
}

a {
  font-size: 0.5rem;
  margin: 0.5rem;
  color: #cccccc;
  text-decoration: none;
}

.el-input {
  --el-input-focus-border-color: #42b983 !important;
}
</style>
