import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Dimensions,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { LESSONS } from '../data/lessons';
import { JLPT_ORDER } from '../utils/jlptLevels';

const { width: W } = Dimensions.get('window');
const LEVEL_COLOR = {
  Iniciante: '#78909c', N5: '#4caf50', N4: '#2196f3', N3: '#9c27b0',
  N2: '#ff9800', N1: '#f44336',
};

// ─── Frase dinâmica do Eimei ──────────────────────────────────────────────────
function getEimeiMessage(completedLessons = [], kanaPhase, totalXp) {
  if (!kanaPhase || kanaPhase !== 'done') {
    return 'Sua mente ainda não dominou os kanas. Complete a prova final e retorne — o templo estará esperando.';
  }
  const count = completedLessons.length;
  if (count === 0)  return 'Bem-vindo de volta, Ryuu. As prateleiras do templo guardam todo o conhecimento que você reconquistou. Por onde quer começar?';
  if (count < 3)    return 'Bom início! Cada lição concluída faz a névoa de Kurokami recuar um pouco mais. Continue, jovem samurai.';
  if (count < 6)    return 'Seu progresso é notável. Eu vejo o guerreiro emergindo de volta. O templo tem muito mais a oferecer.';
  if (count < 10)   return 'Impressionante, Ryuu. Poucos chegam tão longe. Que cada kanji aprendido seja uma lâmina forjada contra Kurokami.';
  return 'Mestre... sim, agora posso te chamar assim. Você redescobriu tudo que lhe foi roubado. O templo é seu lar de treinamento para sempre.';
}

// ─── Determina quais lições estão desbloqueadas ───────────────────────────────
function getLessonStatus(lesson, jlptLevel, completedLessons, devMode) {
  if (devMode) return completedLessons?.includes(lesson.id) ? 'completed' : 'available';
  const playerLevelIdx  = JLPT_ORDER.indexOf(jlptLevel);
  const lessonLevelIdx  = JLPT_ORDER.indexOf(lesson.jlptLevel);
  const completed       = completedLessons?.includes(lesson.id);

  if (completed) return 'completed';
  if (lessonLevelIdx <= playerLevelIdx + 1) return 'available';
  return 'locked';
}

// ─── Definição dos Mini-Games disponíveis ─────────────────────────────────────
function getMinigames(context) {
  const { kanaPhase, completedLessons = [], jlptLevel, devMode } = context;
  const forceUnlock = !!devMode;

  return [
    {
      id: 'kana-practice',
      name: 'Chuva de Kana',
      desc: 'Escolha um grupo ou todos os Hiragana/Katakana para treinar.',
      icon: '🌧️',
      color: '#90caf9',
      unlocked: forceUnlock || kanaPhase === 'done',
      lockedMsg: 'Complete a prova do Mestre Eimei para desbloquear.',
      screen: 'KanaRain',
      params: { fromTemple: true },
    },
    {
      id: 'kanji-battle',
      name: 'Batalha de Kanjis',
      desc: 'Escolha o nível e enfrente inimigos em combate de kanjis.',
      icon: '⚔️',
      color: '#ef9a9a',
      unlocked: true,
      screen: 'BattleTempleSelect',
      params: { fromTemple: true },
    },
    {
      id: 'lesson-quiz',
      name: 'Quiz Rápido',
      desc: 'Refaça o quiz de qualquer lição concluída para praticar.',
      icon: '📝',
      color: '#a5d6a7',
      unlocked: forceUnlock || completedLessons.length > 0,
      lockedMsg: 'Conclua ao menos uma lição para desbloquear.',
      screen: 'LessonsList',
      params: { fromTemple: true },
    },
    {
      id: 'jlpt-simulado',
      name: 'Simulado JLPT',
      desc: 'Prova completa no formato oficial. Avalie seu nível!',
      icon: '📋',
      color: '#ffb74d',
      unlocked: true,
      screen: 'Simulado',
      params: { fromTemple: true },
    },
  ];
}

// ─── Card de Lição ────────────────────────────────────────────────────────────
const LessonCard = ({ lesson, status, onPress }) => {
  const color = LEVEL_COLOR[lesson.jlptLevel] || '#888';
  const isLocked = status === 'locked';

  return (
    <TouchableOpacity
      style={[styles.lessonCard, isLocked && styles.lessonCardLocked]}
      onPress={isLocked ? null : onPress}
      activeOpacity={isLocked ? 1 : 0.75}
    >
      <View style={[styles.lessonAccent, { backgroundColor: isLocked ? '#444' : color }]} />
      <View style={styles.lessonBody}>
        <View style={styles.lessonRow}>
          <Text style={[styles.lessonIcon, isLocked && { opacity: 0.4 }]}>
            {isLocked ? '🔒' : status === 'completed' ? '✅' : lesson.icon}
          </Text>
          <View style={[styles.levelPill, { backgroundColor: isLocked ? '#33333388' : color + '33', borderColor: isLocked ? '#555' : color }]}>
            <Text style={[styles.levelPillText, { color: isLocked ? '#555' : color }]}>{lesson.jlptLevel}</Text>
          </View>
        </View>
        <Text style={[styles.lessonTitle, isLocked && styles.textDimmed]}>{lesson.title}</Text>
        <Text style={[styles.lessonDesc, isLocked && styles.textDimmed]} numberOfLines={1}>{lesson.description}</Text>

        {status === 'completed' && (
          <Text style={styles.completedBadge}>✓ Concluída</Text>
        )}
        {isLocked && (
          <Text style={styles.lockedBadge}>🔒 Bloqueada</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── Card de Mini-Game ────────────────────────────────────────────────────────
const MinigameCard = ({ game, onPress }) => (
  <TouchableOpacity
    style={[styles.gameCard, !game.unlocked && styles.gameCardLocked]}
    onPress={game.unlocked ? onPress : null}
    activeOpacity={game.unlocked ? 0.75 : 1}
  >
    <Text style={[styles.gameIcon, !game.unlocked && { opacity: 0.35 }]}>
      {game.unlocked ? game.icon : '🔒'}
    </Text>
    <Text style={[styles.gameName, !game.unlocked && styles.textDimmed]}>{game.name}</Text>
    <Text style={[styles.gameDesc, !game.unlocked && styles.textDimmed]} numberOfLines={2}>
      {game.unlocked ? game.desc : game.lockedMsg || 'Ainda não desbloqueado.'}
    </Text>
    {game.unlocked && (
      <View style={[styles.gamePlayBtn, { backgroundColor: game.color + '33', borderColor: game.color }]}>
        <Text style={[styles.gamePlayText, { color: game.color }]}>▶ Jogar</Text>
      </View>
    )}
  </TouchableOpacity>
);

// ─── EimeiTempleScreen ────────────────────────────────────────────────────────
export default function EimeiTempleScreen({ navigation }) {
  const {
    completedLessons, kanaPhase, jlptLevel, totalXp, rank, devMode,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState('lessons');

  const eimeiMsg   = getEimeiMessage(completedLessons, kanaPhase, totalXp);
  const minigames  = useMemo(() => getMinigames({ kanaPhase, completedLessons, jlptLevel, devMode }), [kanaPhase, completedLessons, jlptLevel, devMode]);

  // Estatísticas do templo
  const totalLessons     = LESSONS.length;
  const completedCount   = completedLessons?.length ?? 0;
  const progressPercent  = Math.round((completedCount / totalLessons) * 100);
  const unlockedGames    = minigames.filter(g => g.unlocked).length;

  const handleLessonPress = (lesson) => {
    navigation.navigate('Lesson', { lessonId: lesson.id });
  };

  const handleGamePress = (game) => {
    navigation.navigate(game.screen, game.params ?? {});
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* ── Cabeçalho ─────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>⛩  Templo de Eimei</Text>
          <Text style={styles.headerSub}>Dojo do Mestre</Text>
        </View>
        <View style={styles.headerXP}>
          <Text style={styles.headerRank}>{rank}</Text>
          <Text style={styles.headerJlpt}>JLPT: {jlptLevel}</Text>
          <Text style={styles.headerXPText}>{totalXp} XP</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Eimei ──────────────────────────────────────────────── */}
        <View style={styles.eimeiSection}>
          <View style={styles.eimeiAvatar}>
            <Text style={styles.eimeiAvatarIcon}>🧙</Text>
          </View>
          <View style={styles.eimeiSpeech}>
            <Text style={styles.eimeiName}>Mestre Eimei</Text>
            <Text style={styles.eimeiText}>{eimeiMsg}</Text>
          </View>
        </View>

        {/* ── Progresso do Templo ─────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{completedCount}</Text>
            <Text style={styles.statLabel}>Lições{'\n'}Concluídas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{progressPercent}%</Text>
            <Text style={styles.statLabel}>Progresso{'\n'}Geral</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{unlockedGames}</Text>
            <Text style={styles.statLabel}>Mini-games{'\n'}Disponíveis</Text>
          </View>
        </View>

        {/* Barra de progresso geral */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{completedCount}/{totalLessons} lições completas</Text>

        {/* ── Abas ───────────────────────────────────────────────── */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'lessons' && styles.tabActive]}
            onPress={() => setActiveTab('lessons')}
          >
            <Text style={[styles.tabText, activeTab === 'lessons' && styles.tabTextActive]}>
              📚 Lições
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'minigames' && styles.tabActive]}
            onPress={() => setActiveTab('minigames')}
          >
            <Text style={[styles.tabText, activeTab === 'minigames' && styles.tabTextActive]}>
              🎮 Mini-Games
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Aba: Lições ─────────────────────────────────────────── */}
        {/* Só exibe lições de níveis já completados (para revisão no templo) */}
        {activeTab === 'lessons' && (
          <View style={styles.tabContent}>
            {(() => {
              const playerLevelIdx = JLPT_ORDER.indexOf(jlptLevel);
              const levelsToShow = devMode
                ? JLPT_ORDER
                : JLPT_ORDER.filter((_, idx) => idx < playerLevelIdx);
              if (levelsToShow.length === 0 && !devMode) {
                return (
                  <View style={styles.emptyTemple}>
                    <Text style={styles.emptyTempleIcon}>📚</Text>
                    <Text style={styles.emptyTempleTitle}>Nenhuma lição liberada ainda</Text>
                    <Text style={styles.emptyTempleText}>
                      Complete as lições da Aldeia dos Aprendizes para liberar a revisão no templo.
                    </Text>
                  </View>
                );
              }
              return (
                <>
                  {levelsToShow.map(lvl => {
                    const levelLessons = LESSONS.filter(l => l.jlptLevel === lvl);
                    if (!levelLessons.length) return null;
                    return (
                      <View key={lvl}>
                        <View style={[styles.levelSectionHeader, { borderLeftColor: LEVEL_COLOR[lvl] }]}>
                          <Text style={[styles.levelSectionTitle, { color: LEVEL_COLOR[lvl] }]}>
                            Nível {lvl} — Revisão
                          </Text>
                        </View>
                        {levelLessons.map(lesson => {
                          const status = getLessonStatus(lesson, jlptLevel, completedLessons, devMode);
                          return (
                            <LessonCard
                              key={lesson.id}
                              lesson={lesson}
                              status={status}
                              onPress={() => handleLessonPress(lesson)}
                            />
                          );
                        })}
                      </View>
                    );
                  })}
                  <View style={styles.bottomNote}>
                    <Text style={styles.bottomNoteText}>
                      📖 As lições aparecem aqui após você completar cada nível nas regiões do mapa.
                    </Text>
                  </View>
                </>
              );
            })()}
          </View>
        )}

        {/* ── Aba: Mini-Games ─────────────────────────────────────── */}
        {activeTab === 'minigames' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionLabel}>Treinos Disponíveis</Text>
            {minigames.map(game => (
              <MinigameCard
                key={game.id}
                game={game}
                onPress={() => handleGamePress(game)}
              />
            ))}

            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonIcon}>🌀</Text>
              <Text style={styles.comingSoonTitle}>Mais treinos em breve</Text>
              <Text style={styles.comingSoonText}>
                Novos mini-games serão desbloqueados conforme você dominar novas regiões e lições.
              </Text>
            </View>

            <View style={styles.bottomNote}>
              <Text style={styles.bottomNoteText}>
                🔓 Continue avançando no mapa para desbloquear mais modalidades de treino.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0a06' },
  scroll:    { flex: 1, minHeight: 0 },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#1a1208',
    borderBottomWidth: 1,
    borderBottomColor: '#c8a96e33',
    gap: 12,
  },
  backBtn: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(200,169,110,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  backBtnText: { color: '#c8a96e', fontSize: 20 },
  headerCenter: { flex: 1 },
  headerTitle: { color: '#ffd700', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  headerSub:   { color: '#8a7355', fontSize: 12, marginTop: 1 },
  headerXP:    { alignItems: 'flex-end' },
  headerRank:  { color: '#c8a96e', fontSize: 12, fontWeight: 'bold' },
  headerJlpt:  { color: '#78909c', fontSize: 11, marginTop: 2 },
  headerXPText:{ color: '#666', fontSize: 11, marginTop: 2 },

  // ── Eimei
  eimeiSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    margin: 16,
    backgroundColor: '#1a1208',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c8a96e33',
    gap: 12,
  },
  eimeiAvatar: {
    width: 60, height: 60,
    borderRadius: 30,
    backgroundColor: '#2a1f06',
    borderWidth: 2,
    borderColor: '#c8a96e',
    justifyContent: 'center', alignItems: 'center',
  },
  eimeiAvatarIcon: { fontSize: 32 },
  eimeiSpeech: { flex: 1 },
  eimeiName: { color: '#ffd700', fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  eimeiText:  { color: '#c8b890', fontSize: 13, lineHeight: 20, fontStyle: 'italic' },

  // ── Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#1a1208',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8a96e22',
    overflow: 'hidden',
    marginBottom: 10,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statNum:  { color: '#ffd700', fontSize: 22, fontWeight: 'bold' },
  statLabel:{ color: '#7a6645', fontSize: 11, textAlign: 'center', marginTop: 3, lineHeight: 15 },
  statDivider: { width: 1, backgroundColor: '#c8a96e22', alignSelf: 'stretch' },

  progressBarTrack: {
    height: 6, marginHorizontal: 16, borderRadius: 3,
    backgroundColor: '#2a2010', overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: { height: '100%', backgroundColor: '#ffd700', borderRadius: 3 },
  progressLabel: { color: '#5a4a30', fontSize: 11, textAlign: 'center', marginBottom: 16 },

  // ── Abas
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 2,
    backgroundColor: '#150f04',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c8a96e22',
    overflow: 'hidden',
  },
  tab: {
    flex: 1, paddingVertical: 11,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: '#2a1f06' },
  tabText:   { color: '#5a4a30', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#ffd700' },

  tabContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 40 },

  // ── Seções por nível
  levelSectionHeader: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 6,
  },
  levelSectionTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },

  // ── Cards de Lição
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1208',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a1f0e',
  },
  lessonCardLocked: { opacity: 0.6 },
  lessonAccent: { width: 4, alignSelf: 'stretch' },
  lessonBody:   { flex: 1, padding: 12 },
  lessonRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  lessonIcon:   { fontSize: 22 },
  levelPill: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 8, borderWidth: 1,
  },
  levelPillText: { fontSize: 10, fontWeight: 'bold' },
  lessonTitle:  { color: '#e8d5a3', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  lessonDesc:   { color: '#7a6645', fontSize: 12 },
  completedBadge: { color: '#4caf50', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  lockedBadge:    { color: '#555', fontSize: 11, marginTop: 4 },

  // ── Cards de Mini-Game
  sectionLabel: { color: '#7a6645', fontSize: 12, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  gameCard: {
    backgroundColor: '#1a1208',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a1f0e',
    padding: 16,
    marginBottom: 12,
  },
  gameCardLocked: { opacity: 0.55 },
  gameIcon:  { fontSize: 36, marginBottom: 8 },
  gameName:  { color: '#e8d5a3', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  gameDesc:  { color: '#7a6645', fontSize: 13, lineHeight: 19, marginBottom: 12 },
  gamePlayBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18, paddingVertical: 7,
    borderRadius: 8, borderWidth: 1,
  },
  gamePlayText: { fontWeight: 'bold', fontSize: 14 },

  // ── Em breve
  comingSoon: {
    backgroundColor: '#150f04',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#c8a96e22',
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  comingSoonIcon:  { fontSize: 40, marginBottom: 8 },
  comingSoonTitle: { color: '#5a4a30', fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  comingSoonText:  { color: '#3a2f20', fontSize: 13, textAlign: 'center', lineHeight: 19 },

  // ── Templo vazio (nenhum nível completado)
  emptyTemple: {
    marginTop: 24,
    padding: 24,
    backgroundColor: '#150f04',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#c8a96e33',
    alignItems: 'center',
  },
  emptyTempleIcon: { fontSize: 48, marginBottom: 12 },
  emptyTempleTitle: { color: '#ffd700', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  emptyTempleText: { color: '#7a6645', fontSize: 13, textAlign: 'center', lineHeight: 20 },

  // ── Nota de rodapé
  bottomNote: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#150f04',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c8a96e18',
  },
  bottomNoteText: { color: '#5a4a30', fontSize: 12, textAlign: 'center', lineHeight: 18 },

  // Shared
  textDimmed: { color: '#4a3a25' },
});
