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
        <button @click="bumper(goHome)">
          <font-awesome-icon icon="home" />Home
        </button>
      </p>
      <p>
        <button id="reset" @click="reset">
          <font-awesome-icon icon="undo" />Play again
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
        <div class="half" @click="nextWord"></div>
      </div>
      <v-fit :text="currentWord" />
    </main>
    <nav>
      <p @click="correctWord">
        <button id="correct"><font-awesome-icon icon="check" />Correct</button>
      </p>
      <p @click="nextWord">
        <button id="skip"><font-awesome-icon icon="step-forward" />Skip</button>
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
          <div class="label">Topic:</div>
          <div class="value">{{ _title }}</div>
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
          <font-awesome-icon icon="play" />Play
        </button>
      </p>
    </nav>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watch,
  computed,
  watchEffect,
} from "@vue/composition-api";
import { Topic } from "../topic";
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import shuffle from "lodash/shuffle";

interface Word {
  word: string;
  isCorrect: boolean;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

const TheGame = defineComponent({
  components: {
    VFit,
    FontAwesomeIcon,
  },
  props: {
    isEditable: Boolean,
    words: Array as { new (): string[] },
    title: String,
  },
  setup(props, { emit }) {
    const _title = ref(props.title);
    const words = ref(props.words);
    const isStarted = ref(false);
    const endTime = ref(nowSeconds());
    const shuffledWords = reactive<number[]>([]);
    const usedWordIndices = reactive(new Set<number>());
    const correctIndices = reactive(new Set<number>());
    const maxViewedIndex = ref(0);
    const currentIndex = ref(0);
    const remainingSeconds = ref(0);
    const isFinished = ref(false);
    const timeLimit = ref(60);
    const timer = ref<NodeJS.Timeout | undefined>(undefined);

    const bumper = (next: Function) => {
      if (nowSeconds() - endTime.value > 1) {
        next();
      }
    };

    const setTimeLimit = (newTimeLimit: number) => {
      timeLimit.value = newTimeLimit;
    };

    const share = () => {
      try {
        (navigator as any).share({
          title: `Sharades: ${_title.value}`,
          url: window.location,
        });
      } catch {
        alert("Sharing not supported");
      }
    };

    const nextWord = () => {
      // add current index to used words
      usedWordIndices.add(currentIndex.value);

      // find next unanswered word
      const answeredSet = new Set<number>(correctIndices);

      let i: number;
      if (currentIndex.value + 1 >= shuffledWords.length) {
        i = 0;
      } else {
        i = currentIndex.value + 1;
      }

      let nextIndex: number = -1;
      while (i !== currentIndex.value && nextIndex === -1) {
        if (!answeredSet.has(i)) {
          nextIndex = i;
        } else {
          if (i + 1 >= shuffledWords.length) {
            i = 0;
          } else {
            ++i;
          }
        }
      }

      if (nextIndex === -1) {
        finish();
      } else {
        if (nextIndex < shuffledWords.length) {
          currentIndex.value = nextIndex;
        }
      }

      if (nextIndex > maxViewedIndex.value) {
        maxViewedIndex.value = nextIndex;
      }
    };

    const finish = () => {
      isFinished.value = true;
      endTime.value = nowSeconds();
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = undefined;
      }
    };

    const reset = () => {
      isStarted.value = false;
      isFinished.value = false;
      currentIndex.value = 0;
      correctIndices.clear();
      maxViewedIndex.value = 0;
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = undefined;
      }
      shuffleWords();
    };

    const shuffleWords = () => {
      const words = props.words;
      if (!words || words.length === 0) {
        return;
      }

      const indices = [];
      if (usedWordIndices.size < words.length) {
        for (let i = 0; i < words.length; ++i) {
          if (!usedWordIndices.has(i)) {
            indices.push(i);
          }
        }
      } else {
        for (let i = 0; i < words.length; ++i) {
          indices.push(i);
        }
        usedWordIndices.clear();
      }
      const shuffledLeft = shuffle(indices);
      const shuffledRight = shuffle(Array.from(usedWordIndices.values()));
      shuffledWords.splice(0);
      shuffledWords.splice(0, 0, ...shuffledLeft, ...shuffledRight);
    };

    const start = () => {
      isStarted.value = true;
      endTime.value = nowSeconds() + timeLimit.value;
      const tick = () => {
        updateRemainingSeconds();
        if (remainingSeconds.value > 0) {
          timer.value = setTimeout(() => tick(), 1000);
        } else {
          isFinished.value = true;
        }
      };

      tick();
    };

    const edit = () => {
      emit("edit-topic");
    };

    const goHome = () => {
      emit("go-home");
    };

    const updateRemainingSeconds = () => {
      remainingSeconds.value = endTime.value - nowSeconds();
    };

    const correctWord = () => {
      correctIndices.add(currentIndex.value);
      nextWord();
    };

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

    watchEffect(() => {
      shuffleWords();
      _title.value = props.title;
    });

    const canShare = !!(navigator as any).share;
    const currentWord = computed<string>(() =>
      props.words ? props.words[shuffledWords[currentIndex.value]] : ""
    );
    const results = computed<Word[]>(() => {
      const results: Word[] = [];
      if (!props.words) {
        return results;
      }

      for (let i = 0; i <= maxViewedIndex.value; ++i) {
        results.push({
          word: props.words[shuffledWords[i]],
          isCorrect: false,
        });
      }

      for (const correctIndex of correctIndices) {
        if (results[correctIndex]) {
          results[correctIndex].isCorrect = true;
        }
      }

      return results;
    });

    const score = computed<number>(() => correctIndices.size);

    return {
      _title,
      words,
      canShare,
      share,
      currentWord,
      results,
      score,
      bumper,
      setTimeLimit,
      nextWord,
      finish,
      reset,
      start,
      edit,
      goHome,
      correctWord,
      endTime,
      shuffledWords,
      remainingSeconds,
      isStarted,
      isFinished,
      timeLimit,
    };
  },
});

export default TheGame;
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
