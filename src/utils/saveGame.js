import * as FileSystem from 'expo-file-system/legacy';

const DOC_DIR       = FileSystem.documentDirectory;
const SAVE_PATH    = `${DOC_DIR}save.json`;
const SAVE_DEV_PATH = `${DOC_DIR}save_dev.json`;
const PREFS_PATH   = `${DOC_DIR}prefs.json`;
const SAVE_VERSION = 1;

export const SAVE_DEFAULTS = {
  version:             SAVE_VERSION,
  gender:              'male',
  jlptLevel:          'Iniciante',
  xp:                  0,
  totalXp:             0,
  rankIndex:           0,
  hp:                  3,
  lastScreen:          null,   // null | 'Prologue' | 'KanaRain' | 'Map'
  kanaPhase:           'lesson_h',
  kanaHGroupIdx:       0,
  kanaKGroupIdx:       0,
  completedLessons:     [],
  battlesWonByRegion:  {},     // { N5: 1, N4: 0, ... }
  knowKanaAsked:       false,  // se já perguntou "sabe hiragana/katakana?" no modo história
  completedEscapeRooms: [],    // ids das câmaras da memória já escapadas (ex.: ['room-n5'])
};

/** Preferências (devMode) — separadas do progresso */
export async function loadPreferences() {
  try {
    const info = await FileSystem.getInfoAsync(PREFS_PATH);
    if (!info.exists) return { devMode: false };
    const json = await FileSystem.readAsStringAsync(PREFS_PATH);
    return { devMode: false, ...JSON.parse(json) };
  } catch {
    return { devMode: false };
  }
}

export async function savePreferences(prefs) {
  try {
    await FileSystem.writeAsStringAsync(PREFS_PATH, JSON.stringify(prefs));
  } catch (e) {
    console.error('Erro ao salvar preferências:', e);
  }
}

function getSavePath(isDev) {
  return isDev ? SAVE_DEV_PATH : SAVE_PATH;
}

/** Carrega o save do modo história (isDev=false) ou modo desenvolvedor (isDev=true) */
export async function loadSave(isDev = false) {
  try {
    const path = getSavePath(isDev);
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return null;
    const json = await FileSystem.readAsStringAsync(path);
    const parsed = JSON.parse(json);
    return { ...SAVE_DEFAULTS, ...parsed };
  } catch {
    return null;
  }
}

/** Salva no arquivo correto conforme o modo (história vs desenvolvedor) */
export async function writeSave(data, isDev = false) {
  try {
    const path = getSavePath(isDev);
    const payload = { ...SAVE_DEFAULTS, ...data, version: SAVE_VERSION };
    await FileSystem.writeAsStringAsync(path, JSON.stringify(payload));
  } catch (e) {
    console.error('Erro ao salvar progresso:', e);
  }
}

/** Deleta o save do modo especificado */
export async function deleteSave(isDev = false) {
  try {
    await FileSystem.deleteAsync(getSavePath(isDev), { idempotent: true });
  } catch {
    // silencioso
  }
}
