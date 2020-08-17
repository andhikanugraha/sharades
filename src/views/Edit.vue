<template>
  <the-editor
    :title="topic.title"
    :words="topic.words"
    :id="id"
    @save="handleSave"
    @delete="handleDelete"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Topic } from "../topic";

import { saveTopic, loadTopic, deleteTopic } from "../lib/TopicStore";

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default Vue.extend({
  components: {
    TheEditor: () => import("../components/TheEditor.vue"),
  },
  props: ["id"],
  data() {
    const { encodedTopic } = this.$route.params;
    return {
      topic: null,
      originalEncodedTopic: encodedTopic,
      existing: false,
    };
  },
  async created() {
    const { id } = this;

    if (id) {
      this.topic = await loadTopic(id);
      this.existing = true;
    } else {
      this.existing = false;
      this.topic = {
        title: "",
        words: [],
      };
    }
  },
  methods: {
    async handleSave(updatedTopic: Topic) {
      this.id = await saveTopic(updatedTopic, this.id);
      this.$emit("load-stored-topics");

      this.$router.push({
        name: "game-stored-topic",
        params: { id: this.id },
      });
    },

    async handleDelete() {
      await deleteTopic(this.id);
      this.$emit("load-stored-topics");
      this.$router.push({ name: "home" });
    },
  },
});
</script>
