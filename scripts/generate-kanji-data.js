/**
 * Gera kanjiByLevel.js a partir do pacote kanji-data.
 * Execute: node scripts/generate-kanji-data.js
 */
const kanji = require('kanji-data');
const fs = require('fs');
const path = require('path');

// Mapa de significados EN → PT (principais)
const MEANINGS_PT = {
  One: 'um', Two: 'dois', Three: 'três', Four: 'quatro', Five: 'cinco',
  Six: 'seis', Seven: 'sete', Eight: 'oito', Nine: 'nove', Ten: 'dez',
  Hundred: 'cem', Thousand: 'mil', 'Ten thousand': 'dez mil',
  Person: 'pessoa', Man: 'homem', Woman: 'mulher', Child: 'criança',
  Father: 'pai', Mother: 'mãe', Friend: 'amigo', People: 'povo',
  Day: 'dia', Sun: 'sol', Moon: 'lua', Month: 'mês', Year: 'ano',
  Water: 'água', Fire: 'fogo', Tree: 'árvore', Mountain: 'montanha',
  River: 'rio', Earth: 'terra', Gold: 'ouro', Metal: 'metal',
  Big: 'grande', Small: 'pequeno', Long: 'longo', Short: 'curto',
  High: 'alto', Low: 'baixo', New: 'novo', Old: 'velho',
  Book: 'livro', School: 'escola', Country: 'país', City: 'cidade',
  House: 'casa', Car: 'carro', Train: 'trem', Food: 'comida',
  Eat: 'comer', Drink: 'beber', Go: 'ir', Come: 'vir', See: 'ver',
  Hear: 'ouvir', Speak: 'falar', Read: 'ler', Write: 'escrever',
  North: 'norte', South: 'sul', East: 'leste', West: 'oeste',
  Left: 'esquerda', Right: 'direita', Up: 'em cima', Down: 'embaixo',
  Inside: 'dentro', Outside: 'fora', Before: 'antes', After: 'depois',
  Now: 'agora', Today: 'hoje', Tomorrow: 'amanhã', Yesterday: 'ontem',
  Rain: 'chuva', Snow: 'neve', Hot: 'quente', Cold: 'frio',
  White: 'branco', Black: 'preto', Red: 'vermelho', Blue: 'azul',
  Enter: 'entrar', Exit: 'sair', Open: 'abrir', Close: 'fechar',
  Rest: 'descansar', Work: 'trabalhar', Study: 'estudar',
  Body: 'corpo', Hand: 'mão', Eye: 'olho', Mouth: 'boca', Heart: 'coração',
  Name: 'nome', Money: 'dinheiro', Time: 'tempo', Question: 'pergunta',
  Thing: 'coisa', Place: 'lugar', Way: 'caminho', Reason: 'razão',
  Power: 'força', Life: 'vida', Death: 'morte', War: 'guerra',
  Peace: 'paz', Law: 'lei', Government: 'governo', Politics: 'política',
  Company: 'empresa', Meeting: 'reunião', Office: 'escritório',
  Cat: 'gato', Dog: 'cachorro', Bird: 'pássaro', Fish: 'peixe',
};

function toKatakana(hiragana) {
  if (!hiragana) return '';
  return hiragana.replace(/[\u3041-\u3096]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) + 0x60)
  );
}

function translateMeaning(en) {
  const clean = (en || '').replace(/[\^!]/g, '').trim();
  return MEANINGS_PT[clean] || clean.toLowerCase();
}

function formatKanjiEntry(char, meta) {
  if (!meta) return null;
  const meaning = (meta.meanings && meta.meanings[0])
    ? translateMeaning(meta.meanings[0])
    : '?';
  const onFirst = meta.on_readings && meta.on_readings[0];
  const kunFirst = meta.kun_readings && meta.kun_readings[0];
  const onyomi = onFirst ? toKatakana(onFirst.replace(/[.・\-]/g, '').split(/[.・\-]/)[0]) : null;
  const kunyomi = kunFirst ? kunFirst.replace(/[.・\-].*$/, '').replace(/^[!^]/, '') : null;
  const reading = kunyomi || onFirst || '';
  const example = reading ? `{${char}|${reading}}` : null;

  return {
    kanji: char,
    onyomi: onyomi || null,
    kunyomi: kunyomi || null,
    meaning,
    example,
  };
}

function generateLevel(levelNum, levelName) {
  const chars = kanji.getJlpt(levelNum);
  if (!chars || chars.length === 0) return [];
  const list = [];
  const seen = new Set();
  for (const char of chars) {
    if (seen.has(char)) continue;
    seen.add(char);
    const meta = kanji.get(char);
    const entry = formatKanjiEntry(char, meta);
    if (entry) list.push(entry);
  }
  return list;
}

function formatEntry(e) {
  const ex = e.example ? `, example: '${String(e.example).replace(/'/g, "\\'")}'` : '';
  const on = e.onyomi ? `'${e.onyomi}'` : 'null';
  const kun = e.kunyomi ? `'${e.kunyomi}'` : 'null';
  const meaning = String(e.meaning).replace(/'/g, "\\'");
  return `  { kanji: '${e.kanji}', onyomi: ${on}, kunyomi: ${kun}, meaning: '${meaning}'${ex} }`;
}

function main() {
  console.log('Gerando dados de kanji JLPT...');

  const KANJI_N5 = generateLevel(5, 'N5');
  const KANJI_N4 = generateLevel(4, 'N4');
  const KANJI_N3 = generateLevel(3, 'N3');
  const KANJI_N2 = generateLevel(2, 'N2');
  const KANJI_N1 = generateLevel(1, 'N1');

  const out = `/**
 * Kanji por nível JLPT — gerado por scripts/generate-kanji-data.js
 * Formato: { kanji, onyomi, kunyomi, meaning, example }
 * Execute "npm run generate:kanji" para atualizar.
 */

// ─── INICIANTE — Kanji mais básicos (${KANJI_INICIANTE.length}) ─────────────────────────────────────
export const KANJI_INICIANTE = [
${KANJI_INICIANTE.map(formatEntry).join(',\n')}
];

// ─── N5 — Kanji essenciais (${KANJI_N5.length}) ──────────────────────────────────────────────
export const KANJI_N5 = [
${KANJI_N5.map(formatEntry).join(',\n')}
];

// ─── N4 — Kanji adicionais (${KANJI_N4.length}) ──────────────────────────────────────────────
export const KANJI_N4 = [
${KANJI_N4.map(formatEntry).join(',\n')}
];

// ─── N3 — Kanji intermediários (${KANJI_N3.length}) ───────────────────────────────────────────
export const KANJI_N3 = [
${KANJI_N3.map(formatEntry).join(',\n')}
];

// ─── N2 — Kanji avançados (${KANJI_N2.length}) ───────────────────────────────────────────────
export const KANJI_N2 = [
${KANJI_N2.map(formatEntry).join(',\n')}
];

// ─── N1 — Kanji proficientes (${KANJI_N1.length}) ─────────────────────────────────────────────
export const KANJI_N1 = [
${KANJI_N1.map(formatEntry).join(',\n')}
];

/** Agrupa kanji em lotes para lições */
export function chunkKanji(kanjiList, size = 15) {
  const chunks = [];
  for (let i = 0; i < kanjiList.length; i += size) {
    chunks.push(kanjiList.slice(i, i + size));
  }
  return chunks;
}
`;

  const outPath = path.join(__dirname, '..', 'src', 'data', 'kanjiByLevel.js');
  fs.writeFileSync(outPath, out, 'utf8');

  const total = KANJI_N5.length + KANJI_N4.length + KANJI_N3.length + KANJI_N2.length + KANJI_N1.length;
  console.log(`✓ Gerado ${outPath}`);
  console.log(`  N5: ${KANJI_N5.length} | N4: ${KANJI_N4.length} | N3: ${KANJI_N3.length} | N2: ${KANJI_N2.length} | N1: ${KANJI_N1.length}`);
  console.log(`  Total: ${total} kanji`);
}

main();
