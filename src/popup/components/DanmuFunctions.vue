<template>
  <BasicInfo />

  <el-tabs stretch v-model="activeName" class="danmutabs" @tab-click="handleTabClick">
    <el-tab-pane label="初级版" name="first">
      <el-button color="#42b983" type="primary" plain @click="getDanmuData">获取弹幕列表信息</el-button>
    </el-tab-pane>

    <!-- <el-tab-pane label="中级版" name="second">
      <div>
        <ul class="step-list">
          <li><span class="step-icon">1</span> 点击视频下方的分享视频<img :src="shareImage" alt="Share" width="22" /></li>
          <li><span class="step-icon">2</span> 点击其中的嵌入代码<img :src="iframeImage" alt="Iframe" width="40" /></li>
          <li><span class="step-icon">3</span> 将复制的内容粘贴到此处</li>
        </ul>
        <el-input v-model="iframeCode" placeholder="Enter iframe code" style="margin-bottom: 10px;" />
        <el-button color="#42b983" type="primary" plain @click="getCidBvid">获取详细弹幕信息</el-button>

      </div>
    </el-tab-pane> -->

    <el-tab-pane label="高级版" name="third">
      <div>
        <ul class="step-list">
          <li><span class="step-icon">1</span> 点击视频下方的分享视频<img :src="shareImage" alt="Share" width="22" /></li>
          <li><span class="step-icon">2</span> 点击其中的嵌入代码<img :src="iframeImage" alt="Iframe" width="40" /></li>
          <li><span class="step-icon">3</span> 将复制的内容粘贴到此处</li>
        </ul>
        <el-input v-model="inputCode" placeholder="Enter iframe code" style="margin-bottom: 10px;" />
        <el-button color="#42b983" type="primary" plain @click="getAidCidBvid">获取详细弹幕信息</el-button>
      </div>
    </el-tab-pane>

  </el-tabs>
  <div>
    <el-alert v-if="isMatched === false" title="获取Cid/Aid失败，请输入正确的iframe" type="error" center :closable="false" show-icon
      style="margin-top: 10px;" />
    <el-alert v-else-if="isMatched === true" title="获取Cid/Aid成功" type="success" center :closable="false" show-icon
      style="margin-top: 10px;" />
    <el-alert v-if="isSuccess === true" :title="successMessage" type="success" center :closable="false" show-icon
      style="margin-top: 10px;" />
    <el-alert v-else-if="isSuccess === false" :title="successMessage" type="error" center :closable="false" show-icon
      style="margin-top: 10px;" />
  </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, watch } from 'vue'
// 导入 Element UI 的按钮组件
import { ElButton } from 'element-plus';
import { useStore } from 'vuex';
import BasicInfo from './BasicInfo.vue'
import shareImage from '../../assets/share.jpg';
import iframeImage from '../../assets/iframe.jpg';

const store = useStore();

// 使用 ref 来创建响应式变量，并从 localStorage 中获取初始值
const localdanmuDetail = ref(localStorage.getItem('danmuDetail') || '');

// 使用 computed 创建计算属性，保持与 store.state.danmuDetail 的同步
const danmuDetail = computed(() => store.state.danmuDetail);

// 在组件加载时将 localStorage 中的值同步到 danmuDetail 变量中
onMounted(() => {
  if (localdanmuDetail.value) {
    const parsedValue = JSON.parse(localdanmuDetail.value);
    store.commit('setDanmuDetail', { type: parsedValue.type, data: parsedValue.data });
  }
});

// 监听 danmuDetail 变量的变化，更新 localStorage 中的值
watch(store.state.danmuDetail, (newValue) => {
  localStorage.setItem('danmuDetail', JSON.stringify(newValue));
});

const activeName = ref('first')
const iframeCode = ref("");
const extractedAid = ref("");
const extractedCid = ref("");
const extractedBvid = ref("");
const comments = ref("");
const inputCode = ref("");

const successMessage = ref('');
const isSuccess = ref(null);
const isMatched = ref(null);

// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'fetchDanmu') {
    // 解析消息内容并提取成功信息
    const data = JSON.parse(message.data);
    if (data) {
      if (data.message) {
        successMessage.value = data.message;
        isSuccess.value = true;
      }
      else {
        successMessage.value = data.error;
        isSuccess.value = false;
      }
    }
  }
});

const handleTabClick = (tab) => {
  isSuccess.value = null;
  isMatched.value = null;
}

// 初级版获取弹幕
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
        const danmuTitleElement = document.querySelector('#viewbox_report > div.video-info-title > div > h1');

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

        let danmuDetailSample = {
          type: 'Beg', // 设置默认值
          data: danmuTitle, // 设置默认值
        };
        chrome.runtime.sendMessage({ type: danmuDetailSample.type, data: danmuDetailSample });
      },
    });
  });
};

// 中级版获取弹幕
const getCidBvid = () => {
  const regex_cid = /cid=(\d+)/;
  const match_cid = iframeCode.value.match(regex_cid);

  const regex_bvid = /bvid=([^&]+)/;
  const match_bvid = iframeCode.value.match(regex_bvid);

  if (match_cid && match_cid[1] && match_bvid && match_bvid[1]) {
    isMatched.value = true;
    extractedCid.value = match_cid[1];
    console.log("Extracted Cid:", match_cid[1]);

    extractedBvid.value = match_bvid[1];
    console.log("Extracted Bvid:", match_bvid[1]);

    store.commit('setDanmuDetail', { type: 'Int', data: extractedBvid.value });

    // 根据提取到的 cid 获取评论内容
    fetchComments(match_cid[1], match_bvid[1]);
  } else {
    isMatched.value = false;
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
        time: parseFloat(node.getAttribute('p').split(',')[0]),
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

// 高级版获取弹幕
const getAidCidBvid = () => {
  const regex_aid = /aid=(\d+)/;
  const match_aid = inputCode.value.match(regex_aid);

  const regex_cid = /cid=(\d+)/;
  const match_cid = inputCode.value.match(regex_cid);

  const regex_bvid = /bvid=([^&]+)/;
  const match_bvid = inputCode.value.match(regex_bvid);

  if (match_aid && match_aid[1] && match_cid && match_cid[1] && match_bvid && match_bvid[1]) {
    isMatched.value = true;
    extractedAid.value = match_aid[1];
    console.log("Extracted Aid:", match_aid[1]);

    extractedCid.value = match_cid[1];
    console.log("Extracted Cid:", match_cid[1]);

    extractedBvid.value = match_bvid[1];
    console.log("Extracted Bvid:", match_bvid[1]);

    store.commit('setDanmuDetail', { type: 'Adv', data: extractedBvid.value });
    // 根据提取到的 cid 获取评论内容
    fetchData(match_aid[1], match_cid[1], match_bvid[1]);
  } else {
    isMatched.value = false;
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
    formData.append('bvid', bvid);

    // 发送 POST 请求到 Flask 后端
    fetch('http://localhost:5000/receive-rawdanmu', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(message => {
        // 解析消息内容并提取成功信息
        const data = JSON.parse(message);
        if (data) {
          if (data.message) {
            successMessage.value = data.message;
            isSuccess.value = true;
          }
          else {
            successMessage.value = data.error;
            isSuccess.value = false;
          }
        }
      })
      .catch(error => console.error('Error:', error));

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
</script>

<style>
h3 {
  background: linear-gradient(to left, #42b983, #9bf1ca);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  font-size: 2.2rem;
  font-weight: 1000;
  margin: 2rem auto;
  filter: drop-shadow(1.5px 1.5px 0px rgba(0, 0, 0, 0.6));
  font-family: 'STXinwei';
}

.el-input {
  --el-input-focus-border-color: #42b983 !important;
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs__item.is-active {
  color: #42b983 !important;
}

.el-tabs__item:hover {
  color: #42b983 !important;
}

.el-tabs__active-bar {
  background-color: #42b983 !important;
}

.danmudetail {
  color: #42b983;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 200;
  text-align: center;
}

.step-list {
  list-style: none;
  padding-left: 0;
  text-align: center;
}

.step-list li {
  list-style: none;
  margin-bottom: 1rem;
  /* 设置列表项之间的间距 */
  font-size: 13px;
}

.step-icon {
  display: inline-block;
  width: 1.1rem;
  height: 1.1rem;
  line-height: 1.0rem;
  text-align: center;
  border-radius: 50%;
  background-color: #4ac28c;
  color: #fff;
  font-weight: bold;
  margin-right: 0.2rem;
}
</style>