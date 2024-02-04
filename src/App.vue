<script setup>
import { onMounted, ref, toRaw } from 'vue'
// const refreshPage = () => {
//   location.reload() // Reloads the current page
// }
const start = ref(false)

const missed = ref(0)
//hint
const hintsLeft = ref(300)
let hints = ref([])
let hintable = ref(false)
// const timer = ref(0)

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
///times
const mins = ref(0)
const secs = ref(0)
//levels
const currentLv = ref(0)
//to stores row and column to blocks
rows.forEach((ele) => {
  blocks.push({ row: ele, column: [...columns] }) //use spread to easy copy data without reference
})

//level
import level from './level.json'

//correctBlock stores block that when click its will change to correct color
let correctBlock = level[currentLv.value].correctBlock
//headerNums stores id and result of block of table head
let headerNums = level[currentLv.value].headerNums

let timerInterval

function startGame() {
  start.value = true
  timer(true)
  if (hintsLeft.value >= 0) {
    hintable.value = true
  }
}

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
//reset block style
const resetBlockStyles = () => {
  const allBlocks = document.querySelectorAll('.hanjie-cell')
  allBlocks.forEach((block) => {
    block.style.backgroundColor = 'rgba(251,247,245,255)'
    // block.style.cursor = 'pointer'
    block.textContent = ''
  })
}
function resetGame() {
  start.value = false
  checked.splice(0)
  win.value = false
  clearInterval(timerInterval)
  correctBlock = level[currentLv.value].correctBlock
  headerNums = level[currentLv.value].headerNums
  hints.value = []
}

function nextLevel() {
  currentLv.value++
  if (currentLv.value < level.length) {
    resetGame()
    resetBlockStyles()
    startGame()
    win.value = false
  } else {
    alert('Congratulation! You have finished all levels!')
    currentLv.value = 0
    resetBlockStyles()
    resetGame()
  }
}
function checkHintable() {
  let checkedCorrect = checked.filter((tile) => {
    return correctBlock.includes(tile)
  })
  // let hintAndChecked = hints.value.concat(checkedCorrect)
  // console.log(hintAndChecked)
  // if (checked.length >= correctBlock.length) {
  //   hintable.value = false
  // }
  if (hintsLeft.value <= 0) {
    hintable.value = false
  }
  if (checkedCorrect.length === correctBlock.length) {
    hintable.value = false
  }
}

//timer
// setInterval(() => {
//   timer.value = timer.value+1
// }, 1000)
const playCellElements = ref(null)
const genHint = () => {
  let randomIndex
  if (hintsLeft.value <= 0 || !hintable.value) {
    return
  }
  while (true) {
    randomIndex = Math.floor(Math.random() * correctBlock.length)
    if (
      !checked.includes(correctBlock[randomIndex]) && //หาตัวที่ยังไม่ถูกกด
      !hints.value.includes(correctBlock[randomIndex]) //และไม่ซ้ำกับ hint ที่กดไปแล้ว
    ) {
      hintsLeft.value--
      hints.value.push(correctBlock[randomIndex])
      console.log(checked)
      let press4U = toRaw(playCellElements.value).find(
        (cellDom) => cellDom.id === correctBlock[randomIndex]
      )
      press4U.dispatchEvent(new Event('click'))
      checkHintable()
      // checkWin()
      return
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

const checkHeader = (id) => {
  const index = headerNums.findIndex((num) => num.id === id) //checking id in array of header numbers to find result
  return index >= 0 ? headerNums[index].result : ''
}

//addClickers is use to adding click to only block that should be (block that have a line)
const addClickers = (event) => {
  if (!start.value || win.value) {
    return
  }
  let targetTile = event.target //tile clicked
  let id = targetTile.id //clicked tile id
  let targetClasses = targetTile.className.split(' ') //split class into array
  if (checked.includes(id) || targetClasses.includes('marked')) {
    return
  }
  if (!id.includes('0') && !id.includes('99') && !id.includes('t')) {
    const blockColor = correctBlock.includes(id) ? correct : unCorrect
    const targetBlock = targetTile
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
  event.preventDefault()
  let targetTile = event.target //tile clicked
  let targetTileId = targetTile.id //clicked tile id
  let targetClasses = targetTile.className.split(' ') //split class into array
  if (
    !targetTileId.includes('0') &&
    !targetTileId.includes('99') &&
    !targetTileId.includes('t')
  ) {
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
}

function checkWin() {
  let winTemp = true
  correctBlock.forEach((mustCheckCell) => {
    if (!checked.includes(mustCheckCell)) {
      winTemp = false
    }
  })
  console.log(winTemp)
  win.value = winTemp
  return winTemp
}

const show = ref(false)
</script>

<template>
  <div class="header pb-2 flex justify-center py-3">
    <div class="mb-4 text-4xl font-extrabold">NUMBER HUNTER</div>
  </div>

  <!--main tutorial-->
  <div class="tutorial flex" v-show="!show">
    <div class="tutorials px-4 py-2 m-2 center">
      <h1 class="text-center text-2xl font-bold">tutorials</h1>
      <h2>I think should have some picture</h2>
      <br /><br /><br /><br />
      <h2 class="p-20">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
        temporibus, cum harum natus ea dicta sequi accusantium ducimus voluptas
        deserunt eaque, earum eos. Similique, architecto. Ullam debitis error
        ipsa unde? Numquam doloribus dolorem aspernatur libero eligendi ab
        molestias, dolor rem sunt suscipit nihil, totam, ut nulla quae commodi!
        Quod a vero tempore atque! Perspiciatis, eum nisi quas nihil tempore
        totam!
      </h2>
    </div>
    <button @click="show = !show" class="btn btn-success text-white">
      Play Game
    </button>
  </div>

  <div class="container p-10 m-auto w-full" v-show="show">
    <section class="flex items-center justify-between">
      <button
        v-if="!start"
        class="btn btn-outline btn-primary"
        type="button"
        @click="startGame()"
      >
        <img src="./assets/play-button.png" class="h-7" />
        Start
      </button>
      <div v-show="start">
        Time : <span v-if="mins < 10">0</span>{{ mins }} :
        <span v-if="secs < 10">0</span>{{ secs }}
      </div>
      <button v-if="win" class="join-item btn" @click="nextLevel">
        NEXT LEVEL
      </button>
    </section>

    <!--Table-->
    <div class="join flex justify-center">
      <table class="hanjie-table">
        <tr
          v-for="block in blocks"
          :key="block.row"
          :id="block.row"
          :style="checkTR(block.row)"
        >
          <td
            ref="playCellElements"
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

    <div class="flex justify-between m-5">
      <!-- Hint -->
      <div class="hint order-1 flex flex-row">
        <div class="btn btn-warning m-1 cursor-not-allowed">
          Hint left : {{ hintsLeft }}
        </div>
        <button
          :class="
            hintsLeft > 0 && hintable
              ? 'btn btn-outline btn-accent m-1'
              : 'btn btn-active btn-ghost cursor-not-allowed m-1'
          "
          :disable="hintsLeft > 0 ? false : true"
          @click="genHint"
        >
          Get hint
        </button>
        <div v-if="hints.length > 0" class="px-4 py-2 m-2 font-medium">
          <b v-for="(hint, index) in hints" :key="hint"
            >{{ hint }} <b v-if="index < hints.length - 1">, </b></b
          >
        </div>
      </div>
      <!--Miss-->
      <div class="missed order-last">
        <div class="btn m-1 cursor-not-allowed">Missed : {{ missed }}</div>
      </div>
    </div>

    <div class="join pagination flex justify-center">
      <button class="join-item btn">«</button>
      <button class="join-item btn">Level {{ currentLv }}</button>
      <button v-if="win" @click="nextLevel" class="join-item btn">»</button>
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
