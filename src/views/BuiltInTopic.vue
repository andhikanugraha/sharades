<template>
  <the-game
    :title="title"
    :words="words"
  />
</template>

<script lang="ts" setup>
import {
  ref, watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import { getBuiltInTopicByTitle } from '../lib/topic';
import TheGame from '../components/TheGame.vue';

const props = defineProps<{ builtInTopicTitle: string }>();

const router = useRouter();
const title = ref(props.builtInTopicTitle || '\xa0');
const words = ref<string[]>([]);

const notFound = () => router.replace({ name: 'home' });

watchEffect(async () => {
  const { builtInTopicTitle } = props;
  if (!builtInTopicTitle) {
    notFound();
    return;
  }

  const topic = await getBuiltInTopicByTitle(builtInTopicTitle);
  if (!topic) {
    notFound();
    return;
  }

  title.value = topic.title;
  words.value = topic.words;
});
</script>
