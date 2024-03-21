<template>
    <main>
        <h4>欢迎使用</h4>
        <!-- <div>
            <ColorPieChart />
        </div> -->
    </main>
</template>

<script setup>
import ColorPieChart from './charts/colorPieChart.vue';
</script>
<style>
main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
}

h4 {
    color: #42b983;
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 200;
    line-height: 1.2rem;
    margin: 2rem auto;
}
</style>