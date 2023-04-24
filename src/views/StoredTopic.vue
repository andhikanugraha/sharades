<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useTopicIndex, resolveTopic } from '../lib/TopicStore';
import TheGame from '../components/TheGame.vue';

// this component receives either an id or encodedTopic
const props = defineProps<{
  id?: string, encodedTopic?: string
}>();

const router = useRouter();
const storedTopics = useTopicIndex();

const title = ref('\xa0');
const words = ref<string[]>([]);
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
      const topicInIndex = storedTopics.find((t) => t.id === props.id);

      if (!topicInIndex) {
        return notFound();
      }
    }

    const results = await resolveTopic(
      { id: props.id, encodedTopic: props.encodedTopic },
      router,
    );

    if (results) {
      const [id, topic] = results;

      topicId.value = id;
      title.value = topic.title;
      words.value = topic.words;
    } else {
      return notFound();
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
