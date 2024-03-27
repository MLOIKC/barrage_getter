<template>
    <div class="danmudetail">
        <div v-if="danmuDetail.type === 'Beg'">
            <span style="color: black;">当前已使用的方法为：</span>
            <span style="color: #42b983;">初级版</span>
        </div>
        <div v-else-if="danmuDetail.type === 'Int'">
            <span style="color: black;">当前已使用的方法为：</span>
            <span style="color: #42b983;">中级版</span>
        </div>
        <div v-else-if="danmuDetail.type === 'Adv'">
            <span style="color: black;">当前已使用的方法为：</span>
            <span style="color: #42b983;">高级版</span>
        </div>
    </div>
    <div class="danmudetail">
        <div v-if="danmuDetail.type === 'Beg'">
            <span style="color: black;">当前获取的视频标题为：</span>
            <span style="color: #42b983;">{{ danmuDetail.data }}</span>
        </div>
        <div v-else-if="danmuDetail.type === 'Int'">
            <span style="color: black;">当前获取的视频BV号为：</span>
            <span style="color: #42b983;">{{ danmuDetail.data }}</span>
        </div>
        <div v-else-if="danmuDetail.type === 'Adv'">
            <span style="color: black;">当前获取的视频BV号为：</span>
            <span style="color: #42b983;">{{ danmuDetail.data }}</span>
        </div>
    </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex';

const store = useStore();

// 使用 computed 创建计算属性，保持与 store.state.danmuDetail 的同步
const danmuDetail = computed(() => store.state.danmuDetail);

</script>

<style>
.danmudetail {
    color: #42b983;
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 200;
    text-align: left;
}
</style>