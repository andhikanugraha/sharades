<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import {
  useTopicIndex, findTopicId, saveTopic, loadTopic,
} from '../lib/TopicStore';
import { decodeTopic } from '../lib/TopicEncoding';
import TheGame from '../components/TheGame.vue';
import { Topic } from '../lib/topic';

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

async function restoreCanonicalUrl(topicObj: Topic) {
  const { encodeTopic } = await import('../lib/TopicEncoding');
  const encodedTopic = await encodeTopic(topicObj);
  const route = router.getRoutes().find((r) => r.name === 'game');
  if (route) {
    const { path } = route;
    window.history.replaceState(window.history.state, '', path.replace(':encodedTopic', encodedTopic));
  }
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

      if (topicInIndex) {
        title.value = topicInIndex.title;
        const topic = await loadTopic(props.id);
        if (topic) {
          title.value = topic?.title;
          words.value = topic?.words;

          restoreCanonicalUrl(topic);
        } else {
          return notFound();
        }
      } else {
        return notFound();
      }
    } else if (props.encodedTopic) {
      // props.id is null.
      // in reality, the topic may already be in the store.
      try {
        // decode the encodedTopic
        const topic = await decodeTopic(props.encodedTopic);
        if (!topic) {
          // decoding failed, go home.
          return notFound();
        }

        // check if the topic already exists in the store
        const existingTopicId = await findTopicId(topic);
        if (existingTopicId) {
          // the topic already exists. use it for editing, etc.
          topicId.value = existingTopicId;
        }
        if (!existingTopicId) {
          // the topic does not exist in the store. save it.
          topicId.value = await saveTopic(topic);
        }

        // load the topic into the refs
        title.value = topic.title;
        words.value = topic.words;
      } catch (e) {
        return notFound();
      }
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
