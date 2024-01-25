<script setup>
import { ref } from "vue";

const level = [
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
];  //Array store all correct cells
const failed = ref(0); //Store dynamic failed attempts
const checked = []; //Store squares that the player has checked
const win = ref(false);  //Store the win boolean that can be used to manage game state

function mark(event) {  //Function that is called by player on right-clicking to mark a square as dangerous (as perceived by the player themselves)
  event.preventDefault(); //Event handling, prevent normal behavior(right click menu) from triggering
  let targetTile = event.target; //get DOM clicked tile object 
  let targetTileId = targetTile.id; //get the clicked tile DOM object id
  let targetClasses = targetTile.className.split(" "); //split the tile html class into array
  if (checked.includes(targetTileId)) { //if(the tile is already checked by the player (left-click))
    //if already checked, return (do nothing)
    return;
  }
  if (targetClasses.includes("marked")) {  //if the class indicates that it's already marked
    //remove marked class from the tile
    let markToRm = targetClasses.findIndex((tileClass) => {
      return tileClass === "marked";
    });  //get the index of the splitted class array where the it is "marked" 
    targetClasses.splice(markToRm, 1);  //delete the "marked" from class array
    targetTile.className = targetClasses.join(" "); //join the array back
    targetTile.style.backgroundColor = "white"; //Set the tile background color to white
    return;
  }
  //The tile isn't marked or checked
  targetClasses.push("marked"); //Push "marked" into the class array
  targetTile.className = targetClasses.join(" "); //Join the array with " " in between
  targetTile.style.backgroundColor = "grey"; //Set the tile background color to grey
}

function check(event) { //Function for when the player left-click to check a tile 
  const clickedTile = event.target; //Get clicked tile html DOM object 
  const clickedTileId = clickedTile.id; //Get clicked tile html DOM id
  let targetClasses = clickedTile.className.split(" "); //Get the class of the tile object and split in array

  if (checked.includes(clickedTileId) || targetClasses.includes("marked")) {
    //check if already checked or marked by player will return (does nothing)
    return;
  }

  checked.push(clickedTileId); //Push the id into the checked array, to record that the tile has already been checked

  if (level.includes(clickedTileId)) { //If the correct cells array contains the id that the player selected (choose a right tile) turn the background green and change the cursor to default
    clickedTile.style.backgroundColor = "green"; 
    clickedTile.style.cursor = "default";
  } else {  //else means player chose a wrong tile, increase failed count by one and turn background red
    failed.value++; 
    clickedTile.style.backgroundColor = "red";
    clickedTile.style.cursor = "not-allowed";
  }

  checkWin(); 
}

function checkWin() {
  let winTemp = true;
  level.forEach((mustCheckCell) => {
    if (!checked.includes(mustCheckCell)) {
      winTemp = false;
    }  //If checked array doesn't contain all elements from level array then tempWinValue is false
  });

  win.value = winTemp; //Sen win value
}

</script>

<template>
  <!-- Grid inspired by https://github.com/JosephCoburn/nonogram-puzzle -->
  <div id="playGrid">
    <div id="colHints">
      <div>1</div>
      <div>5</div>
      <div>1<br />1</div>
      <div>5</div>
      <div>1<br />1</div>
    </div>
    <div id="rowHints">
      <div>4</div>
      <div>1&nbsp2</div>
      <div>1&nbsp1</div>
      <div>1&nbsp1</div>
      <div>4</div>
    </div>
    <div id="playTable">
      <!-- onClick calls check function, right click calls mark function-->
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
  <div>
    Missed: {{ failed }} <br />
    Time:
  </div>
  <!-- Render congratulatory message by checking "win" variable-->
  <div v-if="win">Course Cleared!</div> 
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
