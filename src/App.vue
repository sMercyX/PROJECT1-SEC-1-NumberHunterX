<script setup>
import { ref, watchEffect, watch } from 'vue'
import easyLevel from './assets/levels/easyLevel.json'
import hardLevel from './assets/levels/hardLevel.json'
import tableSize from './tableSize.json'


// game state
let show = ref(0) // เก็บค่าpageต่างๆ (for v-show)
let mode = 'easyMode' //modeที่เลือก default เป็นeasyMode
let gameSize = ref(0) // easy(5ช่อง) =0 hard(7ช่อง) =1
const randomlv = [] //เก็บlevelที่randomแล้ว 5 ด่าน
let level = [...easyLevel] //เก็บarrayของlevel ปจบไว้ defaultให้เป็นeasyก่อน
const currentLv = ref(0) //lv ที่อยู่x0[]
const start = ref(false)  //เมื่อstart=true ให้สร้างตัวแปรตาราง และเริ่มเกม
let save = ref()

//game data
let hintsLeft = ref(3)  // จำนวนhintที่เหลือ
let hintable = ref(false)   
const missed = ref(0) //เก็บค่าmissed
const win = ref(false) 
let fails = ref(0)  //เก็บค่าfails
const checked = ref([]) 
const marked = [] 

// block
let blocks = ref([])
let rows
let columns
let headerNums = []
let correctBlocks = [] //correctBlockss stores block that when click its will change to correct color
const playCellElements = ref(null) //เก็บrefของblockแต่ละตัวที่กด

// tutorial state
let tutorial = ref(0) // เก็บvalue pageของtutorial++
const tutorialMode = ref(1) // เก็บvalueของmodeในtutorial

// time
let mins = ref(0)
let secs = ref(0)
let timeUsed = ref(0) //เวลาที่ใช้ทั้งหมดเป็นsec
let timerInterval
let bestTime = ref({})
let newBestTime = ref(false) //true false  ไว้เปลี่ยนตอนTimeUse น้อยกว่า save

// style
const blockStyle = 'hanjie-cell'
const noneBorder = 'row-number'
const halfBlock = 'hanjie-cell-half'
const correct = 'MediumSeaGreen'
const unCorrect = '#f87171'
let healthStatus = 'bg-green-400'


const genBlock = () => {
  blocks.value = []
  rows = tableSize[gameSize.value].rows
  columns = tableSize[gameSize.value].columns
  rows.forEach((ele) => {
    blocks.value.push({ row: ele, column: [...columns] })
  })
} // สร้างบล็อกของเกม กำหนดค่าไว้ในตัวแปรblock

const randomLevel = () => {
  randomlv.splice(0)
  while (randomlv.length < 5) {
    let randomIndex = Math.floor(Math.random() * level.length)
    if (randomlv.length == 0) randomlv.push(level[randomIndex])
    else if (
      !randomlv.some((lv) => lv.puzzle == level[randomIndex].puzzle) 
    ) {
      randomlv.push(level[randomIndex])
    }
  }
} // สร้างเลเวลของเกมที่สุ่มได้ออกมาจากข้อมูลเลเวลที่มีอยู่

const calTimeToMin = (time) => {
  let min = Math.floor(time / 60) 
  let sec = time % 60
  return { min, sec } 
} // คำนวณเวลาจากวินาทีให้เป็นนาทีและวินาที

const timer = (op) => {
  if (op) {
    timerInterval = setInterval(() => {
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
} // ฟังก์ชันนี้ใช้สำหรับจับเวลาเกม โดยเริ่มต้นหรือหยุดการนับเวลาตามที่กำหนด

const resetHint = () => {
  if (mode === 'easyMode') {
    hintsLeft.value = 3
  } else if (mode === 'hardMode') {
    hintsLeft.value = 5
  }
}
const resetMiss = () => {
  missed.value = 0
}

// const resetNewBestTime = () => {
//   newBestTime.value = false
// }

const getPlayCellTarget = (id) => {
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
const resetGame = () => {
  start.value = false
  checked.value.splice(0)
  win.value = false
  clearInterval(timerInterval)
  marked.splice(0)
  headerNums = []
  hintable.value = false
}
const resetTime = () => {
  currentLv.value = 0
  mins.value = 0
  secs.value = 0
  timeUsed.value = 0
}
const setBestTime = () => {
  bestTime.value = calTimeToMin(save.value)
}
const getSave = () => {
  save.value = localStorage.getItem(mode)
  if (save.value === null || save.value === undefined) {
    save.value = 0
    setBestTime()
  } else {
    save.value = JSON.parse(save.value)
    setBestTime()
  }
}
const homePage = () => {
  show.value = 0
  tutorial.value = 0
}
const tutorialPage = () => {
  show.value = 1
}
const gamePage = () => {
  resetTime()
  resetGame()
  resetHint()
  //resetNewBestTime()
  resetMiss()
  genBlock()
  randomLevel()
  getSave()
  show.value = 2
  newBestTime.value = false
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
const modalPage = () => {
  show.value = 3
}
const failPage = () => {
  show.value = 4
}

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
  const index = headerNums.findIndex((num) => num.id === id)
  return index >= 0 ? headerNums[index].result : ''
}
const startGame = () => {
  correctBlocks = randomlv[currentLv.value].correctBlocks
  headerNums = randomlv[currentLv.value].headerNums
  start.value = true
  timer(true)
  if (hintsLeft.value >= 0) {
    hintable.value = true
  }
}
const checkNewBestTime = () => {
  if (save.value === 0 || timeUsed.value < save.value) {
    newBestTime.value = true
    save.value = timeUsed.value
  } else newBestTime.value = false
}

const nextLevel = () => {
  currentLv.value++
  if (currentLv.value < randomlv.length) {
    resetBlockStyles()
    resetGame()
    resetHint()
    startGame()
    win.value = false
  } else {
    checkNewBestTime()
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
    new Event('click')
  )
}

watchEffect(() => {
  let checkedCorrect = checked.value.filter((block) => {
    return correctBlocks.includes(block)
  })
  if (hintsLeft.value <= 0 || checkedCorrect.length === correctBlocks.length) {
    hintable.value = false
  }
})
watchEffect(() => {
  if (missed.value / fails.value < 0.25) {
    healthStatus = 'bg-green-400'
  } else if (missed.value / fails.value < 0.5) {
    healthStatus = 'bg-yellow-400'
  } else if (missed.value / fails.value < 0.75) {
    healthStatus = 'bg-orange-400'
  } else {
    healthStatus = 'bg-red-400'
  }
}) // do every time that varable in function have change 
const addClickers = (event) => {
  if (!start.value || win.value) {
    return
  }
  let targetBlock = event.target
  let id = targetBlock.id
  if (checked.value.includes(id) || marked.includes(targetBlock)) {
    return
  }
  if (!id.includes('0') && !id.includes('99') && !id.includes('t')) {
    const blockColor = correctBlocks.includes(id) ? correct : unCorrect
    targetBlock.style.backgroundColor = blockColor
    if (blockColor === unCorrect) {
      targetBlock.textContent = 'x'
      missed.value++
    }
    checked.value.push(id)

    if (missed.value >= fails.value) {
      failPage()
    }
  }
}

const mark = (event) => {
  event.preventDefault()
  if (!start.value || win.value) return
  let targetBlock = event.target
  let targetBlockId = targetBlock.id
  if (checked.value.includes(targetBlockId)) return
  let markId
  if (marked.includes(targetBlock)) {
    targetBlock.style.backgroundColor = ''
    let unmarked = marked.findIndex((block) => block.id === targetBlock.id)
    marked.splice(unmarked, 1)
    markId = marked.map((mark) => mark.id)
  } else if (
    !marked.includes(targetBlock) &&
    !targetBlockId.includes('0') &&
    !targetBlockId.includes('99') &&
    !targetBlockId.includes('t')
  ) {
    marked.push(event.target)
    markId = marked.map((mark) => mark.id)
    targetBlock.style.backgroundColor = 'grey'
  }
}

// sourceว่าดูอะไร แต่เป็ฯobject ต้อง.valueไว้ดู.o arry
watch(checked.value, () => {
  let winTemp = true
  correctBlocks.forEach((mustCheckCell) => {
    if (!checked.value.includes(mustCheckCell)) winTemp = false
  })
  win.value = winTemp
  if (win.value) timer(false)
}) // อยากแค่ตัวแปรตัวเดียว 

const toggleTutorialMode = (mode) => { // สลับpageสำหรับหน้าtutorial
  if (mode === 'general') {
    tutorial.value = 0
    tutorialMode.value = 1
  } else if (mode === 'gameMode') {
    tutorialMode.value = 2
    tutorial.value = 5
  }
} 
</script>

<template>
  <div class="gamePlay">
    <section v-show="show == 0" id="homePage">
      <div class="header p-2 flex justify-center py-3">
        <div class="font-extrabold HeaderName">NUMBER HUNTER</div>
      </div>
      <div class="flex flex-col items-center justify-center">
        <button
          @click="ezMode"
          id="easymodebtn"
          class="btn mx-5 my-3 text-white w-30 bg-green-600 hover:bg-green-700 font-extrabold text-xl font-sans homepagebtn"
        >
          <span>Easy mode</span>
        </button>
        <button
          @click="hardMode"
          id="hardmodebtn"
          class="btn mx-5 my-3 text-white w-30 bg-red-600 hover:bg-red-700 font-extrabold text-xl font-sans homepagebtn"
        >
          <span>Hard mode</span>
        </button>
        <button
          @click="tutorialPage"
          class="btn w-30 mx-5 my-3 bg-slate-400 hover:bg-yellow-600 text-black font-extrabold text-xl font-sans homepagebtn"
        >
          Tutorial
        </button>
      </div>
    </section>

    <!--tutorial page-->
    <section id="tutorialPage">
      <!--main tutorial-->
      <div class="tutorial" v-show="show == 1">
        <div class="min-h-screen flex flex-col items-center">
          <div class="header p-2 flex justify-center py-3">
            <div class="font-extrabold HeaderName">Tutorial</div>
          </div>

          <div class="box-wrapper mt-8">
            <div class="box flex flex-col py-8">
              <div class="ml-20 flex justify-end mx-2">
                <button
                  class="btn mx-2"
                  @click="toggleTutorialMode('general')"
                  :class="{
                    'bg-orange-500': tutorial >= 5,
                    'bg-gray-500': tutorial < 5,
                  }"
                >
                  <p>General</p>
                </button>
                <button
                  class="btn mx-2"
                  @click="toggleTutorialMode('gameMode')"
                  :class="{
                    'bg-blue-500': tutorial < 5,
                    'bg-gray-500': tutorial >= 5,
                  }"
                >
                  <p>Game mode</p>
                </button>
              </div>
              <div class="changePage">
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
                    <img src="./assets/t5.png" class="w-full h-auto" />
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
                          You're allowed up to 4 mistakes. If you make 5
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
                          You're allowed up to 9 mistakes. If you make 10
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
                  :disabled="tutorial === 0"
                  @click="tutorial--"
                  class="btn bg-blue-400 text-white mx-4"
                >
                  &laquo;
                </button>
                <div class="font-bold font-sans flex items-center">
                  {{ tutorial + 1 }} / 7
                </div>

                <button
                  :disabled="tutorial >= 6"
                  @click="tutorial++"
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
      <div class="container px-10 pb-3 m-auto w-full" v-if="show == 2">
        <div class="header p-2 flex justify-center py-3">
          <div v-show="mode === 'easyMode'" class="font-extrabold HeaderName">
            EASY MODE
          </div>
          <div v-show="mode === 'hardMode'" class="font-extrabold HeaderName">
            HARD MODE
          </div>
        </div>
        <section class="flex items-center justify-between">
          <div
            class="text-center align-middle shadow-md w-45 bg-base-200 p-2 py-4 font-sans font-semibold order-first"
            style="border-radius: 9px"
          >
            <div id="bestTimePlayed" class="flex">
              Best Time :&nbsp
              <p v-if="bestTime.sec == 0 && bestTime.min == 0">
                &nbsp; -- : --
              </p>
              <p v-else>
                <span v-if="bestTime.min < 10">0</span>{{ bestTime.min }} :
                <span v-if="bestTime.sec < 10">0</span>{{ bestTime.sec }}
              </p>
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
              @click="startGame"
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
              <div class="">Level {{ currentLv + 1 }}</div>
            </div>
            <button
              v-if="win&&currentLv+1!=5"
              class="btn bg-green-500 text-white hover:bg-green-700"
              @click="nextLevel"
            >
              NEXT LEVEL
            </button>
            <button
              v-if="win&&currentLv+1===5"
              class="btn bg-green-500 text-white hover:bg-green-700"
              @click="nextLevel"
            >
              END GAME
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
      <div class="modal-container flex-col" v-show="show == 3">
        <div class="header p-2 flex justify-center py-3">
          <div class="font-extrabold HeaderName">NUMBER HUNTER</div>
        </div>
        <div id="" class="min-h-screen">
          <div class="flex flex-col items-center justify-center">
            <div class="box-wrapper2 mt-12">
              <div
                class="box2 flex flex-col p-12 py-8 items-center justify-center text-center bg-stone-100 shadow-lg rounded-md"
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
                    <p v-if="bestTime.sec == 0">&nbsp; -- : --</p>
                    <p v-else>
                      <span v-if="bestTime.min < 10">0</span
                      >{{ bestTime.min }} :
                      <span v-if="bestTime.sec < 10">0</span>{{ bestTime.sec }}
                    </p>
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
                    New Best Time !!!
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
        <div class="header p-2 flex justify-center py-3">
          <div class="font-extrabold HeaderName">NUMBER HUNTER</div>
        </div>
        <div class="flex flex-col items-center justify-center">
          <div class="box-wrapper2 mt-12">
            <div
              class="box2 flex flex-col py-8 items-center justify-center text-center bg-sl shadow-lg rounded-md"
            >
              <div class="font-extrabold text-2xl text-red-500">
                Try Again !!
              </div>
              <div
                class="text-justify mx-16 my-5 font-sans text-xl font-medium text-gray-700"
              >
                You've missed
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
  background: url('./assets/bg.png');
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

.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.btn {
  border-radius: 999px;
  margin-top: 3%;
}

.box-wrapper {
  max-width: 750px;
  min-height: 340px;
  width: 80%;
  margin: 5%;
}

.box-wrapper2 {
  max-width: 800px;
}

.box {
  height: max-content;
  border-radius: 30px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.box2 {
  height: max-content;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.homepagebtn {
  width: 250px;
  height: 80px;
  font-size: 30px;
}

#hardmodebtn:hover span {
  display: none;
}

#hardmodebtn:hover:after {
  transition: 3s;
  color: white;
  content: '7 x 7 Table';
}

#easymodebtn:hover span {
  display: none;
}

#easymodebtn:hover:after {
  transition: 3s;
  color: white;
  content: '5 x 5 Table';
}

.HeaderName {
  font-family: 'Luckiest Guy', cursive;
  letter-spacing: 3px;
  font-size: 80px;
}

@media only screen and (max-width: 666px) {
  .HeaderName {
    font-size: 40px;
    letter-spacing: 2px;
  }

  #homePage {
    background: url('./assets/bg2.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .homepagebtn {
    width: 150px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
