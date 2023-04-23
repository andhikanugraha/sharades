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
    <main class="results">
      <div class="content">
        <p class="play-again">
          <button @click="playAgain">
            <v-icon :icon="faUndo" @click="playAgain" />
            Play again
          </button>
        </p>
        <ol>
          <li v-for="(result, i) in results" :key="i" :class="{ correct: result.isCorrect }">
            {{ result.word }}
            <v-icon :icon="faCheck" v-if="result.isCorrect" />
          </li>
        </ol>
      </div>
    </main>
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
  <template v-else-if="!isSharing">
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
              v-for="(opt) in timeLimitOptions"
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
  <template v-else>
    <the-share-dialog
      :title="props.title"
      @close="isSharing = false"
      @edit="goEdit"
      :is-editable="isEditable" />
  </template>
</template>

<script lang="ts" setup>
import {
  ref, computed,
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
import { throttle } from 'lodash-es';
import TheShareDialog from './TheShareDialog.vue';
import { useGame } from '../lib/game';
import { exitFullscreen } from '../lib/fullscreen';

import VIcon from './VIcon.vue';
import VFit from './VFit.vue';

const props = defineProps<{
  title: string,
  words: string[],
  id?: string,
}>();

const router = useRouter();

const viewTitle = computed(() => props.title);

// NAVIGATION

const goHome = async () => {
  router.push({ name: 'home' });
  await exitFullscreen(false);
};

const isEditable = computed(() => !!props.id);
const goEdit = () => {
  exitFullscreen(false);
  if (props.id) {
    router.push({
      name: 'edit',
      params: { id: props.id },
    });
  }
};

const canShare = true;
const isSharing = ref(false);
function goShare() {
  isSharing.value = true;
}

// START SCREEN

const timeLimitOptions = [30, 60, 90, 120];
const timeLimit = ref(60);
const setTimeLimit = (newTimeLimit: number) => {
  timeLimit.value = newTimeLimit;
};

// GAME LOOP

const {
  isStarted, isFinished,
  start,
  remainingSeconds, currentWord,
  playerCorrect, playerSkip,
  score, results, reset,
} = useGame(props, timeLimit);

// GAME CONTROLS

const correctWordThrottled = throttle(playerCorrect, 500);
function correctWord(event: MouseEvent) {
  const target = event.target as HTMLInputElement | null;
  correctWordThrottled();
  if (target) { target.blur(); }
}

const skipWordThrottled = throttle(playerSkip, 500);
function skipWord(event: MouseEvent) {
  const target = event.target as HTMLInputElement | null;
  skipWordThrottled();
  if (target) { target.blur(); }
}

// SCORE SCREEN

function playAgain() {
  reset();
}
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

.play-again {
  padding-bottom: calc(2 * var(--font-size-base));
}
.play-again button {
  width: auto;
  display: inline-block;
}

@media (orientation: portrait) {
  .overlay {
    display: none;
  }
}
</style>
