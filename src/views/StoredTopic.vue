<template>
  <the-game
    :title="title"
    :words="words"
    :id="topicId"
  />
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import {
  useTopicIndex, findTopicId, saveTopic,
} from '../lib/TopicStore';
import { decodeTopic } from '../lib/TopicEncoding';
import TheGame from '../components/TheGame.vue';

const props = defineProps<{
  id?: string,
  encodedTopic: string
}>();

const storedTopics = useTopicIndex();

const router = useRouter();
const getStartingTitle = () => {
  if (storedTopics && props.id) {
    return storedTopics.find((t) => t.id === props.id)?.title;
  }

  return '';
};
const title = ref(getStartingTitle() || '\xa0');
const words = ref<string[]>([]);
const topicId = ref(props.id);

const notFound = () => {
  router.replace({ name: 'home' });
};

watchEffect(
  async (): Promise<void> => {
    if (!props.encodedTopic) {
      return notFound();
    }

    try {
      const topic = await decodeTopic(props.encodedTopic);
      if (!topic) {
        return notFound();
      }

      title.value = topic.title;
      words.value = topic.words;

      if (!props.id) {
        let theId = await findTopicId(topic);
        if (!theId) {
          theId = await saveTopic(topic);
        }
        topicId.value = theId;
      }
    } catch (e) {
      return notFound();
    }

    return undefined;
  },
);
</script>
