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
} from 'vue';
import { Topic } from '../lib/topic';
import {
  TopicIndex,
  saveTopic,
  loadTopic,
  deleteTopic,
} from '../lib/TopicStore';
import TheEditor from '../components/TheEditor.vue';
import router from '../router';

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default defineComponent({
  name: 'Edit',
  components: { TheEditor },
  props: { id: String, storedTopics: Array as { new (): TopicIndex } },
  setup(props, { emit }) {
    const getStartingTopic = () => {
      if (props.storedTopics && props.id) {
        return props.storedTopics.find((t) => t.id === props.id);
      }

      return undefined;
    };

    const title = ref(getStartingTopic()?.title);
    const words = reactive<string[]>([]);
    const existing = ref(false);
    const topicId = ref(props.id);

    const handleSave = async (updatedTopic: Topic) => {
      topicId.value = await saveTopic(updatedTopic, topicId.value);
      emit('load-stored-topics');

      router.push({
        name: 'game-stored-topic',
        params: { id: topicId.value },
      });
    };

    const handleDelete = async () => {
      if (!topicId.value) return;

      await deleteTopic(topicId.value);
      emit('load-stored-topics');
      router.push({ name: 'home' });
    };

    (async () => {
      if (!props.id) {
        topicId.value = '';
        return;
      }

      const topic = await loadTopic(props.id);
      if (!topic) {
        topicId.value = '';
        return;
      }

      title.value = topic.title;
      words.splice(0);
      words.splice(0, 0, ...topic.words);
      existing.value = true;
      topicId.value = props.id;
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
</script>
