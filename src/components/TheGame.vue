<template>
  <div class="root" id="finished" v-if="isFinished">
    <header>
      <div class="close-button" @click="reset">
        <v-icon :icon="faTimes" fixed-width />
      </div>
      <h3>Score: {{ score }}</h3>
    </header>
    <main>
      <div>
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
        <button id="reset" @click="reset">
          <v-icon :icon="faUndo" />Play again
        </button>
      </p>
    </nav>
  </div>
  <div class="root" id="active" v-else-if="isStarted">
    <header>
      <div class="close-button" @click="reset">
        <v-icon :icon="faTimes" fixed-width />
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
        <button id="correct">
          <v-icon :icon="faCheck" />Correct
        </button>
      </p>
      <p @click="nextWord">
        <button id="skip">
          <v-icon :icon="faStepForward" />Skip
        </button>
      </p>
    </nav>
  </div>
  <div class="root" id="initial" v-else>
    <header>
      <div class="close-button" @click="goHome">
        <v-icon :icon="faHome" />
      </div>
      <div class="pull-right">
        <v-icon @click="edit" :icon="faEdit" v-if="isEditable" />
        <v-icon @click="share" :icon="faShare" />
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
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, watch, computed,
} from 'vue';
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
import shuffle from 'lodash/shuffle';
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
    isEditable: Boolean,
    words: Array as { new (): string[] },
    title: String,
  },
  setup(props, { emit }) {
    const viewTitle = ref(props.title);
    const viewWords = reactive(props.words || []);
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
    const timer = ref<number | undefined>();

    const setTimeLimit = (newTimeLimit: number) => {
      timeLimit.value = newTimeLimit;
    };

    const share = () => {
      try {
        (navigator as Navigator).share({
          title: `Sharades: ${viewTitle.value}`,
          url: window.location.toString(),
        });
      } finally {
        // do nothing
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

      let nextIndex = -1;
      while (i !== currentIndex.value && nextIndex === -1) {
        if (!answeredSet.has(i)) {
          nextIndex = i;
        } else if (i + 1 >= shuffledWords.length) {
          i = 0;
        } else {
          i += 1;
        }
      }

      if (nextIndex === -1) {
        finish();
      } else if (nextIndex < shuffledWords.length) {
        currentIndex.value = nextIndex;
      }

      if (nextIndex > maxViewedIndex.value) {
        maxViewedIndex.value = nextIndex;
      }
    };

    const shuffleWords = () => {
      const words = viewWords;
      if (!words || words.length === 0) {
        return;
      }

      const indices = [];
      if (usedWordIndices.size < words.length) {
        for (let i = 0; i < words.length; i += 1) {
          if (!usedWordIndices.has(i)) {
            indices.push(i);
          }
        }
      } else {
        for (let i = 0; i < words.length; i += 1) {
          indices.push(i);
        }
        usedWordIndices.clear();
      }
      const shuffledLeft = shuffle(indices);
      const shuffledRight = shuffle(Array.from(usedWordIndices.values()));
      shuffledWords.splice(0);
      shuffledWords.splice(0, 0, ...shuffledLeft, ...shuffledRight);
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

    const updateRemainingSeconds = () => {
      remainingSeconds.value = endTime.value - nowSeconds();
    };

    const tick = () => {
      updateRemainingSeconds();
      if (remainingSeconds.value > 0) {
        timer.value = setTimeout(() => tick(), 1000);
      } else {
        isFinished.value = true;
      }
    };

    const start = () => {
      isStarted.value = true;
      endTime.value = nowSeconds() + timeLimit.value;
      tick();
    };

    const edit = () => {
      emit('edit-topic');
    };

    const goHome = () => {
      emit('go-home');
    };

    const correctWord = () => {
      correctIndices.add(currentIndex.value);
      nextWord();
    };

    watch(props, () => {
      viewWords.splice(0);
      if (props.words) {
        viewWords.splice(0, 0, ...props.words);
      }
      shuffleWords();
      viewTitle.value = props.title;
    });

    const currentWord = computed<string>(() => (props.words ? props.words[shuffledWords[currentIndex.value]] : ''));
    const results = computed<Word[]>(() => {
      const words: Word[] = [];
      if (!props.words) {
        return words;
      }

      for (let i = 0; i <= maxViewedIndex.value; i += 1) {
        words.push({
          word: props.words[shuffledWords[i]],
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

    const score = computed<number>(() => correctIndices.size);

    return {
      viewTitle,
      share,
      currentWord,
      results,
      score,
      timeLimit,
      setTimeLimit,
      nextWord,
      finish,
      reset,
      start,
      edit,
      goHome,
      correctWord,
      shuffledWords,
      remainingSeconds,
      isStarted,
      isFinished,
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
