<template>
    <div id="user">
        <div id="lineChart"></div>
    </div>
    <div id="lineChartTooltip"
        style="position: absolute; visibility: hidden; padding: 5px; background: white; border: 1px solid #42b983;border-radius: 8px;">
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, watch, defineProps } from 'vue';
import * as d3 from 'd3';

// 定义 props
const props = defineProps(['userDataHours', 'userDataCounts']);


const createLineChart = (hours, counts) => {
    // 移除旧的DIV如果存在，确保重绘而不是在旧图上绘制
    d3.select("#lineChart").remove();
    // 添加新的 div 元素，设置 id 为 lineChart
    const newDiv = d3.select("#user")
        .append("div")
        .attr("id", "lineChart");

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    const svg = d3.select('#lineChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(hours)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(counts)])
        .range([height, 0]);

    const line = d3.line()
        .x((d, i) => x(hours[i]))
        .y((d, i) => y(counts[i]));

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y));

    svg.append('path')
        .datum(counts)
        .attr('fill', 'none')
        .attr('stroke', "#42b983")
        .attr('stroke-width', 2)
        .attr('d', line);

    // 添加圆点
    svg.selectAll('.dot')
        .data(counts)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d, i) => x(hours[i]))
        .attr('cy', (d) => y(d))
        .attr('r', 5)
        .style('fill', "#9bf1ca")
        .style('stroke', "#42b983")
        .style('stroke-width', "2px")
        .on('mouseover', (event, d) => {
            const tooltip = d3.select('#lineChartTooltip');
            tooltip.html(`Count: ${d}`)
                .style('visibility', 'visible')
                .style('top', event.pageY - 10 + 'px')
                .style('left', event.pageX + 10 + 'px');
        })
        .on('mouseout', () => {
            d3.select('#lineChartTooltip').style('visibility', 'hidden');
        });

    // 添加标签
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height+30)
        .attr('text-anchor', 'middle')
        .text('Time (hours)');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', margin.left / 2 -50)
        .attr('text-anchor', 'middle')
        .text('Event Count');
}

// 监听 props.userData的变化
watch(
    [() => props.userDataHours, () => props.userDataCounts],
    ([newUserDataHours, newUserDataCounts], [oldUserDataHours, oldUserDataCounts]) => {
        createLineChart(newUserDataHours, newUserDataCounts);
    }
);

</script>
  
<style></style>
  