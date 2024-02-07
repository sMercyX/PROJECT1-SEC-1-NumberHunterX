<script setup>
import { onMounted, ref, toRaw } from 'vue'

const start = ref(false)

const missed = ref(0)
//hint
const hintsLeft = ref(3)
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
let mins = ref(0)
let secs = ref(0)
let timeUsed = ref(0)
//levels
const currentLv = ref(0)
const marked = []
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
  //1.กดปุ่มstart แล้วจะเรียกstartGame() มา
  start.value = true
  timer(true)
  if (hintsLeft.value >= 0) {
    hintable.value = true
  }
}

function timer(op) {
  if (op) {
    timerInterval = setInterval(() => {
      timeUsed.value++
      if (secs.value >= 59) {
        //แปลงหน่วยวิให้เป็นหน่วยนาที
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

function toRawBlock(id) {
  return toRaw(playCellElements.value).find((cellDom) => cellDom.id === id) //ไว้หา element ที่อยู่ใน ref:playCellElement ด้วย id แล้วส่ง event.target กลับไป
}

//reset block style
const resetBlockStyles = () => {
  checked.forEach((id) => {
    toRawBlock(id).style.backgroundColor = ''
    toRawBlock(id).textContent = ''
  })
  //marked is store event.target that no need to used toRawBlock() to get their event from playCellElements
  marked.forEach((id) => {
    id.style.backgroundColor = ''
    id.textContent = ''
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
  marked.splice(0)
}
function resetValue() {
  currentLv.value = 0
  mins.value = 0
  secs.value = 0
  timeUsed.value = 0
  clearInterval(timerInterval)
}

let save
let bestTime = ref({})
function calTimeToMin(time) {
  let min = Math.floor(time / 60)
  let sec = time % 60
  return { min, sec }
}

function setBestTime() {
  bestTime.value = calTimeToMin(save)
}
function getSave() {
  save = localStorage.getItem('save')
  if (save === null || save === undefined) {
    save = 0
    setBestTime()
  } else {
    save = JSON.parse(save)
    setBestTime()
  }
}

let show = ref(0)
function homePage() {
  show.value = 0
}
function tutorialPage() {
  show.value = 1
}
function gamePage() {
  show.value = 2
  hintsLeft.value = 3
  resetNewBestTime()
  getSave()
}
function modalPage() {
  show.value = 3
}
let lastMin = ref(0)
let lastSec = ref(0)
function nextLevel() {
  currentLv.value++
  hintsLeft.value = 3
  if (currentLv.value < level.length) {
    resetBlockStyles()
    resetGame()
    startGame()
    win.value = false
  } else {
    // alert('Congratulation! You have finished all levels!')
    checkNewBestTime()
    lastMin.value = mins.value
    lastSec.value = secs.value
    localStorage.setItem('save', JSON.stringify(save))
    getSave()
    resetBlockStyles()
    resetValue()
    resetGame()
    modalPage()
  }
}
let newBestTime = ref(false)
function checkNewBestTime() {
  if (save === 0 || timeUsed.value < save) {
    newBestTime.value = true
    save = timeUsed.value
  } else newBestTime.value = false
}
function resetNewBestTime() {
  newBestTime.value = false
}
function checkHintable() {
  let checkedCorrect = checked.filter((tile) => {
    return correctBlock.includes(tile)
  })
  //แก้ให้ตัวที่ถูกmarkสามารถกดhintทับลงไปได้เพื่อแก้bug

  if (hintsLeft.value <= 0) {
    hintable.value = false
  }
  if (checkedCorrect.length === correctBlock.length) {
    hintable.value = false
  }
}

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

      let press4U = toRawBlock(correctBlock[randomIndex])
      press4U.dispatchEvent(new Event('click')) //addClickers จำลอง
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
  if (checked.includes(id) || marked.includes(targetTile)) {
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
  if (!start.value || win.value) {
    return
  }
  let targetTile = event.target //tile clicked
  let targetTileId = targetTile.id //clicked tile id
  if (checked.includes(targetTileId)) {
    return
  }

  if (marked.includes(targetTile)) {
    console.log('ooh yeah!!!')
    targetTile.style.backgroundColor = ''
    let unmarked = marked.findIndex((tile) => tile.id === targetTile.id)
    console.log(unmarked)
    marked.splice(unmarked, 1)
    console.log(marked)
  } else if (
    !marked.includes(targetTile) &&
    !targetTileId.includes('0') &&
    !targetTileId.includes('99') &&
    !targetTileId.includes('t')
  ) {
    marked.push(event.target)
    console.log(marked)
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
  win.value = winTemp
  return winTemp
}
</script>

<template>
  <div class="header pb-2 flex justify-center py-3">
    <div class="mb-4 text-4xl font-extrabold">NUMBER HUNTER</div>
  </div>
  <section id="homePage" class="flex justify-center">
    <div v-show="show == 0">
      <button @click="tutorialPage" class="btn btn-success text-white">
        Tutorial
      </button>
      <button @click="gamePage" class="btn btn-success text-white">
        Play Game
      </button>
    </div>
  </section>
  <section id="tutorialPage">
    <!--main tutorial-->
    <div class="tutorial flex" v-show="show == 1">
      <div class="tutorials px-4 py-2 m-2 center">
        <h1 class="text-center text-2xl font-bold">tutorials</h1>
        <h2>I think should have some picture</h2>
        <br /><br /><br /><br />
        <h2 class="p-20">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
          temporibus, cum harum natus ea dicta sequi accusantium ducimus
          voluptas deserunt eaque, earum eos. Similique, architecto. Ullam
          debitis error ipsa unde? Numquam doloribus dolorem aspernatur libero
          eligendi ab molestias, dolor rem sunt suscipit nihil, totam, ut nulla
          quae commodi! Quod a vero tempore atque! Perspiciatis, eum nisi quas
          nihil tempore totam!
        </h2>
        <button
          class="btn btn-outline btn-primary"
          type="button"
          @click="homePage"
        >
          <img src="./assets/Home_icon_green.png" class="h-7" />
          BACK HOME
        </button>
      </div>
    </div>
  </section>

  <section id="gamePage">
    <div class="container p-10 m-auto w-full" v-show="show == 2">
      <section class="flex items-center justify-between">
        <div>
          <div id="bestTimePlayed" class="flex">
            Best Time :
            <p v-if="bestTime.sec != undefined">
              <span v-if="bestTime.min < 10">0</span>{{ bestTime.min }} :
              <span v-if="bestTime.sec < 10">0</span>{{ bestTime.sec }}
            </p>
            <p v-if="bestTime.sec == undefined">Never play</p>
          </div>
          <div id="timer" v-show="start">
            Time :
            <span v-if="mins < 10">0</span>{{ mins }} :
            <span v-if="secs < 10">0</span>{{ secs }}
          </div>
          <button
            v-if="!start"
            class="btn btn-outline btn-primary"
            type="button"
            @click="startGame()"
          >
            <img src="./assets/play-button.png" class="h-7" />
            Start
          </button>
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
          <button
            :class="
              hintsLeft > 0 && hintable
                ? 'btn btn-outline btn-accent m-1'
                : 'btn btn-active btn-ghost cursor-not-allowed m-1'
            "
            :disable="hintsLeft > 0 ? false : true"
            @click="genHint"
          >
            Get hint: {{ hintsLeft }}
          </button>
          <div v-if="hints.length > 0" class="px-4 py-2 m-2 font-medium"></div>
        </div>
        <!--Miss-->
        <div class="missed order-last">
          <div class="btn m-1 cursor-not-allowed">Missed : {{ missed }}</div>
        </div>
      </div>

      <div class="join pagination flex justify-center">
        <button class="join-item btn">Level {{ currentLv + 1 }}</button>
      </div>
    </div>
  </section>

  <section id="modal">
    <div class="modal-container" v-show="show == 3">
      <div id="" class="min-h-screen">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-3xl font-bold py-8">Something</h1>
            <p class="">
              Best Time :
              <span v-if="bestTime.min < 10">0</span>{{ bestTime.min }} :
              <span v-if="bestTime.sec < 10">0</span>{{ bestTime.sec }}
            </p>
            <p>
              Time Used :
              <span v-if="lastMin < 10">0</span>{{ lastMin }} :
              <span v-if="lastSec < 10">0</span>{{ lastSec }}
            </p>
            <div v-show="newBestTime">
              <p>CONGRADULATION!!!!</p>
              <p>YOU ARE THE NEW RECORD</p>
              <button
                class="btn btn-outline btn-primary"
                type="button"
                @click="homePage"
              >
                <img src="./assets/Home_icon_green.png" class="h-7" />
                BACK HOME
              </button>
            </div>
            <div v-show="!newBestTime">
              <h3 class="text-2xl">BE FASTER</h3>
              <button
                class="btn btn-outline btn-primary"
                type="button"
                @click="gamePage"
              >
                <img src="./assets/play-button.png" class="h-7" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Ensures that the container takes at least the full height of the viewport */
}
</style>
