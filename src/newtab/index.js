import { createApp } from 'vue'
import App from './NewTab.vue'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');