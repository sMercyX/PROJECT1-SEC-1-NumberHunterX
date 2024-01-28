<script setup>
import { computed, hasInjectionContext, ref } from "vue"
const level = [
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
  "a5",
  "b5",
  "c5",
  "d5",
  "e5",
]

// unused
// const rowHints = ref([[4], [1, 2], [1, 1], [1, 1], [4]]);
// const colHints = ref([[], [1], [5], [1, 1], [5], [1]]);

const failed = ref(0)
const checked = []

const win = ref(false)

function mark(event) {
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

function check(event) {
  const clickedTile = event.target
  const clickedTileId = clickedTile.id
  let targetClasses = clickedTile.className.split(" ")

  if (checked.includes(clickedTileId) || targetClasses.includes("marked")) {
    //check if already checked or marked by player
    return
  }

  checked.push(clickedTileId)
  if (level.includes(clickedTileId)) {
    clickedTile.style.backgroundColor = "green"
    clickedTile.style.cursor = "default"
  } else {
    failed.value++
    clickedTile.style.backgroundColor = "red"
    clickedTile.style.cursor = "not-allowed"
  }

  checkWin()
}

function checkWin() {
  let winTemp = true
  level.forEach((mustCheckCell) => {
    if (!checked.includes(mustCheckCell)) {
      winTemp = false
    }
  })
  console.log(winTemp)
  win.value = winTemp
}

function endGame() {}

// ------------------------------------------

const Time = ref(10)

const TimeInterval = setInterval(() => {
  Time.value--
  if (Time.value == -1) {
    clearInterval(TimeInterval)
  }
}, 1000)

const isTimeUp = () => {
  return Time.value <= 0
}

const hintCount = ref(2)

let randomBox = ref([])

const hintClicked = () => {
  if (hintCount.value > 0) {
    hintCount.value -= 1
    const arrayRandom = level[Math.floor(Math.random() * level.length)]
    randomBox.value.push(arrayRandom)
    
  }

}


// -------------------------------------------
</script>

<template>
  <div>
    <!-- Grid inspired by https://github.com/JosephCoburn/nonogram-puzzle -->
    <div
      id="playGrid"
      class="container mx-auto mt-10 text-center flex justify-center"
    >
      <div id="colHints">
        <div>1<br />1</div>
        <div>2<br />1</div>
        <div>5</div>
        <div>2<br />1</div>
        <div>1<br />1</div>
      </div>
      <div id="rowHints" class="">
        <div>1</div>
        <div>3</div>
        <div>5</div>
        <div>1</div>
        <div>5</div>
        <!-- <div>1&nbsp1</div> -->
      </div>
      <div id="playTable">
        <div v-for="i in 5" class="flex">
          <div
            v-for="char in ['a', 'b', 'c', 'd', 'e']"
            class="block"
            :id="char + i"
            :key="char + i"
            @click="check"
            @click.right="mark"
          ></div>
        </div>
      </div>
    </div>
    <div class="container mx-auto mt-2 text-center">
      <div>
        Missed: {{ failed }} <br />
        Timer: {{ !isTimeUp() ? Time : "Time's up" }}
      </div>

      <div v-if="win">Course Cleared!</div>
      <div v-if="isTimeUp()">Game Over!</div>

      <button
        
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 mt-2 border border-blue-500 hover:border-transparent rounded"
        @click="hintClicked"
      >
        {{ hintCount }} Hint
      </button>

      <p>Hint Choose: {{ randomBox }}</p>
    </div>
  </div>
</template>

<style scoped>
.borderCells {
  text-wrap: nowrap;
  text-align: center;
}
.blocks {
  border: solid black 1px;
  text-align: center;
}
</style>
