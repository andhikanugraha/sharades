<template>
  <the-editor
    :title="title"
    :words="words"
    :id="topicId"
    @save="handleSave"
    @delete="handleDelete"
    @cancel="handleCancel"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import { Topic } from '../lib/topic';
import {
  useTopicIndex,
  saveTopic,
  loadTopic,
  deleteTopic,
  goToTopicPage,
} from '../lib/TopicStore';
import TheEditor from '../components/TheEditor.vue';

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default defineComponent({
  name: 'Edit',
  components: { TheEditor },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const storedTopics = useTopicIndex();
    const title = ref(storedTopics.find((t) => t.id === props.id)?.title || '');
    const words = reactive<string[]>([]);
    const existing = ref(false);
    const topicId = ref(props.id);

    const handleSave = async (updatedTopic: Topic) => {
      await saveTopic(updatedTopic, topicId.value);
      goToTopicPage(router, topicId.value);
    };

    const handleDelete = async () => {
      await deleteTopic(topicId.value);
      router.push({ name: 'home' });
    };

    const handleCancel = () => goToTopicPage(router, topicId.value);

    watchEffect(async () => {
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
      topicId,
      handleSave,
      handleDelete,
      handleCancel,
    };
  },
});
</script>
