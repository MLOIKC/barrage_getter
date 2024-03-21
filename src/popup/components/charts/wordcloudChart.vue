<template>
    <div id="wordCloud">
        <div id="wordCloudChart"></div>
    </div>
    <div id="wordCloudtooltip"
        style="position: absolute; visibility: hidden; padding: 5px; background: rgba(255, 255, 255, 0.85);border-radius: 8px;">
    </div>
</template>
  
<script setup>
import { onMounted, watch, defineProps } from 'vue';
import * as d3 from 'd3';
import cloud from 'd3-cloud'; // 导入 d3-cloud 库
import { scaleOrdinal } from 'd3';
// 定义 props
const props = defineProps(['wordData']);


const createKeywordChart = (wordData) => {
    // 移除旧的SVG如果存在，确保重绘而不是在旧图上绘制
    d3.select("#wordCloudChart").remove();
    // 添加新的 div 元素，设置 id 为 wordCloudChart
    const newDiv = d3.select("#wordCloud")
        .append("div")
        .attr("id", "wordCloudChart");
    // 获取词云图容器的引用
    const container = d3.select('#wordCloudChart');
    // 创建词云图
    const width = 270;
    const height = 270;
    // 创建颜色比例尺
    const colorScale = scaleOrdinal(d3.schemeSet2);
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const fontSizeScale = d3.scaleLinear()
        .domain([0, d3.max(wordData, d => d.frequency)])
        .range([5, 70]); // 调整文字大小范围

    // 使用 d3-cloud 创建词云布局
    const layout = cloud()
        .size([width, height])
        .words(wordData.map(d => ({ text: d.text, size: fontSizeScale(d.frequency), frequency: d.frequency }))) // 按词频设置文字大小
        .padding(1)
        .rotate(() => Math.random() > 0.5 ? 0 : 90) // 随机旋转文字角度
        .font('Arial')
        .fontSize(d => d.size)
        .on('end', draw);

    // 开始生成词云图
    layout.start();

    // 绘制词云图
    function draw(words) {
        svg.selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', d => d.size + 'px')
            .style('fill', (d, i) => colorScale(i))
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x + 135},${d.y + 135}) rotate(${d.rotate})`)
            .text(d => d.text)
            .on('mouseover', function (event, d) {
                // 获取当前文本的颜色
                const textFillColor = d3.select(this).style('fill');

                // 显示 tooltip，并设置颜色为当前文本的颜色
                d3.select("#wordCloudtooltip")
                    .style('visibility', 'visible')
                    .text(`${d.text}: ${d.frequency}`) // 显示对应的文本和值
                    .style('color', textFillColor) // 设置浮窗字体颜色为当前文本的颜色
                    .style('border', `1px solid ${textFillColor}`)
                    .style('top', (event.pageY - 10) + 'px') // 定位
                    .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', function () {
                // 隐藏 tooltip
                d3.select("#wordCloudtooltip").style('visibility', 'hidden');
            });
    }
}

// 监听 props.wordData的变化
watch(() => props.wordData, (newWordData, oldWordData) => {
    // 调用 createKeywordChart 函数，并传入新的数据
    createKeywordChart(newWordData);
});
</script>
  
<style scoped>
/* 样式可以根据需求进行自定义 */
</style>
  