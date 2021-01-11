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
import { requestFullscreen } from '../lib/fullscreen';
import { Topic } from '../lib/topic';
import { saveTopic, goToTopicPage, clearCache } from '../lib/TopicStore';
import TheEditor from '../components/TheEditor.vue';

export default defineComponent({
  name: 'NewTopic',
  components: { TheEditor },
  setup() {
    const router = useRouter();

    const title = ref('');
    const words = reactive<string[]>([]);

    const handleSave = async (updatedTopic: Topic) => {
      const id = await saveTopic(updatedTopic);
      console.log(id);

      if (id) {
        goToTopicPage(router, id);
        await requestFullscreen(false);
      }
    };

    const handleCancel = async () => {
      clearCache();
      router.push({ name: 'home' });
      await requestFullscreen();
    };

    return {
      title,
      words,
      handleSave,
      handleCancel,
    };
  },
});
</script>
