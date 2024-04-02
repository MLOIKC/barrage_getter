<template>
    <div class="bodystyle">
      <main>
        <div>
          <el-container>
            <el-aside width="185px">
              <NarbarMenu />
            </el-aside>
            <el-container>
              <el-header>
                <h3>弹幕实时分析系统</h3>
              </el-header>
              <el-main style="overflow:visible;">
                <router-view />
              </el-main>
              <a :href="link" target="_blank">关于作者</a>
            </el-container>
          </el-container>
        </div>
      </main>
    </div>
</template>


<script setup lang="js">
import { ref, watch, onMounted, onUnmounted } from 'vue'
// 导入 Element UI 的按钮组件
import { ElButton } from 'element-plus';
import NarbarMenu from './components/NarbarMenu.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const link = ref('https://github.com/MLOIKC')

onMounted(() => {
  router.push('/welcome');
});

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

/* 定制滚动条样式 */
body::-webkit-scrollbar {
  width: 8px; /* 设置滚动条宽度 */
}

body::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条背景颜色 */
}

body::-webkit-scrollbar-thumb {
  background: #dddddd; /* 滚动条滑块颜色 */
  border-radius: 5px; /* 滚动条滑块圆角 */
}

body::-webkit-scrollbar-thumb:hover {
  background: rgb(180, 180, 180); /* 滚动条滑块悬停时的颜色 */
}

.bodystyle {
  min-width: 35rem;
  color-scheme: light dark;
}

main {
  text-align: center;
  padding: 1em;
  margin: 0 auto;
}

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


a {
  font-size: 0.7rem;
  margin: 0.5rem;
  color: #cccccc;
  text-decoration: none;
  text-align: center;
}

.el-input {
  --el-input-focus-border-color: #42b983 !important;
}
</style>
