<template>
  <div class="root" id="finished" v-if="isFinished">
    <main>  
      <h1>Score: {{score}}</h1>
      <ol>
        <li v-for="(result, i) in results" :key="i" :class="{correct: result.isCorrect}">
          {{result.word}}
        </li>
      </ol>
    </main>
    <nav>
      <p><button id="reset" @click="reset">Reset</button></p>
    </nav>
  </div>
  <div class="root" id="active" v-else-if="isStarted">
    <main>
      <h1 id="word">{{currentWord}}</h1>
      <h3 id="timer">{{remainingSeconds}}</h3>
    </main>
    <nav>
      <p><button id="correct" @click="correctWord">Correct</button></p>
      <p><button id="skip" @click="skipWord">Skip</button></p>
    </nav>
  </div>
  <div class="root" id="initial" v-else>
    <main>
      <h1 id="category">{{category.title}}</h1>
    </main>
    <nav>
      <p><button id="start" @click="start">Start</button></p>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
$gutter: 1rem;

.root {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
}
main {
  position: relative;
  display: flex;
  width: 100%;
  height: auto;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

h1 {
  margin: 0;
  height: auto;
  font-size: 12vh;
}

#timer {
  position: absolute;
  left: 0;
  top: $gutter;
  width: 100%;
  text-align: center;
  margin: 0;
  font-size: 8vh;
  font-weight: lighter;
  color: #999;
}

nav {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  height: 30%;
  padding: $gutter ($gutter / 2);
  background: #eee;
}

p {
  position: relative;
  margin: 0 ($gutter / 2);
  flex-grow: 1;
}

button {
  display: block;
  width: 100%;
  height: 100%;
  font-size: 8vh;
  border: 2px solid transparent;
  border-radius: 2vh;
  cursor: pointer;
}

#skip {
  background: #d9534f;
  color: #ffffff;
  border-color: #d43f3a;

  &:active,
  &:hover,
  &:focus {
    background-color: #d2322d;
    border-color: #ac2925;
  }
}
#correct {
  color: #ffffff;
  background-color: #5cb85c;
  border-color: #4cae4c;

  &:active,
  &:hover,
  &:focus {
    background-color: #47a447;
    border-color: #398439;
  }
}
#start {
  color: #ffffff;
  background-color: #428bca;
  border-color: #357ebd;
}
#reset {
  color: #ffffff;
  background-color: #5bc0de;
  border-color: #46b8da;
}

.correct {
  font-weight: bold;
}
ol {
  text-align: left;
  margin: 0 auto;
  width: 10em;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { addSeconds, differenceInSeconds } from 'date-fns';
import { shuffle } from 'lodash';
import { Category, decodeCategory } from '../category';

interface GameData {
  isStarted: boolean;
  isFinished: boolean;
  category: Category;
  timeLimit: number;
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
  props: ['encodedCategory', 'timeLimit'],

  data(): GameData {
    console.log(this.encodedCategory);
    return {
      category: decodeCategory(this.encodedCategory),
      isStarted: false,
      timeLimit: this.timeLimit,
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
