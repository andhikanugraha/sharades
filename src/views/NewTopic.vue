<template>
  <the-editor
    :title="title"
    :words="words"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { requestFullscreen } from '../lib/fullscreen';
import type { Topic } from '../lib/topic';
import { useCustomTopicsStore } from '../lib/topic-store';
import TheEditor from '../components/TheEditor.vue';

const router = useRouter();
const store = useCustomTopicsStore();

const title = ref('');
const words = reactive<string[]>([]);

async function handleSave(updatedTopic: Topic) {
  const id = await store.saveTopic(updatedTopic);

  if (id) {
    store.goToTopicPage(id);
    await requestFullscreen(false);
  }
}

async function handleCancel() {
  router.push({ name: 'home' });
  await requestFullscreen();
}
</script>
