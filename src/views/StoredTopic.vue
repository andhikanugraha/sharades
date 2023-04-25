<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useCustomTopicsStore } from '../lib/topic-store';
import TheGame from '../components/TheGame.vue';

// this component receives either an id or encodedTopic
const props = defineProps<{
  id?: string, encodedTopic?: string
}>();

const router = useRouter();

const store = useCustomTopicsStore();

const { title, words } = storeToRefs(store);
const topicId = ref(props.id);

function notFound() {
  router.replace({ name: 'home' });
}

watchEffect(
  async (): Promise<void> => {
    if (!props.encodedTopic && !props.id) {
      return notFound();
    }

    // topic already exists. load from storage.
    // ignore props.encodedTopic
    if (props.id) {
      const topicInIndex = store.findTopicInIndex(props.id);

      if (!topicInIndex) {
        return notFound();
      }

      const topic = await store.resolveTopicById(props.id);
      if (!topic) {
        return notFound();
      }
    } else if (props.encodedTopic) {
      const topic = await store.resolveTopicByEncodedTopic(props.encodedTopic);

      if (!topic) {
        return notFound();
      }

      if (topic.id) {
        topicId.value = topic.id;
      }
    }

    return undefined;
  },
);
</script>

<template>
  <the-game
    :title="title"
    :words="words"
    :id="topicId"
  />
</template>
