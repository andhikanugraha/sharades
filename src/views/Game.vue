<template>
  <the-game
    v-if="topic"
    :encodedTopic="encodedTopic"
    :topic="topic"
    :is-editable="isEditable"
    :go-home="goHome"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { decodeTopic, Topic, getDefaultTopicByTitle } from "../topic";

export default Vue.extend({
  components: {
    TheGame: () => import("../components/TheGame.vue"),
  },
  data() {
    const { encodedTopic, builtInTopicTitle, homeParams } = this.$route.params;
    let topic: Topic;
    let isEditable = false;

    return {
      topic,
      encodedTopic,
      isEditable,
      homeParams,
    };
  },
  async created() {
    const { encodedTopic, builtInTopicTitle } = this.$route.params;
    let topic: Topic;
    let isEditable = false;
    try {
      if (encodedTopic) {
        topic = await decodeTopic(encodedTopic);
        isEditable = true;
      } else if (builtInTopicTitle) {
        topic = await getDefaultTopicByTitle(builtInTopicTitle);
      }
    } catch (e) {
      this.$router.replace({ name: "home" });

      topic = {
        title: "",
        words: [],
      };
    }

    this.topic = topic;
    this.isEditable = isEditable;
  },
  methods: {
    goHome() {
      this.$router.replace({
        name: "home",
        params: this.homeParams,
      });
    },
  },
});
</script>
