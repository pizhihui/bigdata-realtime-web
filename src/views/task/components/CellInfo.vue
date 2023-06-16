<script setup lang="ts">
import { defineProps, ref, toRefs, watch } from 'vue'

const props = defineProps({
  curCell: Object
})

const { curCell } = toRefs(props)
const cellType = ref('')

watch(curCell, (cell) => {
  console.log('cell changed....', cell, cellType)
  cellType.value = '节点'
  if (!cell) {
    cellType.value = ''
  }
  console.log('cell changed....', cell, cellType)
})
</script>

<template>
  <div class="cell-info" v-show="cellType">
    <h2>CellInfo信息</h2>
  </div>
</template>

<style lang="less" scoped></style>
