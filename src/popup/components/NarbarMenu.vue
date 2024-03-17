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
        <el-menu-item index="2" @click="navigateToSentiAnalysis">
            <el-icon><icon-menu /></el-icon>
            <span>弹幕情感分析</span>
        </el-menu-item>
        <el-menu-item index="3">
            <el-icon>
                <document />
            </el-icon>
            <span>弹幕文本分析</span>
        </el-menu-item>
        <el-menu-item index="4">
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
    Menu as IconMenu,
    Pointer,
    User,
    House
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const navigateToWelcome = () => {
    router.push('/welcome');
};
const navigateToGetdanmu = () => {
    router.push('/getdanmu');
};
const navigateToSentiAnalysis = () => {
    router.push('/sentianalysis');
};
</script>

<style>
.el-menu-item.is-active {
    color: #42b983 !important;
}

.el-menu-item:hover {
    background-color: #e6f3ed !important;
}</style>