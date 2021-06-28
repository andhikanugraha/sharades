<template>
  <header>
    <div class="pull-left">
      <span id="expand" @click="goFullscreen"><v-icon
        :icon="faExpand"
      /></span>
      <span id="compress" @click="goExitFullscreen"><v-icon
        :icon="faCompress"
      /></span>
    </div>
    <h3>Sharades</h3>
  </header>
  <main>
    <div class="scrollable">
      <div class="info">
        <p v-for="item in storedTopics" :key="item.id">
          <button @click="openStoredTopic(item.id)">{{ item.title }}</button>
        </p>
        <p>
          <button id="create" @click="createNewTopic">
            Make your own topic
          </button>
        </p>
        <hr />
        <div class="label">Choose a topic:</div>
        <p v-for="topicTitle in builtInTopicTitles" :key="topicTitle">
          <button @click="openBuiltInTopic(topicTitle)">
            {{ topicTitle }}
          </button>
        </p>
        <hr />
        <p>
          <button id="random" @click="openRandomTopic">Random</button>
        </p>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import VIcon from '../components/VIcon.vue';
import { useBuiltInTopicTitles } from '../lib/topic';
import { useTopicIndex, goToTopicPage } from '../lib/TopicStore';
import { requestFullscreen, exitFullscreen } from '../lib/fullscreen';

(async function preload() {
  // eslint-disable-next-line
  import('./BuiltInTopic.vue');
  // eslint-disable-next-line
  import('./StoredTopic.vue');
})();

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
};

function openStoredTopic(id: string) {
  requestFullscreen(false);
  goToTopicPage(router, id);
};

function createNewTopic() {
  router.push({ name: 'edit-new' });
  exitFullscreen(false);
};

function openRandomTopic() {
  const randomIndex = Math.round(
    Math.random() * (builtInTopicTitles.length - 1),
  );
  openBuiltInTopic(builtInTopicTitles[randomIndex]);
};
</script>

<style>
#app:fullscreen #expand {
  display: none;
}
/* the inverse styles are defined in index.html due to minifier bug */
</style>
