<template>
    <div>
        <h4>弹幕发布时间密度图</h4>
        <div v-loading="loading" style="margin-top: 50px;"></div>
        <!-- <el-button color="#42b983" type="primary" plain @click="DateAnalysis">生成发布时间密度图</el-button> -->
        <DateChart :dateData="dateResult" />
    </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElButton } from 'element-plus';
import { useStore } from 'vuex';
import DateChart from './charts/dateChart.vue';

const store = useStore();

const danmuDetail = computed(() => store.state.danmuDetail);

const dateResult = ref('');
const loading = ref(false);

onMounted(() => {
    DateAnalysis()
})

const isTimestamp = (value) => {
    return /^\d{10,13}$/.test(value);
};

const convertDatesToTimestamps = (datesArray) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // getMonth() 返回的月份是从0开始的
    const currentDate = today.getDate();

    const converted = datesArray.map(item => {
        // 如果item.date已经是时间戳，则将其转换为当天的00:00:00时间戳
        if (isTimestamp(item.date)) {
            if (typeof item.date === "string") {
                item.date = parseInt(item.date);
            }
            const dateObj = new Date(item.date); // 将时间戳转换为日期对象
            dateObj.setHours(0, 0, 0, 0); // 设置时分秒为00:00:00
            return { ...item, date: dateObj.getTime() }; // 返回当天00:00:00的时间戳
        }

        const [month, day] = item.date.split(' ')[0].split('-').map(Number);
        let year;
        if (month < currentMonth || (month === currentMonth && day <= currentDate)) {
            year = currentYear;
        } else {
            year = currentYear - 1;
        }

        const fullDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 00:00:00`;
        const dateObject = new Date(fullDateString);
        const timestamp = dateObject.getTime();

        // 直接替换date字段为timestamp
        return { ...item, date: timestamp };
    }).sort((a, b) => a.date - b.date);

    return converted;
};



const DateAnalysis = () => {
    loading.value = true;
    // 发送POST请求给Flask后端
    fetch('http://localhost:5000/analyze_date', {
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
            dateResult.value = convertDatesToTimestamps(data);
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
  