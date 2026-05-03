/**
 * Gera lições de vocabulário (palavras compostas com kanji) a partir de vocabByLevel.js
 */
import {
  VOCAB_N5,
  VOCAB_N4,
  VOCAB_N3,
  VOCAB_N2,
  VOCAB_N1,
  chunkVocab,
} from './vocabByLevel';

function buildVocabLesson(id, title, jlptLevel, icon, vocabChunk, partNum, totalParts) {
  const tableRows = vocabChunk.map((v) => [
    `{${v.word}|${v.reading}}`,
    v.meaning,
  ]);

  const quizWords = vocabChunk.slice(0, 8);
  const allMeanings = vocabChunk.map((x) => x.meaning);
  const quiz = quizWords.slice(0, 5).map((v) => {
    const wrong = allMeanings.filter((m) => m !== v.meaning);
    const shuffled = shuffleArray([v.meaning, ...shuffleAndPick(wrong, 3)]);
    return {
      question: `O que significa {${v.word}|${v.reading}}?`,
      options: shuffled,
      correctIdx: shuffled.indexOf(v.meaning),
      explanation: `{${v.word}|${v.reading}} = ${v.meaning}.`,
    };
  });

  return {
    id,
    title,
    jlptLevel,
    icon,
    description: `Vocabulário ${partNum} de ${totalParts} do nível ${jlptLevel}. Palavras compostas com kanji.`,
    slides: [
      {
        type: 'intro',
        sensei: `Vamos aprender ${vocabChunk.length} palavras do nível ${jlptLevel}. São palavras compostas com kanji que aparecem no exame JLPT!`,
        japanese: null,
        translation: null,
      },
      {
        type: 'table',
        sensei: `Palavras desta lição (parte ${partNum}/${totalParts}):`,
        rows: tableRows,
      },
      {
        type: 'tip',
        sensei: 'Dica: Pratique a leitura e o significado. No JLPT, você precisa reconhecer essas palavras em textos e na parte de vocabulário.',
        japanese: null,
        translation: null,
        note: 'Use flashcards ou revise esta lição várias vezes para memorizar.',
      },
    ],
    quiz: quiz.length >= 3 ? quiz : [
      ...quiz,
      ...Array.from({ length: Math.max(0, 3 - quiz.length) }, () => {
        const v = quizWords[0];
        if (!v) return null;
        return {
          question: `O que significa {${v.word}|${v.reading}}?`,
          options: [v.meaning, 'outro', 'nenhum', 'todos'],
          correctIdx: 0,
          explanation: `{${v.word}|${v.reading}} = ${v.meaning}.`,
        };
      }).filter(Boolean),
    ].slice(0, 5),
  };
}

function shuffleAndPick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function buildAllVocabLessons() {
  const lessons = [];
  const configs = [
    { list: VOCAB_N5, level: 'N5', prefix: 'n5-vocab', icon: '📚', size: 20 },
    { list: VOCAB_N4, level: 'N4', prefix: 'n4-vocab', icon: '📖', size: 20 },
    { list: VOCAB_N3, level: 'N3', prefix: 'n3-vocab', icon: '📕', size: 25 },
    { list: VOCAB_N2, level: 'N2', prefix: 'n2-vocab', icon: '📗', size: 25 },
    { list: VOCAB_N1, level: 'N1', prefix: 'n1-vocab', icon: '📘', size: 25 },
  ];

  for (const { list, level, prefix, icon, size } of configs) {
    if (!list || list.length === 0) continue;
    const chunks = chunkVocab(list, size);
    chunks.forEach((chunk, i) => {
      const partNum = i + 1;
      const totalParts = chunks.length;
      lessons.push(
        buildVocabLesson(
          `${prefix}-${partNum}`,
          `Vocabulário ${level} — Parte ${partNum}`,
          level,
          icon,
          chunk,
          partNum,
          totalParts
        )
      );
    });
  }

  return lessons;
}
