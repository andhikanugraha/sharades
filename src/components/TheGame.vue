<template>
  <div class="root" id="finished" v-if="isFinished">
    <header>
      <div class="close-button" @click="reset">
        <font-awesome-icon icon="times" fixed-width />
      </div>
      <h3>Score: {{ score }}</h3>
    </header>
    <main>
      <div>
        <ol>
          <li
            v-for="(result, i) in results"
            :key="i"
            :class="{ correct: result.isCorrect }"
          >
            <font-awesome-icon :icon="result.isCorrect ? 'check' : 'times'" />
            {{ result.word }}
          </li>
        </ol>
      </div>
    </main>
    <nav>
      <p>
        <button @click="bumper() && goHome()">
          <font-awesome-icon icon="home" /> Home
        </button>
      </p>
      <p>
        <button id="reset" @click="bumper() && reset()">
          <font-awesome-icon icon="undo" /> Play again
        </button>
      </p>
    </nav>
  </div>
  <div class="root" id="active" v-else-if="isStarted">
    <header>
      <div class="close-button" @click="reset">
        <font-awesome-icon icon="times" fixed-width />
      </div>
      <h3 id="timer">{{ remainingSeconds }}</h3>
    </header>
    <main>
      <div class="overlay">
        <div class="half" @click="correctWord"></div>
        <div class="half" @click="skipWord"></div>
      </div>
      <v-fit :text="currentWord" />
    </main>
    <nav>
      <p @click="correctWord">
        <button id="correct"><font-awesome-icon icon="check" /> Correct</button>
      </p>
      <p @click="skipWord">
        <button id="skip">
          <font-awesome-icon icon="step-forward" /> Skip
        </button>
      </p>
    </nav>
  </div>
  <div class="root" id="initial" v-else>
    <header>
      <div class="close-button" @click="goHome">
        <font-awesome-icon icon="home" />
      </div>
      <div class="pull-right">
        <font-awesome-icon @click="edit" icon="edit" v-if="isEditable" />
        <font-awesome-icon @click="share" icon="share" />
      </div>
      <h3>Sharades</h3>
    </header>
    <main>
      <div>
        <div class="info">
          <div class="label">Category:</div>
          <div class="value">{{ category.title }}</div>
        </div>
        <div class="info">
          <div class="label">Time limit:</div>
          <div class="value">
            <span
              @click="setTimeLimit(30)"
              :class="{ option: true, selected: timeLimit === 30 }"
              >30</span
            >
            <span
              @click="setTimeLimit(60)"
              :class="{ option: true, selected: timeLimit === 60 }"
              >60</span
            >
            <span
              @click="setTimeLimit(90)"
              :class="{ option: true, selected: timeLimit === 90 }"
              >90</span
            >
            <span
              @click="setTimeLimit(120)"
              :class="{ option: true, selected: timeLimit === 120 }"
              >120</span
            >
          </div>
        </div>
      </div>
    </main>
    <nav>
      <p>
        <button id="start" @click="start">
          <font-awesome-icon icon="play" /> Play
        </button>
      </p>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
const addSeconds = require("date-fns/add_seconds");
const differenceInSeconds = require("date-fns/difference_in_seconds");
import { Category } from "../category";
import VFit from "../components/VFit.vue";
import {
  faHome,
  faPlay,
  faStepForward,
  faCheck,
  faUndo,
  faPencilAlt,
  faEdit,
  faTimes,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
const shuffle = require("lodash.shuffle");

interface GameData {
  isStarted: boolean;
  isFinished: boolean;
  shuffledWords: number[];
  usedWordIndices: Set<number>;
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
    FontAwesomeIcon: async () =>
      (await import("@fortawesome/vue-fontawesome")).FontAwesomeIcon,
  },

  props: ["encodedCategory", "category", "isEditable"],

  data(): GameData {
    return {
      isStarted: false,
      endTime: new Date(),
      shuffledWords: [],
      usedWordIndices: new Set(),
      correctIndices: new Set(),
      maxViewedIndex: 0,
      currentIndex: 0,
      remainingSeconds: 0,
      isFinished: false,
      timeLimit: 60,
    };
  },

  async created() {
    const { library } = await import("@fortawesome/fontawesome-svg-core");
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
  },

  computed: {
    canShare(): boolean {
      return !!(navigator as any).share;
    },
    currentWord(): string {
      return this.category.words[this.shuffledWords[this.currentIndex]];
    },

    results(): Word[] {
      const results: Word[] = [];
      for (let i = 0; i <= this.maxViewedIndex; ++i) {
        results.push({
          word: this.category.words[this.shuffledWords[i]],
          isCorrect: false,
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
    },
  },

  methods: {
    goHome() {
      this.$router.push({ name: "home" });
    },

    bumper() {
      return differenceInSeconds(new Date(), this.endTime) > 1;
    },

    setTimeLimit(timeLimit) {
      this.timeLimit = timeLimit;
    },

    share() {
      const share: any = (navigator as any).share;
      share({
        title: `Sharades: ${this.category.title}`,
        url: window.location,
      });
    },

    nextWord() {
      // add current index to used words
      this.usedWordIndices.add(this.currentIndex);

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
      this.endTime = new Date();
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
      this.shuffleWords();
    },

    shuffleWords() {
      const { words } = this.category;
      const indices = [];
      if (this.usedWordIndices.size < words.length) {
        for (let i = 0; i < words.length; ++i) {
          if (!this.usedWordIndices.has(i)) {
            indices.push(i);
          }
        }
      } else {
        for (let i = 0; i < words.length; ++i) {
          indices.push(i);
        }
        this.usedWordIndices.clear();
      }
      const shuffledLeft = shuffle(indices);
      const shuffledRight = shuffle(Array.from(this.usedWordIndices.values()));
      this.shuffledWords = [...shuffledLeft, ...shuffledRight];
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
        params: { encodedCategory: this.encodedCategory },
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
    },
  },

  mounted() {
    this.reset();
  },
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
