<script setup lang="ts">
import { getCurrentInstance, onMounted, provide, ref } from "vue";

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
  },
  ports: {
    items: [
      { group: 'in', id: 'p_top' },
      { group: 'right-out', id: 'p_right' },
      { group: 'bottom-out', id: 'p_bottom' },
      { group: 'left-out', id: 'p_left' }
    ],
    groups: {
      in: {
        position: 'top',
        zIndex: 1,
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      },
      'bottom-out': {
        position: 'bottom',
        zIndex: 1,
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      },
      'right-out': {
        position: 'right',
        zIndex: 20,
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      },
      'left-out': {
        position: 'left',
        zIndex: 20,
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      }
    }
  }
})

const changePortsVisible = (node, visible) => {
  const ports = document.querySelectorAll(
    `g[data-cell-id="${node.id}"] .x6-port-body`
  ) as NodeListOf<HTMLElement>
  ports.forEach((port) => {
    port.style.visibility = visible ? 'visible' : 'hidden'
  })
}

const graph = ref({})

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

  Graph.registerNode('kafka-node', KafkaNode, true)

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
    width: 90,
    height: 40,
    label: 'kafka'
  })

  const stencilContainer = document.getElementById('left-dragger-nav')
  stencilContainer.appendChild(stencil.container)
  stencil.load([rect1, c1], '输入')
  stencil.load([kfkN2], '处理')
  stencil.load([kfkN2], '输出')

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
    <div class="left-dragger-nav" id="left-dragger-nav"></div>
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
  box-sizing: border-box;
  padding: 5px;
  .left-dragger-nav {
    border: 1px solid slategray;
    position: relative;
    width: 300px;
    height: 100%;
  }
  .center-container {
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
