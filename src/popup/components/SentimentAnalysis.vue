<template>
    <div>
        <!-- <el-button color="#42b983" type="primary" plain @click="SentiAnalysis">进行情感分析</el-button> -->
        <!-- 显示情感分析结果 -->
        <div v-loading="loading" style="margin-top: 50px;"></div>
        <div>
            <h4>情感类别详细统计</h4>
            <RadarChart :categories="major_categories" :counts="major_categories_counts" chartId="majorRadarChart" />
            <div v-if="sentimentResult" class="danmudetail">
                <div v-if="sentimentResult.major_categories">
                    <span v-for="(value, key) in sentimentResult.major_categories" :key="key" style="display: block;">
                        {{ key }}: {{ value }}
                    </span>
                </div>
            </div>

            <h4>情感类别粗略统计</h4>
            <RadarChart :categories="overall_categories" :counts="overall_categories_counts" chartId="overallRadarChart" />
            <div v-if="sentimentResult" class="danmudetail">
                <div v-if="sentimentResult.overall_categories">
                    <span v-for="(value, key) in sentimentResult.overall_categories" :key="key" style="display: block;">
                        {{ key }}: {{ value }}
                    </span>
                </div>
            </div>
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

const loading = ref(false);

onMounted(() => {
    SentiAnalysis()
})

const SentiAnalysis = () => {
    loading.value = true;
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
                if (category != 'Unknown') {
                    major_categories.value.push(category);
                    major_categories_counts.value.push(count);
                }
            }
            for (const [category, count] of Object.entries(sentimentResult.value.overall_categories)) {
                overall_categories.value.push(category);
                overall_categories_counts.value.push(count);
            }
            loading.value = false;
        })
        .catch(error => {
            console.error('Error:', error);
        })
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

.danmudetail {
    color: #000000;
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 200;
    text-align: center;
}
</style>
  