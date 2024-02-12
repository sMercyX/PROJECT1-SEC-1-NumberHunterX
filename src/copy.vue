<script setup>

</script>
 
<template>
<div>
    <section id="tutorialPage">
      <!--main tutorial-->
      <div class="tutorial" v-show="show == 1">
        <h1 class="text-2xl font-bold p-2 text-center">
          Tutorial
        </h1>
        <section class="parent-section m-2 flex">
          <div class="box flex flex-col lg:flex-row mx-10 
          md:mx-20 lg:mx-52 rounded-lg shadow-md ">
            <!-- page 1-->
            <div class="change" v-show="tutorial == 0">
              <img src="./assets/t1-1.png" alt="thumbnail" height="300" width="300" class="thumbnail mx-3">
              <div class="text-details mx-6">
                <p class="text-xl  ">Along the top and left side of the grid, there are sequences of
                  numbers. These numbers provide clues about the groups of filled-in
                  squares in the corresponding row or column.</p>
              </div>
            </div>
            <!--page 2-->
            <div class="change" v-show="tutorial == 1">
              <img src="./assets/t1-2.png" alt="thumbnail" height="300" width="300" class="thumbnail mx-3">
              <div class="text-details mx-6">
                <p class="text-xl  ">Each number represents a
                  consecutive group of filled squares, and the numbers are separated
                  by at least one blank square.</p>
              </div>
            </div>
            <div class="change" v-show="tutorial == 2">
              <img src="./assets/t2-1.png" alt="thumbnail" height="300" width="300" class="thumbnail mx-3">
              <div class="text-details mx-6">
                <p class="text-xl  ">The order of the numbers corresponds
                  to the order of the groups in the row or column.</p>
              </div>
            </div>
            <div class="change" v-show="tutorial == 3">
              <img src="./assets/t2-1.png" alt="thumbnail" height="300" width="300" class="thumbnail mx-3">
              <div class="text-details mx-6">
                <p class="text-xl  ">Additionally,
                  each game mode comes with a timeer to challenge players further.
                  Players can test their speed-solving skills in various difficulty
                  levels.</p>
              </div>
            </div>
            <div class="change" v-show="tutorial == 4">
              <img src="./assets/t2-1.png" alt="thumbnail" height="300" width="300" class="thumbnail mx-3">
              <div class="text-details mx-6">
                <p class="text-xl  ">The fastest completion time for each mode will be recorded.
                  players have access to a total of 3 hints for each level in all mode
                  to assist them in solving challenging puzzles.</p>
              </div>
              <!--button to play game-->
              <button @click="ezMode" class="btn btn-primary text-white">
                Easy mode</button><button @click="hardMode" class="btn btn-error text-white">
                Hard mode
              </button>

            </div>
            <div class="next-page-button mt-4">
              <button v-if="tutorial > 0" @click="beforePage" class="btn btn-outline btn-sm">
                Previous Page
              </button>
              <button v-if="tutorial < 4" @click="nextPage" class="btn btn-inline btn-sm">
                Next Page
              </button>
            </div>
          </div>
        </section>
        <button class="btn btn-outline btn-primary" type="button" @click="homePage">
          <img src="./assets/Home_icon_green.png" class="h-7" />
          BACK HOME
        </button>
      </div>
    </section>

</div>
</template>
 
<style scoped>

</style>