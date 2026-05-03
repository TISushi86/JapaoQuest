/**
 * Traduz vocabByLevel.js e kanjiByLevel.js para português do Brasil.
 * Usa dicionário estático primeiro, depois API para o restante.
 * Execute: node scripts/translate-to-pt.js
 */
const fs = require('fs');
const path = require('path');

const DICT = require('./en-pt-dictionary.js');
const CACHE_PATH = path.join(__dirname, 'translation-cache.json');
const DELAY_MS = 600;

let cache = {};
if (fs.existsSync(CACHE_PATH)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    console.log(`Cache: ${Object.keys(cache).length} traduções`);
  } catch (e) {
    cache = {};
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function translateWithDict(text) {
  if (!text || typeof text !== 'string') return text;
  const key = text.trim();
  if (DICT[key]) return DICT[key];
  if (cache[key]) return cache[key];
  return null;
}

async function translateWithAPI(text) {
  if (!text || typeof text !== 'string') return text;
  const key = text.trim();
  if (cache[key]) return cache[key];
  try {
    const { translate } = require('@vitalets/google-translate-api');
    const { text: translated } = await translate(text, { from: 'en', to: 'pt' });
    cache[key] = translated;
    await sleep(DELAY_MS);
    return translated;
  } catch (err) {
    console.warn(`  Erro: "${text.slice(0, 40)}..." - ${err.message}`);
    return text;
  }
}

async function translateToPt(text) {
  const dictResult = translateWithDict(text);
  if (dictResult) return dictResult;
  return translateWithAPI(text);
}

function saveCache() {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), 'utf8');
}

async function translateVocab() {
  const vocabPath = path.join(__dirname, '..', 'src', 'data', 'vocabByLevel.js');
  let content = fs.readFileSync(vocabPath, 'utf8');
  const translationMap = {};
  const meaningRegex = /meaning: '((?:[^'\\]|\\.)*)'/g;
  let match;
  const rawToClean = {};
  while ((match = meaningRegex.exec(content)) !== null) {
    const raw = match[1];
    const en = raw.replace(/\\'/g, "'");
    rawToClean[raw] = en;
    if (!translationMap[en]) {
      translationMap[en] = await translateToPt(en);
    }
  }
  const uniqueCount = Object.keys(translationMap).length;
  console.log(`\nVocabulário: ${uniqueCount} significados únicos`);
  let done = 0;
  for (const [raw, en] of Object.entries(rawToClean)) {
    const pt = translationMap[en];
    const ptEscaped = pt.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const rawEscaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(new RegExp(`(meaning: ')${rawEscaped}(')`, 'g'), `$1${ptEscaped}$2`);
    done++;
    if (done % 200 === 0) console.log(`  ${done}/${uniqueCount}`);
  }
  saveCache();
  fs.writeFileSync(vocabPath, content, 'utf8');
  console.log(`✓ vocabByLevel.js`);
}

async function translateKanji() {
  const kanjiPath = path.join(__dirname, '..', 'src', 'data', 'kanjiByLevel.js');
  let content = fs.readFileSync(kanjiPath, 'utf8');
  const translationMap = {};
  const meaningRegex = /meaning: '([^']+)'/g;
  let match;
  while ((match = meaningRegex.exec(content)) !== null) {
    const en = match[1];
    if (!translationMap[en]) {
      translationMap[en] = await translateToPt(en);
    }
  }
  const uniqueCount = Object.keys(translationMap).length;
  console.log(`\nKanji: ${uniqueCount} significados únicos`);
  let done = 0;
  for (const [en, pt] of Object.entries(translationMap)) {
    const enEscaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const ptEscaped = pt.replace(/'/g, "\\'");
    content = content.replace(new RegExp(`(meaning: ')${enEscaped}(')`, 'g'), `$1${ptEscaped}$2`);
    done++;
    if (done % 100 === 0) console.log(`  ${done}/${uniqueCount}`);
  }
  saveCache();
  fs.writeFileSync(kanjiPath, content, 'utf8');
  console.log(`✓ kanjiByLevel.js`);
}

async function main() {
  console.log('Traduzindo para português do Brasil...');
  console.log(`Dicionário: ${Object.keys(DICT).length} entradas`);
  try {
    await translateVocab();
    await translateKanji();
    saveCache();
    console.log('\n✓ Concluído!');
  } catch (err) {
    console.error(err);
    saveCache();
    process.exit(1);
  }
}

main();
