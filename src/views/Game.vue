<template>
  <the-game
    :title="title"
    :words="words"
    :is-editable="isEditable"
    @edit-topic="goEdit"
    @go-home="goHome"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Topic, getDefaultTopicByTitle } from "../topic";
import { loadTopic, findTopicId, saveTopic } from "../lib/TopicStore";
import { encodeTopic, decodeTopic } from "../lib/TopicEncoding";

export default Vue.extend({
  components: {
    TheGame: () => import("../components/TheGame.vue"),
  },
  props: ["id", "builtInTopicTitle", "encodedTopic"],
  data() {
    return {
      title: "Loading...",
      words: [],
      isEditable: false,
      newId: null,
    };
  },
  async mounted() {
    const { encodedTopic, builtInTopicTitle, id } = this;
    let topic: Topic;
    let isEditable = false;
    try {
      if (builtInTopicTitle) {
        topic = await getDefaultTopicByTitle(builtInTopicTitle);
      }
      if (id) {
        topic = await loadTopic(id);
        if (!encodedTopic) {
          const encodedTopic = await encodeTopic(topic);
          this.$router.replace({ name: "game", params: { encodedTopic, id } });
        }
        isEditable = true;
      } else if (encodedTopic) {
        topic = await decodeTopic(encodedTopic);
        isEditable = true;
        let id = await findTopicId(topic);
        if (!id) {
          id = await saveTopic(topic);
          this.$emit('load-stored-topics');
          this.newId = id;
        }
        this.id = id;
      }
    } catch (e) {
      this.goHome();
    }

    this.title = topic.title;
    this.words = topic.words;
    this.isEditable = isEditable;
  },
  methods: {
    goHome() {
      this.$router.replace({
        name: "home",
      });
    },
    goEdit() {
      this.$router.push({
        name: "edit",
        params: { id: this.newId || this.id },
      });
    },
  },
});
</script>
