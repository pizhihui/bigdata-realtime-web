<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { Graph, Shape } from '@antv/x6'
// import { Dnd } from '@antv/x6-plugin-dnd'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Selection } from '@antv/x6-plugin-selection'

// import { Rect } from '@antv/x6/lib/shape'

import CellInfo from './components/CellInfo.vue'
import { Options as GraphOptions } from '@antv/x6/src/graph/options'

const { Rect, Circle } = Shape

class KafkaNode extends Shape.Rect {}
KafkaNode.config({
  inherit: 'rect',
  width: 180,
  height: 50,
  attrs: {
    body: {
      stroke: '#8f8f8f',
      strokeWidth: 1,
      fill: '#fff',
      rx: 6,
      ry: 6
    }
  }
})

const init = () => {
  const graph = new Graph({
    container: document.getElementById('container'),
    width: 800,
    height: 600,
    // 背景色
    background: {
      color: '#F2F7FA'
    },
    // 画布平移
    panning: true,
    // 画布缩放
    // mousewheel: {
    //   enabled: true,
    //   modifiers: ['ctrl', 'meta']
    // },
    // 背景
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        {
          color: '#eee', // 主网格线颜色
          thickness: 1 // 主网格线宽度
        },
        {
          color: '#ddd', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4 // 主次网格线间隔
        }
      ]
    },
    // 自动
    autoResize: true
  } as GraphOptions)

  graph.use(
    new Selection({
      enabled: true,
      multiple: false,
      rubberband: false,
      movable: true,
      showNodeSelectionBox: true
    })
  )

  Graph.registerNode('kafka-node', KafkaNode, true)

  const stencil = new Stencil({
    target: graph,
    title: '====算子=====',
    collapsable: true,
    stencilGraphWidth: 300, //模板画布宽度
    stencilGraphHeight: 180, //模板画布高度
    groups: [
      {
        name: '输入'
      },
      {
        name: '处理'
      },
      {
        name: '输出'
      }
    ]
  })

  const rect1 = new Rect({
    shape: 'rect',
    width: 80,
    height: 40
  })
  const c1 = new Circle({
    width: 60,
    height: 60,
    attrs: {
      circle: { fill: '#4B4A67', 'stroke-width': 2, stroke: '#FE854F' },
      text: { text: 'ellipse', fill: 'white' }
    }
  })

  const kfkN2 = graph.createNode({
    shape: 'kafka-node',
    width: 180,
    height: 50,
    label: 'kafka'
  })

  const stencilContainer = document.getElementById('left-dragger-nav')
  stencilContainer.appendChild(stencil.container)
  stencil.load([rect1, c1], '输入')
  stencil.load([kfkN2], '处理')
  stencil.load([kfkN2], '输出')

  graph.on('cell:selected', ({ cell }) => {
    console.log('cell.selected....', cell)
    curCell.value = cell
  })

  graph.on('node:selected', ({ node }) => {
    console.log('node.selected....', node)
  })

  graph.on('blank:click', ({ e, x, y }) => {
    console.log('blank.click.....', e, x, y)
    curCell.value = null
  })

  graph.on('cell:mouseenter', ({ cell }) => {
    if (cell.isNode()) {
      cell.addTools([
        {
          name: 'boundary',
          args: {
            padding: 5,
            // 是否使用几何计算的方式来计算元素包围盒，开启后会有性能上的提升，如果出现计算准度问题，请将它设置为 false
            useCellGeometry: true,
            attrs: {
              fill: '#7c68fc',
              stroke: '#333',
              'stroke-width': 1,
              'fill-opacity': 0.2
            }
          }
        },
        {
          name: 'button-remove',
          args: {
            x: 0,
            y: 0,
            offset: { x: 10, y: 10 }
          }
        }
      ])
    } else {
      cell.addTools(['vertices', 'segments'])
    }
  })

  graph.on('cell:mouseleave', ({ cell }) => {
    cell.removeTools()
  })
}
const curCell = ref({})
curCell.value = ''
onMounted(init)
</script>

<template>
  <div class="task">
    <div class="left-dragger-nav" id="left-dragger-nav"></div>
    <div class="center-container" id="container"></div>
    <div class="right-cell-info">
      <CellInfo class="right-cell-info" :cur-cell="curCell"></CellInfo>
    </div>
  </div>
</template>

<style lang="less" scoped>
.task {
  display: flex;
  padding-left: 5px;
  .left-dragger-nav {
    position: relative;
    width: 300px;
  }
  .center-container {
    width: 100%;
    height: 100%;
  }
  .right-cell-info {
    width: 100px;
  }
}
</style>
