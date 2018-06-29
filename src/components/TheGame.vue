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
      <p><button id="reset" @click="reset">Try again</button></p>
      <p><router-link :to="{name:'home'}" tag="button">Home</router-link></p>
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
      <h3>{{category.title}}</h3>
    </header>
    <main/>
    <nav>
      <p><button id="start" @click="start">Start</button></p>
      <p><router-link tag="button" id="reset" :to="{name: 'home'}">Home</router-link></p>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { addSeconds, differenceInSeconds } from "date-fns";
import { Category, decodeCategory } from "../category";
import VFit from "../components/VFit.vue";

// tslint:disable-next-line
const shuffle = require("lodash.shuffle");

interface GameData {
  isStarted: boolean;
  isFinished: boolean;
  category: Category;
  shuffledWords: string[];
  correctIndices: Set<number>;
  maxViewedIndex: number;
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
    "v-fit": VFit
  },

  props: ["encodedCategory", "timeLimit"],

  data(): GameData {
    let category: Category;

    try {
      category = decodeCategory(this.encodedCategory);
    } catch (e) {
      this.$router.replace({ name: "home" });

      category = {
        title: "",
        words: []
      };
    }

    return {
      category,
      isStarted: false,
      endTime: new Date(),
      shuffledWords: [],
      correctIndices: new Set(),
      maxViewedIndex: 0,
      currentIndex: 0,
      remainingSeconds: 0,
      isFinished: false
    };
  },

  computed: {
    currentWord(): string {
      return this.shuffledWords[this.currentIndex];
    },

    results(): Word[] {
      const results: Word[] = [];
      for (let i = 0; i <= this.maxViewedIndex; ++i) {
        results.push({
          word: this.shuffledWords[i],
          isCorrect: false
        });
      }

      for (const correctIndex of this.correctIndices) {
        if (results[correctIndex]) {
          results[correctIndex].isCorrect = true;
        }
      }

      return results;
    },

    score(): number {
      return this.correctIndices.size;
    }
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

      if (nextIndex > this.maxViewedIndex) {
        this.maxViewedIndex = nextIndex;
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
      this.maxViewedIndex = 0;
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
    }
  },

  mounted() {
    this.reset();
  }
});
</script>
