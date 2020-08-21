import { reactive } from 'vue';
import { initial } from 'lodash-es';

// default behaviour for new users: go full screen
// if user explicitly exits full screen, then keep the preference using localStorage

const KEY_PREF = 'prefer-not-fullscreen';

enum Pref {
  FULLSCREEN,
  NOT_FULLSCREEN,
}

interface FullscreenState {
  preference: Pref;
}

const state = reactive<FullscreenState>({
  preference: localStorage.getItem(KEY_PREF)
    ? Pref.NOT_FULLSCREEN
    : Pref.FULLSCREEN,
});

async function requestFullscreen(updatePreference = true): Promise<void> {
  const el = document.getElementById('app');
  if (updatePreference) {
    state.preference = Pref.FULLSCREEN;
    localStorage.removeItem(KEY_PREF);
  } else if (state.preference === Pref.NOT_FULLSCREEN) {
    return;
  }

  if (el) el.requestFullscreen({ navigationUI: 'hide' });
}

async function exitFullscreen(): Promise<void> {
  localStorage.setItem(KEY_PREF, 'true');
  state.preference = Pref.NOT_FULLSCREEN;
  if (document.fullscreenElement) document.exitFullscreen();
}

export {
  requestFullscreen,
  exitFullscreen,
};
