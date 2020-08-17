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
            <button @click="openTopic(topicTitle)">
              {{ topicTitle }}
            </button>
          </p>
          <hr />
          <p><button id="random" @click="random">Random</button></p>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { getBuiltInTopicTitles, Topic } from "../topic";
import router from "../router";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

const Home = defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    storedTopics: Array as { new (): Topic[] },
    builtInTopicTitles: Array as { new (): string[] },
    isFullScreen: Boolean,
  },
  setup(props, { emit }) {
    const autoFullScreen = ref(props.isFullScreen);
    library.add(faExpand, faCompress);

    if (props.builtInTopicTitles.length === 0) {
      emit("load-built-in-topics");
      emit("load-stored-topics");
      autoFullScreen.value = true;
    }

    async function openTopic(topicTitle: string) {
      try {
        if (autoFullScreen) {
          await requestFullscreen();
        }
      } finally {
        router.push({
          name: "game-built-in",
          params: {
            builtInTopicTitle: topicTitle,
          },
        });
      }
    }

    const openStoredTopic = async (id: string) => {
      try {
        if (autoFullScreen.value) {
          await requestFullscreen();
        }
      } finally {
        router.push({
          name: "game-stored-topic",
          params: { id },
        });
      }
    };

    const createNewTopic = () => {
      router.push({
        name: "edit-new",
      });
    };

    const requestFullscreen = () => {
      emit("request-full-screen");
    };

    const exitFullscreen = () => {
      autoFullScreen.value = false;
      emit("exit-full-screen");
    };

    const random = () => {
      const randomIndex = Math.round(
        Math.random() * (props.builtInTopicTitles.length - 1)
      );
      openTopic(props.builtInTopicTitles[randomIndex]);
    };

    return {
      autoFullScreen,
      createNewTopic,
      requestFullscreen,
      exitFullscreen,
      openStoredTopic,
      openTopic,
      random,
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
