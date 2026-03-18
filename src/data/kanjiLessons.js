/**
 * Gera lições de kanji a partir dos dados em kanjiByLevel.js
 */
import {
  KANJI_N5,
  KANJI_N4,
  KANJI_N3,
  KANJI_N2,
  KANJI_N1,
  chunkKanji,
} from './kanjiByLevel';

function toHiragana(str) {
  if (!str) return '';
  return str.replace(/[\u30A1-\u30F6]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60)
  );
}

function buildKanjiLesson(id, title, jlptLevel, icon, kanjiChunk, partNum, totalParts) {
  const tableRows = kanjiChunk.map(k => {
    const reading = [k.onyomi, k.kunyomi].filter(Boolean).join(' / ');
    const raw = (k.kunyomi || k.onyomi || '').split(/[・,]/)[0] || '';
    const furigana = (raw && raw.match(/[\u30A0-\u30FF]/)) ? toHiragana(raw) : raw;
    return [`{${k.kanji}|${furigana || raw}}`, `${reading} — ${k.meaning}`];
  });

  const quizKanji = kanjiChunk.slice(0, 5);
  const otherMeanings = kanjiChunk.map(x => x.meaning);
  const quiz = quizKanji.slice(0, 3).map(k => {
    const wrong = otherMeanings.filter(m => m !== k.meaning);
    const opts = [k.meaning, ...shuffleAndPick(wrong, 3)];
    const shuffled = shuffleArray(opts);
    return {
      question: `O kanji ${k.kanji} significa:`,
      options: shuffled,
      correctIdx: shuffled.indexOf(k.meaning),
      explanation: `${k.kanji} = ${k.meaning}.`,
    };
  });

  return {
    id,
    title,
    jlptLevel,
    icon,
    description: `Kanji ${partNum} de ${totalParts} do nível ${jlptLevel}.`,
    slides: [
      {
        type: 'intro',
        sensei: `Vamos aprender ${kanjiChunk.length} kanji essenciais do nível ${jlptLevel}. Pratique a leitura e o significado de cada um!`,
        japanese: null,
        translation: null,
      },
      {
        type: 'table',
        sensei: `Kanji desta lição (parte ${partNum}/${totalParts}):`,
        rows: tableRows,
      },
      ...(kanjiChunk.some(k => k.example) ? [{
        type: 'concept',
        sensei: 'Exemplos de uso:',
        japanese: kanjiChunk.filter(k => k.example).slice(0, 3).map(k => k.example).join('\n'),
        romaji: null,
        translation: null,
      }] : []).filter(Boolean),
      {
        type: 'tip',
        sensei: 'Dica: Onyomi (leitura chinesa) aparece em compostos. Kunyomi (leitura japonesa) em palavras sozinhas ou com okurigana.',
        japanese: null,
        translation: null,
        note: 'Pratique escrevendo os kanji e associando às leituras.',
      },
    ].filter(Boolean),
    quiz: quiz.length >= 3 ? quiz : [
      ...quiz,
      ...Array.from({ length: Math.max(0, 3 - quiz.length) }, () => {
        const k = quizKanji[0];
        if (!k) return null;
        return { question: `O kanji ${k.kanji} significa:`, options: [k.meaning, 'outro', 'nenhum', 'todos'], correctIdx: 0, explanation: `${k.kanji} = ${k.meaning}.` };
      }).filter(Boolean),
    ].slice(0, 3),
  };
}

function shuffleAndPick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function buildAllKanjiLessons() {
  const lessons = [];
  const configs = [
    { list: KANJI_N5, level: 'N5', prefix: 'n5-kanji', icon: '🀄', size: 15 },
    { list: KANJI_N4, level: 'N4', prefix: 'n4-kanji', icon: '📝', size: 15 },
    { list: KANJI_N3, level: 'N3', prefix: 'n3-kanji', icon: '✏️', size: 15 },
    { list: KANJI_N2, level: 'N2', prefix: 'n2-kanji', icon: '🖌️', size: 15 },
    { list: KANJI_N1, level: 'N1', prefix: 'n1-kanji', icon: '📜', size: 15 },
  ];

  for (const { list, level, prefix, icon, size } of configs) {
    if (!list || list.length === 0) continue;
    const chunks = chunkKanji(list, size);
    chunks.forEach((chunk, i) => {
      const partNum = i + 1;
      const totalParts = chunks.length;
      lessons.push(buildKanjiLesson(
        `${prefix}-${partNum}`,
        `Kanji ${level} — Parte ${partNum}`,
        level,
        icon,
        chunk,
        partNum,
        totalParts
      ));
    });
  }

  return lessons;
}
