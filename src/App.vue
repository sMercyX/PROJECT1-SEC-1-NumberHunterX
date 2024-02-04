<script setup>
import { onMounted, ref, nextTick, render } from "vue";

const missed = ref(0);
const hintsLeft = ref(3);

//style
const blockStyle = "hanjie-cell";
const noneBorder = "row-number";
const halfBlock = "hanjie-cell-half";
const correct = "MediumSeaGreen";
const unCorrect = "#f87171";

//block stores row and column of table
const blocks = [];
//rows stores row name of table
const rows = ["t", "0", "1", "2", "3", "4", "5"];
//columns stores column name of table
const columns = ["0", "a", "b", "c", "d", "e", "99"];
//checked blocks array
const checked = [];
const win = ref(false)
const mins = ref(0);
const secs = ref(0);

//to stores row and column to blocks
rows.forEach((ele) => {
  blocks.push({ row: ele, column: [...columns] }); //use spread to easy copy data without reference
});

//correctBlock stores block that when click its will change to correct color
const correctBlock = [
  "a1",
  "b1",
  "e1",
  "a2",
  "b2",
  "c3",
  "a4",
  "b4",
  "c4",
  "a5",
  "b5",
  "c5",
  "d5",
];

const hints = ref([]);
let hintable = ref(true);

function checkHintable() {
  let checkedCorrect = checked.filter((tile) => {
    return correctBlock.includes(tile);
  });
  let hintAndChecked = hints.value.concat(checkedCorrect);
  if (hintAndChecked.length >= correctBlock.length) {
    hintable.value = false;
  }
}

const genHint = () => {
  let randomIndex;
  if (hintsLeft.value <= 0 || !hintable.value) {
    return;
  }
  while (true) {
    randomIndex = Math.floor(Math.random() * correctBlock.length);
    if (
      !checked.includes(correctBlock[randomIndex]) &&
      !hints.value.includes(correctBlock[randomIndex])
    ) {
      hintsLeft.value--;
      hints.value.push(correctBlock[randomIndex]);
      checkHintable();
      return;
    }
  }
};

let timerInterval;

onMounted(() => {
  timer(true);
});

function timer(op) {
  if (op) {
    timerInterval = setInterval(() => {
      if (secs.value >= 59) {
        mins.value++;
        secs.value = 0
        return;
      } else {
        secs.value++;
      }
    }, 1000);
  } else {
    if (timerInterval === undefined) {
      return;
    } else {
      clearInterval(timerInterval)
    }
  }
}


//checkHeaderStyle is use for checking that block is header or not to custom style
const checkHeaderStyle = (id) => {
  if (id.includes("0")) return `${halfBlock} ${noneBorder}`;
  if (id.includes("t")) return `${halfBlock} ${noneBorder}`;
  if (id.includes("99")) return `${blockStyle} ${noneBorder}`;
  return blockStyle;
};
const checkTR = (id) => {
  if (id.includes("0"))
    return `
  height: 30px;`;
  if (id.includes("t"))
    return `
  height: 30px;`;
};

//headerNums stores id and result of block of table head
const headerNums = [
  {
    id: "at",
    result: "2",
  },
  {
    id: "bt",
    result: "2",
  },
  {
    id: "a0",
    result: "2",
  },
  {
    id: "b0",
    result: "2",
  },
  {
    id: "c0",
    result: "3",
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
    result: "2  1",
  },
  {
    id: "02",
    result: "2",
  },
  {
    id: "03",
    result: "1",
  },
  {
    id: "04",
    result: "3",
  },
  {
    id: "05",
    result: "4",
  },
];

const checkHeader = (id) => {
  const index = headerNums.findIndex((num) => num.id === id); //checking id in array of header numbers to find result
  return index >= 0 ? headerNums[index].result : "";
};

//addClickers is use to adding click to only block that should be (block that have a line)
const addClickers = (event) => {
  let targetTile = event.target; //tile clicked
  let id = targetTile.id; //clicked tile id
  let targetClasses = targetTile.className.split(" "); //split class into array
  if (checked.includes(id) || targetClasses.includes("marked")) {
    return;
  }
  if (!id.includes("0") && !id.includes("99") && !id.includes("t")) {
    const blockColor = correctBlock.includes(id) ? correct : unCorrect;
    const targetBlock = document.getElementById(id);
    targetBlock.style.backgroundColor = blockColor;
    if (blockColor === unCorrect) {
      //targetBlock.textContent = "x";
      missed.value++;
    }
    checked.push(id);
    if (blockColor === correct) {
      checkHintable();
    }
    if (checkWin()) {
      timer(false)
    }
  }
};

function mark(event) {
  event.preventDefault();
  let targetTile = event.target; //tile clicked
  let targetTileId = targetTile.id; //clicked tile id
  let targetClasses = targetTile.className.split(" "); //split class into array
  if (checked.includes(targetTileId)) {
    //if already checked, return
    return;
  }
  if (targetClasses.includes("marked")) {
    //remove marked class from the tile
    let markToRm = targetClasses.findIndex((tileClass) => {
      return tileClass === "marked";
    });
    targetClasses.splice(markToRm, 1);
    targetTile.className = targetClasses.join(" ");
    targetTile.style.backgroundColor = "white";
    return;
  }
  targetClasses.push("marked");
  targetTile.className = targetClasses.join(" ");
  targetTile.style.backgroundColor = "grey";
}

function checkWin() {
  let winTemp = true;
  correctBlock.forEach((mustCheckCell) => {
    if (!checked.includes(mustCheckCell)) {
      winTemp = false;
    }
  });
  // console.log(winTemp);
  win.value = winTemp;
  return winTemp;
}

const show = ref(false)

const resetGame = () => {
  missed.value = 0;
  hintsLeft.value = 3;
  blocks.forEach(block => {
    block.column.forEach(col => {
      const id = col + block.row;
      document.getElementById(id).style.backgroundColor = "";
    });
  });
  checked.length = 0;
  win.value = false;
  mins.value = 0;
  secs.value = 0;
  hints.value = [];
  hintable.value = true;
}

</script>

<template>
  <div class="header pb-2 flex justify-center py-3">
    <div class="mb-4 text-4xl font-extrabold">NUMBER HUNTER</div>
  </div>

  <!--main tutorial-->
  <div class="tutorial flex " v-show="!show">
    <div class="tutorials px-4 py-2 m-2 center">
      <h1 class="text-center  text-2xl font-bold">tutorials</h1>
      <div class="text-center">
        <h2> I think should have some picture </h2> <br><br><br><br>
        <h3>The basics</h3>
        <div>
          <p>
            Your goal is to paint all the correct tiles in the grid. Each row and
            column contains a set of numbers indicating length of the correct
            tiles.
          </p>
          <p>
            For example; 2 3, means there are 5 correct tiles in the row column in
            total one with the length of two and another three, both are placed
            apart.
          </p>
          <b>The game ends once you reveal all the correct tiles. Good luck and
            Happy Hunting
          </b>
          <span class="italic">ps. Next pages details tips and techniques, study it if you wish
            become the elite nonogrammer!</span>
        </div>
      </div>
    </div>
    <button @click="show = !show" class="btn btn-success text-white">
      Play Game </button>
  </div>

  <div class="container p-10 m-auto w-full" v-show="show">
    <section class="flex items-center justify-between">
      <button class="btn btn-outline btn-primary flex " type="button" @click="resetGame">
        RESET
      </button>
      <div class="flex">
        Time: <span v-if="mins < 10">0</span>{{ mins }} : <span v-if="secs < 10">0</span>{{ secs }}
      </div>
    </section>

    <!--Table-->
    <div class="join flex justify-center">
      <table class="hanjie-table">
        <tr v-for="block in blocks" :key="block.row" :id="block.row" :style="checkTR(block.row)">
          <td :class="checkHeaderStyle(col + block.row)" v-for="col in block.column" :key="col + block.row"
            :id="col + block.row" @click="addClickers" @click.right="mark">
            {{ checkHeader(col + block.row) }}
          </td>
        </tr>
      </table>
    </div>


    <div class="flex justify-between m-5">
      <!-- Hint -->
      <div class="hint order-1 flex flex-row">
        <div class="btn btn-warning m-1 cursor-not-allowed">Hint left : {{ hintsLeft }}</div>
        <button
          :class="hintsLeft > 0 && hintable ? 'btn btn-outline btn-accent m-1' : 'btn btn-active btn-ghost cursor-not-allowed m-1'"
          :disable="hintsLeft > 0 ? false : true" @click="genHint"> Get hint </button>
        <div v-if="hints.length > 0" class="px-4 py-2 m-2 font-medium">
          <b v-for="(hint, index) in hints" :key="hint">{{ hint }}
            <b v-if="index < hints.length - 1">, </b></b>
        </div>
      </div>
      <!--Miss-->
      <div class="missed order-last">
        <div class="btn  m-1 cursor-not-allowed"> Missed : {{ missed }} </div>
      </div>
    </div>


    <div class="join pagination flex justify-center">
      <button class="join-item btn">«</button>
      <button class="join-item btn">Level 1</button>
      <button class="join-item btn">»</button>
    </div>

  </div>


  <div v-if="win">Stage cleared!!!</div>
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
