import { reactive } from 'vue';

export interface Topic {
  title: string;
  words: string[];
}

const topicTitles = reactive<string[]>([]);

async function fetchMultilineTextFile(basename: string): Promise<string[] | null> {
  try {
    const fetched = await fetch(`/topics/${basename}.txt`);
    const text = await fetched.text();
    const split = text.split('\n');
    return split;
  } catch {
    return null;
  }
}

async function loadBuiltInTopicTitles() {
  topicTitles.length = 0;
  topicTitles.push(...(await fetchMultilineTextFile('_')) || []);
}

export function useBuiltInTopicTitles(): string[] {
  if (topicTitles.length === 0) loadBuiltInTopicTitles();
  return topicTitles;
}

export async function getBuiltInTopicByTitle(
  title: string,
): Promise<Topic | null> {
  const words = await fetchMultilineTextFile(title);
  if (words)
    return { title, words }

  return null;
}
