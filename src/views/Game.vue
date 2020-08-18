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
import { defineComponent, ref, watch, watchEffect } from "@vue/composition-api";
import { Topic, getDefaultTopicByTitle } from "../topic";
import {
  TopicIndex,
  loadTopic,
  findTopicId,
  saveTopic,
} from "../lib/TopicStore";
import { encodeTopic, decodeTopic } from "../lib/TopicEncoding";
import TheGame from "../components/TheGame.vue";
import router from "../router";

const Game = defineComponent({
  components: { TheGame },
  props: {
    id: String,
    encodedTopic: String,
    builtInTopicTitle: String,
    storedTopics: Array as { new (): TopicIndex },
  },
  setup(props, { emit }) {
    const getStartingTitle = () => {
      if (props.storedTopics && props.id) {
        return props.storedTopics.find((t) => t.id === props.id)?.title;
      } else if (props.builtInTopicTitle) {
        return props.builtInTopicTitle;
      }
    };
    const title = ref(getStartingTitle() || "\xa0");
    const words = ref<string[]>([]);
    const isEditable = ref(false);
    const _id = ref(props.id);

    const goHome = () => {
      router.push({
        name: "home",
      });
    };

    const goEdit = () => {
      router.push({
        name: "edit",
        params: { id: _id.value || "" },
      });
    };

    watchEffect(
      async (): Promise<void> => {
        const topic: Topic = {
          title: "",
          words: [],
        };

        try {
          if (props.builtInTopicTitle) {
            const testTopic = await getDefaultTopicByTitle(
              props.builtInTopicTitle
            );
            if (!testTopic) throw true;

            Object.assign(topic, testTopic);
          } else if (props.id) {
            const testTopic = await loadTopic(props.id);
            if (!testTopic) throw true;
            isEditable.value = true;
            Object.assign(topic, testTopic);

            if (!props.encodedTopic) {
              const encodedTopic = await encodeTopic(topic);
              router.replace({
                name: "game",
                params: { encodedTopic, id: props.id },
              });
            }
          } else if (props.encodedTopic) {
            const testTopic = await decodeTopic(props.encodedTopic);
            if (!testTopic) throw true;
            isEditable.value = true;
            Object.assign(topic, testTopic);

            let theId = await findTopicId(topic);
            if (!theId) {
              theId = await saveTopic(topic);
              emit("load-stored-topics");
            }
            _id.value = theId;
          }
        } catch (e) {
          router.replace({ name: "home" });
        } finally {
          title.value = topic.title;
          words.value = topic.words;
        }
      }
    );

    return {
      title,
      words,
      isEditable,
      goHome,
      goEdit,
    };
  },
});

export default Game;
</script>
