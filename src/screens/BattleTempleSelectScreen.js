import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { JLPT_BATTLE_LEVELS } from '../utils/jlptLevels';

const LEVEL_COLOR = {
  N5: '#4caf50', N4: '#2196f3', N3: '#9c27b0',
  N2: '#ff9800', N1: '#f44336',
};

export default function BattleTempleSelectScreen({ navigation }) {
  const { jlptLevel } = usePlayer();

  // Níveis aprendidos até o momento: N5 até o nível atual do jogador
  const levelsUpToCurrent = () => {
    const idx = JLPT_BATTLE_LEVELS.indexOf(jlptLevel);
    if (idx < 0) return ['N5']; // Iniciante → só N5
    return JLPT_BATTLE_LEVELS.slice(0, idx + 1);
  };

  const handleSelect = (mode, value) => {
    if (mode === 'single') {
      navigation.replace('Battle', { jlptLevel: value, fromTemple: true });
    } else {
      navigation.replace('Battle', { jlptLevels: value, fromTemple: true });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⚔ Batalha de Kanjis</Text>
        <Text style={styles.subtitle}>Escolha o nível para praticar</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Modo: Todos até meu nível */}
        <View style={[styles.section, { borderLeftColor: '#ffd700' }]}>
          <Text style={[styles.sectionTitle, { color: '#ffd700' }]}>📚 Todos até meu nível</Text>
          <TouchableOpacity
            style={[styles.card, { borderColor: '#ffd700' }]}
            onPress={() => handleSelect('multi', levelsUpToCurrent())}
          >
            <Text style={styles.cardLabel}>
              Kanjis de {levelsUpToCurrent().join(' + ')}
            </Text>
            <Text style={styles.cardDesc}>
              Seu nível: {jlptLevel} — mistura de todos os kanjis aprendidos até agora
            </Text>
          </TouchableOpacity>
        </View>

        {/* Níveis individuais — apenas os que o jogador já desbloqueou */}
        <View style={[styles.section, { borderLeftColor: '#ef9a9a' }]}>
          <Text style={[styles.sectionTitle, { color: '#ef9a9a' }]}>🎯 Nível específico</Text>
          {levelsUpToCurrent().map(lvl => (
            <TouchableOpacity
              key={lvl}
              style={[styles.card, { borderColor: LEVEL_COLOR[lvl] }]}
              onPress={() => handleSelect('single', lvl)}
            >
              <Text style={[styles.cardLabel, { color: LEVEL_COLOR[lvl] }]}>Nível {lvl}</Text>
              <Text style={styles.cardDesc}>Apenas kanjis do {lvl}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1e' },
  header: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#0a0a1e',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a3a',
  },
  backBtn: { marginBottom: 8 },
  backBtnText: { color: '#90caf9', fontSize: 14 },
  title: { color: '#ffd700', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  subtitle: { color: '#888', fontSize: 13, marginTop: 2 },
  scroll: { flex: 1, padding: 16, paddingBottom: 32 },
  section: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: '#0f1f40',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { color: '#888', fontSize: 12 },
});
