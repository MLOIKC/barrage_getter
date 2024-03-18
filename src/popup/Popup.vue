<template>
  <main>
    <div class="common-layout">
      <el-container>
        <el-aside width="165px">
          <NarbarMenu />
        </el-aside>
        <el-container>
          <el-header>
            <h3>弹幕实时分析系统</h3>
          </el-header>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </div>
  </main>
</template>


<script setup lang="js">
import { ref, watch, onMounted, onUnmounted } from 'vue'
// 导入 Element UI 的按钮组件
import { ElButton } from 'element-plus';
import NarbarMenu from './components/NarbarMenu.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

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

body {
  min-width: 33rem;
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
  font-size: 1.8rem;
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
