import { reactive } from 'vue';
import builtInTopicList from './builtInTopics';

export interface Topic {
  title: string;
  words: string[];
}

const topicTitles = reactive<string[]>([]);

async function loadBuiltInTopicTitles() {
  topicTitles.splice(0);
  topicTitles.splice(0, 0, ...builtInTopicList.map((cat) => cat.title).sort());
}

export function useBuiltInTopicTitles(): string[] {
  if (topicTitles.length === 0) loadBuiltInTopicTitles();
  return topicTitles;
}

export async function getBuiltInTopicByTitle(
  title: string,
): Promise<Topic | null> {
  return builtInTopicList.find((v) => v.title === title) || null;
}
