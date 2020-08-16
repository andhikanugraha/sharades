<template>
  <the-editor
    v-if="topic"
    :topic="topic"
    :originalEncodedTopic="originalEncodedTopic"
    @save="handleSave"
    @delete="handleDelete"
  />
</template>

<script lang="ts">
import Vue from "vue";
import {
  decodeTopic,
  encodeTopic,
  Topic,
  compareTopic,
  updateTopic,
  removeTopic,
} from "../topic";

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default Vue.extend({
  components: {
    TheEditor: () => import("../components/TheEditor.vue"),
  },
  data() {
    const { encodedTopic } = this.$route.params;
    return {
      topic: null,
      originalEncodedTopic: encodedTopic,
      existing: false,
    };
  },
  async created() {
    const { encodedTopic } = this.$route.params;
    let decodedTopic: Topic;
    let existing: boolean;
    if (encodedTopic) {
      try {
        decodedTopic = await decodeTopic(this.$route.params.encodedTopic);
        existing = true;
      } catch (e) {
        this.$router.push({ name: "home" });
      }
    } else {
      decodedTopic = {
        title: "",
        words: [],
      };
      existing = false;
    }

    this.topic = decodedTopic;
    this.existing = existing;
  },
  methods: {
    async handleSave(updatedTopic: Topic) {
      // Logic:
      // If editing a default topic, save it as new.
      // If it's a new topic, save it as new.
      //   If there's a name conflict, resolve it automatically.
      // If editing a custom topic, see if there are any changes
      //   If there are any changes, overwrite the old one
      //   If there are no changes, do nothing

      let treatAsNew = false;

      const { originalEncodedTopic = "" } = this;
      await updateTopic(originalEncodedTopic, updatedTopic);

      this.$router.push({
        name: "game",
        params: { encodedTopic: await encodeTopic(updatedTopic) },
      });
    },

    async handleDelete(encodedTopic: string) {
      await removeTopic(encodedTopic);
      this.$router.push({ name: "home" });
    },
  },
});
</script>
