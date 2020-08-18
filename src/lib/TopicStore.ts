import { Topic } from "../topic";
import { btoaUrl } from "./base64url";

const KEY_INDEX = "_index";

async function getStore(): Promise<LocalForage> {
  const localForage = await import("localforage");
  return localForage.createInstance({
    name: "charades",
  });
}

export type TopicIndex = {
  id: string;
  title: string;
}[];

type DeflatedWordsBuffer = Uint8Array;

export async function loadTopicIndex(): Promise<TopicIndex> {
  const store = await getStore();
  const index = await store.getItem<TopicIndex>(KEY_INDEX);
  if (!index) {
    return [];
  }

  return index;
}

export async function saveTopicIndex(newTopicIndex: TopicIndex) {
  const store = await getStore();
  if (newTopicIndex.length > 0) {
    return store.setItem<TopicIndex>(KEY_INDEX, newTopicIndex);
  } else {
    return store.clear();
  }
}

export async function loadTopic(id: string): Promise<Topic | null> {
  const { inflateTopicWords } = await import("./TopicEncoding");
  let title: string = "";
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
    words = await inflateTopicWords(deflatedWordsBuffer);
  } catch {
    return null;
  }

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
  topicObj.title = topicObj.title.trim();
  topicObj.words = topicObj.words
    .map((word) => word.trim())
    .filter((x) => !!x)
    .filter((e, i, a) => a.indexOf(e) === i) // dedupe
    .sort();
  return topicObj;
}

export async function saveTopic(topicObj: Topic, id?: string): Promise<string> {
  const { deflateTopicWords } = await import("./TopicEncoding");

  const store = await getStore();
  const { title, words } = sanitiseTopic(topicObj);
  const wordsBuffer = await deflateTopicWords(words);
  const topicIndex = await loadTopicIndex();

  if (id) {
    await store.setItem(id, wordsBuffer);
    const key = topicIndex.findIndex((t) => t.id === id);
    topicIndex[key].title = title;
    saveTopicIndex(topicIndex);
    return id;
  } else {
    const newId = generateRandomId();
    await store.setItem(newId, wordsBuffer);
    topicIndex.push({
      id: newId,
      title: title,
    });
    saveTopicIndex(topicIndex);

    return newId;
  }
}

export async function deleteTopic(id: string): Promise<void> {
  const store = await getStore();
  await store.removeItem(id);

  const topicIndex = await loadTopicIndex();
  topicIndex.splice(
    topicIndex.findIndex((t) => t.id === id),
    1
  );
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
  for (let i = 0; i < words.length; ++i) {
    if (topicInStore.words[i] !== words[i]) {
      return null;
    }
  }

  return id;
}
