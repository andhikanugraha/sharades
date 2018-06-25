<template>
  <div class="root" id="finished" v-if="isFinished">
    <header>
      <h3>Score: {{score}}</h3>
    </header>
    <main>
      <div>
        <ol>
          <li v-for="(result, i) in results" :key="i" :class="{correct: result.isCorrect}">
            {{result.word}}
          </li>
        </ol>
      </div>
    </main>
    <nav>
      <p><button id="reset" @click="reset">Reset</button></p>
    </nav>
  </div>
  <div class="root" id="active" v-else-if="isStarted">
    <header>
      <h3 id="timer">{{remainingSeconds}}</h3>
    </header>
    <main>
      <v-fit :text="currentWord"/>
    </main>
    <nav>
      <p><button id="correct" @click="correctWord">Correct</button></p>
      <p><button id="skip" @click="skipWord">Skip</button></p>
    </nav>
  </div>
  <div class="root" id="initial" v-else>
    <header>
      <h3 id="timer">Charades</h3>
    </header>
    <main>
      <v-fit :text="category.title" id="category"/>
    </main>
    <nav>
      <p><button id="start" @click="start">Start</button></p>
    </nav>
  </div>
</template>

<script lang="ts">
import 'typeface-fira-mono';
import Vue from 'vue';
import { addSeconds, differenceInSeconds } from 'date-fns';
import { Category, decodeCategory } from '../category';
import VFit from '../components/VFit.vue';

// tslint:disable-next-line
const shuffle = require('lodash.shuffle');

interface GameData {
  isStarted: boolean;
  isFinished: boolean;
  category: Category;
  shuffledWords: string[];
  correctIndices: Set<number>;
  currentIndex: number;
  remainingSeconds: number;
  endTime: Date;
  timer?: NodeJS.Timer;
}

interface Word {
  word: string;
  isCorrect: boolean;
}

export default Vue.extend({
  components: {
    'v-fit': VFit,
  },

  props: ['encodedCategory', 'timeLimit'],

  data(): GameData {
    return {
      category: decodeCategory(this.encodedCategory),
      isStarted: false,
      endTime: new Date(),
      shuffledWords: [],
      correctIndices: new Set(),
      currentIndex: 0,
      remainingSeconds: 0,
      isFinished: false,
    };
  },

  computed: {
    currentWord(): string {
      return this.shuffledWords[this.currentIndex];
    },

    results(): Word[] {
      const results = this.shuffledWords.map((word) => {
        return {
          word,
          isCorrect: false,
        };
      });

      for (const correctIndex of this.correctIndices) {
        if (results[correctIndex]) {
          results[correctIndex].isCorrect = true;
        }
      }

      return results;
    },

    score(): number {
      return this.correctIndices.size;
    },
  },

  methods: {
    nextWord() {
      // find next unanswered word
      const answeredSet = new Set<number>(this.correctIndices);

      let i: number;
      if (this.currentIndex + 1 >= this.shuffledWords.length) {
        i = 0;
      } else {
        i = this.currentIndex + 1;
      }

      let nextIndex: number = -1;
      while (i !== this.currentIndex && nextIndex === -1) {
        if (!answeredSet.has(i)) {
          nextIndex = i;
        } else {
          if (i + 1 >= this.shuffledWords.length) {
            i = 0;
          } else {
            ++i;
          }
        }
      }

      if (nextIndex === -1) {
        this.finish();
      } else {
        if (nextIndex < this.shuffledWords.length) {
          this.currentIndex = nextIndex;
        }
      }
    },

    finish() {
      this.isFinished = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },

    reset() {
      this.isStarted = false;
      this.isFinished = false;
      this.currentIndex = 0;
      this.correctIndices = new Set();
      this.shuffledWords = shuffle(this.category.words);
    },

    start() {
      this.isStarted = true;
      this.endTime = addSeconds(new Date(), this.timeLimit);
      const tick = () => {
        this.updateRemainingSeconds();
        if (this.remainingSeconds > 0) {
          this.timer = setTimeout(() => tick(), 1000);
        } else {
          this.isFinished = true;
        }
      };

      tick();
    },

    updateRemainingSeconds() {
      this.remainingSeconds = differenceInSeconds(this.endTime, new Date());
    },

    skipWord() {
      this.nextWord();
    },

    correctWord() {
      this.correctIndices.add(this.currentIndex);
      this.nextWord();
    },
  },

  mounted() {
    this.reset();
  },
});
</script>

<style lang="scss" scoped>
$spacer: 2vmax;
$font-size-secondary: 4vmax;
$font-size-tertiary: 3vmax;
$white: #FEF0D5;
$red: #D81E5B;
$primary: #00BEB2;

.root {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
}

header > h3 {
  font-size: $font-size-secondary;
  margin: ($spacer * 2) 0;
}

main {
  position: relative;
  display: flex;
  width: 100%;
  overflow-y: auto;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

h1 {
  margin: 0;
  height: auto;
  line-height: 1;
  font-weight: bold;
}
#category {
  font-weight: 400;
}

#timer {
  color: $primary;
  font-weight: 400;
}

nav {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  padding: ($spacer / 2);

  @media (orientation: landscape) {
    flex-direction: row-reverse;
  }
  @media (orientation: portrait) {
    flex-direction: column;
  }
}

p {
  position: relative;
  margin: ($spacer / 2);
  flex-grow: 1;
}

button {
  font-weight: bold;
  display: block;
  width: 100%;
  height: 100%;
  font-size: $font-size-secondary;
  line-height: 1;
  border-radius: ($spacer * 2 + $font-size-secondary) / 2;
  padding: $spacer;
  border: none;
  cursor: pointer;
}

@mixin btn($color) {
  background-color: $color;
  color: $white;

  &:hover {
    background-color: darken($color, 5%);
  }

  &:active, &:focus {
    background-color: darken($color, 10%);
  }
}

#start, #correct {
  @include btn($primary);
}
#skip, #reset {
  @include btn($red);
}

main div {
  height: 100%;
}
ol {
  margin: 0 ($spacer * 2);
  column-width: 8 * $font-size-tertiary;
  column-gap: $spacer * 2;
  list-style: none outside;
  padding: 0;
  font-size: $font-size-tertiary;
}
li {
  padding-bottom: $spacer;
  color: $primary;
  font-weight: bold;
}
.correct {
  font-weight: bold;
  color: $white;
}
</style>
