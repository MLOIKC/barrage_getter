<template>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex';

const store = useStore();

const danmuDetail = computed(() => store.state.danmuDetail);

const radio1 = ref(['1'])
const topics = ref([])
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
