import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ImageBackground,
} from 'react-native';
import { LESSONS } from '../data/lessons';
import { usePlayer } from '../context/PlayerContext';

const LEVEL_COLOR = {
  Iniciante: '#78909c', N5: '#4caf50', N4: '#2196f3', N3: '#9c27b0',
  N2: '#ff9800', N1: '#f44336',
};

/** Mapeia região do mapa para o nível de lições a exibir */
function getLessonLevelForRegion(region) {
  if (!region) return null;
  if (region.isBeginner) return 'Iniciante';
  return region.level || null; // N5, N4, N3, N2, N1
}

const LessonCard = ({ lesson, onPress, completed }) => {
  const color = LEVEL_COLOR[lesson.jlptLevel] || '#888';
  return (
    <TouchableOpacity
      style={[styles.card, completed && styles.cardCompleted]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.cardAccent, { backgroundColor: completed ? '#4caf50' : color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{completed ? '✅' : lesson.icon}</Text>
          <View style={[styles.levelPill, { backgroundColor: color + '33', borderColor: color }]}>
            <Text style={[styles.levelPillText, { color }]}>{lesson.jlptLevel}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{lesson.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{lesson.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardMeta}>📖 {lesson.slides.length} slides</Text>
          <Text style={styles.cardMeta}>❓ {lesson.quiz.length} questões</Text>
          {completed && <Text style={styles.cardMetaDone}>✓ Concluída</Text>}
        </View>
      </View>
      <Text style={styles.cardArrow}>›</Text>
    </TouchableOpacity>
  );
};

export default function LessonsListScreen({ navigation, route }) {
  const { jlptLevel, completedLessons } = usePlayer();
  const fromTemple = route.params?.fromTemple === true;
  const region = route.params?.region;

  const lessons = useMemo(() => {
    const lessonLevel = getLessonLevelForRegion(region);
    if (lessonLevel) {
      return LESSONS.filter(l => l.jlptLevel === lessonLevel);
    }
    return LESSONS;
  }, [region]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>📚 Dojo do Sensei</Text>
          <Text style={styles.headerSub}>Escolha uma lição para começar</Text>
        </View>
      </View>

      <FlatList
        data={lessons}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <LessonCard
            lesson={item}
            completed={completedLessons?.includes(item.id)}
            onPress={() => navigation.navigate('Lesson', { lessonId: item.id, fromTemple })}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.sectionHeader}>
            {region && (
              <Text style={styles.regionLabel}>{region.name}</Text>
            )}
            <Text style={styles.sectionText}>
              Seu nível atual:{' '}
              <Text style={{ color: LEVEL_COLOR[jlptLevel] || '#fff', fontWeight: 'bold' }}>
                {jlptLevel}
              </Text>
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    gap: 12,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  backBtnText: { color: '#fff', fontSize: 22, lineHeight: 26 },
  headerCenter: { flex: 1 },
  headerTitle:  { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSub:    { color: '#888', fontSize: 13, marginTop: 2 },

  list: { padding: 16, gap: 12 },

  sectionHeader: { marginBottom: 8 },
  regionLabel: { color: '#ffd700', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  sectionText:   { color: '#aaa', fontSize: 14 },

  // Card de lição
  card: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  cardAccent: { width: 5, alignSelf: 'stretch' },
  cardBody:   { flex: 1, padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  cardIcon:   { fontSize: 24 },
  levelPill: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10, borderWidth: 1,
  },
  levelPillText: { fontSize: 11, fontWeight: 'bold' },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDesc:  { color: '#888', fontSize: 13, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', gap: 14, marginTop: 8 },
  cardMeta:     { color: '#555', fontSize: 12 },
  cardMetaDone: { color: '#4caf50', fontSize: 12, fontWeight: 'bold' },
  cardCompleted: { borderColor: '#4caf5044' },
  cardArrow:    { color: '#444', fontSize: 28, paddingRight: 14 },
});
