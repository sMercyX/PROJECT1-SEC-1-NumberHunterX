<script setup>
import { onMounted, ref, toRaw } from "vue"

const start = ref(false)

//hint
const hintsLeft = ref(300)
let hints = ref([])
let hintable = ref(false)
// const timer = ref(0)

//style
const blockStyle = "hanjie-cell"
const noneBorder = "row-number"
const halfBlock = "hanjie-cell-half"
const correct = "MediumSeaGreen"
const unCorrect = "#f87171"

let gameSize = ref(0) // 0, 1
const missed = ref(0)
let fails

import tableSize from "./tableSize.json"
//block stores row and column of table
let blocks = ref([])
let rows //add 2 row for show header number(t,0)
let columns //add 2 columns for show header number(0) and clear block(99)
const genBlock = () => {
  blocks.value = []
  //rows stores row name of table
  rows = tableSize[gameSize.value].rows
  columns = tableSize[gameSize.value].columns
  rows.forEach((ele) => {
    blocks.value.push({ row: ele, column: [...columns] })
  })
}
// genBlock()

//checked blocks array
const checked = []
const win = ref(false)
///times
let mins = ref(0)
let secs = ref(0)
let timeUsed = ref(0)

const currentLv = ref(0)
const marked = []

import easyLevel from "./easyLevel.json"
import hardLevel from "./hardLevel.json" //no dat to used now its copy data from level
let level = [...easyLevel]

const ezMode = () => {
  gameSize.value = 0
  fails = 5
  mode = "easyMode"
  level = [...easyLevel]
  console.log(mode)
  gamePage()
}
const hardMode = () => {
  gameSize.value = 1
  fails = 10
  mode = "hardMode"
  level = [...hardLevel]
  console.log(mode)
  gamePage()
}

//correctBlock stores block that when click its will change to correct color
let correctBlock = []
//headerNums stores id and result of block of table head
let headerNums = []

const randomlv = []
const randomLevel = () => {
  randomlv.splice(0)
  let randomIndex
  while (randomlv.length < 5) {
    randomIndex = Math.floor(Math.random() * level.length)
    // level.splice(randomIndex, 1)
    if (randomlv.length == 0) randomlv.push(level[randomIndex])
    else if (
      !randomlv.some((lv) => lv.puzzle == level[randomIndex].puzzle) //หาตัวที่ยังไม่ถูกสุ่ม
    ) {
      randomlv.push(level[randomIndex])
    }
  }
  console.log(randomlv)
}

// randomLevel()

let mode = "easyMode"
let show = ref(0)
function homePage() {
  show.value = 0
  missed.value = 0
}
function tutorialPage() {
  show.value = 1
}
function gamePage() {
  genBlock()
  randomLevel()
  show.value = 2
  hintsLeft.value = 300
  resetNewBestTime()
  getSave()
}
function modalPage() {
  show.value = 3
}
let timerInterval

function startGame() {
  //1.กดปุ่มstart แล้วจะเรียกstartGame() มา

  console.log(randomlv[currentLv.value])
  correctBlock = randomlv[currentLv.value].correctBlock
  headerNums = randomlv[currentLv.value].headerNums
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
    toRawBlock(id).style.backgroundColor = ""
    toRawBlock(id).textContent = ""
  })
  //marked is store event.target that no need to used toRawBlock() to get their event from playCellElements
  marked.forEach((id) => {
    id.style.backgroundColor = ""
    id.textContent = ""
  })
}
function resetGame() {
  start.value = false
  checked.splice(0)
  win.value = false
  clearInterval(timerInterval)
  hints.value = []
  marked.splice(0)
  
}
function resetValue() {
  currentLv.value = 0
  mins.value = 0
  secs.value = 0
  timeUsed.value = 0
  // clearInterval(timerInterval)
}

let save = ref()
let bestTime = ref({})
function calTimeToMin(time) {
  let min = Math.floor(time / 60)
  let sec = time % 60
  return { min, sec }
}

function setBestTime() {
  bestTime.value = calTimeToMin(save.value)
}

function getSave() {
  save.value = localStorage.getItem(mode)
  if (save.value === null || save.value === undefined) {
    save.value = 0
    setBestTime()
  } else {
    save.value = JSON.parse(save.value)
    setBestTime()
  }
}

let lastMin = ref(0)
let lastSec = ref(0)
function nextLevel() {
  currentLv.value++
  hintsLeft.value = 300
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
    localStorage.setItem(mode, JSON.stringify(save.value))
    getSave()
    resetBlockStyles()
    resetValue()
    resetGame()
    modalPage()
  }
}
let newBestTime = ref(false)
function checkNewBestTime() {
  if (save.value === 0 || timeUsed.value < save.value) {
    newBestTime.value = true
    save.value = timeUsed.value
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
    let correctButMarkedCellNum = marked.filter((markedDom) => correctBlock.includes(markedDom.id)).length; 
    if(correctButMarkedCellNum === correctBlock.length - checked.filter((tile) => correctBlock.includes(tile)).length){
      return
    }
    else if (
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
  if (id.includes("0")) return `${halfBlock} ${noneBorder}`
  if (id.includes("t")) return `${halfBlock} ${noneBorder}`
  if (id.includes("99")) return `${blockStyle} ${noneBorder}`
  return blockStyle
}

const checkTR = (id) => {
  if (id.includes("0"))
    return `
  height: 30px;`
  if (id.includes("t"))
    return `
  height: 30px;`
}

const checkHeader = (id) => {
  const index = headerNums.findIndex((num) => num.id === id) //checking id in array of header numbers to show hints number at header
  return index >= 0 ? headerNums[index].result : ""
}

const addClickers = (event) => {
  if (!start.value || win.value) {
    return
  }
  let targetTile = event.target //tile clicked
  let id = targetTile.id //clicked tile id
  let targetClasses = targetTile.className.split(" ") //split class into array //unused
  if (checked.includes(id) || marked.includes(targetTile)) {
    return
  }
  if (!id.includes("0") && !id.includes("99") && !id.includes("t")) {
    const blockColor = correctBlock.includes(id) ? correct : unCorrect
    const targetBlock = targetTile
    targetBlock.style.backgroundColor = blockColor
    if (blockColor === unCorrect) {
      targetBlock.textContent = "x"
      missed.value++
    }
    checked.push(id)
    if (blockColor === correct) {
      checkHintable()
    }
    if (checkWin()) {
      timer(false)
    }
    if (missed.value >= fails) {
      // console.log("you failed!!!")

      alert("You Failed")
      
      resetBlockStyles()
      resetValue()
      resetGame()
      homePage()
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
  let markId
  if (marked.includes(targetTile)) {
    targetTile.style.backgroundColor = ""
    let unmarked = marked.findIndex((tile) => tile.id === targetTile.id)

    marked.splice(unmarked, 1)
    markId = marked.map((mark) => mark.id)
    console.log(markId)
  } else if (
    !marked.includes(targetTile) &&
    !targetTileId.includes("0") &&
    !targetTileId.includes("99") &&
    !targetTileId.includes("t")
  ) {
    marked.push(event.target)
    markId = marked.map((mark) => mark.id)
    console.log(markId)
    targetTile.style.backgroundColor = "grey"
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
function resetMiss(){
  missed.value = 0
}


</script>

<template>
  <div class="header pb-2 flex justify-center py-3">
    <div class="mb-4 text-4xl font-extrabold">NUMBER HUNTER</div>
  </div>
  <section id="homePage">
    <div v-show="show == 0" class="flex justify-center gap-3">
      <button @click="tutorialPage" class="btn btn-success text-white">
        Tutorial
      </button>
      <!-- <button @click="gamePage" class="btn btn-success text-white">
        Play Game
      </button> -->
      <button @click="ezMode" class="btn btn-primary text-white">
        Easy mode</button
      ><button @click="hardMode" class="btn btn-error text-white">
        Hard mode
      </button>
    </div>
  </section>

  <section id="tutorialPage">
    <!--main tutorial-->
    <div class="tutorial" v-show="show == 1">
      <div class="tutorials py-2 m-2 center">
        <h1 class="text-center text-2xl font-bold">tutorials</h1>

        <div class="tuto">
          <h2 class="flex justify-center">
            Along the top and left side of the grid, there are sequences of
            numbers. These numbers provide clues about the groups of filled-in
            squares in the corresponding row or column. Each number represents a
            consecutive group of filled squares, and the numbers are separated
            by at least one blank square. The order of the numbers corresponds
            to the order of the groups in the row or column. <br />Additionally,
            each game mode comes with a timeer to challenge players further.
            Players can test their speed-solving skills in various difficulty
            levels. The fastest completion time for each mode will be recorded.
            players have access to a total of 3 hints for each level in all mode
            to assist them in solving challenging puzzles.
          </h2>

          <div class="pic">
            <h1 class="flex justify-center">Example</h1>
            <div class="flex justify-center">
              <img src="./assets/t1-1.png" class="w-80" />
              <img src="./assets/t1-2.png" class="w-80" />
            </div>
            <div class="flex justify-center">
              <img src="./assets/t2-1.png" class="w-80" />
              <img src="./assets/t2-2.png" class="w-80" />
            </div>
            <div class="flex justify-center">
              <img src="./assets/t3-1.png" class="w-80" />
              <img src="./assets/t3-2.png" class="w-80" />
            </div>
          </div>
        </div>

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
    <div class="container p-10 m-auto w-full" v-if="show == 2">
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

            <div v-show="!newBestTime">
              <h3 class="text-2xl">BE FASTER</h3>
              <button
                class="btn btn-outline btn-primary"
                type="button"
                @click="
                  () => {
                    gamePage()
                    resetMiss()
                  }
                "
              >
                <img src="./assets/play-button.png" class="h-7" />
                Try again
              </button>
            </div>
            <div v-show="newBestTime">
              <p>CONGRADULATION!!!!</p>
              <p>YOU ARE THE NEW RECORD</p>
            </div>
            <div>
              <button
                class="btn btn-outline btn-primary"
                type="button"
                @click="homePage"
              >
                <img src="./assets/Home_icon_green.png"  class="h-7" />
                BACK HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pic {
  border: rgb(209, 205, 205) solid 3px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 5px 6px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  max-width: 150vh;
  margin: 0 auto;
}
.tuto {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  align-items: center;

  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  max-width: 150vh;
  margin: 0 auto;
}

.tutorials {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tuto h2 {
  font-size: 20px;
  line-height: 1.6;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.tuto .example {
  text-align: center;
}

.tuto .example h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.tuto .example img {
  width: 120px;
  height: 120px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.tuto .example img:hover {
  transform: scale(1.05);
}

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
