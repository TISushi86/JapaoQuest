/**
 * Câmaras da Memória (記憶の間) — dados declarativos das salas de escape room.
 *
 * Cada sala possui:
 *  id          – identificador único
 *  jlptLevel   – nível JLPT relacionado ('N5'..'N1')
 *  title       – título em português
 *  titleJp     – título em japonês
 *  icon        – emoji representativo
 *  regionId    – id da região do mapa à qual pertence
 *  intro       – texto de abertura (typewriter)
 *  hotspots    – lista de pontos interativos (veja abaixo)
 *  winCondition – função de vitória { require: [...itens] }
 *  memory      – objeto com a cena de memória recuperada ao final
 *
 * Hotspot:
 *  id           – string única na sala
 *  emoji        – ícone exibido
 *  label        – legenda em kanji (ex.: '窓')
 *  labelPt      – legenda em português (ex.: 'Janela')
 *  x, y         – posição relativa 0..1 no grid da sala
 *  requires     – itens necessários no inventário para interagir (array de ids)
 *  puzzle       – definição do enigma (ou null se só revela texto/item)
 *  reveals      – texto mostrado ao clicar antes do puzzle (opcional)
 *  unlockHotspots – ids de hotspots a destravar ao resolver
 *  rewardItems  – itens a adicionar ao inventário ao resolver
 *  onceOnly     – se true, fecha após resolvido (padrão)
 *
 * Enigmas (PuzzleModal renderiza 7 tipos):
 *  'kanaLock'      – montar palavra tocando em kanas (pool + answer)
 *  'particleFill'  – preencher partículas em frase (slots + answer)
 *  'kanjiMatch'    – parear kanji com furigana (pairs)
 *  'counter'       – contador japonês correto (visible + options + correctIdx)
 *  'direction'     – tocar pontos cardeais em ordem (sequence)
 *  'sentenceOrder' – ordenar blocos para formar frase (blocks + answer)
 *  'readingChoice' – múltipla escolha de leitura/significado (options + correctIdx)
 */

export const ROOMS = [
  // ═══════════════════════════════════════════════════════════════════════════
  //  SALA N5 — Cabana em Ruínas (Vila Kakurega)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'room-n5',
    jlptLevel: 'N5',
    title: 'Cabana em Ruínas',
    titleJp: 'あばら{家|や}',
    icon: '🏚',
    regionId: 'n5',
    accentColor: '#4caf50',
    intro:
      'Você acorda numa cabana queimada da antiga Vila Kakurega. A névoa ainda paira entre os escombros. No ar, um sussurro:\n\n"Se você ler o que está escrito aqui... talvez se lembre de mim."',
    hotspots: [
      // 1. Estante — quiz de leitura para ganhar o fósforo
      {
        id: 'hs-estante',
        emoji: '📚',
        label: '{棚|たな}',
        labelPt: 'Estante',
        x: 0.18,
        y: 0.42,
        requires: [],
        reveals:
          'Uma estante tombada com quatro livros cobertos de cinza. Eimei sussurra em sua mente: "procure o que mostra caminhos...".',
        puzzle: {
          type: 'readingChoice',
          prompt: 'Qual destes livros é o "mapa"?',
          options: [
            '{料理|りょうり} (culinária)',
            '{歴史|れきし} (história)',
            '{地図|ちず} (mapa)',
            '{物語|ものがたり} (conto)',
          ],
          correctIdx: 2,
          explanation:
            '{地図|ちず} = mapa. 地 (terra) + 図 (diagrama). Útil para encontrar caminhos.',
        },
        rewardItems: [
          { id: 'item-fosforo', emoji: '🔥', label: 'Fósforo' },
        ],
        unlockHotspots: ['hs-lareira'],
      },

      // 2. Lareira — kanaLock: montar かぞく
      {
        id: 'hs-lareira',
        emoji: '🕯',
        label: '{囲炉裏|いろり}',
        labelPt: 'Lareira',
        x: 0.50,
        y: 0.38,
        requires: ['item-fosforo'],
        requiresMessage: 'A lareira está apagada. Você precisa de algo para acendê-la.',
        locked: true,
        reveals:
          'Você acende a lareira com o fósforo. Nas cinzas flutuantes, quatro kanas se revelam.',
        puzzle: {
          type: 'kanaLock',
          prompt: 'Arraste 3 letras na ordem certa para formar a palavra que você ama.',
          hintPt: 'Pessoas com quem você vive. 3 letras.',
          pool: ['か', 'ぞ', 'く', 'み'],
          answer: ['か', 'ぞ', 'く'],
          explanation: 'かぞく (家族) = família. A palavra mais importante deste lar.',
        },
        unlockHotspots: ['hs-bau'],
      },

      // 3. Baú — readingChoice: número de pessoas da família
      {
        id: 'hs-bau',
        emoji: '📦',
        label: '{箱|はこ}',
        labelPt: 'Baú',
        x: 0.82,
        y: 0.42,
        requires: [],
        locked: true,
        reveals:
          'O baú tem um cadeado com um kanji numérico. Há uma inscrição na tampa:\n\n"{私|わたし}の{子供|こども}：{息子|むすこ}{一人|ひとり}と{娘|むすめ}{一人|ひとり}。{私|わたし}と{妻|つま}。"',
        puzzle: {
          type: 'readingChoice',
          prompt: 'Quantas pessoas há na família descrita?',
          options: ['{二|に}', '{三|さん}', '{四|よん}', '{五|ご}'],
          correctIdx: 2,
          explanation:
            'Um filho + uma filha + eu + esposa = 4 pessoas. 四 (よん/し) = quatro.',
        },
        rewardItems: [
          { id: 'item-bilhete', emoji: '📜', label: 'Bilhete de Hana' },
          { id: 'item-chave-bronze', emoji: '🗝', label: 'Chave de bronze' },
        ],
      },

      // 4. Janela — direction: leste e norte
      {
        id: 'hs-janela',
        emoji: '🪟',
        label: '{窓|まど}',
        labelPt: 'Janela',
        x: 0.22,
        y: 0.18,
        requires: [],
        reveals:
          'Através da janela partida, estrelas brilham sobre as montanhas. Uma voz ecoa:\n\n"O templo fica ao {東|ひがし}. A família foi levada ao {北|きた}."',
        puzzle: {
          type: 'direction',
          prompt: 'Toque nas direções na ordem: templo primeiro, família depois.',
          sequence: ['east', 'north'],
          labels: {
            north: '{北|きた}',
            south: '{南|みなみ}',
            east: '{東|ひがし}',
            west: '{西|にし}',
          },
          explanation:
            '東 (ひがし) = leste. 北 (きた) = norte. Os 4 pontos cardeais: 東西南北.',
        },
        rewardItems: [
          { id: 'item-mapa', emoji: '🗺', label: 'Mapa parcial' },
        ],
      },

      // 5. Mesa — particleFill: completar partículas do bilhete de Hana
      {
        id: 'hs-mesa',
        emoji: '🪑',
        label: '{机|つくえ}',
        labelPt: 'Mesa',
        x: 0.78,
        y: 0.18,
        requires: ['item-bilhete'],
        requiresMessage: 'Uma mesa vazia. Talvez algo que você encontre possa ser lido aqui.',
        reveals:
          'Você espalha o bilhete de Hana sobre a mesa. Três partículas foram apagadas pela chuva. Complete-as para ler a mensagem.',
        puzzle: {
          type: 'particleFill',
          prompt: 'Complete as partículas do bilhete.',
          sentence: [
            { text: '{私|わたし}' },
            { slot: 0 },
            { text: '{花|はな}です。{毎日|まいにち}あなた' },
            { slot: 1 },
            { text: '{手紙|てがみ}' },
            { slot: 2 },
            { text: '{書|か}きます。' },
          ],
          slots: [
            { options: ['は', 'を', 'に'], answer: 'は' },
            { options: ['は', 'を', 'に'], answer: 'に' },
            { options: ['は', 'を', 'に'], answer: 'を' },
          ],
          translation:
            'Eu sou Hana. Todo dia escrevo uma carta para você.',
          explanation:
            'は marca o tópico (eu). に marca alvo/destinatário (para você). を marca o objeto direto (a carta).',
        },
        rewardItems: [
          { id: 'item-chave-ouro', emoji: '🔑', label: 'Chave dourada' },
        ],
      },

      // 6. Porta — destravar com chave dourada + mapa
      {
        id: 'hs-porta',
        emoji: '🚪',
        label: '{戸|と}',
        labelPt: 'Porta',
        x: 0.50,
        y: 0.78,
        requires: ['item-chave-ouro', 'item-mapa'],
        requiresMessage:
          'A porta está trancada. Você precisa de uma chave dourada e de um mapa para saber por onde ir.',
        locked: false,
        reveals:
          'Você insere a chave dourada. O cadeado cai. O mapa aponta o caminho pelo leste, em direção ao templo de Eimei. A porta range e abre.',
        puzzle: null, // porta final — direto para vitória
        isExit: true,
      },
    ],

    // Memória recuperada ao escapar
    memory: {
      title: 'Memória Recuperada',
      scenes: [
        {
          japanese: '{花|はな}',
          text: 'A névoa se dissipa por um instante. Um nome chega à sua mente como uma brisa morna:\n\n"Hana..."',
        },
        {
          japanese: '{私|わたし}の{妻|つま}は{花|はな}だ。',
          text: '"Minha esposa se chama Hana."\n\nVocê se lembra. E sabe que ela ainda está viva.',
        },
      ],
      xpReward: 120,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  Salas N4–N1: stubs (serão preenchidos depois)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'room-n4',
    jlptLevel: 'N4',
    title: 'Armazém do Porto',
    titleJp: '{港|みなと}の{倉庫|そうこ}',
    icon: '⚓',
    regionId: 'n4',
    accentColor: '#2196f3',
    stub: true,
    intro: 'Esta câmara ainda está selada. Retorne após dominar o N4.',
    hotspots: [],
    memory: null,
  },
  {
    id: 'room-n3',
    jlptLevel: 'N3',
    title: 'Pavilhão do Imperador',
    titleJp: '{皇帝|こうてい}の{館|やかた}',
    icon: '🏮',
    regionId: 'n3',
    accentColor: '#9c27b0',
    stub: true,
    intro: 'Esta câmara ainda está selada. Retorne após dominar o N3.',
    hotspots: [],
    memory: null,
  },
  {
    id: 'room-n2',
    jlptLevel: 'N2',
    title: 'Depósito da Fortaleza',
    titleJp: '{砦|とりで}の{蔵|くら}',
    icon: '🏯',
    regionId: 'n2',
    accentColor: '#ff9800',
    stub: true,
    intro: 'Esta câmara ainda está selada. Retorne após dominar o N2.',
    hotspots: [],
    memory: null,
  },
  {
    id: 'room-n1',
    jlptLevel: 'N1',
    title: 'Masmorra de Kurokami',
    titleJp: '{黒髪|くろかみ}の{牢|ろう}',
    icon: '👹',
    regionId: 'n1',
    accentColor: '#f44336',
    stub: true,
    intro: 'Esta câmara ainda está selada. Retorne após dominar o N1.',
    hotspots: [],
    memory: null,
  },
];

export function getRoomById(id) {
  return ROOMS.find(r => r.id === id) || null;
}

export function getRoomByRegion(regionId) {
  return ROOMS.find(r => r.regionId === regionId) || null;
}

export function getRoomByLevel(jlptLevel) {
  return ROOMS.find(r => r.jlptLevel === jlptLevel) || null;
}
