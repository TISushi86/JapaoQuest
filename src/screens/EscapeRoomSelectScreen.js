import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar,
} from 'react-native';
import { ROOMS } from '../data/escapeRooms';
import { usePlayer } from '../context/PlayerContext';
import { JLPT_ORDER } from '../utils/jlptLevels';

/**
 * Tela de seleção das Câmaras da Memória.
 * Exibida no templo (fromTemple=true) — mostra todas as salas com seu status.
 *
 * Regras de desbloqueio:
 *  - Sala desbloqueada se o jogador atingiu o nível JLPT dela no mapa.
 *  - OU se já completou a sala alguma vez (para revisão).
 *  - DevMode: tudo desbloqueado.
 */
export default function EscapeRoomSelectScreen({ navigation }) {
  const { jlptLevel, completedEscapeRooms = [], devMode } = usePlayer();

  const playerIdx = JLPT_ORDER.indexOf(jlptLevel);

  const isUnlocked = (room) => {
    if (devMode) return true;
    if (completedEscapeRooms.includes(room.id)) return true;
    const roomIdx = JLPT_ORDER.indexOf(room.jlptLevel);
    return playerIdx >= roomIdx;
  };

  const handleSelect = (room) => {
    if (!isUnlocked(room)) return;
    navigation.navigate('EscapeRoom', { roomId: room.id, fromStory: false });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>🗝  Câmaras da Memória</Text>
          <Text style={styles.subtitle}>記憶の間 — Fragmentos selados por Kurokami</Text>
        </View>
      </View>

      {/* Intro */}
      <View style={styles.intro}>
        <Text style={styles.introIcon}>🧙</Text>
        <Text style={styles.introText}>
          "Cada câmara guarda uma memória sua. Resolva os enigmas usando o japonês que aprendeu —
          e a névoa recuará mais um pouco."
        </Text>
      </View>

      {/* Lista de salas */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {ROOMS.map(room => {
          const unlocked = isUnlocked(room);
          const completed = completedEscapeRooms.includes(room.id);
          const isStub = room.stub === true;
          const color = room.accentColor || '#888';

          return (
            <TouchableOpacity
              key={room.id}
              style={[
                styles.card,
                { borderColor: unlocked ? color : '#333' },
                !unlocked && styles.cardLocked,
              ]}
              onPress={() => handleSelect(room)}
              disabled={!unlocked}
              activeOpacity={0.8}
            >
              <View style={[styles.cardAccent, { backgroundColor: unlocked ? color : '#333' }]} />
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardIcon, !unlocked && styles.dimmed]}>
                    {!unlocked ? '🔒' : completed ? '✅' : room.icon}
                  </Text>
                  <View style={[
                    styles.levelPill,
                    { backgroundColor: (unlocked ? color : '#444') + '33', borderColor: unlocked ? color : '#555' },
                  ]}>
                    <Text style={[styles.levelPillText, { color: unlocked ? color : '#666' }]}>
                      {room.jlptLevel}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.cardTitle, !unlocked && styles.dimmed]}>{room.title}</Text>
                <Text style={[styles.cardJp, { color: unlocked ? color : '#555' }]}>
                  {room.titleJp?.replace(/\{([^|{}]+)\|[^|{}]+\}/g, '$1')}
                </Text>

                {completed && (
                  <Text style={styles.completedBadge}>✓ Memória recuperada</Text>
                )}
                {!unlocked && (
                  <Text style={styles.lockedBadge}>
                    🔒 Requer JLPT {room.jlptLevel}
                  </Text>
                )}
                {unlocked && !completed && !isStub && (
                  <Text style={[styles.availableBadge, { color }]}>
                    ▶ Jogar
                  </Text>
                )}
                {isStub && (
                  <Text style={styles.stubBadge}>Em breve</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a12' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
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
  backBtnText: { color: '#c8a96e', fontSize: 22 },
  headerCenter: { flex: 1 },
  title:    { color: '#ffd700', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  subtitle: { color: '#8a7355', fontSize: 12, marginTop: 2 },

  intro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    margin: 16,
    backgroundColor: '#1a1208',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#c8a96e33',
    gap: 12,
  },
  introIcon: { fontSize: 32 },
  introText: { flex: 1, color: '#c8b890', fontSize: 13, lineHeight: 20, fontStyle: 'italic' },

  scroll:        { flex: 1, minHeight: 0 },
  scrollContent: { padding: 16, paddingBottom: 40, gap: 12 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#0f1628',
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  cardLocked:  { opacity: 0.6 },
  cardAccent:  { width: 5, alignSelf: 'stretch' },
  cardBody:    { flex: 1, padding: 14 },
  cardHeader:  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardIcon:    { fontSize: 28 },
  levelPill:   {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10, borderWidth: 1,
  },
  levelPillText: { fontSize: 11, fontWeight: 'bold' },
  cardTitle:   { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardJp:      { fontSize: 13, fontStyle: 'italic', marginTop: 2 },

  completedBadge: { color: '#4caf50', fontSize: 12, fontWeight: 'bold', marginTop: 8 },
  lockedBadge:    { color: '#666', fontSize: 12, marginTop: 8 },
  availableBadge: { fontSize: 13, fontWeight: 'bold', marginTop: 8 },
  stubBadge:      { color: '#ff9800', fontSize: 12, marginTop: 8, fontStyle: 'italic' },

  dimmed: { color: '#555' },
});
