<script setup>
import { ref, watchEffect, watch } from 'vue'
import easyLevel from './assets/levels/easyLevel.json'
import hardLevel from './assets/levels/hardLevel.json'
import tableSize from './assets/levels/tableSize.json'

// game state
let show = ref(0)
let mode = 'easyMode' //modeที่เลือก default เป็นeasyMode
let gameSize = ref(0) // easy(5ช่อง) =0 hard(7ช่อง) =1
const randomlv = [] //เก็บlevelที่randomแล้ว 5 ด่าน
let level = [...easyLevel] //เก็บarrayของlevel ปจบไว้ defaultให้เป็นeasyก่อน
const currentLv = ref(0) //lv ที่อยู่
const start = ref(false)
let hintsLeft = ref(3)
let hintable = ref(false)
const missed = ref(0) //เก็บค่าmissed
const win = ref(false)
let fails = ref(0) //เก็บค่าfails
const checked = ref([])
const marked = []
let save = ref() //ค่าbesttimeที่เก็บไว้เป็นวินาที

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
let bestTime = ref({}) //เก็บ
let newBestTime = ref(false) //true false  ไว้เปลี่ยนตอนTimeUse น้อยกว่า save

let healthStatus = 'bg-green-400'
const genBlock = () => {
  blocks.value = []
  //rows stores row name of table
  rows = tableSize[gameSize.value].rows //tableSize[1].rows //in tablesize.json "rows": ["t", "0", "1", "2", "3", "4", "5", "6", "7"]
  columns = tableSize[gameSize.value].columns //tableSize[1].colums //in tablesize.json "columns": ["0", "a", "b", "c", "d", "e", "f", "g", "99"]
  rows.forEach((ele) => {
    //ใส่ {row:["t", "0", "1", "2", "3", "4", "5", "6", "7"] , column: ["0", "a", "b", "c", "d", "e", "f", "g", "99"] } ใน arrayที่ชื่อว่าblocks
    blocks.value.push({ row: ele, column: [...columns] })
  })
}
const randomLevel = () => {
  randomlv.splice(0) //reset array randomlv
  while (randomlv.length < 5) {
    //ถ้าด่านใน array randomlv ยังไม่ครบ 5ด่าน ให้whileต่อ
    let randomIndex = Math.floor(Math.random() * level.length) //level.length ที่อยู่ในfile json
    if (!randomlv.some((lv) => lv.puzzle === level[randomIndex].puzzle)) {
      //ถ้า lv.puzzle = เลขpuzzle ของตัวที่สุ่มมา ไม่push
      randomlv.push(level[randomIndex])
    }
  }
}
const calTimeToMin = (time) => {
  //รับtimeที่เป็นวินาที
  let min = Math.floor(time / 60)
  let sec = time % 60
  return { min, sec } //คำนวนแล้วreturnเป็น obj min และsec
}
const timer = (op) => {
  if (op) {
    timerInterval = setInterval(() => {
      let { min, sec } = calTimeToMin(++timeUsed.value) //เรียกcalTimeToMin มาใช้แล้วdesturcture แล้วเก็บเป็นตัวแปรmin , sec
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

const resetHint = () => {
  //ถ้าmodeเป็นeasyMode hint 3 ถ้าโหมดเป็นhardmode hintเป็น 5
  if (mode === 'easyMode') {
    hintsLeft.value = 300
  } else if (mode === 'hardMode') {
    hintsLeft.value = 500
  }
}

const getPlayCellTarget = (id) => {
  //เอาtargetที่ถูกเก็บอยู่ในplayCellElement ผ่านการเปรียบเทียบid
  return playCellElements.value.find((cellDom) => cellDom.id === id)
}

const resetBlockStyles = () => {
  //reset background จากidในplayCellElements
  playCellElements.value.forEach((id) => {
    id.style.backgroundColor = ''
  })
}
const resetGame = () => {
  //resetค่าที่ต้องเปลี่ยนในแต่ละlevel
  checked.value.splice(0)
  win.value = false
  clearInterval(timerInterval)
  marked.splice(0)
  headerNums = []
  hintable.value = false
}
const resetTime = () => {
  //resetเวลาที่ถูกใช้
  currentLv.value = 0
  mins.value = 0
  secs.value = 0
  timeUsed.value = 0
}
const getSave = () => {
  save.value = localStorage.getItem(mode) //เอาเวลาbesttimeมาตามชื่อmode และเก็บลงในตัวแปรชื่อsave
  if (save.value === null || save.value === undefined) {
    save.value = 0
    bestTime.value = calTimeToMin(save.value) //ถ้าหาไม่เจอก็ให้ set bestime เป็น0
  } else {
    save.value = JSON.parse(save.value) //แปลงค่าจากStringที่เอามาจากjsonเป็นnumberผ่าน JSON.parse
    bestTime.value = calTimeToMin(save.value)
  }
}
const homePage = () => {
  show.value = 0
}
const tutorialPage = () => {
  show.value = 1
  tutorial.value = 0 //reset tutorial ให้กลับไปหน้า0
}
const gamePage = () => {
  //reset ทุกค่า //genช่อง //randomlevel //เอาbesttime ที่ถูกเก็บในlocalstorageมา
  resetTime()
  resetGame()
  resetHint()
  start.value = false
  newBestTime.value = false
  missed.value = 0
  genBlock()
  randomLevel()
  getSave()
  show.value = 2
}
const ezMode = () => {
  //จับการคลิกที่ปุ่มeasy mode แล้ว asssign ค่าต่างๆให้
  gameSize.value = 0
  fails.value = 5
  mode = 'easyMode'
  level = [...easyLevel] //spreadเพื่อเอามาแค่value //จะได้ไม่ใช้referenceที่เดียวกัน
  gamePage()
}
const hardMode = () => {
  //จับการคลิกที่ปุ่มhard mode แล้ว asssign ค่าต่างๆให้
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
const checkBlockStyle = (id) => {
  if (id.includes('0') || id.includes('t')) return `hanjie-cell-half row-number`
  if (id.includes('99')) return `hanjie-cell row-number`
  return 'hanjie-cell' //ถ้าไม่ใช่headerก็ส่งแค่blockstyleไป
}

const checkHeader = (id) => {
  const index = headerNums.findIndex((block) => block.id === id)
  return index >= 0 ? headerNums[index].result : '' //รับid ของblockมา แล้วcheck ว่าเป็นheadernumมั้ยผ่านการเปรียบเทียบid
}
const startGame = () => {
  correctBlocks = randomlv[currentLv.value].correctBlocks //เอาค่าที่randomมาใส่ลงไป ตอนจะเริ่ม
  headerNums = randomlv[currentLv.value].headerNums
  start.value = true //ทำให้ปุ่มstart หายไป และช่องกดได้
  timer(true)
  hintable.value = true //ทำให้ปุ่มhintกดได้
}
const checkNewBestTime = () => {
  //checkว่าเวลาที่ใช้ น้อยกว่าเวลาที่saveไว้รึป่าว
  if (save.value === 0 || timeUsed.value < save.value) {
    newBestTime.value = true //ถ้าเวลาที่ใช้น้อยกว่าก็ newBestTime เป็นtrue //New Best Time
    save.value = timeUsed.value
  } else newBestTime.value = false //ถ้าเวลาที่ใช้น้อยกว่าก็ newBestTime เป็นFalse //Be faster
}
const nextLevel = () => {
  currentLv.value++
  if (currentLv.value < randomlv.length) {
    //ถ้ายังไม่ใช่level 5(สุดท้าย)
    resetBlockStyles()
    resetGame()
    resetHint()
    startGame()
    win.value = false
  } else {
    checkNewBestTime()
    localStorage.setItem(mode, JSON.stringify(save.value)) //ใช้modeเป็นkeyในการเก็บลงstorage
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
  if (!hintable.value || hintableBlocks.length === 0) {
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
})
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
    const blockColor = correctBlocks.includes(id) ? 'MediumSeaGreen' : '#f87171'
    targetBlock.style.backgroundColor = blockColor
    if (blockColor === '#f87171') {
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
  let targetBlock = event.target
  let targetBlockId = targetBlock.id
  if (!start.value || win.value || checked.value.includes(targetBlockId)) return
  if (marked.includes(targetBlock)) {
    targetBlock.style.backgroundColor = ''
    let unmarked = marked.findIndex((block) => block.id === targetBlock.id)
    marked.splice(unmarked, 1)
  } else if (
    !marked.includes(targetBlock) &&
    !targetBlockId.includes('0') &&
    !targetBlockId.includes('99') &&
    !targetBlockId.includes('t')
  ) {
    marked.push(event.target)
    targetBlock.style.backgroundColor = 'grey'
  }
}
watch(checked.value, () => {
  let winTemp = correctBlocks.every((mustCheckCell) => {
    return checked.value.includes(mustCheckCell)
  })
  win.value = winTemp
  if (win.value) {
    timer(false)
    if (currentLv.value + 1 === 5) {
      //ถ้าเล่นจบให้เปลี่ยนหน้าเอง
      nextLevel()
    }
  }
})
const toggleTutorialMode = (mode) => {
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
                      class="text-lg text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
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
                      class="text-lg text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
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
                      class="text-lg text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
                    >
                      <h1 class="font-bold text-xl mb-2">Solving the Puzzle</h1>
                      To fill a square, simply
                      <i class="text-pink-600"> left-click</i> it. If the
                      decision is correct, it turns green; otherwise, it turns
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
                      class="text-lg text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
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
                      class="text-lg text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
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
                      class="text-lg text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
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
                      class="text-lg text-justify mb-4 md:mb-8 p-6 font-sans font-medium"
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
              class="font-sans font-medium text-base"
            >
              <td
                ref="playCellElements"
                :class="checkBlockStyle(col + block.row)"
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
                hintable
                  ? 'btn border-none bg-yellow-400 hover:bg-yellow-200 text-black m-1'
                  : 'btn border-none bg-gray-600 cursor-not-allowed m-1'
              "
              :disable="hintable ? false : true"
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
                    @click="gamePage()"
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
              @click="hardMode"
              class="playAgain btn bg-green-600 hover:bg-green-900 text-white mx-3"
            >
              Play again
            </button>
            <button
              v-show="mode === 'easyMode'"
              @click="ezMode"
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
  border: 2px solid #000;
  text-align: center;
}

.hanjie-cell-half {
  width: 70px;
  height: 30px;
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
