<template>
    <div style="position: relative;" id="color">
        <svg id="colorpieChartSvg"></svg>
        <div id="colorpieLegend"></div>
    </div>
</template>
  
<script setup>
import { onMounted, watch, defineProps } from 'vue';
import * as d3 from 'd3';
// 定义 props
const props = defineProps(['colorData']);

const getColorCounts = (colorData) => {
    const colorCounts = {};
    colorData.forEach(item => {
        const colorStr = JSON.stringify(item.color);
        colorCounts[colorStr] = (colorCounts[colorStr] || 0) + 1;
    });

    return Object.keys(colorCounts).map(color => ({
        color: JSON.parse(color),
        count: colorCounts[color]
    }));
};

const createColorChart = (colorData) => {
    const colorCounts = getColorCounts(colorData);
    const width = 270;
    const height = 270;
    const radius = Math.min(width, height) / 2 - 20;

    // 移除旧的SVG如果存在，确保重绘而不是在旧图上绘制
    d3.select("#colorpieChartSvg").remove();
    // 添加新的 svg 元素，设置 id 为 colorpieChartSvg
    const newSvg = d3.select("#color")
        .append("svg")
        .attr("id", "colorpieChartSvg");
    
    const svg = d3.select('#colorpieChartSvg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    svg.append('defs')
        .html(`<filter id="color-drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0, 0, 0, 0.5)" flood-opacity="0.5"/>
    </filter>`);

    const colorScale = d3.scaleOrdinal()
        .domain(colorCounts.map(d => d.color))
        .range(colorCounts.map(d => `rgb(${d.color.join(',')})`));

    const pie = d3.pie()
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);


    // 定义颜色渐变
    const gradient = svg.append("defs")
        .selectAll("linearGradient")
        .data(pie(colorCounts))
        .enter()
        .append("linearGradient")
        .attr("id", (d, i) => `colorchart-gradient-${i}`)
        .attr("gradientTransform", "rotate(90)");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => `rgb(${d.data.color.join(',')},0.6`);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => `rgb(${d.data.color.map(c => Math.max(0, c - 10)).join(',')})`);

    // 添加饼图部分
    const arcs = svg.selectAll('arc')
        .data(pie(colorCounts))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .on('mouseover', function (event, d) {
            // 鼠标悬停时放大当前饼图部分及对应的文字
            d3.select(this).select('path')
                .transition()
                .duration(200)
                .attr('transform', 'scale(1.1)')
                .attr('stroke', 'white') // 添加白色边框
                .attr('stroke-width', 2); // 设置边框宽度

            d3.select(this).select('text')
                .transition()
                .duration(200)
                .attr('transform', `translate(${arc.centroid(d)}) scale(1.1)`)
                .attr('font-size', '16px') // 调整文字大小
                .attr('stroke', 'black') // 添加文字描边
                .attr('stroke-width', 0.5); // 设置文字描边宽度
        })
        .on('mouseout', function (event, d) {
            // 鼠标移出时恢复饼图部分及文字的原始样式
            d3.select(this).select('path')
                .transition()
                .duration(200)
                .attr('transform', 'scale(1)')
                .attr('stroke', 'none'); // 移除边框

            d3.select(this).select('text')
                .transition()
                .duration(200)
                .attr('transform', `translate(${arc.centroid(d)}) scale(1)`)
                .attr('font-size', '12px') // 恢复文字原始大小
                .attr('stroke', 'none');
        });


    // 添加饼图路径
    arcs.append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => `url(#colorchart-gradient-${i})`) // 使用渐变填充颜色
        .attr('stroke', 'none') // 初始时没有边框
        .style('filter', 'url(#color-drop-shadow)');

    // 计算所有计数的总和
    const total = colorCounts.reduce((sum, d) => sum + d.count, 0);

    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => `${(d.data.count / total * 100).toFixed(2)}%`); // 显示百分比


    // 移除旧的DIV如果存在，确保重绘而不是在旧图上绘制
    d3.select("#colorpieLegend").remove();
    // 添加新的 div 元素，设置 id 为 colorpieChartSvg
    const newDiv = d3.select("#color")
        .append("div")
        .attr("id", "colorpieLegend");
    
    // 图例
    const legend = d3.select('#colorpieLegend')
        .selectAll('.legend-item')
        .data(colorCounts)
        .enter()
        .append('div')
        .attr('class', 'legend-item');

    // 图例颜色块
    const colorBlock = legend.append('div')
        .attr('class', 'legend-color')
        .append('svg')
        .attr('width', 20) // 根据需要调整大小
        .attr('height', 20)
        .append('rect')
        .attr('width', 15) // 根据需要调整大小
        .attr('height', 15)
        .attr('fill', d => `rgb(${d.color.join(',')})`)
        .style('filter', 'url(#color-drop-shadow)'); // 添加阴影效果

    // 图例文本
    legend.append('div')
        .attr('class', 'legend-text')
        .text(d => `: ${d.count}`);

    // 根据 d.count 降序排列
    legend.sort((a, b) => b.count - a.count);

    // 设置图例颜色块和文本并排显示
    legend.style('display', 'flex')
        .style('align-items', 'center'); // 垂直居中对齐

    // 将图例整体定位到右上角
    d3.select('#colorpieLegend')
        .style('position', 'absolute')
        .style('top', '10px') // 距离顶部 10px
        .style('right', '-20px'); // 距离右侧 10px

}

// 监听 props.colorData的变化
watch(() => props.colorData, (newColorData, oldColorData) => {
    createColorChart(newColorData);
});
</script>
  
<style scoped>
.legend-item {
    margin-bottom: 5px;
}

.legend-color {
    width: 20px;
    height: 20px;
    margin-right: 0px;
}

.legend-text {
    line-height: 20px;
}
</style>