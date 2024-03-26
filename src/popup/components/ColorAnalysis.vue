<template>
    <div>
        <h4>弹幕颜色占比</h4>
        <div v-loading="loading" style="margin-top: 50px;"></div>
        <!-- <el-button color="#42b983" type="primary" plain @click="ColorAnalysis">生成弹幕颜色</el-button> -->
        <ColorPieChart :colorData="colorResult" />
    </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElButton } from 'element-plus';
import { useStore } from 'vuex';
import ColorPieChart from './charts/colorPieChart.vue';

const store = useStore();

const danmuDetail = computed(() => store.state.danmuDetail);

const colorResult = ref('');
const loading = ref(false);

onMounted(() => {
    ColorAnalysis()
})

const ColorAnalysis = () => {
    loading.value = true;
    // 发送POST请求给Flask后端
    fetch('http://localhost:5000/analyze_color', {
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
            colorResult.value = data;
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
  