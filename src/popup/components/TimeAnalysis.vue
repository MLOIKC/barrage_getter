<template>
    <div>
        <el-button color="#42b983" type="primary" plain @click="TimeAnalysis">生成时间密度图</el-button>
        <TimeChart :timeData="timeResult"/>
    </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElButton } from 'element-plus';
import { useStore } from 'vuex';
import TimeChart from './charts/timeChart.vue';

const store = useStore();

const danmuDetail = computed(() => store.state.danmuDetail);

const timeResult = ref('');


const TimeAnalysis = () => {
    // 发送POST请求给Flask后端
    fetch('http://localhost:5000/analyze_time', {
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
            timeResult.value = data;
            
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
</style>
  