/**
 * Tabelas completas de Hiragana e Katakana organizadas por grupo (行 - gyou).
 * Cada entrada: { kana, romaji, group, groupLabel, example, examplePt }
 */

export const HIRAGANA_GROUPS = [
  {
    id: 'a',
    label: 'あ行',
    kanas: [
      { kana: 'あ', romaji: 'a',  example: 'あめ',  examplePt: 'chuva' },
      { kana: 'い', romaji: 'i',  example: 'いぬ',  examplePt: 'cachorro' },
      { kana: 'う', romaji: 'u',  example: 'うみ',  examplePt: 'mar' },
      { kana: 'え', romaji: 'e',  example: 'えき',  examplePt: 'estação de trem' },
      { kana: 'お', romaji: 'o',  example: 'おか',  examplePt: 'colina' },
    ],
  },
  {
    id: 'ka',
    label: 'か行',
    kanas: [
      { kana: 'か', romaji: 'ka', example: 'かさ',  examplePt: 'guarda-chuva' },
      { kana: 'き', romaji: 'ki', example: 'きつね', examplePt: 'raposa' },
      { kana: 'く', romaji: 'ku', example: 'くも',  examplePt: 'nuvem' },
      { kana: 'け', romaji: 'ke', example: 'けむり', examplePt: 'fumaça' },
      { kana: 'こ', romaji: 'ko', example: 'こえ',  examplePt: 'voz' },
    ],
  },
  {
    id: 'sa',
    label: 'さ行',
    kanas: [
      { kana: 'さ', romaji: 'sa', example: 'さくら', examplePt: 'cerejeira' },
      { kana: 'し', romaji: 'shi',example: 'しろ',  examplePt: 'castelo' },
      { kana: 'す', romaji: 'su', example: 'すし',  examplePt: 'sushi' },
      { kana: 'せ', romaji: 'se', example: 'せかい', examplePt: 'mundo' },
      { kana: 'そ', romaji: 'so', example: 'そら',  examplePt: 'céu' },
    ],
  },
  {
    id: 'ta',
    label: 'た行',
    kanas: [
      { kana: 'た', romaji: 'ta', example: 'たき',  examplePt: 'cachoeira' },
      { kana: 'ち', romaji: 'chi',example: 'ちから', examplePt: 'força' },
      { kana: 'つ', romaji: 'tsu',example: 'つき',  examplePt: 'lua' },
      { kana: 'て', romaji: 'te', example: 'てら',  examplePt: 'templo' },
      { kana: 'と', romaji: 'to', example: 'とり',  examplePt: 'pássaro' },
    ],
  },
  {
    id: 'na',
    label: 'な行',
    kanas: [
      { kana: 'な', romaji: 'na', example: 'なみ',  examplePt: 'onda' },
      { kana: 'に', romaji: 'ni', example: 'にわ',  examplePt: 'jardim' },
      { kana: 'ぬ', romaji: 'nu', example: 'ぬの',  examplePt: 'tecido' },
      { kana: 'ね', romaji: 'ne', example: 'ねこ',  examplePt: 'gato' },
      { kana: 'の', romaji: 'no', example: 'のり',  examplePt: 'cola / alga' },
    ],
  },
  {
    id: 'ha',
    label: 'は行',
    kanas: [
      { kana: 'は', romaji: 'ha', example: 'はな',  examplePt: 'flor' },
      { kana: 'ひ', romaji: 'hi', example: 'ひかり', examplePt: 'luz' },
      { kana: 'ふ', romaji: 'fu', example: 'ふね',  examplePt: 'barco' },
      { kana: 'へ', romaji: 'he', example: 'へや',  examplePt: 'quarto' },
      { kana: 'ほ', romaji: 'ho', example: 'ほし',  examplePt: 'estrela' },
    ],
  },
  {
    id: 'ma',
    label: 'ま行',
    kanas: [
      { kana: 'ま', romaji: 'ma', example: 'まち',  examplePt: 'cidade' },
      { kana: 'み', romaji: 'mi', example: 'みず',  examplePt: 'água' },
      { kana: 'む', romaji: 'mu', example: 'むし',  examplePt: 'inseto' },
      { kana: 'め', romaji: 'me', example: 'めだか', examplePt: 'peixinho' },
      { kana: 'も', romaji: 'mo', example: 'もり',  examplePt: 'floresta' },
    ],
  },
  {
    id: 'ya',
    label: 'や行',
    kanas: [
      { kana: 'や', romaji: 'ya', example: 'やま',  examplePt: 'montanha' },
      { kana: 'ゆ', romaji: 'yu', example: 'ゆき',  examplePt: 'neve' },
      { kana: 'よ', romaji: 'yo', example: 'よる',  examplePt: 'noite' },
    ],
  },
  {
    id: 'ra',
    label: 'ら行',
    kanas: [
      { kana: 'ら', romaji: 'ra', example: 'らいう', examplePt: 'trovão' },
      { kana: 'り', romaji: 'ri', example: 'りゅう', examplePt: 'dragão' },
      { kana: 'る', romaji: 'ru', example: 'るび',  examplePt: 'rubi' },
      { kana: 'れ', romaji: 're', example: 'れきし', examplePt: 'história' },
      { kana: 'ろ', romaji: 'ro', example: 'ろうか', examplePt: 'corredor' },
    ],
  },
  {
    id: 'wa',
    label: 'わ行 + ん',
    kanas: [
      { kana: 'わ', romaji: 'wa', example: 'わし',  examplePt: 'águia' },
      { kana: 'を', romaji: 'wo', example: '〜を',  examplePt: '(partícula de objeto)' },
      { kana: 'ん', romaji: 'n',  example: 'ほん',  examplePt: 'livro' },
    ],
  },
];

export const KATAKANA_GROUPS = [
  {
    id: 'ka_a',
    label: 'ア行',
    kanas: [
      { kana: 'ア', romaji: 'a',   example: 'アイス',   examplePt: 'sorvete (ice)' },
      { kana: 'イ', romaji: 'i',   example: 'イタリア', examplePt: 'Itália' },
      { kana: 'ウ', romaji: 'u',   example: 'ウイルス', examplePt: 'vírus' },
      { kana: 'エ', romaji: 'e',   example: 'エレベーター', examplePt: 'elevador' },
      { kana: 'オ', romaji: 'o',   example: 'オレンジ', examplePt: 'laranja' },
    ],
  },
  {
    id: 'ka_ka',
    label: 'カ行',
    kanas: [
      { kana: 'カ', romaji: 'ka',  example: 'カメラ',  examplePt: 'câmera' },
      { kana: 'キ', romaji: 'ki',  example: 'キリン',  examplePt: 'girafa' },
      { kana: 'ク', romaji: 'ku',  example: 'クラス',  examplePt: 'turma/classe' },
      { kana: 'ケ', romaji: 'ke',  example: 'ケーキ',  examplePt: 'bolo (cake)' },
      { kana: 'コ', romaji: 'ko',  example: 'コーヒー', examplePt: 'café (coffee)' },
    ],
  },
  {
    id: 'ka_sa',
    label: 'サ行',
    kanas: [
      { kana: 'サ', romaji: 'sa',  example: 'サッカー', examplePt: 'futebol (soccer)' },
      { kana: 'シ', romaji: 'shi', example: 'シャツ',  examplePt: 'camisa (shirt)' },
      { kana: 'ス', romaji: 'su',  example: 'スポーツ', examplePt: 'esporte (sport)' },
      { kana: 'セ', romaji: 'se',  example: 'セーター', examplePt: 'suéter' },
      { kana: 'ソ', romaji: 'so',  example: 'ソファ',  examplePt: 'sofá (sofa)' },
    ],
  },
  {
    id: 'ka_ta',
    label: 'タ行',
    kanas: [
      { kana: 'タ', romaji: 'ta',  example: 'タクシー', examplePt: 'táxi' },
      { kana: 'チ', romaji: 'chi', example: 'チーム',  examplePt: 'time/equipe' },
      { kana: 'ツ', romaji: 'tsu', example: 'ツアー',  examplePt: 'excursão (tour)' },
      { kana: 'テ', romaji: 'te',  example: 'テレビ',  examplePt: 'televisão (TV)' },
      { kana: 'ト', romaji: 'to',  example: 'トイレ',  examplePt: 'banheiro (toilet)' },
    ],
  },
  {
    id: 'ka_na',
    label: 'ナ行',
    kanas: [
      { kana: 'ナ', romaji: 'na',  example: 'ナイフ',  examplePt: 'faca (knife)' },
      { kana: 'ニ', romaji: 'ni',  example: 'ニュース', examplePt: 'notícias (news)' },
      { kana: 'ヌ', romaji: 'nu',  example: 'ヌードル', examplePt: 'macarrão (noodle)' },
      { kana: 'ネ', romaji: 'ne',  example: 'ネクタイ', examplePt: 'gravata (necktie)' },
      { kana: 'ノ', romaji: 'no',  example: 'ノート',  examplePt: 'caderno (note)' },
    ],
  },
  {
    id: 'ka_ha',
    label: 'ハ行',
    kanas: [
      { kana: 'ハ', romaji: 'ha',  example: 'ハム',    examplePt: 'presunto (ham)' },
      { kana: 'ヒ', romaji: 'hi',  example: 'ヒーロー', examplePt: 'herói (hero)' },
      { kana: 'フ', romaji: 'fu',  example: 'フルーツ', examplePt: 'frutas (fruit)' },
      { kana: 'ヘ', romaji: 'he',  example: 'ヘルメット', examplePt: 'capacete (helmet)' },
      { kana: 'ホ', romaji: 'ho',  example: 'ホテル',  examplePt: 'hotel' },
    ],
  },
  {
    id: 'ka_ma',
    label: 'マ行',
    kanas: [
      { kana: 'マ', romaji: 'ma',  example: 'マップ',  examplePt: 'mapa (map)' },
      { kana: 'ミ', romaji: 'mi',  example: 'ミルク',  examplePt: 'leite (milk)' },
      { kana: 'ム', romaji: 'mu',  example: 'ムービー', examplePt: 'filme (movie)' },
      { kana: 'メ', romaji: 'me',  example: 'メニュー', examplePt: 'cardápio (menu)' },
      { kana: 'モ', romaji: 'mo',  example: 'モデル',  examplePt: 'modelo (model)' },
    ],
  },
  {
    id: 'ka_ya',
    label: 'ヤ行',
    kanas: [
      { kana: 'ヤ', romaji: 'ya',  example: 'ヤード',  examplePt: 'jarda (yard)' },
      { kana: 'ユ', romaji: 'yu',  example: 'ユニフォーム', examplePt: 'uniforme' },
      { kana: 'ヨ', romaji: 'yo',  example: 'ヨーロッパ', examplePt: 'Europa' },
    ],
  },
  {
    id: 'ka_ra',
    label: 'ラ行',
    kanas: [
      { kana: 'ラ', romaji: 'ra',  example: 'ラーメン', examplePt: 'ramen' },
      { kana: 'リ', romaji: 'ri',  example: 'リモコン', examplePt: 'controle remoto' },
      { kana: 'ル', romaji: 'ru',  example: 'ルール',  examplePt: 'regra (rule)' },
      { kana: 'レ', romaji: 're',  example: 'レストラン', examplePt: 'restaurante' },
      { kana: 'ロ', romaji: 'ro',  example: 'ロボット', examplePt: 'robô (robot)' },
    ],
  },
  {
    id: 'ka_wa',
    label: 'ワ行 + ン',
    kanas: [
      { kana: 'ワ', romaji: 'wa',  example: 'ワイン',  examplePt: 'vinho (wine)' },
      { kana: 'ヲ', romaji: 'wo',  example: '〜ヲ',   examplePt: '(partícula — raro)' },
      { kana: 'ン', romaji: 'n',   example: 'パン',   examplePt: 'pão (pain)' },
    ],
  },
];

/** Retorna todos os kanas de hiragana em lista plana */
export function getAllHiragana() {
  return HIRAGANA_GROUPS.flatMap(g => g.kanas.map(k => ({ ...k, group: g.id, groupLabel: g.label })));
}

/** Retorna todos os kanas de katakana em lista plana */
export function getAllKatakana() {
  return KATAKANA_GROUPS.flatMap(g => g.kanas.map(k => ({ ...k, group: g.id, groupLabel: g.label })));
}

/** Retorna os kanas de um grupo específico (hiragana) pelo índice acumulado */
export function getHiraganaUpToGroup(groupIndex) {
  return HIRAGANA_GROUPS
    .slice(0, groupIndex + 1)
    .flatMap(g => g.kanas.map(k => ({ ...k, group: g.id, groupLabel: g.label })));
}
