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

<script lang="ts" setup>
import {
  ref,
  reactive,
  watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import { requestFullscreen } from '../lib/fullscreen';
import { Topic } from '../lib/topic';
import {
  useTopicIndex,
  saveTopic,
  loadTopic,
  deleteTopic,
  goToTopicPage,
} from '../lib/TopicStore';
import TheEditor from '../components/TheEditor.vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const storedTopics = useTopicIndex();
const title = ref(storedTopics.find((t) => t.id === props.id)?.title || '');
const words = reactive<string[]>([]);
const existing = ref(false);
const topicId = ref(props.id);

const handleSave = async (updatedTopic: Topic) => {
  await saveTopic(updatedTopic, topicId.value);
  goToTopicPage(router, topicId.value);
  await requestFullscreen(false);
};

const handleDelete = async () => {
  await deleteTopic(topicId.value);
  router.push({ name: 'home' });
  await requestFullscreen(false);
};

const handleCancel = async () => {
  goToTopicPage(router, topicId.value);
  await requestFullscreen(false);
};

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

</script>
