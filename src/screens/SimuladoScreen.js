/**
 * Simulado JLPT — Prova no formato oficial para avaliar o jogador.
 * Questões baseadas no conteúdo das lições, no estilo do exame real.
 */
import React, { useState, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, SafeAreaView, StatusBar,
} from 'react-native';
import FuriganaText from '../components/FuriganaText';
import { getSimuladoByLevel, getSimuladoLevels, getRandomizedSimulado } from '../data/simulados';

const LEVEL_COLOR = {
  N5: '#4caf50', N4: '#2196f3', N3: '#9c27b0', N2: '#ff9800', N1: '#f44336',
};

// ─── Tela de seleção de nível ───────────────────────────────────────────────
function LevelSelect({ levels, onSelect, onBack }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Simulado JLPT</Text>
        <Text style={styles.subtitle}>Escolha o nível da prova</Text>
      </View>
      <ScrollView style={styles.levelList} contentContainerStyle={styles.levelListContent}>
        {levels.map((lv) => {
          const sim = getSimuladoByLevel(lv);
          if (!sim) return null;
          const color = LEVEL_COLOR[lv] || '#888';
          return (
            <TouchableOpacity
              key={lv}
              style={[styles.levelCard, { borderColor: color }]}
              onPress={() => onSelect(lv)}
            >
              <Text style={[styles.levelBadge, { color }]}>{lv}</Text>
              <Text style={styles.levelTitle}>{sim.title}</Text>
              <Text style={styles.levelDesc}>{sim.description}</Text>
              <Text style={styles.levelMeta}>
                ⏱ {sim.timeMinutes} min • {sim.questions.length} questões
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Prova (questões) ──────────────────────────────────────────────────────
function ExamSection({ simulado, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const questions = simulado.questions;
  const q = questions[current];

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correctIdx) setScore((s) => s + 1);
    else shake();
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= (simulado.passPercent || 60);
    const color = LEVEL_COLOR[simulado.level] || '#4caf50';

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultIcon}>{passed ? '🏆' : '📚'}</Text>
        <Text style={styles.resultTitle}>
          {passed ? 'Parabéns! Você passou!' : 'Continue estudando!'}
        </Text>
        <Text style={styles.resultScore}>
          {score}/{questions.length} corretas ({percent}%)
        </Text>
        <Text style={styles.resultMsg}>
          {passed
            ? `Você atingiu o mínimo de ${simulado.passPercent}% para aprovação no JLPT ${simulado.level}.`
            : `O JLPT ${simulado.level} exige pelo menos ${simulado.passPercent}%. Revise as lições e tente novamente!`}
        </Text>
        <TouchableOpacity
          style={[styles.finishBtn, { borderColor: color }]}
          onPress={() => onComplete(passed, score)}
        >
          <Text style={styles.finishBtnText}>Concluir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sectionLabel = q.section === 'vocabulary' ? '語彙' : q.section === 'combined' ? '言語知識・読解' : q.section === 'grammar' ? '文法・読解' : '聴解';

  return (
    <ScrollView style={styles.quizContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.quizHeader}>
        <Text style={styles.sectionLabel}>{sectionLabel}</Text>
        <Text style={styles.questionCounter}>
          {current + 1} / {questions.length}
        </Text>
      </View>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <View style={styles.questionBox}>
          <FuriganaText
            text={q.question}
            fontSize={16}
            color="#e8e8e8"
            furiganaColor="#90caf9"
            style={{ justifyContent: 'flex-start' }}
          />
        </View>
      </Animated.View>

      {q.options.map((opt, idx) => {
        let optStyle = styles.optionBtn;
        let optTextColor = '#e8e8e8';
        if (selected !== null) {
          if (idx === q.correctIdx) {
            optStyle = styles.optionCorrect;
            optTextColor = '#fff';
          } else if (idx === selected) {
            optStyle = styles.optionWrong;
            optTextColor = '#fff';
          }
        }
        return (
          <TouchableOpacity key={idx} style={optStyle} onPress={() => handleAnswer(idx)}>
            <Text style={[styles.optionText, { color: optTextColor }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}

      {selected !== null ? (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationText}>💬 {q.explanation}</Text>
        </View>
      ) : null}

      {selected !== null ? (
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {current + 1 < questions.length ? 'Próxima →' : 'Ver Resultado →'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

// ─── SimuladoScreen ────────────────────────────────────────────────────────
export default function SimuladoScreen({ navigation, route }) {
  const level = route.params?.level;
  const simulado = level ? getSimuladoByLevel(level) : null;
  const levels = getSimuladoLevels();

  const [selectedLevel, setSelectedLevel] = useState(level || null);

  if (levels.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Nenhum simulado disponível.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Sem nível selecionado: mostrar seleção
  if (!selectedLevel) {
    return (
      <LevelSelect
        levels={levels}
        onSelect={setSelectedLevel}
        onBack={() => navigation.goBack()}
      />
    );
  }

  const sim = useMemo(() => getRandomizedSimulado(selectedLevel), [selectedLevel]);
  if (!sim) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Simulado não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const color = LEVEL_COLOR[selectedLevel] || '#4caf50';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.examHeader}>
        <TouchableOpacity onPress={() => setSelectedLevel(null)}>
          <Text style={styles.backBtn}>← Trocar nível</Text>
        </TouchableOpacity>
        <Text style={[styles.examTitle, { color }]}>{sim.title}</Text>
      </View>
      <ExamSection
        simulado={sim}
        onComplete={() => {
          setSelectedLevel(null);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a12' },
  header: { padding: 20, paddingTop: 10 },
  backBtn: { color: '#90caf9', fontSize: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  subtitle: { color: '#aaa', fontSize: 14, marginTop: 4 },
  levelList: { flex: 1, minHeight: 0 },
  levelListContent: { padding: 16, paddingBottom: 40 },
  levelCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
  },
  levelBadge: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  levelTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  levelDesc: { color: '#aaa', fontSize: 13, marginTop: 4 },
  levelMeta: { color: '#666', fontSize: 12, marginTop: 8 },
  examHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  examTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  errorText: { color: '#f44336', padding: 20 },

  quizContainer: { flex: 1, minHeight: 0 },
  quizHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  sectionLabel: { color: '#90caf9', fontSize: 14, fontWeight: '600' },
  questionCounter: { color: '#888', fontSize: 14 },
  questionBox: {
    backgroundColor: '#0f3460',
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a6ba033',
  },
  optionBtn: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#333',
  },
  optionCorrect: {
    backgroundColor: '#1b5e20',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  optionWrong: {
    backgroundColor: '#7f0000',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#f44336',
  },
  optionText: { fontSize: 15, textAlign: 'center' },
  explanationBox: {
    backgroundColor: '#2d2d44',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#90caf9',
  },
  explanationText: { color: '#ccc', fontSize: 13, lineHeight: 20 },
  nextBtn: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a6ba0',
  },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  resultIcon: { fontSize: 64, marginBottom: 12 },
  resultTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  resultScore: { color: '#ffd700', fontSize: 22, marginBottom: 12 },
  resultMsg: { color: '#ccc', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  finishBtn: {
    backgroundColor: '#0f3460',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
  },
  finishBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
