/**
 * Banco de lições do Japão Quest.
 *
 * Estrutura de cada lição:
 *  id        – identificador único
 *  title     – título em português
 *  jlptLevel – 'Iniciante' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
 *  icon      – emoji representativo
 *  description – resumo do que o jogador vai aprender
 *  slides    – array de slides (ver tipos abaixo)
 *  quiz      – array de questões finais
 *
 * Tipos de slide:
 *  'intro'   – abertura com fala do Sensei
 *  'concept' – regra + exemplo em japonês
 *  'example' – frase completa com tradução
 *  'tip'     – dica cultural ou mnemônica
 *  'table'   – tabela comparativa (rows: [[jp, pt], ...])
 *
 * Marcação de furigana:
 *  Use {kanji|leitura} para mostrar a leitura hiragana abaixo do kanji.
 *  Exemplo: {私|わたし}は{学生|がくせい}です。
 */

import { buildAllKanjiLessons } from './kanjiLessons';

const KANJI_LESSONS = buildAllKanjiLessons();

export const LESSONS = [

  // ═══════════════════════════════════════════════════════════════════════════════
  // INICIANTE (Básico) — Primeiros passos após aprender kana
  // ═══════════════════════════════════════════════════════════════════════════════

  {
    id: 'ini-first-words',
    title: 'Primeiras Palavras do Dia a Dia',
    jlptLevel: 'Iniciante',
    icon: '🌱',
    description: 'As palavras mais usadas no cotidiano japonês. Simples e prático!',
    slides: [
      { type: 'intro', sensei: 'Parabéns por dominar os kana! Agora vamos às primeiras palavras que todo mundo usa no Japão. Coisa do dia a dia mesmo!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Para falar de você mesmo, use:',
        japanese: '{私|わたし}',
        romaji: 'Watashi',
        translation: 'Eu (neutro, serve pra todo mundo)',
        highlight: '{私|わたし}',
        note: 'Com amigos, os caras costumam dizer 僕 (boku) e as minas 私 (watashi). Mas 私 é seguro em qualquer situação.',
      },
      {
        type: 'concept',
        sensei: 'A partícula です (desu) termina frases afirmativas. É tipo "é" ou "sou":',
        japanese: '{私|わたし}は{学生|がくせい}です。',
        romaji: 'Watashi wa gakusei desu.',
        translation: 'Eu sou estudante.',
        highlight: 'です',
        note: 'です é super comum. Aparece em quase toda frase simples.',
      },
      {
        type: 'table',
        sensei: 'Palavras que você vai ouvir todo dia:',
        rows: [
          ['{水|みず} (mizu)', 'Água'],
          ['{食|た}べもの (tabemono)', 'Comida'],
          ['{本|ほん} (hon)', 'Livro'],
          ['{電車|でんしゃ} (densha)', 'Trem'],
          ['{店|みせ} (mise)', 'Loja'],
          ['{今日|きょう} (kyou)', 'Hoje'],
          ['{明日|あした} (ashita)', 'Amanhã'],
          ['{名前|なまえ} (namae)', 'Nome'],
        ],
      },
      {
        type: 'example',
        sensei: 'Frases que você pode usar hoje:',
        examples: [
          { japanese: '{私|わたし}の{名前|なまえ}は〜です。', romaji: 'Watashi no namae wa ~ desu.', translation: 'Meu nome é ~' },
          { japanese: 'これは{水|みず}です。', romaji: 'Kore wa mizu desu.', translation: 'Isso é água.' },
          { japanese: '{今日|きょう}は{暑|あつ}いです。', romaji: 'Kyou wa atsui desu.', translation: 'Hoje está quente.' },
        ],
      },
      {
        type: 'tip',
        sensei: 'Você já tá mandando bem! Cada palavra nova é um passo pra conseguir falar de verdade. No Japão, até um "obrigado" ou "desculpa" bem dito abre portas. Continua assim!',
        japanese: null,
        translation: null,
        note: 'A prática faz a diferença. Use o que aprendeu sempre que puder.',
      },
    ],
    quiz: [
      { question: 'O que significa {私|わたし}?', options: ['Você', 'Eu', 'Ele', 'Nós'], correctIdx: 1, explanation: '{私|わたし} (watashi) = eu.' },
      { question: 'Complete: {私|わたし}は{学生|がくせい}___。', options: ['か', 'です', 'は', 'が'], correctIdx: 1, explanation: 'です termina frases afirmativas.' },
      { question: '{水|みず} significa:', options: ['Fogo', 'Água', 'Ar', 'Terra'], correctIdx: 1, explanation: '{水|みず} (mizu) = água.' },
    ],
  },

  {
    id: 'ini-yes-no-questions',
    title: 'Sim, Não e Perguntas',
    jlptLevel: 'Iniciante',
    icon: '❓',
    description: 'Aprenda a responder e fazer perguntas básicas.',
    slides: [
      { type: 'intro', sensei: 'Sim e não parecem óbvio, mas em japonês tem umas nuances. E fazer pergunta é super fácil — é só botar か no final!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Para dizer SIM:',
        japanese: 'はい',
        romaji: 'Hai',
        translation: 'Sim (formal, educado)',
        highlight: 'はい',
        note: 'うん (un) é o "sim" mais solto, entre amigos. はい é o seguro.',
      },
      {
        type: 'concept',
        sensei: 'Para dizer NÃO:',
        japanese: 'いいえ',
        romaji: 'Iie',
        translation: 'Não (formal)',
        highlight: 'いいえ',
        note: 'ううん (uun) é o "não" informal. いいえ soa mais educado.',
      },
      {
        type: 'concept',
        sensei: 'Para fazer pergunta, coloque か no final:',
        japanese: '{元気|げんき}ですか？',
        romaji: 'Genki desu ka?',
        translation: 'Você está bem?',
        highlight: 'か',
        note: 'か transforma qualquer frase em pergunta. Tipo um ponto de interrogação falado.',
      },
      {
        type: 'example',
        sensei: 'Perguntas do dia a dia:',
        examples: [
          { japanese: 'おいしいですか？', romaji: 'Oishii desu ka?', translation: 'Está gostoso?' },
          { japanese: 'いくらですか？', romaji: 'Ikura desu ka?', translation: 'Quanto custa?' },
          { japanese: 'どこですか？', romaji: 'Doko desu ka?', translation: 'Onde é?' },
          { japanese: '{何|なに}ですか？', romaji: 'Nan desu ka?', translation: 'O que é?' },
        ],
      },
      {
        type: 'tip',
        sensei: 'Dica: {元気|げんき}ですか é tipo "e aí, beleza?". Responda はい、{元気|げんき}です (sim, tô bem) ou まあまあです (mais ou menos).',
        japanese: null,
        translation: null,
        note: 'Os japoneses perguntam {元気|げんき}ですか o tempo todo. É cumprimento + pergunta numa coisa só.',
      },
    ],
    quiz: [
      { question: 'Como se diz "sim" de forma educada?', options: ['うん', 'いいえ', 'はい', 'ううん'], correctIdx: 2, explanation: 'はい (hai) = sim, forma educada.' },
      { question: 'O que か no final da frase faz?', options: ['Nega', 'Afirma', 'Transforma em pergunta', 'Dá ênfase'], correctIdx: 2, explanation: 'か transforma a frase em pergunta.' },
      { question: '{元気|げんき}ですか significa:', options: ['Quanto custa?', 'Onde fica?', 'Você está bem?', 'O que é isso?'], correctIdx: 2, explanation: '{元気|げんき} = bem/saudável. A pergunta é "você está bem?"' },
    ],
  },

  {
    id: 'ini-kore-sore-are',
    title: 'Isso, Aquilo e Aquilo Lá (こそあど)',
    jlptLevel: 'Iniciante',
    icon: '👆',
    description: 'Aprenda a apontar coisas: perto de você, perto do outro, longe.',
    slides: [
      { type: 'intro', sensei: 'No japonês tem uma família de palavras pra "isso aqui", "isso aí", "isso lá". São os こそあど — super úteis!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'これ (kore) = ISTO (perto de quem fala):',
        japanese: 'これは{何|なに}ですか？',
        romaji: 'Kore wa nan desu ka?',
        translation: 'O que é isto?',
        highlight: 'これ',
        note: 'これ = coisa perto de MIM. "Isto aqui".',
      },
      {
        type: 'concept',
        sensei: 'それ (sore) = ISSO (perto de quem ouve):',
        japanese: 'それは{本|ほん}です。',
        romaji: 'Sore wa hon desu.',
        translation: 'Isso é um livro.',
        highlight: 'それ',
        note: 'それ = coisa perto de VOCÊ. "Isso aí que você tá segurando".',
      },
      {
        type: 'concept',
        sensei: 'あれ (are) = AQUILO (longe dos dois):',
        japanese: 'あれは{電車|でんしゃ}です。',
        romaji: 'Are wa densha desu.',
        translation: 'Aquilo é um trem.',
        highlight: 'あれ',
        note: 'あれ = coisa LONGE. "Aquilo lá".',
      },
      {
        type: 'table',
        sensei: 'A família こそあど — lugar (どこ), coisa (どれ), pessoa (だれ):',
        rows: [
          ['ここ (koko)', 'Aqui'],
          ['そこ (soko)', 'Aí'],
          ['あそこ (asoko)', 'Ali'],
          ['{何|なに}/{何|なん} (nani/nan)', 'O quê'],
          ['{誰|だれ} (dare)', 'Quem'],
          ['どの (dono)', 'Qual (antes de substantivo)'],
        ],
      },
      {
        type: 'example',
        sensei: 'No dia a dia:',
        examples: [
          { japanese: 'トイレはどこですか？', romaji: 'Toire wa doko desu ka?', translation: 'Onde fica o banheiro?' },
          { japanese: 'あそこです。', romaji: 'Asoko desu.', translation: 'É ali.' },
          { japanese: 'これはいくらですか？', romaji: 'Kore wa ikura desu ka?', translation: 'Quanto custa isto?' },
        ],
      },
    ],
    quiz: [
      { question: 'これ indica algo perto de quem?', options: ['De quem ouve', 'De quem fala', 'Longe dos dois', 'De ninguém'], correctIdx: 1, explanation: 'これ = isto (perto de quem fala).' },
      { question: 'あれ é usado quando o objeto está:', options: ['Perto de mim', 'Perto de você', 'Longe', 'Na mão'], correctIdx: 2, explanation: 'あれ = aquilo (longe dos dois).' },
      { question: 'トイレはどこですか significa:', options: ['Onde fica o banheiro?', 'O que é o banheiro?', 'Quanto custa?', 'É um banheiro?'], correctIdx: 0, explanation: 'どこ = onde. Pergunta de localização.' },
    ],
  },

  {
    id: 'ini-basic-verbs',
    title: 'Verbos Básicos do Dia a Dia',
    jlptLevel: 'Iniciante',
    icon: '🏃',
    description: 'Os primeiros verbos: ir, vir, comer, ver. Coisa que você usa todo dia!',
    slides: [
      { type: 'intro', sensei: 'Verbos são o coração da frase. Vamos ver os 4 mais usados: ir, vir, comer e ver. Com eles você já monta um monte de frases!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Os 4 verbos essenciais:',
        rows: [
          ['{行|い}く (iku)', 'Ir'],
          ['{来|く}る (kuru)', 'Vir'],
          ['{食|た}べる (taberu)', 'Comer'],
          ['{見|み}る (miru)', 'Ver / Assistir'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Em japonês o verbo vai no final. E a forma educada termina em ます:',
        japanese: '{学校|がっこう}に{行|い}きます。',
        romaji: 'Gakkou ni ikimasu.',
        translation: 'Vou à escola.',
        highlight: '{行|い}きます',
        note: '{行|い}く + ます = {行|い}きます. {来|く}る + ます = {来|き}ます.',
      },
      {
        type: 'example',
        sensei: 'Frases que você pode usar hoje:',
        examples: [
          { japanese: 'どこに{行|い}きますか？', romaji: 'Doko ni ikimasu ka?', translation: 'Para onde você vai?' },
          { japanese: '{家|いえ}に{帰|かえ}ります。', romaji: 'Ie ni kaerimasu.', translation: 'Vou pra casa.' },
          { japanese: 'なにを{食|た}べますか？', romaji: 'Nani wo tabemasu ka?', translation: 'O que você come?' },
          { japanese: 'テレビを{見|み}ます。', romaji: 'Terebi wo mimasu.', translation: 'Assisto TV.' },
        ],
      },
    ],
    quiz: [
      { question: '{行|い}く significa:', options: ['Vir', 'Ir', 'Comer', 'Ver'], correctIdx: 1, explanation: '{行|い}く (iku) = ir.' },
      { question: 'Em japonês, o verbo fica:', options: ['No início', 'No meio', 'No final', 'Não tem verbo'], correctIdx: 2, explanation: 'O verbo sempre vem no final da frase.' },
      { question: '{来|き}ます é a forma ます de qual verbo?', options: ['{行|い}く', '{来|く}る', '{食|た}べる', '{見|み}る'], correctIdx: 1, explanation: '{来|く}る → {来|き}ます (vir).' },
    ],
  },

  {
    id: 'ini-adjectives',
    title: 'Adjetivos い e な',
    jlptLevel: 'Iniciante',
    icon: '🌈',
    description: 'Aprenda a descrever coisas: quente, frio, bonito, interessante.',
    slides: [
      { type: 'intro', sensei: 'Adjetivo em japonês tem dois tipos: os que terminam em い (i-adjetivos) e os que precisam de な (na-adjetivos). Parece estranho, mas você pega o jeito!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Adjetivos い — terminam em い e vêm direto antes do substantivo:',
        japanese: '{暑|あつ}い{日|ひ}',
        romaji: 'Atsui hi',
        translation: 'Dia quente',
        highlight: '{暑|あつ}い',
        note: '{暑|あつ}い (atsui) = quente. {寒|さむ}い (samui) = frio. {高|たか}い (takai) = alto/caro.',
      },
      {
        type: 'concept',
        sensei: 'Adjetivos な — precisam de な entre o adjetivo e o substantivo:',
        japanese: '{静|しず}かな{部屋|へや}',
        romaji: 'Shizuka na heya',
        translation: 'Quarto silencioso',
        highlight: 'な',
        note: '{静|しず}か (shizuka) = silencioso. {有名|ゆうめい} (yuumei) = famoso. {便利|べんり} (benri) = conveniente.',
      },
      {
        type: 'table',
        sensei: 'Adjetivos do dia a dia:',
        rows: [
          ['{暑|あつ}い (atsui)', 'Quente'],
          ['{寒|さむ}い (samui)', 'Frio'],
          ['{大|おお}きい (ookii)', 'Grande'],
          ['{小|ちい}さい (chiisai)', 'Pequeno'],
          ['{好|す}き (suki)', 'Gostar (adjetivo な!)'],
          ['{嫌|きら}い (kirai)', 'Não gostar (adjetivo な!)'],
          ['きれい (kirei)', 'Bonito/limpo (adjetivo な!)'],
          ['{元気|げんき} (genki)', 'Animado/saudável (adjetivo な!)'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Para dizer "gosto de X", use {好|す}き com が:',
        japanese: '{私|わたし}は{寿司|すし}が{好|す}きです。',
        romaji: 'Watashi wa sushi ga suki desu.',
        translation: 'Eu gosto de sushi.',
        highlight: 'が{好|す}き',
        note: 'Cuidado: {好|す}き é adjetivo, não verbo! "Sushi é gostável pra mim" = eu gosto de sushi.',
      },
      {
        type: 'example',
        sensei: 'Frases úteis:',
        examples: [
          { japanese: 'この{店|みせ}は{安|やす}いです。', romaji: 'Kono mise wa yasui desu.', translation: 'Esta loja é barata.' },
          { japanese: '{今日|きょう}は{寒|さむ}いですね。', romaji: 'Kyou wa samui desu ne.', translation: 'Hoje está frio, né?' },
          { japanese: '{彼|かれ}は{元気|げんき}です。', romaji: 'Kare wa genki desu.', translation: 'Ele está animado.' },
        ],
      },
    ],
    quiz: [
      { question: 'Qual partícula usar com {好|す}き?', options: ['は', 'を', 'が', 'に'], correctIdx: 2, explanation: '{好|す}き usa が: Xが{好|す}き = gostar de X.' },
      { question: 'きれい é adjetivo い ou な?', options: ['い', 'な', 'Os dois', 'Nenhum'], correctIdx: 1, explanation: 'きれい termina em い mas é adjetivo な! Exceção.' },
      { question: '{暑|あつ}い significa:', options: ['Frio', 'Quente', 'Grande', 'Pequeno'], correctIdx: 1, explanation: '{暑|あつ}い (atsui) = quente.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // N5 — Fundamentos
  // ═══════════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 1: Saudações
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-greetings',
    title: 'Saudações Essenciais',
    jlptLevel: 'N5',
    icon: '🙇',
    description: 'Aprenda como cumprimentar pessoas em japonês em diferentes situações do dia.',
    slides: [
      {
        type: 'intro',
        sensei: 'Bem-vindo, jovem Ronin! Toda jornada começa com um cumprimento. Vamos aprender as saudações essenciais do japonês!',
        japanese: null,
        translation: null,
      },
      {
        type: 'concept',
        sensei: 'Para cumprimentar de manhã, usamos:',
        japanese: 'おはようございます',
        romaji: 'Ohayou gozaimasu',
        translation: 'Bom dia (formal)',
        highlight: 'おはよう',
        note: 'Com amigos e família, pode dizer apenas "おはよう" (ohayou).',
      },
      {
        type: 'concept',
        sensei: 'Durante o dia, o cumprimento muda:',
        japanese: 'こんにちは',
        romaji: 'Konnichiwa',
        translation: 'Boa tarde / Olá',
        highlight: 'こんにちは',
        note: 'Usado do meio-dia até o começo da noite.',
      },
      {
        type: 'concept',
        sensei: 'À noite, usamos:',
        japanese: 'こんばんは',
        romaji: 'Konbanwa',
        translation: 'Boa noite (cumprimento)',
        highlight: 'こんばんは',
        note: 'Diferente de "おやすみ" que é usado na hora de dormir.',
      },
      {
        type: 'concept',
        sensei: 'Para se despedir:',
        japanese: 'さようなら',
        romaji: 'Sayounara',
        translation: 'Tchau / Adeus',
        highlight: 'さようなら',
        note: 'Para despedidas mais informais, use "じゃあね" (jaa ne) com amigos.',
      },
      {
        type: 'table',
        sensei: 'Veja o resumo das saudações por horário:',
        rows: [
          ['おはようございます', 'Bom dia (formal)'],
          ['おはよう', 'Bom dia (informal)'],
          ['こんにちは', 'Boa tarde / Olá'],
          ['こんばんは', 'Boa noite (ao chegar)'],
          ['おやすみなさい', 'Boa noite (ao dormir)'],
          ['さようなら', 'Adeus (formal)'],
          ['じゃあね', 'Tchau (informal)'],
        ],
      },
      {
        type: 'tip',
        sensei: 'Dica cultural! No Japão, os cumprimentos são acompanhados de uma reverência ({お辞儀|おじぎ} — o-jigi). Quanto mais respeitosa a pessoa, mais fundo você se inclina!',
        japanese: 'よろしくおねがいします',
        romaji: 'Yoroshiku onegaishimasu',
        translation: 'Prazer em conhecê-lo / Conto com você',
        note: 'Esta expressão não tem tradução direta — expressa respeito e boa vontade.',
      },
    ],
    quiz: [
      {
        question: 'Como se diz "Bom dia" formalmente em japonês?',
        options: ['こんにちは', 'おはようございます', 'こんばんは', 'さようなら'],
        correctIdx: 1,
        explanation: 'おはようございます (Ohayou gozaimasu) é o cumprimento matinal formal.',
      },
      {
        question: 'Qual saudação é usada à noite ao chegar em algum lugar?',
        options: ['おやすみなさい', 'おはよう', 'こんばんは', 'じゃあね'],
        correctIdx: 2,
        explanation: 'こんばんは (Konbanwa) é o cumprimento noturno. おやすみなさい é usado na hora de dormir.',
      },
      {
        question: '"じゃあね" é uma despedida...',
        options: ['Formal, para superiores', 'Informal, entre amigos', 'Para a hora de dormir', 'Para o meio-dia'],
        correctIdx: 1,
        explanation: 'じゃあね (Jaa ne) é uma despedida informal, equivalente a "tchau" entre amigos.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 2: Partículas は e が
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-particles-wa-ga',
    title: 'Partículas は e が',
    jlptLevel: 'N5',
    icon: '⚡',
    description: 'Entenda a diferença entre as partículas は (tópico) e が (sujeito).',
    slides: [
      {
        type: 'intro',
        sensei: 'As partículas são a alma do japonês! Sem elas a frase não faz sentido. は e が são as primeiras que você precisa — e aparecem em TUDO que você vai falar.',
        japanese: null,
        translation: null,
      },
      {
        type: 'concept',
        sensei: 'A partícula は (wa) marca o TÓPICO — o assunto sobre o qual estamos falando:',
        japanese: '{私|わたし}は{学生|がくせい}です。',
        romaji: 'Watashi wa gakusei desu.',
        translation: 'Eu sou estudante.',
        highlight: 'は',
        note: 'は é escrito com o hiragana "ha" mas lido como "wa" quando é partícula.',
      },
      {
        type: 'example',
        sensei: 'Mais exemplos com は:',
        examples: [
          { japanese: 'これはペンです。', romaji: 'Kore wa pen desu.', translation: 'Isto é uma caneta.' },
          { japanese: '{猫|ねこ}はかわいいです。', romaji: 'Neko wa kawaii desu.', translation: 'O gato é fofo.' },
          { japanese: '{田中|たなか}さんは{先生|せんせい}です。', romaji: 'Tanaka-san wa sensei desu.', translation: 'O Sr. Tanaka é professor.' },
        ],
      },
      {
        type: 'concept',
        sensei: 'A partícula が (ga) marca o SUJEITO — quem realiza a ação ou possui a qualidade:',
        japanese: '{猫|ねこ}がいます。',
        romaji: 'Neko ga imasu.',
        translation: 'Há um gato. / Um gato está aqui.',
        highlight: 'が',
        note: 'が enfatiza o elemento novo ou desconhecido da informação.',
      },
      {
        type: 'example',
        sensei: 'Mais exemplos com が:',
        examples: [
          { japanese: '{誰|だれ}が{来|き}ましたか？', romaji: 'Dare ga kimashita ka?', translation: 'Quem veio?' },
          { japanese: '{山田|やまだ}さんが{来|き}ました。', romaji: 'Yamada-san ga kimashita.', translation: 'Foi o Sr. Yamada que veio.' },
          { japanese: '{日本語|にほんご}が{好|す}きです。', romaji: 'Nihongo ga suki desu.', translation: 'Eu gosto de japonês.' },
        ],
      },
      {
        type: 'tip',
        sensei: 'Dica para nunca mais confundir は e が:',
        japanese: null,
        translation: null,
        note: 'は = "Sobre X, ..."\nが = "É X que..."\n\n猫は魚を食べます → "Sobre o gato, (ele) come peixe."\n猫が魚を食べます → "É o gato que come o peixe." (ênfase no gato)',
      },
    ],
    quiz: [
      {
        question: 'Complete: {私|わたし}____{学生|がくせい}です。("Eu sou estudante")',
        options: ['が', 'は', 'を', 'に'],
        correctIdx: 1,
        explanation: 'は marca o tópico da frase. "Eu" é o tópico sobre o qual dizemos "é estudante".',
      },
      {
        question: '【文の組み立て】"Como uma maçã" — qual a ordem correta?',
        options: ['りんごを{食|た}べます。', '{食|た}べますりんごを。', 'をりんご{食|た}べます。', 'りんご{食|た}べますを。'],
        correctIdx: 0,
        explanation: 'Objeto (を) + verbo. O verbo sempre no final da frase.',
      },
      {
        question: '"{日本語|にほんご}が{好|す}きです" significa:',
        options: ['Japonês é difícil', 'Eu falo japonês', 'Eu gosto de japonês', 'Estudo japonês'],
        correctIdx: 2,
        explanation: 'が好きです (ga suki desu) = "gostar de". が marca o sujeito/objeto do sentimento.',
      },
      {
        question: 'Qual partícula enfatiza QUEM fez algo?',
        options: ['は', 'を', 'が', 'で'],
        correctIdx: 2,
        explanation: 'が enfatiza o sujeito — especialmente em respostas a perguntas com {誰|だれ} (quem?).',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 3: Partículas を, に, で
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-particles-wo-ni-de',
    title: 'Partículas を, に e で',
    jlptLevel: 'N5',
    icon: '🗺️',
    description: 'Aprenda a indicar o objeto de uma ação, destino e lugar onde algo acontece.',
    slides: [
      {
        type: 'intro',
        sensei: 'を, に e で — com essas três você já monta um monte de frases! "Comi naquele restaurante", "vou de trem", "chego às 8". Coisa que você fala todo dia.',
        japanese: null,
        translation: null,
      },
      {
        type: 'concept',
        sensei: 'を (wo) marca o OBJETO DIRETO — o que a ação afeta:',
        japanese: 'りんごを{食|た}べます。',
        romaji: 'Ringo wo tabemasu.',
        translation: 'Como uma maçã.',
        highlight: 'を',
        note: 'を é escrito com o hiragana "wo" mas pronunciado como "o" na fala moderna.',
      },
      {
        type: 'concept',
        sensei: 'に (ni) indica DESTINO ou HORÁRIO:',
        japanese: '{学校|がっこう}に{行|い}きます。',
        romaji: 'Gakkou ni ikimasu.',
        translation: 'Vou para a escola.',
        highlight: 'に',
        note: 'に também marca horário: "3{時|じ}に{起|お}きます" = "Acordo às 3 horas."',
      },
      {
        type: 'concept',
        sensei: 'で (de) indica o LOCAL onde a ação acontece:',
        japanese: '{図書館|としょかん}で{勉強|べんきょう}します。',
        romaji: 'Toshokan de benkyou shimasu.',
        translation: 'Estudo na biblioteca.',
        highlight: 'で',
        note: 'で também indica o MEIO/INSTRUMENTO: "バスで{行|い}きます" = "Vou de ônibus."',
      },
      {
        type: 'table',
        sensei: 'Comparando に e で com locais:',
        rows: [
          ['{学校|がっこう}に{行|い}く', 'Ir para a escola (destino → に)'],
          ['{学校|がっこう}で{勉強|べんきょう}する', 'Estudar na escola (local de ação → で)'],
          ['{家|いえ}にいる', 'Estar em casa (existência → に)'],
          ['{家|いえ}で{食|た}べる', 'Comer em casa (ação → で)'],
        ],
      },
      {
        type: 'example',
        sensei: 'Frase completa usando as três partículas:',
        examples: [
          {
            japanese: '{私|わたし}は{毎日|まいにち}{学校|がっこう}でりんごを{食|た}べます。',
            romaji: 'Watashi wa mainichi gakkou de ringo wo tabemasu.',
            translation: 'Eu como uma maçã na escola todo dia.',
          },
        ],
      },
    ],
    quiz: [
      {
        question: 'Complete: "{公園|こうえん}___{遊|あそ}びます" ("Brinco no parque")',
        options: ['に', 'で', 'を', 'が'],
        correctIdx: 1,
        explanation: 'で indica o local onde a ação (brincar) acontece.',
      },
      {
        question: 'Complete: "{映画|えいが}___{見|み}ます" ("Assisto um filme")',
        options: ['に', 'で', 'を', 'は'],
        correctIdx: 2,
        explanation: 'を marca o objeto direto da ação — o filme é o que está sendo assistido.',
      },
      {
        question: '【文の組み立て】"Vou para a escola" — qual a ordem correta?',
        options: ['{私|わたし}は{学校|がっこう}に{行|い}きます。', '{学校|がっこう}は{私|わたし}に{行|い}きます。', '{私|わたし}は{行|い}きます{学校|がっこう}に。', '{学校|がっこう}に{私|わたし}は{行|い}きます。'],
        correctIdx: 0,
        explanation: 'Ordem: tópico (は) + destino (に) + verbo. O verbo sempre no final.',
      },
      {
        question: '"{東京|とうきょう}に{行|い}きます" significa:',
        options: ['Moro em Tóquio', 'Vou para Tóquio', 'Estudo em Tóquio', 'Saio de Tóquio'],
        correctIdx: 1,
        explanation: 'に + {行|い}く (ir) indica destino. "Vou para Tóquio."',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 4: Verbos no Presente
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-verbs-present',
    title: 'Verbos no Presente (ます)',
    jlptLevel: 'N5',
    icon: '🏃',
    description: 'Aprenda a conjugar verbos no presente formal usando a forma ます.',
    slides: [
      {
        type: 'intro',
        sensei: 'Verbos = o coração da frase! "Como", "vou", "vejo" — tudo termina em ます quando você fala de forma educada. É a primeira forma que todo mundo aprende e usa o tempo todo.',
        japanese: null,
        translation: null,
      },
      {
        type: 'concept',
        sensei: 'A forma ます é usada em situações formais e é a primeira que aprendemos:',
        japanese: '{食|た}べます',
        romaji: 'Tabemasu',
        translation: 'Comer (eu como / você come)',
        highlight: 'ます',
        note: 'Em japonês, o mesmo verbo serve para todas as pessoas. O contexto define quem age.',
      },
      {
        type: 'table',
        sensei: 'Verbos essenciais do N5 na forma ます:',
        rows: [
          ['{食|た}べます (tabemasu)', 'Comer'],
          ['{飲|の}みます (nomimasu)', 'Beber'],
          ['{行|い}きます (ikimasu)', 'Ir'],
          ['{来|き}ます (kimasu)', 'Vir'],
          ['{見|み}ます (mimasu)', 'Ver / Assistir'],
          ['{聞|き}きます (kikimasu)', 'Ouvir / Perguntar'],
          ['{話|はな}します (hanashimasu)', 'Falar'],
          ['{読|よ}みます (yomimasu)', 'Ler'],
          ['{書|か}きます (kakimasu)', 'Escrever'],
          ['します (shimasu)', 'Fazer'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Para fazer uma NEGATIVA, troque ます por ません:',
        japanese: '{食|た}べません。',
        romaji: 'Tabemasen.',
        translation: 'Não como.',
        highlight: 'ません',
        note: 'ます → ません\nImplica: "não faço" (presente/futuro negativo)',
      },
      {
        type: 'concept',
        sensei: 'Para fazer uma PERGUNTA, adicione か no final:',
        japanese: '{日本語|にほんご}を{話|はな}しますか？',
        romaji: 'Nihongo wo hanashimasu ka?',
        translation: 'Você fala japonês?',
        highlight: 'か',
        note: 'か no final transforma qualquer frase afirmativa em pergunta.',
      },
      {
        type: 'example',
        sensei: 'Veja um mini-diálogo:',
        examples: [
          { japanese: '{毎日|まいにち}{何|なに}を{食|た}べますか？', romaji: 'Mainichi nani wo tabemasu ka?', translation: 'O que você come todo dia?' },
          { japanese: 'ご{飯|はん}を{食|た}べます。', romaji: 'Gohan wo tabemasu.', translation: 'Como arroz.' },
          { japanese: 'お{肉|にく}は{食|た}べますか？', romaji: 'Oniku wa tabemasu ka?', translation: 'Você come carne?' },
          { japanese: 'いいえ、{食|た}べません。', romaji: 'Iie, tabemasen.', translation: 'Não, não como.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'Como se diz "Eu não bebo" em japonês?',
        options: ['{飲|の}みます', '{飲|の}みません', '{飲|の}みますか', '{飲|の}んでいます'],
        correctIdx: 1,
        explanation: 'Para negativa no presente formal, troca-se ます por ません.',
      },
      {
        question: 'O que adicionar ao final da frase para fazer uma pergunta formal?',
        options: ['は', 'が', 'か', 'ね'],
        correctIdx: 2,
        explanation: 'か no final transforma qualquer afirmação em pergunta.',
      },
      {
        question: '"{読|よ}みます" significa:',
        options: ['Escrever', 'Falar', 'Ler', 'Ouvir'],
        correctIdx: 2,
        explanation: '{読|よ}みます (yomimasu) = ler.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 5: Números e Contagem
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-numbers',
    title: 'Números de 1 a 100',
    jlptLevel: 'N5',
    icon: '🔢',
    description: 'Aprenda os números em japonês e como usá-los em frases simples.',
    slides: [
      {
        type: 'intro',
        sensei: 'Números são essenciais! Com eles você pode falar horas, preços, idades e muito mais. Vamos aprender de 1 a 100!',
        japanese: null,
        translation: null,
      },
      {
        type: 'table',
        sensei: 'Os números de 1 a 10:',
        rows: [
          ['１　{一|いち} (ichi)', 'Um'],
          ['２　{二|に} (ni)', 'Dois'],
          ['３　{三|さん} (san)', 'Três'],
          ['４　{四|し/よん} (shi/yon)', 'Quatro'],
          ['５　{五|ご} (go)', 'Cinco'],
          ['６　{六|ろく} (roku)', 'Seis'],
          ['７　{七|しち/なな} (shichi/nana)', 'Sete'],
          ['８　{八|はち} (hachi)', 'Oito'],
          ['９　{九|く/きゅう} (ku/kyuu)', 'Nove'],
          ['１０　{十|じゅう} (juu)', 'Dez'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Para formar dezenas, combine {十|じゅう} (juu) com os números:',
        japanese: '{十一|じゅういち}、{二十|にじゅう}、{三十五|さんじゅうご}',
        romaji: 'juuichi, nijuu, sanjuugo',
        translation: '11, 20, 35',
        highlight: '{十|じゅう}',
        note: '{二十|にじゅう} = 2×10\n{三十五|さんじゅうご} = 3×10 + 5\nCem = {百|ひゃく} (hyaku)',
      },
      {
        type: 'table',
        sensei: 'Marcadores de contagem (助数詞 — josūshi):',
        rows: [
          ['〜{歳|さい} (sai)', 'Anos de idade'],
          ['〜{時|じ} (ji)', 'Horas'],
          ['〜{分|ふん/ぷん} (fun/pun)', 'Minutos'],
          ['〜{円|えん} (en)', 'Ienes (¥)'],
          ['〜{個|こ} (ko)', 'Objetos pequenos'],
          ['〜{枚|まい} (mai)', 'Objetos planos (folhas, roupas)'],
          ['〜{本|ほん} (hon)', 'Objetos longos (canetas, garrafas)'],
        ],
      },
      {
        type: 'example',
        sensei: 'Usando números em frases:',
        examples: [
          { japanese: '{私|わたし}は{二十歳|はたち}です。', romaji: 'Watashi wa hatachi desu.', translation: 'Tenho 20 anos.' },
          { japanese: '{今|いま}、{三時|さんじ}です。', romaji: 'Ima, sanji desu.', translation: 'Agora são 3 horas.' },
          { japanese: 'これはいくらですか？', romaji: 'Kore wa ikura desu ka?', translation: 'Quanto custa isto?' },
          { japanese: '{五百円|ごひゃくえん}です。', romaji: 'Gohyaku en desu.', translation: 'São 500 ienes.' },
        ],
      },
      {
        type: 'tip',
        sensei: 'Cuidado com os números 4 e 7! Eles têm duas leituras:',
        japanese: '４ → し ou よん\n７ → しち ou なな',
        romaji: '4 → shi ou yon\n7 → shichi ou nana',
        translation: null,
        note: 'Em datas e horas use し e しち. Em quantidades comuns prefira よん e なな para evitar confusão com {死|し} (morte) e {苦|く} (sofrimento).',
      },
    ],
    quiz: [
      {
        question: 'Como se escreve "35" em kanji japonês?',
        options: ['{三四|さんし}', '{三十五|さんじゅうご}', '{五十三|ごじゅうさん}', '{十三五|じゅうさんご}'],
        correctIdx: 1,
        explanation: '{三十五|さんじゅうご} = san (3) + juu (10) + go (5) = 35.',
      },
      {
        question: 'Qual marcador usar para dizer a hora? "{三時|さんじ}"',
        options: ['〜{歳|さい}', '〜{分|ふん}', '〜{時|じ}', '〜{円|えん}'],
        correctIdx: 2,
        explanation: '{時|じ} (ji) é o marcador para horas. {三時|さんじ} = 3 horas.',
      },
      {
        question: 'Por que é preferível usar よん em vez de し para o número 4?',
        options: [
          'よん é mais curto',
          'し soa como 死 (morte) e pode ser considerado azarado',
          'し é muito difícil de pronunciar',
          'よん é a forma mais moderna',
        ],
        correctIdx: 1,
        explanation: 'し tem a mesma pronúncia que 死 (morte), então よん é preferido em contextos do dia a dia.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 6: Passado
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-past',
    title: 'Verbos no Passado (ました)',
    jlptLevel: 'N5',
    icon: '📅',
    description: 'Fale sobre o que fez ontem, na semana passada, nas férias.',
    slides: [
      { type: 'intro', sensei: 'Pra contar o que você fez ontem ou no fim de semana, precisa do passado! Em japonês é só trocar ます por ました. Simples assim!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Passado afirmativo: ます → ました',
        japanese: 'きのう{映画|えいが}を{見|み}ました。',
        romaji: 'Kinou eiga wo mimashita.',
        translation: 'Ontem assisti um filme.',
        highlight: 'ました',
        note: 'ました = fiz/fez. Serve pra qualquer pessoa.',
      },
      {
        type: 'concept',
        sensei: 'Passado negativo: ません → ませんでした',
        japanese: '{昨日|きのう}は{学校|がっこう}に{行|い}きませんでした。',
        romaji: 'Kinou wa gakkou ni ikimasen deshita.',
        translation: 'Ontem não fui à escola.',
        highlight: 'ませんでした',
        note: 'Não fiz = ませんでした.',
      },
      {
        type: 'table',
        sensei: 'Resumo do passado:',
        rows: [
          ['{食|た}べます', '{食|た}べました', 'Comeu'],
          ['{食|た}べません', '{食|た}べませんでした', 'Não comeu'],
          ['{行|い}きます', '{行|い}きました', 'Foi'],
          ['{来|き}ます', '{来|き}ました', 'Veio'],
        ],
      },
      {
        type: 'example',
        sensei: 'Frases do dia a dia:',
        examples: [
          { japanese: '{週末|しゅうまつ}、{何|なに}をしましたか？', romaji: 'Shuumatsu, nani wo shimashita ka?', translation: 'O que você fez no fim de semana?' },
          { japanese: 'ともだちと{食|た}べに{行|い}きました。', romaji: 'Tomodachi to tabe ni ikimashita.', translation: 'Fui comer com um amigo.' },
          { japanese: 'おいしかったです。', romaji: 'Oishikatta desu.', translation: 'Estava gostoso. (passado do adjetivo)' },
        ],
      },
    ],
    quiz: [
      { question: 'Como se forma o passado de ます?', options: ['ますた', 'ました', 'ますでした', 'ません'], correctIdx: 1, explanation: 'ます → ました (passado afirmativo).' },
      { question: 'Não fui =', options: ['{行|い}きません', '{行|い}きませんでした', '{行|い}きました', '{行|い}くません'], correctIdx: 1, explanation: 'Passado negativo: ませんでした.' },
      { question: 'おいしかった é o passado de qual adjetivo?', options: ['{寒|さむ}い', 'おいしい', '{元気|げんき}', 'きれい'], correctIdx: 1, explanation: 'おいしい → おいしかった (passado do adjetivo い).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 7: Existência (いる / ある)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-existence',
    title: 'Existência: いる e ある',
    jlptLevel: 'N5',
    icon: '📍',
    description: 'Diga onde estão pessoas e coisas.',
    slides: [
      { type: 'intro', sensei: 'Em japonês tem dois verbos de "existir": いる pra gente e bicho, ある pra coisa. Tipo "tem um gato" ou "tem uma mesa".', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'いる (imasu) = existir (pessoas e animais):',
        japanese: '{猫|ねこ}がいます。',
        romaji: 'Neko ga imasu.',
        translation: 'Tem um gato. / Há um gato.',
        highlight: 'います',
        note: 'います = forma ます de いる. Usa が antes.',
      },
      {
        type: 'concept',
        sensei: 'ある (arimasu) = existir (coisas inanimadas):',
        japanese: '{机|つくえ}があります。',
        romaji: 'Tsukue ga arimasu.',
        translation: 'Tem uma mesa. / Há uma mesa.',
        highlight: 'あります',
        note: 'あります = forma ます de ある. Pra objetos, plantas, lugares.',
      },
      {
        type: 'concept',
        sensei: 'Com に indica ONDE:',
        japanese: '{部屋|へや}に{猫|ねこ}がいます。',
        romaji: 'Heya ni neko ga imasu.',
        translation: 'Tem um gato no quarto.',
        highlight: 'に',
        note: 'Lugar + に + coisa/pessoa + が + いる/ある.',
      },
      {
        type: 'example',
        sensei: 'No cotidiano:',
        examples: [
          { japanese: 'トイレはどこにありますか？', romaji: 'Toire wa doko ni arimasu ka?', translation: 'Onde fica o banheiro?' },
          { japanese: 'あそこにあります。', romaji: 'Asoko ni arimasu.', translation: 'Fica ali.' },
          { japanese: '{先生|せんせい}は{教室|きょうしつ}にいますか？', romaji: 'Sensei wa kyoushitsu ni imasu ka?', translation: 'O professor está na sala?' },
        ],
      },
    ],
    quiz: [
      { question: 'Qual verbo usar para "tem um cachorro"?', options: ['ある', 'いる', 'する', '{行|い}く'], correctIdx: 1, explanation: 'いる = existir (animais e pessoas).' },
      { question: 'Qual verbo usar para "tem uma cadeira"?', options: ['いる', 'ある', 'する', '{来|き}る'], correctIdx: 1, explanation: 'ある = existir (coisas inanimadas).' },
      { question: '{部屋|へや}に{猫|ねこ}がいます significa:', options: ['O gato saiu do quarto', 'Tem um gato no quarto', 'O quarto é do gato', 'O gato quer o quarto'], correctIdx: 1, explanation: 'に indica lugar. います = existe (animal).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 8: Comida e Bebidas
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-food',
    title: 'Comida e Bebidas',
    jlptLevel: 'N5',
    icon: '🍜',
    description: 'Vocabulário essencial pra pedir no restaurante e no konbini.',
    slides: [
      { type: 'intro', sensei: 'Comprar no konbini, pedir no restaurante, falar do almoço... Tudo isso exige vocabulário de comida. Vamos lá!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Comidas básicas:',
        rows: [
          ['ご{飯|はん} (gohan)', 'Arroz / refeição'],
          ['{肉|にく} (niku)', 'Carne'],
          ['{魚|さかな} (sakana)', 'Peixe'],
          ['{野菜|やさい} (yasai)', 'Legumes'],
          ['{卵|たまご} (tamago)', 'Ovo'],
          ['{寿司|すし} (sushi)', 'Sushi'],
          ['{麺|めん} (men)', 'Macarrão'],
          ['{味噌|みそ}汁 (misoshiru)', 'Sopa de missô'],
        ],
      },
      {
        type: 'table',
        sensei: 'Bebidas e verbos:',
        rows: [
          ['{水|みず} (mizu)', 'Água'],
          ['{茶|ちゃ} (cha)', 'Chá'],
          ['{牛乳|ぎゅうにゅう} (gyuunyuu)', 'Leite'],
          ['{食|た}べます', 'Comer'],
          ['{飲|の}みます', 'Beber'],
          ['おいしい', 'Gostoso'],
        ],
      },
      {
        type: 'example',
        sensei: 'No restaurante:',
        examples: [
          { japanese: 'これをください。', romaji: 'Kore wo kudasai.', translation: 'Quero este, por favor.' },
          { japanese: '{水|みず}を{一|ひと}つください。', romaji: 'Mizu wo hitotsu kudasai.', translation: 'Uma água, por favor.' },
          { japanese: 'おいしいですね。', romaji: 'Oishii desu ne.', translation: 'Tá gostoso, né?' },
          { japanese: 'ごちそうさまでした。', romaji: 'Gochisousama deshita.', translation: 'Obrigado pela refeição. (diz no final)' },
        ],
      },
    ],
    quiz: [
      { question: 'ご{飯|はん} significa:', options: ['Café', 'Arroz / refeição', 'Sobremesa', 'Carne'], correctIdx: 1, explanation: 'ご{飯|はん} = arroz ou refeição em geral.' },
      { question: 'Como pedir "uma água" educadamente?', options: ['{水|みず}だ', '{水|みず}をください', '{水|みず}ある', '{水|みず}です'], correctIdx: 1, explanation: '〜をください = quero ~, por favor.' },
      { question: 'O que dizer ao terminar de comer?', options: ['いただきます', 'ごちそうさまでした', 'おはよう', 'さようなら'], correctIdx: 1, explanation: 'ごちそうさまでした = obrigado pela refeição.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 9: Família
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-family',
    title: 'Família',
    jlptLevel: 'N5',
    icon: '👨‍👩‍👧‍👦',
    description: 'Aprenda a falar de pai, mãe, irmãos e parentes.',
    slides: [
      { type: 'intro', sensei: 'Falar da família é super comum. No japonês tem uma diferença: quando fala da SUA família usa um termo, quando fala da família do OUTRO usa outro (mais respeitoso).', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Minha família (humilde) vs família do outro (respeitoso):',
        rows: [
          ['{父|ちち} (chichi)', '{お父|とう}さん (otousan)', 'Pai'],
          ['{母|はは} (haha)', '{お母|かあ}さん (okaasan)', 'Mãe'],
          ['{兄|あに} (ani)', '{お兄|にい}さん (oniisan)', 'Irmão mais velho'],
          ['{姉|あね} (ane)', '{お姉|ねえ}さん (oneesan)', 'Irmã mais velha'],
          ['{弟|おとうと} (otouto)', '{弟|おとうと}さん', 'Irmão mais novo'],
          ['{妹|いもうと} (imouto)', '{妹|いもうと}さん', 'Irmã mais nova'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Para falar da SUA família, use os termos humildes:',
        japanese: '{私|わたし}の{父|ちち}は{医者|いしゃ}です。',
        romaji: 'Watashi no chichi wa isha desu.',
        translation: 'Meu pai é médico.',
        highlight: '{父|ちち}',
        note: 'ちち e はは são só pra SUA família. Nunca use pro pai/mãe dos outros!',
      },
      {
        type: 'example',
        sensei: 'Frases úteis:',
        examples: [
          { japanese: '{家族|かぞく}は{何人|なんにん}ですか？', romaji: 'Kazoku wa nannin desu ka?', translation: 'Quantas pessoas na sua família?' },
          { japanese: '{四|よ}人です。', romaji: 'Yonin desu.', translation: 'São quatro.' },
          { japanese: '{兄弟|きょうだい}がいますか？', romaji: 'Kyoudai ga imasu ka?', translation: 'Você tem irmãos?' },
        ],
      },
    ],
    quiz: [
      { question: 'Como chamar o pai de outra pessoa?', options: ['{父|ちち}', '{母|はは}', '{お父|とう}さん', '{弟|おとうと}'], correctIdx: 2, explanation: '{お父|とう}さん = pai (respeitoso, pra família dos outros).' },
      { question: '{私|わたし}の{母|はは} significa:', options: ['Sua mãe', 'Minha mãe', 'A mãe dele', 'Nossa mãe'], correctIdx: 1, explanation: '{私|わたし}の = meu/minha. {母|はは} = minha mãe.' },
      { question: '{兄弟|きょうだい}がいます significa:', options: ['Não tenho irmãos', 'Tenho irmãos', 'Meus irmãos saíram', 'Quantos irmãos?'], correctIdx: 1, explanation: '{兄弟|きょうだい} = irmãos. います = existem (pessoas).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 10: Direções e Transporte
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-directions',
    title: 'Direções e Transporte',
    jlptLevel: 'N5',
    icon: '🚃',
    description: 'Pergunte o caminho e use o transporte público.',
    slides: [
      { type: 'intro', sensei: 'No Japão você vai andar de trem, metrô, ônibus... E vai precisar perguntar o caminho. Essas palavras vão salvar você!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Direções:',
        rows: [
          ['{右|みぎ} (migi)', 'Direita'],
          ['{左|ひだり} (hidari)', 'Esquerda'],
          ['{前|まえ} (mae)', 'Frente'],
          ['{後|うしろ} (ushiro)', 'Trás'],
          ['{上|うえ} (ue)', 'Em cima'],
          ['{下|した} (shita)', 'Em baixo'],
          ['{隣|となり} (tonari)', 'Lado'],
          ['{中|なか} (naka)', 'Dentro'],
        ],
      },
      {
        type: 'table',
        sensei: 'Transporte:',
        rows: [
          ['{電車|でんしゃ} (densha)', 'Trem'],
          ['{地下鉄|ちかてつ} (chikatetsu)', 'Metrô'],
          ['バス (basu)', 'Ônibus'],
          ['{駅|えき} (eki)', 'Estação'],
          ['{切符|きっぷ} (kippu)', 'Bilhete'],
          ['{乗|の}り{換|か}え (norikae)', 'Baldeação'],
        ],
      },
      {
        type: 'example',
        sensei: 'Perguntando o caminho:',
        examples: [
          { japanese: '{駅|えき}はどこですか？', romaji: 'Eki wa doko desu ka?', translation: 'Onde fica a estação?' },
          { japanese: 'まっすぐ{行|い}って、{右|みぎ}です。', romaji: 'Massugu itte, migi desu.', translation: 'Siga em frente e vire à direita.' },
          { japanese: 'この{電車|でんしゃ}は{東京|とうきょう}に{行|い}きますか？', romaji: 'Kono densha wa Toukyou ni ikimasu ka?', translation: 'Este trem vai para Tóquio?' },
        ],
      },
    ],
    quiz: [
      { question: '{右|みぎ} significa:', options: ['Esquerda', 'Direita', 'Frente', 'Trás'], correctIdx: 1, explanation: '{右|みぎ} (migi) = direita.' },
      { question: '{駅|えき} significa:', options: ['Trem', 'Estação', 'Bilhete', 'Metrô'], correctIdx: 1, explanation: '{駅|えき} (eki) = estação.' },
      { question: 'まっすぐ{行|い}って significa:', options: ['Vire à esquerda', 'Volte', 'Siga em frente', 'Pare'], correctIdx: 2, explanation: 'まっすぐ = em frente. {行|い}って = vá.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 11: Quero fazer (たい) e Pedidos (てください)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-tai-kudasai',
    title: 'Quero Fazer (たい) e Pedidos (てください)',
    jlptLevel: 'N5',
    icon: '🙏',
    description: 'Diga o que quer fazer e peça favores de forma educada.',
    slides: [
      { type: 'intro', sensei: 'Quero comer sushi. Pode fechar a janela? Essas frases usam たい (querer fazer) e てください (por favor faça). Super úteis!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'たい = quero fazer (forma ます sem ます + たい):',
        japanese: '{寿司|すし}が{食|た}べたいです。',
        romaji: 'Sushi ga tabetai desu.',
        translation: 'Quero comer sushi.',
        highlight: 'たい',
        note: '{食|た}べます → {食|た}べ + たい. O objeto pode ser が ou を.',
      },
      {
        type: 'concept',
        sensei: 'てください = por favor faça:',
        japanese: 'ドアを{閉|し}めてください。',
        romaji: 'Doa wo shimete kudasai.',
        translation: 'Por favor feche a porta.',
        highlight: 'てください',
        note: 'Forma て + ください. Educado e direto.',
      },
      {
        type: 'example',
        sensei: 'No dia a dia:',
        examples: [
          { japanese: '{水|みず}を{飲|の}みたいです。', romaji: 'Mizu wo nomitai desu.', translation: 'Quero beber água.' },
          { japanese: 'ちょっと{待|ま}ってください。', romaji: 'Chotto matte kudasai.', translation: 'Por favor espere um pouco.' },
          { japanese: '{写真|しゃしん}を{撮|と}ってもいいですか？', romaji: 'Shashin wo totte mo ii desu ka?', translation: 'Posso tirar uma foto?' },
        ],
      },
    ],
    quiz: [
      { question: 'たい indica:', options: ['Passado', 'Quero fazer', 'Proibido', 'Obrigatório'], correctIdx: 1, explanation: 'たい = quero fazer.' },
      { question: 'てください significa:', options: ['Não faça', 'Por favor faça', 'Já fiz', 'Vou fazer'], correctIdx: 1, explanation: 'てください = por favor faça.' },
      { question: '{水|みず}を{飲|の}みたい =', options: ['Bebi água', 'Quero beber água', 'Não bebo água', 'Água é boa'], correctIdx: 1, explanation: '{飲|の}みたい = quero beber.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 12: Convites (ましょう) e ませんか
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-invitations',
    title: 'Convites: ましょう e ませんか',
    jlptLevel: 'N5',
    icon: '🎉',
    description: 'Convide alguém: "Vamos?" "Que tal?"',
    slides: [
      { type: 'intro', sensei: 'Vamos tomar um café? Que tal almoçar? Em japonês usa ましょう (vamos) e ませんか (que tal?). Bem natural!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ましょう = vamos (forma ます sem ます + ましょう):',
        japanese: 'いっしょに{食|た}べましょう。',
        romaji: 'Issho ni tabemashou.',
        translation: 'Vamos comer juntos.',
        highlight: 'ましょう',
        note: 'Convite direto. "Vamos fazer X".',
      },
      {
        type: 'concept',
        sensei: 'ませんか = que tal? (mais suave, pergunta):',
        japanese: 'コーヒーを{飲|の}みませんか？',
        romaji: 'Koohii wo nomimasen ka?',
        translation: 'Que tal tomar um café?',
        highlight: 'ませんか',
        note: 'Parece negativo mas é convite! "Você não tomaria café?" = que tal?',
      },
      {
        type: 'example',
        sensei: 'Respostas:',
        examples: [
          { japanese: 'いいですね。{行|い}きましょう。', romaji: 'Ii desu ne. Ikimashou.', translation: 'Boa ideia! Vamos.' },
          { japanese: 'すみません、ちょっと…', romaji: 'Sumimasen, chotto…', translation: 'Desculpa, não dá pra mim…' },
          { japanese: 'また今度。', romaji: 'Mata kondo.', translation: 'Deixa pra próxima.' },
        ],
      },
    ],
    quiz: [
      { question: 'ましょう significa:', options: ['Não vamos', 'Vamos', 'Já fomos', 'Talvez'], correctIdx: 1, explanation: 'ましょう = vamos (convite).' },
      { question: 'ませんか em convite significa:', options: ['Proibido', 'Que tal?', 'Não', 'Obrigatório'], correctIdx: 1, explanation: 'ませんか = que tal? (convite suave).' },
      { question: 'また今度 =', options: ['Agora', 'Nunca', 'Deixa pra próxima', 'Sempre'], correctIdx: 2, explanation: 'また今度 = outra hora, deixa pra próxima.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 13: です — Negativo e Passado
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-desu-negative-past',
    title: 'です — Negativo e Passado',
    jlptLevel: 'N5',
    icon: '📝',
    description: 'Não sou. Era. Não era. Conjugação completa de です.',
    slides: [
      { type: 'intro', sensei: '"Não sou estudante." "Ontem choveu." です tem negativo (じゃない) e passado (でした). Qualquer frase com substantivo ou な-adjetivo usa isso!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Conjugação completa de です:',
        rows: [
          ['です', 'É, sou (presente afirmativo)'],
          ['じゃない / ではない', 'Não é (presente negativo)'],
          ['でした', 'Era, foi (passado afirmativo)'],
          ['じゃなかった / ではなかった', 'Não era (passado negativo)'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Exemplos com substantivos:',
        japanese: '{学生|がくせい}です。 / {学生|がくせい}じゃないです。\n{学生|がくせい}でした。 / {学生|がくせい}じゃなかったです。',
        romaji: 'Gakusei desu. / Gakusei ja nai desu. Gakusei deshita. / Gakusei ja nakatta desu.',
        translation: 'Sou estudante. / Não sou estudante. Era estudante. / Não era estudante.',
        highlight: 'じゃない / でした',
        note: 'ではない é mais formal que じゃない. じゃない é comum na fala.',
      },
      {
        type: 'example',
        sensei: 'No exame:',
        examples: [
          { japanese: 'きのうは{雨|あめ}でした。', romaji: 'Kinou wa ame deshita.', translation: 'Ontem choveu.' },
          { japanese: 'これは{私|わたし}のじゃありません。', romaji: 'Kore wa watashi no ja arimasen.', translation: 'Isto não é meu.' },
        ],
      },
    ],
    quiz: [
      { question: 'Negativo de です:', options: ['ですない', 'じゃない', 'でした', 'ですた'], correctIdx: 1, explanation: 'です neg = じゃない/ではない.' },
      { question: 'Passado de です:', options: ['ですた', 'でした', 'ですだった', 'じゃないた'], correctIdx: 1, explanation: 'です passado = でした.' },
      { question: 'きのうは{雨|あめ}でした =', options: ['Amanhã vai chover', 'Ontem choveu', 'Hoje chove', 'Nunca chove'], correctIdx: 1, explanation: 'でした = era, foi (passado).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 14: Partículas へ, と, も
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-particles-he-to-mo',
    title: 'Partículas へ, と e も',
    jlptLevel: 'N5',
    icon: '➡️',
    description: 'Direção (へ), com/and (と), também (も). Essenciais pro JLPT N5!',
    slides: [
      { type: 'intro', sensei: 'へ = pra onde. と = com quem. も = também. "Vou pro Japão", "fui com meu amigo", "eu também quero" — frases que você vai soltar o tempo todo!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'へ (e) = direção, destino (similar a に):',
        japanese: '{日本|にほん}へ{行|い}きます。',
        romaji: 'Nihon e ikimasu.',
        translation: 'Vou ao Japão.',
        highlight: 'へ',
        note: 'へ se lê "e". に e へ são trocáveis pra destino, mas へ enfatiza o movimento.',
      },
      {
        type: 'concept',
        sensei: 'と (to) = com, e (lista completa):',
        japanese: 'ともだちと{映画|えいが}を{見|み}ます。',
        romaji: 'Tomodachi to eiga wo mimasu.',
        translation: 'Assisto filme com um amigo.',
        highlight: 'と',
        note: 'と = "com" alguém. Também: AとB = A e B (lista completa).',
      },
      {
        type: 'concept',
        sensei: 'も (mo) = também, nem (com negativo):',
        japanese: '{私|わたし}も{学生|がくせい}です。\n{彼|かれ}も{来|こ}ません。',
        romaji: 'Watashi mo gakusei desu. Kare mo kimasen.',
        translation: 'Eu também sou estudante. Ele também não vem.',
        highlight: 'も',
        note: 'も substitui は/が. Com negativo = "nem... também não".',
      },
      {
        type: 'example',
        sensei: 'Situações reais: no konbini pedindo café também, no trem indo pro trabalho, falando da família...',
        examples: [
          { japanese: '{駅|えき}へ{歩|ある}いて{行|い}きます。', romaji: 'Eki e aruite ikimasu.', translation: 'Vou a pé até a estação.' },
          { japanese: '{父|ちち}と{母|はは}と{兄|あに}がいます。', romaji: 'Chichi to haha to ani ga imasu.', translation: 'Tenho pai, mãe e irmão mais velho.' },
          { japanese: 'コーヒーもください。', romaji: 'Koohii mo kudasai.', translation: 'Quero café também.' },
        ],
      },
    ],
    quiz: [
      { question: 'へ indica:', options: ['Objeto', 'Direção/destino', 'Tempo', 'Causa'], correctIdx: 1, explanation: 'へ = direção, para onde.' },
      { question: 'ともだちと =', options: ['Amigo de', 'Com amigo', 'Para amigo', 'Sem amigo'], correctIdx: 1, explanation: 'と = com.' },
      { question: '{私|わたし}も =', options: ['Só eu', 'Eu também', 'Nem eu', 'Sem mim'], correctIdx: 1, explanation: 'も = também.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 15: Adjetivos — Negativo e Passado
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-adjectives-negative-past',
    title: 'Adjetivos — Negativo e Passado',
    jlptLevel: 'N5',
    icon: '📐',
    description: 'Não é grande. Era barato. Formas negativa e passada dos adjetivos.',
    slides: [
      { type: 'intro', sensei: '"Não era caro", "não tá gostoso", "era grande" — pra falar assim você precisa do negativo e do passado dos adjetivos. As regras são diferentes pra い e な, mas são fáceis!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Adjetivos い — negativo: い → く + ない',
        japanese: '{大|おお}きい → {大|おお}きくない\n{高|たか}い → {高|たか}くない',
        romaji: 'ookii → ookiku nai, takai → takaku nai',
        translation: 'Grande → não é grande. Alto → não é alto.',
        highlight: 'くない',
        note: 'Tira o い, põe く, depois ない.',
      },
      {
        type: 'concept',
        sensei: 'Adjetivos い — passado: い → かった',
        japanese: '{大|おお}きい → {大|おお}きかった\n{高|たか}い → {高|たか}かった',
        romaji: 'ookii → ookikatta, takai → takakatta',
        translation: 'Era grande. Era alto.',
        highlight: 'かった',
        note: 'Passado negativo: く + なかった (大きくなかった).',
      },
      {
        type: 'concept',
        sensei: 'Adjetivos な — negativo: じゃない. Passado: だった. Passado neg: じゃなかった',
        japanese: '{静|しず}かじゃない / {静|しず}かだった / {静|しず}かじゃなかった',
        romaji: 'shizuka ja nai / shizuka datta / shizuka ja nakatta',
        translation: 'Não é silencioso / Era silencioso / Não era silencioso',
        highlight: 'じゃない / だった',
        note: 'です → だ (casual). でした → だった. じゃないです → じゃなかった.',
      },
      {
        type: 'table',
        sensei: 'Resumo completo:',
        rows: [
          ['い: おいしい', 'おいしくない / おいしかった / おいしくなかった'],
          ['な: きれい', 'きれいじゃない / きれいだった / きれいじゃなかった'],
        ],
      },
    ],
    quiz: [
      { question: 'Negativo de {高|たか}い:', options: ['{高|たか}いない', '{高|たか}くない', '{高|たか}かった', '{高|たか}くなく'], correctIdx: 1, explanation: 'い → くない.' },
      { question: 'Passado de おいしい:', options: ['おいしいかった', 'おいしかった', 'おいしくた', 'おいしいだった'], correctIdx: 1, explanation: 'い → かった.' },
      { question: 'Negativo passado de {静|しず}か:', options: ['{静|しず}かくない', '{静|しず}かじゃない', '{静|しず}かじゃなかった', '{静|しず}かだった'], correctIdx: 2, explanation: 'な-adj passado neg: じゃなかった.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 16: てから e ても — Depois de / Mesmo que
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-te-kara-mo',
    title: 'てから e ても — Depois de / Mesmo que',
    jlptLevel: 'N5',
    icon: '⏱️',
    description: 'Depois de comer. Mesmo que chova. Essenciais pro N5!',
    slides: [
      { type: 'intro', sensei: '"Vou depois de comer." "Mesmo que chova, vou." Essas duas frases usam てから e ても — super comuns no dia a dia e no exame!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'てから = depois de (ação 1, depois ação 2):',
        japanese: '{食|た}べてから{行|い}きます。',
        romaji: 'Tabete kara ikimasu.',
        translation: 'Vou depois de comer.',
        highlight: 'てから',
        note: 'Ordem: primeiro comer, depois ir. Forma て + から.',
      },
      {
        type: 'concept',
        sensei: 'ても / でも = mesmo que, mesmo se:',
        japanese: '{雨|あめ}でも{行|い}きます。\n{高|たか}くても{買|か}います。',
        romaji: 'Ame demo ikimasu. Takakute mo kaimasu.',
        translation: 'Vou mesmo que chova. Compro mesmo que seja caro.',
        highlight: 'ても',
        note: 'Verbo: て + も. Adjetivo い: く + ても. Adjetivo な/名詞: でも.',
      },
      {
        type: 'example',
        sensei: 'Frases que você vai usar: combinando com amigos, pedindo pro colega te avisar...',
        examples: [
          { japanese: '{仕事|しごと}が{終|お}わってから、{飲|の}みに{行|い}きましょう。', romaji: 'Shigoto ga owatte kara, nomi ni ikimashou.', translation: 'Depois que o trabalho acabar, vamos tomar um drink.' },
          { japanese: '{忙|いそが}しくても、{連絡|れんらく}してください。', romaji: 'Isogashikute mo, renraku shite kudasai.', translation: 'Mesmo que esteja ocupado, me avise.' },
        ],
      },
      {
        type: 'tip',
        sensei: 'Dica: てから e ても aparecem o tempo todo em conversa. "Depois que chegar, me manda mensagem" = {着|つ}いてから{連絡|れんらく}してね。',
        japanese: null,
        translation: null,
        note: 'Quanto mais você praticar, mais natural fica!',
      },
    ],
    quiz: [
      { question: 'てから indica:', options: ['Antes de', 'Durante', 'Depois de', 'Em vez de'], correctIdx: 2, explanation: 'てから = depois de fazer.' },
      { question: '{雨|あめ}でも{行|い}く =', options: ['Não vou por causa da chuva', 'Vou mesmo que chova', 'Vou quando chover', 'Choveu e fui'], correctIdx: 1, explanation: 'でも = mesmo que.' },
      { question: 'Adjetivo い + ても: {高|たか}く___', options: ['ても', 'でも', 'て', 'たって'], correctIdx: 0, explanation: 'い-adj: く + ても. {高|たか}い → {高|たか}くても.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 17: 欲しい e たくない — Quero coisa / Não quero fazer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-hoshii-takunai',
    title: '欲しい e たくない',
    jlptLevel: 'N5',
    icon: '🎁',
    description: 'Quero um carro. Não quero ir. Diferença entre たい e 欲しい.',
    slides: [
      { type: 'intro', sensei: 'Quero um celular novo (coisa) vs quero comer sushi (ação). Em japonês são estruturas diferentes! 欲しい = coisa. たい = fazer. たくない = não quero fazer.', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: '欲しい = quero (objeto, coisa):',
        japanese: '{車|くるま}が{欲|ほ}しいです。',
        romaji: 'Kuruma ga hoshii desu.',
        translation: 'Quero um carro.',
        highlight: 'が{欲|ほ}しい',
        note: 'Objeto + が + 欲しい. 欲しい é adjetivo い!',
      },
      {
        type: 'concept',
        sensei: 'たくない = não quero fazer (negativo de たい):',
        japanese: '{食|た}べたくないです。',
        romaji: 'Tabetakunai desu.',
        translation: 'Não quero comer.',
        highlight: 'たくない',
        note: 'たい → たくない. Forma ます sem ます + たい/たくない.',
      },
      {
        type: 'table',
        sensei: 'Resumo:',
        rows: [
          ['{食|た}べたい', 'Quero comer (ação)'],
          ['{食|た}べたくない', 'Não quero comer'],
          ['{車|くるま}が{欲|ほ}しい', 'Quero carro (coisa)'],
          ['{欲|ほ}しくない', 'Não quero (coisa)'],
        ],
      },
    ],
    quiz: [
      { question: '欲しい usa com:', options: ['Ação (verbo)', 'Objeto (coisa)', 'Lugar', 'Tempo'], correctIdx: 1, explanation: '欲しい = quero ter (coisa).' },
      { question: 'Não quero ir =', options: ['{行|い}きたい', '{行|い}きたくない', '{行|い}く欲しい', '{行|い}かない'], correctIdx: 1, explanation: 'たい neg = たくない.' },
      { question: '{新|あたら}しい{携帯|けいたい}が{欲|ほ}しい =', options: ['Tenho celular novo', 'Quero um celular novo', 'Não quero celular', 'Celular é novo'], correctIdx: 1, explanation: 'が欲しい = quero (coisa).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 18: 上手、下手、分かる、要る
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-jouzu-heta-wakaru',
    title: '上手、下手、分かる、要る',
    jlptLevel: 'N5',
    icon: '🎯',
    description: 'Bom em, ruim em, entender, precisar. Padrão が + adjetivo/verbo.',
    slides: [
      { type: 'intro', sensei: '"Sou bom em cozinhar." "Não entendo essa palavra." "Preciso de dinheiro." — 上手、下手、分かる、要る. Tudo usa が antes do que você está falando. Padrão fixo!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Padrão Xが + habilidade/necessidade:',
        rows: [
          ['{上手|じょうず} (jouzu)', 'Bom em'],
          ['{下手|へた} (heta)', 'Ruim em'],
          ['{分|わ}かる (wakaru)', 'Entender'],
          ['{要|い}る (iru)', 'Precisar'],
          ['{好|す}き (suki)', 'Gostar de'],
          ['{嫌|きら}い (kirai)', 'Não gostar de'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Exemplos:',
        japanese: '{日本語|にほんご}が{分|わ}かります。\n{料理|りょうり}が{上手|じょうず}です。\nお{金|かね}が{要|い}ります。',
        romaji: 'Nihongo ga wakarimasu. Ryouri ga jouzu desu. Okane ga irimasu.',
        translation: 'Entendo japonês. Sou bom em cozinhar. Preciso de dinheiro.',
        highlight: 'が',
        note: 'Cuidado: 要る (precisar) ≠ いる (existir). Escrita diferente!',
      },
      {
        type: 'example',
        sensei: 'No exame:',
        examples: [
          { japanese: '{彼|かれ}は{歌|うた}が{下手|へた}です。', romaji: 'Kare wa uta ga heta desu.', translation: 'Ele canta mal.' },
          { japanese: 'この{言葉|ことば}の{意味|いみ}が{分|わ}かりません。', romaji: 'Kono kotoba no imi ga wakarimasen.', translation: 'Não entendo o significado desta palavra.' },
        ],
      },
    ],
    quiz: [
      { question: '{上手|じょうず} significa:', options: ['Ruim em', 'Bom em', 'Gostar de', 'Precisar'], correctIdx: 1, explanation: '{上手|じょうず} = bom em.' },
      { question: '{要|い}る significa:', options: ['Existir', 'Precisar', 'Ir', 'Vir'], correctIdx: 1, explanation: '{要|い}る = precisar (de algo).' },
      { question: 'Xが{分|わ}かる =', options: ['X entende', 'Entendo X', 'X não sabe', 'Não entendo'], correctIdx: 1, explanation: 'が marca o que se entende. "Entendo X".' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 19: から e まで — De até (tempo e lugar)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-kara-made',
    title: 'から e まで — De até',
    jlptLevel: 'N5',
    icon: '⏰',
    description: 'Das 9 às 5. De Tóquio até Osaka. Essencial pro N5!',
    slides: [
      { type: 'intro', sensei: '"Trabalho das 9 às 5." "De Tóquio até Osaka." から = de. まで = até. Funciona pra horário, data e lugar. Você vai usar toda hora!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'から = de, desde (ponto de partida):',
        japanese: '9{時|じ}から5{時|じ}まで{働|はたら}きます。',
        romaji: 'Kuji kara goji made hatarakimasu.',
        translation: 'Trabalho das 9 às 5.',
        highlight: 'から',
        note: 'から também = porque (ex: 暑いから). Contexto define.',
      },
      {
        type: 'concept',
        sensei: 'まで = até (ponto de chegada):',
        japanese: '{東京|とうきょう}から{大阪|おおさか}まで{新幹線|しんかんせん}で{行|い}きます。',
        romaji: 'Toukyou kara Oosaka made shinkansen de ikimasu.',
        translation: 'Vou de Tóquio até Osaka de shinkansen.',
        highlight: 'まで',
        note: 'から〜まで = de... até... (intervalo completo).',
      },
      {
        type: 'example',
        sensei: 'Frases comuns:',
        examples: [
          { japanese: '{何時|なんじ}から{何時|なんじ}までですか？', romaji: 'Nanji kara nanji made desu ka?', translation: 'De que horas até que horas?' },
          { japanese: '月曜日から金曜日まで{学校|がっこう}です。', romaji: 'Getsuyoubi kara kinyoubi made gakkou desu.', translation: 'Tenho escola de segunda a sexta.' },
        ],
      },
    ],
    quiz: [
      { question: 'から indica:', options: ['Até', 'De/desde', 'Durante', 'Antes'], correctIdx: 1, explanation: 'から = de, ponto de partida.' },
      { question: '9時から5時まで =', options: ['Às 9 e às 5', 'Das 9 às 5', 'Antes das 9', 'Depois das 5'], correctIdx: 1, explanation: 'から〜まで = de... até...' },
      { question: 'から também pode significar:', options: ['E', 'Porque', 'Ou', 'Mas'], correctIdx: 1, explanation: 'から = porque (ex: 暑いから窓を開ける).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 20: 前に e 後で — Antes de / Depois de
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-mae-ato',
    title: '前に e 後で — Antes de / Depois de',
    jlptLevel: 'N5',
    icon: '📅',
    description: 'Antes de dormir. Depois de comer. Ordem de ações.',
    slides: [
      { type: 'intro', sensei: '"Escovo os dentes antes de dormir." "Descanso depois de comer." 前に e 後で — a pegadinha é que 前に usa verbo no presente e 後で no passado! Parece estranho mas é assim.', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: '前に = antes de (verbo em forma DICIONAL, não passado!):',
        japanese: '{寝|ね}る{前|まえ}に{歯|は}を{磨|みが}きます。',
        romaji: 'Neru mae ni ha wo migakimasu.',
        translation: 'Escovo os dentes antes de dormir.',
        highlight: '前に',
        note: 'Ação principal + 前に + ação que faz antes. Verbo antes de 前に = dicional (る).',
      },
      {
        type: 'concept',
        sensei: '後で = depois de (verbo em forma た):',
        japanese: '{食|た}べた{後|あと}で{休|やす}みます。',
        romaji: 'Tabeta ato de yasumimasu.',
        translation: 'Descanso depois de comer.',
        highlight: '後で',
        note: 'Ação que já aconteceu + 後で. Por isso usa た!',
      },
      {
        type: 'table',
        sensei: 'Comparação:',
        rows: [
          ['前に', 'Verbo DICIONAL (る) — ação ainda não feita'],
          ['後で', 'Verbo PASSADO (た) — ação já feita'],
        ],
      },
    ],
    quiz: [
      { question: 'Antes de 前に, o verbo fica em qual forma?', options: ['Passado (た)', 'Dicional (る)', 'て', 'ます'], correctIdx: 1, explanation: '前に = antes de. Verbo em dicional.' },
      { question: 'Antes de 後で, o verbo fica em qual forma?', options: ['Dicional', 'Passado (た)', 'ない', 'ます'], correctIdx: 1, explanation: '後で = depois de. Ação já feita = た.' },
      { question: '{食|た}べた{後|あと}で =', options: ['Antes de comer', 'Durante a refeição', 'Depois de comer', 'Sem comer'], correctIdx: 2, explanation: '後で = depois de.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 21: Comparação — より、方が、一番
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-comparison',
    title: 'Comparação: より、方が、一番',
    jlptLevel: 'N5',
    icon: '⚖️',
    description: 'Mais que, preferir, o mais. Superlativo e comparativo.',
    slides: [
      { type: 'intro', sensei: '"Prefiro chá a café." "Este é o meu favorito." より, 方が e 一番 — pra comparar e dizer qual você prefere. No restaurante, na loja, com amigos...', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'A より B = B mais que A (B é o foco):',
        japanese: 'りんごよりみかんが{好|す}きです。',
        romaji: 'Ringo yori mikan ga suki desu.',
        translation: 'Gosto mais de tangerina que de maçã.',
        highlight: 'より',
        note: 'O que vem DEPOIS de より é o "mais". Mikan > ringo.',
      },
      {
        type: 'concept',
        sensei: 'AよりBの方が = B é mais X que A:',
        japanese: 'コーヒーより{茶|ちゃ}の{方|ほう}が{好|す}きです。',
        romaji: 'Koohii yori cha no hou ga suki desu.',
        translation: 'Prefiro chá a café.',
        highlight: 'の方が',
        note: 'の方が = "é mais", "prefiro". 方が marca o preferido.',
      },
      {
        type: 'concept',
        sensei: '一番 = o mais (superlativo):',
        japanese: 'これが{一|いち}{番|ばん}{好|す}きです。',
        romaji: 'Kore ga ichiban suki desu.',
        translation: 'Gosto mais deste. / Este é o meu favorito.',
        highlight: '一番',
        note: '一番 + adj = o mais X. 一番大きい = o maior.',
      },
    ],
    quiz: [
      { question: 'AよりB =', options: ['A é mais', 'B é mais que A', 'A e B iguais', 'Nenhum'], correctIdx: 1, explanation: 'O que vem depois de より é o "mais".' },
      { question: 'の方が indica:', options: ['Menos', 'O preferido / o mais', 'Igual', 'Nada'], correctIdx: 1, explanation: 'の方が = preferir, é mais.' },
      { question: '一番{高|たか}い =', options: ['Mais ou menos alto', 'O mais alto', 'Alto', 'Não é alto'], correctIdx: 1, explanation: '一番 = superlativo, o mais.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 22: Frequência — いつも、よく、あまり、全然
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-frequency',
    title: 'Frequência: いつも、よく、あまり、全然',
    jlptLevel: 'N5',
    icon: '🔄',
    description: 'Sempre, frequentemente, pouco, nunca. Advérbios de frequência.',
    slides: [
      { type: 'intro', sensei: '"Sempre vou de trem." "Às vezes cozinho." "Não entendo nada." いつも、よく、あまり、全然 — advérbios que você usa o tempo todo pra falar de rotina.', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Advérbios de frequência:',
        rows: [
          ['いつも (itsumo)', 'Sempre'],
          ['よく (yoku)', 'Frequentemente, muito'],
          ['時々 (tokidoki)', 'Às vezes'],
          ['あまり〜ない', 'Não muito (com negativo)'],
          ['全然〜ない (zenzen)', 'Nada, nunca (com negativo)'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Cuidado: あまり e 全然 exigem verbo/adjetivo NEGATIVO:',
        japanese: 'あまり{食|た}べません。\n全然{分|わ}かりません。',
        romaji: 'Amari tabemasen. Zenzen wakarimasen.',
        translation: 'Não como muito. Não entendo nada.',
        highlight: 'ない',
        note: 'Não use あまり ou 全然 com afirmativo! Sempre com ない/ません.',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: 'いつも{電車|でんしゃ}で{行|い}きます。', romaji: 'Itsumo densha de ikimasu.', translation: 'Sempre vou de trem.' },
          { japanese: 'よく{映画|えいが}を{見|み}ます。', romaji: 'Yoku eiga wo mimasu.', translation: 'Assisto filme com frequência.' },
          { japanese: 'この{店|みせ}はあまり{良|よ}くない。', romaji: 'Kono mise wa amari yokunai.', translation: 'Esta loja não é muito boa.' },
        ],
      },
    ],
    quiz: [
      { question: 'いつも =', options: ['Nunca', 'Às vezes', 'Sempre', 'Pouco'], correctIdx: 2, explanation: 'いつも = sempre.' },
      { question: 'あまり e 全然 exigem:', options: ['Afirmativo', 'Negativo', 'Pergunta', 'Passado'], correctIdx: 1, explanation: 'Sempre com ない/ません.' },
      { question: '全然{分|わ}かりません =', options: ['Entendo tudo', 'Entendo um pouco', 'Não entendo nada', 'Talvez entenda'], correctIdx: 2, explanation: '全然 + neg = nada, nunca.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 23: つもり e ほうがいい
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-tsumori-hou',
    title: 'つもり e ほうがいい',
    jlptLevel: 'N5',
    icon: '📋',
    description: 'Pretendo fazer. Melhor fazer. Intenção e conselho.',
    slides: [
      { type: 'intro', sensei: 'つもり = pretendo, vou (intenção). ほうがいい = é melhor, deveria (conselho). Os dois caem no N5!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'つもり = pretendo, planejo (verbo dicional + つもり):',
        japanese: '{来年|らいねん}{日本|にほん}に{行|い}くつもりです。',
        romaji: 'Rainen Nihon ni iku tsumori desu.',
        translation: 'Pretendo ir ao Japão ano que vem.',
        highlight: 'つもり',
        note: 'つもりだ = tenho a intenção de. Negativo: 行かないつもり.',
      },
      {
        type: 'concept',
        sensei: 'ほうがいい = é melhor, deveria (conselho):',
        japanese: 'もっと{勉強|べんきょう}した{方|ほう}がいいです。',
        romaji: 'Motto benkyou shita hou ga ii desu.',
        translation: 'É melhor estudar mais.',
        highlight: 'ほうがいい',
        note: 'Verbo た + ほうがいい = conselho. "Seria melhor se você fizesse X".',
      },
      {
        type: 'example',
        sensei: 'No dia a dia:',
        examples: [
          { japanese: '{医者|いしゃ}に{行|い}った{方|ほう}がいいですよ。', romaji: 'Isha ni itta hou ga ii desu yo.', translation: 'É melhor ir ao médico.' },
          { japanese: '{明日|あした}は{休|やす}むつもりです。', romaji: 'Ashita wa yasumu tsumori desu.', translation: 'Amanhã pretendo descansar.' },
        ],
      },
    ],
    quiz: [
      { question: 'つもり indica:', options: ['Passado', 'Intenção/plano', 'Proibição', 'Pergunta'], correctIdx: 1, explanation: 'つもり = pretendo, planejo.' },
      { question: 'ほうがいい indica:', options: ['Obrigatório', 'Conselho/é melhor', 'Proibido', 'Possível'], correctIdx: 1, explanation: 'ほうがいい = é melhor fazer.' },
      { question: 'したほうがいい usa verbo em:', options: ['Dicional', 'Passado (た)', 'て', 'ます'], correctIdx: 1, explanation: 'た + ほうがいい = conselho.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 24: なくてもいい e なければならない
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-nakute-must',
    title: 'なくてもいい e なければならない',
    jlptLevel: 'N5',
    icon: '✅',
    description: 'Não precisa. Precisa. Obrigação e dispensa.',
    slides: [
      { type: 'intro', sensei: 'Não precisa vir. Precisa fazer. Em japonês: なくてもいい (não precisa) e なければならない (precisa, deve). Essencial pro N5!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'なくてもいい = não precisa, não é necessário:',
        japanese: '{明日|あした}は{来|こ}なくてもいいです。',
        romaji: 'Ashita wa konakute mo ii desu.',
        translation: 'Amanhã não precisa vir.',
        highlight: 'なくてもいい',
        note: 'Forma ない sem い → なくて + もいい. "Não fazer está ok".',
      },
      {
        type: 'concept',
        sensei: 'なければならない / ないといけない = precisa, deve:',
        japanese: '{宿題|しゅくだい}をしなければなりません。',
        romaji: 'Shukudai wo shinakereba narimasen.',
        translation: 'Preciso fazer o dever de casa.',
        highlight: 'なければならない',
        note: 'なければならない = obrigação forte. ないといけない = mais casual.',
      },
      {
        type: 'table',
        sensei: 'Resumo:',
        rows: [
          ['なくてもいい', 'Não precisa (dispensa)'],
          ['なければならない', 'Precisa (obrigação)'],
          ['ないといけない', 'Precisa (mais casual)'],
        ],
      },
    ],
    quiz: [
      { question: 'なくてもいい significa:', options: ['Precisa', 'Não precisa', 'Quer', 'Não quer'], correctIdx: 1, explanation: 'なくてもいい = não precisa.' },
      { question: 'なければならない significa:', options: ['Não pode', 'Precisa/deve', 'Quer', 'Pode'], correctIdx: 1, explanation: 'なければならない = obrigação.' },
      { question: '来なくてもいい =', options: ['Precisa vir', 'Não precisa vir', 'Quer vir', 'Não quer vir'], correctIdx: 1, explanation: 'なくてもいい = não precisa.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 25: くらい/ごろ e しか〜ない
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-kurai-shika',
    title: 'くらい/ごろ e しか〜ない',
    jlptLevel: 'N5',
    icon: '📊',
    description: 'Aproximadamente. Só (com negativo). Quantidade.',
    slides: [
      { type: 'intro', sensei: 'Uns 10 minutos. Por volta das 3h. Só tem um. くらい/ごろ (aproximadamente) e しか〜ない (só, com negativo) caem no N5!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'くらい/ぐらい = aproximadamente (quantidade):',
        japanese: '{十分|じゅっぷん}くらい{待|ま}ってください。',
        romaji: 'Juppun kurai matte kudasai.',
        translation: 'Por favor espere uns 10 minutos.',
        highlight: 'くらい',
        note: 'Número + くらい. ぐらい = mesma coisa.',
      },
      {
        type: 'concept',
        sensei: 'ごろ = por volta de (horário):',
        japanese: '3{時|じ}ごろ{着|つ}きます。',
        romaji: 'Sanji goro tsukimasu.',
        translation: 'Chego por volta das 3h.',
        highlight: 'ごろ',
        note: 'ごろ = hora aproximada. 3時 = exato. 3時ごろ = por volta das 3.',
      },
      {
        type: 'concept',
        sensei: 'しか〜ない = só, apenas (sempre com negativo!):',
        japanese: '{一|ひと}つしかありません。',
        romaji: 'Hitotsu shika arimasen.',
        translation: 'Só tem um.',
        highlight: 'しか〜ない',
        note: 'しか + verbo negativo. "Só X" = Xしかない. O negativo é obrigatório!',
      },
    ],
    quiz: [
      { question: 'くらい indica:', options: ['Exato', 'Aproximadamente', 'Muito', 'Nada'], correctIdx: 1, explanation: 'くらい = aproximadamente (quantidade).' },
      { question: 'ごろ usa com:', options: ['Lugar', 'Horário', 'Pessoa', 'Objeto'], correctIdx: 1, explanation: 'ごろ = por volta de (hora).' },
      { question: 'しか〜ない significa:', options: ['Muitos', 'Só/apenas (com neg)', 'Nenhum', 'Todos'], correctIdx: 1, explanation: 'しか + neg = só, apenas.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 26: Conectores e Palavras-question
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-conjunctions-questions',
    title: 'Conectores e Palavras-question',
    jlptLevel: 'N5',
    icon: '🔤',
    description: 'そして、だから、でも。いつ、どう、どうして、なぜ.',
    slides: [
      { type: 'intro', sensei: 'E então. Por isso. Mas. Quando? Como? Por quê? Conectores e palavras-question são base do N5!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Conectores entre frases:',
        rows: [
          ['そして (soshite)', 'E então'],
          ['それから (sorekara)', 'Depois disso'],
          ['だから (dakara)', 'Por isso'],
          ['でも (demo)', 'Mas, porém'],
          ['しかし (shikashi)', 'Porém (mais formal)'],
        ],
      },
      {
        type: 'table',
        sensei: 'Palavras-question essenciais:',
        rows: [
          ['いつ (itsu)', 'Quando?'],
          ['どう (dou)', 'Como?'],
          ['どうして / なぜ (doushite/naze)', 'Por quê?'],
          ['どれ (dore)', 'Qual (de vários)?'],
          ['どの (dono)', 'Qual (antes de substantivo)'],
          ['いくつ (ikutsu)', 'Quantos?'],
        ],
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: '{暑|あつ}いです。だから、{窓|まど}を{開|あ}けます。', romaji: 'Atsui desu. Dakara, mado wo akemasu.', translation: 'Está quente. Por isso abro a janela.' },
          { japanese: 'いつ{日本|にほん}に{行|い}きますか？', romaji: 'Itsu Nihon ni ikimasu ka?', translation: 'Quando você vai ao Japão?' },
          { japanese: 'どうして{遅|おそ}れたんですか？', romaji: 'Doushite okureta n desu ka?', translation: 'Por que você se atrasou?' },
        ],
      },
    ],
    quiz: [
      { question: 'だから significa:', options: ['Mas', 'Por isso', 'E então', 'Quando'], correctIdx: 1, explanation: 'だから = por isso.' },
      { question: 'いつ =', options: ['Onde', 'Quando', 'Como', 'Por quê'], correctIdx: 1, explanation: 'いつ = quando.' },
      { question: 'どうして =', options: ['Como', 'Onde', 'Por quê', 'Quando'], correctIdx: 2, explanation: 'どうして = por quê.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 27: とき — Quando
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-toki',
    title: 'とき — Quando',
    jlptLevel: 'N5',
    icon: '⏰',
    description: 'Quando faço X, Y acontece. Tempo relativo.',
    slides: [
      { type: 'intro', sensei: '"Quando volto pra casa, lavo as mãos." "Quando era criança, morava no Japão." とき = quando. A forma do verbo antes de とき muda — presente ou passado — conforme o que você quer dizer!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Verbo DICIONAL + とき = quando (ação futura ou habitual):',
        japanese: '{家|いえ}に{帰|かえ}るとき、{手|て}を{洗|あら}います。',
        romaji: 'Ie ni kaeru toki, te wo araimasu.',
        translation: 'Quando volto pra casa, lavo as mãos.',
        highlight: 'るとき',
        note: 'Ação ainda não feita ou habitual. Dicional (る) + とき.',
      },
      {
        type: 'concept',
        sensei: 'Verbo PASSADO + とき = quando (ação já feita):',
        japanese: '{子供|こども}のとき、{日本|にほん}に{住|す}んでいました。',
        romaji: 'Kodomo no toki, Nihon ni sunde imashita.',
        translation: 'Quando era criança, morava no Japão.',
        highlight: 'たとき',
        note: '名詞 + の + とき. Verbo た + とき = quando fiz/era.',
      },
      {
        type: 'table',
        sensei: 'Resumo:',
        rows: [
          ['{行|い}くとき', 'Quando vou (antes de ir)'],
          ['{行|い}ったとき', 'Quando fui (depois de chegar)'],
          ['{学生|がくせい}のとき', 'Quando era estudante'],
        ],
      },
    ],
    quiz: [
      { question: 'Verbo dicional + とき = quando a ação:', options: ['Já aconteceu', 'Ainda não aconteceu ou é habitual', 'Nunca acontece', 'Acontece sempre'], correctIdx: 1, explanation: 'る + とき = ação futura ou habitual.' },
      { question: '{子供|こども}のとき =', options: ['Quando for criança', 'Quando era criança', 'Criança agora', 'Sem criança'], correctIdx: 1, explanation: '名詞のとき = quando era/é.' },
      { question: '{食|た}べたとき =', options: ['Quando vou comer', 'Quando comi', 'Não como', 'Sempre como'], correctIdx: 1, explanation: 'た + とき = quando já fiz.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 28: もう e まだ
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-mou-mada',
    title: 'もう e まだ',
    jlptLevel: 'N5',
    icon: '⏳',
    description: 'Já. Ainda. Ainda não. Essenciais pro JLPT N5!',
    slides: [
      { type: 'intro', sensei: '"Já comi." "Ainda não cheguei." "Mais um, por favor." もう e まだ são duas palavrinhas que você vai usar o tempo todo — no konbini, no trabalho, em casa.', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'もう = já (concluído), mais (adicional):',
        japanese: 'もう{食|た}べました。\nもう{一|ひと}つください。',
        romaji: 'Mou tabemashita. Mou hitotsu kudasai.',
        translation: 'Já comi. Mais um, por favor.',
        highlight: 'もう',
        note: 'もう + afirmativo = já. もう + ない = não mais.',
      },
      {
        type: 'concept',
        sensei: 'まだ = ainda (não terminou), ainda não:',
        japanese: 'まだ{食|た}べています。\nまだ{帰|かえ}っていません。',
        romaji: 'Mada tabete imasu. Mada kaette imasen.',
        translation: 'Ainda estou comendo. Ainda não voltei.',
        highlight: 'まだ',
        note: 'まだ + ている = ainda fazendo. まだ + negativo = ainda não.',
      },
      {
        type: 'table',
        sensei: 'Resumo:',
        rows: [
          ['もう{食|た}べた', 'Já comi'],
          ['もう{食|た}べていない', 'Não como mais'],
          ['まだ{食|た}べている', 'Ainda estou comendo'],
          ['まだ{食|た}べていない', 'Ainda não comi'],
        ],
      },
    ],
    quiz: [
      { question: 'もう{食|た}べました =', options: ['Ainda não comi', 'Já comi', 'Não como', 'Vou comer'], correctIdx: 1, explanation: 'もう + passado = já fiz.' },
      { question: 'まだ{帰|かえ}っていません =', options: ['Já voltei', 'Ainda não voltei', 'Não vou voltar', 'Voltei ontem'], correctIdx: 1, explanation: 'まだ + negativo = ainda não.' },
      { question: 'もう{一|ひと}つ =', options: ['Um só', 'Mais um', 'Nenhum', 'Muitos'], correctIdx: 1, explanation: 'もう = mais (adicional).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 29: ないで e ないでください
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-naide',
    title: 'ないで e ないでください',
    jlptLevel: 'N5',
    icon: '🚫',
    description: 'Sem fazer. Por favor não faça. Proibição e sequência.',
    slides: [
      { type: 'intro', sensei: '"Por favor não tire foto aqui." "Sai de casa sem levar guarda-chuva." ないで e ないでください — uma é pedido educado, a outra conta o que você fez (ou não fez).', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ないでください = por favor não faça:',
        japanese: 'ここで{煙草|たばこ}を{吸|す}わないでください。',
        romaji: 'Koko de tabako wo suwanaide kudasai.',
        translation: 'Por favor não fume aqui.',
        highlight: 'ないでください',
        note: 'Forma ない sem い → ないで + ください. Proibição educada.',
      },
      {
        type: 'concept',
        sensei: 'ないで = sem fazer (sequência: B sem fazer A):',
        japanese: '{朝|あさ}ごはんを{食|た}べないで{学校|がっこう}に{行|い}きました。',
        romaji: 'Asagohan wo tabenaide gakkou ni ikimashita.',
        translation: 'Fui à escola sem tomar café da manhã.',
        highlight: 'ないで',
        note: 'Verbo ない (sem い) + で. "Fazer B sem ter feito A".',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: '{写真|しゃしん}を{撮|と}らないでください。', romaji: 'Shashin wo toranaide kudasai.', translation: 'Por favor não tire fotos.' },
          { japanese: '{傘|かさ}を{持|も}たないで{出|で}かけた。', romaji: 'Kasa wo motanaide dekaketa.', translation: 'Sai sem levar guarda-chuva.' },
        ],
      },
    ],
    quiz: [
      { question: 'ないでください =', options: ['Por favor faça', 'Por favor não faça', 'Já fiz', 'Vou fazer'], correctIdx: 1, explanation: 'ないでください = por favor não faça.' },
      { question: 'ないで indica:', options: ['Depois de fazer', 'Sem fazer', 'Enquanto faz', 'Antes de fazer'], correctIdx: 1, explanation: 'ないで = sem fazer.' },
      { question: '{食|た}べないで{行|い}く =', options: ['Comer e ir', 'Ir sem comer', 'Não comer', 'Comer ou ir'], correctIdx: 1, explanation: 'B sem fazer A.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 30: か～か (Ou) e けど/けれども
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-ka-ka-kedo',
    title: 'か～か (Ou) e けど/けれども',
    jlptLevel: 'N5',
    icon: '🔀',
    description: 'A ou B. Mas, porém. Alternativa e contraste.',
    slides: [
      { type: 'intro', sensei: '"Café ou chá?" "É caro, mas vou comprar." Duas estruturas que você usa o tempo todo: か～か pra escolher, けど pra dar aquele "mas" que muda tudo.', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'AかBか = A ou B (pergunta de alternativa):',
        japanese: 'コーヒーか{茶|ちゃ}か、どちらがいいですか？',
        romaji: 'Koohii ka cha ka, dochira ga ii desu ka?',
        translation: 'Café ou chá, qual você prefere?',
        highlight: 'か～か',
        note: 'か entre as opções. どちら = qual dos dois.',
      },
      {
        type: 'concept',
        sensei: 'けど / けれども = mas, porém (conecta frases):',
        japanese: '{高|たか}いけど、{買|か}います。\n{暑|あつ}いけれども、{窓|まど}を{閉|し}めます。',
        romaji: 'Takai kedo, kaimasu. Atsui keredomo, mado wo shimemasu.',
        translation: 'É caro, mas vou comprar. Está quente, mas fecho a janela.',
        highlight: 'けど',
        note: 'けど é casual. けれども é mais formal. Ambos = mas.',
      },
      {
        type: 'example',
        sensei: 'No dia a dia:',
        examples: [
          { japanese: '{今日|きょう}か{明日|あした}か{来|き}てください。', romaji: 'Kyou ka ashita ka kite kudasai.', translation: 'Venha hoje ou amanhã.' },
          { japanese: '{忙|いそが}しいけど、{楽|たの}しいです。', romaji: 'Isogashii kedo, tanoshii desu.', translation: 'É corrido, mas é divertido.' },
        ],
      },
    ],
    quiz: [
      { question: 'AかBか significa:', options: ['A e B', 'A ou B', 'Nem A nem B', 'A mas B'], correctIdx: 1, explanation: 'か～か = ou (alternativa).' },
      { question: 'けど significa:', options: ['E', 'Mas, porém', 'Ou', 'Porque'], correctIdx: 1, explanation: 'けど = mas, porém.' },
      { question: 'けれども é ___ que けど.', options: ['Mais casual', 'Mais formal', 'Igual', 'Oposto'], correctIdx: 1, explanation: 'けれども = mais formal que けど.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 31: どんな、どうやって、どのぐらい
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-donna-douyatte',
    title: 'どんな、どうやって、どのぐらい',
    jlptLevel: 'N5',
    icon: '❓',
    description: 'Que tipo? Como? Quanto tempo? Palavras-question do N5.',
    slides: [
      { type: 'intro', sensei: '"Que tipo de pessoa é ele?" "Como você veio?" "Quanto tempo até a estação?" どんな、どうやって、どのぐらい — perguntas que você faz o tempo todo quando conhece alguém ou precisa de informação.', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Palavras-question avançadas:',
        rows: [
          ['どんな (donna)', 'Que tipo de? (qualidade)'],
          ['どう (dou)', 'Como? (estado)'],
          ['どうやって (douyatte)', 'Como? (método, meio)'],
          ['どのぐらい (donogurai)', 'Quanto tempo? Quanto?'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Exemplos:',
        japanese: '{彼|かれ}はどんな{人|ひと}ですか？\nどうやって{行|い}きますか？\n{駅|えき}までどのぐらいかかりますか？',
        romaji: 'Kare wa donna hito desu ka? Douyatte ikimasu ka? Eki made donogurai kakarimasu ka?',
        translation: 'Que tipo de pessoa ele é? Como você vai? Quanto tempo até a estação?',
        highlight: null,
        note: 'どんな + substantivo. どうやって = por qual meio/método.',
      },
      {
        type: 'concept',
        sensei: 'こんな/そんな/あんな = este tipo de / esse tipo de / aquele tipo de:',
        japanese: 'こんな{店|みせ}は{初|はじ}めてです。',
        romaji: 'Konna mise wa hajimete desu.',
        translation: 'É a primeira vez numa loja assim.',
        highlight: 'こんな',
        note: 'こ/そ/あ + んな. Segue a lógica こそあど.',
      },
    ],
    quiz: [
      { question: 'どんな =', options: ['Onde', 'Quando', 'Que tipo de', 'Como (método)'], correctIdx: 2, explanation: 'どんな = que tipo de.' },
      { question: 'どうやって =', options: ['Por quê', 'Como (por qual meio)', 'Onde', 'Quanto'], correctIdx: 1, explanation: 'どうやって = como, por qual método.' },
      { question: 'どのぐらい =', options: ['Onde', 'Quando', 'Quanto tempo/quanto', 'Quem'], correctIdx: 2, explanation: 'どのぐらい = quanto tempo, quanto.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 32: 方 (かた) — Modo de fazer
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-kata',
    title: '方 (かた) — Modo de fazer',
    jlptLevel: 'N5',
    icon: '📖',
    description: 'Modo de comer. Como fazer. Verbo ます-stem + 方.',
    slides: [
      { type: 'intro', sensei: '"Como usa essa máquina?" "Não sei o jeito certo de comer isso." 方 (kata) = modo de fazer. Qualquer verbo + 方 e você pergunta ou explica como fazer algo.', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Verbo ます-stem + 方 = modo de fazer:',
        japanese: '{食|た}べ方 / {使|つか}い方 / {書|か}き方',
        romaji: 'Tabekata / Tsukaikata / Kakikata',
        translation: 'Modo de comer / Modo de usar / Modo de escrever',
        highlight: '方',
        note: 'ます-stem: {食|た}べます→{食|た}べ, {書|か}きます→{書|か}き. + 方.',
      },
      {
        type: 'example',
        sensei: 'Frases úteis:',
        examples: [
          { japanese: 'この{機械|きかい}の{使|つか}い方を{教|おし}えてください。', romaji: 'Kono kikai no tsukaikata wo oshiete kudasai.', translation: 'Por favor me ensine como usar esta máquina.' },
          { japanese: '{日本語|にほんご}の{話|はな}し方が{上|じょう}手になりました。', romaji: 'Nihongo no hanashikata ga jouzu ni narimashita.', translation: 'Ficou bom em falar japonês.' },
        ],
      },
    ],
    quiz: [
      { question: '方 (かた) indica:', options: ['Lugar', 'Modo de fazer', 'Tempo', 'Pessoa'], correctIdx: 1, explanation: '方 = modo, jeito de fazer.' },
      { question: '{食|た}べ方 =', options: ['Comida', 'Comer', 'Modo de comer', 'Não comer'], correctIdx: 2, explanation: 'Verbo-stem + 方 = modo de fazer.' },
      { question: '{書|か}き方 usa qual forma do verbo?', options: ['Passado', 'ます-stem', 'て', 'ない'], correctIdx: 1, explanation: 'ます-stem (sem ます) + 方.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 33: でしょう e なる/にする
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-deshou-naru',
    title: 'でしょう e なる/にする',
    jlptLevel: 'N5',
    icon: '🔮',
    description: 'Provavelmente. Virar. Escolher. Suposição e mudança.',
    slides: [
      { type: 'intro', sensei: '"Acho que vai chover." "Quero ser médico." "Vou de café." — でしょう (acho que), なる (virar), にする (escolher). No restaurante você vai usar にする o tempo todo!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'でしょう = provavelmente, acho que (suposição educada):',
        japanese: 'あしたは{雨|あめ}でしょう。\n{彼|かれ}は{来|く}るでしょう。',
        romaji: 'Ashita wa ame deshou. Kare wa kuru deshou.',
        translation: 'Amanhã provavelmente chove. Acho que ele vem.',
        highlight: 'でしょう',
        note: 'です → でしょう. Verbo/adj + でしょう. Equivale a だろう (casual).',
      },
      {
        type: 'concept',
        sensei: 'なる = virar, tornar-se. にする = escolher, decidir:',
        japanese: '{医者|いしゃ}になりたい。\nコーヒーにします。',
        romaji: 'Isha ni naritai. Koohii ni shimasu.',
        translation: 'Quero ser médico. Vou de café. (escolho café)',
        highlight: 'なる / にする',
        note: 'Xになる = virar X. Xにする = escolher X (em restaurante, loja).',
      },
      {
        type: 'example',
        sensei: 'No restaurante, no café, no konbini — にする é o que você diz na hora de escolher:',
        examples: [
          { japanese: 'A：{何|なに}にしますか？ B：{茶|ちゃ}にします。', romaji: 'A: Nani ni shimasu ka? B: Cha ni shimasu.', translation: 'A: O que vai querer? B: Vou de chá.' },
          { japanese: 'お{客|きゃく}：これをください。{店員|てんいん}：かしこまりました。', romaji: 'Okyaku: Kore wo kudasai. Tenin: Kashikomarimashita.', translation: 'Cliente: Quero este. Atendente: Entendido.' },
        ],
      },
      {
        type: 'tip',
        sensei: 'Dica: でしょう no final de frase soa tipo "né?" ou "tá?" — "Vai chover, né?" = {雨|あめ}でしょう。 Soa natural e educado.',
        japanese: null,
        translation: null,
        note: 'Os japoneses usam でしょう o tempo todo pra suposição.',
      },
    ],
    quiz: [
      { question: 'でしょう indica:', options: ['Certeza', 'Suposição/provavelmente', 'Proibição', 'Pedido'], correctIdx: 1, explanation: 'でしょう = provavelmente, acho que.' },
      { question: 'Xになる =', options: ['Escolher X', 'Virar X', 'Rejeitar X', 'Perder X'], correctIdx: 1, explanation: 'なる = virar, tornar-se.' },
      { question: 'コーヒーにします =', options: ['Não quero café', 'Escolho café', 'Café é ruim', 'Café acabou'], correctIdx: 1, explanation: 'にする = escolher (em pedidos).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 34: Contadores Detalhados
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-counters-detail',
    title: 'Contadores — 本、枚、人、冊',
    jlptLevel: 'N5',
    icon: '🔢',
    description: 'Contadores com leitura especial. 1本, 2枚, 3人...',
    slides: [
      { type: 'intro', sensei: 'No konbini: "duas águas" não é にみず. É 二本 (nihon)! Cada tipo de coisa tem contador diferente — garrafa, folha, pessoa. A leitura muda e parece confuso, mas você pega o jeito.', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Contadores e leituras especiais:',
        rows: [
          ['本 (hon) — longos', '1本(ippon) 2本(nihon) 3本(sanbon) 6本(roppon) 8本(happon) 10本(juppon)'],
          ['枚 (mai) — planos', '1枚(ichimai) 2枚(nimai) — leitura regular'],
          ['人 (nin) — pessoas', '1人(hitori) 2人(futari) 3人(sannin) 4人(yonin)'],
          ['冊 (satsu) — livros', '1冊(issatsu) 2冊(nisatsu)'],
          ['杯 (hai) — copos', '1杯(ippai) 2杯(nihai) 3杯(sanbai)'],
          ['台 (dai) — máquinas', '1台(ichidai) 2台(nidai)'],
        ],
      },
      {
        type: 'concept',
        sensei: '本 muda conforme o número:',
        japanese: '{水|みず}を{二|に}{本|ほん}ください。\n{鉛筆|えんぴつ}が{六|ろっ}{本|ほん}あります。',
        romaji: 'Mizu wo nihon kudasai. Enpitsu ga roppon arimasu.',
        translation: 'Duas águas, por favor. Há seis lápis.',
        highlight: '本',
        note: '1, 6, 8, 10 têm leitura especial com 本. 3=さんぼん, 4=よんほん.',
      },
      {
        type: 'example',
        sensei: 'No konbini, na loja, falando da família:',
        examples: [
          { japanese: '{水|みず}を{二|に}{本|ほん}ください。', romaji: 'Mizu wo nihon kudasai.', translation: 'Duas águas, por favor.' },
          { japanese: '{家族|かぞく}は{四|よ}人です。', romaji: 'Kazoku wa yonin desu.', translation: 'A família tem quatro pessoas.' },
          { japanese: 'この{本|ほん}は{千|せん}{円|えん}です。', romaji: 'Kono hon wa sen en desu.', translation: 'Este livro custa mil ienes.' },
        ],
      },
      {
        type: 'tip',
        sensei: 'Não precisa decorar tudo de uma vez! Os contadores mais usados são {本|ほん} (garrafa, lápis), {枚|まい} (folha, camisa), {人|にん} (pessoa). O resto vai vindo com a prática.',
        japanese: null,
        translation: null,
        note: 'Os japoneses às vezes erram contadores também — relaxa!',
      },
    ],
    quiz: [
      { question: '本 (hon) conta:', options: ['Livros', 'Objetos longos (garrafas, lápis)', 'Pessoas', 'Folhas'], correctIdx: 1, explanation: '本 = objetos longos e finos.' },
      { question: '2人 =', options: ['Futari', 'Ninin', 'Nijin', 'Hutari'], correctIdx: 0, explanation: '2人 = futari (leitura especial).' },
      { question: '枚 conta:', options: ['Objetos longos', 'Objetos planos (folhas, roupas)', 'Pessoas', 'Livros'], correctIdx: 1, explanation: '枚 = objetos planos.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 34: Orthografia (表記) — Kanji e Hiragana
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-orthography',
    title: 'Orthografia — Kanji e Hiragana',
    jlptLevel: 'N5',
    icon: '✍️',
    description: 'Aprenda a reconhecer qual kanji corresponde a cada leitura. Tipo de questão do JLPT 語彙.',
    slides: [
      { type: 'intro', sensei: 'No JLPT N5, a prova de {語彙|ごい} testa orthography ({表記|ひょうき}): "qual kanji escreve essa palavra?" ou "qual a leitura desse kanji?". Treinar isso ajuda demais!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Hiragana → Kanji: a mesma leitura pode ser escrita com kanji diferente. O contexto define qual usar:',
        japanese: '「みず」→ {水|みず} (água)\n「きょう」→ {今日|きょう} (hoje)\n「でんしゃ」→ {電車|でんしゃ} (trem)',
        romaji: 'mizu → 水, kyou → 今日, densha → 電車',
        translation: null,
        highlight: '水・今日・電車',
        note: '{水|みず} = água. {今日|きょう} = hoje. {電車|でんしゃ} = trem.',
      },
      {
        type: 'table',
        sensei: 'Pares que confundem no exame (escolha o kanji correto):',
        rows: [
          ['みず', '{水|みず} (água) — não confunda com {氷|こおり} (gelo) ou {泳|およ} (nadar)'],
          ['きょう', '{今日|きょう} (hoje) — não confunda com {昨日|きのう} (ontem) ou {明日|あした} (amanhã)'],
          ['でんしゃ', '{電車|でんしゃ} (trem) — {電|でん} = eletricidade, {車|しゃ} = veículo'],
          ['えき', '{駅|えき} (estação) — diferente de {易|い} (fácil)'],
          ['かぞく', '{家族|かぞく} (família) — {家|いえ} = casa, {族|ぞく} = grupo'],
        ],
      },
      {
        type: 'tip',
        sensei: 'Dica: no exame, as alternativas erradas costumam ter kanji parecidos ou com leitura similar. Leia a frase inteira pra pegar o contexto!',
        japanese: null,
        translation: null,
        note: 'Exemplo: 「___を{飲|の}みます」— se for bebida, {水|みず} faz sentido. {氷|こおり} (gelo) não.',
      },
    ],
    quiz: [
      { question: '「みず」を漢字で書くと？', options: ['水', '氷', '永', '泳'], correctIdx: 0, explanation: '水 = água. 氷 = gelo.' },
      { question: '「きょう」を漢字で書くと？', options: ['昨日', '今日', '明日', '毎日'], correctIdx: 1, explanation: '今日 = hoje.' },
      { question: '「でんしゃ」を漢字で書くと？', options: ['電車', '汽車', '自転車', '地下鉄'], correctIdx: 0, explanation: '電車 = trem.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 35: Vocabulário Essencial N5
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-vocab-essential',
    title: 'Vocabulário Essencial N5',
    jlptLevel: 'N5',
    icon: '📚',
    description: '~800 palavras do N5. Substantivos, verbos, advérbios.',
    slides: [
      { type: 'intro', sensei: 'Dias da semana, "mês que vem", "ano passado", hospital, banco... Vocabulário que você usa pra marcar encontro, falar de viagem, ir no médico. Tudo aqui!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Dias e tempo:',
        rows: [
          ['月曜日～日曜日', 'Segunda a domingo'],
          ['{今月|こんげつ}、{来月|らいげつ}、{先月|せんげつ}', 'Este mês, mês que vem, mês passado'],
          ['{去年|きょねん}、{今年|ことし}、{来年|らいねん}', 'Ano passado, este ano, ano que vem'],
          ['{毎日|まいにち}、{毎週|まいしゅう}、{毎月|まいつき}', 'Todo dia, toda semana, todo mês'],
        ],
      },
      {
        type: 'table',
        sensei: 'Lugares e ações:',
        rows: [
          ['{病院|びょういん}、{銀行|ぎんこう}、{郵便局|ゆうびんきょく}', 'Hospital, banco, correio'],
          ['{切手|きって}、{葉書|はがき}、{小包|こづつみ}', 'Selos, cartão postal, pacote'],
          ['{予約|よやく}する、{案内|あんない}する、{説明|せつめい}する', 'Reservar, guiar, explicar'],
        ],
      },
      {
        type: 'table',
        sensei: 'Advérbios e expressões:',
        rows: [
          ['ぜひ、たぶん、きっと', 'Com certeza, talvez, certamente'],
          ['{必|かなら}ず、{多分|たぶん}、{時々|ときどき}', 'Sempre, provavelmente, às vezes'],
          ['{大丈夫|だいじょうぶ}、{大変|たいへん}、{結構|けっこう}', 'Tudo bem, muito, bastante'],
        ],
      },
    ],
    quiz: [
      { question: '{来月|らいげつ} =', options: ['Mês passado', 'Este mês', 'Mês que vem', 'Todo mês'], correctIdx: 2, explanation: '{来月|らいげつ} = mês que vem.' },
      { question: '{予約|よやく}する =', options: ['Cancelar', 'Reservar', 'Chegar', 'Sair'], correctIdx: 1, explanation: '{予約|よやく}する = reservar.' },
      { question: '{大丈夫|だいじょうぶ} =', options: ['Perigoso', 'Tudo bem', 'Grande', 'Pequeno'], correctIdx: 1, explanation: '{大丈夫|だいじょうぶ} = tudo bem.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N5 – LIÇÃO 36: Lendo Avisos e Cartazes (情報検索)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n5-info-retrieval',
    title: 'Lendo Avisos e Cartazes',
    jlptLevel: 'N5',
    icon: '📋',
    description: 'Extraia informação de avisos, horários e cartazes. Tipo 情報検索 do JLPT.',
    slides: [
      { type: 'intro', sensei: 'No JLPT, a prova de leitura tem 情報検索 (info retrieval): você lê um aviso, cartaz ou horário e responde perguntas específicas. A resposta tá no texto — é só achar!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Estratégia: leia a pergunta primeiro, depois procure a informação no texto. Palavras-chave ajudam:',
        japanese: '{質問|しつもん}：{会議|かいぎ}は何時からですか？\n【掲示】{会議|かいぎ}は3{時|じ}からです。{場所|ばしょ}は2{階|かい}の{会議室|かいぎしつ}です。',
        romaji: 'Shitsumon: Kaigi wa nanji kara desu ka? Keiji: Kaigi wa 3-ji kara desu. Basho wa 2-kai no kaigishitsu desu.',
        translation: 'Pergunta: A que horas começa a reunião? Aviso: A reunião é às 3h. O local é a sala de reuniões do 2º andar.',
        highlight: '何時から・3時から',
        note: '何時から = a que horas. 3時から = às 3h. A resposta é 3時.',
      },
      {
        type: 'table',
        sensei: 'Palavras úteis em avisos:',
        rows: [
          ['{時間|じかん}、{時|じ}、{分|ぷん}', 'Horário'],
          ['{場所|ばしょ}、{階|かい}', 'Local, andar'],
          ['{休|やす}み、{休業|きゅうぎょう}', 'Fechado, folga'],
          ['{変更|へんこう}、{中止|ちゅうし}', 'Alteração, cancelamento'],
          ['{必要|ひつよう}、{予約|よやく}', 'Necessário, reserva'],
        ],
      },
      {
        type: 'example',
        sensei: 'Exemplos de perguntas típicas:',
        examples: [
          { japanese: '【掲示】{図書館|としょかん}は{月曜|げつよう}が{休|やす}みです。→ {質問|しつもん}：いつ{休|やす}み？', romaji: 'Toshokan wa getsuyou ga yasumi desu. → Itsu yasumi?', translation: 'Biblioteca fecha às segundas. → Quando fecha? Resposta: 月曜' },
          { japanese: '【掲示】{新|あたら}しい{店|みせ}が{開|ひら}きました。{予約|よやく}が{必要|ひつよう}です。→ 何が{必要|ひつよう}？', romaji: 'Atarashii mise ga hirakimashita. Yoyaku ga hitsuyou desu. → Nani ga hitsuyou?', translation: 'Nova loja abriu. Reserva necessária. → O que é necessário? Resposta: 予約' },
        ],
      },
      {
        type: 'tip',
        sensei: 'Dica: ignore o que não importa. Se a pergunta é "a que horas?", procure 時 ou 分 no texto. Se é "onde?", procure 場所 ou 階.',
        japanese: null,
        translation: null,
        note: 'No exame, o texto pode ter muita informação. Foque só no que a pergunta pede!',
      },
    ],
    quiz: [
      { question: '【掲示】{会議|かいぎ}は3{時|じ}からです。{会議|かいぎ}は何時からですか？', options: ['2時', '3時', '4時', '5時'], correctIdx: 1, explanation: '3時から = a partir das 3h.' },
      { question: '【掲示】{図書館|としょかん}は{月曜|げつよう}が{休|やす}みです。いつ{休|やす}みですか？', options: ['日曜', '月曜', '土曜', '金曜'], correctIdx: 1, explanation: '月曜が休み = segunda é fechado.' },
      { question: '【掲示】{予約|よやく}が{必要|ひつよう}です。何が{必要|ひつよう}ですか？', options: ['Cartão', 'Reserva', 'Dinheiro', 'Documento'], correctIdx: 1, explanation: '{予約|よやく} = reserva.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 1: Forma て (Conectando ações)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-te-form',
    title: 'Forma て — Conectando Ações',
    jlptLevel: 'N4',
    icon: '🔗',
    description: 'A forma て é uma das mais versáteis do japonês. Aprenda a conectar ações e pedir permissão.',
    slides: [
      {
        type: 'intro',
        sensei: 'A forma て é uma das mais úteis do japonês! "Acordo, lavo o rosto e como." "Posso sentar aqui?" "Tô estudando agora." — tudo usa て. Vale a pena dominar!',
        japanese: null,
        translation: null,
      },
      {
        type: 'concept',
        sensei: 'A forma て conecta duas ou mais ações em sequência:',
        japanese: '{起|お}きて、{顔|かお}を{洗|あら}って、{朝|あさ}ごはんを{食|た}べます。',
        romaji: 'Okite, kao wo aratte, asagohan wo tabemasu.',
        translation: 'Acordo, lavo o rosto e como o café da manhã.',
        highlight: 'て',
        note: 'A ordem das ações importa! A forma て indica "e depois".',
      },
      {
        type: 'table',
        sensei: 'Como formar a forma て (Grupo 1 — verbos em U):',
        rows: [
          ['く → いて', '{書|か}く → {書|か}いて (escrever)'],
          ['ぐ → いで', '{泳|およ}ぐ → {泳|およ}いで (nadar)'],
          ['す → して', '{話|はな}す → {話|はな}して (falar)'],
          ['む/ぬ/ぶ → んで', '{読|よ}む → {読|よ}んで (ler)'],
          ['う/つ/る → って', '{買|か}う → {買|か}って (comprar)'],
        ],
      },
      {
        type: 'table',
        sensei: 'Grupo 2 (verbos em RU) e irregulares:',
        rows: [
          ['Grupo 2: る → て', '{食|た}べる → {食|た}べて'],
          ['Grupo 2: る → て', '{見|み}る → {見|み}て'],
          ['Irregular: する', 'する → して'],
          ['Irregular: くる', 'くる → きて'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Forma て + もいいですか = pedir permissão:',
        japanese: 'ここに{座|すわ}ってもいいですか？',
        romaji: 'Koko ni suwatte mo ii desu ka?',
        translation: 'Posso sentar aqui?',
        highlight: 'てもいいですか',
        note: 'Resposta positiva: はい、どうぞ (Sim, fique à vontade)\nResposta negativa: すみません、ちょっと... (Desculpe, é um pouco...)',
      },
      {
        type: 'concept',
        sensei: 'Forma て + います = ação em progresso:',
        japanese: '{今|いま}、{勉強|べんきょう}しています。',
        romaji: 'Ima, benkyou shite imasu.',
        translation: 'Estou estudando agora.',
        highlight: 'ています',
        note: 'Equivalente ao gerúndio em português (-ndo).',
      },
    ],
    quiz: [
      {
        question: 'Qual é a forma て de {食|た}べる (taberu)?',
        options: ['{食|た}べって', '{食|た}べて', '{食|た}べいて', '{食|た}べんで'],
        correctIdx: 1,
        explanation: 'Verbos do Grupo 2 (em -ru): simplesmente troca-se る por て.',
      },
      {
        question: '【文の組み立て】"Posso sentar aqui?" — qual a ordem correta?',
        options: ['ここに{座|すわ}ってもいいですか？', '{座|すわ}ってもここにいいですか？', 'ここにいいですか{座|すわ}っても？', 'いいですかここに{座|すわ}って？'],
        correctIdx: 0,
        explanation: 'Local (ここに) + forma て + もいいですか. Ordem: onde + verbo て + permissão.',
      },
      {
        question: '"{写真|しゃしん}を{撮|と}ってもいいですか？" significa:',
        options: [
          'Eu tirei uma foto',
          'Posso tirar uma foto?',
          'Não tire fotos',
          'Eu gosto de tirar fotos',
        ],
        correctIdx: 1,
        explanation: 'てもいいですか é a estrutura para pedir permissão.',
      },
      {
        question: '"テレビを{見|み}ています" está em qual tempo/aspecto?',
        options: ['Passado', 'Futuro', 'Presente contínuo', 'Imperativo'],
        correctIdx: 2,
        explanation: 'ています indica ação em progresso — equivale ao presente contínuo em português.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 2: Forma た (Passado dos verbos)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-ta-form',
    title: 'Forma た — Passado dos Verbos',
    jlptLevel: 'N4',
    icon: '⏮️',
    description: 'A forma た é a base do passado. Use em condicionais e experiências.',
    slides: [
      { type: 'intro', sensei: 'A forma た é igual à forma て, só que troca て por た. Ela é a base do passado e aparece em várias expressões importantes!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Forma た = mesma regra da forma て, trocando て→た:',
        japanese: '{食|た}べる → {食|た}べた\n{行|い}く → {行|い}った\n{買|か}う → {買|か}った',
        romaji: 'taberu → tabeta, iku → itta, kau → katta',
        translation: null,
        highlight: 'た',
        note: 'Grupo 2: る→た. Grupo 1: segue as mesmas regras da forma て.',
      },
      {
        type: 'concept',
        sensei: 'たことがある = já fiz (experiência):',
        japanese: '{日本|にほん}に{行|い}ったことがあります。',
        romaji: 'Nihon ni itta koto ga arimasu.',
        translation: 'Já fui ao Japão.',
        highlight: 'たことがある',
        note: 'Experiência de vida. "Já comi sushi" = {寿司|すし}を{食|た}べたことがある.',
      },
      {
        type: 'concept',
        sensei: 'たあとで = depois de fazer:',
        japanese: '{食|た}べたあとで、{歯|は}を{磨|みが}きます。',
        romaji: 'Tabeta ato de, ha wo migakimasu.',
        translation: 'Depois de comer, escovo os dentes.',
        highlight: 'たあとで',
        note: 'Ordem: primeiro comer, depois escovar.',
      },
      {
        type: 'example',
        sensei: 'No dia a dia:',
        examples: [
          { japanese: '{富士山|ふじさん}に{登|のぼ}ったことがありますか？', romaji: 'Fujisan ni nobotta koto ga arimasu ka?', translation: 'Você já subiu o Monte Fuji?' },
          { japanese: '{仕事|しごと}が{終|お}わったあとで、{飲|の}みに{行|い}きましょう。', romaji: 'Shigoto ga owatta ato de, nomi ni ikimashou.', translation: 'Depois que o trabalho acabar, vamos tomar um drink.' },
        ],
      },
    ],
    quiz: [
      { question: 'たことがある significa:', options: ['Vou fazer', 'Já fiz (experiência)', 'Não fiz', 'Estou fazendo'], correctIdx: 1, explanation: 'たことがある = já fiz alguma vez na vida.' },
      { question: 'Qual é a forma た de {行|い}く?', options: ['{行|い}きた', '{行|い}って', '{行|い}った', '{行|い}くた'], correctIdx: 2, explanation: '{行|い}く é irregular: いって→いった.' },
      { question: 'たあとで indica:', options: ['Antes de', 'Durante', 'Depois de', 'Em vez de'], correctIdx: 2, explanation: 'たあとで = depois de fazer a ação.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 3: Forma Potencial (poder fazer)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-potential',
    title: 'Forma Potencial — Poder Fazer',
    jlptLevel: 'N4',
    icon: '💪',
    description: 'Diga que consegue ou não consegue fazer algo.',
    slides: [
      { type: 'intro', sensei: 'Pra dizer "consigo falar japonês" ou "não consigo nadar", use a forma potencial. É tipo "poder" em português!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Grupo 2: る → られる. Grupo 1: う → える:',
        japanese: '{食|た}べる → {食|た}べられる\n{話|はな}す → {話|はな}せる\n{読|よ}む → {読|よ}める',
        romaji: 'taberu → taberareru, hanasu → hanaseru, yomu → yomeru',
        translation: null,
        highlight: 'られる / える',
        note: 'Pode comer = {食|た}べられる. Pode falar = {話|はな}せる.',
      },
      {
        type: 'concept',
        sensei: 'する → できる. くる → こられる:',
        japanese: '{日本語|にほんご}が{話|はな}せます。',
        romaji: 'Nihongo ga hanasemasu.',
        translation: 'Consigo falar japonês.',
        highlight: 'が',
        note: 'Na forma potencial, o objeto usa が em vez de を.',
      },
      {
        type: 'example',
        sensei: 'Frases úteis:',
        examples: [
          { japanese: 'すしが{食|た}べられますか？', romaji: 'Sushi ga taberaremasu ka?', translation: 'Você consegue comer sushi?' },
          { japanese: 'はい、{食|た}べられます。', romaji: 'Hai, taberaremasu.', translation: 'Sim, consigo.' },
          { japanese: '{漢字|かんじ}が{読|よ}めません。', romaji: 'Kanji ga yomemasen.', translation: 'Não consigo ler kanji.' },
        ],
      },
    ],
    quiz: [
      { question: 'Qual é a forma potencial de {話|はな}す?', options: ['{話|はな}される', '{話|はな}せる', '{話|はな}すれる', '{話|はな}すられる'], correctIdx: 1, explanation: 'Verbos う: す→せる. {話|はな}せる = pode falar.' },
      { question: 'Na forma potencial, o objeto usa:', options: ['を', 'が', 'に', 'で'], correctIdx: 1, explanation: 'Potencial: Xができる (consigo fazer X). が marca o objeto.' },
      { question: '{読|よ}めません significa:', options: ['Leu', 'Vai ler', 'Não consegue ler', 'Consegue ler'], correctIdx: 2, explanation: '{読|よ}める = pode ler. ません = negação.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 4: Condicionais たら e ば
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-conditionals',
    title: 'Condicionais: たら e ば',
    jlptLevel: 'N4',
    icon: '🔀',
    description: 'Se fizer X, acontece Y. Condições do dia a dia.',
    slides: [
      { type: 'intro', sensei: 'Se chover, levo guarda-chuva. Se tiver tempo, vou. Em japonês tem たら e ば pra isso. たら é o mais comum no dia a dia!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'たら = se (forma た + ら):',
        japanese: '{雨|あめ}が{降|ふ}ったら、{家|いえ}にいます。',
        romaji: 'Ame ga futtara, ie ni imasu.',
        translation: 'Se chover, fico em casa.',
        highlight: 'たら',
        note: 'Primeira parte: forma た + ら. Segunda parte: resultado.',
      },
      {
        type: 'concept',
        sensei: 'ば = se (para verbos e adjetivos):',
        japanese: '{時間|じかん}があれば、{行|い}きます。',
        romaji: 'Jikan ga areba, ikimasu.',
        translation: 'Se tiver tempo, vou.',
        highlight: 'ば',
        note: 'ある → あれば. {行|い}く → {行|い}けば. ば é um pouco mais formal que たら.',
      },
      {
        type: 'example',
        sensei: 'No cotidiano:',
        examples: [
          { japanese: '{安|やす}かったら、{買|か}います。', romaji: 'Yasukattara, kaimasu.', translation: 'Se for barato, compro.' },
          { japanese: '{元気|げんき}なら、{会|あ}いましょう。', romaji: 'Genki nara, aimashou.', translation: 'Se estiver bem, a gente se vê.' },
          { japanese: 'トイレに{行|い}ってもいいですか？ — はい、どうぞ。', romaji: 'Toire ni itte mo ii desu ka? — Hai, douzo.', translation: 'Posso ir ao banheiro? — Sim, pode.' },
        ],
      },
    ],
    quiz: [
      { question: 'たら vem de qual forma verbal?', options: ['Forma ます', 'Forma て', 'Forma た', 'Forma ない'], correctIdx: 2, explanation: 'たら = forma た + ら.' },
      { question: '{時間|じかん}があれば significa:', options: ['Não tenho tempo', 'Se tiver tempo', 'Tinha tempo', 'Tenho muito tempo'], correctIdx: 1, explanation: 'あれば = se tiver/houver.' },
      { question: 'Para adjetivos な, qual condicional?', options: ['たら', 'ければ', 'なら', 'てば'], correctIdx: 2, explanation: '{元気|げんき}なら = se estiver bem. な + ら = なら.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 7: Verbos Transitivos e Intransitivos
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-transitive-intransitive',
    title: 'Verbos Transitivos e Intransitivos',
    jlptLevel: 'N4',
    icon: '🔄',
    description: 'A porta abriu vs Eu abri a porta. Tema essencial do JLPT N4!',
    slides: [
      { type: 'intro', sensei: '"Eu abri a porta" vs "a porta abriu." Em português é o mesmo verbo. Em japonês são verbos diferentes! Transitivo = você faz. Intransitivo = acontece sozinho. Parece estranho mas faz sentido.', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Pares comuns (transitivo → intransitivo):',
        rows: [
          ['{開|あ}ける / {開|あ}く', 'Abrir (alguém abre) / Abrir (abre sozinho)'],
          ['{閉|し}める / {閉|し}まる', 'Fechar / Fechar'],
          ['{付|つ}ける / {付|つ}く', 'Ligar / Ligar (acender)'],
          ['{消|け}す / {消|き}える', 'Apagar / Apagar'],
          ['{入|い}れる / {入|はい}る', 'Colocar dentro / Entrar'],
          ['{出|だ}す / {出|で}る', 'Tirar/Sair / Sair'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Transitivo = を (objeto). Intransitivo = が (sujeito):',
        japanese: '{私|わたし}がドアを{開|あ}けました。\nドアが{開|あ}きました。',
        romaji: 'Watashi ga doa wo akemashita. Doa ga akimashita.',
        translation: 'Eu abri a porta. A porta abriu.',
        highlight: 'を / が',
        note: 'Transitivo: 誰かがXを〜. Intransitivo: Xが〜.',
      },
      {
        type: 'example',
        sensei: 'No exame:',
        examples: [
          { japanese: '{電気|でんき}を{付|つ}けてください。', romaji: 'Denki wo tsukete kudasai.', translation: 'Por favor acenda a luz.' },
          { japanese: '{窓|まど}が{開|あ}いています。', romaji: 'Mado ga aite imasu.', translation: 'A janela está aberta.' },
        ],
      },
    ],
    quiz: [
      { question: 'Transitivo tem:', options: ['Só sujeito', 'Objeto (を)', 'Lugar', 'Tempo'], correctIdx: 1, explanation: 'Transitivo = verbo com objeto (を).' },
      { question: 'ドアが{開|あ}いた =', options: ['Eu abri a porta', 'A porta abriu', 'A porta está fechada', 'Abra a porta'], correctIdx: 1, explanation: 'が + intransitivo = algo aconteceu sozinho.' },
      { question: '{消|け}す é transitivo ou intransitivo?', options: ['Intransitivo', 'Transitivo', 'Os dois', 'Nenhum'], correctIdx: 1, explanation: '{消|け}す = apagar (alguém apaga). Transitivo.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 8: てみる、くれる、あげる、もらう
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-te-miru-kureru',
    title: 'てみる、くれる、あげる、もらう',
    jlptLevel: 'N4',
    icon: '🎁',
    description: 'Experimentar. Dar e receber. Direção da ação.',
    slides: [
      { type: 'intro', sensei: '"Experimenta esse prato!" "Meu amigo me emprestou o livro." "Minha mãe me comprou." — てみる (experimentar) e くれる/あげる/もらう (quem dá pra quem). Super importante no dia a dia!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'てみる = experimentar, tentar fazer:',
        japanese: 'この{料理|りょうり}を{食|た}べてみてください。',
        romaji: 'Kono ryouri wo tabete mite kudasai.',
        translation: 'Por favor experimente este prato.',
        highlight: 'てみる',
        note: 'Forma て + みる. "Tentar fazer" para ver o resultado.',
      },
      {
        type: 'concept',
        sensei: 'くれる = alguém me dá (favorece a MIM). あげる = eu dou a alguém:',
        japanese: '{友達|ともだち}が{本|ほん}を{貸|か}してくれました。\n{私|わたし}が{彼|かれ}に{本|ほん}を{貸|か}してあげました。',
        romaji: 'Tomodachi ga hon wo kashite kuremashita. Watashi ga kare ni hon wo kashite agemashita.',
        translation: 'Meu amigo me emprestou o livro. Eu emprestei o livro pra ele.',
        highlight: 'くれる / あげる',
        note: 'くれる = direção pra mim. あげる = direção pra fora (eu → outro).',
      },
      {
        type: 'concept',
        sensei: 'もらう = receber de alguém:',
        japanese: '{母|はは}に{本|ほん}を{買|か}ってもらいました。',
        romaji: 'Haha ni hon wo katte moraimashita.',
        translation: 'Recebi um livro da minha mãe. (Ela comprou pra mim)',
        highlight: 'もらう',
        note: 'Xに〜てもらう = receber de X (X fez pra mim).',
      },
    ],
    quiz: [
      { question: 'てみる significa:', options: ['Terminar', 'Experimentar/tentar', 'Começar', 'Evitar'], correctIdx: 1, explanation: 'てみる = experimentar, tentar fazer.' },
      { question: 'くれる indica direção pra quem?', options: ['Pra outra pessoa', 'Pra mim', 'Pra todos', 'Pra ninguém'], correctIdx: 1, explanation: 'くれる = alguém me dá (favorece a mim).' },
      { question: 'Xに〜てもらう =', options: ['Eu faço pra X', 'Recebo de X', 'X recebe', 'Ninguém faz'], correctIdx: 1, explanation: 'もらう = receber. Xに = de X.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 9: ところ e ながら
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-tokoro-nagara',
    title: 'ところ e ながら — Momento e Simultaneidade',
    jlptLevel: 'N4',
    icon: '⏳',
    description: 'Estava prestes a. Enquanto. Momento da ação.',
    slides: [
      { type: 'intro', sensei: '"Tô saindo agora." "Acabei de chegar." "Estudo enquanto ouço música." ところ (momento) e ながら (enquanto) — duas formas super úteis pro dia a dia!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ところ = momento da ação:',
        japanese: '{今|いま}から{出|で}かけるところです。\n{帰|かえ}ったところです。',
        romaji: 'Ima kara dekakeru tokoro desu. Kaetta tokoro desu.',
        translation: 'Estou prestes a sair. Acabei de chegar.',
        highlight: 'ところ',
        note: 'Verbo dicional + ところ = prestes a. Verbo た + ところ = acabei de.',
      },
      {
        type: 'concept',
        sensei: 'ながら = enquanto (duas ações simultâneas):',
        japanese: '音楽を{聞|き}きながら{勉強|べんきょう}します。',
        romaji: 'Ongaku wo kikinagara benkyou shimasu.',
        translation: 'Estudo enquanto ouço música.',
        highlight: 'ながら',
        note: 'Verbo ます sem ます + ながら. A ação principal é a segunda.',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: '{食|た}べているところです。', romaji: 'Tabete iru tokoro desu.', translation: 'Estou comendo agora.' },
          { japanese: '{歩|ある}きながら{話|はな}しましょう。', romaji: 'Arukinagara hanashimashou.', translation: 'Vamos conversar enquanto caminhamos.' },
        ],
      },
    ],
    quiz: [
      { question: '出かけるところ =', options: ['Já saiu', 'Estava prestes a sair', 'Não vai sair', 'Saiu há muito'], correctIdx: 1, explanation: 'Dicional + ところ = prestes a.' },
      { question: '帰ったところ =', options: ['Vai chegar', 'Acabei de chegar', 'Não chegou', 'Chegou há muito'], correctIdx: 1, explanation: 'た + ところ = acabei de.' },
      { question: 'ながら indica:', options: ['Antes de', 'Depois de', 'Enquanto (simultâneo)', 'Em vez de'], correctIdx: 2, explanation: 'ながら = enquanto, simultâneo.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 10: そうだ (hearsay) e らしい
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-souda-rashii',
    title: 'そうだ (hearsay) e らしい',
    jlptLevel: 'N4',
    icon: '👂',
    description: 'Ouvi que... Parece que... Informação de terceiros.',
    slides: [
      { type: 'intro', sensei: 'Ouvi que... Parece que... Informação que não é sua. そうだ (hearsay) e らしい (parece que, baseado em evidência) caem no N4!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'そうだ = ouvi que (hearsay, informação de terceiros):',
        japanese: 'あした{雨|あめ}だそうです。',
        romaji: 'Ashita ame da sou desu.',
        translation: 'Ouvi que amanhã vai chover.',
        highlight: 'そうだ',
        note: 'Forma 普通体 + そうです. だそうです / そうです / たそうです.',
      },
      {
        type: 'concept',
        sensei: 'らしい = parece que (baseado em evidência ou rumor):',
        japanese: '{彼|かれ}は{先生|せんせい}らしいです。',
        romaji: 'Kare wa sensei rashii desu.',
        translation: 'Parece que ele é professor.',
        highlight: 'らしい',
        note: 'Substantivo + らしい. Verbo: forma dicional + らしい.',
      },
      {
        type: 'table',
        sensei: 'Diferença: そうだ vs らしい',
        rows: [
          ['そうだ', 'Ouvi dizer (informação de alguém)'],
          ['らしい', 'Parece que (evidência, rumor, característico)'],
        ],
      },
    ],
    quiz: [
      { question: 'そうだ (hearsay) indica:', options: ['Minha opinião', 'Informação que ouvi', 'Certeza', 'Pedido'], correctIdx: 1, explanation: 'そうだ = ouvi dizer.' },
      { question: 'らしい indica:', options: ['Certeza absoluta', 'Parece que (evidência)', 'Proibição', 'Passado'], correctIdx: 1, explanation: 'らしい = parece que, baseado em evidência.' },
      { question: 'あした雨だそうです =', options: ['Tenho certeza que chove', 'Ouvi que amanhã chove', 'Não vai chover', 'Choveu ontem'], correctIdx: 1, explanation: 'です → だそうです (hearsay).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 11: ことにする e ことになる
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-koto-ni-suru',
    title: 'ことにする e ことになる',
    jlptLevel: 'N4',
    icon: '📌',
    description: 'Decidi fazer. Ficou decidido que. Decisão pessoal vs externa.',
    slides: [
      { type: 'intro', sensei: 'Decidi parar de fumar. Ficou decidido que mudamos. ことにする = decisão PESSOAL. ことになる = decisão EXTERNA/resultado. N4!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ことにする = decidir (eu decido):',
        japanese: '{来月|らいげつ}から{運動|うんどう}することにしました。',
        romaji: 'Raigetsu kara undou suru koto ni shimashita.',
        translation: 'Decidi começar a me exercitar no mês que vem.',
        highlight: 'ことにする',
        note: 'Verbo dicional + ことにする. Decisão pessoal.',
      },
      {
        type: 'concept',
        sensei: 'ことになる = ficar decidido (resultado, circunstância):',
        japanese: '来{週|しゅう}{会議|かいぎ}があることになりました。',
        romaji: 'Raishuu kaigi ga aru koto ni narimashita.',
        translation: 'Ficou decidido que teremos reunião na semana que vem.',
        highlight: 'ことになる',
        note: 'ことになる = não foi minha decisão pessoal, foi resultado/circunstância.',
      },
      {
        type: 'example',
        sensei: 'Comparação:',
        examples: [
          { japanese: '{私|わたし}は{日本|にほん}に{行|い}くことにしました。', romaji: 'Watashi wa Nihon ni iku koto ni shimashita.', translation: 'Decidi ir ao Japão.' },
          { japanese: '{転勤|てんきん}することになりました。', romaji: 'Tenkin suru koto ni narimashita.', translation: 'Ficou decidido que serei transferido.' },
        ],
      },
    ],
    quiz: [
      { question: 'ことにする = decisão:', options: ['Externa', 'Pessoal', 'Coletiva', 'Nenhuma'], correctIdx: 1, explanation: 'ことにする = eu decido.' },
      { question: 'ことになる = decisão:', options: ['Minha', 'Externa/resultado', 'Impossível', 'Futura'], correctIdx: 1, explanation: 'ことになる = ficou decidido (circunstância).' },
      { question: 'することにしました =', options: ['Vou decidir', 'Decidi fazer', 'Não decidi', 'Alguém decidiu'], correctIdx: 1, explanation: 'ことにする = decidir (pessoal).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 12: ような — Como, Parece
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-you-na',
    title: 'ような — Como, Parece',
    jlptLevel: 'N4',
    icon: '🔍',
    description: 'Como um sonho. Parece que. Similitude.',
    slides: [
      { type: 'intro', sensei: 'Como um sonho. Parece um pássaro. ような = como, parece. Usado pra comparar e dar exemplos. N4!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ような = como, parece (substantivo + のような):',
        japanese: '{夢|ゆめ}のような{話|はなし}です。',
        romaji: 'Yume no you na hanashi desu.',
        translation: 'É uma história como um sonho.',
        highlight: 'ような',
        note: 'XのようなY = Y como X. ような vem de ようだ.',
      },
      {
        type: 'concept',
        sensei: 'ように = como (antes de verbo), para que:',
        japanese: '{先生|せんせい}のように{話|はな}したい。',
        romaji: 'Sensei no you ni hanashitai.',
        translation: 'Quero falar como o professor.',
        highlight: 'ように',
        note: 'Xのように + verbo = fazer como X. ように também = para que (objetivo).',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: '{彼|かれ}は{子供|こども}のような{顔|かお}をしています。', romaji: 'Kare wa kodomo no you na kao wo shite imasu.', translation: 'Ele tem rosto de criança.' },
          { japanese: 'この{問題|もんだい}は{難|むずか}しいような{気|き}がします。', romaji: 'Kono mondai wa muzukashii you na ki ga shimasu.', translation: 'Sinto que este problema parece difícil.' },
        ],
      },
    ],
    quiz: [
      { question: 'ような indica:', options: ['Causa', 'Similitude (como)', 'Futuro', 'Proibição'], correctIdx: 1, explanation: 'ような = como, parece.' },
      { question: '{夢|ゆめ}のような =', options: ['É um sonho', 'Como um sonho', 'Não é sonho', 'Sonhei'], correctIdx: 1, explanation: 'Xのような = como X.' },
      { question: 'Xのように + verbo =', options: ['Fazer antes de X', 'Fazer como X', 'Não fazer X', 'Fazer depois de X'], correctIdx: 1, explanation: 'ように = como (modo).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 13: やすい、にくい、すぎる
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-yasui-nikui-sugiru',
    title: 'やすい、にくい、すぎる',
    jlptLevel: 'N4',
    icon: '📊',
    description: 'Fácil de. Difícil de. Demais. N4 essencial!',
    slides: [
      { type: 'intro', sensei: '"Esses sapatos são fáceis de caminhar." "Essa letra é difícil de ler." "Comi demais!" — やすい, にくい e すぎる transformam verbos em adjetivos. Você vai ouvir o tempo todo!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Verbo ます-stem + やすい = fácil de fazer:',
        japanese: 'この{靴|くつ}は{歩|ある}きやすいです。',
        romaji: 'Kono kutsu wa arukiyasui desu.',
        translation: 'Estes sapatos são fáceis de caminhar.',
        highlight: 'やすい',
        note: '{食|た}べます→{食|た}べやすい. {書|か}きます→{書|か}きやすい.',
      },
      {
        type: 'concept',
        sensei: 'Verbo ます-stem + にくい = difícil de fazer:',
        japanese: 'この{字|じ}は{読|よ}みにくいです。',
        romaji: 'Kono ji wa yominikui desu.',
        translation: 'Esta letra é difícil de ler.',
        highlight: 'にくい',
        note: '{食|た}べにくい = difícil de comer. にくい é adjetivo い!',
      },
      {
        type: 'concept',
        sensei: 'Verbo ます-stem / adj (sem い) + すぎる = demais:',
        japanese: '{食|た}べすぎました。\n{高|たか}すぎます。',
        romaji: 'Tabesugimashita. Takasugimasu.',
        translation: 'Comi demais. É caro demais.',
        highlight: 'すぎる',
        note: 'すぎる = excesso. Adjetivo い: tira い + すぎる. な-adj: きれいすぎる.',
      },
    ],
    quiz: [
      { question: 'やすい indica:', options: ['Difícil', 'Fácil de fazer', 'Impossível', 'Raro'], correctIdx: 1, explanation: 'やすい = fácil de fazer.' },
      { question: 'にくい indica:', options: ['Fácil', 'Difícil de fazer', 'Rápido', 'Lento'], correctIdx: 1, explanation: 'にくい = difícil de fazer.' },
      { question: '{食|た}べすぎた =', options: ['Não comeu', 'Comeu demais', 'Comeu pouco', 'Vai comer'], correctIdx: 1, explanation: 'すぎる = demais, excesso.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 14: ようにする e てはいけない
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-you-ni-suru-cha-ikenai',
    title: 'ようにする e ちゃいけない',
    jlptLevel: 'N4',
    icon: '⚠️',
    description: 'Tentar fazer. Não pode (proibição informal).',
    slides: [
      { type: 'intro', sensei: 'Tento não esquecer. Não pode fazer isso! ようにする (tentar garantir) e ちゃいけない/てはいけない (proibição). N4!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ようにする = tentar fazer, garantir que:',
        japanese: '{忘|わす}れないようにしています。',
        romaji: 'Wasurenai you ni shite imasu.',
        translation: 'Tento não esquecer. / Estou me esforçando pra não esquecer.',
        highlight: 'ようにする',
        note: 'Verbo dicional/ない + ようにする. "Fazer de modo a..."',
      },
      {
        type: 'concept',
        sensei: 'てはいけない / ちゃいけない = não pode (proibição):',
        japanese: 'ここで{煙草|たばこ}を{吸|す}ってはいけません。\n{吸|す}っちゃだめ！',
        romaji: 'Koko de tabako wo sutte wa ikemasen. Sutcha dame!',
        translation: 'Não pode fumar aqui. Não pode fumar! (informal)',
        highlight: 'てはいけない',
        note: 'てはいけない = formal. ちゃいけない/ちゃだめ = casual (ては→ちゃ).',
      },
    ],
    quiz: [
      { question: 'ようにする indica:', options: ['Proibição', 'Tentar fazer/garantir', 'Passado', 'Futuro'], correctIdx: 1, explanation: 'ようにする = tentar garantir.' },
      { question: 'ちゃいけない é ___ de てはいけない.', options: ['Forma formal', 'Forma casual', 'Oposto', 'Sinônimo exato'], correctIdx: 1, explanation: 'ちゃ = contração de ては. Casual.' },
      { question: '{吸|す}っちゃだめ =', options: ['Pode fumar', 'Não pode fumar', 'Fumou', 'Vai fumar'], correctIdx: 1, explanation: 'ちゃだめ = não pode (casual).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 5: ておく e てしまう
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-te-oku-shimau',
    title: 'ておく e てしまう',
    jlptLevel: 'N4',
    icon: '📌',
    description: 'Fazer de antemão e acabar fazendo (com arrependimento ou conclusão).',
    slides: [
      { type: 'intro', sensei: 'ておく = fazer de antemão, preparar. てしまう = acabar fazendo (às vezes com sensação de "droga, fiz"). Super úteis!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ておく = fazer de antemão, deixar pronto:',
        japanese: 'あしたの{準備|じゅんび}をしておきます。',
        romaji: 'Ashita no junbi wo shite okimasu.',
        translation: 'Vou preparar as coisas de amanhã.',
        highlight: 'ておく',
        note: 'Fazer agora pra não ter trabalho depois.',
      },
      {
        type: 'concept',
        sensei: 'てしまう = acabar fazendo (conclusão ou arrependimento):',
        japanese: 'ケーキを{全部|ぜんぶ}{食|た}べてしまいました。',
        romaji: 'Keeki wo zenbu tabete shimaimashita.',
        translation: 'Acabei comendo o bolo todo. (ops!)',
        highlight: 'てしまう',
        note: 'Pode ser neutro (concluí) ou com sensação de "fui e fiz" / arrependimento.',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: '{予約|よやく}しておきました。', romaji: 'Yoyaku shite okimashita.', translation: 'Já reservei. (fiz de antemão)' },
          { japanese: '{電車|でんしゃ}に{乗|の}り{遅|おく}れてしまった。', romaji: 'Densha ni nori okurete shimatta.', translation: 'Acabei perdendo o trem. (arrependimento)' },
        ],
      },
    ],
    quiz: [
      { question: 'ておく indica:', options: ['Fazer depois', 'Fazer de antemão', 'Não fazer', 'Fazer errado'], correctIdx: 1, explanation: 'ておく = preparar, fazer antes.' },
      { question: 'てしまう pode expressar:', options: ['Dúvida', 'Arrependimento ou conclusão', 'Pergunta', 'Convite'], correctIdx: 1, explanation: 'てしまう = acabar fazendo, às vezes com "droga".' },
      { question: '{予約|よやく}しておく significa:', options: ['Vou reservar depois', 'Reservei de antemão', 'Não reservei', 'Cancelar reserva'], correctIdx: 1, explanation: 'しておく = fazer de antemão.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N4 – LIÇÃO 6: かもしれない e そう (Incerteza e Aparência)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n4-maybe-seems',
    title: 'かもしれない e そう — Talvez e Parece',
    jlptLevel: 'N4',
    icon: '🤔',
    description: 'Expresse incerteza e aparência: talvez, parece que.',
    slides: [
      { type: 'intro', sensei: 'Talvez chova. Parece gostoso. Em japonês: かもしれない (talvez) e そう (parece). Essas duas vão aparecer o tempo todo!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'かもしれない = talvez (forma dicional + かもしれない):',
        japanese: '{明日|あした}は{雨|あめ}かもしれません。',
        romaji: 'Ashita wa ame kamoshiremasen.',
        translation: 'Amanhã talvez chova.',
        highlight: 'かもしれない',
        note: 'Verbo/adj + かもしれない. ない vira ません na forma educada.',
      },
      {
        type: 'concept',
        sensei: 'そう = parece (adjetivo い sem い + そう / adj な + そう):',
        japanese: 'おいしそう！\n{元気|げんき}そうですね。',
        romaji: 'Oishisou! Genki sou desu ne.',
        translation: 'Parece gostoso! Parece que está bem, né?',
        highlight: 'そう',
        note: 'おいしい → おいしそう. {元気|げんき} → {元気|げんき}そう. Cuidado: ない → なさそう.',
      },
      {
        type: 'example',
        sensei: 'No cotidiano:',
        examples: [
          { japanese: '{彼|かれ}は{来|こ}ないかもしれません。', romaji: 'Kare wa konai kamoshiremasen.', translation: 'Talvez ele não venha.' },
          { japanese: 'この{店|みせ}、{安|やす}そう。', romaji: 'Kono mise, yasasou.', translation: 'Essa loja parece barata.' },
        ],
      },
    ],
    quiz: [
      { question: 'かもしれない significa:', options: ['Com certeza', 'Talvez', 'Nunca', 'Sempre'], correctIdx: 1, explanation: 'かもしれない = talvez.' },
      { question: 'おいしそう =', options: ['É gostoso', 'Parece gostoso', 'Não é gostoso', 'Era gostoso'], correctIdx: 1, explanation: '〜そう = parece.' },
      { question: 'Para adjetivo い, como formar そう?', options: ['い + そう', 'Tira い + そう', 'な + そう', 'Não usa'], correctIdx: 1, explanation: 'おいしい → おいし + そう (tira o い).' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // N3 — Intermediário
  // ═══════════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 1: Conectores e Sequência
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-connectors',
    title: 'Conectores: ので、から、のに',
    jlptLevel: 'N3',
    icon: '🔗',
    description: 'Ligue ideias com causa, razão e contraste.',
    slides: [
      { type: 'intro', sensei: 'No N3 a gente começa a conectar frases de forma mais natural. ので (porque), から (porque), のに (mas/embora) — cada um tem seu jeito!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ので = porque (explicação objetiva, soa mais suave):',
        japanese: '{雨|あめ}が{降|ふ}っているので、{家|いえ}にいます。',
        romaji: 'Ame ga futte iru node, ie ni imasu.',
        translation: 'Como está chovendo, fico em casa.',
        highlight: 'ので',
        note: 'Verbo/adj + ので. Usa forma ます sem ます: {降|ふ}っている→{降|ふ}っているので.',
      },
      {
        type: 'concept',
        sensei: 'から = porque (mais direto, pode ser opinião):',
        japanese: 'おいしいから、{食|た}べてみて。',
        romaji: 'Oishii kara, tabete mite.',
        translation: 'É gostoso, então experimenta.',
        highlight: 'から',
        note: 'から é mais casual. ので é mais educado em situações formais.',
      },
      {
        type: 'concept',
        sensei: 'のに = mas/embora (contraste, surpresa):',
        japanese: '{勉強|べんきょう}したのに、{試験|しけん}に{落|お}ちた。',
        romaji: 'Benkyou shita noni, shiken ni ochita.',
        translation: 'Estudei, mas reprovei no exame.',
        highlight: 'のに',
        note: 'Esperava um resultado, veio outro. Forma た + のに ou dicional + のに.',
      },
      {
        type: 'concept',
        sensei: 'ながらも = embora, apesar de (concessão — diferente de ながら "enquanto"):',
        japanese: '{彼|かれ}は{若|わか}いながらも、{経験|けいけん}が{豊|ゆた}かです。',
        romaji: 'Kare wa wakai nagara mo, keiken ga yutaka desu.',
        translation: 'Embora seja jovem, tem muita experiência.',
        highlight: 'ながらも',
        note: '名詞/adj + ながらも = "embora seja X". Não confunda com ながら (enquanto fazendo). ながらも = contraste.',
      },
      {
        type: 'example',
        sensei: 'No dia a dia:',
        examples: [
          { japanese: '{遅|おそ}くなったので、もう{帰|かえ}ります。', romaji: 'Osoku natta node, mou kaerimasu.', translation: 'Como ficou tarde, já vou embora.' },
          { japanese: '{高|たか}いのに、{小|ちい}さい。', romaji: 'Takai noni, chiisai.', translation: 'É caro, mas é pequeno.' },
          { japanese: '{若|わか}いながらも、{責任|せきにん}がある。', romaji: 'Wakai nagara mo, sekinin ga aru.', translation: 'Embora seja jovem, tem responsabilidade.' },
        ],
      },
    ],
    quiz: [
      { question: 'ので é mais ___ que から em situações formais.', options: ['informal', 'educado', 'raro', 'direto'], correctIdx: 1, explanation: 'ので soa mais suave e educado.' },
      { question: 'のに expressa:', options: ['Causa', 'Contraste/surpresa', 'Futuro', 'Pedido'], correctIdx: 1, explanation: 'のに = mas/embora, contraste.' },
      { question: 'ながらも indica:', options: ['Simultaneidade (enquanto)', 'Concessão (embora)', 'Causa', 'Futuro'], correctIdx: 1, explanation: 'ながらも = embora, apesar de.' },
      { question: 'おいしいから =', options: ['Porque é gostoso', 'Embora seja gostoso', 'Se for gostoso', 'Não é gostoso'], correctIdx: 0, explanation: 'から = porque.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 2: ように e ために
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-you-ni-tame',
    title: 'ように e ために — Objetivo e Propósito',
    jlptLevel: 'N3',
    icon: '🎯',
    description: 'Para que... / A fim de...',
    slides: [
      { type: 'intro', sensei: 'ように e ために servem pra falar de objetivo: "pra poder fazer X", "a fim de Y". A diferença tá no tipo de verbo que vem antes!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ために = a fim de (verbo de ação + ために):',
        japanese: '{日本|にほん}に{行|い}くために、{貯金|ちょきん}しています。',
        romaji: 'Nihon ni iku tame ni, chokin shite imasu.',
        translation: 'Estou juntando dinheiro para ir ao Japão.',
        highlight: 'ために',
        note: 'O sujeito de ambas as ações é o mesmo. Verbo em forma dicional.',
      },
      {
        type: 'concept',
        sensei: 'ように = para que (verbo de estado/potencial + ように):',
        japanese: '{忘|わす}れないように、{書|か}いておきます。',
        romaji: 'Wasurenai you ni, kaite okimasu.',
        translation: 'Vou anotar para não esquecer.',
        highlight: 'ように',
        note: 'ように vem depois de potencial, ない, ou verbos como {見|み}える, {聞|き}こえる.',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: '{電車|でんしゃ}に{乗|の}れるように、{早|はや}く{起|お}きます。', romaji: 'Densha ni noreru you ni, hayaku okimasu.', translation: 'Acordo cedo para conseguir pegar o trem.' },
          { japanese: '{健康|けんこう}のために、{運動|うんどう}しています。', romaji: 'Kenkou no tame ni, undou shite imasu.', translation: 'Faço exercício pela saúde.' },
        ],
      },
    ],
    quiz: [
      { question: 'ために usa com:', options: ['Verbo potencial', 'Verbo de ação', 'Adjetivo な', 'Substantivo só'], correctIdx: 1, explanation: 'ために = a fim de (verbo de ação).' },
      { question: 'ように usa com:', options: ['Só substantivo', 'Verbo potencial ou ない', 'Só ます', 'Só passado'], correctIdx: 1, explanation: 'ように = para que (potencial, ない, etc).' },
      { question: '{忘|わす}れないように significa:', options: ['Esqueci', 'Para não esquecer', 'Não esqueça', 'Vou esquecer'], correctIdx: 1, explanation: 'ように = para que. {忘|わす}れない = não esquecer.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 3: Discurso Indireto e と言う
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-to-iu',
    title: 'と言う — Citação e Nomeação',
    jlptLevel: 'N3',
    icon: '💬',
    description: 'Diga o que alguém disse. "Ele disse que..."',
    slides: [
      { type: 'intro', sensei: 'Pra repetir o que alguém falou ou dar nome a algo, use と言う (to iu). "Ele disse que..." ou "chama-se..."', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'と言う = dizer que / chamar de:',
        japanese: '{田中|たなか}さんは「{明日|あした}{来|く}る」と言いました。',
        romaji: 'Tanaka-san wa "ashita kuru" to iimashita.',
        translation: 'O Tanaka disse que vem amanhã.',
        highlight: 'と言う',
        note: '「」 são aspas. O que foi dito + と + 言う.',
      },
      {
        type: 'concept',
        sensei: 'という = chamar-se, ser chamado:',
        japanese: 'これは「{親子|おやこ}{丼|どん}」という{料理|りょうり}です。',
        romaji: 'Kore wa "oyakodon" to iu ryouri desu.',
        translation: 'Isto é um prato chamado oyakodon.',
        highlight: 'という',
        note: 'Nome + という + substantivo.',
      },
      {
        type: 'example',
        sensei: 'No cotidiano:',
        examples: [
          { japanese: '{先生|せんせい}が「{宿題|しゅくだい}を{出|だ}してください」と言った。', romaji: 'Sensei ga "shukudai wo dashite kudasai" to itta.', translation: 'O professor disse "entreguem o dever de casa".' },
          { japanese: '「{元気|げんき}」という{言葉|ことば}は{何|なん}ですか？', romaji: '"Genki" to iu kotoba wa nan desu ka?', translation: 'O que significa a palavra "genki"?' },
        ],
      },
    ],
    quiz: [
      { question: '「X」と言う significa:', options: ['Perguntar X', 'Dizer X', 'Escrever X', 'Ouvir X'], correctIdx: 1, explanation: 'と言う = dizer que.' },
      { question: '「X」という{料理|りょうり} significa:', options: ['Comida sem nome', 'Prato chamado X', 'Comida ruim', 'Prato grande'], correctIdx: 1, explanation: 'という = chamado, que se chama.' },
      { question: 'Aspas em japonês são:', options: ['" "', '「 」', '( )', '[ ]'], correctIdx: 1, explanation: '「」 são as aspas japonesas.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 4: ばかり、だけ、くらい
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-bakari-dake-kurai',
    title: 'ばかり、だけ、くらい — Só, Apenas, Cerca de',
    jlptLevel: 'N3',
    icon: '📏',
    description: 'Limite e quantidade aproximada.',
    slides: [
      { type: 'intro', sensei: 'Só isso. Apenas isso. Uns 10. Em japonês: ばかり (só/ficar fazendo), だけ (apenas), くらい (cerca de). Cada um com seu uso!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ばかり = só, apenas (às vezes com nuance de "só faz isso"):',
        japanese: '{彼|かれ}は{遊|あそ}んでばかりいます。',
        romaji: 'Kare wa asonde bakari imasu.',
        translation: 'Ele só fica brincando.',
        highlight: 'ばかり',
        note: 'Forma て + ばかり. Pode ter nuance negativa: "só faz X".',
      },
      {
        type: 'concept',
        sensei: 'だけ = apenas, só (limite neutro):',
        japanese: 'これだけください。',
        romaji: 'Kore dake kudasai.',
        translation: 'Só isto, por favor.',
        highlight: 'だけ',
        note: 'だけ limita a quantidade. Neutro.',
      },
      {
        type: 'concept',
        sensei: 'くらい/ぐらい = cerca de, aproximadamente:',
        japanese: '{十分|じゅっぷん}くらい{待|ま}ってください。',
        romaji: 'Juppun kurai matte kudasai.',
        translation: 'Por favor espere uns 10 minutos.',
        highlight: 'くらい',
        note: 'Número + くらい. ぐらい é a mesma coisa.',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: '{百|ひゃく}円だけあります。', romaji: 'Hyaku en dake arimasu.', translation: 'Só tenho 100 ienes.' },
          { japanese: '{一時間|いちじかん}くらいかかります。', romaji: 'Ichijikan kurai kakarimasu.', translation: 'Demora cerca de 1 hora.' },
        ],
      },
    ],
    quiz: [
      { question: 'ばかり em てばかり indica:', options: ['Passado', 'Só fica fazendo isso', 'Futuro', 'Proibição'], correctIdx: 1, explanation: 'てばかり = só fica fazendo (pode ser crítica).' },
      { question: 'だけ indica:', options: ['Muito', 'Apenas/limite', 'Nada', 'Talvez'], correctIdx: 1, explanation: 'だけ = apenas, só.' },
      { question: '10分くらい =', options: ['Exatamente 10 min', 'Cerca de 10 min', 'Menos de 10 min', 'Mais de 10 min'], correctIdx: 1, explanation: 'くらい = aproximadamente.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 5: Forma Casual (だ/である)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-casual',
    title: 'Fala Casual — だ、る、た',
    jlptLevel: 'N3',
    icon: '😎',
    description: 'Fale como os japoneses falam entre amigos.',
    slides: [
      { type: 'intro', sensei: 'Com amigos ninguém fala です. Fala だ ou só o verbo direto. A forma casual é essencial pra anime, drama e conversa do dia a dia!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'です → だ (casual). ます → forma dicional (casual):',
        japanese: 'これは{本|ほん}だ。\n{食|た}べる。\n{行|い}った。',
        romaji: 'Kore wa hon da. Taberu. Itta.',
        translation: 'Isto é um livro. Como. Fui.',
        highlight: 'だ / る / た',
        note: 'だ = é (casual). Verbo dicional = presente casual. た = passado casual.',
      },
      {
        type: 'table',
        sensei: 'Comparação formal vs casual:',
        rows: [
          ['です', 'だ'],
          ['{食|た}べます', '{食|た}べる'],
          ['{食|た}べました', '{食|た}べた'],
          ['{行|い}きます', '{行|い}く'],
          ['{行|い}きました', '{行|い}った'],
        ],
      },
      {
        type: 'example',
        sensei: 'Entre amigos:',
        examples: [
          { japanese: 'おいしい！', romaji: 'Oishii!', translation: 'Tá gostoso!' },
          { japanese: 'もう{帰|かえ}る。', romaji: 'Mou kaeru.', translation: 'Já vou embora.' },
          { japanese: 'きのう{何|なに}した？', romaji: 'Kinou nani shita?', translation: 'O que você fez ontem?' },
        ],
      },
    ],
    quiz: [
      { question: 'だ é a forma casual de:', options: ['か', 'です', 'は', 'が'], correctIdx: 1, explanation: 'です (formal) → だ (casual).' },
      { question: '{食|た}べる é:', options: ['Passado', 'Presente casual', 'Formal', 'Negativo'], correctIdx: 1, explanation: '{食|た}べる = forma dicional = presente casual.' },
      { question: 'きのう{何|なに}した？ =', options: ['O que vai fazer?', 'O que você fez ontem?', 'O que é isso?', 'Onde foi?'], correctIdx: 1, explanation: 'した = passado casual de する.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 6: Voz Passiva
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-passive',
    title: 'Voz Passiva',
    jlptLevel: 'N3',
    icon: '🔄',
    description: 'Fui chamado. A janela foi quebrada. Passiva direta e indireta.',
    slides: [
      { type: 'intro', sensei: 'A voz passiva em japonês: "fui chamado", "a janela foi quebrada". Tem passiva direta (objeto vira sujeito) e indireta (prejudicativa). N3!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Passiva direta: れる/られる (Grupo 2: られる, Grupo 1: れる):',
        japanese: '{先生|せんせい}に{呼|よ}ばれました。',
        romaji: 'Sensei ni yobaremashita.',
        translation: 'Fui chamado pelo professor.',
        highlight: 'れる',
        note: 'Quem faz a ação: に. O sujeito é quem recebe.',
      },
      {
        type: 'concept',
        sensei: 'Passiva indireta (prejudicativa): quando algo que acontece te afeta negativamente:',
        japanese: '{雨|あめ}に{降|ふ}られました。',
        romaji: 'Ame ni furaremashita.',
        translation: 'Fui pego pela chuva. (a chuva me afetou)',
        highlight: 'られ',
        note: 'Muito comum: 父に死なれた (meu pai morreu - me afetou).',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: 'この{建物|たてもの}は{百年前|ひゃくねんまえ}に{建|た}てられました。', romaji: 'Kono tatemono wa hyakunen mae ni tateraremashita.', translation: 'Este prédio foi construído há 100 anos.' },
          { japanese: '{彼|かれ}に{先|さき}に{行|い}かれた。', romaji: 'Kare ni saki ni ikareta.', translation: 'Ele foi na frente (e isso me prejudicou).' },
        ],
      },
    ],
    quiz: [
      { question: 'Passiva em japonês usa:', options: ['する', 'れる/られる', 'たい', 'て'], correctIdx: 1, explanation: 'Passiva = れる (Grupo 1) ou られる (Grupo 2).' },
      { question: '先生に{呼|よ}ばれた =', options: ['Chamei o professor', 'Fui chamado pelo professor', 'O professor não veio', 'Vou chamar'], correctIdx: 1, explanation: 'に = agente. Passiva = fui chamado.' },
      { question: 'Passiva prejudicativa indica:', options: ['Ação positiva', 'Algo que te afetou negativamente', 'Futuro', 'Pedido'], correctIdx: 1, explanation: 'Passiva indireta = algo te afetou.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 7: Voz Causativa
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-causative',
    title: 'Voz Causativa',
    jlptLevel: 'N3',
    icon: '👆',
    description: 'Fazer alguém fazer. Deixar fazer. Causativo.',
    slides: [
      { type: 'intro', sensei: 'Fazer o filho estudar. Deixar o cachorro sair. A voz causativa (させる/せる) é essencial pro N3!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Causativo: せる/させる (fazer alguém fazer):',
        japanese: '{母|はは}は{私|わたし}に{勉強|べんきょう}させます。',
        romaji: 'Haha wa watashi ni benkyou sasemasu.',
        translation: 'Minha mãe me faz estudar.',
        highlight: 'させる',
        note: 'Grupo 2: る→させる. Grupo 1: う→あせる. する→させる, くる→こさせる.',
      },
      {
        type: 'concept',
        sensei: 'Causativo permissivo: させる (deixar fazer):',
        japanese: '{子供|こども}に{遊|あそ}ばせます。',
        romaji: 'Kodomo ni asobasemasu.',
        translation: 'Deixo a criança brincar.',
        highlight: 'せる',
        note: 'O mesmo formato. Contexto define: forçar ou permitir.',
      },
      {
        type: 'table',
        sensei: 'Formação:',
        rows: [
          ['{食|た}べる', '{食|た}べさせる'],
          ['{行|い}く', '{行|い}かせる'],
          ['する', 'させる'],
        ],
      },
    ],
    quiz: [
      { question: 'Causativo usa:', options: ['たい', 'せる/させる', 'て', 'れる'], correctIdx: 1, explanation: 'Causativo = せる (G1) ou させる (G2).' },
      { question: '{勉強|べんきょう}させる =', options: ['Estudar', 'Fazer alguém estudar', 'Não estudar', 'Acabou de estudar'], correctIdx: 1, explanation: 'Causativo = fazer alguém fazer.' },
      { question: '{子供|こども}に{遊|あそ}ばせる pode significar:', options: ['Proibir de brincar', 'Deixar brincar', 'Brincar sozinho', 'Não brincar'], correctIdx: 1, explanation: 'Causativo permissivo = deixar fazer.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 8: わけではない e のだ/んだ
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-wake-dewanai-no-da',
    title: 'わけではない e のだ/んだ',
    jlptLevel: 'N3',
    icon: '💬',
    description: 'Não é que... O のだ explicativo. N3!',
    slides: [
      { type: 'intro', sensei: 'Não é que eu não goste. É que... O わけではない (não é que) e のだ/んだ (explicativo) são super comuns no N3!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'わけではない = não é que, não necessariamente:',
        japanese: '{嫌|きら}いなわけではありません。',
        romaji: 'Kirai na wake dewa arimasen.',
        translation: 'Não é que eu não goste.',
        highlight: 'わけではない',
        note: 'Negação parcial. "Não é exatamente que..."',
      },
      {
        type: 'concept',
        sensei: 'のだ/んだ = explicativo (explica contexto, razão):',
        japanese: '{遅|おそ}れました。{電車|でんしゃ}が{遅|おく}れたんです。',
        romaji: 'Okuremashita. Densha ga okureta n desu.',
        translation: 'Me atrasei. O trem atrasou (é por isso).',
        highlight: 'んだ',
        note: 'んだ/のだ dá razão, explica. Casual: んだ. Formal: のです.',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: 'どうして{行|い}かないんですか？', romaji: 'Doushite ikanai n desu ka?', translation: 'Por que você não vai? (pedindo explicação)' },
          { japanese: '{忙|いそが}しいんです。', romaji: 'Isogashii n desu.', translation: 'É que estou ocupado.' },
        ],
      },
    ],
    quiz: [
      { question: 'わけではない significa:', options: ['Com certeza', 'Não é que', 'Talvez', 'Sempre'], correctIdx: 1, explanation: 'わけではない = não é que.' },
      { question: 'んだ/のだ é:', options: ['Pergunta', 'Explicativo (dá razão)', 'Proibição', 'Convite'], correctIdx: 1, explanation: 'のだ = explicativo, dá contexto.' },
      { question: 'どうして〜んですか =', options: ['Afirmação', 'Pergunta pedindo explicação', 'Negação', 'Convite'], correctIdx: 1, explanation: 'Pedindo razão/explicação.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 9: ことがある
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-koto-ga-aru',
    title: 'ことがある — Às vezes / Já fiz',
    jlptLevel: 'N3',
    icon: '📌',
    description: 'Às vezes faço. Já fiz. Dois usos diferentes!',
    slides: [
      { type: 'intro', sensei: '"Às vezes como fora no fim de semana." "Já subi o Monte Fuji." — as duas usam ことがある! A diferença tá na forma do verbo: dicional (às vezes) ou passado (já fiz). Fica esperto!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Verbo DICIONAL + ことがある = às vezes:',
        japanese: '週末は{外|そと}で{食|た}べることがあります。',
        romaji: 'Shuumatsu wa soto de taberu koto ga arimasu.',
        translation: 'Às vezes como fora no fim de semana.',
        highlight: 'ることがある',
        note: 'Frequência ocasional. Dicional (る) + ことがある.',
      },
      {
        type: 'concept',
        sensei: 'Verbo PASSADO + ことがある = já fiz (experiência):',
        japanese: '{富士山|ふじさん}に{登|のぼ}ったことがあります。',
        romaji: 'Fujisan ni nobotta koto ga arimasu.',
        translation: 'Já subi o Monte Fuji.',
        highlight: 'たことがある',
        note: 'Experiência de vida. た + ことがある.',
      },
      {
        type: 'table',
        sensei: 'Resumo:',
        rows: [
          ['ることがある', 'Às vezes faço'],
          ['たことがある', 'Já fiz (experiência)'],
        ],
      },
    ],
    quiz: [
      { question: 'ることがある =', options: ['Já fiz', 'Às vezes faço', 'Nunca faço', 'Sempre faço'], correctIdx: 1, explanation: 'Dicional + ことがある = às vezes.' },
      { question: 'たことがある =', options: ['Às vezes', 'Já fiz (experiência)', 'Vou fazer', 'Não faço'], correctIdx: 1, explanation: 'Passado + ことがある = experiência.' },
      { question: '{日本|にほん}に{行|い}ったことがある =', options: ['Às vezes vou', 'Já fui ao Japão', 'Nunca fui', 'Vou sempre'], correctIdx: 1, explanation: 'たことがある = já fiz.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 10: てならない、てしかたがない
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-te-naranai-shikata',
    title: 'てならない、てしかたがない',
    jlptLevel: 'N3',
    icon: '😣',
    description: 'Não consigo evitar. Não aguento. Sentimentos intensos.',
    slides: [
      { type: 'intro', sensei: 'Não consigo parar de pensar. Não aguento mais. てならない e てしかたがない expressam sentimentos que não dá pra controlar. N3!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'てならない = não consigo evitar (sentimento involuntário):',
        japanese: '{心配|しんぱい}でなりません。',
        romaji: 'Shinpai de narimasen.',
        translation: 'Não consigo evitar de me preocupar.',
        highlight: 'てならない',
        note: 'Usado com sentimentos: {心配|しんぱい}, {寂|さび}しい, {嬉|うれ}しい.',
      },
      {
        type: 'concept',
        sensei: 'てしかたがない = não aguento, muito (ênfase em sentimento):',
        japanese: '{彼|かれ}に{会|あ}いたくてしかたがない。',
        romaji: 'Kare ni aitakute shikata ga nai.',
        translation: 'Quero tanto vê-lo que não aguento.',
        highlight: 'てしかたがない',
        note: 'Similar a てならない. Ênfase em desejo ou sentimento forte.',
      },
    ],
    quiz: [
      { question: 'てならない indica:', options: ['Controle total', 'Sentimento que não consegue evitar', 'Felicidade leve', 'Indiferença'], correctIdx: 1, explanation: 'てならない = não consegue evitar.' },
      { question: 'てしかたがない indica:', options: ['Solução fácil', 'Sentimento muito forte', 'Problema resolvido', 'Sem importância'], correctIdx: 1, explanation: 'てしかたがない = não aguento, muito forte.' },
      { question: '{心配|しんぱい}でならない =', options: ['Não me preocupo', 'Não consigo evitar de me preocupar', 'Estou calmo', 'Resolvi'], correctIdx: 1, explanation: 'Sentimento involuntário.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N3 – LIÇÃO 11: Vocabulário e Leitura N3
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n3-vocab-reading',
    title: 'Vocabulário e Estratégias de Leitura N3',
    jlptLevel: 'N3',
    icon: '📖',
    description: '~3500 palavras. Dicas para compreensão de texto.',
    slides: [
      { type: 'intro', sensei: 'O N3 exige ~3500 palavras e textos médios. Onomatopeias, expressões idiomáticas e estratégias de leitura fazem a diferença!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Onomatopeias comuns (N3):',
        rows: [
          ['ぎりぎり', 'Por pouco, no limite'],
          ['しっかり', 'Firmemente, direito'],
          ['ゆっくり', 'Devagar'],
          ['ぴったり', 'Exatamente, certinho'],
          ['すっきり', 'Refrescado, limpo'],
          ['にこにこ', 'Sorridente'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Estratégias de leitura N3:',
        japanese: '・{接続詞|せつぞくし}に{注意|ちゅうい}（しかし、つまり、例えば）\n・{指示語|しじご}の{指|さ}す{内容|ないよう}を{把握|はあく}\n・{文脈|ぶんみゃく}から{推測|すいそく}',
        romaji: null,
        translation: 'Atenção a conectores. Identificar o que これ/それ/あれ se refere. Inferir pelo contexto.',
        note: 'O N3 testa compreensão, não só vocabulário.',
      },
    ],
    quiz: [
      { question: 'ぎりぎり significa:', options: ['Com folga', 'Por pouco, no limite', 'Muito cedo', 'Muito tarde'], correctIdx: 1, explanation: 'ぎりぎり = por pouco.' },
      { question: 'ゆっくり =', options: ['Rápido', 'Devagar', 'Alto', 'Baixo'], correctIdx: 1, explanation: 'ゆっくり = devagar.' },
      { question: 'No N3, a leitura exige:', options: ['Só vocabulário', 'Compreensão e inferência', 'Tradução literal', 'Memorização'], correctIdx: 1, explanation: 'N3 testa compreensão de contexto.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // N2 — Intermediário-Avançado
  // ═══════════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────────
  // N2 – LIÇÃO 1: Keigo (Linguagem Respeitosa)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n2-keigo',
    title: 'Keigo — Linguagem Respeitosa',
    jlptLevel: 'N2',
    icon: '🙏',
    description: 'Fale de forma educada com clientes e superiores.',
    slides: [
      { type: 'intro', sensei: 'No trabalho e em lojas você vai ouvir muito keigo — a linguagem respeitosa. É quando elevam o outro e se rebaixam. Parece complicado, mas com prática pega!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: '尊敬語 (sonkeigo) = elevar a ação do OUTRO:',
        japanese: '{先生|せんせい}が{言|い}われました。\n{社長|しゃちょう}が{来|いらっしゃ}いました。',
        romaji: 'Sensei ga iwaremashita. Shachou ga irasshaimashita.',
        translation: 'O professor disse. O presidente veio.',
        highlight: '尊敬語',
        note: '言う→おっしゃる/言われる. {来|く}る→{来|いらっしゃ}る. {行|い}く→{行|いらっしゃ}る.',
      },
      {
        type: 'concept',
        sensei: '謙譲語 (kenjougo) = rebaixar SUA ação:',
        japanese: '{私|わたし}が{申|もう}し{上|あ}げます。\n{明日|あした}{伺|うかが}います。',
        romaji: 'Watashi ga moushiagemasu. Ashita ukagaimasu.',
        translation: 'Eu digo. Amanhã vou (visitar você).',
        highlight: '謙譲語',
        note: '言う→申す/申し上げる. {行|い}く→{伺|うかが}う (quando vai à casa/escritório do outro).',
      },
      {
        type: 'table',
        sensei: 'Resumo de verbos comuns em keigo:',
        rows: [
          ['言う', 'おっしゃる (sonkeigo) / 申す (kenjougo)'],
          ['{来|く}る', '{来|いらっしゃ}る / {伺|うかが}う'],
          ['{食|た}べる', '召し上がる / いただく'],
          ['{見|み}る', 'ごらんになる / 拝見する'],
        ],
      },
    ],
    quiz: [
      { question: '尊敬語 eleva:', options: ['Sua ação', 'A ação do outro', 'O objeto', 'O lugar'], correctIdx: 1, explanation: '尊敬語 = elevar o outro.' },
      { question: '謙譲語 rebaixa:', options: ['O outro', 'Sua própria ação', 'O tempo', 'O lugar'], correctIdx: 1, explanation: '謙譲語 = se rebaixar.' },
      { question: '{来|いらっしゃ}る é:', options: ['謙譲語', '尊敬語', 'Casual', 'Imperativo'], correctIdx: 1, explanation: '{来|いらっしゃ}る = forma respeitosa de {来|く}る (do outro).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N2 – LIÇÃO 2: Expressões Idiomáticas
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n2-idioms',
    title: 'Expressões Idiomáticas do Dia a Dia',
    jlptLevel: 'N2',
    icon: '🗣️',
    description: 'Frases que os japoneses usam o tempo todo.',
    slides: [
      { type: 'intro', sensei: 'Tem umas expressões que todo japonês usa e que não dá pra traduzir literalmente. Conhecer elas deixa seu japonês bem mais natural!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Expressões comuns:',
        rows: [
          ['おつかれさま', 'Bom trabalho / Valeu pelo esforço'],
          ['いただきます', 'Vou comer (antes da refeição)'],
          ['ごちそうさま', 'Obrigado pela refeição (depois)'],
          ['おかえり / ただいま', 'Voltei / Estou em casa'],
          ['いってきます / いってらっしゃい', 'Vou sair / Vá com cuidado'],
          ['お{疲|つか}れさま', 'Bom trabalho (fim do expediente)'],
          ['お{先|さき}に', 'Vou indo na frente (sair antes dos outros)'],
          ['お{世話|せわ}になりました', 'Obrigado por tudo (formal)'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Contexto de uso:',
        japanese: 'おつかれさま — no trabalho, ao chegar ou sair.\nいただきます — antes de comer.\nおかえり — quem fica em casa diz pra quem chegou.',
        romaji: null,
        translation: null,
        note: 'Usar no contexto certo faz toda diferença!',
      },
    ],
    quiz: [
      { question: 'O que dizer ANTES de comer?', options: ['ごちそうさま', 'いただきます', 'おつかれさま', 'おかえり'], correctIdx: 1, explanation: 'いただきます = vou comer (antes).' },
      { question: 'O que dizer DEPOIS de comer?', options: ['いただきます', 'ごちそうさま', 'いってきます', 'お{先|さき}に'], correctIdx: 1, explanation: 'ごちそうさま = obrigado pela refeição (depois).' },
      { question: 'おつかれさま é usado:', options: ['Antes de dormir', 'No trabalho', 'No banheiro', 'No restaurante'], correctIdx: 1, explanation: 'おつかれさま = bom trabalho, no contexto de trabalho.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N2 – LIÇÃO 3: わけ e はず — Razão e Expectativa
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n2-wake-hazu',
    title: 'わけ e はず — Razão e Expectativa',
    jlptLevel: 'N2',
    icon: '🧩',
    description: 'Por isso que... / Deveria ser...',
    slides: [
      { type: 'intro', sensei: 'わけ = "por isso que", "faz sentido". はず = "deveria ser", "era pra ser". São super usados em conversas e textos!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'わけ = razão, conclusão lógica:',
        japanese: '{暑|あつ}いから、{窓|まど}を{開|あ}けるわけです。',
        romaji: 'Atsui kara, mado wo akeru wake desu.',
        translation: 'Como está quente, por isso abro a janela.',
        highlight: 'わけ',
        note: 'わけだ = "por isso que", "faz sentido que". わけがない = impossível.',
      },
      {
        type: 'concept',
        sensei: 'はず = expectativa, deveria:',
        japanese: '{彼|かれ}は{来|く}るはずです。',
        romaji: 'Kare wa kuru hazu desu.',
        translation: 'Ele deveria vir.',
        highlight: 'はず',
        note: 'Baseado em informação. "Era pra ele vir" (mas talvez não tenha vindo).',
      },
      {
        type: 'example',
        sensei: 'Exemplos:',
        examples: [
          { japanese: 'そんなわけない。', romaji: 'Sonna wake nai.', translation: 'Impossível. / Não tem como.' },
          { japanese: 'ここにあったはずなのに…', romaji: 'Koko ni atta hazu na noni…', translation: 'Deveria estar aqui, mas…' },
        ],
      },
    ],
    quiz: [
      { question: 'わけ indica:', options: ['Dúvida', 'Razão/conclusão lógica', 'Pedido', 'Convite'], correctIdx: 1, explanation: 'わけ = razão, por isso que.' },
      { question: 'はず indica:', options: ['Certeza absoluta', 'Expectativa/deveria', 'Proibição', 'Passado'], correctIdx: 1, explanation: 'はず = deveria ser, expectativa.' },
      { question: 'そんなわけない =', options: ['Claro que sim', 'Impossível', 'Talvez', 'Com certeza'], correctIdx: 1, explanation: 'わけがない = impossível.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N2 – LIÇÃO 4: Kanji Compostos e Leitura
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n2-kanji-compounds',
    title: 'Kanji Compostos — Onyomi',
    jlptLevel: 'N2',
    icon: '📚',
    description: 'Palavras com 2+ kanji. Leitura chinesa (onyomi).',
    slides: [
      { type: 'intro', sensei: 'No N2 aparecem muitas palavras com 2 ou mais kanji. A leitura costuma ser onyomi (chinesa). Conhecer os kanji base ajuda a decifrar!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Kanji comuns em compostos:',
        rows: [
          ['{電|でん} (den)', 'Eletricidade'],
          ['{車|しゃ} (sha)', 'Veículo'],
          ['{電車|でんしゃ}', 'Trem'],
          ['{勉強|べんきょう}', 'Estudo'],
          ['{便利|べんり}', 'Conveniente'],
          ['{準備|じゅんび}', 'Preparação'],
          ['{予約|よやく}', 'Reserva'],
          ['{説明|せつめい}', 'Explicação'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Dica: kanji compostos muitas vezes = onyomi + onyomi:',
        japanese: '{電|でん} + {話|わ} = {電話|でんわ} (telefone)\n{食|しょく} + {事|じ} = {食事|しょくじ} (refeição)',
        romaji: null,
        translation: null,
        note: 'Onyomi soa "chinês". Kunyomi soa "japonês". Compostos = geralmente onyomi.',
      },
    ],
    quiz: [
      { question: '{電車|でんしゃ} =', options: ['Carro', 'Trem', 'Bicicleta', 'Avião'], correctIdx: 1, explanation: '{電|でん} = eletricidade, {車|しゃ} = veículo = trem.' },
      { question: 'Em compostos de 2+ kanji, a leitura costuma ser:', options: ['Kunyomi', 'Onyomi', 'Hiragana', 'Katakana'], correctIdx: 1, explanation: 'Compostos geralmente usam onyomi.' },
      { question: '{予約|よやく} significa:', options: ['Cancelar', 'Reserva', 'Chegar', 'Sair'], correctIdx: 1, explanation: '{予約|よやく} = reserva.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N2 – LIÇÃO 5: に対して、おかげで、に違いない
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n2-tai-shite-okage',
    title: 'に対して、おかげで、に違いない',
    jlptLevel: 'N2',
    icon: '📐',
    description: 'Em relação a. Graças a. Com certeza. Gramática N2 essencial.',
    slides: [
      { type: 'intro', sensei: 'Em relação a X. Graças a você. Com certeza é. に対して、おかげで、に違いない — gramática que cai direto no N2!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'に対して = em relação a, em contraste com:',
        japanese: '{彼|かれ}は{仕事|しごと}に対して{真面目|まじめ}です。',
        romaji: 'Kare wa shigoto ni taishite majime desu.',
        translation: 'Ele é sério em relação ao trabalho.',
        highlight: 'に対して',
        note: 'Xに対して = em relação a X, quanto a X.',
      },
      {
        type: 'concept',
        sensei: 'おかげで = graças a (resultado positivo):',
        japanese: '{先生|せんせい}のおかげで{合格|ごうかく}できました。',
        romaji: 'Sensei no okage de goukaku dekimashita.',
        translation: 'Graças ao professor, consegui passar.',
        highlight: 'おかげで',
        note: 'Sempre resultado positivo. Para negativo use せいで.',
      },
      {
        type: 'concept',
        sensei: 'に違いない = com certeza, sem dúvida:',
        japanese: '{彼|かれ}は{来|く}るに{違|ちが}いない。',
        romaji: 'Kare wa kuru ni chigai nai.',
        translation: 'Com certeza ele vem.',
        highlight: 'に違いない',
        note: 'Convicção forte. Dicional/名詞 + に違いない.',
      },
    ],
    quiz: [
      { question: 'に対して significa:', options: ['Por causa de', 'Em relação a', 'Apesar de', 'Antes de'], correctIdx: 1, explanation: 'に対して = em relação a.' },
      { question: 'おかげで indica:', options: ['Resultado negativo', 'Resultado positivo (graças a)', 'Dúvida', 'Proibição'], correctIdx: 1, explanation: 'おかげで = graças a (positivo).' },
      { question: 'に違いない =', options: ['Talvez', 'Com certeza', 'Nunca', 'Às vezes'], correctIdx: 1, explanation: 'に違いない = com certeza.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N2 – LIÇÃO 6: とは限らない、ものの
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n2-toha-kagiranai-mono-no',
    title: 'とは限らない e ものの',
    jlptLevel: 'N2',
    icon: '⚠️',
    description: 'Não necessariamente. Embora. Exceções e concessão.',
    slides: [
      { type: 'intro', sensei: 'Não é sempre assim. Embora... mas. とは限らない e ものの são estruturas de exceção e concessão. N2!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'とは限らない = não necessariamente, não é sempre:',
        japanese: '{高|たか}いものが{良|よ}いとは{限|かぎ}りません。',
        romaji: 'Takai mono ga yoi towa kagirimasen.',
        translation: 'Coisa cara não é necessariamente boa.',
        highlight: 'とは限らない',
        note: 'Negação de generalização. "Não é sempre que..."',
      },
      {
        type: 'concept',
        sensei: 'ものの = embora, mas (concessão):',
        japanese: '{約束|やくそく}したものの、{都合|つごう}が{悪|わる}くなりました。',
        romaji: 'Yakusu shita mono no, tsugou ga waruku narimashita.',
        translation: 'Embora tenha prometido, minhas circunstâncias mudaram.',
        highlight: 'ものの',
        note: 'Admite a primeira parte mas a segunda contradiz ou limita.',
      },
    ],
    quiz: [
      { question: 'とは限らない =', options: ['Sempre', 'Não necessariamente', 'Nunca', 'Talvez'], correctIdx: 1, explanation: 'とは限らない = não é sempre.' },
      { question: 'ものの indica:', options: ['Causa', 'Concessão (embora... mas)', 'Futuro', 'Pedido'], correctIdx: 1, explanation: 'ものの = embora, mas.' },
      { question: '{高|たか}いとは{限|かぎ}らない =', options: ['É sempre caro', 'Não é necessariamente caro', 'É barato', 'Não existe'], correctIdx: 1, explanation: 'とは限らない = não necessariamente.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N2 – LIÇÃO 7: Vocabulário e Listening N2
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n2-vocab-listening',
    title: 'Vocabulário e Listening N2',
    jlptLevel: 'N2',
    icon: '🎧',
    description: '~6000 palavras. Estratégias para a prova de escuta.',
    slides: [
      { type: 'intro', sensei: 'O N2 exige ~6000 palavras. O listening é em velocidade quase natural. Entender o que NÃO é dito diretamente é crucial!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Expressões comuns no listening N2:',
        rows: [
          ['{実は|じつは}', 'Na verdade'],
          ['{つまり|つまり}', 'Ou seja, em resumo'],
          ['{確かに|たしかに}〜ですが', 'É verdade que... mas'],
          ['{なるほど}', 'Entendi, faz sentido'],
          ['{それはそうと}', 'A propósito, mudando de assunto'],
          ['{ということは}', 'Isso quer dizer que'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Dicas para o listening:',
        japanese: '・{最初|さいしょ}の{一言|ひとこと}に{注意|ちゅうい}\n・{否定|ひてい}や{条件|じょうけん}を{聞|き}き{逃|のが}さない\n・{話者|わしゃ}の{立場|たちば}を{把握|はあく}',
        romaji: null,
        translation: 'Atenção à primeira fala. Não perder negações e condições. Identificar a posição do falante.',
        note: 'Muitas questões têm "armadilhas" — a resposta errada parece certa.',
      },
    ],
    quiz: [
      { question: '{実は|じつは} =', options: ['Mentira', 'Na verdade', 'Talvez', 'Nunca'], correctIdx: 1, explanation: '{実は|じつは} = na verdade.' },
      { question: 'No listening N2, é importante:', options: ['Só o que é dito', 'O que é implícito também', 'Ignorar contexto', 'Traduzir tudo'], correctIdx: 1, explanation: 'Entender o implícito.' },
      { question: '{つまり|つまり} =', options: ['Por exemplo', 'Ou seja, em resumo', 'Mas', 'E'], correctIdx: 1, explanation: '{つまり|つまり} = ou seja.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // N1 — Avançado
  // ═══════════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────────
  // N1 – LIÇÃO 1: Leitura e Inferência
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n1-inference',
    title: 'Leitura e Inferência',
    jlptLevel: 'N1',
    icon: '📖',
    description: 'Entenda textos longos e nuances sutis.',
    slides: [
      { type: 'intro', sensei: 'No N1 os textos são longos e a resposta nem sempre tá explícita. Você precisa inferir, entender o tom e a intenção do autor. É o nível mais avançado!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'Dicas para leitura avançada:',
        japanese: '・{作者|さくしゃ}の{意図|いと}を{汲|く}む\n・{文脈|ぶんみゃく}から{推測|すいそく}する\n・{比喩|ひゆ}や{婉曲|えんきょく}表現に{注意|ちゅうい}',
        romaji: null,
        translation: 'Captar a intenção do autor. Inferir pelo contexto. Atenção a metáforas e eufemismos.',
        note: 'O N1 testa compreensão profunda, não só vocabulário.',
      },
      {
        type: 'concept',
        sensei: 'Expressões formais e abstratas:',
        japanese: '{従来|じゅうらい}、{一方|いっぽう}で、{換言|かんげん}すれば、{即ち|すなわち}',
        romaji: 'juurai, ippou de, kangen sureba, sunawachi',
        translation: 'Tradicionalmente, por outro lado, em outras palavras, ou seja',
        highlight: null,
        note: 'Conectores de texto formal. Aparecem em artigos e documentos.',
      },
    ],
    quiz: [
      { question: 'No N1, a resposta muitas vezes:', options: ['Está explícita', 'Precisa ser inferida', 'É óbvia', 'Não importa'], correctIdx: 1, explanation: 'N1 exige inferência e compreensão profunda.' },
      { question: '{換言|かんげん}すれば significa:', options: ['Em resumo', 'Em outras palavras', 'Por exemplo', 'No entanto'], correctIdx: 1, explanation: '{換言|かんげん}すれば = em outras palavras.' },
      { question: '{文脈|ぶんみゃく} significa:', options: ['Gramática', 'Contexto', 'Vocabulário', 'Pronúncia'], correctIdx: 1, explanation: '{文脈|ぶんみゃく} = contexto do texto.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N1 – LIÇÃO 2: ずにはいられない、ずにはすまない
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n1-zuniwa',
    title: 'ずにはいられない、ずにはすまない',
    jlptLevel: 'N1',
    icon: '💢',
    description: 'Não consigo evitar. Não pode deixar de. N1 formal.',
    slides: [
      { type: 'intro', sensei: 'Não consigo evitar de rir. Não pode deixar assim. ずにはいられない e ずにはすまない — estruturas formais do N1!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ずにはいられない = não consigo evitar de (involuntário):',
        japanese: '{笑|わら}わずにはいられなかった。',
        romaji: 'Warawazu ni wa irarenakatta.',
        translation: 'Não consegui evitar de rir.',
        highlight: 'ずにはいられない',
        note: 'Verbo ない-stem + ず. する→せず. Equivale a ないではいられない.',
      },
      {
        type: 'concept',
        sensei: 'ずにはすまない = não pode deixar de, tem que (obrigação moral):',
        japanese: '{謝|あやま}らずにはすまない。',
        romaji: 'Ayamarazu ni wa sumanai.',
        translation: 'Não tem como não pedir desculpas.',
        highlight: 'ずにはすまない',
        note: 'Obrigação social/moral. "Não dá pra não fazer".',
      },
    ],
    quiz: [
      { question: 'ずにはいられない indica:', options: ['Escolha livre', 'Não consigo evitar', 'Proibição', 'Permissão'], correctIdx: 1, explanation: 'ずにはいられない = não consigo evitar.' },
      { question: 'ずにはすまない indica:', options: ['Opcional', 'Obrigação moral', 'Impossível', 'Fácil'], correctIdx: 1, explanation: 'ずにはすまない = tem que, não dá pra não fazer.' },
      { question: 'する em ず forma vira:', options: ['しず', 'せず', 'するず', 'さず'], correctIdx: 1, explanation: 'する → せず (forma ず).' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N1 – LIÇÃO 3: ものだ e ことだ — Generalização e Conselho
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n1-mono-koto',
    title: 'ものだ e ことだ — Generalização e Conselho',
    jlptLevel: 'N1',
    icon: '💡',
    description: 'É natural que... / O importante é...',
    slides: [
      { type: 'intro', sensei: 'ものだ = "é natural que", "costuma". ことだ = "o importante é", conselho. São expressões refinadas que aparecem em textos e fala formal.', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ものだ = é natural, costuma (generalização):',
        japanese: '{人|ひと}は{年|とし}を{取|と}ると{忘|わす}れっぽくなるものです。',
        romaji: 'Hito wa toshi wo toru to wasurerappoku naru mono desu.',
        translation: 'É natural as pessoas ficarem esquecidas com a idade.',
        highlight: 'ものだ',
        note: 'ものだ = "é da natureza de", "costuma acontecer".',
      },
      {
        type: 'concept',
        sensei: 'ことだ = o importante é (conselho):',
        japanese: '{健康|けんこう}のためには、{運動|うんどう}することだ。',
        romaji: 'Kenkou no tame ni wa, undou suru koto da.',
        translation: 'Para a saúde, o importante é se exercitar.',
        highlight: 'ことだ',
        note: 'ことだ = conselho forte. "O que importa é fazer X".',
      },
      {
        type: 'example',
        sensei: 'Em textos formais:',
        examples: [
          { japanese: '{失敗|しっぱい}は{誰|だれ}にでもあるものだ。', romaji: 'Shippai wa dare ni demo aru mono da.', translation: 'Errar é algo que acontece com todo mundo.' },
          { japanese: '{成功|せいこう}するには{続|つづ}けることだ。', romaji: 'Seikou suru ni wa tsuzukeru koto da.', translation: 'Para ter sucesso, o importante é persistir.' },
        ],
      },
    ],
    quiz: [
      { question: 'ものだ expressa:', options: ['Pedido', 'Generalização/natureza', 'Proibição', 'Convite'], correctIdx: 1, explanation: 'ものだ = é natural que, costuma.' },
      { question: 'ことだ expressa:', options: ['Passado', 'Conselho/importância', 'Dúvida', 'Desculpa'], correctIdx: 1, explanation: 'ことだ = o importante é, conselho.' },
      { question: '{失敗|しっぱい}は{誰|だれ}にでもあるものだ =', options: ['Ninguém erra', 'Só eu erro', 'Errar é natural pra todos', 'Errar é ruim'], correctIdx: 2, explanation: 'ものだ = é natural. Todo mundo erra.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N1 – LIÇÃO 4: までもない、かねる、に足る
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n1-made-mo-nai-kaneru',
    title: 'までもない、かねる、に足る',
    jlptLevel: 'N1',
    icon: '📜',
    description: 'Não precisa nem. Não pode (recusa educada). Vale a pena.',
    slides: [
      { type: 'intro', sensei: 'Não precisa nem dizer. Não posso aceitar. Vale a pena. までもない、かねる、に足る — gramática formal do N1!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'までもない = não precisa nem (é óbvio):',
        japanese: '{言|い}うまでもなく、{彼|かれ}は{優秀|ゆうしゅう}です。',
        romaji: 'Iu made mo naku, kare wa yuushuu desu.',
        translation: 'Não precisa nem dizer, ele é excelente.',
        highlight: 'までもない',
        note: 'Verbo dicional + までもない. "Nem precisa fazer X".',
      },
      {
        type: 'concept',
        sensei: 'かねる = não poder (recusa educada, formal):',
        japanese: 'その{件|けん}については{答|こた}えかねます。',
        romaji: 'Sono ken ni tsuite wa kotaekanemasu.',
        translation: 'Não posso responder sobre esse assunto.',
        highlight: 'かねる',
        note: 'Verbo ます sem ます + かねる. Recusa educada em negócios.',
      },
      {
        type: 'concept',
        sensei: 'に足る = valer a pena, merecer:',
        japanese: 'これは{信|しん}じるに{足|た}る{情報|じょうほう}です。',
        romaji: 'Kore wa shinjiru ni taru jouhou desu.',
        translation: 'Esta é informação que vale a pena acreditar.',
        highlight: 'に足る',
        note: 'Verbo dicional + に足る. "Merece ser", "vale a pena".',
      },
    ],
    quiz: [
      { question: 'までもない significa:', options: ['Precisa fazer', 'Não precisa nem fazer', 'Já fez', 'Vai fazer'], correctIdx: 1, explanation: 'までもない = não precisa nem.' },
      { question: 'かねる indica:', options: ['Pode fazer', 'Não pode (recusa educada)', 'Quer fazer', 'Vai fazer'], correctIdx: 1, explanation: 'かねる = não poder (formal).' },
      { question: 'に足る =', options: ['Não vale', 'Vale a pena, merece', 'É pouco', 'É demais'], correctIdx: 1, explanation: 'に足る = valer a pena.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N1 – LIÇÃO 5: ながらも、にもかかわらず
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n1-nagara-mo-nimo',
    title: 'ながらも、にもかかわらず',
    jlptLevel: 'N1',
    icon: '🔄',
    description: 'Embora. Apesar de. Concessão avançada.',
    slides: [
      { type: 'intro', sensei: 'Embora soubesse. Apesar da chuva. ながらも e にもかかわらず expressam concessão forte. N1!', japanese: null, translation: null },
      {
        type: 'concept',
        sensei: 'ながらも = embora (contraste, surpresa):',
        japanese: '{若|わか}いながらも、{経験|けいけん}が{豊|ゆた}かです。',
        romaji: 'Wakai nagara mo, keiken ga yutaka desu.',
        translation: 'Embora seja jovem, tem muita experiência.',
        highlight: 'ながらも',
        note: 'Diferente de ながら (enquanto). ながらも = embora, apesar de.',
      },
      {
        type: 'concept',
        sensei: 'にもかかわらず = apesar de, não obstante:',
        japanese: '{雨|あめ}にもかかわらず、{出|で}かけました。',
        romaji: 'Ame ni mo kakawarazu, dekakemashita.',
        translation: 'Apesar da chuva, saí.',
        highlight: 'にもかかわらず',
        note: 'Substantivo/verbo + にもかかわらず. Formal, escrito.',
      },
    ],
    quiz: [
      { question: 'ながらも indica:', options: ['Simultaneidade', 'Concessão (embora)', 'Causa', 'Futuro'], correctIdx: 1, explanation: 'ながらも = embora, apesar de.' },
      { question: 'にもかかわらず =', options: ['Por causa de', 'Apesar de', 'Antes de', 'Depois de'], correctIdx: 1, explanation: 'にもかかわらず = apesar de.' },
      { question: '{雨|あめ}にもかかわらず =', options: ['Por causa da chuva', 'Apesar da chuva', 'Antes da chuva', 'Sem chuva'], correctIdx: 1, explanation: 'にもかかわらず = apesar de.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // N1 – LIÇÃO 6: Vocabulário Abstrato e Formal
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'n1-abstract-vocab',
    title: 'Vocabulário Abstrato e Formal',
    jlptLevel: 'N1',
    icon: '📜',
    description: 'Palavras de textos acadêmicos e formais.',
    slides: [
      { type: 'intro', sensei: 'No N1 aparecem muitas palavras abstratas e formais: documentos, artigos, discursos. Conhecer esse vocabulário é essencial!', japanese: null, translation: null },
      {
        type: 'table',
        sensei: 'Palavras abstratas comuns:',
        rows: [
          ['{考慮|こうりょ}する', 'Considerar'],
          ['{検討|けんとう}する', 'Examinar, analisar'],
          ['{実施|じっし}する', 'Implementar'],
          ['{促進|そくしん}する', 'Promover'],
          ['{影響|えいきょう}', 'Influência'],
          ['{傾向|けいこう}', 'Tendência'],
          ['{現状|げんじょう}', 'Situação atual'],
          ['{課題|かだい}', 'Desafio, tarefa'],
        ],
      },
      {
        type: 'concept',
        sensei: 'Padrão comum: substantivo + する = verbo:',
        japanese: '{検討|けんとう}する = examinar\n{実施|じっし}する = implementar',
        romaji: null,
        translation: null,
        note: 'Muitos verbos formais são 漢語 + する.',
      },
    ],
    quiz: [
      { question: '{考慮|こうりょ}する significa:', options: ['Ignorar', 'Considerar', 'Recusar', 'Aceitar'], correctIdx: 1, explanation: '{考慮|こうりょ}する = considerar.' },
      { question: '{影響|えいきょう} significa:', options: ['Resultado', 'Influência', 'Causa', 'Efeito colateral'], correctIdx: 1, explanation: '{影響|えいきょう} = influência.' },
      { question: '{実施|じっし}する =', options: ['Cancelar', 'Implementar', 'Planejar', 'Discutir'], correctIdx: 1, explanation: '{実施|じっし}する = implementar, executar.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // LIÇÕES DE KANJI (geradas automaticamente)
  // ═══════════════════════════════════════════════════════════════════════════════
  ...KANJI_LESSONS,
];

/**
 * Retorna todas as lições de um determinado nível JLPT.
 */
export function getLessonsByLevel(level) {
  return LESSONS.filter(l => l.jlptLevel === level);
}

/**
 * Retorna uma lição pelo seu id.
 */
export function getLessonById(id) {
  return LESSONS.find(l => l.id === id) || null;
}
