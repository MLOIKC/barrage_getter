<template>
    <BasicInfo />
    <div>
        <el-tabs type="card" stretch style="margin-top: 10px;" v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="当前分析" name="current-analysis"></el-tab-pane>
            <el-tab-pane label="历史分析" name="history-analysis">
                <el-select v-model="selectValue" placeholder="请选择要查看的历史信息" size="small" style="width: 240px;"
                    @click="getDateAnalysisHistory">
                    <el-option-group label="视频标识 - 分析时间">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label"
                            @click.native="handleOptionClick(item.value)" />
                    </el-option-group>
                </el-select>
            </el-tab-pane>
        </el-tabs>
        <h4>弹幕发布时间密度图</h4>
        <DateChart :dateData="dateResult" />
        <div v-loading="loading" style="margin-top: 50px;"></div>
    </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElButton } from 'element-plus';
import { useStore } from 'vuex';
import DateChart from './charts/dateChart.vue';
import BasicInfo from './BasicInfo.vue'

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

const selectValue = ref(''); // 选择器的值
const options = ref([]); // 选项列表

// 获取日期分析历史数据
const getDateAnalysisHistory = () => {
    fetch('http://localhost:5000/get_date_analysis_history', {
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
                value: item.date_data,
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
    dateResult.value = convertDatesToTimestamps(value);
}
const activeTab = ref('current-analysis'); // 默认选中当前分析标签页

const handleTabClick = (tab) => {
    if (tab.props.name === 'current-analysis') {
        // 切换到当前分析标签页的操作
        console.log('切换到当前分析标签页');
        DateAnalysis()
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
  