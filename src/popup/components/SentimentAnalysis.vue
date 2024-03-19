<template>
    <div>
        <el-button color="#42b983" type="primary" plain @click="SentiAnalysis">进行情感分析</el-button>
        <!-- 显示情感分析结果 -->
        <div v-if="sentimentResult">
            <h4>情感分析结果</h4>
            <p>{{ sentimentResult }}</p>
        </div>
        <div>
            <h4>情感类别详细统计</h4>
            <RadarChart :categories="major_categories" :counts="major_categories_counts" chartId="majorRadarChart" />
            <h4>情感类别粗略统计</h4>
            <RadarChart :categories="overall_categories" :counts="overall_categories_counts" chartId="overallRadarChart" />
        </div>
    </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElButton } from 'element-plus';
import { useStore } from 'vuex';
import RadarChart from './charts/radarChart.vue';

const store = useStore();

const danmuDetail = computed(() => store.state.danmuDetail);

const sentimentResult = ref('');

const major_categories = ref([]);
const major_categories_counts = ref([]);
const overall_categories = ref([]);
const overall_categories_counts = ref([]);

const SentiAnalysis = () => {
    // 发送POST请求给Flask后端进行情感分析
    fetch('http://localhost:5000/analyze_sentiment', {
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
            sentimentResult.value = data.sentiment;
            major_categories.value = [];
            major_categories_counts.value = [];
            overall_categories.value = [];
            overall_categories_counts.value = [];

            for (const [category, count] of Object.entries(sentimentResult.value.major_categories)) {
                major_categories.value.push(category);
                major_categories_counts.value.push(count);
            }
            for (const [category, count] of Object.entries(sentimentResult.value.overall_categories)) {
                overall_categories.value.push(category);
                overall_categories_counts.value.push(count);
            }
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
  