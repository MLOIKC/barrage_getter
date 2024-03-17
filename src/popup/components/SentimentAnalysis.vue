<template>
    <div>
        <el-button color="#42b983" type="primary" plain @click="SentiAnalysis">进行情感分析</el-button>
        <!-- 显示情感分析结果 -->
        <div v-if="sentimentResult">
            <h3>情感分析结果</h3>
            <p>{{ sentimentResult }}</p>
        </div>
    </div>
</template>

<script setup lang="js">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ElButton } from 'element-plus';

const sentimentResult = ref('');

const SentiAnalysis = () => {
    // 发送POST请求给Flask后端进行情感分析
    fetch('http://localhost:5000/analyze_sentiment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
        .then(response => response.json())
        .then(data => {
            // 获取情感分析结果并更新到前端页面
            sentimentResult.value = data.sentiment;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

</script>
  