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
import { useCustomTopicsStore } from '../lib/topic-store';
import TheEditor from '../components/TheEditor.vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const store = useCustomTopicsStore();

const title = ref(store.findTopicInIndex(props.id)?.title || '');
const words = reactive<string[]>([]);
const existing = ref(false);
const topicId = ref(props.id);

const handleSave = async (updatedTopic: Topic) => {
  await store.saveTopic(updatedTopic, topicId.value);
  store.goToTopicPage(topicId.value);
  await requestFullscreen(false);
};

const handleDelete = async () => {
  await store.deleteTopic(topicId.value);
  router.push({ name: 'home' });
  await requestFullscreen(false);
};

const handleCancel = async () => {
  store.goToTopicPage(topicId.value);
  await requestFullscreen(false);
};

watchEffect(async () => {
  const topic = await store.loadTopic(props.id);
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
