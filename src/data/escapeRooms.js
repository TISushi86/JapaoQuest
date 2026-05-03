/**
 * Câmaras da Memória (記憶の間) — dados declarativos das salas de escape room.
 *
 * MECÂNICA:
 *  Todos os hotspots aparecem desde o início. O jogador explora livremente.
 *  Para avançar, precisa:
 *    1. Resolver o enigma de um hotspot livre para ganhar um item.
 *    2. Descobrir em qual OUTRO hotspot usar esse item (selecionando no
 *       inventário + clicando no hotspot alvo).
 *    3. Só então o hotspot alvo libera seu enigma, que dá novo item, e assim
 *       por diante até a porta final.
 *
 * Campos de sala:
 *   id, jlptLevel, title, titleJp, icon, regionId, accentColor, stub
 *   backgroundImage – require(...) da imagem de fundo da sala
 *   intro           – texto do typewriter inicial
 *   hotspots        – array de hotspots
 *   memory          – cena recuperada ao escapar
 *
 * Campos de hotspot:
 *   id              – string única na sala
 *   emoji           – ícone exibido na bolinha
 *   label           – legenda em kanji (ex.: '{窓|まど}')
 *   labelPt         – legenda em português
 *   x, y            – posição relativa 0..1 na área da sala
 *   isExit          – se true, é a porta de saída
 *   useItem         – id de item que destrava este hotspot (ou array para múltiplos itens requeridos juntos)
 *   initialMessage  – mensagem mostrada ao clicar SEM item ou com item errado
 *   useItemSuccess  – mensagem mostrada ao usar o item correto pela primeira vez
 *   wrongItemMessage – mensagem para item errado selecionado (opcional)
 *   reveals         – texto descritivo mostrado quando o hotspot está desbloqueado
 *   puzzle          – definição do enigma
 *   rewardItems     – itens ganhos ao resolver o puzzle
 *   ambientOnly     – se true, só tem reveals, nunca puzzle nem reward (red herring/narrativo)
 *
 * Tipos de enigma (PuzzleModal renderiza 7 tipos):
 *   'kanaLock', 'particleFill', 'kanjiMatch', 'counter',
 *   'direction', 'sentenceOrder', 'readingChoice'
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
    accentColor: '#d4a574',
    backgroundImage: require('../../assets/escape_rooms/n5.png'),
    intro:
      'Você acorda numa cabana queimada da antiga Vila Kakurega. A névoa ainda paira entre os escombros. No ar, um sussurro:\n\n"Se você ler o que está escrito aqui... talvez se lembre de mim.\n\nExplore cada canto da sala — role a tela, toque em tudo. Nem tudo aqui serve. Você terá que descobrir."',

    hotspots: [
      // ═════════════════════════════════════════════════════════════════════
      // 1. ESTANTE — hotspot livre (início do jogo)
      //    Quiz de leitura. Prêmio: 🔥 Fósforo
      // ═════════════════════════════════════════════════════════════════════
      {
        id: 'hs-estante',
        emoji: '📚',
        label: '{棚|たな}',
        labelPt: 'Estante',
        x: 0.80, y: 0.33,
        reveals:
          'Uma estante tombada com quatro livros cobertos de cinza.\n\nEimei sussurra em sua mente:\n\n"...procure o que mostra caminhos..."',
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
          explanation: '{地図|ちず} = mapa. 地 (terra) + 図 (diagrama).',
        },
        rewardItems: [
          { id: 'item-fosforo', emoji: '🔥', label: 'Fósforo', hint: 'Serve para acender algo.' },
        ],
      },

      // ═════════════════════════════════════════════════════════════════════
      // 2. LAREIRA — requer 🔥 Fósforo
      //    kanaLock (かぞく). Prêmio: 🗝 Chave de bronze
      // ═════════════════════════════════════════════════════════════════════
      {
        id: 'hs-lareira',
        emoji: '🕯',
        label: '{囲炉裏|いろり}',
        labelPt: 'Lareira',
        x: 0.50, y: 0.58,
        useItem: 'item-fosforo',
        initialMessage: 'A lareira está apagada. Há cinzas frias no fundo.',
        wrongItemMessage: 'Nada acontece.',
        useItemSuccess: 'Você risca o fósforo. A lareira desperta. Nas cinzas flutuantes, quatro kanas se revelam.',
        puzzle: {
          type: 'kanaLock',
          prompt: 'Monte a palavra que você ama mais no fogo.',
          hintPt: 'Pessoas com quem você vive (3 letras).',
          pool: ['か', 'ぞ', 'く', 'み'],
          answer: ['か', 'ぞ', 'く'],
          explanation: 'かぞく (家族) = família. A palavra mais importante deste lar.',
        },
        rewardItems: [
          { id: 'item-chave-bronze', emoji: '🗝', label: 'Chave de bronze', hint: 'Abre algo antigo e trancado.' },
        ],
      },

      // ═════════════════════════════════════════════════════════════════════
      // 3. BAÚ — requer 🗝 Chave de bronze
      //    readingChoice contagem. Prêmio: 📜 Bilhete + 🧭 Bússola
      // ═════════════════════════════════════════════════════════════════════
      {
        id: 'hs-bau',
        emoji: '📦',
        label: '{箱|はこ}',
        labelPt: 'Baú',
        x: 0.20, y: 0.78,
        useItem: 'item-chave-bronze',
        initialMessage: 'Um baú velho, fechado. Tem um pequeno trinco enferrujado.',
        wrongItemMessage: 'Nada acontece.',
        useItemSuccess: 'A chave de bronze gira com um estalo surdo. O baú se abre.',
        reveals:
          'Dentro do baú, uma tábua gravada:\n\n{私|わたし}の{子供|こども}：\n{息子|むすこ}{一人|ひとり} と {娘|むすめ}{一人|ひとり}。\n{私|わたし} と {妻|つま}。\n\n(Meus filhos: um filho e uma filha. Eu e minha esposa.)',
        puzzle: {
          type: 'readingChoice',
          prompt: 'Quantas pessoas há na família descrita?',
          options: ['{二|に}', '{三|さん}', '{四|よん}', '{五|ご}'],
          correctIdx: 2,
          explanation: 'Filho + filha + eu + esposa = 4. 四 (よん/し).',
        },
        rewardItems: [
          { id: 'item-bilhete', emoji: '📜', label: 'Bilhete de Hana', hint: 'Um papel com frase incompleta.' },
          { id: 'item-bussola', emoji: '🧭', label: 'Bússola quebrada', hint: 'Só funciona em lugar aberto.' },
        ],
      },

      // ═════════════════════════════════════════════════════════════════════
      // 4. MESA — requer 📜 Bilhete
      //    particleFill. Prêmio: 🔑 Chave dourada
      // ═════════════════════════════════════════════════════════════════════
      {
        id: 'hs-mesa',
        emoji: '🪑',
        label: '{机|つくえ}',
        labelPt: 'Mesa',
        x: 0.20, y: 0.33,
        useItem: 'item-bilhete',
        initialMessage: 'Uma mesa empoeirada. Totalmente vazia.',
        wrongItemMessage: 'Nada acontece.',
        useItemSuccess: 'Você espalha o bilhete sobre a mesa. Três partículas foram apagadas pela chuva.',
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
          translation: 'Eu sou Hana. Todo dia escrevo uma carta para você.',
          explanation: 'は tópico · に destinatário · を objeto direto.',
        },
        rewardItems: [
          { id: 'item-chave-ouro', emoji: '🔑', label: 'Chave dourada', hint: 'Muito valiosa. Para algo muito trancado.' },
        ],
      },

      // ═════════════════════════════════════════════════════════════════════
      // 5. JANELA — requer 🧭 Bússola
      //    direction (東→北). Prêmio: 🗺 Mapa
      // ═════════════════════════════════════════════════════════════════════
      {
        id: 'hs-janela',
        emoji: '🪟',
        label: '{窓|まど}',
        labelPt: 'Janela',
        x: 0.50, y: 0.07,
        useItem: 'item-bussola',
        initialMessage: 'A janela está rachada. Lá fora, estrelas piscam sobre montanhas distantes. Mas você não sabe a qual direção cada coisa pertence.',
        wrongItemMessage: 'Nada acontece.',
        useItemSuccess:
          'A agulha da bússola estremece e encontra o norte.\n\nUma voz ecoa ao seu ouvido:\n\n• O {寺|てら} (templo) fica ao {東|ひがし} — leste.\n• A {家族|かぞく} (família) foi levada ao {北|きた} — norte.',
        puzzle: {
          type: 'direction',
          prompt: 'Toque nas direções: templo primeiro, família depois.',
          sequence: ['east', 'north'],
          labels: {
            north: '{北|きた}', south: '{南|みなみ}',
            east:  '{東|ひがし}', west:  '{西|にし}',
          },
          explanation: '東 leste · 北 norte · 東西南北 (pontos cardeais).',
        },
        rewardItems: [
          { id: 'item-mapa', emoji: '🗺', label: 'Mapa parcial', hint: 'Mostra o caminho para o leste.' },
        ],
      },

      // ═════════════════════════════════════════════════════════════════════
      // 6. PORTA — saída, requer 🔑 Chave dourada + 🗺 Mapa
      // ═════════════════════════════════════════════════════════════════════
      {
        id: 'hs-porta',
        emoji: '🚪',
        label: '{戸|と}',
        labelPt: 'Porta',
        x: 0.80, y: 0.78,
        isExit: true,
        useItem: ['item-chave-ouro', 'item-mapa'],
        initialMessage:
          'A porta está trancada. Do outro lado, você nem sabe se existe mundo — ou apenas mais névoa.',
        wrongItemMessage: 'Nada acontece.',
        useItemSuccess:
          'A fechadura cede com um estalo seco. A porta range e abre para a noite fria.',
      },

      // ═════════════════════════════════════════════════════════════════════
      // EXTRAS — atmosfera / red herrings (não dão item, só contexto)
      // ═════════════════════════════════════════════════════════════════════
      {
        id: 'hs-ema',
        emoji: '🎋',
        label: '{絵馬|えま}',
        labelPt: 'Ema',
        x: 0.80, y: 0.15,
        ambientOnly: true,
        reveals:
          'Uma tabuleta de madeira pendurada com um desejo gravado:\n\n「{家族|かぞく}の{幸|しあわ}せ」\n(A felicidade da família)\n\nVocê reconhece a escrita.\n\nVocê mesmo pendurou esta tabuleta aqui, há muito tempo.',
      },
      {
        id: 'hs-lanterna',
        emoji: '🪔',
        label: '{灯|あかり}',
        labelPt: 'Lanterna',
        x: 0.20, y: 0.15,
        ambientOnly: true,
        reveals:
          'Uma lanterna de papel há muito apagada.\n\nNo papel, um único kanji:\n\n{夜|よる}  (noite)\n\nNão há óleo no pavio — mas você recorda o hábito de acendê-la ao entardecer, todos os dias.',
      },

      // Didáticos: não servem para avançar, mas ensinam kanji e vocabulário.
      // Criados de propósito para confundir o jogador sobre onde usar os itens.
      {
        id: 'hs-flor',
        emoji: '🌸',
        label: '{桜|さくら}',
        labelPt: 'Sakura',
        x: 0.20, y: 0.23,
        ambientOnly: true,
        reveals:
          'Uma flor de cerejeira seca num vaso rachado.\n\nNo papel amarelado ao lado, um verso:\n\n「{春|はる}が{来|く}る」\n(A primavera chega)\n\nVocabulário:\n{桜|さくら} — flor de cerejeira\n{春|はる} — primavera\n\nVocê lembra vagamente... alguém esperava as cerejas florirem.',
      },
      {
        id: 'hs-pergaminho',
        emoji: '📜',
        label: '{仮名|かな}',
        labelPt: 'Pergaminho',
        x: 0.80, y: 0.23,
        ambientOnly: true,
        reveals:
          'Um pergaminho velho lista os kanas básicos:\n\nあ  い  う  え  お\nか  き  く  け  こ\nさ  し  す  せ  そ\n\nEimei sussurra em sua mente:\n\n"Os fundamentos não se esquecem, mesmo quando tudo arde."',
      },
      {
        id: 'hs-espelho',
        emoji: '🪞',
        label: '{鏡|かがみ}',
        labelPt: 'Espelho',
        x: 0.20, y: 0.43,
        ambientOnly: true,
        reveals:
          'Um espelho rachado reflete um rosto que você mal reconhece.\n\nEscrito em laca preta na moldura:\n\n「{私|わたし}は{誰|だれ}だ？」\n(Quem sou eu?)\n\nVocabulário:\n{私|わたし} — eu\n{誰|だれ} — quem\nだ — ser (forma informal)',
      },
      {
        id: 'hs-furin',
        emoji: '🎐',
        label: '{風鈴|ふうりん}',
        labelPt: 'Sino de vento',
        x: 0.80, y: 0.43,
        ambientOnly: true,
        reveals:
          'Um furin de vidro balança sem vento.\n\nNo pequeno papel preso ao badalo:\n\n「{風|かぜ}はやさしい」\n(O vento é gentil)\n\nVocabulário:\n{風|かぜ} — vento\nやさしい — gentil, suave, fácil\n\nSó os mortos escutam sinos sem vento, dizem na vila.',
      },
    ],

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
  //  Salas N4–N1: stubs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'room-n4', jlptLevel: 'N4',
    title: 'Armazém do Porto', titleJp: '{港|みなと}の{倉庫|そうこ}',
    icon: '⚓', regionId: 'n4', accentColor: '#2196f3', stub: true,
    intro: 'Esta câmara ainda está selada. Retorne após dominar o N4.',
    hotspots: [], memory: null,
  },
  {
    id: 'room-n3', jlptLevel: 'N3',
    title: 'Pavilhão do Imperador', titleJp: '{皇帝|こうてい}の{館|やかた}',
    icon: '🏮', regionId: 'n3', accentColor: '#9c27b0', stub: true,
    intro: 'Esta câmara ainda está selada. Retorne após dominar o N3.',
    hotspots: [], memory: null,
  },
  {
    id: 'room-n2', jlptLevel: 'N2',
    title: 'Depósito da Fortaleza', titleJp: '{砦|とりで}の{蔵|くら}',
    icon: '🏯', regionId: 'n2', accentColor: '#ff9800', stub: true,
    intro: 'Esta câmara ainda está selada. Retorne após dominar o N2.',
    hotspots: [], memory: null,
  },
  {
    id: 'room-n1', jlptLevel: 'N1',
    title: 'Masmorra de Kurokami', titleJp: '{黒髪|くろかみ}の{牢|ろう}',
    icon: '👹', regionId: 'n1', accentColor: '#f44336', stub: true,
    intro: 'Esta câmara ainda está selada. Retorne após dominar o N1.',
    hotspots: [], memory: null,
  },
];

export function getRoomById(id)          { return ROOMS.find(r => r.id === id)          || null; }
export function getRoomByRegion(regionId) { return ROOMS.find(r => r.regionId === regionId) || null; }
export function getRoomByLevel(jlptLevel) { return ROOMS.find(r => r.jlptLevel === jlptLevel) || null; }
