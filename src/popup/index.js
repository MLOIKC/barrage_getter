import { createApp } from 'vue'
import App from './Popup.vue'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import router from './router';
import store from './store';

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(store);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'Beg' && request.data) {
        const danmuDetail = request.data;
        // 触发 Vuex mutation 方法来更新状态
        store.commit('setDanmuDetail', danmuDetail);
    }
});

app.mount('#app');

