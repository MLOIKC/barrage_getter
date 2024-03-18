<template>
    <el-menu default-active="0" class="el-menu-vertical-demo">
        <el-menu-item index="0" @click="navigateToWelcome">
            <el-icon>
                <House />
            </el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-menu-item index="1" @click="navigateToGetdanmu">
            <el-icon>
                <Pointer />
            </el-icon>
            <span>弹幕获取</span>
        </el-menu-item>

        <el-sub-menu index="2">
            <template #title>
                <el-icon>
                    <document />
                </el-icon>
                <span>弹幕综合分析</span>
            </template>
            <el-alert v-if="showAlert" title="请先获取弹幕数据！" type="warning" :closable="false" show-icon>
            </el-alert>
            <el-menu-item index="2-1" @click="navigateToSentiAnalysis">弹幕情感分析</el-menu-item>
            <el-menu-item index="2-2" @click="navigateToThemeAnalysis">弹幕主题分析</el-menu-item>
            <el-menu-item index="2-3">弹幕关键词提取</el-menu-item>
            <el-menu-item index="2-4">弹幕时间密度</el-menu-item>
            <el-menu-item index="2-5">弹幕色彩分析</el-menu-item>
            <el-menu-item index="2-6">弹幕发布时间统计</el-menu-item>

        </el-sub-menu>
        <el-menu-item index="3">
            <el-icon>
                <User />
            </el-icon>
            <span>用户行为分析</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup lang="js">
import {
    Document,
    Pointer,
    User,
    House
} from '@element-plus/icons-vue'
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const danmuDetail = computed(() => store.state.danmuDetail);
const showAlert = ref(false); // 控制警告显示的变量

const navigateToWelcome = () => {
    router.push('/welcome');
};
const navigateToGetdanmu = () => {
    router.push('/getdanmu');
};
const navigateToSentiAnalysis = () => {
    if (!danmuDetail.value.type) {
        // 如果 danmuDetail 为空，提醒用户
        showAlert.value = true;
    } else {
        // 如果不为空，进行页面跳转
        router.push('/sentiAnalysis');
        showAlert.value = false;
    }
};
const navigateToThemeAnalysis = () => {
    if (!danmuDetail.value.type) {
        // 如果 danmuDetail 为空，提醒用户
        showAlert.value = true;
    } else {
        // 如果不为空，进行页面跳转
        router.push('/themeanalysis');
        showAlert.value = false;
    }
};
</script>

<style>
.el-menu-item.is-active {
    color: #42b983 !important;
}

.el-menu-item:hover {
    background-color: #e6f3ed !important;
}

.el-sub-menu__title:hover {
    background-color: #e6f3ed !important;
}
</style>