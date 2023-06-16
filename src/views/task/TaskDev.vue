<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { Graph, Shape } from '@antv/x6'
// import { Dnd } from '@antv/x6-plugin-dnd'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Selection } from '@antv/x6-plugin-selection'

// import { Rect } from '@antv/x6/lib/shape'

import CellInfo from './components/CellInfo.vue'

const { Rect, Circle } = Shape

const init = () => {
  const graph = new Graph({
    container: document.getElementById('container'),
    width: 800,
    height: 600,
    background: {
      color: '#fffbe6'
    }
    // autoResize: true
  })

  graph.use(
    new Selection({
      enabled: true,
      multiple: true,
      rubberband: true,
      movable: true,
      showNodeSelectionBox: true
    })
  )

  Graph.registerNode(
    'kafka-node',
    {
      inherit: 'rect',
      width: 100,
      height: 40,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6
        }
      }
    },
    true
  )

  const stencil = new Stencil({
    target: graph,
    title: '====算子=====',
    collapsable: true,
    stencilGraphWidth: 200, //模板画布宽度
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
  const kafkaNode = new Rect({
    shape: 'kafka-node',
    width: 80,
    height: 40,
    label: 'kafka'
  })
  const c1 = new Circle({
    width: 60,
    height: 60,
    attrs: {
      circle: { fill: '#4B4A67', 'stroke-width': 6, stroke: '#FE854F' },
      text: { text: 'ellipse', fill: 'white' }
    }
  })

  const stencilContainer = document.getElementById('left-dragger-nav')
  stencilContainer.appendChild(stencil.container)
  stencil.load([rect1, c1], '输入')
  stencil.load([kafkaNode], '处理')
  stencil.load([c1], '输出')

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

onMounted(init)
</script>

<template>
  <div class="task">
    <CellInfo :cur-cell="curCell"></CellInfo>
    <div class="left-dragger-nav" id="left-dragger-nav"></div>
    <div id="container"></div>
  </div>
</template>

<style lang="less" scoped>
.task {
  display: flex;
  .left-dragger-nav {
    position: relative;
    width: 200px;
  }
}
//.Graph {
//  position: relative;
//  border: 1px solid red;
//  width: 800px;
//}
//.graphBtn {
//  position: absolute;
//  right: 0;
//  bottom: 0;
//}
//.task {
//  display: flex;
//  #left {
//    position: relative;
//    width: 200px;
//    //height: 600px;
//    background-color: blue;
//  }
//  #container {
//    flex: 1;
//    //width: 1200px;
//    //height: 600px;
//    //background-color: lightgray;
//    transform: translateY(500px);
//  }
//}
</style>
