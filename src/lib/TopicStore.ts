import { ref, reactive } from 'vue';
import type { Router } from 'vue-router';
import localForage from 'localforage';
import { Topic } from './topic';

const KEY_INDEX = '_index';

async function getStore(): Promise<LocalForage> {
  return localForage.createInstance({
    name: 'charades',
  });
}

export type TopicIndex = {
  id: string;
  title: string;
}[];

type DeflatedWordsBuffer = Uint8Array;

const isInitiallyLoaded = ref(false);
const topicIndexState = reactive<TopicIndex>([]);

type LoadedTopic = {
  id: string;
  topic: Topic;
}
const loadedTopicCache = reactive<LoadedTopic>({
  id: '',
  topic: {
    title: '',
    words: [],
  },
});

function replaceTopicIndex(updatedIndex: TopicIndex) {
  topicIndexState.splice(0);
  topicIndexState.splice(0, 0, ...updatedIndex);
}

export async function loadTopicIndex(): Promise<TopicIndex> {
  const store = await getStore();
  const loadedIndex = await store.getItem<TopicIndex>(KEY_INDEX);
  if (!loadedIndex) {
    await store.clear();
    return [];
  }

  replaceTopicIndex(loadedIndex);
  return loadedIndex;
}

export function useTopicIndex(): TopicIndex {
  if (!isInitiallyLoaded.value) {
    loadTopicIndex().then(() => {
      isInitiallyLoaded.value = true;
    });
  }
  return topicIndexState;
}

export async function saveTopicIndex(updatedIndex: TopicIndex): Promise<void> {
  const store = await getStore();
  if (updatedIndex.length > 0) {
    await store.setItem<TopicIndex>(KEY_INDEX, updatedIndex);
    replaceTopicIndex(updatedIndex);
  } else {
    loadedTopicCache.id = '';
    store.clear();
  }
}

export async function loadTopic(id: string): Promise<Topic | null> {
  if (loadedTopicCache.id === id && loadedTopicCache.topic) {
    return loadedTopicCache.topic;
  }

  let title = '';
  let words: string[] = [];
  const topicIndex = await loadTopicIndex();

  const testTopic = topicIndex.find((t) => t.id === id);
  if (testTopic) {
    title = testTopic.title;
  } else {
    return null;
  }

  const store = await getStore();
  const deflatedWordsBuffer = await store.getItem<DeflatedWordsBuffer>(id);
  if (!deflatedWordsBuffer) {
    return null;
  }

  try {
    const { inflateTopicWords } = await import('./TopicEncoding');
    words = await inflateTopicWords(deflatedWordsBuffer);
  } catch {
    return null;
  }

  loadedTopicCache.id = id;
  loadedTopicCache.topic = { title, words };

  return {
    title,
    words,
  };
}

function generateRandomId(): string {
  const randomInt = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return randomInt.toString();
}

function sanitiseTopic(topicObj: Topic): Topic {
  const sanitisedTopic = topicObj;
  sanitisedTopic.title = topicObj.title.trim();
  sanitisedTopic.words = topicObj.words
    .map((word) => word.trim())
    .filter((x) => !!x)
    .filter((e, i, a) => a.indexOf(e) === i) // dedupe
    .sort();
  return sanitisedTopic;
}

export async function saveTopic(topicObj: Topic, id?: string): Promise<string> {
  const { deflateTopicWords } = await import('./TopicEncoding');

  const store = await getStore();
  const { title, words } = sanitiseTopic(topicObj);
  const wordsBuffer = await deflateTopicWords(words);
  const topicIndex = await loadTopicIndex();

  let newId = '';
  if (id) {
    // existing topic
    await store.setItem(id, wordsBuffer);
    const key = topicIndex.findIndex((t) => t.id === id);
    topicIndex[key].title = title;
  } else {
    // new topic
    newId = generateRandomId();
    await store.setItem(newId, wordsBuffer);
    topicIndex.push({
      id: newId,
      title,
    });
  }

  loadedTopicCache.id = id || newId;
  loadedTopicCache.topic = { title, words };
  saveTopicIndex(topicIndex);
  return id || newId;
}

export async function deleteTopic(id: string): Promise<void> {
  const store = await getStore();
  await store.removeItem(id);

  const topicIndex = await loadTopicIndex();
  topicIndex.splice(
    topicIndex.findIndex((t) => t.id === id),
    1,
  );

  loadedTopicCache.id = '';
  saveTopicIndex(topicIndex);
}

export async function findTopicId(topic: Topic): Promise<string | null> {
  const topicIndex = await loadTopicIndex();
  // find by title
  const { title, words } = topic;
  const id = topicIndex.find((t) => t.title === title)?.id;
  if (!id) return null;

  const topicInStore = await loadTopic(id);
  if (!topicInStore) return null;

  if (topicInStore.words.length !== words.length) {
    return null;
  }
  for (let i = 0; i < words.length; i += 1) {
    if (topicInStore.words[i] !== words[i]) {
      return null;
    }
  }

  return id;
}

export async function goToTopicPage(router: Router, id: string): Promise<void> {
  const topic = await loadTopic(id);
  if (!topic) {
    router.push({ name: 'home' });
    return;
  }

  const { encodeTopic } = await import('./TopicEncoding');
  const encodedTopic = await encodeTopic(topic);
  router.push({
    name: 'game',
    params: { encodedTopic, id },
  });
}
