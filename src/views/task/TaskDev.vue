<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'

import { Graph, Shape } from '@antv/x6'
import { Dnd } from '@antv/x6-plugin-dnd'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Selection } from '@antv/x6-plugin-selection'

// import { Rect } from '@antv/x6/lib/shape'

import CellInfo from './components/CellInfo.vue'
import { Options as GraphOptions } from '@antv/x6/src/graph/options'

import KafkaNode from '@/views/task/kafkaNode'
import ClickHouseNode from '@/views/task/ClickHouseNode'

const { Rect, Circle } = Shape

const dragSource = () => {
  // console.log('dra.source....', e)
}

const dragMouseDown = (e) => {
  const target = e.currentTarget
  const type = target.getAttribute('data-type')
  console.log('mouse.down.....', type)
  const kNode = graph.value.createNode({
    shape: type,
    width: 180,
    height: 50,
    label: 'kafka'
  })
  dnd.value.start(kNode, e)
}

const drop = (e) => {
  console.log('drop.....', e)
  const ev = e as DragEvent
  graph.value.addNode({
    shape: 'kafka-node',
    width: 90,
    height: 40,
    label: 'kafka',
    x: ev.offsetX,
    y: ev.offsetY
  })
}

const changePortsVisible = (node, visible) => {
  const ports = document.querySelectorAll(
    `g[data-cell-id="${node.id}"] .x6-port-body`
  ) as NodeListOf<HTMLElement>
  ports.forEach((port) => {
    port.style.visibility = visible ? 'visible' : 'hidden'
  })
}

const graph = ref({})
const dnd = ref({})

const init = () => {
  graph.value = new Graph({
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

  graph.value.use(
    new Selection({
      enabled: true,
      multiple: false,
      rubberband: false,
      movable: true,
      showNodeSelectionBox: true
    })
  )

  dnd.value = new Dnd({
    target: graph.value
  })

  Graph.registerNode('kafka-node', KafkaNode, true)
  Graph.registerNode('clickhouse-node', ClickHouseNode, true)

  const stencil = new Stencil({
    target: graph.value,
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
    ],
    layoutOptions: {
      columns: 2,
      columnWidth: 80,
      rowHeight: 55
    }
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

  const kfkN2 = graph.value.createNode({
    shape: 'kafka-node',
    width: 180,
    height: 50,
    label: 'kafka'
  })

  // const stencilContainer = document.getElementById('left-dragger-nav')
  // stencilContainer.appendChild(stencil.container)
  // stencil.load([rect1, c1], '输入')
  // stencil.load([kfkN2], '处理')
  // stencil.load([kfkN2], '输出')

  graph.value.on('cell:selected', ({ cell }) => {
    console.log('cell.selected....', cell)
    curCell.value = cell
    let removeBtnCfg
    if (cell.isEdge()) {
      cell.attr('line', { stroke: 'skyblue', strokeWidth: 3 })
      removeBtnCfg = { distance: '30%' }
    }
    if (cell.isNode()) {
      const cellView = graph.value.findView(cell)
      console.log('cell:selected.......', cellView)
      // cellView.addClass(`${cell.shape}-selected`)
      cellView.addClass('kafka-node-selected')
      removeBtnCfg = { x: 0, y: 0, offset: { x: -5, y: -5 } }
    }
    cell.addTools({
      name: 'button-remove', // 工具名称
      args: removeBtnCfg // 工具对应的参数
    })
  })

  graph.value.on('cell:unselected', ({ cell }) => {
    // const instance = getCurrentInstance()
    // instance.ctx.curCell = null
    if (cell.isEdge()) {
      cell.attr('line', { stroke: '#808080', strokeWidth: 1 })
    } else {
      const cellView = graph.value.findView(cell)
      cellView && cellView.removeClass(`${cell.shape}-selected`)
    }
    cell.removeTools()
  })

  graph.value.on('node:selected', ({ node }) => {
    console.log('node.selected....', node)
  })

  graph.value.on('blank:click', ({ e, x, y }) => {
    console.log('blank.click.....', e, x, y)
    curCell.value = null
  })

  graph.value.on('node:mouseenter', ({ node }) => {
    changePortsVisible(node, true)
    // if (cell.isNode()) {
    //   cell.addTools([
    //     {
    //       name: 'boundary',
    //       args: {
    //         padding: -1,
    //         // 是否使用几何计算的方式来计算元素包围盒，开启后会有性能上的提升，如果出现计算准度问题，请将它设置为 false
    //         useCellGeometry: true,
    //         attrs: {
    //           fill: '#7c68fc',
    //           stroke: '#333',
    //           'stroke-width': 0,
    //           'fill-opacity': 0.2
    //         }
    //       }
    //     },
    //     {
    //       name: 'button-remove',
    //       args: {
    //         x: 0,
    //         y: 0,
    //         offset: { x: -1, y: -1 }
    //       }
    //     }
    //   ])
    //
    //   changePortsVisible(cell, true)
    // } else {
    //   cell.addTools(['vertices', 'segments'])
    // }
  })

  graph.value.on('node:mouseleave', ({ node }) => {
    console.log('node.mouseleave.....', node)
    // node.removeTools()
    changePortsVisible(node, false)
  })
}
const curCell = ref({})
curCell.value = ''
onMounted(init)
provide('graph', graph)
</script>

<template>
  <div class="task">
    <!-- <div class="left-dragger-nav" id="left-dragger-nav"></div> -->
    <div class="left-dragger-nav">
      <!-- 目标 -->
      <div class="left-dragger-row">
        <p class="left-dragger-title">数据源</p>
        <div class="left-dragger-body">
          <div
            class="left-dragger-item kafka-node"
            @mousedown="dragMouseDown"
            data-type="kafka-node"
          ></div>
        </div>
      </div>

      <!-- 目标 -->
      <div class="left-dragger-row">
        <p class="left-dragger-title">算子</p>
        <div class="left-dragger-body">
          <div
            class="left-dragger-item kafka-node"
            @mousedown="dragMouseDown"
            data-type="sink-hbase"
          ></div>
        </div>
      </div>

      <!-- 目标 -->
      <div class="left-dragger-row">
        <p class="left-dragger-title">存储</p>
        <div class="left-dragger-body">
          <div
            class="left-dragger-item clickhouse-node"
            @mousedown="dragMouseDown"
            data-type="clickhouse-node"
          ></div>
        </div>
      </div>
    </div>
    <!--<div class="center-container" id="container" @drop="drop($event)" @dragover.prevent></div>-->
    <div class="center-container" id="container"></div>
    <CellInfo class="right-cell-info" :cur-cell="curCell"></CellInfo>
    <!--    <div class="right-cell-info">-->
    <!--      <CellInfo class="right-cell-info" :cur-cell="curCell"></CellInfo>-->
    <!--    </div>-->
  </div>
</template>

<style lang="less">
.kafka-node-selected {
  rect {
    fill: #ffdfc4;
    stroke-width: 2;
  }
}
.x6-widget-selection-box {
  border: 0px solid #feb663;
}

.task {
  display: flex;
  width: 100%;
  height: 100vh;
  // box-sizing: border-box;
  padding: 0 5px;
  .left-dragger-nav {
    border: 1px solid slategray;
    //position: relative;
    width: 300px;
    height: 100%;
    .left-dragger-row {
      .left-dragger-title {
        text-align: center;
        font-size: 16px;
        color: #333;
        padding: 15px 10px;
        border-bottom: 1px solid #ccc;
        font-weight: bold;
      }
      .left-dragger-body {
        padding: 0 23px;
        display: flex;
        .kafka-node {
          background: url('@/assets/kafka-logo.png') no-repeat center / 60px 30px;
        }
        .clickhouse-node {
          background: url('@/assets/ch_logo_docs.svg') no-repeat center / 90px 50px;
        }
        .left-dragger-item {
          display: inline-block;
          border: 1px solid #8f8f8f;
          background-color: #f2f2f2;
          border-radius: 3px;
          color: #333;
          width: 92px;
          height: 40px;
          line-height: 40px;
          font-size: 13px;
          text-align: center;
          cursor: pointer;
          margin-right: 10px;
        }
      }
    }
  }
  .center-container {
    // box-sizing: border-box;
    margin-left: 2px;
    border: 1px solid slategray;
    width: 100%;
    height: 100%;
  }
  .right-cell-info {
    margin-left: 2px;
    border: 1px solid slategray;
    //position: relative;
    //right: 0;
    //top: 0;
    height: 100%;
    width: 20%;
    min-width: 300px;
    //border-left: 1px solid #f2f2f2;
    padding: 20px;
    background: #f2f2f2;
    //box-sizing: border-box;
    //box-shadow: -10px 0 10px 0 rgba(0, 0, 0, 0.3);
  }
}
</style>
