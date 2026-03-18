import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, Animated,
} from 'react-native';
import RankUpModal from '../components/RankUpModal';
import { getDB } from '../utils/dbAdapter';
import { usePlayer } from '../context/PlayerContext';

const ENEMY_MAX_HP = 3;
const XP_PER_HIT   = 15;
const NUM_OPTIONS  = 4;

// Levels que podem aparecer nas batalhas
const VALID_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

// Fallback de nível caso o escolhido tenha 0 kanjis
const LEVEL_FALLBACK = {
  Iniciante: ['N5', 'N4'],
  N5: ['N5', 'N4'],
  N4: ['N4', 'N5', 'N3'],
  N3: ['N3', 'N4', 'N2'],
  N2: ['N2', 'N3', 'N1'],
  N1: ['N1', 'N2', 'N3'],
};

// ─── Barra de HP ──────────────────────────────────────────────────────────────
const HPBar = ({ current, max, color = '#44ff44', label }) => {
  const pct = Math.max(0, (current / max) * 100);
  return (
    <View style={hpStyles.wrapper}>
      {label ? <Text style={hpStyles.label}>{label}</Text> : null}
      <View style={hpStyles.track}>
        <View style={[hpStyles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={hpStyles.text}>{current}/{max}</Text>
    </View>
  );
};
const hpStyles = StyleSheet.create({
  wrapper: { marginBottom: 4 },
  label:   { color: '#aaa', fontSize: 11, marginBottom: 2 },
  track:   { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' },
  fill:    { height: '100%', borderRadius: 4 },
  text:    { color: '#ccc', fontSize: 10, textAlign: 'right', marginTop: 1 },
});

// ─── BattleScreen ─────────────────────────────────────────────────────────────
export default function BattleScreen({ navigation, route }) {
  const { hp, maxHp, gainXP, loseHP, restoreHP, recordBattleVictory, jlptLevel: ctxLevel } = usePlayer();
  const jlptLevels = route.params?.jlptLevels;  // array: modo "todos até meu nível"
  const level = route.params?.jlptLevel || ctxLevel || 'N5';
  const fromTemple = route.params?.fromTemple === true;

  // queue: níveis a consultar (single level ou array)
  const queryLevels = jlptLevels && jlptLevels.length > 0 ? jlptLevels : [level];

  // No templo: restaura HP ao entrar para ter energia igual ao modo história
  useEffect(() => {
    if (fromTemple) restoreHP();
  }, [fromTemple, restoreHP]);

  // phase: 'loading' | 'question' | 'feedback' | 'victory' | 'defeat'
  const [phase,      setPhase]      = useState('loading');
  const [question,   setQuestion]   = useState(null);
  const [options,    setOptions]    = useState([]);   // array de strings PT
  const [correctIdx, setCorrectIdx] = useState(-1);  // índice da opção correta
  const [selectedIdx,setSelectedIdx]= useState(null);
  const [enemyHp,   setEnemyHp]    = useState(ENEMY_MAX_HP);
  const [xpEarned,  setXpEarned]   = useState(0);
  const [message,   setMessage]    = useState('');
  const [correctLabel, setCorrectLabel] = useState(''); // texto certo para mostrar no feedback
  const [rankUpModal, setRankUpModal] = useState(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const timerRef  = useRef(null);

  const shakeEnemy = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();
  };

  // ── Carrega uma pergunta do banco ─────────────────────────────────────────
  const loadQuestion = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('loading');
    setSelectedIdx(null);

    try {
      const db = getDB();

      // Busca kanji aleatório: queryLevels (array) ou fallback por nível único
      const queue = queryLevels.length > 0 ? queryLevels : (LEVEL_FALLBACK[level] || [level, 'N5']);
      let row = null;
      const hasReading = "(onyomi IS NOT NULL AND onyomi != '') OR (kunyomi IS NOT NULL AND kunyomi != '')";
      if (queue.length === 1) {
        row = db.getFirstSync(
          `SELECT * FROM kanjis WHERE level = ? AND (${hasReading}) ORDER BY RANDOM() LIMIT 1`,
          [queue[0]]
        );
      } else {
        const ph = queue.map(() => '?').join(',');
        row = db.getFirstSync(
          `SELECT * FROM kanjis WHERE level IN (${ph}) AND (${hasReading}) ORDER BY RANDOM() LIMIT 1`,
          queue
        );
      }
      if (!row) {
        row = db.getFirstSync(
          `SELECT * FROM kanjis WHERE level IN ('N5','N4','N3','N2','N1') AND (${hasReading}) ORDER BY RANDOM() LIMIT 1`
        );
      }
      if (!row) {
        setMessage('Erro: banco de dados vazio!');
        setPhase('question');
        return;
      }

      // Formata onyomi e kunyomi juntos com quebra de linha
      const formatReadings = (onyomi, kunyomi) => {
        const o = (onyomi || '').trim();
        const k = (kunyomi || '').trim();
        const parts = [];
        if (o) parts.push(`音: ${o}`);
        if (k) parts.push(`訓: ${k}`);
        return parts.length > 0 ? parts.join('\n') : null;
      };

      const correctReading = formatReadings(row.onyomi, row.kunyomi);
      if (!correctReading) {
        setMessage('Kanji sem leitura no banco.');
        setPhase('question');
        return;
      }

      // Busca outros kanjis para respostas erradas (cada um com onyomi+kunyomi juntos)
      const wrongLevel = row.level && row.level !== 'unlisted' ? row.level : level;
      const fallbackLevels = queryLevels.length > 1 ? queryLevels : (LEVEL_FALLBACK[wrongLevel] || [wrongLevel, 'N5']);
      const placeholders = fallbackLevels.map(() => '?').join(',');
      let wrongRows = db.getAllSync(
        `SELECT onyomi, kunyomi FROM kanjis
         WHERE character != ? AND (onyomi IS NOT NULL OR kunyomi IS NOT NULL) AND level IN (${placeholders})
         ORDER BY RANDOM() LIMIT 15`,
        [row.character, ...fallbackLevels]
      );
      if (wrongRows.length < 5) {
        wrongRows = db.getAllSync(
          `SELECT onyomi, kunyomi FROM kanjis
           WHERE character != ? AND (onyomi IS NOT NULL OR kunyomi IS NOT NULL)
           ORDER BY RANDOM() LIMIT 15`,
          [row.character]
        );
      }

      const seen = new Set([correctReading]);
      const wrongReadings = [];
      for (const wr of wrongRows) {
        const formatted = formatReadings(wr.onyomi, wr.kunyomi);
        if (formatted && !seen.has(formatted)) {
          seen.add(formatted);
          wrongReadings.push(formatted);
          if (wrongReadings.length >= NUM_OPTIONS - 1) break;
        }
      }

      while (wrongReadings.length < NUM_OPTIONS - 1) {
        wrongReadings.push('—');
      }

      const pool = [
        { text: correctReading, correct: true },
        ...wrongReadings.slice(0, NUM_OPTIONS - 1).map(t => ({ text: t, correct: false })),
      ].sort(() => Math.random() - 0.5);

      const newCorrectIdx = pool.findIndex(o => o.correct);

      setQuestion(row);
      setOptions(pool.map(o => o.text));
      setCorrectIdx(newCorrectIdx);
      setCorrectLabel(correctReading);
      setMessage(`Qual a leitura do kanji "${row.character}"?`);
      setPhase('question');

    } catch (e) {
      console.error('Erro ao carregar kanji:', e);
      setMessage('Erro ao acessar banco de dados.');
      setOptions(['—', '—', '—', '—']);
      setCorrectIdx(-1);
      setPhase('question');
    }
  }, [level, queryLevels]);

  useEffect(() => {
    loadQuestion();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // ── Lida com a resposta do jogador ────────────────────────────────────────
  const handleAnswer = (idx) => {
    if (phase !== 'question') return;

    setSelectedIdx(idx);
    setPhase('feedback');

    if (idx === correctIdx) {
      // ✓ Correto
      const newEnemyHp = enemyHp - 1;
      setEnemyHp(newEnemyHp);
      if (!fromTemple) {
        gainXP(XP_PER_HIT, (newRank) => { if (newRank) setRankUpModal(newRank); });
      }
      setXpEarned(prev => prev + XP_PER_HIT);
      setMessage('✓ Correto! Ataque bem-sucedido!');

      if (newEnemyHp <= 0) {
        if (!fromTemple) recordBattleVictory(level);
        timerRef.current = setTimeout(() => setPhase('victory'), 1200);
      } else {
        timerRef.current = setTimeout(() => loadQuestion(), 1600);
      }
    } else {
      // ✗ Errado
      loseHP(1);
      shakeEnemy();
      setMessage(`✗ Errado! A leitura correta era: "${correctLabel}"`);

      if (hp <= 1) {
        timerRef.current = setTimeout(() => setPhase('defeat'), 1500);
      } else {
        timerRef.current = setTimeout(() => loadQuestion(), 2000);
      }
    }
  };

  // ── Estilo dos botões de opção ────────────────────────────────────────────
  const getOptionStyle = (idx) => {
    if (phase !== 'feedback' || selectedIdx === null) return styles.optionBtn;
    if (idx === correctIdx)  return [styles.optionBtn, styles.optionCorrect];
    if (idx === selectedIdx) return [styles.optionBtn, styles.optionWrong];
    return [styles.optionBtn, styles.optionDimmed];
  };

  // ─── Tela de carregamento ─────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>⚔ Invocando Kanji...</Text>
      </View>
    );
  }

  // ─── Tela de vitória ──────────────────────────────────────────────────────
  if (phase === 'victory') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.endIcon}>⚔️</Text>
        <Text style={[styles.endTitle, { color: '#ffd700' }]}>Vitória!</Text>
        <Text style={styles.endSubtitle}>Kanji dominado!</Text>
        <Text style={styles.xpText}>+{xpEarned} XP</Text>
        <TouchableOpacity style={styles.endBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.endBtnText}>Voltar ao Mapa</Text>
        </TouchableOpacity>
        <RankUpModal visible={!!rankUpModal} newRank={rankUpModal} onDismiss={() => setRankUpModal(null)} />
      </View>
    );
  }

  // ─── Tela de derrota ──────────────────────────────────────────────────────
  if (phase === 'defeat') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.endIcon}>💀</Text>
        <Text style={[styles.endTitle, { color: '#ff4444' }]}>Derrota</Text>
        <Text style={styles.endSubtitle}>O Kanji foi mais forte...</Text>
        <TouchableOpacity
          style={[styles.endBtn, { borderColor: '#ff4444' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.endBtnText}>Recuar</Text>
        </TouchableOpacity>
        <RankUpModal visible={!!rankUpModal} newRank={rankUpModal} onDismiss={() => setRankUpModal(null)} />
      </View>
    );
  }

  // ─── Tela principal de batalha ────────────────────────────────────────────
  const enemyHpColor  = enemyHp  <= 1 ? '#ff4444' : enemyHp  <= 2 ? '#ffaa00' : '#44ff44';
  const playerHpColor = hp       <= 1 ? '#ff4444' : hp       <= 2 ? '#ffaa00' : '#44ff44';

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/d86e0dda-76c6-48e6-86a2-3ed85c4d8f40.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* ── Área do Inimigo ──────────────────────────────────────────── */}
        <View style={styles.enemyArea}>
          {/* Card de info no topo */}
          <View style={styles.enemyInfoCard}>
            <View style={styles.enemyNameRow}>
              <Text style={styles.enemyName}>Kanji Selvagem</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{level}</Text>
              </View>
            </View>
            <HPBar current={enemyHp} max={ENEMY_MAX_HP} color={enemyHpColor} label="HP" />
          </View>

          {/* Caixa do kanji — apenas o caractere (leituras nas opções) */}
          <Animated.View style={[styles.kanjiBox, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.kanjiChar}>{question?.character}</Text>
          </Animated.View>
        </View>

        {/* ── UI de Batalha ────────────────────────────────────────────── */}
        <View style={styles.battleUI}>
          {/* Status do jogador */}
          <View style={styles.playerInfoCard}>
            <Text style={styles.playerName}>Ronin</Text>
            <HPBar current={hp} max={maxHp} color={playerHpColor} label="HP" />
          </View>

          {/* Caixa de mensagem */}
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          {/* Grade de opções 2×2 */}
          <View style={styles.optionsGrid}>
            {options.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={getOptionStyle(idx)}
                onPress={() => handleAnswer(idx)}
                disabled={phase !== 'question'}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText} numberOfLines={3}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fugir */}
          <TouchableOpacity style={styles.fleeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.fleeBtnText}>Fugir</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <RankUpModal
        visible={!!rankUpModal}
        newRank={rankUpModal}
        onDismiss={() => setRankUpModal(null)}
      />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  centered:  { justifyContent: 'center', alignItems: 'center', gap: 16 },
  background:{ flex: 1 },

  // ── Área do inimigo: coluna (info card no topo, kanji box abaixo centrado) ──
  enemyArea: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    gap: 12,
  },
  enemyInfoCard: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffd700',
    width: '100%',
  },
  enemyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  enemyName:       { color: '#ffd700', fontWeight: 'bold', fontSize: 13 },
  levelBadge:      { backgroundColor: '#8b0000', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  levelBadgeText:  { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  // ── Caixa do kanji: largura total, centralizada ──────────────────────────────
  kanjiBox: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#ff4400',
    alignItems: 'center',
    width: '100%',
  },
  kanjiChar: { fontSize: 80, color: '#ff4400', fontWeight: 'bold' },

  battleUI: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  playerInfoCard: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 10,
    width: '100%',
  },
  playerName: { color: '#fff', fontWeight: 'bold', fontSize: 12, marginBottom: 4 },

  messageBox: {
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 12,
    marginBottom: 12,
    minHeight: 52,
    justifyContent: 'center',
  },
  messageText: { color: '#fff', fontSize: 14, fontFamily: 'monospace' },

  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  optionBtn: {
    width: '48%',
    backgroundColor: '#2a2a4a',
    padding: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#5555aa',
    alignItems: 'center',
    minHeight: 54,
    justifyContent: 'center',
  },
  optionCorrect: { backgroundColor: '#1a5c1a', borderColor: '#44ff44' },
  optionWrong:   { backgroundColor: '#5c1a1a', borderColor: '#ff4444' },
  optionDimmed:  { opacity: 0.35 },
  optionText:    { color: '#fff', fontSize: 13, textAlign: 'center' },

  fleeBtn:     { alignSelf: 'flex-end', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#666' },
  fleeBtnText: { color: '#999', fontSize: 12 },

  loadingText: { color: '#ffd700', fontSize: 18 },
  endIcon:     { fontSize: 80 },
  endTitle:    { fontSize: 42, fontWeight: 'bold' },
  endSubtitle: { color: '#ccc', fontSize: 18 },
  xpText:      { color: '#44ff44', fontSize: 26, fontWeight: 'bold' },
  endBtn: {
    marginTop: 16,
    paddingHorizontal: 40,
    paddingVertical: 14,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  endBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
