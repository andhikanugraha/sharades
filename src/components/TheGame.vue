<template>
  <div class="root" id="finished" v-if="isFinished">
    <header>
      <div class="close-button" @click="reset">
        <font-awesome-icon icon="times" fixed-width/>
      </div>
      <h3>Score: {{score}}</h3>
    </header>
    <main>
      <div>
        <ol>
          <li v-for="(result, i) in results" :key="i" :class="{correct: result.isCorrect}">
            <font-awesome-icon :icon="result.isCorrect ? 'check' : 'times'"/>
            {{result.word}}
          </li>
        </ol>
      </div>
    </main>
    <nav>
      <p><router-link :to="{name:'home'}" tag="button"><font-awesome-icon icon="home"/></router-link></p>
      <p><button id="reset" @click="reset"><font-awesome-icon icon="undo"/></button></p>
    </nav>
  </div>
  <div class="root" id="active" v-else-if="isStarted">
    <header>
      <div class="close-button" @click="reset">
        <font-awesome-icon icon="times" fixed-width/>
      </div>
      <h3 id="timer">{{remainingSeconds}}</h3>
    </header>
    <main>
      <div class="overlay">
        <div class="half" @click="correctWord"></div>
        <div class="half" @click="skipWord"></div>
      </div>
      <v-fit :text="currentWord"/>
    </main>
    <nav>
      <p @click="correctWord"><button id="correct"><font-awesome-icon icon="check"/></button></p>
      <p @click="skipWord"><button id="skip"><font-awesome-icon icon="step-forward"/></button></p>
    </nav>
  </div>
  <div class="root" id="initial" v-else>
    <header>
      <div class="close-button" @click="goHome">
        <font-awesome-icon icon="home"/>
      </div>
      <div class="pull-right">
        <font-awesome-icon @click="edit" icon="edit"/>
        <font-awesome-icon @click="share" icon="share" v-if="canShare"/>
      </div>
      <h3>Piramida</h3>
    </header>
    <main>
      <div>
        <div class="info">
          <div class="label">Category:</div>
          <div class="value">{{category.title}}</div>
        </div>
        <div class="info">
          <div class="label">Time limit:</div>
          <div class="value">
            <span @click="setTimeLimit(30)" :class="{ option: true, selected: timeLimit === 30 }">30</span>
            <span @click="setTimeLimit(60)" :class="{ option: true, selected: timeLimit === 60 }">60</span>
            <span @click="setTimeLimit(90)" :class="{ option: true, selected: timeLimit === 90 }">90</span>
            <span @click="setTimeLimit(120)" :class="{ option: true, selected: timeLimit === 120 }">120</span>
          </div>
        </div>
      </div>
    </main>
    <nav>
      <p><button id="start" @click="start"><font-awesome-icon icon="play"/></button></p>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { addSeconds, differenceInSeconds } from "date-fns";
import { Category, decodeCategory } from "../category";
import VFit from "../components/VFit.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faPlay,
  faStepForward,
  faCheck,
  faUndo,
  faPencilAlt,
  faEdit,
  faTimes,
  faShare
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const shuffle = require("lodash.shuffle");

library.add(
  faHome,
  faPlay,
  faStepForward,
  faCheck,
  faUndo,
  faEdit,
  faTimes,
  faShare
);

interface GameData {
  isStarted: boolean;
  isFinished: boolean;
  shuffledWords: string[];
  correctIndices: Set<number>;
  maxViewedIndex: number;
  currentIndex: number;
  remainingSeconds: number;
  endTime: Date;
  timer?: NodeJS.Timer;
  timeLimit: number;
}

interface Word {
  word: string;
  isCorrect: boolean;
}

export default Vue.extend({
  components: {
    VFit,
    FontAwesomeIcon
  },

  props: ["encodedCategory", "category"],

  data(): GameData {
    return {
      isStarted: false,
      endTime: new Date(),
      shuffledWords: [],
      correctIndices: new Set(),
      maxViewedIndex: 0,
      currentIndex: 0,
      remainingSeconds: 0,
      isFinished: false,
      timeLimit: 60
    };
  },

  computed: {
    canShare(): boolean {
      return !!(navigator as any).share;
    },
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
    goHome() {
      this.$router.push({ name: "home" });
    },

    setTimeLimit(timeLimit) {
      this.timeLimit = timeLimit;
    },

    share() {
      const share: any = (navigator as any).share;
      share({
        title: `Piramida: ${this.category.title}`,
        url: window.location
      });
    },

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

    edit() {
      this.$router.push({
        name: "edit",
        params: { encodedCategory: this.encodedCategory }
      });
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

<style lang="scss">
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  .half {
    height: 100%;
    flex-grow: 1;
  }
}
@media (orientation: portrait) {
  .overlay {
    display: none;
  }
}
</style>
