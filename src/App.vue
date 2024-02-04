<script setup>
import { ref } from 'vue'

// const refreshPage = () => {
//   location.reload() // Reloads the current page
// }

const start = ref(false)

const missed = ref(0)
const hintsLeft = ref(3)

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
//checked blocks array
const checked = []
const win = ref(false)
const mins = ref(0)
const secs = ref(0)

//to stores row and column to blocks
rows.forEach((ele) => {
  blocks.push({ row: ele, column: [...columns] }) //use spread to easy copy data without reference
})

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

//level
const level = [
  {
    correctBlock: [
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
    ],
    headerNums: [
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
    ],
  },
  {
    correctBlock: [
      'c1',
      'd1',
      'e1',
      'a2',
      'c2',
      'd2',
      'e2',
      'a3',
      'e3',
      'a4',
      'b4',
      'e4',
      'a5',
    ],
    headerNums: [
      {
        id: 'a0',
        result: '4',
      },
      {
        id: 'b0',
        result: '1',
      },
      {
        id: 'c0',
        result: '2',
      },
      {
        id: 'd0',
        result: '2',
      },
      {
        id: 'e0',
        result: '4',
      },
      {
        id: '01',
        result: '3',
      },
      {
        id: '02',
        result: '1  3',
      },
      {
        id: '03',
        result: '1  1',
      },
      {
        id: '04',
        result: '2  1',
      },
      {
        id: '05',
        result: '1',
      },
    ],
  },
]

const currentLevel = ref(1)

//correctBlock stores block that when click its will change to correct color
const correctBlock = ref(level[currentLevel.value - 1].correctBlock)

const hints = ref([])
let hintable = ref(true)

function checkHintable() {
  let checkedCorrect = checked.filter((tile) => {
    return correctBlock.value.includes(tile)
  })
  let hintAndChecked = hints.value.concat(checkedCorrect)
  if (hintAndChecked.length >= correctBlock.value.length) {
    hintable.value = false
  }
}

// function restartGame(){
//   // start.value = false
//   // checked.splice(0, checked.length)
//   // missed.value = 0
//   // win.value = false
//   // mins.value = 0
//   // secs.value = 0
//   // clearInterval(timerInterval)1
//   currentLevel.value = 1
// }

function restartGame(){
  resetGame()
  currentLevel.value = 1
  correctBlock.value = level[currentLevel.value - 1].correctBlock
  headerNums.value = level[currentLevel.value - 1].headerNums
  checked.splice(0, checked.length)
  resetBlockStyles()
  startGame()
}

const genHint = () => {
  console.log('ooo')
  if (!start.value) {
    return;
  }
  let randomIndex;
  if (hintsLeft.value <= 0 || !hintable.value) {
    return;
  }
  while (true) {
    randomIndex = Math.floor(Math.random() * correctBlock.value.length);
    if (
      !checked.includes(level[currentLevel.value -1].correctBlock[randomIndex]) &&
      !hints.value.includes(level[currentLevel.value - 1].correctBlock[randomIndex])
    ) {
      hintsLeft.value--;
      hints.value.push(level[currentLevel.value - 1].correctBlock[randomIndex]);
      checkHintable();
      return;
    }
  }
};


function startGame() {
  start.value = true
  timer(true)
}

function resetGame() {
  start.value = false
  checked.splice(0, checked.length)
  win.value = false
  clearInterval(timerInterval)
}

const resetBlockStyles = () => {
  const allBlocks = document.querySelectorAll(".hanjie-cell")
  allBlocks.forEach((block) => {
    block.style.backgroundColor = ""
    block.style.cursor = "pointer"
    block.textContent = ''
  });
};

// function prevLevel() {
//   currentLevel.value-- 
//   if (currentLevel.value - 1 >= 0) {
//     correctBlock.value = level[currentLevel.value - 1].correctBlock
//     headerNums.value = level[currentLevel.value - 1].headerNums
//     checked.splice(0, checked.length)
//     resetBlockStyles()
//   } else {
//     alert('You are at the first level!')
//     resetGame()
//     currentLevel.value = 1
//   }
// }

function nextLevel() {
  currentLevel.value++
  if (currentLevel.value - 1 < level.length) {
    correctBlock.value = level[currentLevel.value - 1].correctBlock
    headerNums.value = level[currentLevel.value - 1].headerNums
    
    resetGame()
    resetBlockStyles()
    startGame()
  } else {
    alert('Congratulation! You have finished all levels!')
    resetGame()
  }
}

let timerInterval

// onMounted(() => {
//   timer(true);
// });

function timer(op) {
  if (op) {
    timerInterval = setInterval(() => {
      if (secs.value >= 59) {
        mins.value++
        secs.value = 0
        return
      } else {
        secs.value++
      }
    }, 1000)
  } else {
    if (timerInterval === undefined) {
      return
    } else {
      clearInterval(timerInterval)
    }
  }
}

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
const headerNums = ref(level[currentLevel.value - 1].headerNums)

const checkHeader = (id) => {
  const index = headerNums.value.findIndex((num) => num.id === id) //checking id in array of header numbers to find result
  return index >= 0 ? headerNums.value[index].result : ''
}

//addClickers is use to adding click to only block that should be (block that have a line)
const addClickers = (event) => {
  if (!start.value) {
    return
  }
  let targetTile = event.target //tile clicked
  let id = targetTile.id //clicked tile id
  let targetClasses = targetTile.className.split(' ') //split class into array
  if (checked.includes(id) || targetClasses.includes('marked')) {
    return
  }
  if (!id.includes('0') && !id.includes('99') && !id.includes('t')) {
    const blockColor = correctBlock.value.includes(id) ? correct : unCorrect
    const targetBlock = document.getElementById(id)
    targetBlock.style.backgroundColor = blockColor
    if (blockColor === unCorrect) {
      targetBlock.textContent = 'x'
      missed.value++
    }
    checked.push(id)
    if (blockColor === correct) {
      checkHintable()
    }
    if (checkWin()) {
      timer(false)
    }
  }
}

function mark(event) {
  if (!start.value) {
    return
  }
  event.preventDefault()
  let targetTile = event.target //tile clicked
  let targetTileId = targetTile.id //clicked tile id
  let targetClasses = targetTile.className.split(' ') //split class into array
  if (checked.includes(targetTileId)) {
    //if already checked, return
    return
  }
  if (targetClasses.includes('marked')) {
    //remove marked class from the tile
    let markToRm = targetClasses.findIndex((tileClass) => {
      return tileClass === 'marked'
    })
    targetClasses.splice(markToRm, 1)
    targetTile.className = targetClasses.join(' ')
    targetTile.style.backgroundColor = 'white'
    return
  }
  targetClasses.push('marked')
  targetTile.className = targetClasses.join(' ')
  targetTile.style.backgroundColor = 'grey'
}

function checkWin() {
  let winTemp = true
  correctBlock.value.forEach((mustCheckCell) => {
    if (!checked.includes(mustCheckCell)) {
      winTemp = false
    }
  })
  // console.log(winTemp);
  win.value = winTemp
  if (winTemp &&  currentLevel.value - 1 === level.length){
    timer(false)
  }
  return winTemp
}
</script>

<template>
  <div class="container p-10 m-auto">
    <div class="header pb-2 flex justify-center">
      <div class="mb-4 text-4xl font-extrabold">NUMBER HUNTER</div>
    </div>
    <button
      v-if="!start"
      class="btn btn-outline btn-primary"
      type="button"
      @click="startGame()"
    >
      START
    </button>
    <button
      v-if="start"
      class="btn btn-outline btn-primary"
      type="reset"
      @click="restartGame()"
    >
      RESTART
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
            @click="addClickers"
            @click.right="mark"
          >
            {{ checkHeader(col + block.row) }}
          </td>
        </tr>
      </table>
    </div>

    <div class="btm-text flex justify-center content-around">
      <div class="collapse">
        <div class="text-xl font-medium justify-start">
          Hint Left: {{ hintsLeft }}
          <button
            :class="hintsLeft > 0 && hintable ? 'bg-rose-500' : 'bg-slate-600'"
            :disabled="hintsLeft > 0 ? false : true"
            @click="genHint"
          >
            get Hint
          </button>
        </div>
        <div v-if="hints.length > 0" class="justify-center">
          <b v-for="(hint, index) in hints" :key="hint"
            >{{ hint }}<b v-if="index < hints.length - 1">, </b></b
          >
        </div>
      </div>

      <div class="text-xl font-medium justify-items-end">
        Miss : {{ missed }}
      </div>
    </div>

    <div>
      Time: <span v-if="mins < 10">0</span>{{ mins }} :
      <span v-if="secs < 10">0</span>{{ secs }}
    </div>

    <div class="join pagination flex justify-center">
      <!-- <button class="join-item btn" @click="prevLevel">«</button> -->
      <button class="join-item btn">Level {{ currentLevel }}</button>
      <button v-if="win" class="join-item btn" @click="nextLevel">»</button>
    </div>

    <div v-if="win">Stage cleared!!!</div>
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
