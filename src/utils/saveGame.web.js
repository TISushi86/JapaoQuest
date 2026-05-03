/**
 * saveGame para WEB — usa localStorage em vez de expo-file-system.
 */
const SAVE_KEY = 'japaoquest_save';
const SAVE_DEV_KEY = 'japaoquest_save_dev';
const PREFS_KEY = 'japaoquest_prefs';
const SAVE_VERSION = 1;

export const SAVE_DEFAULTS = {
  version: SAVE_VERSION,
  gender: 'male',
  jlptLevel: 'Iniciante',
  xp: 0,
  totalXp: 0,
  rankIndex: 0,
  hp: 3,
  lastScreen: null,
  kanaPhase: 'lesson_h',
  kanaHGroupIdx: 0,
  kanaKGroupIdx: 0,
  completedLessons: [],
  battlesWonByRegion: {},
  knowKanaAsked: false,
  completedEscapeRooms: [],
};

export async function loadPreferences() {
  try {
    const json = localStorage.getItem(PREFS_KEY);
    if (!json) return { devMode: false };
    return { devMode: false, ...JSON.parse(json) };
  } catch {
    return { devMode: false };
  }
}

export async function savePreferences(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Erro ao salvar preferências:', e);
  }
}

function getSaveKey(isDev) {
  return isDev ? SAVE_DEV_KEY : SAVE_KEY;
}

export async function loadSave(isDev = false) {
  try {
    const key = getSaveKey(isDev);
    const json = localStorage.getItem(key);
    if (!json) return null;
    const parsed = JSON.parse(json);
    return { ...SAVE_DEFAULTS, ...parsed };
  } catch {
    return null;
  }
}

export async function writeSave(data, isDev = false) {
  try {
    const key = getSaveKey(isDev);
    const payload = { ...SAVE_DEFAULTS, ...data, version: SAVE_VERSION };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    console.error('Erro ao salvar progresso:', e);
  }
}

export async function deleteSave(isDev = false) {
  try {
    localStorage.removeItem(getSaveKey(isDev));
  } catch {
    // silencioso
  }
}
