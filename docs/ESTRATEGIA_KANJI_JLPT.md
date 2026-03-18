# Estratégia de Ensino de Kanji — Japão Quest

## Objetivo

Ensinar **todos os ~2.000 kanji cobrados no JLPT** sem gerar milhares de lições, mantendo o jogo jogável e pedagogicamente eficaz.

---

## Quantidade de Kanji por Nível JLPT

| Nível | Kanji (aprox.) | Acumulado |
|-------|----------------|-----------|
| N5    | ~80            | 80        |
| N4    | ~90            | ~170      |
| N3    | ~200           | ~370      |
| N2    | ~365           | ~735      |
| N1    | ~1.270         | ~2.005    |

*Nota: O JLPT não publica lista oficial; os números são baseados em análises de provas anteriores.*

---

## Critérios de Agrupamento — Comparação

| Critério | Prós | Contras |
|----------|------|---------|
| **Por traços** | Fácil de implementar | Kanji com mesmo nº de traços podem ser totalmente diferentes (ex: 一 e 乙) |
| **Por dificuldade** | Progressão suave | Subjetivo; difícil de definir |
| **Por radical/contexto** | **Associação semântica**; facilita memorização; usado em livros didáticos | Requer classificação manual ou base de dados |
| **Por nível JLPT** | Alinha com o exame; desbloqueio por região no mapa | Dentro do nível, ordem arbitrária |

### Recomendação: **Híbrido — Nível JLPT + Tema Semântico**

1. **Primário:** Nível JLPT (N5, N4, N3, N2, N1) — mantém progressão e desbloqueio por região.
2. **Secundário:** Dentro de cada nível, agrupar por **tema/radical** (ex.: água, pessoa, tempo).

---

## Temas Semânticos (baseados em 部首 — radicais)

Temas comuns para agrupar kanji dentro de cada nível:

| Tema | Radical/Contexto | Exemplos |
|------|------------------|----------|
| Números e quantidade | 一, 二, 百, 千, 万 | 一, 二, 十, 百, 千, 万, 半, 倍 |
| Pessoa e família | 人, 亻, 女, 子 | 人, 男, 女, 父, 母, 子, 友, 族 |
| Corpo | 目, 口, 手, 足, 心 | 目, 口, 手, 足, 体, 心, 頭, 耳 |
| Natureza — água | 水, 氵 | 水, 川, 泳, 海, 河, 湖, 酒 |
| Natureza — fogo/calor | 火, 灬 | 火, 熱, 焼, 炎 |
| Natureza — terra/árvore | 土, 木, 山 | 土, 木, 山, 林, 森, 田 |
| Tempo | 日, 月, 時 | 日, 月, 年, 時, 週, 朝, 夕 |
| Direção e espaço | 上, 下, 左, 右 | 上, 下, 中, 前, 後, 東, 西, 南, 北 |
| Ações e movimento | 行, 走, 辶 | 行, 来, 出, 入, 動, 歩 |
| Fala e pensamento | 言, 心 | 言, 話, 読, 聞, 思, 忘 |
| Sociedade e trabalho | 社, 会, 業 | 会, 社, 業, 仕事, 員 |
| Comida e vida | 食, 生 | 食, 飲, 生, 活 |
| Outros/geral | — | Kanji que não se encaixam bem em temas |

---

## Tamanho das Lições

| Kanji/lição | Total de lições (~2.000 kanji) |
|-------------|-------------------------------|
| 10          | ~200 lições                   |
| 15          | ~134 lições                   |
| 20          | ~100 lições                   |

**Recomendação:** **15–18 kanji por lição** → ~110–135 lições no total.

- Evita lições muito longas (20+ kanji cansam).
- Evita explosão de lições (10 kanji = 200 lições).

---

## Distribuição Proposta por Nível

| Nível | Kanji | Lições (15/lição) | Lições (18/lição) |
|-------|-------|-------------------|-------------------|
| Iniciante | 25  | 2                 | 2                 |
| N5    | 80    | 5–6               | 5                 |
| N4    | 90    | 6                 | 5                 |
| N3    | 200   | 13–14             | 11–12             |
| N2    | 365   | 24–25             | 20–21             |
| N1    | 1.270 | 85                | 71                |
| **Total** | **~2.030** | **~135** | **~114** |

---

## Estrutura de Implementação

### 1. Base de Dados de Kanji

- **Opção A:** Expandir `kanjiByLevel.js` com todos os kanji e adicionar campo `theme` (ex.: `theme: 'água'`).
- **Opção B:** Criar `kanjiByTheme.js` que agrupa por tema dentro de cada nível.

Formato sugerido por kanji:

```js
{
  kanji: '泳',
  onyomi: 'エイ',
  kunyomi: 'およ',
  meaning: 'nadar',
  example: '{泳|およ}ぐ',
  jlptLevel: 'N3',
  theme: 'água',      // para agrupamento
  strokes: 8          // opcional
}
```

### 2. Fontes de Dados

- [JLPT Sensei](https://jlptsensei.com/jlpt-n5-kanji-list/)
- [Kanshudo](https://www.kanshudo.com/collections/jlpt_kanji)
- [KanjiVG](https://kanjivg.tagaini.net/) — traços e radical
- [Kanji Database](https://github.com/davidluzgouveia/kanji-data) — JSON com radical, strokes, etc.

### 3. Geração de Lições

Atualizar `kanjiLessons.js` para:

1. Agrupar kanji por `jlptLevel` e depois por `theme`.
2. Dividir cada grupo em chunks de 15–18 kanji.
3. Gerar lições com título temático quando possível (ex.: "Kanji de água e natureza — N3").

Exemplo de lógica:

```js
// Agrupar: nível → tema → chunk
const byLevel = groupBy(ALL_KANJI, 'jlptLevel');
for (const [level, kanjiList] of Object.entries(byLevel)) {
  const byTheme = groupBy(kanjiList, 'theme');
  for (const [theme, themedKanji] of Object.entries(byTheme)) {
    const chunks = chunkKanji(themedKanji, 15);
    chunks.forEach((chunk, i) => {
      lessons.push(buildKanjiLesson(..., chunk, theme));
    });
  }
}
```

### 4. Títulos das Lições

- **Com tema:** "Kanji de água — N3 (parte 1)"
- **Sem tema:** "Kanji N3 — Lição 5"

---

## Resumo da Estratégia

| Aspecto | Decisão |
|---------|---------|
| Agrupamento primário | Nível JLPT |
| Agrupamento secundário | Tema/radical (água, pessoa, tempo, etc.) |
| Kanji por lição | 15–18 |
| Total de lições | ~110–135 |
| Fonte de dados | Listas JLPT + metadados de radical |
| Campo extra no kanji | `theme` (opcional `strokes`) |

---

## Implementação (concluída)

1. **Base de dados:** Pacote `kanji-data` (npm) — lista completa JLPT N5–N1.
2. **Script de geração:** `scripts/generate-kanji-data.js` — execute `npm run generate:kanji` para atualizar.
3. **Arquivo gerado:** `src/data/kanjiByLevel.js` — ~2.236 kanji em 6 níveis.
4. **Lições:** `kanjiLessons.js` gera ~153 lições (15 kanji por lição).
5. **Integração:** Lições incluídas em `lessons.js` via `...KANJI_LESSONS`.
