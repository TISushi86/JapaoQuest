/**
 * Gera vocabByLevel.js a partir das listas JLPT (open-anki-jlpt-decks).
 * Baixa CSVs do GitHub, filtra palavras com kanji e traduz para português.
 * Execute: node scripts/generate-vocab-data.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const DICT = require('./en-pt-dictionary.js');

function translateToPt(en) {
  if (!en || typeof en !== 'string') return en;
  const key = en.trim();
  if (DICT[key]) return DICT[key];
  const lower = key.toLowerCase();
  if (DICT[lower]) return DICT[lower];
  const parts = key.split(/[;,]|\([^)]*\)/).map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    const translated = parts.map((p) => DICT[p] || DICT[p.toLowerCase()] || p).join('; ');
    if (translated !== key) return translated;
  }
  if (key.startsWith('to ')) {
    const verb = key.slice(3).replace(/\([^)]*\)/g, '').trim();
    const t = DICT[verb] || DICT[verb.toLowerCase()];
    if (t) return t;
  }
  if (key === 'house, home') return 'casa';
  return en;
}

const BASE_URL = 'https://raw.githubusercontent.com/jamsinclair/open-anki-jlpt-decks/main/src';
const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

// Kanji Unicode range
const KANJI_REGEX = /[\u4e00-\u9faf\u3400-\u4dbf]/;

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseCSV(text) {
  const lines = text.split('\n').filter(Boolean);
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const c = line[j];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if ((c === ',' && !inQuotes) || c === '\n') {
        result.push(current.trim());
        current = '';
      } else {
        current += c;
      }
    }
    result.push(current.trim());
    if (result.length >= 3 && result[0] !== 'expression') {
      rows.push({
        expression: result[0],
        reading: result[1] || '',
        meaning: (result[2] || '').replace(/^"|"$/g, '').trim(),
      });
    }
  }
  return rows;
}

function parseCSVSimple(text) {
  const lines = text.split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^([^,]+),([^,]*),"([^"]*)"|^([^,]+),([^,]*),([^,]+)/);
    if (!match) continue;
    let expression, reading, meaning;
    if (match[3] !== undefined) {
      expression = match[1].trim();
      reading = match[2].trim();
      meaning = match[3].trim();
    } else {
      expression = (match[4] || match[1]).trim();
      reading = (match[5] || match[2]).trim();
      meaning = (match[6] || match[3] || '').trim();
    }
    if (expression && expression !== 'expression') {
      rows.push({ expression, reading, meaning });
    }
  }
  return rows;
}

function parseCSVRegex(text) {
  const lines = text.split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = [];
    let pos = 0;
    while (pos < line.length) {
      if (line[pos] === '"') {
        let end = pos + 1;
        while (end < line.length && (line[end] !== '"' || line[end - 1] === '\\')) end++;
        parts.push(line.slice(pos + 1, end).replace(/""/g, '"'));
        pos = end + 1;
        if (line[pos] === ',') pos++;
      } else {
        const comma = line.indexOf(',', pos);
        if (comma === -1) {
          parts.push(line.slice(pos));
          break;
        }
        parts.push(line.slice(pos, comma));
        pos = comma + 1;
      }
    }
    if (parts.length >= 3 && parts[0] !== 'expression') {
      rows.push({
        expression: parts[0].trim(),
        reading: (parts[1] || '').trim(),
        meaning: (parts[2] || '').trim(),
      });
    }
  }
  return rows;
}

function hasKanji(str) {
  return KANJI_REGEX.test(str);
}

function escapeJs(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');
}

async function main() {
  console.log('Baixando vocabulário JLPT...');
  const vocabByLevel = { N5: [], N4: [], N3: [], N2: [], N1: [] };

  for (const level of LEVELS) {
    const levelKey = level.toUpperCase();
    const url = `${BASE_URL}/${level}.csv`;
    try {
      const text = await fetchUrl(url);
      const rows = parseCSVRegex(text);
      const filtered = rows.filter((r) => {
        const expr = (r.expression || '').split(';')[0].trim();
        return expr && hasKanji(expr) && r.meaning;
      });
      const seen = new Set();
      for (const r of filtered) {
        const expr = (r.expression || '').split(';')[0].trim();
        const reading = (r.reading || '').split(';')[0].trim();
        const key = `${expr}|${reading}`;
        if (seen.has(key)) continue;
        seen.add(key);
        vocabByLevel[levelKey].push({
          word: expr,
          reading,
          meaning: translateToPt(r.meaning),
        });
      }
      console.log(`  ${levelKey}: ${vocabByLevel[levelKey].length} palavras`);
    } catch (err) {
      console.error(`  Erro ao baixar ${level}:`, err.message);
    }
  }

  const out = `/**
 * Vocabulário JLPT (palavras compostas com kanji) — gerado por scripts/generate-vocab-data.js
 * Fonte: open-anki-jlpt-decks (GitHub)
 * Formato: { word, reading, meaning }
 * Execute "npm run generate:vocab" para atualizar.
 */

// ─── N5 — Vocabulário essencial (~800 palavras) ─────────────────────────────
export const VOCAB_N5 = [
${vocabByLevel.N5.map((v) => `  { word: '${escapeJs(v.word)}', reading: '${escapeJs(v.reading)}', meaning: '${escapeJs(v.meaning)}' }`).join(',\n')}
];

// ─── N4 — Vocabulário básico (~700 palavras) ─────────────────────────────────
export const VOCAB_N4 = [
${vocabByLevel.N4.map((v) => `  { word: '${escapeJs(v.word)}', reading: '${escapeJs(v.reading)}', meaning: '${escapeJs(v.meaning)}' }`).join(',\n')}
];

// ─── N3 — Vocabulário intermediário (~1500 palavras) ─────────────────────────
export const VOCAB_N3 = [
${vocabByLevel.N3.map((v) => `  { word: '${escapeJs(v.word)}', reading: '${escapeJs(v.reading)}', meaning: '${escapeJs(v.meaning)}' }`).join(',\n')}
];

// ─── N2 — Vocabulário avançado (~3000 palavras) ──────────────────────────────
export const VOCAB_N2 = [
${vocabByLevel.N2.map((v) => `  { word: '${escapeJs(v.word)}', reading: '${escapeJs(v.reading)}', meaning: '${escapeJs(v.meaning)}' }`).join(',\n')}
];

// ─── N1 — Vocabulário proficiente (~4000 palavras) ───────────────────────────
export const VOCAB_N1 = [
${vocabByLevel.N1.map((v) => `  { word: '${escapeJs(v.word)}', reading: '${escapeJs(v.reading)}', meaning: '${escapeJs(v.meaning)}' }`).join(',\n')}
];

/** Agrupa vocabulário em lotes para lições */
export function chunkVocab(vocabList, size = 20) {
  const chunks = [];
  for (let i = 0; i < vocabList.length; i += size) {
    chunks.push(vocabList.slice(i, i + size));
  }
  return chunks;
}
`;

  const outPath = path.join(__dirname, '..', 'src', 'data', 'vocabByLevel.js');
  fs.writeFileSync(outPath, out, 'utf8');

  const total = Object.values(vocabByLevel).reduce((s, arr) => s + arr.length, 0);
  console.log(`\n✓ Gerado ${outPath}`);
  console.log(`  Total: ${total} palavras compostas`);
}

main().catch(console.error);
