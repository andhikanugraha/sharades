<template>
  <the-editor
    :title="title"
    :words="words"
    :id="id"
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
  TopicIndex,
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
  props: { id: String, storedTopics: Array as { new (): TopicIndex } },
  setup(props) {
    const router = useRouter();

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
      const id = await saveTopic(updatedTopic, topicId.value);

      if (id) {
        topicId.value = id;
        goToTopicPage(router, topicId.value);
      }
    };

    const handleDelete = async () => {
      if (!topicId.value) return;

      await deleteTopic(topicId.value);
      router.push({ name: 'home' });
    };

    const handleCancel = () => {
      if (topicId.value) {
        goToTopicPage(router, topicId.value);
      } else {
        router.push({ name: 'home' });
      }
    };

    watchEffect(async () => {
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
      handleCancel,
    };
  },
});
</script>
