export interface Topic {
  title: string;
  words: string[];
}

export async function getDefaultTopicTitles(): Promise<string[]> {
  const defaultTopics: Topic[] = (await import("./builtInTopics")).default;
  const defaultTitles = defaultTopics.map((cat) => cat.title);
  return defaultTitles.sort();
}

export async function getDefaultTopicByTitle(
  title: string
): Promise<Topic | null> {
  const defaultTopics: Topic[] = (await import("./builtInTopics")).default;
  return defaultTopics.find((v) => v.title === title) || null;
}

export async function getBuiltInTopicTitles(): Promise<string[]> {
  const defaultTitles = await getDefaultTopicTitles();
  return defaultTitles.sort();
}
