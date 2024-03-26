<template>
    <div>
        <svg id="dateChart"></svg>
        <div id="dateCharttooltip"
            style="position: absolute; visibility: hidden; padding: 5px; background: white; border: 1px solid #42b983;border-radius: 8px;">
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, watch, defineProps } from 'vue';
import * as d3 from 'd3';
// 定义 props
const props = defineProps(['dateData']);

const createDateChart = (dateData) => {
    // 将日期数据中的时间戳字符串转换为数字型时间戳
    const timestamps = dateData.map(item => parseInt(item.date));

    // 统计每个时间戳出现的次数
    const dateCounts = timestamps.reduce((acc, time) => {
        acc[time] = (acc[time] || 0) + 1;
        return acc;
    }, {});

    // 转换成数组形式
    const dateCountArray = Object.entries(dateCounts).map(([time, count]) => ({ time: parseInt(time), count }));

    // 设置SVG尺寸
    const width = 300;
    const height = 270;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select("#dateChart")
        .attr('width', width)
        .attr('height', height);

    // 创建比例尺
    const xScale = d3.scaleLinear()
        .domain([d3.min(dateCountArray, d => d.time), d3.max(dateCountArray, d => d.time)]) // 设置时间的最小和最大值为域
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dateCountArray, d => d.count)])
        .range([height - margin.bottom, margin.top]);

    // 创建区域生成器
    const area = d3.area()
        .x(d => xScale(d.time)) // 使用线性比例尺的时间作为x坐标
        .y0(height - margin.bottom)
        .y1(d => yScale(d.count));


    // 在SVG中定义一个线性渐变
    const gradient = svg.append("defs").append("linearGradient")
        .attr("id", "dateChartGradient")
        .attr("x1", "0%") // 渐变开始于左侧
        .attr("y1", "80%") // 从顶部开始
        .attr("x2", "0%") // 沿着y轴方向
        .attr("y2", "100%"); // 结束于底部

    // 定义渐变的起始颜色和结束颜色
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#9bf1ca"); // 渐变开始的颜色

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#42b983"); // 渐变结束的颜色


    // 绘制区域图
    svg.append('path')
        .datum(dateCountArray)
        .attr('fill', "url(#dateChartGradient)")
        .attr('d', area);

    // 在区域图上添加透明的圆点，用于捕获鼠标事件
    svg.selectAll(".dot")
        .data(dateCountArray)
        .enter().append("circle") // 为每个数据点添加圆点
        .attr("class", "dot")
        .attr("cx", d => xScale(d.time)) // 利用相同的xScale定位
        .attr("cy", d => yScale(d.count)) // 利用yScale定位
        .attr("r", 5) // 圆点半径，可以根据需要调整
        .style("fill", "transparent") // 使圆点透明
        .style("pointer-events", "all") // 确保即使是透明的也能捕获鼠标事件
        .on('mouseover', function (event, d) {
            // 创建一个Date对象并设置时间戳
            const dateObj = new Date(d.time);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要+1并补0
            const day = dateObj.getDate().toString().padStart(2, '0'); // 补0使得日期格式一致
            const formattedTime = `${year}-${month}-${day}`;

            d3.select("#dateCharttooltip")
                .style('visibility', 'visible')
                // 使用格式化的时间显示tooltip文本
                .text(`Time: ${formattedTime}, Count: ${d.count}`)
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', function () {
            d3.select("#dateCharttooltip").style('visibility', 'hidden');
        });


    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(3).tickFormat(d => {
            // 创建一个Date对象并设置时间戳
            const dateObj = new Date(d);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要+1并补0
            const day = dateObj.getDate().toString().padStart(2, '0'); // 补0使得日期格式一致
            return `${year}-${month}-${day}`; // 返回日期格式字符串
        }));

    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale)); // 确保y轴只显示整数刻度


    // 添加标签
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - margin.bottom / 2 + 15)
        .attr('text-anchor', 'middle')
        .text('Time');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', margin.left / 2 - 10)
        .attr('text-anchor', 'middle')
        .text('Event Count');
}

// 监听 props.dateData的变化
watch(() => props.dateData, (newDateData, oldDateData) => {
    createDateChart(newDateData);
});

</script>
<style>
h4 {
    color: #9bf1ca;
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 200;
    line-height: 1.2rem;
    margin: 2rem auto;
}
</style>