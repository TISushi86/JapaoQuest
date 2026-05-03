import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, ScrollView, Animated, Dimensions,
} from 'react-native';
import FuriganaText from './FuriganaText';

const { width: W } = Dimensions.get('window');

/**
 * Modal genérico que renderiza 7 tipos de enigma.
 *
 * Props:
 *   visible     – boolean
 *   puzzle      – objeto do enigma (ver src/data/escapeRooms.js)
 *   accentColor – cor de destaque (tipicamente a cor da sala)
 *   onSolved    – callback chamado quando o jogador acerta
 *   onFailed    – callback chamado quando erra (motor decide HP/etc.)
 *   onClose     – fecha o modal sem resolver
 */
export default function PuzzleModal({
  visible, puzzle, accentColor = '#ffd700',
  onSolved, onFailed, onClose,
}) {
  const [phase, setPhase] = useState('question'); // 'question' | 'correct' | 'wrong'
  const [result, setResult] = useState(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setPhase('question');
      setResult(null);
      shakeAnim.setValue(0);
    }
  }, [visible, puzzle]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswer = (isCorrect, answerDetail) => {
    if (phase !== 'question') return;
    setResult(answerDetail ?? null);
    if (isCorrect) {
      setPhase('correct');
    } else {
      setPhase('wrong');
      shake();
    }
  };

  const handleContinue = () => {
    if (phase === 'correct') onSolved?.();
    else if (phase === 'wrong') onFailed?.();
  };

  if (!visible || !puzzle) return null;

  const body = (() => {
    switch (puzzle.type) {
      case 'readingChoice':  return <ReadingChoice   puzzle={puzzle} phase={phase} onAnswer={handleAnswer} accentColor={accentColor} />;
      case 'kanaLock':       return <KanaLock        puzzle={puzzle} phase={phase} onAnswer={handleAnswer} accentColor={accentColor} />;
      case 'particleFill':   return <ParticleFill    puzzle={puzzle} phase={phase} onAnswer={handleAnswer} accentColor={accentColor} />;
      case 'kanjiMatch':     return <KanjiMatch      puzzle={puzzle} phase={phase} onAnswer={handleAnswer} accentColor={accentColor} />;
      case 'counter':        return <CounterPuzzle   puzzle={puzzle} phase={phase} onAnswer={handleAnswer} accentColor={accentColor} />;
      case 'direction':      return <DirectionPuzzle puzzle={puzzle} phase={phase} onAnswer={handleAnswer} accentColor={accentColor} />;
      case 'sentenceOrder':  return <SentenceOrder   puzzle={puzzle} phase={phase} onAnswer={handleAnswer} accentColor={accentColor} />;
      default:               return <Text style={styles.error}>Tipo de enigma desconhecido: {puzzle.type}</Text>;
    }
  })();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            { borderColor: accentColor, transform: [{ translateX: shakeAnim }] },
          ]}
        >
          {/* Cabeçalho */}
          <View style={[styles.header, { borderBottomColor: accentColor + '33' }]}>
            <Text style={[styles.headerTitle, { color: accentColor }]}>🧩 Enigma</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Enunciado */}
          {puzzle.prompt ? (
            <View style={styles.promptBox}>
              <FuriganaText
                text={puzzle.prompt}
                fontSize={15}
                color="#e8e8e8"
                furiganaColor="#90caf9"
                align="center"
              />
            </View>
          ) : null}

          {/* Corpo específico do tipo de enigma */}
          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            {body}

            {/* Feedback quando já respondeu */}
            {phase === 'correct' && (
              <View style={[styles.feedback, styles.feedbackCorrect]}>
                <Text style={styles.feedbackTitle}>✓ Correto!</Text>
                {puzzle.explanation ? (
                  <View style={{ marginTop: 6 }}>
                    <FuriganaText
                      text={puzzle.explanation}
                      fontSize={13}
                      color="#a5d6a7"
                      furiganaColor="#c8e6c9"
                      align="center"
                    />
                  </View>
                ) : null}
                {puzzle.translation ? (
                  <Text style={styles.feedbackTranslation}>「{puzzle.translation}」</Text>
                ) : null}
              </View>
            )}
            {phase === 'wrong' && (
              <View style={[styles.feedback, styles.feedbackWrong]}>
                <Text style={styles.feedbackTitle}>✗ Resposta incorreta</Text>
                <Text style={styles.feedbackSub}>Você perde 1 ♥. Tente novamente em outra abordagem.</Text>
                {puzzle.explanation ? (
                  <View style={{ marginTop: 6 }}>
                    <FuriganaText
                      text={puzzle.explanation}
                      fontSize={13}
                      color="#ffab91"
                      furiganaColor="#ffccbc"
                      align="center"
                    />
                  </View>
                ) : null}
              </View>
            )}
          </ScrollView>

          {/* Ações */}
          {phase !== 'question' ? (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                phase === 'correct'
                  ? { backgroundColor: '#2e7d32', borderColor: '#4caf50' }
                  : { backgroundColor: '#5c1a1a', borderColor: '#f44336' },
              ]}
              onPress={handleContinue}
            >
              <Text style={styles.actionBtnText}>
                {phase === 'correct' ? 'Continuar →' : 'Voltar à sala'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 1. readingChoice — múltipla escolha simples
// ════════════════════════════════════════════════════════════════════════════
function ReadingChoice({ puzzle, phase, onAnswer, accentColor }) {
  const [selected, setSelected] = useState(null);

  const handlePress = (idx) => {
    if (phase !== 'question') return;
    setSelected(idx);
    const correct = idx === puzzle.correctIdx;
    onAnswer(correct, { selectedIdx: idx });
  };

  return (
    <View style={{ gap: 10 }}>
      {puzzle.options.map((opt, idx) => {
        const isSelected = selected === idx;
        const isCorrectIdx = idx === puzzle.correctIdx;
        let bgColor = '#16213e';
        let borderColor = '#2a2a4a';
        if (phase !== 'question') {
          if (isCorrectIdx) { bgColor = '#1b5e20'; borderColor = '#4caf50'; }
          else if (isSelected) { bgColor = '#7f0000'; borderColor = '#f44336'; }
          else bgColor = '#0e1528';
        } else if (isSelected) {
          borderColor = accentColor;
        }
        return (
          <TouchableOpacity
            key={idx}
            style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
            onPress={() => handlePress(idx)}
            disabled={phase !== 'question'}
            activeOpacity={0.8}
          >
            <FuriganaText
              text={opt}
              fontSize={15}
              color="#fff"
              furiganaColor="#b3e5fc"
              align="center"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. kanaLock — tocar kanas na ordem certa para formar palavra
// ════════════════════════════════════════════════════════════════════════════
function KanaLock({ puzzle, phase, onAnswer, accentColor }) {
  // Guarda índices do pool em vez de valores — suporta kanas duplicados corretamente
  const [pickedIdx, setPickedIdx] = useState([]);
  const targetLen = puzzle.answer.length;

  useEffect(() => {
    if (phase !== 'question') return;
    if (pickedIdx.length === targetLen) {
      const chosen = pickedIdx.map(i => puzzle.pool[i]);
      const correct = chosen.every((k, i) => k === puzzle.answer[i]);
      onAnswer(correct, { picked: chosen });
    }
  }, [pickedIdx, phase]);

  const togglePick = (i) => {
    if (phase !== 'question') return;
    setPickedIdx(prev => {
      if (prev.includes(i) || prev.length >= targetLen) return prev;
      return [...prev, i];
    });
  };

  const clearPick = () => { if (phase === 'question') setPickedIdx([]); };

  return (
    <View>
      {/* Slots de letras escolhidas */}
      <View style={styles.kanaSlots}>
        {Array.from({ length: targetLen }).map((_, i) => (
          <View
            key={i}
            style={[styles.kanaSlot, { borderColor: accentColor + '66' }]}
          >
            <Text style={[styles.kanaSlotText, { color: accentColor }]}>
              {pickedIdx[i] !== undefined ? puzzle.pool[pickedIdx[i]] : ''}
            </Text>
          </View>
        ))}
      </View>

      {/* Pool de kanas para escolher */}
      <View style={styles.kanaPool}>
        {puzzle.pool.map((k, i) => {
          const isPicked = pickedIdx.includes(i);
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.kanaChip,
                { borderColor: accentColor },
                isPicked && styles.kanaChipUsed,
              ]}
              onPress={() => togglePick(i)}
              disabled={phase !== 'question' || isPicked}
              activeOpacity={0.7}
            >
              <Text style={styles.kanaChipText}>{k}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {phase === 'question' && pickedIdx.length > 0 ? (
        <TouchableOpacity style={styles.clearBtn} onPress={clearPick}>
          <Text style={styles.clearBtnText}>↺ Limpar</Text>
        </TouchableOpacity>
      ) : null}

      {puzzle.hintPt ? (
        <Text style={styles.hint}>💭 {puzzle.hintPt}</Text>
      ) : null}
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. particleFill — preencher partículas em frase
// ════════════════════════════════════════════════════════════════════════════
function ParticleFill({ puzzle, phase, onAnswer, accentColor }) {
  const [picked, setPicked] = useState(Array(puzzle.slots.length).fill(null));

  useEffect(() => {
    if (phase !== 'question') return;
    if (picked.every(p => p !== null)) {
      const correct = picked.every((p, i) => p === puzzle.slots[i].answer);
      onAnswer(correct, { picked: [...picked] });
    }
  }, [picked, phase]);

  const setSlot = (slotIdx, value) => {
    if (phase !== 'question') return;
    setPicked(prev => {
      const next = [...prev];
      next[slotIdx] = value;
      return next;
    });
  };

  return (
    <View>
      {/* Frase com slots */}
      <View style={styles.sentenceBox}>
        {puzzle.sentence.map((part, i) => {
          if (part.text !== undefined) {
            return (
              <FuriganaText
                key={`t-${i}`}
                text={part.text}
                fontSize={17}
                color="#fff"
                furiganaColor="#90caf9"
              />
            );
          }
          const slotIdx = part.slot;
          const value = picked[slotIdx];
          return (
            <View
              key={`s-${i}`}
              style={[
                styles.particleSlot,
                { borderColor: accentColor + '88' },
                value !== null && { backgroundColor: accentColor + '22', borderColor: accentColor },
              ]}
            >
              <Text style={[styles.particleSlotText, { color: accentColor }]}>
                {value ?? '___'}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Seletores por slot */}
      {puzzle.slots.map((slot, slotIdx) => (
        <View key={slotIdx} style={styles.particleRow}>
          <Text style={styles.particleLabel}>Lacuna {slotIdx + 1}:</Text>
          <View style={styles.particleOptions}>
            {slot.options.map(opt => {
              const isPicked = picked[slotIdx] === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.particleOption,
                    { borderColor: accentColor + '66' },
                    isPicked && { backgroundColor: accentColor + '33', borderColor: accentColor },
                  ]}
                  onPress={() => setSlot(slotIdx, opt)}
                  disabled={phase !== 'question'}
                >
                  <Text style={styles.particleOptionText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. kanjiMatch — parear kanji com furigana
// ════════════════════════════════════════════════════════════════════════════
function KanjiMatch({ puzzle, phase, onAnswer, accentColor }) {
  const [selectedKanji, setSelectedKanji] = useState(null);
  const [matches, setMatches] = useState({}); // kanji -> furigana

  // Embaralha furiganas uma vez
  const shuffledFurigana = useRef(
    [...puzzle.pairs.map(p => p[1])].sort(() => Math.random() - 0.5)
  ).current;

  useEffect(() => {
    if (phase !== 'question') return;
    if (Object.keys(matches).length === puzzle.pairs.length) {
      const correct = puzzle.pairs.every(([k, f]) => matches[k] === f);
      onAnswer(correct, { matches: { ...matches } });
    }
  }, [matches, phase]);

  const pickKanji = (kanji) => {
    if (phase !== 'question' || matches[kanji]) return;
    setSelectedKanji(kanji);
  };

  const pickFurigana = (furigana) => {
    if (phase !== 'question' || !selectedKanji) return;
    if (Object.values(matches).includes(furigana)) return;
    setMatches(prev => ({ ...prev, [selectedKanji]: furigana }));
    setSelectedKanji(null);
  };

  return (
    <View>
      <Text style={styles.instruction}>Toque num kanji, depois na leitura correta.</Text>
      <View style={styles.matchRow}>
        <View style={{ flex: 1 }}>
          {puzzle.pairs.map(([kanji]) => {
            const matched = !!matches[kanji];
            const selected = selectedKanji === kanji;
            return (
              <TouchableOpacity
                key={kanji}
                style={[
                  styles.matchCell,
                  { borderColor: accentColor + '66' },
                  selected && { borderColor: accentColor, backgroundColor: accentColor + '22' },
                  matched && styles.matchCellMatched,
                ]}
                onPress={() => pickKanji(kanji)}
                disabled={phase !== 'question' || matched}
              >
                <Text style={styles.matchKanji}>{kanji}</Text>
                {matched ? <Text style={[styles.matchArrow, { color: accentColor }]}>↔ {matches[kanji]}</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ flex: 1 }}>
          {shuffledFurigana.map(fur => {
            const used = Object.values(matches).includes(fur);
            return (
              <TouchableOpacity
                key={fur}
                style={[
                  styles.matchCell,
                  { borderColor: '#90caf966' },
                  used && styles.matchCellMatched,
                ]}
                onPress={() => pickFurigana(fur)}
                disabled={phase !== 'question' || used}
              >
                <Text style={[styles.matchFurigana, used && { color: '#555' }]}>{fur}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. counter — escolher contador japonês correto
// ════════════════════════════════════════════════════════════════════════════
function CounterPuzzle({ puzzle, phase, onAnswer, accentColor }) {
  const [selected, setSelected] = useState(null);

  const handlePress = (idx) => {
    if (phase !== 'question') return;
    setSelected(idx);
    onAnswer(idx === puzzle.correctIdx, { selectedIdx: idx });
  };

  return (
    <View>
      {/* Objetos visíveis */}
      {puzzle.visible ? (
        <View style={styles.counterVisible}>
          {Array.from({ length: puzzle.visible }).map((_, i) => (
            <Text key={i} style={styles.counterEmoji}>{puzzle.emoji || '📦'}</Text>
          ))}
          <Text style={styles.counterTotal}>({puzzle.visible})</Text>
        </View>
      ) : null}
      {puzzle.options.map((opt, idx) => {
        const isSelected = selected === idx;
        const isCorrectIdx = idx === puzzle.correctIdx;
        let bgColor = '#16213e';
        let borderColor = '#2a2a4a';
        if (phase !== 'question') {
          if (isCorrectIdx) { bgColor = '#1b5e20'; borderColor = '#4caf50'; }
          else if (isSelected) { bgColor = '#7f0000'; borderColor = '#f44336'; }
        } else if (isSelected) {
          borderColor = accentColor;
        }
        return (
          <TouchableOpacity
            key={idx}
            style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
            onPress={() => handlePress(idx)}
            disabled={phase !== 'question'}
          >
            <FuriganaText text={opt} fontSize={15} color="#fff" furiganaColor="#b3e5fc" align="center" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. direction — tocar pontos cardeais em ordem
// ════════════════════════════════════════════════════════════════════════════
function DirectionPuzzle({ puzzle, phase, onAnswer, accentColor }) {
  const [tapped, setTapped] = useState([]);

  useEffect(() => {
    if (phase !== 'question') return;
    if (tapped.length === puzzle.sequence.length) {
      const correct = tapped.every((t, i) => t === puzzle.sequence[i]);
      onAnswer(correct, { tapped: [...tapped] });
    }
  }, [tapped, phase]);

  const tap = (dir) => {
    if (phase !== 'question') return;
    if (tapped.length >= puzzle.sequence.length) return;
    setTapped(prev => [...prev, dir]);
  };

  const DIRS = [
    { id: 'north', pos: { top: 0, left: '40%' }, label: puzzle.labels?.north || '北' },
    { id: 'south', pos: { bottom: 0, left: '40%' }, label: puzzle.labels?.south || '南' },
    { id: 'east',  pos: { top: '40%', right: 0 }, label: puzzle.labels?.east  || '東' },
    { id: 'west',  pos: { top: '40%', left: 0 }, label: puzzle.labels?.west  || '西' },
  ];

  return (
    <View>
      <Text style={styles.instruction}>
        Sequência: {tapped.length}/{puzzle.sequence.length}
      </Text>
      <View style={styles.compass}>
        {DIRS.map(d => {
          const alreadyTapped = tapped.includes(d.id);
          return (
            <TouchableOpacity
              key={d.id}
              style={[
                styles.compassBtn,
                d.pos,
                { borderColor: accentColor },
                alreadyTapped && { backgroundColor: accentColor + '33', borderColor: accentColor },
              ]}
              onPress={() => tap(d.id)}
              disabled={phase !== 'question'}
            >
              <FuriganaText
                text={d.label}
                fontSize={20}
                color="#fff"
                furiganaColor={accentColor}
              />
            </TouchableOpacity>
          );
        })}
        <Text style={styles.compassCenter}>🧭</Text>
      </View>
      <View style={styles.tappedRow}>
        {tapped.map((t, i) => (
          <View key={i} style={[styles.tappedChip, { borderColor: accentColor }]}>
            <Text style={styles.tappedChipText}>{i + 1}. {t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. sentenceOrder — ordenar blocos
// ════════════════════════════════════════════════════════════════════════════
function SentenceOrder({ puzzle, phase, onAnswer, accentColor }) {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    if (phase !== 'question') return;
    if (order.length === puzzle.blocks.length) {
      const correct = order.every((idx, i) => idx === puzzle.answer[i]);
      onAnswer(correct, { order: [...order] });
    }
  }, [order, phase]);

  const pick = (blockIdx) => {
    if (phase !== 'question' || order.includes(blockIdx)) return;
    setOrder(prev => [...prev, blockIdx]);
  };

  const clear = () => { if (phase === 'question') setOrder([]); };

  return (
    <View>
      <Text style={styles.instruction}>Toque nos blocos na ordem correta.</Text>
      {/* Blocos a escolher */}
      <View style={styles.sentenceOrderPool}>
        {puzzle.blocks.map((block, idx) => {
          const used = order.includes(idx);
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.sentenceBlock,
                { borderColor: accentColor + '88' },
                used && styles.sentenceBlockUsed,
              ]}
              onPress={() => pick(idx)}
              disabled={phase !== 'question' || used}
            >
              <FuriganaText text={block} fontSize={14} color="#fff" furiganaColor="#90caf9" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Frase montada */}
      <View style={[styles.sentenceOrderPicked, { borderColor: accentColor + '44' }]}>
        {order.length === 0 ? (
          <Text style={styles.instruction}>(Sua frase aparecerá aqui)</Text>
        ) : (
          order.map((idx, i) => (
            <View key={i} style={styles.sentencePickedBlock}>
              <Text style={styles.sentencePickedNum}>{i + 1}</Text>
              <FuriganaText text={puzzle.blocks[idx]} fontSize={14} color="#fff" furiganaColor="#90caf9" />
            </View>
          ))
        )}
      </View>

      {phase === 'question' && order.length > 0 ? (
        <TouchableOpacity style={styles.clearBtn} onPress={clear}>
          <Text style={styles.clearBtnText}>↺ Limpar</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Estilos
// ════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '92%',
    backgroundColor: '#0f1628',
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: '#aaa', fontSize: 14, fontWeight: 'bold' },

  promptBox: {
    padding: 14,
    backgroundColor: '#16213e',
  },

  body: { flexGrow: 0 },
  bodyContent: { padding: 14, paddingBottom: 18 },

  error: { color: '#f44336', fontSize: 14, textAlign: 'center', padding: 20 },

  // Botões de múltipla escolha
  optionBtn: {
    borderRadius: 10,
    padding: 13,
    borderWidth: 2,
    alignItems: 'center',
  },

  // Feedback
  feedback: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  feedbackCorrect: { backgroundColor: '#1b5e2033', borderColor: '#4caf50' },
  feedbackWrong:   { backgroundColor: '#7f000033', borderColor: '#f44336' },
  feedbackTitle:   { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  feedbackSub:     { color: '#ffccbc', fontSize: 12 },
  feedbackTranslation: { color: '#a5d6a7', fontSize: 13, marginTop: 6, fontStyle: 'italic' },

  actionBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 2,
  },
  actionBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // kanaLock
  kanaSlots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  kanaSlot: {
    width: 48, height: 54,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#16213e',
    alignItems: 'center', justifyContent: 'center',
  },
  kanaSlotText: { fontSize: 26, fontWeight: 'bold' },
  kanaPool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  kanaChip: {
    width: 50, height: 50,
    borderRadius: 25,
    borderWidth: 2,
    backgroundColor: '#1a1a2e',
    alignItems: 'center', justifyContent: 'center',
  },
  kanaChipUsed: { opacity: 0.25 },
  kanaChipText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },

  clearBtn: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#666',
  },
  clearBtnText: { color: '#aaa', fontSize: 12 },

  hint: { color: '#ffb74d', fontSize: 12, marginTop: 10, textAlign: 'center', fontStyle: 'italic' },
  instruction: { color: '#90caf9', fontSize: 13, marginBottom: 10, textAlign: 'center', fontStyle: 'italic' },

  // particleFill
  sentenceBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    backgroundColor: '#16213e',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  particleSlot: {
    minWidth: 32, height: 28,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    borderBottomWidth: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  particleSlotText: { fontSize: 17, fontWeight: 'bold' },
  particleRow: { marginBottom: 10 },
  particleLabel: { color: '#aaa', fontSize: 12, marginBottom: 4 },
  particleOptions: { flexDirection: 'row', gap: 8 },
  particleOption: {
    minWidth: 44,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  particleOptionText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // kanjiMatch
  matchRow: { flexDirection: 'row', gap: 10 },
  matchCell: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 8,
    backgroundColor: '#16213e',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  matchCellMatched: { opacity: 0.35 },
  matchKanji:    { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  matchFurigana: { color: '#90caf9', fontSize: 17 },
  matchArrow:    { fontSize: 11, marginTop: 2 },

  // counter
  counterVisible: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16213e',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 6,
  },
  counterEmoji: { fontSize: 28 },
  counterTotal: { color: '#90caf9', fontSize: 16, marginLeft: 8, fontWeight: 'bold' },

  // direction
  compass: {
    width: '100%',
    height: 180,
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 10,
    position: 'relative',
  },
  compassBtn: {
    position: 'absolute',
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    minWidth: 70,
    alignItems: 'center', justifyContent: 'center',
  },
  compassCenter: {
    position: 'absolute',
    top: '42%', left: '44%',
    fontSize: 32,
  },
  tappedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tappedChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tappedChipText: { color: '#fff', fontSize: 11 },

  // sentenceOrder
  sentenceOrderPool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  sentenceBlock: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#16213e',
  },
  sentenceBlockUsed: { opacity: 0.25 },
  sentenceOrderPicked: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#0a0e18',
    minHeight: 54,
    alignItems: 'center',
  },
  sentencePickedBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#16213e',
  },
  sentencePickedNum: { color: '#90caf9', fontSize: 10, fontWeight: 'bold' },
});
