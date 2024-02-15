<script setup>
import { ref, watchEffect, watch } from 'vue'
import easyLevel from './easyLevel.json'
import hardLevel from './hardLevel.json' //no dat to used now its copy data from level
import tableSize from './tableSize.json'

let level = [...easyLevel]

const start = ref(false)

//hint
const hintsLeft = ref(3)
const hints = ref([])
let hintable = ref(false)
// const timer = ref(0)

//style
const blockStyle = 'hanjie-cell'
const noneBorder = 'row-number'
const halfBlock = 'hanjie-cell-half'
const correct = 'MediumSeaGreen'
const unCorrect = '#f87171'

let gameSize = ref(0) // 0, 1
const missed = ref(0)
let fails = ref(0)

//block stores row and column of table
let blocks = ref([])
let rows //add 2 row for show header number(t,0)
let columns //add 2 columns for show header number(0) and clear block(99)

//checked blocks array
const checked = ref([])
const win = ref(false)

///times
let mins = ref(0)
let secs = ref(0)

let timeUsed = ref(0)
let timerInterval

let newBestTime = ref(false)

const currentLv = ref(0)
const marked = []

let save = ref()
let bestTime = ref({})

let tutorial = ref(0)
let mode = 'easyMode'
let show = ref(0)

//correctBlockss stores block that when click its will change to correct color
let correctBlocks = []
//headerNums stores id and result of block of table head
let headerNums = []

const randomlv = []

const playCellElements = ref(null)

const genBlock = () => {
  blocks.value = []
  //rows stores row name of table
  rows = tableSize[gameSize.value].rows
  columns = tableSize[gameSize.value].columns
  rows.forEach((ele) => {
    blocks.value.push({ row: ele, column: [...columns] })
  })
}

const ezMode = () => {
  gameSize.value = 0
  fails.value = 5
  mode = 'easyMode'
  level = [...easyLevel]
  gamePage()
}
const hardMode = () => {
  gameSize.value = 1
  fails.value = 10
  mode = 'hardMode'
  level = [...hardLevel]
  gamePage()
}

const randomLevel = () => {
  randomlv.splice(0) //should reset when start game
  while (randomlv.length < 5) {
    let randomIndex = Math.floor(Math.random() * level.length)
    if (randomlv.length == 0) randomlv.push(level[randomIndex])
    else if (
      !randomlv.some((lv) => lv.puzzle == level[randomIndex].puzzle) //หาตัวที่ยังไม่ถูกสุ่ม
    ) {
      randomlv.push(level[randomIndex])
    }
  }
}

function nextPage() {
  tutorial.value++
}
function beforePage() {
  tutorial.value--
}
function resetHint() {
  hintsLeft.value = 300
}
function resetMiss() {
  missed.value = 0
}
function resetNewBestTime() {
  newBestTime.value = false
}

function getPlayCellTarget(id) {
  return playCellElements.value.find((cellDom) => cellDom.id === id) //ไว้หา element ที่อยู่ใน ref:playCellElement ด้วย id แล้วส่ง event.target กลับไป
}

const resetBlockStyles = () => {
  checked.value.forEach((id) => {
    getPlayCellTarget(id).style.backgroundColor = ''
    getPlayCellTarget(id).textContent = ''
  })
  marked.forEach((id) => {
    id.style.backgroundColor = ''
    id.textContent = ''
  })
}
function resetGame() {
  start.value = false
  checked.value.splice(0)
  win.value = false
  clearInterval(timerInterval)
  hints.value.splice(0)
  marked.splice(0)
  headerNums = []
  hintable.value = false
}
function resetTime() {
  currentLv.value = 0
  mins.value = 0
  secs.value = 0
  timeUsed.value = 0
  // clearInterval(timerInterval)
}

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
function homePage() {
  show.value = 0
}
function tutorialPage() {
  show.value = 1
}
function gamePage() {
  resetTime()
  resetGame()
  resetHint()
  resetNewBestTime()
  resetMiss()
  genBlock()
  randomLevel()
  getSave()
  show.value = 2
}
function modalPage() {
  show.value = 3
}
function failPage() {
  show.value = 4
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
  const index = headerNums.findIndex((num) => num.id === id) //checking id in array of header numbers to show hints number at header
  return index >= 0 ? headerNums[index].result : ''
}
function startGame() {
  //1.กดปุ่มstart แล้วจะเรียกstartGame() มา
  correctBlocks = randomlv[currentLv.value].correctBlocks
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

function checkNewBestTime() {
  if (save.value === 0 || timeUsed.value < save.value) {
    newBestTime.value = true
    save.value = timeUsed.value
  } else newBestTime.value = false
}


function nextLevel() {
  currentLv.value++;
  if (currentLv.value < randomlv.length) {
    resetBlockStyles();
    resetGame();
    resetHint();
    startGame();
    win.value = false;
  } else {
    checkNewBestTime(); //set bestTimeUsed to save.value
    localStorage.setItem(mode, JSON.stringify(save.value));
    modalPage();
  }
}

const genHint = () => {
  let hintableBlocks = correctBlocks.filter((correctBlocks) => {
    return (
      !checked.value.includes(correctBlocks) &&
      !marked.map((markedBlock) => markedBlock.id).includes(correctBlocks)
    )
  })
  if (hintsLeft.value <= 0 || !hintable.value || hintableBlocks.length === 0) {
    return
  }
  let randomIndex = Math.floor(Math.random() * hintableBlocks.length)
  hintsLeft.value--
  hints.value.push(hintableBlocks[randomIndex])
  getPlayCellTarget(hintableBlocks[randomIndex]).dispatchEvent(
    new Event('click')
  ) //addClickers จำลอง
}

watchEffect(() => {
  let checkedCorrect = checked.value.filter((tile) => {
    return correctBlocks.includes(tile)
  })
  if (hintsLeft.value <= 0 || checkedCorrect.length === correctBlocks.length) {
    hintable.value = false
  }
})

const addClickers = (event) => {
  if (!start.value || win.value) {
    return
  }
  let targetTile = event.target //tile clicked
  let id = targetTile.id //clicked tile id
  if (checked.value.includes(id) || marked.includes(targetTile)) {
    return
  }
  if (!id.includes('0') && !id.includes('99') && !id.includes('t')) {
    const blockColor = correctBlocks.includes(id) ? correct : unCorrect
    targetTile.style.backgroundColor = blockColor
    if (blockColor === unCorrect) {
      targetTile.textContent = 'x'
      missed.value++
    }
    checked.value.push(id)

    if (missed.value >= fails.value) {
      failPage()
    }
  }
}

function mark(event) {
  event.preventDefault()
  if (!start.value || win.value) return
  let targetTile = event.target //tile clicked
  let targetTileId = targetTile.id //clicked tile id
  if (checked.value.includes(targetTileId)) return
  //now markId is unused!!!!
  let markId
  if (marked.includes(targetTile)) {
    targetTile.style.backgroundColor = ''
    let unmarked = marked.findIndex((tile) => tile.id === targetTile.id)

    marked.splice(unmarked, 1)
    markId = marked.map((mark) => mark.id)
  } else if (
    !marked.includes(targetTile) &&
    !targetTileId.includes('0') &&
    !targetTileId.includes('99') &&
    !targetTileId.includes('t')
  ) {
    marked.push(event.target)
    markId = marked.map((mark) => mark.id)
    targetTile.style.backgroundColor = 'grey'
  }
}
watch(checked.value, () => {
  //checked.value because checked is an array object requiring .value to have the watcher watch it
  let winTemp = true
  correctBlocks.forEach((mustCheckCell) => {
    if (!checked.value.includes(mustCheckCell)) winTemp = false
  })
  win.value = winTemp
  if (win.value) timer(false)
})
</script>

<template>
  <div class="gamePlay">
    <div class="header px-2 flex justify-center py-3 text-4xl font-extrabold">
      NUMBER HUNTER
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

    <!--tutorial page-->
    <section id="tutorialPage">
      <!--main tutorial-->
      <div class="tutorial" v-show="show == 1">
        <div class="min-h-screen flex flex-col items-center">
          <h1 class="text-4xl text-black mb-8 font-sans font-bold">Tutorial</h1>

          <div class="box-wrapper" v-show="tutorial == 0">
            <div
              class="box flex flex-col md:flex-row items-center justify-center py-8 md:py-12"
            >
              <!--img-->
              <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                <img src="./assets/t1-1.png" class="w-full h-auto" />
              </div>
              <!--text-->
              <div class="md:w-1/2 flex flex-col items-center justify-center">
                <div class="text-lg text-black text-justify mb-4 md:mb-8 p-6">
                  Along the top and left side of the grid, there are sequences
                  of numbers. These numbers provide clues about the groups of
                  filled-in squares in the corresponding row or column.
                </div>
              </div>
              <!--btn-->
              <div
                class="button-group self-start md:self-end flex flex-row md:flex-col mr-2"
              >
                <button
                  v-if="tutorial > 0"
                  @click="beforePage"
                  class="btn btn-primary mb-2 m-3"
                >
                  previous page
                </button>

                <button
                  v-if="tutorial < 4"
                  @click="nextPage"
                  class="btn btn-primary mb-2 m-3"
                >
                  next page
                </button>
              </div>
            </div>
          </div>

          <div class="box-wrapper" v-show="tutorial == 1">
            <div
              class="box flex flex-col md:flex-row items-center justify-center py-8 md:py-12"
            >
              <!--img-->
              <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                <img src="./assets/t1-2.png" class="w-full h-auto" />
              </div>
              <!--text-->
              <div class="md:w-1/2 flex flex-col items-center justify-center">
                <div class="text-lg text-black text-justify mb-4 md:mb-8 p-6">
                  Each number represents a consecutive group of filled squares,
                  and the numbers are separated by at least one blank square.
                </div>
              </div>
              <!--btn-->
              <div
                class="button-group self-start md:self-end flex flex-row md:flex-col mr-2"
              >
                <button
                  v-if="tutorial > 0"
                  @click="beforePage"
                  class="btn btn-primary mb-2 m-3"
                >
                  previous page
                </button>

                <button
                  v-if="tutorial < 4"
                  @click="nextPage"
                  class="btn btn-primary mb-2 m-3"
                >
                  next page
                </button>
              </div>
            </div>
          </div>

          <div class="box-wrapper" v-show="tutorial == 2">
            <div
              class="box flex flex-col md:flex-row items-center justify-center py-8 md:py-12"
            >
              <!--img-->
              <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                <img src="./assets/t2-1.png" class="w-full h-auto" />
              </div>
              <!--text-->
              <div class="md:w-1/2 flex flex-col items-center justify-center">
                <div class="text-lg text-black text-justify mb-4 md:mb-8 p-6">
                  The order of the numbers corresponds to the order of the
                  groups in the row or column. Additionally, each game mode
                  comes with a timeer to challenge players further.
                </div>
              </div>
              <!--btn-->
              <div
                class="button-group self-start md:self-end flex flex-row md:flex-col mr-2"
              >
                <button
                  v-if="tutorial > 0"
                  @click="beforePage"
                  class="btn btn-primary mb-2 m-3"
                >
                  previous page
                </button>

                <button
                  v-if="tutorial < 4"
                  @click="nextPage"
                  class="btn btn-primary mb-2 m-3"
                >
                  next page
                </button>
              </div>
            </div>
          </div>

          <div class="box-wrapper" v-show="tutorial == 3">
            <div
              class="box flex flex-col md:flex-row items-center justify-center py-8 md:py-12"
            >
              <!--img-->
              <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                <img src="./assets/t2-2.png" class="w-full h-auto" />
              </div>
              <!--text-->
              <div class="md:w-1/2 flex flex-col items-center justify-center">
                <div class="text-lg text-black text-justify mb-4 md:mb-8 p-6">
                  Players can test their speed-solving skills in various
                  difficulty levels. The fastest completion time for each mode
                  will be recorded.
                </div>
              </div>
              <!--btn-->
              <div
                class="button-group self-start md:self-end flex flex-row md:flex-col mr-2"
              >
                <button
                  v-if="tutorial > 0"
                  @click="beforePage"
                  class="btn btn-primary mb-2 m-3"
                >
                  previous page
                </button>

                <button
                  v-if="tutorial < 4"
                  @click="nextPage"
                  class="btn btn-primary mb-2 m-3"
                >
                  next page
                </button>
              </div>
            </div>
          </div>

          <div class="box-wrapper" v-show="tutorial == 4">
            <div
              class="box flex flex-col md:flex-row items-center justify-center py-8 md:py-12"
            >
              <!--img-->
              <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                <img src="./assets/t2-2.png" class="w-full h-auto" />
              </div>
              <!--text-->
              <div class="md:w-1/2 flex flex-col items-center justify-center">
                <div class="text-lg text-black text-justify mb-4 md:mb-8 p-6">
                  players have access to a total of 3 hints for each level in
                  all mode to assist them in solving challenging puzzles.
                </div>
              </div>
              <!--btn-->
              <div
                class="button-group self-start md:self-end flex flex-row md:flex-col mr-2"
              >
                <button
                  v-if="tutorial > 0"
                  @click="beforePage"
                  class="btn btn-primary mb-2 m-3"
                >
                  previous page
                </button>

                <button
                  v-if="tutorial < 4"
                  @click="nextPage"
                  class="btn btn-primary mb-2 m-3"
                >
                  next page
                </button>
              </div>
            </div>
          </div>

          <!--home button-->
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
      <div class="container m-auto w-full" v-if="show == 2">
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
            <div
              v-if="hints.length > 0"
              class="px-4 py-2 m-2 font-medium"
            ></div>
          </div>
          <!--Miss-->
          <div class="missed order-last">
            <div class="m-1 cursor-default">
              Missed : {{ missed }}/{{ fails }}
              <div
                class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
              >
                <div
                  class="bg-teal-500 h-2.5 rounded-full"
                  :style="` width: ${(1 - missed / fails) * 100}% `"
                ></div>
              </div>
            </div>
          </div>
          <!-- <div class="missed order-last">
            <button class="btn m-1 cursor-not-allowed">
              Missed : {{ missed }}/{{ fails }}
            </button>
          </div> -->
        </div>

        <div class="join pagination flex justify-center">
          <div class="join-item pointer-events-none">
            Level {{ currentLv + 1 }}
          </div>
        </div>
      </div>
    </section>

    <section id="modal">
      <div class="modal-container" v-show="show == 3">
        <div id="" class="min-h-screen">
          <div class=" text-center">
            <div class="max-w-md">
              <h1 class="text-3xl font-bold py-8">Something</h1>
              <p class="">
                Best Time :
                <span v-if="bestTime.min < 10">0</span>{{ bestTime.min }} :
                <span v-if="bestTime.sec < 10">0</span>{{ bestTime.sec }}
              </p>
              <p>
                Time Used :
                <span v-if="mins < 10">0</span>{{ mins }} :
                <span v-if="secs < 10">0</span>{{ secs }}
              </p>

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
                  <img src="./assets/Home_icon_green.png" class="h-7" />
                  BACK HOME
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <section id="failPage">
    <!--main tutorial-->
    <div class="tutorial" v-if="show === 4">
      <div class="tutorials py-2 m-2 center">
        <h1 class="text-center text-2xl font-bold">tutorials</h1>

        <div class="tuto">
          <button
            class="btn btn-outline btn-primary"
            type="button"
            @click="homePage"
          >
            <img src="./assets/Home_icon_green.png" class="h-7" />
            BACK HOME
          </button>
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
  </section>
</template>

<style scoped>
.gamePlay {
  font-family: Arial, Helvetica, sans-serif;
}

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
  min-height: 100vh;
  /* Ensures that the container takes at least the full height of the viewport */
}

.btn {
  border-radius: 999px;
  margin-top: 3%;
}

.box-wrapper {
  max-width: 800px;
}

.box {
  background-color: #ffffff;
  /* White background */
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
