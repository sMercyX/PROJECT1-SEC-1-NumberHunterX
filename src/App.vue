<script setup>
import { ref } from 'vue'

const refreshPage = () => {
  location.reload() // Reloads the current page
}

const missed = ref(0)
//style
const blockStyle = 'hanjie-cell'
const noneBorder = 'row-number'
const halfBlock = 'hanjie-cell-half'
const correct = 'MediumSeaGreen'
const unCorrect = '#f87171'

//block stores row and column of table
const blocks = []
//rows stores row name of table
const rows = ['t', '0', '1', '2', '3', '4', '5']
//columns stores column name of table
const columns = ['0', 'a', 'b', 'c', 'd', 'e', '99']

//to stores row and column to blocks
rows.forEach((ele) => {
  blocks.push({ row: ele, column: [...columns] }) //use spread to easy copy data without reference
})
console.log(blocks) //log to show result of block

//result of above
// blocks = [
//   {
//     row: '0',
//     column: ['0', 'a', 'b', 'c', 'd', 'e', '99'],
//   },
//   {
//     row: '1',
//     column: ['0', 'a', 'b', 'c', 'd', 'e', '99'],
//   },
//   {
//     row: '2',
//     column: ['0', 'a', 'b', 'c', 'd', 'e', '99'],
//   },
//   {
//     row: '3',
//     column: ['0', 'a', 'b', 'c', 'd', 'e', '99'],
//   },
//   {
//     row: '4',
//     column: ['0', 'a', 'b', 'c', 'd', 'e', '99'],
//   },
//   {
//     row: '5',
//     column: ['0', 'a', 'b', 'c', 'd', 'e', '99'],
//   },
// ]

//correctBlock stores block that when click its will change to correct color
const correctBlock = [
  'a1',
  'b1',
  'e1',
  'a2',
  'b2',
  'c3',
  'a4',
  'b4',
  'c4',
  'a5',
  'b5',
  'c5',
  'd5',
]

//checkHeaderStyle is use for checking that block is header or not to custom style
const checkHeaderStyle = (id) => {
  if (id.includes('0')) return `${halfBlock} ${noneBorder}`
  if (id.includes('t')) return `${halfBlock} ${noneBorder}`
  if (id.includes('99')) return `${blockStyle} ${noneBorder}`
  return blockStyle
}
const checkTR = (id) => {
  if (id.includes('0'))
    return `
  height: 30px;`
  if (id.includes('t'))
    return `
  height: 30px;`
}

//headerNums stores id and result of block of table head
const headerNums = [
  {
    id: 'at',
    result: '2',
  },
  {
    id: 'bt',
    result: '2',
  },
  {
    id: 'a0',
    result: '2',
  },
  {
    id: 'b0',
    result: '2',
  },
  {
    id: 'c0',
    result: '3',
  },
  {
    id: 'd0',
    result: '1',
  },
  {
    id: 'e0',
    result: '1',
  },
  {
    id: '01',
    result: '2  1',
  },
  {
    id: '02',
    result: '2',
  },
  {
    id: '03',
    result: '1',
  },
  {
    id: '04',
    result: '3',
  },
  {
    id: '05',
    result: '4',
  },
]

const checkHeader = (id) => {
  const index = headerNums.findIndex((num) => num.id === id) //checking id in array of header numbers to find result
  return index >= 0 ? headerNums[index].result : ''
}

//addClickers is use to adding click to only block that should be (block that have a line)
const addClickers = (id) => {
  if (!id.includes('0') && !id.includes('99')&& !id.includes('t')) {
    console.log(id)
    const blockColor = correctBlock.includes(id) ? correct : unCorrect
    const targetBlock = document.getElementById(id)
    targetBlock.style.backgroundColor = blockColor
    if (blockColor == unCorrect) {
      targetBlock.textContent = 'x'
      missed.value++
    }
  }
}
</script>

<template>
  <div class="container p-10 m-auto">
    <div class="header pb-2 flex justify-center">
      <div class="mb-4 text-4xl font-extrabold">NUMBER HUNTER</div>
    </div>
    <button
      class="btn btn-outline btn-primary"
      type="reset"
      @click="refreshPage()"
    >
      RESET
    </button>
    <div class="join flex justify-center">
      <table class="hanjie-table">
        <tr
          v-for="block in blocks"
          :key="block.row"
          :id="block.row"
          :style="checkTR(block.row)"
        >
          <td
            :class="checkHeaderStyle(col + block.row)"
            v-for="col in block.column"
            :key="col + block.row"
            :id="col + block.row"
            @click="addClickers(col + block.row)"
          >
            {{ checkHeader(col + block.row) }}
          </td>
        </tr>
      </table>
    </div>

    <div class="btm-text flex justify-center content-around">
      <div class="collapse">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium justify-start">
          Hint :
        </div>
        <div class="collapse-content hidden-hint">
          <p>hide hint</p>
        </div>
      </div>

      <div class="text-xl font-medium justify-items-end">
        Miss : {{ missed }}
      </div>
    </div>

    <div class="join pagination flex justify-center">
      <button class="join-item btn">«</button>
      <button class="join-item btn">Level 1</button>
      <button class="join-item btn">»</button>
    </div>
  </div>
</template>

<style scoped>
.hanjie {
  border-collapse: collapse;
  margin: 20px;
}

.hanjie-cell {
  width: 70px;
  height: 70px;
  border: 1px solid #000;
  text-align: center;
}
.hanjie-cell-half {
  width: 70px;
  height: 30px;
  border: 1px solid #000;
  text-align: center;
  padding-bottom: 10px;
}
.filled {
  background-color: #000;
}

.col-number,
.row-number,
.none {
  border: none;
}
</style>
