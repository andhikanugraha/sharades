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
  defineComponent, ref, watchEffect, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import {
  TopicIndex, findTopicId, saveTopic,
} from '../lib/TopicStore';
import { decodeTopic } from '../lib/TopicEncoding';
import TheGame from '../components/TheGame.vue';

export default defineComponent({
  name: 'Game',
  components: { TheGame },
  props: {
    id: String,
    encodedTopic: String,
    storedTopics: Array as PropType<TopicIndex>,
  },
  setup(props, { emit }) {
    const router = useRouter();
    const getStartingTitle = () => {
      if (props.storedTopics && props.id) {
        return props.storedTopics.find((t) => t.id === props.id)?.title;
      }

      return '';
    };
    const title = ref(getStartingTitle() || '\xa0');
    const words = ref<string[]>([]);
    const isEditable = ref(true);
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
              emit('load-stored-topics');
            }
            topicId.value = theId;
          }
        } catch (e) {
          return notFound();
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
