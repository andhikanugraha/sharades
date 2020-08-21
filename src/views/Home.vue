<template>
  <header>
    <div class="pull-left">
      <span id="expand"><v-icon
        :icon="faExpand"
        @click="requestFullscreen"
      /></span>
      <span id="compress"><v-icon
        :icon="faCompress"
        @click="exitFullscreen"
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

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import VIcon from '../components/VIcon.vue';
import { useBuiltInTopicTitles } from '../lib/topic';
import { useTopicIndex, goToTopicPage } from '../lib/TopicStore';
import { requestFullscreen, exitFullscreen } from '../lib/fullscreen';

export default defineComponent({
  name: 'Home',
  components: {
    VIcon,
  },
  setup() {
    const router = useRouter();
    const storedTopics = useTopicIndex();
    const builtInTopicTitles = useBuiltInTopicTitles();

    const openBuiltInTopic = (builtInTopicTitle: string) => {
      requestFullscreen(false);
      router.push({
        name: 'game-built-in',
        params: { builtInTopicTitle },
      });
    };

    const openStoredTopic = (id: string) => {
      requestFullscreen(false);
      goToTopicPage(router, id);
    };

    const createNewTopic = () => {
      router.push({ name: 'edit-new' });
    };

    const openRandomTopic = () => {
      const randomIndex = Math.round(
        Math.random() * (builtInTopicTitles.length - 1),
      );
      openBuiltInTopic(builtInTopicTitles[randomIndex]);
    };

    return {
      storedTopics,
      builtInTopicTitles,
      createNewTopic,
      requestFullscreen,
      exitFullscreen,
      openStoredTopic,
      openBuiltInTopic,
      openRandomTopic,
      faExpand,
      faCompress,
    };
  },
});
</script>

<style>
#app:fullscreen #expand {
  display: none;
}
/* the inverse styles are defined in index.html due to minifier bug */
</style>
