import { reactive } from 'vue';

// default behaviour for new users: go full screen
// if user explicitly exits full screen, then keep the preference using localStorage

const KEY_PREF = 'prefer-not-fullscreen';

interface FullscreenState {
  preference: boolean;
}

const state = reactive<FullscreenState>({
  preference: !localStorage.getItem(KEY_PREF),
});

async function requestFullscreen(updatePreference = true): Promise<void> {
  if (updatePreference) {
    state.preference = false;
    localStorage.removeItem(KEY_PREF);
  }

  return document.getElementById('app')?.requestFullscreen({ navigationUI: 'hide' });
}

async function exitFullscreen(): Promise<void> {
  localStorage.setItem(KEY_PREF, 'true');
  state.preference = false;
  if (document.fullscreenElement) document.exitFullscreen();
}

export {
  requestFullscreen,
  exitFullscreen,
};
