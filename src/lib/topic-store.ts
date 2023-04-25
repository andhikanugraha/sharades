import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import localForage from 'localforage';
import { defineStore } from 'pinia';
import type { Topic } from './topic';

export type TopicIndex = {
  id: string;
  title: string;
}[];
type DeflatedWordsBuffer = Uint8Array;
type LoadedTopic = Topic & {
  id: string | null;
};

const KEY_INDEX = '_index';

const db = localForage.createInstance({
  name: 'charades',
});

function normalizeTopic(topicObj: Topic): Topic {
  return {
    title: topicObj.title.trim(),
    words: topicObj.words
      .map((word) => word.trim())
      .filter((x) => !!x)
      .filter((e, i, a) => a.indexOf(e) === i) // dedupe
      .sort(),
  };
}

function generateTopicId(): string {
  const randomInt = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return randomInt.toString(36);
}

export const useCustomTopicsStore = defineStore('customTopics', () => {
  // State
  const topicIndex = reactive<TopicIndex>([]);
  const loadedTopic = reactive<LoadedTopic>({
    id: null,
    title: '',
    words: [],
  });

  // Utility functions - not exposed.
  function unloadTopic() {
    loadedTopic.id = null;
    loadedTopic.title = '';
    loadedTopic.words = [];
  }

  // Topic index
  const isTopicIndexLoaded = ref(false);
  function replaceTopicIndex(updatedIndex: TopicIndex) {
    topicIndex.splice(0);
    topicIndex.splice(0, 0, ...updatedIndex);
  }

  async function loadTopicIndex(): Promise<TopicIndex> {
    if (isTopicIndexLoaded.value) {
      return topicIndex;
    }

    const loadedIndex = await db.getItem<TopicIndex>(KEY_INDEX);
    if (!loadedIndex) {
      await db.clear();
      return [];
    }

    replaceTopicIndex(loadedIndex);
    isTopicIndexLoaded.value = true;
    return loadedIndex;
  }

  function findTopicInIndex(id: string) {
    return topicIndex.find((t) => t.id === id);
  }

  function cloneTopicIndex() {
    return topicIndex.map((item) => ({
      id: item.id,
      title: item.title,
    }));
  }

  async function persistTopicIndex(): Promise<void> {
    if (topicIndex.length > 0) {
      await db.setItem<TopicIndex>(KEY_INDEX, cloneTopicIndex());
    } else {
      unloadTopic();
      replaceTopicIndex([]);
      await db.clear();
    }
  }

  // Load topic

  async function getDeflatedWordsByTopicId(id: string) {
    return db.getItem<DeflatedWordsBuffer>(id);
  }

  async function loadTopic(id: string): Promise<Topic | null> {
    await loadTopicIndex();

    if (loadedTopic.id === id && loadedTopic.words.length > 0) {
      return loadedTopic;
    }

    const topicInIndex = findTopicInIndex(id);
    if (topicInIndex) {
      loadedTopic.id = id;
      loadedTopic.title = topicInIndex.title;
    } else {
      unloadTopic();
      return null;
    }

    const deflatedWordsBuffer = await getDeflatedWordsByTopicId(id);
    if (!deflatedWordsBuffer) {
      return null;
    }

    try {
      const { inflateTopicWords } = await import('./TopicEncoding');
      loadedTopic.words = await inflateTopicWords(deflatedWordsBuffer);
    } catch {
      unloadTopic();
      return null;
    }

    return loadedTopic;
  }

  async function findTopicId(title: string, deflatedWords: Uint8Array): Promise<string | null> {
    await loadTopicIndex();

    const id = topicIndex.find((t) => t.title === title)?.id;
    if (!id) { // Title does not exist in index
      return null;
    }

    const deflatedWordsInStore = await getDeflatedWordsByTopicId(id);
    if (!deflatedWordsInStore) {
      return null;
    }

    // compare by length
    if (deflatedWords.length !== deflatedWordsInStore.length) {
      return null;
    }

    // compare each byte
    if (!deflatedWords.every((value, index) => value === deflatedWordsInStore[index])) {
      return null;
    }

    return id;
  }

  async function saveTopic(topicObj: Topic, id?: string): Promise<string | null> {
    if (!topicObj.title || topicObj.words.length === 0) {
      throw new Error('Invalid Topic');
    }

    try {
      const { deflateTopicWords } = await import('./TopicEncoding');

      const { title, words } = normalizeTopic(topicObj);
      const deflatedWords = await deflateTopicWords(words);

      let newId = '';
      if (id) {
        // existing topic
        await db.setItem(id, deflatedWords);
        const key = topicIndex.findIndex((t) => t.id === id);
        topicIndex[key].title = title;
      } else {
        // new topic
        newId = generateTopicId();
        await db.setItem(newId, deflatedWords);
        topicIndex.push({
          id: newId,
          title,
        });
      }

      loadedTopic.id = id || newId;
      loadedTopic.title = title;
      loadedTopic.words = words;

      await persistTopicIndex();

      return loadedTopic.id;
    } catch (e) {
      // do nothing
    }

    return null;
  }

  async function deleteTopic(id: string): Promise<void> {
    await db.removeItem(id);
    unloadTopic();

    topicIndex.splice(
      topicIndex.findIndex((t) => t.id === id),
      1,
    );

    await persistTopicIndex();
  }

  // Resolve Topic

  const router = useRouter();
  async function restoreCanonicalLocation(topicObj: Topic) {
    const { encodeTopic } = await import('./TopicEncoding');
    const encodedTopic = await encodeTopic(topicObj);
    const route = router.getRoutes().find((r) => r.name === 'game');
    if (route) {
      const { path } = route;
      window.history.replaceState(window.history.state, '', `#${path.replace(':encodedTopic', encodedTopic)}`);
    }
  }

  async function resolveTopicById(id: string): Promise<Topic | null> {
    const topic = await loadTopic(id);
    if (!topic) {
      return null;
    }

    restoreCanonicalLocation(topic);

    return topic;
  }

  async function resolveTopicByEncodedTopic(encodedTopic: string): Promise<LoadedTopic | null> {
    try {
      const { decodeTopicDeflated, inflateTopicWords } = await import('./TopicEncoding');
      // decode the encodedTopic
      const deflatedTopic = await decodeTopicDeflated(encodedTopic);
      if (!deflatedTopic) {
        // decoding failed, go home.
        return null;
      }

      loadedTopic.title = deflatedTopic.title;
      loadedTopic.words = await inflateTopicWords(deflatedTopic.deflatedWords);

      // check if the topic already exists in the store
      const existingTopicId = await findTopicId(deflatedTopic.title, deflatedTopic.deflatedWords);
      if (existingTopicId) {
        // the topic already exists. use it for editing, etc.
        loadedTopic.id = existingTopicId;
      } else {
        // the topic does not exist in the store. save it.
        loadedTopic.id = await saveTopic(loadedTopic);
      }

      return loadedTopic;
    } catch (e) {
      return null;
    }
  }

  function goToTopicPage(id: string) {
    router.push({
      name: 'game-stored',
      params: { id },
    });
  }

  // init
  loadTopicIndex();

  return {
    topicIndex: computed(() => topicIndex),
    loadedTopic,
    id: computed(() => loadedTopic.id),
    title: computed(() => loadedTopic.title),
    words: computed(() => loadedTopic.words),
    findTopicInIndex,
    loadTopic,
    saveTopic,
    deleteTopic,
    resolveTopicById,
    resolveTopicByEncodedTopic,
    goToTopicPage,
  };
});

// Home: topic index
// Game: resolve
// Edit: load, save, delete
