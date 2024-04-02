<template>
    <BasicInfo />
    <div>
        <!-- <el-button color="#42b983" type="primary" plain @click="SentiAnalysis">进行情感分析</el-button> -->
        <el-tabs type="card" stretch style="margin-top: 10px;" v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="当前分析" name="current-analysis"></el-tab-pane>
            <el-tab-pane label="历史分析" name="history-analysis">
                <el-select v-model="selectValue" placeholder="请选择要查看的历史信息" size="small" style="width: 240px;"
                    @click="getSentimentAnalysisHistory">
                    <el-option-group label="视频标识 - 分析时间">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label"
                            @click.native="handleOptionClick(item.value)" />
                    </el-option-group>
                </el-select>
            </el-tab-pane>
        </el-tabs>
        <div v-loading="loading" style="margin-top: 50px;"></div>
        <div>
            <h4>情感类别详细统计</h4>
            <RadarChart :categories="major_categories" :counts="major_categories_counts" chartId="majorRadarChart" />
            <div v-if="sentimentResult" class="sentidetail">
                <div v-if="sentimentResult.major_categories">
                    <span v-for="(value, key) in sentimentResult.major_categories" :key="key" style="display: block;">
                        {{ key }}: {{ value }}
                    </span>
                </div>
            </div>

            <h4>情感类别粗略统计</h4>
            <RadarChart :categories="overall_categories" :counts="overall_categories_counts" chartId="overallRadarChart" />
            <div v-if="sentimentResult" class="sentidetail">
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
import BasicInfo from './BasicInfo.vue'

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

const selectValue = ref(''); // 选择器的值
const options = ref([]); // 选项列表

// 获取情感分析历史数据
const getSentimentAnalysisHistory = () => {
    fetch('http://localhost:5000/get_sentiment_analysis_history', {
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
            options.value = data.history_data.map(item => ({
                value: item.sentiment_data,
                label: `${item.danmu_data} - ${formatTimestamp(item.analysis_timestamp)}`,
            }));
        })
        .catch(error => {
            console.error('Error:', error);
        })
};

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000); // 乘以 1000 将秒转换为毫秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 返回按照年/月/日 时:分:秒 格式的日期时间字符串
};

const handleOptionClick = (value) => {
    major_categories.value = [];
    major_categories_counts.value = [];
    overall_categories.value = [];
    overall_categories_counts.value = [];
    for (const [category, count] of Object.entries(value.major_categories)) {
        if (category != 'Unknown') {
            major_categories.value.push(category);
            major_categories_counts.value.push(count);
        }
    }
    for (const [category, count] of Object.entries(value.overall_categories)) {
        overall_categories.value.push(category);
        overall_categories_counts.value.push(count);
    }
}

const activeTab = ref('current-analysis'); // 默认选中当前分析标签页

const handleTabClick = (tab) => {
    if (tab.props.name === 'current-analysis') {
        // 切换到当前分析标签页的操作
        console.log('切换到当前分析标签页');
        SentiAnalysis()
    } else if (tab.props.name === 'history-analysis') {
        // 切换到历史分析标签页的操作
        console.log('切换到历史分析标签页');
    }
};
</script>

<style>
h4 {
    color: #42b983;
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 200;
    line-height: 1.2rem;
    margin: 1rem auto;
}

.el-loading-spinner .path {
    stroke: #42b983 !important;
}

.sentidetail {
    color: #000000;
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 200;
    text-align: center;
}

.el-select__wrapper.is-focused {
    box-shadow: 0 0 0 1px #42b983 inset;
}

.el-select-dropdown__item.is-selected {
    color: #42b983 !important;
}

.el-select-dropdown__item.is-hovering {
    background-color: #e6f3ed !important;
}

.el-select-dropdown__item {
    font-size: 12px !important;
}
</style>
  