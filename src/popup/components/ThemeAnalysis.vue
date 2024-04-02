<template>
    <BasicInfo />
    <el-tabs type="card" stretch style="margin-top: 10px;">
        <el-tab-pane label="当前分析">
            <h4>主题分析方法选择：</h4>
            <div style="margin-top: 20px">
                <el-radio-group v-model="radio1" size="small" @change="fetchTopicAnalysis">
                    <el-radio :label="'1'" border>LDA</el-radio>
                    <el-radio :label="'2'" border>LSA</el-radio>
                    <el-radio :label="'3'" border>NMF</el-radio>
                </el-radio-group>
            </div>
            <div v-loading="loading" style="margin-top: 50px;"></div>
            <div class="flex gap-2 mt-4">
                <div v-for="(topic, index) in topics" :key="index">
                    <el-tag v-for="(word, i) in topic" :key="i" :type="getTagType(index)" effect="light" round>
                        {{ word }}
                    </el-tag>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="历史分析">
            <el-select v-model="selectValue" placeholder="请选择要查看的历史信息" size="small" style="width: 240px;"
                @click="getThemeAnalysisHistory">
                <el-option-group label="视频标识 - 主题分析方法 - 分析时间">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label"
                        @click.native="handleOptionClick(item.value)" />
                </el-option-group>
            </el-select>
            <div class="flex gap-2 mt-4" style="margin-top: 10px;">
                <div v-for="(topic, index) in topics2" :key="index">
                    <el-tag v-for="(word, i) in topic" :key="i" :type="getTagType(index)" effect="light" round>
                        {{ word }}
                    </el-tag>
                </div>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex';
import BasicInfo from './BasicInfo.vue'

const store = useStore();

const danmuDetail = computed(() => store.state.danmuDetail);

const radio1 = ref(['1'])
const topics = ref([])
const topics2 = ref([])
const loading = ref(false)

async function fetchTopicAnalysis() {
    loading.value = true;
    try {
        const response = await fetch('http://localhost:5000/analyze_theme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: radio1.value,
                danmuDetail: {
                    type: danmuDetail.value.type,
                    data: danmuDetail.value.data
                }
            }),
        });
        const data = await response.json();
        topics.value = data.result;
        console.log(data.result);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        loading.value = false;
    }
}

// 动态计算标签的type属性值
const getTagType = (i) => {
    // 每五个词语换一个type
    const types = ['success', 'info', 'warning', 'danger', 'primary']
    return types[i % types.length]
}

const selectValue = ref(''); // 选择器的值
const options = ref([]); // 选项列表

// 获取日期分析历史数据
const getThemeAnalysisHistory = () => {
    fetch('http://localhost:5000/get_theme_analysis_history', {
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
                value: item.theme_words,
                label: `${item.danmu_data} - ${item.theme_method} - ${formatTimestamp(item.analysis_timestamp)}`,
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
    topics2.value = value;
}
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

.el-radio.is-bordered.is-checked {
    border-color: #42b983 !important;
}

.el-radio__input.is-checked+.el-radio__label {
    color: #42b983 !important;
}

.el-radio__input.is-checked .el-radio__inner {
    background: #42b983 !important;
}

.el-loading-spinner .path {
    stroke: #42b983 !important;
}
</style>
