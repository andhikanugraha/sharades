import builtInTopics from './builtInTopics';

export interface Topic {
  title: string;
  words: string[];
}

export async function getBuiltInTopicTitles(): Promise<string[]> {
  const defaultTitles = builtInTopics.map((cat) => cat.title);
  return defaultTitles.sort();
}

export async function getBuiltInTopicByTitle(
  title: string,
): Promise<Topic | null> {
  return builtInTopics.find((v) => v.title === title) || null;
}
