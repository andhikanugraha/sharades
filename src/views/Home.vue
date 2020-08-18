<template>
  <div class="root">
    <header>
      <div class="pull-left">
        <font-awesome-icon
          class="expand-button"
          icon="expand"
          @click="requestFullscreen"
        />
        <font-awesome-icon
          class="compress-button"
          icon="compress"
          @click="exitFullscreen"
        />
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "@vue/composition-api";
import { getBuiltInTopicTitles } from "../topic";
import type { TopicIndex } from "../lib/TopicStore";
import router from "../router";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

const Home = defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    storedTopics: Array as { new (): TopicIndex },
    builtInTopicTitles: Array as { new (): string[] },
    isFullScreen: Boolean,
  },
  setup(props, { emit }) {
    const autoFullScreen = ref(props.isFullScreen);
    library.add(faExpand, faCompress);

    const openBuiltInTopic = (topicTitle: string) => {
      if (autoFullScreen.value) {
        requestFullscreen();
      }
      router.push({
        name: "game-built-in",
        params: {
          builtInTopicTitle: topicTitle,
        },
      });
    };

    const openStoredTopic = (id: string) => {
      if (autoFullScreen.value) {
        requestFullscreen();
      }
      router.push({
        name: "game-stored-topic",
        params: { id },
      });
    };

    const createNewTopic = () => {
      router.push({
        name: "edit-new",
      });
    };

    const openRandomTopic = () => {
      if (!props.builtInTopicTitles) {
        return;
      }
      const randomIndex = Math.round(
        Math.random() * (props.builtInTopicTitles.length - 1)
      );
      openBuiltInTopic(props.builtInTopicTitles[randomIndex]);
    };

    const requestFullscreen = () => {
      emit("request-full-screen");
    };

    const exitFullscreen = () => {
      autoFullScreen.value = false;
      emit("exit-full-screen");
    };

    watchEffect(() => {
      if (!props.builtInTopicTitles || props.builtInTopicTitles.length === 0) {
        emit("load-built-in-topics");
        emit("load-stored-topics");
        autoFullScreen.value = true;
      }
    });

    return {
      autoFullScreen,
      createNewTopic,
      requestFullscreen,
      exitFullscreen,
      openStoredTopic,
      openBuiltInTopic,
      openRandomTopic,
    };
  },
});

export default Home;
</script>

<style lang="scss">
:fullscreen .expand-button {
  display: none;
}
body:not(:fullscreen) .compress-button {
  display: none;
}
</style>
