import {
  defineComponent, watchEffect, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { TopicIndex, loadTopic } from '../lib/TopicStore';
import { encodeTopic } from '../lib/TopicEncoding';

export default defineComponent({
  name: 'Game',
  props: {
    id: String,
    encodedTopic: String,
    builtInTopicTitle: String,
    storedTopics: Array as PropType<TopicIndex>,
  },
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const router = useRouter();

    const notFound = () => {
      router.replace({ name: 'home' });
    };

    watchEffect(
      async (): Promise<void> => {
        if (props.id) {
          const testTopic = await loadTopic(props.id);
          if (testTopic) {
            const encodedTopic = await encodeTopic(testTopic);
            router.replace({
              name: 'game',
              params: { encodedTopic, id: props.id },
            });
          } else {
            return notFound();
          }
        } else {
          return notFound();
        }

        return undefined;
      },
    );

    return () => null;
  },
});
