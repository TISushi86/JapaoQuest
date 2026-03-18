/**
 * Simulados JLPT — Provas no formato oficial para avaliar o jogador.
 *
 * Estrutura conforme site oficial: https://www.jlpt.jp/e/guideline/testsections.html
 *
 * N5, N4, N3: 3 seções — 語彙 | 文法・読解 | 聴解
 * N2, N1: 2 seções — Language Knowledge・Reading (combinado) | 聴解
 *
 * Tempos oficiais (2020+):
 * N5: 20min + 40min + 30min = 90min
 * N4: 25min + 55min + 35min = 115min
 * N3: 30min + 70min + 40min = 140min
 * N2: 105min + 50min = 155min
 * N1: 110min + 55min = 165min
 *
 * Pontuação: 180 total (60+60+60). Aprovação ~60% + mínimo por seção.
 * Listening: sem áudio no app — diálogos em texto (聴解風読解).
 */

export const SIMULADOS = {
  N5: {
    level: 'N5',
    title: 'Simulado JLPT N5',
    description: 'Formato oficial. 語彙 20min | 文法・読解 40min | 聴解 30min.',
    timeMinutes: 90,
    passPercent: 60,
    sections: [
      { id: 'vocabulary', name: '言語知識（語彙）', timeMin: 20 },
      { id: 'grammar', name: '言語知識（文法）・読解', timeMin: 40 },
      { id: 'listening', name: '聴解', timeMin: 30 },
    ],
    questions: [
      // ─── 語彙：Kanji reading ─────────────────────────────────────────────
      { section: 'vocabulary', questionType: 'kanji_reading', question: '{水|みず}の{読|よ}み方は？', options: ['みず', 'すい', 'みつ', 'すみ'], correctIdx: 0, explanation: '{水|みず} = água. Leitura kunyomi.' },
      { section: 'vocabulary', questionType: 'kanji_reading', question: '{山|やま}の{読|よ}み方は？', options: ['さん', 'やま', 'やめ', 'ざん'], correctIdx: 1, explanation: '{山|やま} = montanha. Kunyomi.' },
      { section: 'vocabulary', questionType: 'kanji_reading', question: '{人|ひと}の{読|よ}み方は？', options: ['じん', 'にん', 'ひと', 'しん'], correctIdx: 2, explanation: '{人|ひと} = pessoa. Kunyomi.' },
      { section: 'vocabulary', questionType: 'kanji_reading', question: '{日|ひ}の{読|よ}み方は？', options: ['にち', 'ひ', 'び', 'じつ'], correctIdx: 1, explanation: '{日|ひ} = dia/sol. Kunyomi.' },
      { section: 'vocabulary', questionType: 'kanji_reading', question: '{本|ほん}の{読|よ}み方は？', options: ['ほん', 'もと', 'ぼん', 'ぽん'], correctIdx: 0, explanation: '{本|ほん} = livro. Onyomi.' },
      { section: 'vocabulary', questionType: 'kanji_reading', question: '{年|とし}の{読|よ}み方は？', options: ['ねん', 'とし', 'とせ', 'なん'], correctIdx: 1, explanation: '{年|とし} = ano. Kunyomi.' },
      { section: 'vocabulary', questionType: 'kanji_reading', question: '{大|おお}きいの{読|よ}み方は？', options: ['だい', 'たい', 'おお', 'だ'], correctIdx: 2, explanation: '{大|おお}きい = grande.' },
      { section: 'vocabulary', questionType: 'orthography', question: '「みず」を漢字で書くと？', options: ['水', '氷', '永', '泳'], correctIdx: 0, explanation: '水 = água.' },
      { section: 'vocabulary', questionType: 'orthography', question: '「きょう」を漢字で書くと？', options: ['今日', '昨日', '明日', '毎日'], correctIdx: 0, explanation: '今日 = hoje.' },
      { section: 'vocabulary', questionType: 'orthography', question: '「でんしゃ」を漢字で書くと？', options: ['電車', '汽車', '自転車', '地下鉄'], correctIdx: 0, explanation: '電車 = trem.' },
      // ─── 語彙：Paraphrases / Context ────────────────────────────────────
      { section: 'vocabulary', questionType: 'paraphrases', question: '「{今日|きょう}」の意味は？', options: ['Amanhã', 'Hoje', 'Ontem', 'Semana'], correctIdx: 1, explanation: '{今日|きょう} = hoje.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '「{電車|でんしゃ}」は何ですか？', options: ['Carro', 'Trem', 'Avião', 'Bicicleta'], correctIdx: 1, explanation: '{電車|でんしゃ} = trem.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '{食|た}べもの の 意味は？', options: ['Bebida', 'Comida', 'Roupa', 'Livro'], correctIdx: 1, explanation: '{食|た}べもの = comida.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '{右|みぎ} の 意味は？', options: ['Esquerda', 'Direita', 'Frente', 'Trás'], correctIdx: 1, explanation: '{右|みぎ} = direita.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '「{駅|えき}」は何ですか？', options: ['Loja', 'Estação', 'Escola', 'Hospital'], correctIdx: 1, explanation: '{駅|えき} = estação.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '{家族|かぞく} の 意味は？', options: ['Amigos', 'Família', 'Trabalho', 'Casa'], correctIdx: 1, explanation: '{家族|かぞく} = família.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '「{安|やす}い」の意味は？', options: ['Caro', 'Barato', 'Grande', 'Pequeno'], correctIdx: 1, explanation: '{安|やす}い = barato.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '{毎日|まいにち} の 意味は？', options: ['Às vezes', 'Todo dia', 'Nunca', 'Raramente'], correctIdx: 1, explanation: '{毎日|まいにち} = todo dia.' },
      { section: 'vocabulary', questionType: 'context', question: '「{元気|げんき}」の反対に近い意味は？', options: ['Animado', 'Cansado', 'Feliz', 'Grande'], correctIdx: 1, explanation: '{元気|げんき} = animado. Cansado é o oposto.' },
      { section: 'vocabulary', questionType: 'context', question: '{左|ひだり} の 意味は？', options: ['Esquerda', 'Direita', 'Frente', 'Trás'], correctIdx: 0, explanation: '{左|ひだり} = esquerda.' },
      // ─── 文法：Sentential grammar 1 ──────────────────────────────────────
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{私|わたし}___ {学生|がくせい}です。正しいのは？', options: ['が', 'は', 'を', 'に'], correctIdx: 1, explanation: 'は marca o tópico.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: 'りんご___ {食|た}べます。正しいのは？', options: ['が', 'は', 'を', 'に'], correctIdx: 2, explanation: 'を marca o objeto direto.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{学校|がっこう}___ {行|い}きます。正しいのは？', options: ['で', 'を', 'に', 'が'], correctIdx: 2, explanation: 'に indica destino.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{図書館|としょかん}___ {勉強|べんきょう}します。正しいのは？', options: ['に', 'で', 'を', 'が'], correctIdx: 1, explanation: 'で indica local da ação.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{私|わたし}___ {寿司|すし}が{好|す}きです。正しいのは？', options: ['を', 'が', 'は', 'に'], correctIdx: 2, explanation: 'は marca o tópico.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{雨|あめ}___ {行|い}きます。正しいのは？', options: ['でも', 'から', 'まで', 'より'], correctIdx: 0, explanation: 'でも = mesmo que.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{寝|ね}る___ に {歯|は}を{磨|みが}きます。正しいのは？', options: ['後', '前', '時', '間'], correctIdx: 1, explanation: '前に = antes de.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '9{時|じ}___ 5{時|じ}まで {働|はたら}きます。正しいのは？', options: ['まで', 'から', 'に', 'で'], correctIdx: 1, explanation: 'から = de (início).' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '「コーヒー___ {茶|ちゃ}か、どちらがいいですか？」正しいのは？', options: ['と', 'か', 'や', 'も'], correctIdx: 1, explanation: 'か～か = ou (alternativa).' },
      // ─── 文法：Sentential grammar 2 / Text grammar ───────────────────────
      { section: 'grammar', questionType: 'sentential_grammar_2', question: '「{食|た}べました」の意味は？', options: ['Como', 'Comi', 'Vou comer', 'Não como'], correctIdx: 1, explanation: 'ました = passado.' },
      { section: 'grammar', questionType: 'sentential_grammar_2', question: '「{食|た}べたくない」の意味は？', options: ['Quero comer', 'Não quero comer', 'Comi', 'Vou comer'], correctIdx: 1, explanation: 'たくない = não quero fazer.' },
      { section: 'grammar', questionType: 'text_grammar', question: '「{明日|あした}は{雨|あめ}でしょう」の意味は？', options: ['Amanhã choveu', 'Amanhã provavelmente chove', 'Amanhã não chove', 'Ontem choveu'], correctIdx: 1, explanation: 'でしょう = provavelmente.' },
      { section: 'grammar', questionType: 'text_grammar', question: '「{彼|かれ}は{料理|りょうり}が{上手|じょうず}です」の意味は？', options: ['Ele não cozinha', 'Ele é bom em cozinhar', 'Ele come muito', 'Ele não gosta de comida'], correctIdx: 1, explanation: '{上手|じょうず} = bom em.' },
      { section: 'grammar', questionType: 'text_grammar', question: '「もう{食|た}べました」の意味は？', options: ['Ainda não comi', 'Já comi', 'Vou comer', 'Não como'], correctIdx: 1, explanation: 'もう + passado = já fiz.' },
      { section: 'grammar', questionType: 'text_grammar', question: '「まだ{帰|かえ}っていません」の意味は？', options: ['Já voltei', 'Ainda não voltei', 'Não vou voltar', 'Voltei ontem'], correctIdx: 1, explanation: 'まだ + negativo = ainda não.' },
      // ─── 読解：Short / Mid / Info retrieval ─────────────────────────────
      { section: 'grammar', questionType: 'reading_short', question: '【短文】{田中|たなか}さんは{毎朝|まいあさ}7{時|じ}に{起|お}きます。{質問|しつもん}：{田中|たなか}さんはいつ{起|お}きますか？', options: ['毎晩', '毎朝7時', '毎日8時', '週末'], correctIdx: 1, explanation: '毎朝7時 = todo dia às 7h.' },
      { section: 'grammar', questionType: 'reading_mid', question: '【中文】{駅|えき}の{前|まえ}に{喫茶店|きっさてん}があります。{安|やす}くて{おいしい|美味しい}です。{質問|しつもん}：{喫茶店|きっさてん}はどこにありますか？', options: ['学校の前', '駅の前', '病院の隣', '公園の中'], correctIdx: 1, explanation: '駅の前に = na frente da estação.' },
      { section: 'grammar', questionType: 'info_retrieval', question: '【掲示】{会議|かいぎ}は3{時|じ}からです。{場所|ばしょ}は2{階|かい}の{会議室|かいぎしつ}です。{質問|しつもん}：{会議|かいぎ}は何時からですか？', options: ['2時', '3時', '4時', '5時'], correctIdx: 1, explanation: '3時から = a partir das 3h.' },
      // ─── 聴解：Task-based / Key points / Verbal / Quick response ─────────
      { section: 'listening', questionType: 'task_based', question: '【会話】A: これをください。B: かしこまりました。Aは何をしましたか？', options: ['Pediu algo', 'Recusou algo', 'Devolveu algo', 'Perguntou o preço'], correctIdx: 0, explanation: 'ください = por favor me dê.' },
      { section: 'listening', questionType: 'key_points', question: '【会話】A: トイレはどこですか？B: あそこです。Aは何を聞きましたか？', options: ['Onde fica o banheiro', 'O que é aquilo', 'Quanto custa', 'Quando abre'], correctIdx: 0, explanation: 'どこ = onde.' },
      { section: 'listening', questionType: 'verbal_expressions', question: '【会話】A: {何|なに}にしますか？B: {茶|ちゃ}にします。Bは何を選びましたか？', options: ['Café', 'Chá', 'Água', 'Suco'], correctIdx: 1, explanation: '{茶|ちゃ}にします = vou de chá.' },
      { section: 'listening', questionType: 'quick_response', question: '【会話】A: {明日|あした}、{行|い}きませんか？B: いいですね。{行|い}きましょう。Bの返事は？', options: ['Recusou', 'Aceitou o convite', 'Perguntou de novo', 'Não entendeu'], correctIdx: 1, explanation: 'いいですね、{行|い}きましょう = aceitou.' },
      { section: 'listening', questionType: 'quick_response', question: '【会話】A: {元気|げんき}ですか？B: はい、{元気|げんき}です。Bはどうですか？', options: ['Doente', 'Bem', 'Cansado', 'Triste'], correctIdx: 1, explanation: '{元気|げんき}です = estou bem.' },
      { section: 'listening', questionType: 'task_based', question: '【会話】A: すみません、{千|せん}{円|えん}おつりをください。B: はい。Aは何をしましたか？', options: ['Pediu troco', 'Pagou a conta', 'Perguntou o preço', 'Devolveu algo'], correctIdx: 0, explanation: 'おつりをください = troco, por favor.' },
      { section: 'listening', questionType: 'key_points', question: '【会話】A: この{電車|でんしゃ}は{東京|とうきょう}{行|い}きですか？B: いいえ、{大阪|おおさか}行きです。Aは何を聞きましたか？', options: ['Destino do trem', 'Horário', 'Preço', 'Número do vagão'], correctIdx: 0, explanation: '行き = destino.' },
      { section: 'listening', questionType: 'verbal_expressions', question: '【会話】A: いただきます。B: どうぞ。Aは何を言いましたか？', options: ['Obrigado', 'Vou comer (antes de comer)', 'Desculpe', 'Até logo'], correctIdx: 1, explanation: 'いただきます = expressão antes de comer.' },
      { section: 'listening', questionType: 'quick_response', question: '【会話】A: ありがとうございました。B: どういたしまして。Bの返事は？', options: ['De nada', 'Obrigado', 'Desculpe', 'Tchau'], correctIdx: 0, explanation: 'どういたしまして = de nada.' },
    ],
  },

  N4: {
    level: 'N4',
    title: 'Simulado JLPT N4',
    description: 'Formato oficial. 語彙 25min | 文法・読解 55min | 聴解 35min.',
    timeMinutes: 115,
    passPercent: 60,
    sections: [
      { id: 'vocabulary', name: '言語知識（語彙）', timeMin: 25 },
      { id: 'grammar', name: '言語知識（文法）・読解', timeMin: 55 },
      { id: 'listening', name: '聴解', timeMin: 35 },
    ],
    questions: [
      { section: 'vocabulary', questionType: 'kanji_reading', question: '「{準備|じゅんび}」の{読|よ}み方は？', options: ['じゅんび', 'じゅうび', 'じょんび', 'じゅんぴ'], correctIdx: 0, explanation: '{準備|じゅんび} = preparação.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '「{準備|じゅんび}」の意味は？', options: ['Resultado', 'Preparação', 'Decisão', 'Explicação'], correctIdx: 1, explanation: '{準備|じゅんび} = preparação.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '{予約|よやく}する の 意味は？', options: ['Cancelar', 'Reservar', 'Chegar', 'Sair'], correctIdx: 1, explanation: '{予約|よやく}する = reservar.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '「{説明|せつめい}」の意味は？', options: ['Pergunta', 'Explicação', 'Resposta', 'Conversa'], correctIdx: 1, explanation: '{説明|せつめい} = explicação.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '「{経験|けいけん}」の意味は？', options: ['Conhecimento', 'Experiência', 'Estudo', 'Trabalho'], correctIdx: 1, explanation: '{経験|けいけん} = experiência.' },
      { section: 'vocabulary', questionType: 'context', question: '{届|とど}ける の 意味は？', options: ['Enviar/Entregar', 'Receber', 'Esquecer', 'Cancelar'], correctIdx: 0, explanation: '{届|とど}ける = entregar, enviar.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{食|た}べ___ から {行|い}きます。正しいのは？', options: ['ます', 'て', 'た', 'ない'], correctIdx: 1, explanation: 'てから = depois de fazer.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{日本|にほん}に{行|い}った___ があります。正しいのは？', options: ['とき', 'こと', 'もの', 'ところ'], correctIdx: 1, explanation: 'たことがある = já fiz.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: 'この{料理|りょうり}を{食|た}べて___ ください。正しいのは？', options: ['おく', 'しまう', 'みる', 'ある'], correctIdx: 2, explanation: 'てみる = experimentar.' },
      { section: 'grammar', questionType: 'sentential_grammar_2', question: '「ドアが{開|あ}きました」誰が開きました？', options: ['Eu abri', 'A porta abriu sozinha', 'Alguém fechou', 'Ninguém'], correctIdx: 1, explanation: 'Intransitivo = aconteceu sozinho.' },
      { section: 'grammar', questionType: 'text_grammar', question: '「{彼|かれ}は{先生|せんせい}らしいです」の意味は？', options: ['Ele é professor', 'Parece que ele é professor', 'Ele não é professor', 'Ele quer ser professor'], correctIdx: 1, explanation: 'らしい = parece que.' },
      { section: 'grammar', questionType: 'text_grammar', question: '「{彼|かれ}は{来|く}る{予定|よてい}です」の意味は？', options: ['Ele veio', 'Ele vem', 'Ele virá (está previsto)', 'Ele não vem'], correctIdx: 2, explanation: '{予定|よてい} = plano, previsão.' },
      { section: 'grammar', questionType: 'reading_short', question: '【短文】{会議|かいぎ}は{来週|らいしゅう}の{月曜日|げつようび}に{変更|へんこう}になりました。{質問|しつもん}：{会議|かいぎ}はいつですか？', options: ['Esta semana', 'Próxima segunda', 'Amanhã', 'Hoje'], correctIdx: 1, explanation: '来週の月曜日 = próxima segunda.' },
      { section: 'grammar', questionType: 'reading_mid', question: '【中文】{新|あたら}しい{店|みせ}が{開|ひら}きました。{予約|よやく}が{必要|ひつよう}です。{質問|しつもん}：{新|あたら}しい{店|みせ}では何が{必要|ひつよう}ですか？', options: ['Cartão', 'Reserva', 'Dinheiro', 'Documento'], correctIdx: 1, explanation: '予約 = reserva.' },
      { section: 'grammar', questionType: 'info_retrieval', question: '【掲示】{図書館|としょかん}は{月曜|げつよう}が{休|やす}みです。{質問|しつもん}：{図書館|としょかん}はいつ{休|やす}みですか？', options: ['日曜', '月曜', '土曜', '金曜'], correctIdx: 1, explanation: '月曜が休み = segunda é fechado.' },
      { section: 'listening', questionType: 'task_based', question: '【会話】A: ここに{座|すわ}ってもいいですか？B: はい、どうぞ。Aは何を聞きましたか？', options: ['Onde fica', 'Se pode sentar', 'Quanto custa', 'Quando abre'], correctIdx: 1, explanation: 'てもいいですか = posso?' },
      { section: 'listening', questionType: 'key_points', question: '【会話】A: {今|いま}、{何|なに}をしていますか？B: {勉強|べんきょう}しています。Bは？', options: ['Está estudando', 'Vai estudar', 'Estudou', 'Não estuda'], correctIdx: 0, explanation: 'ています = ação em progresso.' },
      { section: 'listening', questionType: 'verbal_expressions', question: '【会話】A: {遅|おそ}くなってすみません。B: いいえ、{大丈夫|だいじょうぶ}です。Aは何を言いましたか？', options: ['Obrigado', 'Desculpe pelo atraso', 'Tchau', 'Por favor'], correctIdx: 1, explanation: '遅くなってすみません = desculpe pelo atraso.' },
      { section: 'listening', questionType: 'quick_response', question: '【会話】A: {一緒|いっしょ}に{昼|ひる}{食|しょく}、{食|た}べませんか？B: ええ、いいですね。Bの返事は？', options: ['Recusou', 'Aceitou', 'Não entendeu', 'Perguntou de novo'], correctIdx: 1, explanation: 'いいですね = aceitou.' },
    ],
  },

  N3: {
    level: 'N3',
    title: 'Simulado JLPT N3',
    description: 'Formato oficial. 語彙 30min | 文法・読解 70min | 聴解 40min.',
    timeMinutes: 140,
    passPercent: 60,
    sections: [
      { id: 'vocabulary', name: '言語知識（語彙）', timeMin: 30 },
      { id: 'grammar', name: '言語知識（文法）・読解', timeMin: 70 },
      { id: 'listening', name: '聴解', timeMin: 40 },
    ],
    questions: [
      { section: 'vocabulary', questionType: 'paraphrases', question: '「{考慮|こうりょ}する」の意味は？', options: ['Ignorar', 'Considerar', 'Recusar', 'Aceitar'], correctIdx: 1, explanation: '{考慮|こうりょ}する = considerar.' },
      { section: 'vocabulary', questionType: 'paraphrases', question: '「{確認|かくにん}する」の意味は？', options: ['Confirmar', 'Cancelar', 'Esquecer', 'Perguntar'], correctIdx: 0, explanation: '{確認|かくにん}する = confirmar.' },
      { section: 'vocabulary', questionType: 'context', question: '{状況|じょうきょう} の 意味は？', options: ['Situação', 'Resultado', 'Problema', 'Solução'], correctIdx: 0, explanation: '{状況|じょうきょう} = situação.' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{雨|あめ}が{降|ふ}っている___、{家|いえ}にいます。正しいのは？', options: ['から', 'ので', 'のに', 'でも'], correctIdx: 1, explanation: 'ので = porque (objetivo).' },
      { section: 'grammar', questionType: 'sentential_grammar_1', question: '{彼|かれ}が{言|い}った___ {信|しん}じられません。正しいのは？', options: ['こと', 'もの', 'ところ', 'ため'], correctIdx: 0, explanation: 'こと = fato, conteúdo.' },
      { section: 'grammar', questionType: 'text_grammar', question: '「{彼|かれ}は{若|わか}いながらも、{経験|けいけん}が{豊|ゆた}かです」の意味は？', options: ['Ele é velho', 'Embora seja jovem, tem experiência', 'Ele não tem experiência', 'Ele é inexperiente'], correctIdx: 1, explanation: 'ながらも = embora.' },
      { section: 'grammar', questionType: 'reading_mid', question: '【中文】{会議|かいぎ}は{予定|よてい}より30{分|ぷん}{延長|えんちょう}されました。{質問|しつもん}：{会議|かいぎ}はどうなりましたか？', options: ['Cancelada', 'Adiada', 'Prolongada', 'Antecipada'], correctIdx: 2, explanation: '{延長|えんちょう} = prolongamento.' },
      { section: 'grammar', questionType: 'reading_long', question: '【長文】{新|あたら}しい{制度|せいど}が{導入|どうにゅう}され、{従業員|じゅうぎょういん}の{満足度|まんぞくど}が{上|あ}がりました。{質問|しつもん}：何が{変|か}わりましたか？', options: ['Salário', 'Sistema/Regras', 'Horário', 'Local'], correctIdx: 1, explanation: '{制度|せいど} = sistema, regras.' },
      { section: 'listening', questionType: 'task_based', question: '【会話】A: {遅|おそ}れました。{電車|でんしゃ}が{遅|おく}れたんです。Aは何を説明していますか？', options: ['Por que se atrasou', 'Onde estava', 'O que fez', 'Quando chegou'], correctIdx: 0, explanation: 'んだ = explicação.' },
      { section: 'listening', questionType: 'key_points', question: '【会話】A: この{件|けん}は{来週|らいしゅう}までに{決|き}めましょう。B: 分かりました。Aは何を言いましたか？', options: ['Prazo para decisão', 'Cancelamento', 'Aprovação', 'Reunião'], correctIdx: 0, explanation: '{来週|らいしゅう}までに{決|き}める = decidir até semana que vem.' },
      { section: 'listening', questionType: 'verbal_expressions', question: '【会話】A: {少々|しょうしょう}お{待|ま}ちください。B: はい。Aは何を言いましたか？', options: ['Obrigado', 'Aguarde um momento', 'Desculpe', 'Com licença'], correctIdx: 1, explanation: '{少々|しょうしょう}お{待|ま}ちください = aguarde um momento.' },
      { section: 'listening', questionType: 'quick_response', question: '【会話】A: {恐|おそ}れいりますが、{少々|しょうしょう}お{時間|じかん}をいただけますか？B: ええ、どうぞ。Bの返事は？', options: ['Recusou', 'Concedeu', 'Não entendeu', 'Perguntou'], correctIdx: 1, explanation: 'どうぞ = concedeu.' },
    ],
  },

  N2: {
    level: 'N2',
    title: 'Simulado JLPT N2',
    description: 'Formato oficial. 言語知識・読解 105min | 聴解 50min. N1/N2 = seções combinadas.',
    timeMinutes: 155,
    passPercent: 60,
    sections: [
      { id: 'combined', name: '言語知識（語彙・文法）・読解', timeMin: 105 },
      { id: 'listening', name: '聴解', timeMin: 50 },
    ],
    questions: [
      { section: 'combined', questionType: 'paraphrases', question: '「{実施|じっし}する」の意味は？', options: ['Cancelar', 'Implementar', 'Planejar', 'Discutir'], correctIdx: 1, explanation: '{実施|じっし}する = implementar.' },
      { section: 'combined', questionType: 'paraphrases', question: '{影響|えいきょう} の 意味は？', options: ['Resultado', 'Influência', 'Causa', 'Efeito colateral'], correctIdx: 1, explanation: '{影響|えいきょう} = influência.' },
      { section: 'combined', questionType: 'paraphrases', question: '「{促進|そくしん}する」の意味は？', options: ['Impedir', 'Promover', 'Reduzir', 'Atrasar'], correctIdx: 1, explanation: '{促進|そくしん}する = promover.' },
      { section: 'combined', questionType: 'usage', question: '「おつかれさま」はいつ使いますか？', options: ['Antes de dormir', 'No trabalho (chegada/saída)', 'No restaurante', 'No banheiro'], correctIdx: 1, explanation: 'おつかれさま = bom trabalho.' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: '{先生|せんせい}の___ で {合格|ごうかく}できました。正しいのは？', options: ['せい', 'おかげ', 'ため', 'わけ'], correctIdx: 1, explanation: 'おかげで = graças a.' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: '{彼|かれ}は{来|く}る___ {違|ちが}いない。正しいのは？', options: ['に', 'と', 'が', 'を'], correctIdx: 0, explanation: 'に違いない = com certeza.' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: '{高|たか}いものが{良|よ}い___ {限|かぎ}りません。正しいのは？', options: ['とは', 'のに', 'ので', 'から'], correctIdx: 0, explanation: 'とは限らない = não necessariamente.' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: '{約束|やくそく}した___、{都合|つごう}が{悪|わる}くなりました。正しいのは？', options: ['から', 'ものの', 'ので', 'ために'], correctIdx: 1, explanation: 'ものの = embora... mas.' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: '{彼|かれ}は{仕事|しごと}___ {真面目|まじめ}です。正しいのは？', options: ['に対して', 'について', 'にとって', 'によって'], correctIdx: 0, explanation: 'に対して = em relação a.' },
      { section: 'combined', questionType: 'reading_mid', question: '【中文】{会議|かいぎ}の{結果|けっか}、{新|あたら}しい{方針|ほうしん}が{採択|さいたく}されました。{質問|しつもん}：何が{決|き}まりましたか？', options: ['Nova política', 'Novo chefe', 'Novo horário', 'Novo local'], correctIdx: 0, explanation: '{方針|ほうしん} = política, direção.' },
      { section: 'combined', questionType: 'integrated_comprehension', question: '【統合】{報告|ほうこく}によると、{売上|うりあげ}は{前年|ぜんねん}比10{％|ぱーせんと}{増|ぞう}でした。{質問|しつもん}：{報告|ほうこく}の{内容|ないよう}は？', options: ['Vendas caíram 10%', 'Vendas subiram 10%', 'Custos aumentaram', 'Lucro diminuiu'], correctIdx: 1, explanation: '{前年|ぜんねん}比10{％|ぱーせんと}{増|ぞう} = aumento de 10% em relação ao ano anterior.' },
      { section: 'listening', questionType: 'task_based', question: '【会話】A: {実は|じつは}、{明日|あした}{休|やす}みたいんです。B: 分かりました。Aは何を言いましたか？', options: ['Pediu folga', 'Informou que vai trabalhar', 'Recusou trabalho', 'Perguntou o horário'], correctIdx: 0, explanation: '{実は|じつは} = na verdade. Pediu folga.' },
      { section: 'listening', questionType: 'key_points', question: '【会話】A: {つまり|つまり}、{来週|らいしゅう}までに{出|だ}せばいいんですね？B: はい、そうです。Aは？', options: ['Resumiu o que entendeu', 'Recusou o prazo', 'Perguntou o preço', 'Não entendeu'], correctIdx: 0, explanation: '{つまり|つまり} = ou seja, em resumo.' },
      { section: 'listening', questionType: 'quick_response', question: '【会話】A: お{忙|いそが}しいところ、{恐|おそ}れいります。B: いえいえ、{全然|ぜんぜん}。Bの返事は？', options: ['Recusou', 'Não se importa', 'Reclamou', 'Pediu desculpas'], correctIdx: 1, explanation: 'いえいえ、全然 = não se importa.' },
    ],
  },

  N1: {
    level: 'N1',
    title: 'Simulado JLPT N1',
    description: 'Formato oficial. 言語知識・読解 110min | 聴解 55min. Nível avançado.',
    timeMinutes: 165,
    passPercent: 60,
    sections: [
      { id: 'combined', name: '言語知識（語彙・文法）・読解', timeMin: 110 },
      { id: 'listening', name: '聴解', timeMin: 55 },
    ],
    questions: [
      { section: 'combined', questionType: 'paraphrases', question: '「{検討|けんとう}する」の意味は？', options: ['Implementar', 'Examinar/Analisar', 'Aprovar', 'Recusar'], correctIdx: 1, explanation: '{検討|けんとう}する = examinar, analisar.' },
      { section: 'combined', questionType: 'paraphrases', question: '{現状|げんじょう} の 意味は？', options: ['Passado', 'Situação atual', 'Futuro', 'Ideal'], correctIdx: 1, explanation: '{現状|げんじょう} = situação atual.' },
      { section: 'combined', questionType: 'paraphrases', question: '「{換言|かんげん}すれば」の意味は？', options: ['Em resumo', 'Em outras palavras', 'Por exemplo', 'No entanto'], correctIdx: 1, explanation: '{換言|かんげん}すれば = em outras palavras.' },
      { section: 'combined', questionType: 'word_formation', question: '「{再検討|さいけんとう}」の{適|てき}切な{使用|しよう}は？', options: ['もう一度考えること', '初めて考えること', '忘れること', '諦めること'], correctIdx: 0, explanation: '{再|さい} = de novo. {検討|けんとう} = exame.' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: '{言|い}う___ もなく、{彼|かれ}は{優秀|ゆうしゅう}です。正しいのは？', options: ['までもない', 'わけではない', 'はずがない', 'ものではない'], correctIdx: 0, explanation: 'までもない = não precisa nem dizer.' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: 'その{件|けん}については{答|こた}え___ ます。正しいのは？', options: ['やすい', 'かね', 'すぎ', 'にくい'], correctIdx: 1, explanation: 'かねる = não poder (recusa educada).' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: 'これは{信|しん}じるに___ {情報|じょうほう}です。正しいのは？', options: ['足る', '過ぎる', '及ぶ', '違う'], correctIdx: 0, explanation: 'に足る = valer a pena.' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: '{雨|あめ}___ {出|で}かけました。正しいのは？', options: ['にもかかわらず', 'ので', 'から', 'のに'], correctIdx: 0, explanation: 'にもかかわらず = apesar de.' },
      { section: 'combined', questionType: 'sentential_grammar_1', question: '{謝|あやま}らずには___ ない。正しいのは？', options: ['いられ', 'すま', 'おけ', 'たまら'], correctIdx: 1, explanation: 'ずにはすまない = não pode deixar de.' },
      { section: 'combined', questionType: 'reading_long', question: '【長文】{文脈|ぶんみゃく}から{推測|すいそく}する の 意味は？', options: ['Traduzir literalmente', 'Inferir pelo contexto', 'Ignorar o texto', 'Copiar a resposta'], correctIdx: 1, explanation: '{文脈|ぶんみゃく} = contexto. {推測|すいそく} = inferir.' },
      { section: 'combined', questionType: 'thematic_comprehension', question: '【主題】{論|ろん}じる の 意味は？', options: ['Discutir/Argumentar', 'Concordar', 'Ignorar', 'Resumir'], correctIdx: 0, explanation: '{論|ろん}じる = argumentar, discutir.' },
      { section: 'listening', questionType: 'task_based', question: '【会話】A: {従来|じゅうらい}の{方法|ほうほう}では{限界|げんかい}があります。B: {一方|いっぽう}で、{新|あたら}しい{手法|しゅほう}も{検討|けんとう}すべきですね。二人は？', options: ['Discutindo alternativas', 'Concordando totalmente', 'Recusando mudanças', 'Ignorando o problema'], correctIdx: 0, explanation: '{従来|じゅうらい} = tradicional. {一方|いっぽう}で = por outro lado.' },
      { section: 'listening', questionType: 'key_points', question: '【会話】A: この{件|けん}は{即座|そくざ}に{対応|たいおう}するに{値|あたい}します。B: {承知|しょうち}しました。Aの意見は？', options: ['Vale a pena tratar com urgência', 'Pode esperar', 'Não é importante', 'Deve ser cancelado'], correctIdx: 0, explanation: '{即座|そくざ}に = imediatamente. {値|あたい}する = merecer.' },
      { section: 'listening', questionType: 'integrated_comprehension', question: '【統合】A: {現状|げんじょう}の{体制|たいせい}では{対応|たいおう}しきれません。B: では、{抜本|ばっぽん}的な{見直|みなお}しを{提案|ていあん}します。二人の{結論|けつろん}に近いのは？', options: ['Mudança radical necessária', 'Manter como está', 'Pequenos ajustes', 'Adiar decisão'], correctIdx: 0, explanation: '{抜本|ばっぽん}的 = fundamental, radical.' },
    ],
  },
};

/** Embaralha um array (Fisher-Yates) */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Embaralha as alternativas de uma questão e atualiza correctIdx */
function shuffleQuestionOptions(q) {
  const indices = q.options.map((_, i) => i);
  const shuffled = shuffleArray(indices);
  const newOptions = shuffled.map((i) => q.options[i]);
  const newCorrectIdx = shuffled.indexOf(q.correctIdx);
  return { ...q, options: newOptions, correctIdx: newCorrectIdx };
}

/** Retorna o simulado de um nível */
export function getSimuladoByLevel(level) {
  return SIMULADOS[level] || null;
}

/** Retorna um simulado com questões e alternativas embaralhadas (aleatório a cada vez) */
export function getRandomizedSimulado(level) {
  const sim = SIMULADOS[level];
  if (!sim) return null;
  const shuffledQuestions = shuffleArray(sim.questions).map(shuffleQuestionOptions);
  return {
    ...sim,
    questions: shuffledQuestions,
  };
}

/** Retorna todos os níveis disponíveis */
export function getSimuladoLevels() {
  return Object.keys(SIMULADOS);
}
