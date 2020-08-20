<template>
  <the-game
    :title="title"
    :words="words"
    :is-editable="isEditable"
    @edit-topic="goEdit"
    @go-home="goHome"
  />
</template>

<script lang="ts">
import {
  defineComponent, ref, watchEffect,
} from 'vue';
import { Topic, getDefaultTopicByTitle } from '../lib/topic';
import {
  TopicIndex,
  loadTopic,
  findTopicId,
  saveTopic,
} from '../lib/TopicStore';
import { encodeTopic, decodeTopic } from '../lib/TopicEncoding';
import TheGame from '../components/TheGame.vue';
import router from '../router';

export default defineComponent({
  name: 'Game',
  components: { TheGame },
  props: {
    id: String,
    encodedTopic: String,
    builtInTopicTitle: String,
    storedTopics: Array as { new (): TopicIndex },
  },
  setup(props, { emit }) {
    const getStartingTitle = () => {
      if (props.storedTopics && props.id) {
        return props.storedTopics.find((t) => t.id === props.id)?.title;
      }

      if (props.builtInTopicTitle) {
        return props.builtInTopicTitle;
      }

      return '';
    };
    const title = ref(getStartingTitle() || '\xa0');
    const words = ref<string[]>([]);
    const isEditable = ref(false);
    const topicId = ref(props.id);

    const goHome = () => {
      router.push({
        name: 'home',
      });
    };

    const goEdit = () => {
      router.push({
        name: 'edit',
        params: { id: topicId.value || '' },
      });
    };

    const notFound = () => {
      router.replace({ name: 'home' });
    };

    watchEffect(
      async (): Promise<void> => {
        const topic: Topic = {
          title: '',
          words: [],
        };

        try {
          if (props.builtInTopicTitle) {
            const testTopic = await getDefaultTopicByTitle(
              props.builtInTopicTitle,
            );
            if (!testTopic) return notFound();

            Object.assign(topic, testTopic);
          } else if (props.id) {
            const testTopic = await loadTopic(props.id);
            if (!testTopic) return notFound();
            isEditable.value = true;
            Object.assign(topic, testTopic);

            if (!props.encodedTopic) {
              const encodedTopic = await encodeTopic(topic);
              router.replace({
                name: 'game',
                params: { encodedTopic, id: props.id },
              });
            }
          } else if (props.encodedTopic) {
            const testTopic = await decodeTopic(props.encodedTopic);
            if (!testTopic) return notFound();
            isEditable.value = true;
            Object.assign(topic, testTopic);

            let theId = await findTopicId(topic);
            if (!theId) {
              theId = await saveTopic(topic);
              emit('load-stored-topics');
            }
            topicId.value = theId;
          }
          title.value = topic.title;
          words.value = topic.words;
        } catch (e) {
          router.replace({ name: 'home' });
        }

        return undefined;
      },
    );

    return {
      title,
      words,
      isEditable,
      goHome,
      goEdit,
    };
  },
});
</script>
