# Convenções para Lições do Japão Quest

## 1. Dicas culturais com frases em japonês

- **Romaji obrigatório**: Toda dica cultural (`type: 'tip'`) que exibir texto em japonês (`japanese`) **deve** incluir o campo `romaji` com a leitura em romaji.
- Especialmente importante nos níveis **Iniciante** e **N5**, quando o jogador ainda está consolidando hiragana/katakana.
- Exemplo:
  ```js
  {
    type: 'tip',
    japanese: 'よろしくおねがいします',
    romaji: 'Yoroshiku onegaishimasu',  // obrigatório
    translation: 'Prazer em conhecê-lo',
  }
  ```

## 2. Kanji com furigana (kana)

- **Formato**: Use `{kanji|leitura}` para exibir a leitura em hiragana acima do kanji.
- **Quando usar**: Sempre que um kanji aparecer em `sensei`, `note`, `japanese`, `rows` de tabela ou em qualquer texto de lição que o jogador possa ainda não ter aprendido.
- Exemplo: `{私|わたし}` → 私 com わたし acima.
- Exemplo em texto misto: `"A reverência {お辞儀|おじぎ} é importante."`

## 3. Onde a marcação é aplicada

- `sensei`, `note`, `japanese`, `rows` (tabelas) e exemplos passam pelo componente `FuriganaText`, que interpreta `{kanji|furigana}`.
- Sem a marcação, o jogador verá apenas o kanji, o que dificulta a leitura nos níveis iniciais.

## 4. Resumo

| Situação | Ação |
|----------|------|
| Dica cultural com japonês | Incluir `romaji` |
| Kanji em qualquer slide | Usar `{kanji|furigana}` |
| Níveis Iniciante e N5 | Prioridade máxima para romaji e furigana |
