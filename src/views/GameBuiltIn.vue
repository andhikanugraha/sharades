<template>
  <the-game
    :title="title"
    :words="words"
    :is-editable="false"
    @go-home="goHome"
  />
</template>

<script lang="ts">
import {
  defineComponent, ref, watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import { getBuiltInTopicByTitle } from '../lib/topic';
import TheGame from '../components/TheGame.vue';

export default defineComponent({
  name: 'Game',
  components: { TheGame },
  props: {
    builtInTopicTitle: String,
  },
  setup(props) {
    const router = useRouter();
    const title = ref(props.builtInTopicTitle || '\xa0');
    const words = ref<string[]>([]);

    const goHome = () => {
      router.push({
        name: 'home',
      });
    };

    const notFound = () => {
      router.replace({ name: 'home' });
    };

    watchEffect(
      async (): Promise<void> => {
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
      },
    );

    return {
      title,
      words,
      goHome,
    };
  },
});
</script>
