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
        <div class="info" v-if="isLoaded">
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
import Vue from "vue";
import { getBuiltInTopicTitles, Topic } from "../topic";
import { TopicIndex, loadTopic } from "../lib/TopicStore";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import { encodeTopic } from "@/lib/TopicEncoding";

interface HomeData {
  builtInTopicTitles: string[];
  storedTopics: Topic[];
  autoFullScreen: boolean;
  isLoaded: boolean;
}
interface HomeParams {
  builtInTopicTitles: string[];
  storedTopics: Topic[];
  autoFullScreen: boolean;
}
interface ComputedTopicLink {
  title: string;
  encodedTopic: string;
}

export default Vue.extend({
  components: {
    FontAwesomeIcon: async () =>
      (await import("@fortawesome/vue-fontawesome")).FontAwesomeIcon,
  },
  props: ["storedTopics", "builtInTopicTitles", "isFullScreen"],
  data() {
    const { autoFullScreen = false } = (this.$route
      .params as unknown) as HomeParams;
    return {
      autoFullScreen: this.isFullScreen,
      isLoaded: true,
    };
  },
  async created() {
    const { library } = await import("@fortawesome/fontawesome-svg-core");
    library.add(faExpand, faCompress);

    if (this.builtInTopicTitles.length === 0) {
      this.$emit("load-built-in-topics");
      this.$emit("load-stored-topics");
      this.autoFullScreen = true;
    }
  },
  methods: {
    async openTopic(topicTitle: string) {
      try {
        if (this.autoFullScreen) {
          await this.requestFullscreen();
        }
      } finally {
        this.$router.push({
          name: "game-built-in",
          params: {
            builtInTopicTitle: topicTitle,
            homeParams: {
              builtInTopicTitles: this.builtInTopicTitles,
              storedTopics: this.storedTopics,
              autoFullScreen: this.autoFullScreen,
            },
          },
        });
      }
    },

    async openStoredTopic(id: string) {
      try {
        if (this.autoFullScreen) {
          await this.requestFullscreen();
        }
      } finally {
        this.$router.push({
          name: "game-stored-topic",
          params: { id },
        });
      }
    },

    createNewTopic() {
      this.$router.push({
        name: "edit-new",
      });
    },

    async requestFullscreen() {
      this.$emit("request-full-screen");
    },

    async exitFullscreen() {
      this.autoFullScreen = false;
      this.$emit("exit-full-screen");
    },

    random() {
      const randomIndex = Math.round(
        Math.random() * (this.builtInTopicTitles.length - 1)
      );
      this.openTopic(this.builtInTopicTitles[randomIndex]);
    },
  },
});
</script>

<style lang="scss">
:fullscreen .expand-button {
  display: none;
}
body:not(:fullscreen) .compress-button {
  display: none;
}
</style>
