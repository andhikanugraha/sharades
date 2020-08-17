<template>
  <the-editor
    :title="title"
    :words="words"
    :id="id"
    @save="handleSave"
    @delete="handleDelete"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
} from "@vue/composition-api";
import { Topic } from "../topic";
import {
  TopicIndex,
  saveTopic,
  loadTopic,
  deleteTopic,
} from "../lib/TopicStore";
import TheEditor from "../components/TheEditor.vue";
import router from "../router";

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

const Edit = defineComponent({
  components: { TheEditor },
  props: { id: String, storedTopics: Array as { new (): TopicIndex } },
  setup(props, { emit }) {
    const getStartingTopic = () => {
      if (props.storedTopics && props.id) {
        return props.storedTopics.find((t) => t.id === props.id);
      }
    };
    const title = ref(getStartingTopic()?.title);
    const words = reactive<string[]>([]);
    const existing = ref(false);
    const _id = ref(props.id);

    const handleSave = async (updatedTopic: Topic) => {
      _id.value = await saveTopic(updatedTopic, _id.value);
      emit("load-stored-topics");

      router.push({
        name: "game-stored-topic",
        params: { id: _id.value },
      });
    };

    const handleDelete = async () => {
      await deleteTopic(_id.value);
      emit("load-stored-topics");
      router.push({ name: "home" });
    };

    (async () => {
      try {
        const topic = await loadTopic(props.id);
        title.value = topic.title;
        words.splice(0);
        words.splice(0, 0, ...topic.words);
        existing.value = true;
      } catch {
        _id.value = "";
      }
    })();

    return {
      title,
      words,
      existing,
      handleSave,
      handleDelete,
    };
  },
});

export default Edit;
</script>
