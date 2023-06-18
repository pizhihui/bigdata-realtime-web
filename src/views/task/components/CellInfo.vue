<script setup lang="ts">
import { defineProps, ref, toRefs, watch } from 'vue'
import { inject } from 'vue'

const props = defineProps({
  curCell: Object
})

const { curCell } = toRefs(props)
const cellType = ref('')
const graph = inject('graph')

watch(curCell, (cell) => {
  console.log('cell changed....', cell, cellType)
  cellType.value = '节点'
  // if (!cell) {
  //   cellType.value = ''
  // }
  console.log('cell changed....', cell, cellType)
})

const closeEditForm = () => {
  cellType.value = ''
  // curCell?.value.removeTools()
  // graph.unselect(curCell?.value)
  graph.value.cleanSelection()
  // if (curCell.value) {
  //   curCell.removeTools()
  //   graph.unselect(curCell)
  // }
}
</script>

<template>
  <!--  <div class="cell-info" v-show="cellType">-->
  <div class="cell-info">
    <div class="edit-main-title">
      <h3>此标题</h3>
      <!--      <i class="anticon-close" @click="closeEditForm"></i>-->
      <!--      <close-outlined class="close-icon" @click="closeEditForm" />-->
      <a-button @click="closeEditForm">关闭</a-button>
    </div>
    <h2>CellInfo信息</h2>
  </div>
</template>

<style lang="less" scoped>
.close-icon {
  cursor: pointer;
  font-size: 20px;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
}
</style>
