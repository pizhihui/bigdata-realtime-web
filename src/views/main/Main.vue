<script setup lang="ts">
import useCounterStore from '@/router/counter'
const counterStore = useCounterStore()
function changeCounter() {
  counterStore.changeCounterAction(999)
}
</script>

<template>
  <div class="main">
    <h2>main 页面,计算: {{ counterStore.couter }} - {{ counterStore.doubleCounter }}</h2>
    <button @click="changeCounter">修改 counter</button>
  </div>
</template>

<style scoped></style>
