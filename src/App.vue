<script setup>
import { ref } from "vue"
const level = [
  {
    solution: [
      "a1",
      "b1",
      "c1",
      "d1",
      "b2",
      "d2",
      "e2",
      "b3",
      "d3",
      "b4",
      "d4",
      "b5",
      "c5",
      "d5",
      "e5",
    ],
    hintsCol: [1, 5, `1\n1`, 5, `1\n1`],
    hintsRow: [4, "1 2", "1 1", "1 1", 4],
  },
  {
    solution: [
      "c1",
      "d1",
      "e1",
      "a2",
      "c2",
      "d2",
      "e2",
      "a3",
      "e3",
      "a4",
      "b4",
      "e4",
      "a5",
    ],
    hintsCol: [4, 1, 2, 2, 4],
    hintsRow: [3, "1 3", "1 1", "2 1", 1],
  },
]

// let currentLevel = 0
const currentLevel = ref(0)
const solution = level[currentLevel.value].solution
const hintsCol = level[currentLevel.value].hintsCol
const hintsRow = level[currentLevel.value].hintsRow

// const solution = [
//   "a1",
//   "b1",
//   "c1",
//   "d1",
//   "b2",
//   "d2",
//   "e2",
//   "b3",
//   "d3",
//   "b4",
//   "d4",
//   "b5",
//   "c5",
//   "d5",
//   "e5",
// ]
const failed = ref(0)
const checked = []

const win = ref(false)

const time = ref(0)

const start = ref(false)

const interval = ref(null)

function check(event) {
  if (!start.value) {
    return
  }
  const clickedBox = event.target
  const boxId = clickedBox.id
  const boxClass = clickedBox.className.split(" ")

  if (checked.includes(boxId) || boxClass.includes("marked")) {
    return
  }

  checked.push(boxId)
  if (solution.includes(boxId)) {
    clickedBox.style.backgroundColor = "green"
    clickedBox.style.cursor = "default"
  } else {
    failed.value++
    clickedBox.style.backgroundColor = "red"
    clickedBox.style.cursor = "not-allowed"
  }

  checkWin()
}

function mark(event) {
  if (!start.value) {
    return
  }
  event.preventDefault()
  const targetBox = event.target
  const targetId = targetBox.id
  let targetClass = targetBox.className.split(" ")
  if (checked.includes(targetId)) {
    return
  }
  if (targetClass.includes("marked")) {
    const markToRm = targetClass.findIndex((box) => {
      return box === "marked"
    })
    targetClass.splice(markToRm, 1)
    targetBox.className = targetClass.join(" ")
    targetBox.style.backgroundColor = "white"
    return
  }
  targetClass.push("marked")
  targetBox.className = targetClass.join(" ")
  targetBox.style.backgroundColor = "grey"
}

function startGame() {
  start.value = true

  interval.value = setInterval(() => {
    time.value++
    if (win.value) {
      clearInterval(interval.value)
    }
  }, 1000)
}

function resetGame() {
  start.value = false
  checked.splice(0, checked.length)
  failed.value = 0
  win.value = false
  time.value = 0
  clearInterval(interval.value)

  const allBlocks = document.querySelectorAll(".block")
  allBlocks.forEach((block) => {
    block.style.backgroundColor = "white"
    block.style.cursor = "pointer"
  })
}

function checkWin() {
  let winTemp = true
  solution.forEach((checkCell) => {
    if (!checked.includes(checkCell)) {
      winTemp = false
    }
  })
  win.value = winTemp
}

function formatTime(time) {
  const minutes = `0${Math.floor(time / 60)}`.slice(-2)
  const seconds = `0${time % 60}`.slice(-2)
  return `${minutes} : ${seconds}`
}

function nextLevel() {
  currentLevel.value++
  if (currentLevel.value <= level.length) {
    solution.value = level[currentLevel.value].solution
    hintsCol.value = level[currentLevel.value].hintsCol
    hintsRow.value = level[currentLevel.value].hintsRow
    resetGame()
  }
}
</script>

<template>
  <div class="flex justify-center">
    <h1 class="text-3xl font-semibold">Number Hunter X</h1>
  </div>
  <br />
  <hr />
  <br />
  <div id="playZone" class="flex justify-center">
    <div id="hintsCol" class="bg-gray-500">
      <!-- <div id="hintC">1</div>
      <div id="hintC">5</div>
      <div id="hintC">1<br />1</div>
      <div id="hintC">5</div>
      <div id="hintC">1<br />1</div> -->
      <div v-for="(hint, index) in hintsCol" :key="index" id="hintC">
        {{ hint }}
      </div>
    </div>
    <div id="hintsRow" class="bg-gray-500">
      <!-- <div id="hintR">4</div>
      <div id="hintR">1&nbsp2</div>
      <div id="hintR">1&nbsp1</div>
      <div id="hintR">1&nbsp1</div>
      <div id="hintR">4</div> -->
      <div v-for="(hint, index) in hintsRow" :key="index" id="hintR">
        {{ hint }}
      </div>
    </div>
    <div id="board">
      <div class="block" id="a1" @click="check" @click.right="mark"></div>
      <div class="block" id="b1" @click="check" @click.right="mark"></div>
      <div class="block" id="c1" @click="check" @click.right="mark"></div>
      <div class="block" id="d1" @click="check" @click.right="mark"></div>
      <div class="block" id="e1" @click="check" @click.right="mark"></div>

      <div class="block" id="a2" @click="check" @click.right="mark"></div>
      <div class="block" id="b2" @click="check" @click.right="mark"></div>
      <div class="block" id="c2" @click="check" @click.right="mark"></div>
      <div class="block" id="d2" @click="check" @click.right="mark"></div>
      <div class="block" id="e2" @click="check" @click.right="mark"></div>

      <div class="block" id="a3" @click="check" @click.right="mark"></div>
      <div class="block" id="b3" @click="check" @click.right="mark"></div>
      <div class="block" id="c3" @click="check" @click.right="mark"></div>
      <div class="block" id="d3" @click="check" @click.right="mark"></div>
      <div class="block" id="e3" @click="check" @click.right="mark"></div>

      <div class="block" id="a4" @click="check" @click.right="mark"></div>
      <div class="block" id="b4" @click="check" @click.right="mark"></div>
      <div class="block" id="c4" @click="check" @click.right="mark"></div>
      <div class="block" id="d4" @click="check" @click.right="mark"></div>
      <div class="block" id="e4" @click="check" @click.right="mark"></div>

      <div class="block" id="a5" @click="check" @click.right="mark"></div>
      <div class="block" id="b5" @click="check" @click.right="mark"></div>
      <div class="block" id="c5" @click="check" @click.right="mark"></div>
      <div class="block" id="d5" @click="check" @click.right="mark"></div>
      <div class="block" id="e5" @click="check" @click.right="mark"></div>
    </div>
  </div>
  <div class="flex justify-center text-xl">
    Missed: <span class="text-red-500">{{ failed }}</span>
  </div>
  <div class="flex justify-center text-xl">
    Time:<span>{{ formatTime(time) }}</span>
  </div>
  <div class="flex justify-center space-x-5">
    <button
      v-if="!start"
      class="px-3 py-1 bg-green-600 rounded-lg text-white"
      @click="startGame"
    >
      Start
    </button>
    <button
      v-else
      @click="resetGame"
      class="px-3 py-1 bg-red-600 rounded-lg text-white"
    >
      Reset
    </button>
  </div>

  <div class="flex justify-end pt-10">
    <button
      @click="nextLevel"
      class="px-3 py-1 text-white bg-blue-900 text-lg rounded-lg"
    >
      Next Level
    </button>
  </div>

  <div v-if="win" class="flex justify-center text-2xl text-green-600">
    !!!!Success!!!!
  </div>
</template>

<style scoped></style>
