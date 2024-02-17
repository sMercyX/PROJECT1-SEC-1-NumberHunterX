<script setup>
import { ref, watchEffect, watch } from "vue"
import easyLevel from "./easyLevel.json"
import hardLevel from "./hardLevel.json" //no dat to used now its copy data from level
import tableSize from "./tableSize.json"

let level = [...easyLevel]

const start = ref(false)

//hint
const hintsLeft = ref(3)
let hintable = ref(false)

//style
const blockStyle = "hanjie-cell"
const noneBorder = "row-number"
const halfBlock = "hanjie-cell-half"
const correct = "MediumSeaGreen"
const unCorrect = "#f87171"

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

let mode = "easyMode"
let show = ref(0)

//correctBlockss stores block that when click its will change to correct color
let correctBlocks = []
//headerNums stores id and result of block of table head
let headerNums = []

const randomlv = []

const playCellElements = ref(null)

let healthStatus
const genBlock = () => {
  blocks.value = []
  //rows stores row name of table
  rows = tableSize[gameSize.value].rows
  columns = tableSize[gameSize.value].columns
  rows.forEach((ele) => {
    blocks.value.push({ row: ele, column: [...columns] })
  })
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

function calTimeToMin(time) {
  let min = Math.floor(time / 60)
  let sec = time % 60
  return { min, sec }
}

function timer(op) {
  if (op) {
    timerInterval = setInterval(() => {
      // timeUsed.value++
      // if (secs.value >= 59) {
      //   //แปลงหน่วยวิให้เป็นหน่วยนาที
      //   mins.value++
      //   secs.value = 0
      //   return
      // } else {
      //   secs.value++
      // }
      let { min, sec } = calTimeToMin(++timeUsed.value)
      mins.value = min
      secs.value = sec
    }, 1000)
  } else {
    if (timerInterval === undefined) {
      return
    } else {
      clearInterval(timerInterval)
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
    getPlayCellTarget(id).style.backgroundColor = ""
    getPlayCellTarget(id).textContent = ""
  })
  marked.forEach((id) => {
    id.style.backgroundColor = ""
    id.textContent = ""
  })
}
function resetGame() {
  start.value = false
  checked.value.splice(0)
  win.value = false
  clearInterval(timerInterval)
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
const ezMode = () => {
  gameSize.value = 0
  fails.value = 5
  mode = "easyMode"
  level = [...easyLevel]
  gamePage()
}
const hardMode = () => {
  gameSize.value = 1
  fails.value = 10
  mode = "hardMode"
  level = [...hardLevel]
  gamePage()
}
function modalPage() {
  show.value = 3
}
function failPage() {
  show.value = 4
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

function checkNewBestTime() {
  if (save.value === 0 || timeUsed.value < save.value) {
    newBestTime.value = true
    save.value = timeUsed.value
  } else newBestTime.value = false
}

function nextLevel() {
  currentLv.value++
  if (currentLv.value < randomlv.length) {
    resetBlockStyles()
    resetGame()
    resetHint()
    startGame()
    win.value = false
  } else {
    checkNewBestTime() //set bestTimeUsed to save.value
    localStorage.setItem(mode, JSON.stringify(save.value))
    modalPage()
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
  getPlayCellTarget(hintableBlocks[randomIndex]).dispatchEvent(
    new Event("click")
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
watchEffect(() => {
  if (missed.value / fails.value < 0.25) {
    healthStatus = "bg-green-300"
  } else if (missed.value / fails.value < 0.5) {
    healthStatus = "bg-yellow-400"
  } else if (missed.value / fails.value < 0.75) {
    healthStatus = "bg-orange-400"
  } else {
    healthStatus = "bg-red-400"
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
  if (!id.includes("0") && !id.includes("99") && !id.includes("t")) {
    const blockColor = correctBlocks.includes(id) ? correct : unCorrect
    targetTile.style.backgroundColor = blockColor
    if (blockColor === unCorrect) {
      targetTile.textContent = "x"
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
  console.log(event.target.id)
  if (!start.value || win.value) return
  let targetTile = event.target //tile clicked
  let targetTileId = targetTile.id //clicked tile id
  if (checked.value.includes(targetTileId)) return
  //now markId is unused!!!!
  let markId
  if (marked.includes(targetTile)) {
    targetTile.style.backgroundColor = ""
    let unmarked = marked.findIndex((tile) => tile.id === targetTile.id)

    marked.splice(unmarked, 1)
    markId = marked.map((mark) => mark.id)
  } else if (
    !marked.includes(targetTile) &&
    !targetTileId.includes("0") &&
    !targetTileId.includes("99") &&
    !targetTileId.includes("t")
  ) {
    marked.push(event.target)
    markId = marked.map((mark) => mark.id)
    targetTile.style.backgroundColor = "grey"
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

const tutorialMode = ref(1)
const toggleTutorialMode = (mode) => {
  if (mode === "general") {
    tutorial.value = 0
    tutorialMode.value = 1
  } else if (mode === "gameMode") {
    tutorialMode.value = 2
    tutorial.value = 5
  }
}
</script>

<template>
  <div class="gamePlay">
    <section v-show="show == 0" id="homePage">
      <div class="header p-2 flex justify-center py-3">
        <div class="p-2 m-3 text-4xl font-extrabold">NUMBER HUNTER</div>
      </div>
      <div class="flex flex-col items-center justify-center">
        <button
          @click="ezMode"
          id="easymodebtn"
          class="btn mx-5 my-3 text-white w-30 bg-green-600 hover:bg-green-700 font-extrabold text-xl font-sans"
        >
          <span>Easy mode</span>
        </button>
        <button
          @click="hardMode"
          id="hardmodebtn"
          class="btn mx-5 my-3 text-white w-30 bg-red-600 hover:bg-red-700 font-extrabold text-xl font-sans"
        >
          <span>Hard mode</span>
        </button>
        <button
          @click="tutorialPage"
          class="btn w-30 mx-5 my-3 bg-slate-400 hover:bg-yellow-600 text-black font-extrabold text-xl font-sans"
        >
          Tutorial
        </button>
      </div>
    </section>

    <!--tutorial page-->
    <section id="tutorialPage">
      <!--main tutorial-->
      <div class="tutorial" v-show="show == 1">
        <div class="header p-2 flex justify-center py-3">
          <div class="p-2 m-3 text-4xl font-extrabold">NUMBER HUNTER</div>
        </div>
        <div class="min-h-screen flex flex-col items-center">
          <div
            class="grid grid-cols-3 grid-rows-1 gap-4 items-center justify-between"
          >
            <div></div>
            <div class="flex justify-center">
              <h1
                class="font-sans text-blue-800 text-4xl font-bold flex justify-center items-center"
              >
                Tutorial
              </h1>
            </div>
          </div>

          <div class="box-wrapper mt-8">
            <div class="box flex flex-col py-8">
              <div class="ml-20 flex justify-end mx-2">
                <button
                  class="btn mx-2"
                  @click="toggleTutorialMode('general')"
                  :class="{
                    'bg-orange-500': tutorial < 5,
                    'bg-gray-500': tutorial >= 5,
                  }"
                >
                  <p>General</p>
                </button>
                <button
                  class="btn mx-2"
                  @click="toggleTutorialMode('gameMode')"
                  :class="{
                    'bg-blue-500': tutorial >= 5,
                    'bg-gray-500': tutorial < 5,
                  }"
                >
                  <p>Game mode</p>
                </button>
              </div>
              <div class="changePage pt-11">
                <div v-show="tutorial == 0" class="md:flex flex-row">
                  <div class="md:w-1/2 mb-1 md:mb-0 md:mr-4 mx-3">
                    <img src="./assets/t1.png" class="w-full h-auto" />
                  </div>
                  <!--text-->
                  <div
                    class="md:w-1/2 flex flex-col items-center justify-center"
                  >
                    <div
                      class="text-lg text-black text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
                    >
                      You'll see a
                      <span class="font-bold text-pink-600">number</span> along
                      the top and left side. These numbers provide clues about
                      the groups of filled-in squares in each row or column.
                    </div>
                  </div>
                </div>

                <div v-show="tutorial == 1" class="md:flex flex-row">
                  <!--img-->
                  <div class="md:w-1/2 mb-1 md:mb-0 md:mr-4 mx-3">
                    <img src="./assets/t2.png" class="w-full h-auto" />
                  </div>
                  <!--text-->
                  <div
                    class="md:w-1/2 flex flex-col items-center justify-center"
                  >
                    <div
                      class="text-lg text-black text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
                    >
                      Each number represents a consecutive group of filled
                      squares, and the numbers are
                      <i class="text-pink-600">
                        separated by at least one blank square.</i
                      >The order of the numbers corresponds to the order of the
                      groups in the row or column.
                    </div>
                  </div>
                </div>

                <div v-show="tutorial == 2" class="md:flex flex-row">
                  <!--img-->
                  <div
                    class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3 flex justify-center items-center"
                  >
                    <img src="./assets/t3.png" class="h-auto" />
                  </div>
                  <!--text-->
                  <div
                    class="md:w-1/2 flex flex-col items-center justify-center"
                  >
                    <div
                      class="text-lg text-black text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
                    >
                      <h1 class="font-bold text-xl mb-2">Solving the Puzzle</h1>
                      To fill a square, simply
                      <i class="text-pink-600"> left-click</i> it. If the
                      decision is correct, it turns green; otherwise, it turnsÂ
                      red. You can also disable clicked squares by
                      <i class="text-pink-600">right-click</i> on them.If you
                      make a mistake, don't worry! You can
                      <i class="text-pink-600">right click again</i> to remove
                      the blank filling.
                    </div>
                  </div>
                </div>

                <div v-show="tutorial == 3" class="md:flex flex-row">
                  <!--img-->
                  <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                    <img src="./assets/t4.png" class="w-full h-auto" />
                  </div>
                  <!--text-->
                  <div
                    class="md:w-1/2 flex flex-col items-center justify-center"
                  >
                    <div
                      class="text-lg text-black text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
                    >
                      You can test your speed-solving skills in various
                      difficulty levels. The fastest completion time for each
                      mode will be recorded.
                    </div>
                  </div>
                </div>

                <div v-show="tutorial == 4" class="md:flex flex-row">
                  <!--img-->
                  <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                    <img src="#" class="w-full h-auto" />
                  </div>
                  <!--text-->
                  <div
                    class="md:w-1/2 flex flex-col items-center justify-center"
                  >
                    <div
                      class="text-lg text-black text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
                    >
                      If you need help. Clicking the <b>"Get Hint"</b> button
                      will reveal some of the correct squares for the puzzle.
                    </div>
                  </div>
                </div>

                <div v-show="tutorial == 5" class="md:flex flex-row">
                  <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                    <img src="./assets/t6.png" class="w-full h-auto" />
                  </div>
                  <!--text-->
                  <div
                    class="md:w-1/2 flex flex-col items-center justify-center"
                  >
                    <div
                      class="text-lg text-black text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
                    >
                      <h1 class="text-2xl font-bold pb-3">Easy Mode</h1>
                      In Easy Mode, the puzzles are simpler and suitable for
                      beginners. <br /><br />
                      <ol class="list-disc font-medium">
                        <li>The grid size is 5x5</li>
                        <li>You have access to 3 hints per level.</li>
                        <li>
                          You're allowed up to 5 mistakes. If you make 5
                          incorrect moves, the game will reset, and you'll need
                          to start over.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div v-show="tutorial == 6" class="md:flex flex-row">
                  <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                    <img src="./assets/t7.png" class="w-full h-auto" />
                  </div>
                  <!--text-->
                  <div
                    class="md:w-1/2 flex flex-col items-center justify-center"
                  >
                    <div
                      class="text-lg text-black text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
                    >
                      <h1 class="text-2xl font-bold pb-3">Hard Mode</h1>
                      Hard Mode offers challenging puzzles for experienced
                      players. <br /><br />
                      <ol class="list-disc font-medium">
                        <li>The grid size is 7x7</li>
                        <li>You have access to 5 hints per level.</li>
                        <li>
                          You're allowed up to 10 mistakes. If you make 5
                          incorrect moves, the game will reset, and you'll need
                          to start over.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="button-group self-center flex flex-row justify-items-end"
              >
                <button
                  v-if="tutorial > 0"
                  @click="beforePage"
                  class="btn bg-blue-400 text-white mx-4"
                >
                  &laquo;
                </button>

                <button
                  v-if="tutorial < 6"
                  @click="nextPage"
                  class="btn bg-blue-400 text-white mx-4"
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>

          <!--home button-->
          <button class="btn bg-pink-600 hover:bg-pink-900" @click="homePage">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="24"
              height="24"
            >
              <path d="M12 3L4 9v12h5v-7h6v7h5V9L12 3z" />
            </svg>
            <span class="text-white">Home</span>
          </button>
        </div>
      </div>
    </section>

    <section id="gamePage">
      <div class="container px-10 py-3 m-auto w-full" v-if="show == 2">
        <section class="flex items-center justify-between">
          <div
            class="text-center align-middle shadow-md w-45 bg-base-200 p-2 py-4 font-sans font-semibold order-first"
            style="border-radius: 9px"
          >
            <div id="bestTimePlayed" class="flex">
              Best Time :
              <p v-if="bestTime.sec != 0">
                <span v-if="bestTime.min < 10">0</span>{{ bestTime.min }} :
                <span v-if="bestTime.sec < 10">0</span>{{ bestTime.sec }}
              </p>
              <p v-if="bestTime.sec == 0">&nbsp; -- : --</p>
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
          <div
            class="text-center shadow-md w-36 bg-base-200 p-2 py-4 font-sans font-semibold"
            style="border-radius: 9px"
          >
            <!--level-->
            <div class="level">
              <div class="font-sans font-bold">Level {{ currentLv + 1 }}</div>
            </div>
            <button
              v-if="win"
              class="btn bg-green-500 text-white hover:bg-green-700"
              @click="nextLevel"
            >
              NEXT LEVEL
            </button>
          </div>
        </section>

        <!--Table-->
        <div class="join flex justify-center">
          <table class="hanjie-table">
            <tr
              v-for="block in blocks"
              :key="block.row"
              :id="block.row"
              :style="checkTR(block.row)"
              class="font-sans font-medium text-base"
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

        <div class="flex justify-between m-3 items-center">
          <!-- Hint -->
          <div class="hint flex flex-row order-first">
            <button
              :class="
                hintsLeft > 0 && hintable
                  ? 'btn border-none bg-yellow-400 hover:bg-yellow-200 text-black m-1'
                  : 'btn border-none bg-yellow-400 hover:bg-gray-600 cursor-not-allowed m-1'
              "
              :disable="hintsLeft > 0 ? false : true"
              @click="genHint"
            >
              Get hint: {{ hintsLeft }}
            </button>
          </div>
          <!--Miss-->
          <div class="missed order-last">
            <div class="m-1 rounded-2xl p-4 font-bold" :class="healthStatus">
              Missed : {{ missed }}/{{ fails }}
              <div
                class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
              >
                <div
                  class="bg-teal-500 h-2.5 rounded-full"
                  :style="{ width: (1 - missed / fails) * 100 + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination flex flex-col items-center">
          <div>
            <button class="btn bg-pink-600 hover:bg-pink-900" @click="homePage">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                width="24"
                height="24"
              >
                <path d="M12 3L4 9v12h5v-7h6v7h5V9L12 3z" />
              </svg>
              <span class="text-white">Home</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="modal">
      <div class="modal-container" v-show="show == 3">
        <div id="" class="min-h-screen">
          <div class="flex flex-col items-center justify-center">
            <div class="box-wrapper mt-12">
              <div
                class="box flex flex-col p-12 py-8 items-center justify-center text-center bg-stone-100 shadow-lg rounded-md"
              >
                <div class="font-extrabold text-2xl text-black">
                  Congratulation <span class="text-4xl">&#127881;</span>
                  <p class="font-sans font-medium text-lg mt-2">
                    you finish the game
                  </p>
                </div>
                <div
                  class="Time text-justify mx-16 my-5 font-sans text-lg font-medium"
                >
                  <div class="bestTime text-yellow-600 flex">
                    Best Time :
                    <p v-if="bestTime.sec != 0">
                      <span v-if="bestTime.min < 10">0</span
                      >{{ bestTime.min }} :
                      <span v-if="bestTime.sec < 10">0</span>{{ bestTime.sec }}
                    </p>
                    <p v-if="bestTime.sec == 0">&nbsp; -- : --</p>
                  </div>
                  <div class="timeUsed text-blue-600">
                    Time Used :
                    <span v-if="mins < 10">0</span>{{ mins }} :
                    <span v-if="secs < 10">0</span>{{ secs }}
                  </div>
                </div>

                <div v-show="!newBestTime">
                  <h3 class="font-bold text-xl text-red-600">BE FASTER !</h3>
                  <button
                    class="btn bg-green-400 hover:bg-green-900 hover:text-white text-black mx-3"
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
                  <h3 class="font-bold text-2xl text-red-600">
                    Your new recorded !
                  </h3>
                </div>
              </div>
            </div>

            <div class="mt-10">
              <button
                class="btn bg-pink-600 hover:bg-pink-900"
                @click="homePage"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="24"
                  height="24"
                >
                  <path d="M12 3L4 9v12h5v-7h6v7h5V9L12 3z" />
                </svg>
                <span class="text-white">Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="failPage">
      <div v-show="show == 4">
        <div class="flex flex-col items-center justify-center">
          <div class="box-wrapper mt-12">
            <div
              class="box flex flex-col py-8 items-center justify-center text-center bg-sl shadow-lg rounded-md"
            >
              <div class="font-extrabold text-2xl text-red-500">
                Try Again !!
              </div>
              <div
                class="text-justify mx-16 my-5 font-sans text-xl font-medium text-gray-700"
              >
                You've missed it
                <span class="text-black">{{ fails }}</span> times , please try
                again.
              </div>
            </div>
          </div>
          <div class="button-group mt-12 flex">
            <button
              class="btn bg-pink-600 hover:bg-pink-900 mx-3"
              @click="homePage"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                width="24"
                height="24"
              >
                <path d="M12 3L4 9v12h5v-7h6v7h5V9L12 3z" />
              </svg>
              <span class="text-white">Home</span>
            </button>
            <button
              v-show="mode === 'hardMode'"
              @click="
                () => {
                  gamePage()
                  resetMiss()
                  hardMode()
                }
              "
              class="playAgain btn bg-green-600 hover:bg-green-900 text-white mx-3"
            >
              Play again
            </button>
            <button
              v-show="mode === 'easyMode'"
              @click="
                () => {
                  gamePage()
                  resetMiss()
                  ezMode()
                }
              "
              class="playAgain btn bg-green-600 hover:bg-green-900 text-white mx-3"
            >
              Play again
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
#homePage {
  width: 100vw;
  height: 100vh;
  background: url("./assets/bg.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
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
  height: max-content;
  /* White background */
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.homepagebtn {
  width: 150px;
  height: 45px;
}
#hardmodebtn:hover span {
  display: none;
}

#hardmodebtn:hover:after {
  transition: 3s;
  color: white;
  content: "7 x 7 Table";
}

#easymodebtn:hover span {
  display: none;
}

/* Show "Easy Mode" text on hover over the button using pseudoElements */
#easymodebtn:hover:after {
  transition: 3s;
  color: white;
  content: "5 x 5 Table";
}
</style>
