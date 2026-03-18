import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, Dimensions, FlatList,
} from 'react-native';
import { getLessonById } from '../data/lessons';
import { usePlayer } from '../context/PlayerContext';
import FuriganaText from '../components/FuriganaText';
import RankUpModal from '../components/RankUpModal';

const { width: SCREEN_W } = Dimensions.get('window');
const XP_PER_LESSON = 30;

// ─── Slide: Intro ─────────────────────────────────────────────────────────────
const SlideIntro = ({ slide }) => (
  <View style={styles.slideContent}>
    <Text style={styles.sensei}>🧙 Sensei</Text>
    <View style={styles.speechBubble}>
      <FuriganaText text={slide.sensei || ''} fontSize={15} color="#ddd" style={styles.speechTextWrap} />
    </View>
    <Text style={styles.tapHint}>Toque em "Próximo" para começar</Text>
  </View>
);

// ─── Slide: Conceito ──────────────────────────────────────────────────────────
const SlideConcept = ({ slide }) => (
  <ScrollView style={styles.slideContent} showsVerticalScrollIndicator={false}>
    {slide.sensei ? (
      <View style={styles.speechBubble}>
        <Text style={styles.sensei}>🧙 Sensei</Text>
        <FuriganaText text={slide.sensei} fontSize={15} color="#ddd" style={styles.speechTextWrap} />
      </View>
    ) : null}

    {slide.japanese ? (
      <View style={styles.japaneseBox}>
        <FuriganaText
          text={slide.japanese}
          fontSize={24}
          highlight={slide.highlight}
          style={styles.furiganaBlock}
        />
        {slide.romaji ? (
          <Text style={styles.romaji}>{slide.romaji}</Text>
        ) : null}
        {slide.translation ? (
          <Text style={styles.translation}>「{slide.translation}」</Text>
        ) : null}
      </View>
    ) : null}

    {slide.note ? (
      <View style={styles.noteBox}>
        <Text style={styles.noteLabel}>📝 Nota</Text>
        <FuriganaText text={slide.note} fontSize={13} color="#ccc" furiganaColor="#90caf9" style={styles.noteTextWrap} />
      </View>
    ) : null}
  </ScrollView>
);

// ─── Slide: Exemplos ──────────────────────────────────────────────────────────
const SlideExample = ({ slide }) => (
  <ScrollView style={styles.slideContent} showsVerticalScrollIndicator={false}>
    {slide.sensei ? (
      <View style={styles.speechBubble}>
        <Text style={styles.sensei}>🧙 Sensei</Text>
        <FuriganaText text={slide.sensei} fontSize={15} color="#ddd" style={styles.speechTextWrap} />
      </View>
    ) : null}
    {(slide.examples || []).map((ex, i) => (
      <View key={i} style={styles.exampleCard}>
        <FuriganaText
          text={ex.japanese}
          fontSize={20}
          style={styles.furiganaBlock}
        />
        <Text style={styles.exampleRomaji}>{ex.romaji}</Text>
        <Text style={styles.examplePt}>→ {ex.translation}</Text>
      </View>
    ))}
  </ScrollView>
);

// ─── Slide: Tabela ────────────────────────────────────────────────────────────
const SlideTable = ({ slide }) => (
  <ScrollView style={styles.slideContent} showsVerticalScrollIndicator={false}>
    {slide.sensei ? (
      <View style={styles.speechBubble}>
        <Text style={styles.sensei}>🧙 Sensei</Text>
        <FuriganaText text={slide.sensei} fontSize={15} color="#ddd" style={styles.speechTextWrap} />
      </View>
    ) : null}
    <View style={styles.table}>
      {(slide.rows || []).map((row, i) => (
        <View key={i} style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : null]}>
          <View style={styles.tableCellJpContainer}>
            <FuriganaText
              text={row[0]}
              fontSize={15}
              furiganaColor='#a5d6a7'
            />
          </View>
          <View style={styles.tableCellPtContainer}>
            <FuriganaText text={row[1]} fontSize={14} color="#a5d6a7" furiganaColor="#90caf9" />
          </View>
        </View>
      ))}
    </View>
  </ScrollView>
);

// ─── Slide: Dica ──────────────────────────────────────────────────────────────
const SlideTip = ({ slide }) => (
  <ScrollView style={styles.slideContent} showsVerticalScrollIndicator={false}>
    <View style={styles.tipBox}>
      <Text style={styles.tipIcon}>💡</Text>
      <Text style={styles.tipTitle}>Dica Cultural</Text>
      {slide.sensei ? <FuriganaText text={slide.sensei} fontSize={14} color="#ddd" furiganaColor="#90caf9" style={styles.tipTextWrap} /> : null}
    </View>
    {slide.japanese ? (
      <View style={styles.japaneseBox}>
        <FuriganaText
          text={slide.japanese}
          fontSize={22}
          style={styles.furiganaBlock}
        />
        {slide.romaji ? <Text style={styles.romaji}>{slide.romaji}</Text> : null}
        {slide.translation ? <Text style={styles.translation}>「{slide.translation}」</Text> : null}
      </View>
    ) : null}
    {slide.note ? (
      <View style={styles.noteBox}>
        <FuriganaText text={slide.note} fontSize={13} color="#ccc" furiganaColor="#90caf9" style={styles.noteTextWrap} />
      </View>
    ) : null}
  </ScrollView>
);

// ─── Despacho de tipos de slide ───────────────────────────────────────────────
const SlideRenderer = ({ slide }) => {
  switch (slide.type) {
    case 'intro':    return <SlideIntro    slide={slide} />;
    case 'concept':  return <SlideConcept  slide={slide} />;
    case 'example':  return <SlideExample  slide={slide} />;
    case 'table':    return <SlideTable    slide={slide} />;
    case 'tip':      return <SlideTip      slide={slide} />;
    default:         return <SlideConcept  slide={slide} />;
  }
};

// ─── Quiz ─────────────────────────────────────────────────────────────────────
const QuizSection = ({ quiz, onComplete }) => {
  const [current,  setCurrent]  = useState(0);
  const [selected, setSelected] = useState(null);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const q = quiz[current];

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.correctIdx;
    if (correct) setScore(s => s + 1);
    else shake();
  };

  const handleNext = () => {
    if (current + 1 < quiz.length) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const passed = score >= Math.ceil(quiz.length * 0.6);
    return (
      <View style={styles.quizResult}>
        <Text style={styles.quizResultIcon}>{passed ? '🏆' : '📚'}</Text>
        <Text style={styles.quizResultTitle}>
          {passed ? 'Parabéns!' : 'Continue praticando!'}
        </Text>
        <Text style={styles.quizResultScore}>
          {score}/{quiz.length} corretas
        </Text>
        <Text style={styles.quizResultMsg}>
          {passed
            ? `Excelente! Você ganhou +${XP_PER_LESSON} XP por completar esta lição.`
            : 'Você pode revisar os slides e tentar o quiz novamente.'}
        </Text>
        <TouchableOpacity style={styles.finishBtn} onPress={() => onComplete(passed, score)}>
          <Text style={styles.finishBtnText}>
            {passed ? 'Concluir Lição' : 'Rever os Slides'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.quizContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.quizHeader}>Quiz — {current + 1}/{quiz.length}</Text>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <View style={styles.questionBox}>
          <FuriganaText
            text={q.question}
            fontSize={16}
            color='#e8e8e8'
            furiganaColor='#90caf9'
            style={{ justifyContent: 'flex-start' }}
          />
        </View>
      </Animated.View>

      {q.options.map((opt, idx) => {
        let optStyle = styles.optionBtn;
        let optTextColor = '#e8e8e8';
        if (selected !== null) {
          if (idx === q.correctIdx) { optStyle = styles.optionCorrect; optTextColor = '#fff'; }
          else if (idx === selected) { optStyle = styles.optionWrong; optTextColor = '#fff'; }
        }
        return (
          <TouchableOpacity key={idx} style={optStyle} onPress={() => handleAnswer(idx)}>
            <FuriganaText
              text={opt}
              fontSize={15}
              color={optTextColor}
              furiganaColor='#b3e5fc'
              style={{ justifyContent: 'center' }}
            />
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
            {current + 1 < quiz.length ? 'Próxima →' : 'Ver Resultado →'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

// ─── LessonScreen ─────────────────────────────────────────────────────────────
export default function LessonScreen({ navigation, route }) {
  const lessonId = route.params?.lessonId;
  const lesson   = getLessonById(lessonId);
  const { gainXP, completeLesson } = usePlayer();

  const [slideIdx, setSlideIdx] = useState(0);
  const [inQuiz,   setInQuiz]   = useState(false);
  const [rankUpModal, setRankUpModal] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Lição não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalSlides = lesson.slides.length;
  const progress    = inQuiz ? 1 : (slideIdx + 1) / (totalSlides + 1);

  const goToSlide = (idx) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setSlideIdx(idx);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const handleNext = () => {
    if (slideIdx < totalSlides - 1) {
      goToSlide(slideIdx + 1);
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setInQuiz(true);
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
    }
  };

  const handlePrev = () => {
    if (inQuiz) {
      setInQuiz(false);
      setSlideIdx(totalSlides - 1);
    } else if (slideIdx > 0) {
      goToSlide(slideIdx - 1);
    }
  };

  const fromTemple = route.params?.fromTemple === true;

  const handleQuizComplete = (passed, score) => {
    if (passed) {
      if (fromTemple) {
        completeLesson(lessonId);
        navigation.goBack();
      } else {
        gainXP(XP_PER_LESSON, (newRank) => {
          if (newRank) {
            setRankUpModal(newRank);
          } else {
            completeLesson(lessonId);
            navigation.goBack();
          }
        });
      }
    } else {
      navigation.goBack();
    }
  };

  const handleRankUpDismiss = () => {
    completeLesson(lessonId);
    setRankUpModal(null);
    navigation.goBack();
  };

  const levelColor = {
    N5: '#4caf50', N4: '#2196f3', N3: '#9c27b0',
    N2: '#ff9800', N1: '#f44336',
  }[lesson.jlptLevel] || '#888';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerIcon}>{lesson.icon}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
        </View>
        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={styles.levelBadgeText}>{lesson.jlptLevel}</Text>
        </View>
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: levelColor }]} />
      </View>

      {/* Conteúdo principal */}
      <Animated.View style={[styles.slideArea, { opacity: fadeAnim }]}>
        {inQuiz ? (
          <QuizSection quiz={lesson.quiz} onComplete={handleQuizComplete} />
        ) : (
          <SlideRenderer slide={lesson.slides[slideIdx]} />
        )}
      </Animated.View>

      {/* Navegação de slides */}
      {!inQuiz ? (
        <View style={styles.nav}>
          <TouchableOpacity
            style={[styles.navBtn, slideIdx === 0 && styles.navBtnDisabled]}
            onPress={handlePrev}
            disabled={slideIdx === 0}
          >
            <Text style={styles.navBtnText}>← Anterior</Text>
          </TouchableOpacity>

          {/* Indicadores de ponto */}
          <View style={styles.dots}>
            {lesson.slides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === slideIdx ? { ...styles.dotActive, backgroundColor: levelColor } : null]}
              />
            ))}
            <View style={[styles.dot, styles.dotQuiz]} />
          </View>

          <TouchableOpacity style={[styles.navBtn, styles.navBtnNext, { backgroundColor: levelColor }]} onPress={handleNext}>
            <Text style={[styles.navBtnText, styles.navBtnNextText]}>
              {slideIdx < totalSlides - 1 ? 'Próximo →' : 'Quiz →'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <RankUpModal
        visible={!!rankUpModal}
        newRank={rankUpModal}
        onDismiss={handleRankUpDismiss}
      />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  errorText: { color: '#fff', fontSize: 16, marginBottom: 12 },
  backLink:  { color: '#ffd700', fontSize: 15 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#16213e',
    gap: 10,
  },
  closeBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon:  { fontSize: 22 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', flex: 1 },
  levelBadge:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  levelBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // Progresso
  progressTrack: { height: 4, backgroundColor: '#333' },
  progressFill:  { height: '100%', borderRadius: 2, transition: 'width 0.3s' },

  // Área do slide
  slideArea: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  slideContent: { flex: 1 },

  // Sensei / balão de fala
  sensei: { color: '#ffd700', fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  speechBubble: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffd70055',
    padding: 14,
    marginBottom: 16,
  },
  speechText: { color: '#ddd', fontSize: 15, lineHeight: 22 },
  speechTextWrap: { alignSelf: 'stretch', lineHeight: 22 },
  noteTextWrap: { alignSelf: 'stretch', lineHeight: 20 },
  tipTextWrap: { alignSelf: 'stretch', lineHeight: 22, marginTop: 4 },
  tapHint: { color: '#666', fontSize: 13, textAlign: 'center', marginTop: 20 },

  // Caixa de japonês
  japaneseBox: {
    backgroundColor: '#0f3460',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1a6ba055',
  },
  furiganaBlock: { justifyContent: 'center' },
  japaneseText: { color: '#fff', fontSize: 34, fontWeight: 'bold', textAlign: 'center' },
  highlight:    { color: '#ffd700', fontSize: 34, fontWeight: 'bold' },
  romaji:       { color: '#90caf9', fontSize: 14, marginTop: 8, fontStyle: 'italic' },
  translation:  { color: '#a5d6a7', fontSize: 15, marginTop: 6 },

  // Nota
  noteBox: {
    backgroundColor: '#2d2d44',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#ffd700',
    marginBottom: 12,
  },
  noteLabel: { color: '#ffd700', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  noteText:  { color: '#ccc', fontSize: 13, lineHeight: 20 },

  // Exemplos
  exampleCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  exampleJp:    { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  exampleRomaji:{ color: '#90caf9', fontSize: 12, marginTop: 2, fontStyle: 'italic' },
  examplePt:    { color: '#a5d6a7', fontSize: 14, marginTop: 4 },

  // Tabela
  table: { borderRadius: 10, overflow: 'hidden', marginBottom: 12 },
  tableRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center', backgroundColor: '#16213e' },
  tableRowEven: { backgroundColor: '#1e2d50' },
  tableCellJpContainer: { flex: 1, paddingRight: 8 },
  tableCellJp: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  tableCellPt: { flex: 1, color: '#a5d6a7', fontSize: 14, textAlign: 'right' },
  tableCellPtContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-end' },

  // Dica
  tipBox: {
    backgroundColor: '#2d2015',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ffd70044',
  },
  tipIcon:  { fontSize: 32, marginBottom: 6 },
  tipTitle: { color: '#ffd700', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  tipText:  { color: '#ddd', fontSize: 14, lineHeight: 22, textAlign: 'center' },

  // Navegação
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 32,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  navBtnDisabled: { opacity: 0.3 },
  navBtnNext:     {},
  navBtnText:     { color: '#ccc', fontSize: 14, fontWeight: '600' },
  navBtnNextText: { color: '#fff' },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: '#444' },
  dotActive: { width: 9, height: 9 },
  dotQuiz:   { backgroundColor: '#ff9800', width: 7, height: 7 },

  // Quiz
  quizContainer: { flex: 1 },
  quizHeader: {
    color: '#ffd700',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  questionBox: {
    backgroundColor: '#0f3460',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a6ba033',
  },
  questionText: { color: '#fff', fontSize: 17, lineHeight: 26, textAlign: 'center' },
  optionBtn: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#333',
  },
  optionCorrect: {
    backgroundColor: '#1b5e20',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  optionWrong: {
    backgroundColor: '#7f0000',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#f44336',
  },
  optionText: { color: '#fff', fontSize: 15, textAlign: 'center' },
  explanationBox: {
    backgroundColor: '#2d2d44',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#90caf9',
  },
  explanationText: { color: '#ccc', fontSize: 13, lineHeight: 20 },
  nextBtn: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a6ba0',
  },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // Resultado do quiz
  quizResult: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  quizResultIcon:  { fontSize: 64, marginBottom: 12 },
  quizResultTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  quizResultScore: { color: '#ffd700', fontSize: 22, marginBottom: 12 },
  quizResultMsg:   { color: '#ccc', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  finishBtn: {
    backgroundColor: '#8b0000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  finishBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
