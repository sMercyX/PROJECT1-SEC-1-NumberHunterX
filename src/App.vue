<script setup>
import { ref } from "vue"

const refreshPage = () => {
  location.reload() // Reloads the current page
}

const start = ref(false)

const missed = ref(0)
const hintsLeft = ref(3)

//style
const blockStyle = "hanjie-cell"
const noneBorder = "row-number"
const halfBlock = "hanjie-cell-half"
const correct = "MediumSeaGreen"
const unCorrect = "#f87171"

//block stores row and column of table
const blocks = []
//rows stores row name of table  แนวขวาง
const rows = ["t", "0", "1", "2", "3", "4", "5"]
//columns stores column name of table แนวตั่่ง
const columns = ["0", "a", "b", "c", "d", "e", "99"]
//checked blocks array
const checked = []
const win = ref(false)
const mins = ref(0)
const secs = ref(0)

//to stores row and column to blocks
rows.forEach((ele) => {
  blocks.push({ row: ele, column: [...columns] }) //use spread to easy copy data without reference
})

//level
const level = [
  {
    //level1
    correctBlock: [
      "c1",
      "b2",
      "c2",
      "d2",
      "a3",
      "b3",
      "c3",
      "d3",
      "e3",
      "c4",
      "b5",
      "c5",
      "d5",
    ],
    headerNums: [
      {
        id: "a0",
        result: "1",
      },
      {
        id: "bt",
        result: "2",
      },
      {
        id: "b0",
        result: "1",
      },
      {
        id: "c0",
        result: "5",
      },
      {
        id: "dt",
        result: "2",
      },
      {
        id: "d0",
        result: "1",
      },
      {
        id: "e0",
        result: "1",
      },
      {
        id: "01",
        result: "1",
      },
      {
        id: "02",
        result: "3",
      },
      {
        id: "03",
        result: "5",
      },
      {
        id: "04",
        result: "1",
      },
      {
        id: "05",
        result: "3",
      },
    ],
  },
  {
    //level2
    correctBlock: [
      "a1",
      "c1",
      "e1",
      "a2",
      "b2",
      "c2",
      "d2",
      "e2",
      "b3",
      "c3",
      "d3",
      "b4",
      "d4",
      "b5",
      "c5",
      "d5",
    ],
    headerNums: [
      {
        id: "a0",
        result: "2",
      },
      {
        id: "b0",
        result: "4",
      },
      {
        id: "ct",
        result: "3",
      },
      {
        id: "c0",
        result: "1",
      },
      {
        id: "d0",
        result: "4",
      },
      {
        id: "e0",
        result: "2",
      },
      {
        id: "01",
        result: "1 1 1",
      },
      {
        id: "02",
        result: "5",
      },
      {
        id: "03",
        result: "3",
      },
      {
        id: "04",
        result: "1  1",
      },
      {
        id: "05",
        result: "3",
      },
    ],
  },
  {
    //level3
    correctBlock: [
      "b1",
      "c1",
      "d1",
      "a2",
      "b2",
      "c2",
      "d2",
      "e2",
      "a3",
      "c3",
      "e3",
      "a4",
      "b4",
      "c4",
      "d4",
      "e4",
      "b5",
      "d5",
    ],
    headerNums: [
      {
        id: "a0",
        result: "3",
      },
      {
        id: "bt",
        result: "2",
      },
      {
        id: "b0",
        result: "2",
      },
      {
        id: "c0",
        result: "4",
      },
      {
        id: "dt",
        result: "2",
      },
      {
        id: "d0",
        result: "2",
      },
      {
        id: "e0",
        result: "3",
      },
      {
        id: "01",
        result: "3",
      },
      {
        id: "02",
        result: "5",
      },
      {
        id: "03",
        result: "1 1 1",
      },
      {
        id: "04",
        result: "5",
      },
      {
        id: "05",
        result: "1 1",
      },
    ],
  },
  {
    //level4
    correctBlock: ["b1", "d1", "a2", "c2", "e2", "a3", "e3", "b4", "d4", "c5"],
    headerNums: [
      {
        id: "a0",
        result: "2",
      },
      {
        id: "bt",
        result: "1",
      },
      {
        id: "b0",
        result: "1",
      },
      {
        id: "ct",
        result: "1",
      },
      {
        id: "c0",
        result: "1",
      },
      {
        id: "dt",
        result: "1",
      },
      {
        id: "d0",
        result: "1",
      },
      {
        id: "e0",
        result: "2",
      },
      {
        id: "01",
        result: "1 1",
      },
      {
        id: "02",
        result: "1 1 1",
      },
      {
        id: "03",
        result: "1 1",
      },
      {
        id: "04",
        result: "1 1",
      },
      {
        id: "05",
        result: "1",
      },
    ],
  },
  {
    //level5
    correctBlock: [
      "a1",
      "b1",
      "d1",
      "e1",
      "a2",
      "b2",
      "d2",
      "e2",
      "a4",
      "e4",
      "b5",
      "c5",
      "d5",
    ],
    headerNums: [
      {
        id: "at",
        result: "2",
      },
      {
        id: "a0",
        result: "1",
      },
      {
        id: "bt",
        result: "2",
      },
      {
        id: "b0",
        result: "1",
      },
      {
        id: "c0",
        result: "1",
      },
      {
        id: "dt",
        result: "2",
      },
      {
        id: "d0",
        result: "1",
      },
      {
        id: "et",
        result: "2",
      },
      {
        id: "e0",
        result: "1",
      },
      {
        id: "01",
        result: "2 2",
      },
      {
        id: "02",
        result: "2 2",
      },
      {
        id: "04",
        result: "1 1",
      },
      {
        id: "05",
        result: "3",
      },
    ],
  },
]

//current level
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

const genHint = () => {
  if (!start.value) {
    return
  }
  let randomIndex
  if (hintsLeft.value <= 0 || !hintable.value) {
    return
  }
  while (true) {
    randomIndex = Math.floor(Math.random() * correctBlock.value.length)
    if (
      !checked.includes(correctBlock[randomIndex]) &&
      !hints.value.includes(correctBlock[randomIndex])
    ) {
      hintsLeft.value--
      hints.value.push(correctBlock[randomIndex])
      checkHintable()
      return
    }
  }
}

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

//reset block style
const resetBlockStyles = () => {
  const allBlocks = document.querySelectorAll(".hanjie-cell")
  allBlocks.forEach((block) => {
    block.style.backgroundColor = "white"
    block.style.cursor = "pointer"
    block.textContent = ""
  })
}
function nextLevel() {
  currentLevel.value++
  if (currentLevel.value - 1 < level.length) {
    correctBlock.value = level[currentLevel.value - 1].correctBlock
    headerNums.value = level[currentLevel.value - 1].headerNums

    resetGame()
    resetBlockStyles()
    startGame()
  } else {
    alert("Congratulation! You have finished all levels!")
    resetGame()
  }
}

let timerInterval

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

//headerNums stores id and result of block of table head
const headerNums = ref(level[currentLevel.value - 1].headerNums)

const checkHeader = (id) => {
  const index = headerNums.value.findIndex((num) => num.id === id) //checking id in array of header numbers to find result
  return index >= 0 ? headerNums.value[index].result : ""
}

//addClickers is use to adding click to only block that should be (block that have a line)
const addClickers = (event) => {
  if (!start.value) {
    return
  }
  let targetTile = event.target //tile clicked
  let id = targetTile.id //clicked tile id
  let targetClasses = targetTile.className.split(" ") //split class into array
  if (checked.includes(id) || targetClasses.includes("marked")) {
    return
  }
  if (!id.includes("0") && !id.includes("99") && !id.includes("t")) {
    const blockColor = correctBlock.value.includes(id) ? correct : unCorrect
    const targetBlock = document.getElementById(id)
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
  }
}

function mark(event) {
  if (!start.value) {
    return
  }
  event.preventDefault()
  let targetTile = event.target //tile clicked
  let targetTileId = targetTile.id //clicked tile id
  let targetClasses = targetTile.className.split(" ") //split class into array
  if (checked.includes(targetTileId)) {
    //if already checked, return
    return
  }
  if (targetClasses.includes("marked")) {
    //remove marked class from the tile
    let markToRm = targetClasses.findIndex((tileClass) => {
      return tileClass === "marked"
    })
    targetClasses.splice(markToRm, 1)
    targetTile.className = targetClasses.join(" ")
    targetTile.style.backgroundColor = "white"
    return
  }
  targetClasses.push("marked")
  targetTile.className = targetClasses.join(" ")
  targetTile.style.backgroundColor = "grey"
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
  return winTemp
}

const show = ref(false)
</script>

<template>
  <!-- <div class="header pb-2 flex justify-center py-3">
    <div class="mb-4 text-4xl font-extrabold">NUMBER HUNTER</div>
  </div> -->

  <div class="homeCon" v-show="!show">
    <h1 class="text-4xl font-extrabold text-center mb-4">NUMBER HUNTER</h1>
    <button
      @click="show = !show"
      class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-white disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
    >
      Start
    </button>

    <div class="tutorials px-4 py-2 center">
      <h1 class="text-center text-2xl font-bold">tutorials</h1>
      <h2 class="px-14">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
        temporibus, cum harum natus ea dicta sequi accusantium ducimus voluptas
        deserunt eaque, earum eos. Similique, architecto. Ullam debitis error
        ipsa unde? Numquam doloribus dolorem aspernatur libero eligendi ab
        molestias, dolor rem sunt suscipit nihil, totam, ut nulla quae commodi!
        Quod a vero tempore atque! Perspiciatis, eum nisi quas nihil tempore
        totam!
      </h2>
    </div>
  </div>

  <!-- main tutorial -->

  <div class="container p-10 m-auto w-full" v-show="show">
    <section class="flex items-center justify-end">
      <div>
        Time: <span v-if="mins < 10">0</span>{{ mins }} :
        <span v-if="secs < 10">0</span>{{ secs }}
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
      <button>«</button>
      <button class="join-item btn">Level {{ currentLevel }}</button>
      <button>»</button>
    </div>

    <section class="flex items-center justify-between">
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
        @click="refreshPage()"
      >
        RESET
      </button>

      <button v-if="win" class="join-item btn" @click="nextLevel">
        NEXT LEVEL
      </button>
    </section>
    <div class="flex justify-center">
      <div v-if="win">Stage cleared!!!</div>
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

.homeCon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #3498db; /* สีพื้นหลัง */
  color: #fff; /* สีข้อความ */
}

.title {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2em;
  margin-bottom: 20px;
}
</style>

<!-- class="bg-transparent hover:bg-#34495e text-white  hover:text-white py-1 px-2 mt-2 border border-blue-500 hover:border-transparent rounded" -->
