/**
 * Adapter de banco para WEB — usa dados de kanjiByLevel em vez de SQLite.
 * Evita expo-sqlite que não funciona bem em build web estático.
 */
import { KANJI_N5, KANJI_N4, KANJI_N3, KANJI_N2, KANJI_N1 } from '../data/kanjiByLevel';

const ALL_KANJI = [
  ...KANJI_N5.map(k => ({ ...k, character: k.kanji, level: 'N5' })),
  ...KANJI_N4.map(k => ({ ...k, character: k.kanji, level: 'N4' })),
  ...KANJI_N3.map(k => ({ ...k, character: k.kanji, level: 'N3' })),
  ...KANJI_N2.map(k => ({ ...k, character: k.kanji, level: 'N2' })),
  ...KANJI_N1.map(k => ({ ...k, character: k.kanji, level: 'N1' })),
];

const hasReading = (k) =>
  (k.onyomi && k.onyomi.trim()) || (k.kunyomi && k.kunyomi && k.kunyomi.trim());

const filtered = ALL_KANJI.filter(hasReading);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseQuery(query, params = []) {
  const levelMatch = query.match(/level = \?/);
  const charMatch = query.match(/character != \?/);
  const limitMatch = query.match(/LIMIT (\d+)/);
  const limit = limitMatch ? parseInt(limitMatch[1], 10) : 1;

  let subset = filtered;

  if (charMatch && params.length > 0) {
    const excludeChar = params[0];
    subset = subset.filter(k => k.character !== excludeChar);
  }

  const levelParams = charMatch ? params.slice(1) : params;
  if (levelMatch && levelParams.length > 0) {
    subset = subset.filter(k => k.level === levelParams[0]);
  } else if (query.includes('level IN') && levelParams.length > 0) {
    subset = subset.filter(k => levelParams.includes(k.level));
  }

  return { subset, limit };
}

const db = {
  getFirstSync(query, params = []) {
    const { subset, limit } = parseQuery(query, params);
    const shuffled = shuffle(subset);
    return shuffled[0] || null;
  },
  getAllSync(query, params = []) {
    const { subset, limit } = parseQuery(query, params);
    const shuffled = shuffle(subset);
    return shuffled.slice(0, limit);
  },
};

export function getDB() {
  return db;
}
