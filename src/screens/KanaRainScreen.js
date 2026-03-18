import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar, ScrollView,
} from 'react-native';
import { HIRAGANA_GROUPS, KATAKANA_GROUPS, getAllHiragana, getAllKatakana } from '../data/kana';
import { usePlayer } from '../context/PlayerContext';
import RankUpModal from '../components/RankUpModal';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Constantes ───────────────────────────────────────────────────────────────
const KANA_SIZE       = 70;
const HITS_PER_GROUP  = 10;
const HITS_CHALLENGE  = 40;  // desafio de grupo completo
const HITS_FINAL      = 60;  // batalha final (hiragana + katakana)
const MAX_HP          = 3;
const XP_PER_CORRECT  = 5;   // XP por acerto no Chuva de Kana
const NUM_OPTIONS     = 4;
const LIMIT_LINE_Y    = SH * 0.52;
const FALL_MS         = 4000;

const ALL_HIRAGANA = getAllHiragana();
const ALL_KATAKANA = getAllKatakana();
const ALL_KANA     = [...ALL_HIRAGANA, ...ALL_KATAKANA];

// ─── Utilitários ──────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildOptions(correct, groupKanas, fallbackPool) {
  const groupOthers = groupKanas.filter(k => k.romaji !== correct.romaji);
  const need = NUM_OPTIONS - 1;
  let distractors;
  if (groupOthers.length >= need) {
    distractors = shuffle(groupOthers).slice(0, need).map(k => k.romaji);
  } else {
    const extras = fallbackPool.filter(
      k => k.romaji !== correct.romaji &&
           !groupOthers.find(d => d.romaji === k.romaji)
    );
    distractors = [
      ...groupOthers.map(k => k.romaji),
      ...shuffle(extras).slice(0, need - groupOthers.length).map(k => k.romaji),
    ];
  }
  return shuffle([correct.romaji, ...distractors]);
}

// ─── Narrativa entre fases ────────────────────────────────────────────────────
const NARRATIVES = {
  hiraganaChallenge: {
    icon: '🧙',
    title: 'Desafio do Mestre',
    accentColor: '#90caf9',
    borderColor: '#1565c0',
    scenes: [
      {
        speaker: 'Eimei',
        japanese: '「よくできました！」',
        text: '"Muito bem! Você aprendeu todos os grupos de Hiragana."\n\nO monge ergue o cajado com um sorriso grave.',
      },
      {
        speaker: 'Eimei',
        japanese: '「しかし、まだ試練がある。」',
        text: '"Mas ainda há uma prova."\n\n"Agora lançarei TODAS as letras hiragana misturadas. Identifique cada uma antes que toque o chão."',
      },
      {
        speaker: '— Narrador —',
        japanese: null,
        text: 'A névoa de Kurokami adensa. Fragmentos de memória giram no ar como folhas ao vento.\n\nRyuu respira fundo e aguarda.',
      },
    ],
    btnText: '⚡  Aceitar o Desafio!',
  },

  katakanaIntro: {
    icon: '📜',
    title: 'Novo Ensinamento',
    accentColor: '#a5d6a7',
    borderColor: '#2e7d32',
    scenes: [
      {
        speaker: 'Eimei',
        japanese: '「素晴らしい！ひらがなは完璧だ。」',
        text: '"Extraordinário! Você dominou o Hiragana."\n\nA névoa recua um pouco. Ryuu sente um calor familiar no peito — como uma memória tentando voltar.',
      },
      {
        speaker: 'Eimei',
        japanese: 'カタカナ',
        text: '"Agora aprenderemos o Katakana.\n\nSão mais 46 letras — usadas para palavras estrangeiras e nomes. Parecem com o hiragana, mas têm traços mais retos e angulares."',
      },
      {
        speaker: 'Eimei',
        japanese: 'ア　イ　ウ　エ　オ',
        text: '"Os mesmos sons que você já conhece... com uma nova forma.\n\nSua memória já guarda os sons. Agora guarde os símbolos."',
      },
    ],
    btnText: '→  Aprender Katakana',
  },

  katakanaChallenge: {
    icon: '🧙',
    title: 'Segundo Desafio',
    accentColor: '#a5d6a7',
    borderColor: '#1b5e20',
    scenes: [
      {
        speaker: 'Eimei',
        japanese: '「katakanaもできました！」',
        text: '"Você aprendeu todos os grupos de Katakana também!\n\nSua mente está se tornando forte novamente."',
      },
      {
        speaker: 'Eimei',
        japanese: '「では、第二の試練だ。」',
        text: '"Então... a segunda prova.\n\nTodas as letras Katakana misturadas. Sem hesitar. Sem errar."',
      },
    ],
    btnText: '⚡  Aceitar o Desafio!',
  },

  eimeiFarewell: {
    icon: '🌸',
    title: 'Adeus, Mestre Eimei',
    accentColor: '#c8a96e',
    borderColor: '#5d4037',
    scenes: [
      {
        speaker: 'Eimei',
        japanese: '「よくやった、武田竜。」',
        text: '"Muito bem, Takeda Ryuu."\n\nO monge sorri — talvez a primeira vez desde que encontraram-se na estrada.\n\n"Eu sabia que você lembraria."',
      },
      {
        speaker: 'Eimei',
        japanese: '「あなたの家族はまだ生きている。」',
        text: '"Sua família ainda está viva. Kurokami os mantém prisioneiros em seu castelo nas montanhas negras.\n\nMas você ainda não está pronto para enfrentá-lo."',
      },
      {
        speaker: 'Eimei',
        japanese: null,
        text: '"A língua é apenas o começo. Para derrotar Kurokami, você precisará de vocabulário, gramática, e da sabedoria que só a jornada pode dar.\n\nO mundo lá fora será seu dojo."',
      },
      {
        speaker: '— Narrador —',
        japanese: null,
        text: 'Eimei entrega a Ryuu um velho pergaminho com os kanas escritos à mão.\n\n"Carregue isso. Para quando a névoa tentar voltar."',
      },
      {
        speaker: 'Ryuu',
        japanese: '「ありがとうございます、永明師。」',
        text: '"Obrigado, Mestre Eimei."\n\nPelas primeiras palavras pronunciadas com memória real.\n\nRyuu inclina a cabeça, pega o cajado de viajante... e parte para a jornada.',
      },
    ],
    btnText: '⚔  Iniciar a Jornada!',
  },

  finalBattle: {
    icon: '🏯',
    title: 'Prova Final do Mestre',
    accentColor: '#ffd700',
    borderColor: '#5d4037',
    scenes: [
      {
        speaker: 'Eimei',
        japanese: '「よくぞここまで来た。」',
        text: '"Você chegou longe, jovem."\n\nO monge caminha lentamente até o centro do dojo e coloca o cajado à frente.',
      },
      {
        speaker: 'Eimei',
        japanese: '「最後の試練の時が来た。」',
        text: '"A hora da prova final chegou.\n\nVocê aprendeu o Hiragana. Aprendeu o Katakana.\n\nMas um mestre só reconhece um discípulo quando os dois sistemas se tornam um só, na mente e no coração."',
      },
      {
        speaker: '— Narrador —',
        japanese: null,
        text: 'O velho monge respira fundo. Seus olhos se fecham por um instante.\n\nQuando se abrem, há uma determinação silenciosa — não de inimigo, mas de mestre que confia em seu aluno.',
      },
      {
        speaker: 'Eimei',
        japanese: '「ひらがなとカタカナ。全部見せろ。」',
        text: '"Hiragana e Katakana misturados. Mostre tudo que aprendeu.\n\nSe passar desta prova... você estará pronto para sair deste templo e enfrentar o que o destino reserva."',
      },
      {
        speaker: '— Narrador —',
        japanese: null,
        text: 'Ryuu fecha os punhos. Algo dentro dele vibra — não medo, mas determinação.\n\nEm algum lugar, além das montanhas, sua família o espera.\n\nPrimeiro: esta prova.',
      },
    ],
    btnText: '🏯  Aceitar a Prova Final!',
  },
};

// ─── Componente: Painel de Narrativa ─────────────────────────────────────────
const NarrativePanel = ({ narrativeKey, onDone }) => {
  const [sceneIdx, setSceneIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const n = NARRATIVES[narrativeKey];
  const scene = n.scenes[sceneIdx];

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [sceneIdx]);

  const next = () => {
    if (sceneIdx < n.scenes.length - 1) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
        setSceneIdx(i => i + 1)
      );
    } else {
      onDone();
    }
  };

  return (
    <View style={[styles.narrativeContainer, { borderColor: n.borderColor }]}>
      <StatusBar hidden />

      <View style={styles.narrativeHeader}>
        <Text style={styles.narrativeIcon}>{n.icon}</Text>
        <Text style={[styles.narrativeTitle, { color: n.accentColor }]}>{n.title}</Text>
        <Text style={styles.narrativeProgress}>{sceneIdx + 1}/{n.scenes.length}</Text>
      </View>

      <View style={[styles.narrativeProgressBar, { borderColor: n.accentColor + '44' }]}>
        <View style={[
          styles.narrativeProgressFill,
          { width: `${((sceneIdx + 1) / n.scenes.length) * 100}%`, backgroundColor: n.accentColor }
        ]} />
      </View>

      <Animated.View style={[styles.narrativeContent, { opacity: fadeAnim }]}>
        {scene.japanese && (
          <View style={[styles.narrativeJpBox, { borderColor: n.accentColor + '44' }]}>
            <Text style={[styles.narrativeJp, { color: n.accentColor }]}>{scene.japanese}</Text>
          </View>
        )}

        <View style={styles.narrativeSpeechBox}>
          {scene.speaker && (
            <Text style={[styles.narrativeSpeaker, { color: n.accentColor }]}>{scene.speaker}</Text>
          )}
          <Text style={styles.narrativeSpeech}>{scene.text}</Text>
        </View>
      </Animated.View>

      <TouchableOpacity
        style={[styles.narrativeBtn, { backgroundColor: n.borderColor, borderColor: n.accentColor }]}
        onPress={next}
      >
        <Text style={styles.narrativeBtnText}>
          {sceneIdx < n.scenes.length - 1 ? 'Continuar →' : n.btnText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Tela de Ensino do Grupo ──────────────────────────────────────────────────
const GroupLesson = ({ group, system, onReady }) => {
  const [revealed, setRevealed] = useState(0);
  const kanas = group.kanas;
  const allRevealed = revealed >= kanas.length;
  const accent = system === 'hiragana' ? '#90caf9' : '#a5d6a7';

  return (
    <View style={styles.lessonContainer}>
      <View style={styles.lessonHeader}>
        <Text style={styles.lessonEmoji}>{system === 'hiragana' ? '✨' : '🌿'}</Text>
        <Text style={[styles.lessonTitle, { color: accent }]}>{group.label}</Text>
        <Text style={styles.lessonSystem}>
          {system === 'hiragana' ? 'Hiragana' : 'Katakana'}
        </Text>
        <Text style={styles.lessonNote}>O mini-game usará apenas estas letras</Text>
      </View>

      <View style={styles.kanaGrid}>
        {kanas.map((k, i) => (
          <View key={i} style={[
            styles.kanaCard,
            i < revealed && styles.kanaCardActive,
            i < revealed && { borderColor: accent + '66' },
          ]}>
            <Text style={styles.kanaCardChar}>{k.kana}</Text>
            <Text style={[styles.kanaCardRomaji, { color: accent }]}>{k.romaji.toUpperCase()}</Text>
            <Text style={styles.kanaCardExample}>{k.example}</Text>
            <Text style={styles.kanaCardPt}>{k.examplePt}</Text>
          </View>
        ))}
      </View>

      {!allRevealed ? (
        <TouchableOpacity
          style={[styles.lessonBtn, { borderColor: accent }]}
          onPress={() => setRevealed(r => r + 1)}
        >
          <Text style={styles.lessonBtnText}>
            {revealed === 0 ? '→  Ver letras' : `→  Próxima (${revealed}/${kanas.length})`}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.lessonBtn, styles.lessonBtnReady]}
          onPress={onReady}
        >
          <Text style={styles.lessonBtnText}>⚔  Praticar este grupo!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Tela de Resultado / Derrota ─────────────────────────────────────────────
const ResultScreen = ({ type, score, onAction }) => {
  const cfg = {
    defeat: {
      icon: '💫', title: 'A mente ainda vacila...',
      text: 'As letras embaralharam por um momento.\n\nEimei acena com calma:\n\n"Não se preocupe. Um guerreiro cai para aprender onde está o chão. Tente novamente."',
      btnText: '↩  Tentar novamente', btnColor: '#4a3000', btnBorder: '#ffd700',
    },
    victory: {
      icon: '🏆', title: 'Prova Superada!',
      text: 'Eimei inclina a cabeça com respeito silencioso.\n\nE então, como um raio na escuridão, a névoa se parte.\n\nUma lembrança. Nítida. Irresistível.\n\nRyuu fecha os olhos e murmura:',
      jp: '「私の名前は...武田竜だ。」',
      jpPt: '"Meu nome é... Takeda Ryuu."',
      btnText: '⚔  Iniciar a Jornada →', btnColor: '#2e7d32', btnBorder: '#4caf50',
    },
  }[type];

  return (
    <View style={[styles.container, styles.centerContent]}>
      <StatusBar hidden />
      <Text style={{ fontSize: 72, marginBottom: 16 }}>{cfg.icon}</Text>
      <Text style={[styles.resultTitle, type === 'defeat' ? { color: '#f44336' } : { color: '#ffd700' }]}>
        {cfg.title}
      </Text>
      <Text style={styles.resultText}>{cfg.text}</Text>
      {cfg.jp && (
        <View style={styles.resultJpBox}>
          <Text style={styles.resultJp}>{cfg.jp}</Text>
          <Text style={styles.resultJpPt}>{cfg.jpPt}</Text>
        </View>
      )}
      <Text style={styles.resultScore}>Pontuação: {score}</Text>
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: cfg.btnColor, borderColor: cfg.btnBorder }]}
        onPress={onAction}
      >
        <Text style={styles.actionBtnText}>{cfg.btnText}</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── KanaRainScreen ───────────────────────────────────────────────────────────
/*
  Fluxo de fases:
  lesson_h  → playing_h  → groupClear_h  → (próximo grupo ou hiraganaChallenge_intro)
  hiraganaChallenge_intro → hiraganaChallenge
  katakanaIntro_intro     → lesson_k
  lesson_k  → playing_k  → groupClear_k  → (próximo grupo ou katakanaChallenge_intro)
  katakanaChallenge_intro → katakanaChallenge
  finalBattle_intro       → finalBattle
  victory / defeat
*/
export default function KanaRainScreen({ navigation, route }) {
  const { kanaPhase: savedPhase, kanaHGroupIdx: savedHIdx, kanaKGroupIdx: savedKIdx, saveProgress, gainXP, knowKanaAsked } = usePlayer();

  // fromTemple = chamado do Templo de Eimei — mostra tela de seleção antes de jogar
  const fromTemple = route?.params?.fromTemple === true;

  // Modo história: pergunta se já sabe hiragana/katakana antes de começar
  const showKnowKanaAsk = !fromTemple && !knowKanaAsked && (savedPhase === 'lesson_h' || !savedPhase);
  const initialPhase = fromTemple ? 'temple_select' : (showKnowKanaAsk ? 'know_kana_ask' : (savedPhase || 'lesson_h'));

  const [phase,      setPhase]    = useState(initialPhase);
  const [hGroupIdx,  setHGroupIdx] = useState(savedHIdx ?? 0);
  const [kGroupIdx,  setKGroupIdx] = useState(savedKIdx ?? 0);

  // Estado do jogo — sempre usa HP normal do modo história
  const [currentKana, setCurrentKana] = useState(null);
  const [options,     setOptions]     = useState([]);
  const [kanaX,       setKanaX]       = useState(SW / 2 - KANA_SIZE / 2);
  const [hp,    setHp]    = useState(MAX_HP);
  const [score, setScore] = useState(0);
  const [hits,  setHits]  = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [rankUpModal, setRankUpModal] = useState(null);

  // Animações
  const animY       = useRef(new Animated.Value(-KANA_SIZE)).current;
  const kanaScale   = useRef(new Animated.Value(1)).current;
  const optionShake = useRef(new Animated.Value(0)).current;
  const animRef     = useRef(null);
  const limitTimer  = useRef(null);

  // Configuração do modo atual
  const modeRef = useRef({ pool: [], groupKanas: [], hitsTarget: HITS_PER_GROUP });
  const lastPlayingPhaseRef = useRef(phase);

  const isPlayingPhase = p =>
    ['playing_h', 'playing_k', 'hiraganaChallenge', 'katakanaChallenge', 'finalBattle'].includes(p);

  useEffect(() => {
    if (isPlayingPhase(phase)) lastPlayingPhaseRef.current = phase;
  }, [phase]);

  const showFeedback = (msg, color) => {
    setFeedback({ msg, color });
    setTimeout(() => setFeedback(null), 850);
  };

  // ── Configura o modo antes de entrar em jogo ────────────────────────────
  const configureMode = useCallback((targetPhase, hIdx, kIdx) => {
    let pool, groupKanas, hitsTarget;
    switch (targetPhase) {
      case 'playing_h':
        pool = HIRAGANA_GROUPS[hIdx].kanas;
        groupKanas = pool;
        hitsTarget = HITS_PER_GROUP;
        break;
      case 'playing_k':
        pool = KATAKANA_GROUPS[kIdx].kanas;
        groupKanas = pool;
        hitsTarget = HITS_PER_GROUP;
        break;
      case 'hiraganaChallenge':
        pool = ALL_HIRAGANA;
        groupKanas = ALL_HIRAGANA;
        hitsTarget = HITS_CHALLENGE;
        break;
      case 'katakanaChallenge':
        pool = ALL_KATAKANA;
        groupKanas = ALL_KATAKANA;
        hitsTarget = HITS_CHALLENGE;
        break;
      case 'finalBattle':
        pool = ALL_KANA;
        groupKanas = ALL_KANA;
        hitsTarget = HITS_FINAL;
        break;
      default:
        return;
    }
    modeRef.current = { pool, groupKanas, hitsTarget };
    setHp(MAX_HP);
    setHits(0);
    setCombo(0);
    setPhase(targetPhase);
  }, []);

  // ── Spawn de kana ────────────────────────────────────────────────────────
  const spawnKana = useCallback(() => {
    const { pool, groupKanas } = modeRef.current;
    if (!pool.length) return;

    const next = pickRandom(pool);
    const opts = buildOptions(next, groupKanas, ALL_KANA);
    const x    = Math.random() * (SW - KANA_SIZE - 20) + 10;

    setCurrentKana(next);
    setOptions(opts);
    setKanaX(x);
    setAnswered(false);
    animY.setValue(-KANA_SIZE);
    kanaScale.setValue(1);

    const limitTime = FALL_MS * (LIMIT_LINE_Y / SH);
    clearTimeout(limitTimer.current);
    limitTimer.current = setTimeout(() => {
      setAnswered(prev => {
        if (!prev) {
          setHp(h => {
            const nH = Math.max(0, h - 1);
            if (nH === 0) { animRef.current?.stop(); setPhase('defeat'); }
            return nH;
          });
          setCombo(0);
          showFeedback('⏱  Tarde demais!', '#ff9800');
        }
        return prev;
      });
    }, limitTime);

    animRef.current = Animated.timing(animY, {
      toValue: SH + KANA_SIZE,
      duration: FALL_MS,
      useNativeDriver: true,
    });
    animRef.current.start(({ finished }) => { if (finished) spawnKana(); });
  }, []);

  // ── Garante modo configurado ao entrar em fase de jogo (ex.: direto do templo) ─
  useEffect(() => {
    if (isPlayingPhase(phase) && (!modeRef.current.pool || modeRef.current.pool.length === 0)) {
      configureMode(phase, hGroupIdx, kGroupIdx);
    }
  }, [phase]);

  // ── Inicia spawn ao entrar em fase de jogo ───────────────────────────────
  useEffect(() => {
    if (isPlayingPhase(phase)) spawnKana();
    return () => { animRef.current?.stop(); clearTimeout(limitTimer.current); };
  }, [phase]);

  // ── Resposta do jogador ──────────────────────────────────────────────────
  const handleOption = (romaji) => {
    if (answered || !currentKana) return;
    setAnswered(true);
    clearTimeout(limitTimer.current);
    animRef.current?.stop();

    const correct = romaji === currentKana.romaji;

    if (correct) {
      const newCombo = combo + 1;
      const pts      = 10 + newCombo * 3;
      setCombo(newCombo);
      setScore(s => s + pts);
      const newHits = hits + 1;
      setHits(newHits);
      if (!fromTemple) {
        gainXP(XP_PER_CORRECT, (newRank) => { if (newRank) setRankUpModal(newRank); });
      }
      showFeedback(newCombo >= 3 ? `🔥 Combo ×${newCombo}! +${pts}` : `✓  Correto! +${pts}`, '#4caf50');

      Animated.parallel([
        Animated.timing(animY,     { toValue: -KANA_SIZE * 2, duration: 280, useNativeDriver: true }),
        Animated.timing(kanaScale, { toValue: 1.7,             duration: 280, useNativeDriver: true }),
      ]).start(() => {
        if (newHits >= modeRef.current.hitsTarget) {
          handlePhaseComplete(phase);
        } else {
          spawnKana();
        }
      });
    } else {
      setCombo(0);
      showFeedback(`✗  Era "${currentKana.romaji.toUpperCase()}"`, '#f44336');
      Animated.sequence([
        Animated.timing(optionShake, { toValue: 10,  duration: 50, useNativeDriver: true }),
        Animated.timing(optionShake, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(optionShake, { toValue: 5,   duration: 50, useNativeDriver: true }),
        Animated.timing(optionShake, { toValue: 0,   duration: 50, useNativeDriver: true }),
      ]).start();

      setHp(h => {
        const nH = Math.max(0, h - 1);
        if (nH === 0) { animRef.current?.stop(); setPhase('defeat'); }
        return nH;
      });
      setTimeout(() => {
        setHp(prev => { if (prev > 0) spawnKana(); return prev; });
      }, 950);
    }
  };

  // ── Decide o que acontece ao concluir cada fase ──────────────────────────
  const handlePhaseComplete = (currentPhase) => {
    switch (currentPhase) {
      case 'playing_h': {
        if (fromTemple) {
          setPhase('temple_clear');
        } else {
          const nextIdx = hGroupIdx + 1;
          if (nextIdx >= HIRAGANA_GROUPS.length) {
            saveProgress({ lastScreen: 'KanaRain', kanaPhase: 'hiraganaChallenge_intro', kanaHGroupIdx: hGroupIdx });
            setPhase('hiraganaChallenge_intro');
          } else {
            setHGroupIdx(nextIdx);
            saveProgress({ lastScreen: 'KanaRain', kanaPhase: 'lesson_h', kanaHGroupIdx: nextIdx });
            setPhase('groupClear_h');
          }
        }
        break;
      }
      case 'hiraganaChallenge':
        if (fromTemple) {
          setPhase('temple_clear');
        } else {
          saveProgress({ lastScreen: 'KanaRain', kanaPhase: 'katakanaIntro_intro' });
          setPhase('katakanaIntro_intro');
        }
        break;
      case 'playing_k': {
        if (fromTemple) {
          setPhase('temple_clear');
        } else {
          const nextIdx = kGroupIdx + 1;
          if (nextIdx >= KATAKANA_GROUPS.length) {
            saveProgress({ lastScreen: 'KanaRain', kanaPhase: 'katakanaChallenge_intro', kanaKGroupIdx: kGroupIdx });
            setPhase('katakanaChallenge_intro');
          } else {
            setKGroupIdx(nextIdx);
            saveProgress({ lastScreen: 'KanaRain', kanaPhase: 'lesson_k', kanaKGroupIdx: nextIdx });
            setPhase('groupClear_k');
          }
        }
        break;
      }
      case 'katakanaChallenge':
        if (fromTemple) {
          setPhase('temple_clear');
        } else {
          saveProgress({ lastScreen: 'KanaRain', kanaPhase: 'finalBattle_intro' });
          setPhase('finalBattle_intro');
        }
        break;
      case 'finalBattle':
        if (fromTemple) {
          setPhase('temple_clear');
        } else {
          setPhase('victory');
        }
        break;
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // RENDERS POR FASE
  // ────────────────────────────────────────────────────────────────────────────

  // ── Seleção do Templo (Chuva de Kana) ───────────────────────────────────────
  const handleTempleSelect = (mode, hIdx = 0, kIdx = 0) => {
    if (mode === 'playing_h') {
      setHGroupIdx(hIdx);
      configureMode('playing_h', hIdx, kGroupIdx);
    } else if (mode === 'playing_k') {
      setKGroupIdx(kIdx);
      configureMode('playing_k', hGroupIdx, kIdx);
    } else if (mode === 'hiraganaChallenge') {
      configureMode('hiraganaChallenge', hGroupIdx, kGroupIdx);
    } else if (mode === 'katakanaChallenge') {
      configureMode('katakanaChallenge', hGroupIdx, kGroupIdx);
    } else if (mode === 'finalBattle') {
      configureMode('finalBattle', hGroupIdx, kGroupIdx);
    }
  };

  // ── Modo história: pergunta se já sabe hiragana/katakana ─────────────────────
  if (phase === 'know_kana_ask') {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={[styles.container, styles.centerContent, { padding: 24 }]}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📖</Text>
          <Text style={styles.clearTitle}>Antes de começar</Text>
          <Text style={[styles.clearSub, { marginBottom: 24, textAlign: 'center' }]}>
            Você já sabe ler hiragana e katakana?
          </Text>
          <View style={{ gap: 12, width: '100%', maxWidth: 280 }}>
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: '#4caf50', backgroundColor: '#4caf5022' }]}
              onPress={async () => {
                await saveProgress({ lastScreen: 'Map', kanaPhase: 'done', jlptLevel: 'Iniciante', knowKanaAsked: true });
                navigation.replace('Map');
              }}
            >
              <Text style={styles.actionBtnText}>Sim, já sei</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: '#90caf9' }]}
              onPress={async () => {
                await saveProgress({ lastScreen: 'KanaRain', kanaPhase: 'lesson_h', knowKanaAsked: true });
                setPhase('lesson_h');
              }}
            >
              <Text style={styles.actionBtnText}>Não, quero aprender</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (phase === 'temple_select') {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.templeSelectHeader}>
          <TouchableOpacity style={styles.templeSelectBack} onPress={() => navigation.goBack()}>
            <Text style={styles.templeSelectBackText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.templeSelectTitle}>🌧 Chuva de Kana</Text>
          <Text style={styles.templeSelectSub}>Escolha o que treinar</Text>
        </View>
        <ScrollView style={styles.templeSelectScroll} showsVerticalScrollIndicator={false}>
          {/* Hiragana */}
          <View style={[styles.templeSelectSection, { borderLeftColor: '#90caf9' }]}>
            <Text style={styles.templeSelectSectionTitle}>ひ Hiragana</Text>
            {HIRAGANA_GROUPS.map((g, i) => (
              <TouchableOpacity
                key={`h-${g.id}`}
                style={[styles.templeSelectCard, { borderColor: '#90caf9' }]}
                onPress={() => handleTempleSelect('playing_h', i, 0)}
              >
                <Text style={styles.templeSelectCardLabel}>{g.label}</Text>
                <View style={styles.templeSelectKanaRow}>
                  {g.kanas.map((k, ki) => (
                    <View key={ki} style={styles.templeSelectKanaCol}>
                      <Text style={styles.templeSelectCardKanas}>{k.kana}</Text>
                      <Text style={styles.templeSelectCardRomaji}>{k.romaji}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.templeSelectCard, styles.templeSelectCardAll, { borderColor: '#64b5f6' }]}
              onPress={() => handleTempleSelect('hiraganaChallenge')}
            >
              <Text style={styles.templeSelectCardLabel}>🌀 Todos os Hiragana</Text>
              <Text style={styles.templeSelectCardDesc}>46 caracteres misturados</Text>
            </TouchableOpacity>
          </View>

          {/* Katakana */}
          <View style={[styles.templeSelectSection, { borderLeftColor: '#a5d6a7' }]}>
            <Text style={[styles.templeSelectSectionTitle, { color: '#a5d6a7' }]}>カ Katakana</Text>
            {KATAKANA_GROUPS.map((g, i) => (
              <TouchableOpacity
                key={`k-${g.id}`}
                style={[styles.templeSelectCard, { borderColor: '#a5d6a7' }]}
                onPress={() => handleTempleSelect('playing_k', 0, i)}
              >
                <Text style={styles.templeSelectCardLabel}>{g.label}</Text>
                <View style={styles.templeSelectKanaRow}>
                  {g.kanas.map((k, ki) => (
                    <View key={ki} style={styles.templeSelectKanaCol}>
                      <Text style={styles.templeSelectCardKanas}>{k.kana}</Text>
                      <Text style={styles.templeSelectCardRomaji}>{k.romaji}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.templeSelectCard, styles.templeSelectCardAll, { borderColor: '#81c784' }]}
              onPress={() => handleTempleSelect('katakanaChallenge')}
            >
              <Text style={styles.templeSelectCardLabel}>🌀 Todos os Katakana</Text>
              <Text style={styles.templeSelectCardDesc}>46 caracteres misturados</Text>
            </TouchableOpacity>
          </View>

          {/* Hiragana + Katakana */}
          <View style={[styles.templeSelectSection, { borderLeftColor: '#ffd700' }]}>
            <Text style={[styles.templeSelectSectionTitle, { color: '#ffd700' }]}>⚔ Batalha Final</Text>
            <TouchableOpacity
              style={[styles.templeSelectCard, styles.templeSelectCardAll, { borderColor: '#ffd700' }]}
              onPress={() => handleTempleSelect('finalBattle')}
            >
              <Text style={styles.templeSelectCardLabel}>🌀 Hiragana + Katakana</Text>
              <Text style={styles.templeSelectCardDesc}>92 caracteres misturados</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Conclusão no Templo (treino concluído) ─────────────────────────────────
  if (phase === 'temple_clear') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar hidden />
        <Text style={{ fontSize: 56, marginBottom: 12 }}>⭐</Text>
        <Text style={styles.clearTitle}>Treino Concluído!</Text>
        <Text style={styles.clearScore}>Pontuação: {score}</Text>
        <View style={styles.templeClearActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: '#90caf9', marginBottom: 12 }]}
            onPress={() => setPhase('temple_select')}
          >
            <Text style={styles.actionBtnText}>🔄 Treinar de novo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: '#a5d6a7' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.actionBtnText}>← Voltar ao Templo</Text>
          </TouchableOpacity>
        </View>
        <RankUpModal visible={!!rankUpModal} newRank={rankUpModal} onDismiss={() => setRankUpModal(null)} />
      </View>
    );
  }

  // ── Lições de Hiragana ─────────────────────────────────────────────────────
  if (phase === 'lesson_h') {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <GroupLesson
          group={HIRAGANA_GROUPS[hGroupIdx]}
          system="hiragana"
          onReady={() => configureMode('playing_h', hGroupIdx, kGroupIdx)}
        />
      </View>
    );
  }

  // ── Grupo de Hiragana concluído ────────────────────────────────────────────
  if (phase === 'groupClear_h') {
    const nextGroup = HIRAGANA_GROUPS[hGroupIdx];
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar hidden />
        <Text style={{ fontSize: 56, marginBottom: 12 }}>⭐</Text>
        <Text style={styles.clearTitle}>Grupo Dominado!</Text>
        <Text style={[styles.clearSub, { color: '#90caf9' }]}>
          {HIRAGANA_GROUPS[hGroupIdx - 1]?.label} ✓
        </Text>
        <Text style={styles.clearScore}>Pontuação: {score}</Text>
        {nextGroup && (
          <Text style={styles.clearNextLabel}>Próximo: {nextGroup.label}</Text>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: '#90caf9' }]}
          onPress={() => setPhase('lesson_h')}
        >
          <Text style={styles.actionBtnText}>
            {nextGroup ? `Aprender ${nextGroup.label} →` : 'Continuar →'}
          </Text>
        </TouchableOpacity>
        <RankUpModal visible={!!rankUpModal} newRank={rankUpModal} onDismiss={() => setRankUpModal(null)} />
      </View>
    );
  }

  // ── Narrativas intermediárias ──────────────────────────────────────────────
  if (phase === 'hiraganaChallenge_intro') {
    return (
      <NarrativePanel
        narrativeKey="hiraganaChallenge"
        onDone={() => configureMode('hiraganaChallenge', hGroupIdx, kGroupIdx)}
      />
    );
  }

  if (phase === 'katakanaIntro_intro') {
    return (
      <NarrativePanel
        narrativeKey="katakanaIntro"
        onDone={() => { setKGroupIdx(0); setPhase('lesson_k'); }}
      />
    );
  }

  if (phase === 'katakanaChallenge_intro') {
    return (
      <NarrativePanel
        narrativeKey="katakanaChallenge"
        onDone={() => configureMode('katakanaChallenge', hGroupIdx, kGroupIdx)}
      />
    );
  }

  if (phase === 'finalBattle_intro') {
    return (
      <NarrativePanel
        narrativeKey="finalBattle"
        onDone={() => configureMode('finalBattle', hGroupIdx, kGroupIdx)}
      />
    );
  }

  // ── Lições de Katakana ─────────────────────────────────────────────────────
  if (phase === 'lesson_k') {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <GroupLesson
          group={KATAKANA_GROUPS[kGroupIdx]}
          system="katakana"
          onReady={() => configureMode('playing_k', hGroupIdx, kGroupIdx)}
        />
      </View>
    );
  }

  // ── Grupo de Katakana concluído ────────────────────────────────────────────
  if (phase === 'groupClear_k') {
    const nextGroup = KATAKANA_GROUPS[kGroupIdx];
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar hidden />
        <Text style={{ fontSize: 56, marginBottom: 12 }}>⭐</Text>
        <Text style={styles.clearTitle}>Grupo Dominado!</Text>
        <Text style={[styles.clearSub, { color: '#a5d6a7' }]}>
          {KATAKANA_GROUPS[kGroupIdx - 1]?.label} ✓
        </Text>
        <Text style={styles.clearScore}>Pontuação: {score}</Text>
        {nextGroup && (
          <Text style={styles.clearNextLabel}>Próximo: {nextGroup.label}</Text>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: '#a5d6a7' }]}
          onPress={() => setPhase('lesson_k')}
        >
          <Text style={styles.actionBtnText}>
            {nextGroup ? `Aprender ${nextGroup.label} →` : 'Continuar →'}
          </Text>
        </TouchableOpacity>
        <RankUpModal visible={!!rankUpModal} newRank={rankUpModal} onDismiss={() => setRankUpModal(null)} />
      </View>
    );
  }

  // ── Vitória ────────────────────────────────────────────────────────────────
  if (phase === 'victory') {
    return (
      <>
        <ResultScreen
          type="victory"
          score={score}
          onAction={() => {
            if (fromTemple) {
              navigation.goBack();
            } else {
              setPhase('eimei_farewell');
            }
          }}
        />
        <RankUpModal visible={!!rankUpModal} newRank={rankUpModal} onDismiss={() => setRankUpModal(null)} />
      </>
    );
  }

  // ── Despedida do Eimei (antes de ir ao mapa) ───────────────────────────────
  if (phase === 'eimei_farewell') {
    return (
      <NarrativePanel
        narrativeKey="eimeiFarewell"
        onDone={async () => {
          await saveProgress({ lastScreen: 'Map', kanaPhase: 'done', jlptLevel: 'Iniciante' });
          navigation.replace('Map');
        }}
      />
    );
  }

  // ── Derrota ────────────────────────────────────────────────────────────────
  if (phase === 'defeat') {
    const lostInPhase = lastPlayingPhaseRef.current;
    const retryPhase = (() => {
      if (['playing_h'].includes(lostInPhase)) return 'lesson_h';
      if (lostInPhase === 'hiraganaChallenge') return 'hiraganaChallenge_intro';
      if (['playing_k'].includes(lostInPhase)) return 'lesson_k';
      if (lostInPhase === 'katakanaChallenge') return 'katakanaChallenge_intro';
      if (lostInPhase === 'finalBattle')       return 'finalBattle_intro';
      return 'lesson_h';
    })();

    const retryAction = () => {
      setScore(0);
      if (fromTemple) {
        // Reconfigura e retenta o mesmo modo
        configureMode(lostInPhase, hGroupIdx, kGroupIdx);
        setPhase(lostInPhase);
      } else {
        setPhase(retryPhase);
      }
    };

    return (
      <>
        <ResultScreen type="defeat" score={score} onAction={retryAction} />
        <RankUpModal visible={!!rankUpModal} newRank={rankUpModal} onDismiss={() => setRankUpModal(null)} />
      </>
    );
  }

  // ── Fase de jogo ──────────────────────────────────────────────────────────
  const isFinalB    = phase === 'finalBattle';
  const isChallenge = ['hiraganaChallenge', 'katakanaChallenge', 'finalBattle'].includes(phase);
  const accentColor = isFinalB ? '#ffd700'
    : phase.includes('_k') || phase === 'katakanaChallenge' ? '#a5d6a7' : '#90caf9';

  const progress = Math.min(hits / modeRef.current.hitsTarget, 1);

  const hudLabel = (() => {
    if (phase === 'finalBattle')        return '⚔ BATALHA FINAL';
    if (phase === 'hiraganaChallenge')  return '🌀 Desafio Hiragana';
    if (phase === 'katakanaChallenge')  return '🌀 Desafio Katakana';
    if (phase === 'playing_h')          return `ひ ${HIRAGANA_GROUPS[hGroupIdx]?.label}`;
    if (phase === 'playing_k')          return `カ ${KATAKANA_GROUPS[kGroupIdx]?.label}`;
    return '';
  })();

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* HUD */}
      <View style={[styles.hud, isChallenge && { backgroundColor: '#0a001a' }]}>
        <View style={styles.hudLeft}>
          <View style={styles.hudHpRow}>
            {Array.from({ length: MAX_HP }, (_, i) => (
              <Text key={i} style={styles.hudHp}>{i < hp ? '♥' : '♡'}</Text>
            ))}
          </View>
          <Text style={[styles.hudGroup, { color: accentColor }]}>{hudLabel}</Text>
        </View>
        <View style={styles.hudCenter}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: accentColor }]} />
          </View>
          <Text style={styles.hudHits}>{hits} / {modeRef.current.hitsTarget}</Text>
        </View>
        <View style={styles.hudRight}>
          <Text style={styles.hudScore}>{score}</Text>
          {combo >= 3 && <Text style={styles.hudCombo}>🔥 ×{combo}</Text>}
        </View>
      </View>

      {/* Área de queda */}
      <View style={styles.rainArea}>
        {currentKana && (
          <Animated.View style={[
            styles.fallingKana,
            { left: kanaX, borderColor: accentColor, transform: [{ translateY: animY }, { scale: kanaScale }] },
          ]}>
            <Text style={styles.fallingKanaText}>{currentKana.kana}</Text>
          </Animated.View>
        )}

        {/* Linha limite */}
        <View style={[styles.limitLine, { top: LIMIT_LINE_Y }]}>
          <View style={[styles.limitLineBar, { backgroundColor: accentColor + '55' }]} />
          <Text style={[styles.limitLineLabel, { color: accentColor + '99' }]}>⚠ Responda aqui</Text>
        </View>
      </View>

      {/* Feedback */}
      {feedback && (
        <View style={[styles.feedbackBadge, { backgroundColor: feedback.color + '33', borderColor: feedback.color }]}>
          <Text style={[styles.feedbackText, { color: feedback.color }]}>{feedback.msg}</Text>
        </View>
      )}

      {/* Opções */}
      <Animated.View style={[styles.optionsArea, { transform: [{ translateX: optionShake }] }]}>
        <Text style={[styles.optionsLabel, { color: accentColor + '88' }]}>
          Qual é este kana?
        </Text>
        <View style={styles.optionsGrid}>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.optionBtn,
                answered && opt === currentKana?.romaji && { backgroundColor: '#1b5e20', borderColor: '#4caf50' },
              ]}
              onPress={() => handleOption(opt)}
              activeOpacity={0.75}
              disabled={answered}
            >
              <Text style={styles.optionText}>{opt.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <RankUpModal
        visible={!!rankUpModal}
        newRank={rankUpModal}
        onDismiss={() => setRankUpModal(null)}
      />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const OPTION_W = (SW - 52) / 2;

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#05050f' },
  centerContent:{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: '#05050f' },

  // HUD
  hud: {
    flexDirection: 'row', paddingTop: 48, paddingHorizontal: 16, paddingBottom: 10,
    backgroundColor: '#0a0a1e', borderBottomWidth: 1, borderBottomColor: '#1a1a3a',
    alignItems: 'center', gap: 8,
  },
  hudLeft:  { flex: 1 }, hudCenter: { flex: 2, alignItems: 'center' }, hudRight: { flex: 1, alignItems: 'flex-end' },
  hudHpRow: { flexDirection: 'row', alignItems: 'center' },
  hudHp:    { color: '#f44336', fontSize: 16, marginRight: 4 },
  hudGroup: { fontSize: 11, marginTop: 2 },
  hudScore: { color: '#ffd700', fontSize: 18, fontWeight: 'bold' },
  hudCombo: { color: '#ff9800', fontSize: 12 },
  progressTrack: { width: '100%', height: 6, backgroundColor: '#1a1a3a', borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: 3 },
  hudHits:       { color: '#444', fontSize: 10, marginTop: 2 },

  // Queda
  rainArea: { flex: 1, position: 'relative', overflow: 'hidden' },
  fallingKana: {
    position: 'absolute', top: 0, width: KANA_SIZE, height: KANA_SIZE, borderRadius: KANA_SIZE / 2,
    backgroundColor: 'rgba(15,52,96,0.92)', borderWidth: 2,
    justifyContent: 'center', alignItems: 'center', elevation: 8,
  },
  fallingKanaText: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
  limitLine: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  limitLineBar: { width: '100%', height: 2 },
  limitLineLabel: { fontSize: 11, marginTop: 3 },

  // Feedback
  feedbackBadge: {
    position: 'absolute', alignSelf: 'center', top: '38%',
    paddingHorizontal: 22, paddingVertical: 9, borderRadius: 22, borderWidth: 1, zIndex: 99,
  },
  feedbackText: { fontSize: 16, fontWeight: 'bold' },

  // Opções
  optionsArea: {
    backgroundColor: '#0a0a1e', borderTopWidth: 1, borderTopColor: '#1a1a3a',
    paddingTop: 12, paddingHorizontal: 16, paddingBottom: 32,
  },
  optionsLabel: { fontSize: 12, textAlign: 'center', marginBottom: 10, letterSpacing: 1 },
  optionsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  optionBtn: {
    backgroundColor: '#0f1f40', borderWidth: 2, borderColor: '#1a3a6a',
    borderRadius: 14, paddingVertical: 16, width: OPTION_W, alignItems: 'center',
  },
  optionText: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 2 },

  // Lição
  lessonContainer: { flex: 1, padding: 20, paddingTop: 56, backgroundColor: '#05050f' },
  lessonHeader: { alignItems: 'center', marginBottom: 14 },
  lessonEmoji:  { fontSize: 38, marginBottom: 6 },
  lessonTitle:  { fontSize: 22, fontWeight: 'bold' },
  lessonSystem: { color: '#888', fontSize: 13, marginTop: 2 },
  lessonNote:   { color: '#4caf50', fontSize: 12, marginTop: 5, fontStyle: 'italic' },
  kanaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 24 },
  kanaCard: {
    backgroundColor: '#0a0a1e', borderRadius: 12, padding: 12, alignItems: 'center',
    width: (SW - 64) / 3, borderWidth: 2, borderColor: '#1a1a3a', opacity: 0.3,
  },
  kanaCardActive:  { opacity: 1 },
  kanaCardChar:    { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  kanaCardRomaji:  { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  kanaCardExample: { color: '#90caf9', fontSize: 11, marginTop: 5 },
  kanaCardPt:      { color: '#555', fontSize: 10, marginTop: 2, textAlign: 'center' },
  lessonBtn: {
    backgroundColor: '#1565c0', paddingVertical: 14, paddingHorizontal: 32,
    borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#90caf9',
  },
  lessonBtnReady: { backgroundColor: '#8b0000', borderColor: '#ffd700' },
  lessonBtnText:  { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Narrativa
  narrativeContainer: {
    flex: 1, backgroundColor: '#050510', padding: 20, paddingTop: 56,
    borderWidth: 0, justifyContent: 'space-between',
  },
  narrativeHeader: { alignItems: 'center', marginBottom: 12 },
  narrativeIcon:   { fontSize: 48, marginBottom: 8 },
  narrativeTitle:  { fontSize: 22, fontWeight: 'bold' },
  narrativeProgress:{ color: '#444', fontSize: 12, marginTop: 4 },
  narrativeProgressBar: {
    height: 3, borderRadius: 2, backgroundColor: '#ffffff11', overflow: 'hidden', marginBottom: 20,
  },
  narrativeProgressFill: { height: '100%', borderRadius: 2 },
  narrativeContent: { flex: 1, justifyContent: 'center' },
  narrativeJpBox: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14,
    padding: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1,
  },
  narrativeJp: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', letterSpacing: 3 },
  narrativeSpeechBox: {
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 14,
    borderWidth: 1, borderColor: '#ffffff11', padding: 18,
  },
  narrativeSpeaker: { fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  narrativeSpeech:  { color: '#ddd', fontSize: 16, lineHeight: 26 },
  narrativeBtn: {
    paddingVertical: 15, borderRadius: 12, alignItems: 'center',
    marginTop: 20, borderWidth: 2,
  },
  narrativeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Resultados
  clearTitle:     { color: '#ffd700', fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  clearSub:       { fontSize: 14, marginBottom: 12 },
  clearScore:     { color: '#fff', fontSize: 17, marginBottom: 16 },
  clearNextLabel: { color: '#90caf9', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  resultTitle:    { fontSize: 26, fontWeight: 'bold', marginBottom: 14 },
  resultText:     { color: '#ccc', fontSize: 15, textAlign: 'center', lineHeight: 26, marginBottom: 14 },
  resultJpBox:    { backgroundColor: '#0f0f2a', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#ffd70044' },
  resultJp:       { color: '#ffd700', fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  resultJpPt:     { color: '#aaa', fontSize: 13, fontStyle: 'italic' },
  resultScore:    { color: '#fff', fontSize: 17, marginBottom: 24 },
  actionBtn: {
    backgroundColor: '#1565c0', paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: 12, borderWidth: 2, borderColor: '#ffd700',
  },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Seleção do Templo
  templeSelectHeader: {
    paddingTop: 14, paddingHorizontal: 16, paddingBottom: 14,
    backgroundColor: '#0a0a1e', borderBottomWidth: 1, borderBottomColor: '#1a1a3a',
  },
  templeSelectBack: { marginBottom: 8 },
  templeSelectBackText: { color: '#90caf9', fontSize: 14 },
  templeSelectTitle: { color: '#ffd700', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  templeSelectSub: { color: '#888', fontSize: 13, marginTop: 2 },
  templeSelectScroll: { flex: 1, padding: 16, paddingBottom: 32 },
  templeSelectSection: {
    borderLeftWidth: 4, paddingLeft: 12, marginBottom: 20,
  },
  templeSelectSectionTitle: { color: '#90caf9', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  templeSelectCard: {
    backgroundColor: '#0f1f40', borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1,
  },
  templeSelectCardAll: { backgroundColor: '#0a1530' },
  templeSelectCardLabel: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  templeSelectKanaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' },
  templeSelectKanaCol: { alignItems: 'center', minWidth: 28 },
  templeSelectCardKanas: { color: '#90caf9', fontSize: 20, letterSpacing: 1 },
  templeSelectCardRomaji: { color: '#78909c', fontSize: 11, marginTop: 2 },
  templeSelectCardDesc: { color: '#888', fontSize: 12, marginTop: 2 },
  templeClearActions: { marginTop: 20 },
});
