import type { Ref } from 'vue';
import { exitFullscreen } from './fullscreen';

export const canShare = !!navigator.share;

export function useShare(viewTitle: Ref<string | undefined>): () => Promise<void> {
  return async (): Promise<void> => {
    try {
      await exitFullscreen(false);
      await navigator.share({
        title: `Sharades: ${viewTitle.value}`,
        text: `Play the topic ${viewTitle.value} on Sharades`,
        url: window.location.toString(),
      });
    } finally {
      // nvm
    }
  };
}
