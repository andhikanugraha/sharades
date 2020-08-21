<template>
  <the-editor
    :title="title"
    :words="words"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
} from 'vue';
import { useRouter } from 'vue-router';
import { Topic } from '../lib/topic';
import { saveTopic, goToTopicPage } from '../lib/TopicStore';
import TheEditor from '../components/TheEditor.vue';

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default defineComponent({
  name: 'NewTopic',
  components: { TheEditor },
  setup() {
    const router = useRouter();

    const title = ref('');
    const words = reactive<string[]>([]);

    const handleSave = async (updatedTopic: Topic) => {
      const id = await saveTopic(updatedTopic);

      if (id) {
        goToTopicPage(router, id);
      }
    };

    const handleCancel = () => router.push({ name: 'home' });

    return {
      title,
      words,
      handleSave,
      handleCancel,
    };
  },
});
</script>
