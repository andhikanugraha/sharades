import { Topic } from './topic';
import { btoaUrl, atobUrl } from './base64url';

const SEPARATOR = '\x1F';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8');

export async function deflateTopicWords(words: string[]): Promise<Uint8Array> {
  const { deflate } = await import('pako');
  return deflate(textEncoder.encode(words.join(SEPARATOR)));
}

export async function inflateTopicWords(
  wordsBuffer: Uint8Array,
): Promise<string[]> {
  const { inflate } = await import('pako');
  return textDecoder.decode(inflate(wordsBuffer)).split(SEPARATOR);
}

export async function encodeTopic(topicObj: Topic): Promise<string> {
  const titleBinary = textEncoder.encode(topicObj.title);
  const deflatedWordsBinary = await deflateTopicWords(topicObj.words);
  return `${btoaUrl(titleBinary)}.${btoaUrl(deflatedWordsBinary)}`;
}

// For use in Game.vue, receiving path in URL
export async function decodeTopic(topicString: string): Promise<Topic> {
  const [titleB64, deflatedWordsB64] = topicString.split('.');
  return {
    title: textDecoder.decode(atobUrl(titleB64)),
    words: await inflateTopicWords(atobUrl(deflatedWordsB64)),
  };
}
