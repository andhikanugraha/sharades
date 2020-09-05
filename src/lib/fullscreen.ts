import { reactive } from 'vue';

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

function setPreference(pref: Pref) {
  state.preference = pref;
  if (pref === Pref.FULLSCREEN) {
    localStorage.removeItem(KEY_PREF);
  } else {
    localStorage.setItem(KEY_PREF, 'true');
  }
}

export async function requestFullscreen(updatePreference = true): Promise<void> {
  const el = document.getElementById('app');
  if (updatePreference) {
    setPreference(Pref.FULLSCREEN);
  } else if (state.preference === Pref.NOT_FULLSCREEN) {
    return;
  }

  if (el) el.requestFullscreen({ navigationUI: 'hide' });
}

export async function exitFullscreen(updatePreference = true): Promise<void> {
  if (updatePreference) {
    setPreference(Pref.NOT_FULLSCREEN);
  }

  if (document.fullscreenElement && state.preference === Pref.NOT_FULLSCREEN) {
    document.exitFullscreen();
  }
}
