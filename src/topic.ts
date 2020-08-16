export interface Topic {
  title: string;
  words: string[];
}

const separator = "|";

export function canonicaliseTopic(topicObj: Topic): Topic {
  topicObj.title = topicObj.title.trim();
  topicObj.words = topicObj.words
    .map((word) => word.trim())
    .filter((x) => !!x)
    .sort();
  return topicObj;
}

export function topicToString(topicObj: Topic): string {
  const canonicalTopic = canonicaliseTopic(topicObj);
  return (
    canonicalTopic.title + separator + canonicalTopic.words.join(separator)
  );
}

export function stringToTopic(topicString: string): Topic {
  const words = topicString.split(separator);
  const title = words.shift() || "";

  return {
    title,
    words,
  };
}

async function compressTopic(topicObj: Topic): Promise<Uint8Array> {
  const { deflate } = await import("pako");
  const topicString = topicToString(topicObj);
  const compressedTopicString = deflate(topicString);
  return compressedTopicString;
}

async function decompressTopic(
  compressedTopicString: Uint8Array
): Promise<Topic> {
  const { inflate } = await import("pako");
  const decompressedBuffer = inflate(compressedTopicString);
  const decompressedString = new TextDecoder("utf-8").decode(
    decompressedBuffer
  );
  return stringToTopic(decompressedString);
}

function btoaUrl(binaryArray: Uint8Array) {
  const binaryString = String.fromCharCode(...binaryArray);
  return btoa(binaryString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=+$/, "");
}

function atobUrl(asciiString: string) {
  const binaryString = atob(asciiString.replace(/\-/g, "+").replace(/_/g, "/"));
  const buffer = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; ++i) {
    buffer[i] = binaryString.charCodeAt(i);
  }

  return buffer;
}

export async function encodeTopic(topicObj: Topic): Promise<string> {
  return btoaUrl(await compressTopic(topicObj));
}

export async function decodeTopic(encodedTopic: string): Promise<Topic> {
  const base64decoded = atobUrl(encodedTopic);

  return await decompressTopic(base64decoded);
}

async function getStore(): Promise<LocalForage> {
  const localForage = await import("localforage");
  return localForage.createInstance({
    name: "charades",
  });
}

export async function hashEncodedTopic(encodedTopic: string) {
  return encodedTopic.substr(0, 32);
}

export async function listStoredTopics() {
  const store = await getStore();
  const topics: Topic[] = [];
  store.iterate<string, void>(async (value) => {
    try {
      const decodedTopic = await decodeTopic(value);
      topics.push(decodedTopic);
    } finally {
      // empty
    }
  });

  return topics;
}

export async function updateTopic(oldEncodedTopic: string, newTopic: Topic) {
  await removeTopic(oldEncodedTopic);
  return saveTopic(newTopic);
}

export async function removeTopic(encodedTopic) {
  const store = await getStore();
  const hash = await hashEncodedTopic(encodedTopic);
  await store.removeItem(`full:${hash}`);
}

export async function saveTopic(topic: Topic) {
  const encodedTopic = await encodeTopic(topic);
  const hash = await hashEncodedTopic(encodedTopic);
  const store = await getStore();
  await store.setItem(`full:${hash}`, encodedTopic);
}

export async function getDefaultTopicTitles(): Promise<string[]> {
  const defaultTopics: Topic[] = (await import("./builtInTopics")).default;
  const defaultTitles = defaultTopics.map((cat) => cat.title);
  return defaultTitles.sort();
}

export async function getDefaultTopicByTitle(title: string): Promise<Topic> {
  const defaultTopics: Topic[] = (await import("./builtInTopics")).default;
  return defaultTopics.find((v) => v.title === title);
}

export async function getAvailableTopicTitles(): Promise<string[]> {
  const defaultTitles = await getDefaultTopicTitles();
  return defaultTitles.sort();
}

export function compareTopic(cat1: Topic, cat2: Topic): boolean {
  if (cat1.title !== cat2.title) {
    return false;
  }

  if (cat1.words.length !== cat2.words.length) {
    return false;
  }

  for (let i = 0; i < cat1.words.length; ++i) {
    if (cat1.words[i] !== cat2.words[i]) {
      return false;
    }
  }

  return true;
}
