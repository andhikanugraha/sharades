<template>
  <header>
    <div class="pull-left">
      <span id="expand" @click="goFullscreen"><v-icon :icon="faExpand" /></span>
      <span id="compress" @click="goExitFullscreen"><v-icon :icon="faCompress" /></span>
    </div>
    <h3>Sharades</h3>
  </header>
  <main class="home">
    <div class="content">
      <template v-if="storedTopics.length > 0">
        <h4>Your custom topics:</h4>
        <div class="topic-list">
          <p v-for="item in storedTopics" :key="item.id">
            <button @click="openStoredTopic(item.id)">{{ item.title }}</button>
          </p>
          <p>
            <button id="create" @click="createNewTopic">
              <v-icon :icon="faPlus" />
              New topic
            </button>
          </p>
        </div>
      </template>
      <p v-else>
        <button id="create" @click="createNewTopic">
          <v-icon :icon="faPlus" />Make your own topic
        </button>
      </p>
      <hr />
      <h4>Choose a topic:</h4>
      <div class="topic-list">
        <p v-for="topicTitle in builtInTopicTitles" :key="topicTitle">
          <button @click="openBuiltInTopic(topicTitle)">
            {{ topicTitle }}
          </button>
        </p>
      </div>
      <hr />
      <p>
        <button id="random" @click="openRandomTopic">
          <v-icon :icon="faRandom" />
          Play a random topic
        </button>
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  faExpand,
  faCompress,
  faPlus,
  faRandom,
} from '@fortawesome/free-solid-svg-icons';
import VIcon from '../components/VIcon.vue';
import { useBuiltInTopicTitles } from '../lib/topic';
import { useTopicIndex, goToTopicPage } from '../lib/TopicStore';
import { requestFullscreen, exitFullscreen } from '../lib/fullscreen';

(async function preload() {
  // eslint-disable-next-line
  import('./BuiltInTopic.vue');
  // eslint-disable-next-line
  import('./StoredTopic.vue');
}());

const router = useRouter();
const storedTopics = useTopicIndex();
const builtInTopicTitles = useBuiltInTopicTitles();

function goFullscreen() {
  requestFullscreen(true);
}

function goExitFullscreen() {
  exitFullscreen(true);
}

function openBuiltInTopic(builtInTopicTitle: string) {
  requestFullscreen(false);
  router.push({
    name: 'game-built-in',
    params: { builtInTopicTitle },
  });
}

function openStoredTopic(id: string) {
  requestFullscreen(false);
  goToTopicPage(router, id);
}

function createNewTopic() {
  router.push({ name: 'edit-new' });
  exitFullscreen(false);
}

function openRandomTopic() {
  const randomIndex = Math.round(
    Math.random() * (builtInTopicTitles.length - 1),
  );
  openBuiltInTopic(builtInTopicTitles[randomIndex]);
}
</script>

<style>
#app:fullscreen #expand {
  display: none;
}

/* the inverse styles are defined in index.html due to minifier bug */
</style>
