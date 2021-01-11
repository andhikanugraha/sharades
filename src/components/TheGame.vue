<template>
  <template v-if="isFinished">
    <header>
      <div class="close-button" @click="reset">
        <v-icon :icon="faTimes" fixed-width />
      </div>
      <div class="pull-right">
        <v-icon :icon="faUndo" @click="playAgain" />
      </div>
      <h3>Score: {{ score }}</h3>
    </header>
    <main>
      <div class="scrollable">
        <ol>
          <li v-for="(result, i) in results" :key="i" :class="{ correct: result.isCorrect }">
            <v-icon :icon="result.isCorrect ? faCheck : faTimes" />
            {{ result.word }}
          </li>
        </ol>
      </div>
    </main>
    <nav>
      <p>
        <button @click="goHome">
          <v-icon :icon="faHome" />Home
        </button>
      </p>
      <p>
        <button id="reset" @click="playAgain">
          <v-icon :icon="faUndo" />Play again
        </button>
      </p>
    </nav>
  </template>
  <template v-else-if="isStarted">
    <header>
      <div class="close-button" @click="reset">
        <v-icon :icon="faTimes" fixed-width />
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
      <p @click="correctWord($event)">
        <button id="correct">
          <v-icon :icon="faCheck" />Correct
        </button>
      </p>
      <p @click="skipWord($event)">
        <button id="skip">
          <v-icon :icon="faStepForward" />Skip
        </button>
      </p>
    </nav>
  </template>
  <template v-else>
    <header>
      <div class="close-button" @click="goHome">
        <v-icon :icon="faHome" />
      </div>
      <div class="pull-right">
        <v-icon v-if="isEditable" @click="goEdit" :icon="faEdit" />
        <v-icon v-if="canShare" @click="goShare" :icon="faShare" />
      </div>
      <h3>Sharades</h3>
    </header>
    <main>
      <div>
        <div class="info">
          <div class="label">Topic:</div>
          <div class="value">{{ viewTitle }}</div>
        </div>
        <div class="info">
          <div class="label">Time limit:</div>
          <div class="value">
            <span
              v-for="(opt) in [30, 60, 90, 120]"
              :key="opt"
              :class="{option: true, selected: timeLimit === opt }"
              @click="setTimeLimit(opt)">{{ opt }}</span>
          </div>
        </div>
      </div>
    </main>
    <nav>
      <p>
        <button id="start" @click="start">
          <v-icon :icon="faPlay" />Play
        </button>
      </p>
    </nav>
  </template>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import {
  faHome,
  faPlay,
  faStepForward,
  faCheck,
  faUndo,
  faEdit,
  faTimes,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { shuffle, throttle } from 'lodash-es';
import { exitFullscreen } from '../lib/fullscreen';
import { canShare, useShare } from '../lib/share';
import VIcon from './VIcon.vue';
import VFit from './VFit.vue';

interface Word {
  word: string;
  isCorrect: boolean;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export default defineComponent({
  name: 'TheGame',
  components: {
    VFit,
    VIcon,
  },
  props: {
    title: String,
    words: Array as PropType<string[]>,
    id: String,
  },
  setup(props) {
    const router = useRouter();

    const viewTitle = ref(props.title);
    const viewWords = reactive(props.words || []);

    // NAVIGATION & START SCREEN

    const goHome = async () => {
      router.push({ name: 'home' });
      await exitFullscreen(false);
    };

    const isEditable = computed(() => !!props.id);
    const goEdit = () => {
      if (props.id) {
        exitFullscreen(false);
        router.push({
          name: 'edit',
          params: { id: props.id },
        });
      }
    };

    const goShare = useShare(viewTitle);

    const timeLimit = ref(60);
    const setTimeLimit = (newTimeLimit: number) => {
      timeLimit.value = newTimeLimit;
    };

    // WORD SHUFFLING & RESETTING

    // custom type to distinguish which variables refer to words
    type WordIndex = number;
    const shuffledWordIndices = reactive<WordIndex[]>([]);
    const usedWordIndices = new Set<WordIndex>();
    const correctIndices = new Set<WordIndex>();

    const shuffleWords = () => {
      const words = viewWords;
      if (!words || words.length === 0) {
        return;
      }

      const unusedWordIndices = [];
      if (usedWordIndices.size < words.length) { // some words have not yet been used
        for (let i = 0; i < words.length; i += 1) {
          if (!usedWordIndices.has(i)) {
            unusedWordIndices.push(i);
          }
        }
      } else { // all words have been used
        usedWordIndices.clear();
        for (let i = 0; i < words.length; i += 1) {
          unusedWordIndices.push(i);
        }
      }
      const shuffledLeft = shuffle(unusedWordIndices);
      const shuffledRight = shuffle([...usedWordIndices.values()]);
      shuffledWordIndices.splice(0);
      shuffledWordIndices.splice(0, 0, ...shuffledLeft, ...shuffledRight);
    };

    // GAME LOOP

    const isStarted = ref(false);
    const isFinished = ref(false);

    type Cursor = number;
    const currentCursor = ref<Cursor>(0); // the index of shuffledWordIndices to display
    const lastCursor = ref<Cursor>(0); // the last word played to be used for scoring

    const endTime = ref(nowSeconds());
    const remainingSeconds = ref(0);
    let timer: number | undefined;

    const finish = () => {
      isFinished.value = true;
      endTime.value = nowSeconds();
      if (timer) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };

    const tick = () => {
      remainingSeconds.value = endTime.value - nowSeconds();
      if (remainingSeconds.value > 0) {
        timer = window.setTimeout(() => tick(), 1000);
      } else {
        finish();
      }
    };

    const start = () => {
      isStarted.value = true;
      endTime.value = nowSeconds() + timeLimit.value;
      tick();
    };

    const currentWord = computed<string>(() => (
      props.words
        ? props.words[shuffledWordIndices[currentCursor.value]]
        : ''
    ));

    const nextWord = () => {
      // add current index to used words
      usedWordIndices.add(shuffledWordIndices[currentCursor.value]);

      // find next unanswered word
      let i: number;
      if (currentCursor.value + 1 >= shuffledWordIndices.length) {
        i = 0;
      } else {
        i = currentCursor.value + 1;
      }

      let nextIndex = -1;
      while (i !== currentCursor.value && nextIndex === -1) {
        if (!correctIndices.has(i)) {
          nextIndex = i;
        } else if (i + 1 >= shuffledWordIndices.length) {
          i = 0;
        } else {
          i += 1;
        }
      }

      if (nextIndex === -1) {
        finish();
      } else if (nextIndex < shuffledWordIndices.length) {
        currentCursor.value = nextIndex;
      }

      if (nextIndex > lastCursor.value) {
        lastCursor.value = nextIndex;
      }
    };

    // GAME CONTROLS

    const correctWordThrottled = throttle(() => {
      correctIndices.add(currentCursor.value);
      nextWord();
    }, 500);

    const correctWord = ({ target }: { target: HTMLInputElement }) => {
      correctWordThrottled();
      if (target) target.blur();
    };

    const skipWordThrottled = throttle(() => nextWord(), 500);

    const skipWord = ({ target }: { target: HTMLInputElement }) => {
      skipWordThrottled();
      if (target) target.blur();
    };

    // SCORE SCREEN

    const score = computed<number>(() => correctIndices.size);

    const results = computed<Word[]>(() => {
      const words: Word[] = [];
      if (!props.words) {
        return words;
      }

      for (let i = 0; i <= lastCursor.value; i += 1) {
        words.push({
          word: props.words[shuffledWordIndices[i]],
          isCorrect: false,
        });
      }

      correctIndices.forEach((correctIndex) => {
        if (words[correctIndex]) {
          words[correctIndex].isCorrect = true;
        }
      });

      return words;
    });

    const reset = () => {
      isStarted.value = false;
      isFinished.value = false;
      currentCursor.value = 0;
      correctIndices.clear();
      lastCursor.value = 0;
      if (timer) {
        window.clearTimeout(timer);
        timer = undefined;
      }
      shuffleWords();
    };

    const playAgain = () => {
      if (nowSeconds() - endTime.value > 2) {
        reset();
      }
    };

    // INITIALISATION

    watch(props, () => {
      viewWords.splice(0);
      if (props.words) {
        viewWords.splice(0, 0, ...props.words);
      }
      viewTitle.value = props.title;

      reset();
      usedWordIndices.clear();
    });

    return {
      // START SCREEN
      viewTitle,
      goHome,
      isEditable,
      goEdit,
      canShare,
      goShare,
      timeLimit,
      setTimeLimit,

      // GAME LOOP
      isStarted,
      isFinished,
      currentWord,
      reset,
      start,
      correctWord,
      skipWord,
      remainingSeconds,

      // SCORE SCREEN
      results,
      score,
      playAgain,

      // icons
      faHome,
      faPlay,
      faStepForward,
      faCheck,
      faUndo,
      faEdit,
      faTimes,
      faShare,
    };
  },
});
</script>

<style>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
}
.overlay .half {
  height: 100%;
  flex-grow: 1;
}
@media (orientation: portrait) {
  .overlay {
    display: none;
  }
}
</style>
