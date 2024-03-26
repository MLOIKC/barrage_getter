<template>
    <div>
        <h4>弹幕关键词词云</h4>
        <div v-loading="loading" style="margin-top: 50px;"></div>
        <!-- <el-button color="#42b983" type="primary" plain @click="KeywordsAnalysis">生成关键词词云</el-button> -->
        <KeywordsChart :wordData="keywordsResult" />
    </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElButton } from 'element-plus';
import { useStore } from 'vuex';
import KeywordsChart from './charts/wordcloudChart.vue';

const store = useStore();

const danmuDetail = computed(() => store.state.danmuDetail);

const keywordsResult = ref('');
const loading = ref(false);

onMounted(() => {
    KeywordsAnalysis()
})

const KeywordsAnalysis = () => {
    loading.value = true;
    // 发送POST请求给Flask后端进行情感分析
    fetch('http://localhost:5000/analyze_keywords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            danmuDetail: {
                type: danmuDetail.value.type,
                data: danmuDetail.value.data
            }
        }),
    })
        .then(response => response.json())
        .then(data => {
            // 获取情感分析结果并更新到前端页面
            keywordsResult.value = data;
            loading.value = false;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

</script>

<style>
h4 {
    color: #42b983;
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 200;
    line-height: 1.2rem;
    margin: 2rem auto;
}

.el-loading-spinner .path {
    stroke: #42b983 !important;
}
</style>
  