<template>
  <div :id=chartId></div>
  <div :id="props.chartId + 'tooltip'"
    style="position: absolute; visibility: hidden; padding: 10px; background: white; border: 1px solid #42b983;border-radius: 8px;">
  </div>
</template>

<script setup>
import { onMounted, watch, defineProps } from 'vue';
import * as d3 from 'd3';
// 定义 props
const props = defineProps(['categories', 'counts', 'chartId']);

const createRadarChart = (categories, counts) => {
  // 移除旧的SVG如果存在，确保重绘而不是在旧图上绘制
  d3.select(`#${props.chartId} svg`).remove();
  const width = 250;
  const height = 250;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  const svg = d3.select(`#${props.chartId}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left + width / 2},${margin.top + height / 2})`); // 调整g元素的位置

  const maxCount = Math.max(...counts);
  const radius = Math.min(width, height) / 2 - 10;

  const angleSlice = (Math.PI * 2) / categories.length;

  const rScale = d3.scaleLinear().domain([0, maxCount]).range([0, radius]);
  const radarLine = d3.lineRadial()
    .radius(d => rScale(d))
    .angle((d, i) => i * angleSlice);

  const axis = svg.selectAll('.axis').data(categories).enter().append('g').attr('class', 'axis');

  // 添加轴线
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d, i) => rScale(maxCount) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('y2', (d, i) => rScale(maxCount) * Math.sin(angleSlice * i - Math.PI / 2))
    .attr('class', 'radarLine')
    .style('stroke', 'gray') // 设置轴线颜色
    .style('stroke-opacity', 0.6) // 设置轴线透明度
    .style('stroke-width', 1); // 设置轴线宽度

  axis.append('text')
    .attr('class', 'axisLabel')
    .text(d => d)
    .attr('x', (d, i) => rScale(maxCount) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('y', (d, i) => rScale(maxCount) * Math.sin(angleSlice * i - Math.PI / 2))
    .attr('dy', '0.5em')
    .attr('text-anchor', 'middle')
    .on('mouseover', function (event, d) {
      // 显示 tooltip
      d3.select(`#${props.chartId}tooltip`)
        .style('visibility', 'visible')
        .text(`${d}: ${counts[categories.indexOf(d)]}`) // 显示对应的文本和值
        .style('top', (event.pageY - 10) + 'px') // 定位
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function () {
      // 隐藏 tooltip
      d3.select(`#${props.chartId}tooltip`).style('visibility', 'hidden');
    });

  // 定义渐变
  const gradient = svg.append("defs")
    .append("radialGradient")
    .attr("id", `${props.chartId}Gradient`)
    .attr("cx", "20%")
    .attr("cy", "80%")
    .attr("r", "60%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "rgba(66, 185, 131, 0.8)");

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgba(66, 185, 131, 0.3)");

  // 创建路径并使用渐变
  svg.append('path')
    .datum(counts)
    .attr('class', 'radarArea')
    .attr('d', radarLine)
    .attr('fill', `url(#${props.chartId}Gradient)`);
  // 添加同心圆
  const numCircles = 3; // 同心圆的数量
  const circleData = Array.from({ length: numCircles }).map((_, i) => (i + 1) * (maxCount / numCircles));

  const colorScale = d3.scaleLinear()
    .domain([circleData[0], circleData[numCircles - 1]]) // 从内圈到外圈递增
    .range(['rgba(128, 128, 128, 0.1)', 'rgba(128, 128, 128, 0.8)']); // 灰色渐变的颜色范围

  svg.selectAll('.circle')
    .data(circleData)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', d => rScale(d))
    .style('fill', 'none')
    .style('stroke', (d, i) => colorScale(d)) // 根据同心圆的半径选择颜色
    .style('stroke-width', 1);
    
}

// 监听 props.categories 和 props.counts 的变化
watch([() => props.categories, () => props.counts], ([newCategories, newCounts], [oldCategories, oldCounts]) => {
  // 调用 createRadarChart 函数，并传入新的数据
  createRadarChart(newCategories, newCounts);
});

</script>

<style scoped>
.radarArea {
  stroke-width: 2px;
}

.radarLine {
  stroke: #333;
  stroke-width: 1px;
}

.axisLabel {
  font-size: 14px;
}
</style>
