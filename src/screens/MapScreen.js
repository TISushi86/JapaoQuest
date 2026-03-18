import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ImageBackground,
  TouchableOpacity, Dimensions, Animated,
  StatusBar, Alert,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { JLPT_ORDER } from '../utils/jlptLevels';

const { width: W, height: H } = Dimensions.get('window');

/** Região acessível se requiredLevel for null ou se o jogador tiver nível >= requiredLevel. DevMode ignora restrições. */
function canAccessRegion(region, jlptLevel, devMode) {
  if (devMode) return true;
  if (!region.requiredLevel) return true;
  const playerIdx = JLPT_ORDER.indexOf(jlptLevel);
  const reqIdx = JLPT_ORDER.indexOf(region.requiredLevel);
  return playerIdx >= 0 && reqIdx >= 0 && playerIdx >= reqIdx;
}

// ─── Dados das Regiões ────────────────────────────────────────────────────────
const REGIONS = [
  {
    id: 'temple',
    requiredLevel: null,   // sempre acessível
    name: 'Templo de Eimei',
    subtitle: 'Dojo do Mestre',
    description: 'O templo sagrado onde Eimei treina guerreiros. Aqui você revisa todas as lições aprendidas e pratica os mini-games desbloqueados.',
    level: null,
    levelLabel: 'Templo',
    icon: '⛩️',
    color: '#c8a96e',
    accentColor: '#ffd700',
    x: 0.42,
    y: 0.22,
    isTemple: true,   // navega para EimeiTempleScreen em vez de batalha
  },
  {
    id: 'beginner',
    requiredLevel: 'Iniciante',
    isBeginner: true,   // sem batalha de kanjis — apenas lições
    name: 'Aldeia dos Aprendizes',
    subtitle: 'Conhecimentos Básicos',
    description: 'Uma aldeia acolhedora nos arredores do templo. Aqui os iniciantes aprendem as primeiras palavras antes de partirem para a grande jornada.',
    level: 'N5',
    levelLabel: 'Básico',
    icon: '🌱',
    color: '#78909c',
    accentColor: '#b0bec5',
    x: 0.62,
    y: 0.20,
  },
  {
    id: 'n5',
    requiredLevel: 'N5',
    name: 'Vila Kakurega',
    subtitle: 'Ruínas da Memória',
    description: 'O que restou da vila natal de Ryuu após o ataque de Kurokami. Fantasmas do passado aguardam.',
    level: 'N5',
    levelLabel: 'N5',
    icon: '🏘️',
    color: '#4caf50',
    accentColor: '#81c784',
    x: 0.68,
    y: 0.32,
  },
  {
    id: 'n4',
    requiredLevel: 'N4',
    name: 'Cidade do Porto',
    subtitle: 'Além das Montanhas',
    description: 'Uma cidade portuária movimentada no leste de Honshu. Comerciantes e mercenários por toda parte.',
    level: 'N4',
    levelLabel: 'N4',
    icon: '⚓',
    color: '#2196f3',
    accentColor: '#64b5f6',
    x: 0.62,
    y: 0.46,
  },
  {
    id: 'n3',
    requiredLevel: 'N3',
    name: 'Capital Imperial',
    subtitle: 'A Cidade Antiga',
    description: 'A gloriosa capital imperial, lar de nobres e guerreiros. O coração cultural do Japão feudal.',
    level: 'N3',
    levelLabel: 'N3',
    icon: '🏯',
    color: '#9c27b0',
    accentColor: '#ba68c8',
    x: 0.44,
    y: 0.57,
  },
  {
    id: 'n2',
    requiredLevel: 'N2',
    name: 'Fortaleza do Sul',
    subtitle: 'Terra dos Guerreiros',
    description: 'A terra dos samurais mais ferozes do Japão. Apenas os mais habilidosos sobrevivem aqui.',
    level: 'N2',
    levelLabel: 'N2',
    icon: '⚔️',
    color: '#ff9800',
    accentColor: '#ffb74d',
    x: 0.27,
    y: 0.70,
  },
  {
    id: 'n1',
    requiredLevel: 'N1',
    name: 'Castelo de Kurokami',
    subtitle: 'O Desafio Final',
    description: 'A fortaleza sombria onde Kurokami prende a família de Ryuu. O teste final — N1 — aguarda aqui.',
    level: 'N1',
    levelLabel: 'N1',
    icon: '👹',
    color: '#f44336',
    accentColor: '#ef5350',
    x: 0.42,
    y: 0.87,
    isKurokami: true,
  },
];

// Conexões entre regiões (pares de ids) — progressão norte→sul
const CONNECTIONS = [
  ['temple',   'beginner'],
  ['beginner', 'n5'],
  ['n5',       'n4'],
  ['n4',       'n3'],
  ['n3',       'n2'],
  ['n2',       'n1'],
];

// ─── Helper: linha entre dois nós ─────────────────────────────────────────────
const MapLine = ({ from, to, active, mapH }) => {
  const fx = from.x * W;
  const fy = from.y * mapH;
  const tx = to.x * W;
  const ty = to.y * mapH;

  const dx     = tx - fx;
  const dy     = ty - fy;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle  = Math.atan2(dy, dx) * 180 / Math.PI;
  const midX   = (fx + tx) / 2;
  const midY   = (fy + ty) / 2;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: midX - length / 2,
        top: midY - 1,
        width: length,
        height: 2,
        borderRadius: 1,
        backgroundColor: active ? '#ffd70055' : '#ffffff18',
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
};

// ─── Nó de Região ─────────────────────────────────────────────────────────────
const RegionNode = ({ region, selected, isLocked, onPress, mapH }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (region.isKurokami && !isLocked) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isLocked]);

  const nodeX = region.x * W - 28;
  const nodeY = region.y * mapH - 28;

  return (
    <TouchableOpacity
      style={[styles.nodeWrapper, { left: nodeX, top: nodeY }, isLocked && styles.nodeLocked]}
      onPress={() => onPress(region)}
      activeOpacity={0.8}
    >
      {/* Anel de seleção */}
      {selected && !isLocked && (
        <View style={[styles.nodeRing, { borderColor: region.accentColor }]} />
      )}

      {/* Anel de pulso para Kurokami */}
      {region.isKurokami && !isLocked && (
        <Animated.View
          style={[
            styles.kurokamiPulse,
            { borderColor: region.color, transform: [{ scale: pulseAnim }] },
          ]}
        />
      )}

      {/* Círculo principal */}
      <View style={[
        styles.nodeCircle,
        { backgroundColor: region.isKurokami ? '#1a0000' : '#0d1a2e', borderColor: isLocked ? '#444' : region.color },
        selected && !isLocked && { backgroundColor: region.color + '33' },
      ]}>
        <Text style={[styles.nodeIcon, isLocked && styles.nodeIconLocked]}>{region.icon}</Text>
        {isLocked && (
          <View style={styles.nodeLockOverlay}>
            <Text style={styles.nodeLockBadge}>🔒</Text>
          </View>
        )}
      </View>

      {/* Label */}
      <View style={[styles.nodeLabelBox, { backgroundColor: (isLocked ? '#333' : region.color) + 'cc' }]}>
        <Text style={[styles.nodeLabelLevel, isLocked && styles.nodeLabelLocked]}>{region.levelLabel}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Painel de Região (slide-up) ──────────────────────────────────────────────
const RegionPanel = ({ region, onBattle, onLessons, onTemple, onClose }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }).start();
  }, [region]);

  return (
    <Animated.View
      style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}
    >
      {/* Cabeçalho da região */}
      <View style={[styles.panelHeader, { borderColor: region.color }]}>
        <Text style={styles.panelIcon}>{region.icon}</Text>
        <View style={styles.panelTitleArea}>
          <View style={[styles.panelLevelBadge, { backgroundColor: region.color }]}>
            <Text style={styles.panelLevelText}>{region.levelLabel}</Text>
          </View>
          <Text style={styles.panelName}>{region.name}</Text>
          <Text style={styles.panelSubtitle}>{region.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.panelClose} onPress={onClose}>
          <Text style={styles.panelCloseText}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.panelDesc}>{region.description}</Text>

      {/* Botões de ação */}
      <View style={styles.panelActions}>
        {region.isTemple ? (
          /* Templo de Eimei → tela especial do templo */
          <TouchableOpacity
            style={[styles.panelBtn, styles.panelBtnTemple, { borderColor: region.color }]}
            onPress={onTemple}
          >
            <Text style={styles.panelBtnIcon}>⛩️</Text>
            <Text style={styles.panelBtnText}>Entrar no Templo</Text>
            <Text style={styles.panelBtnSub}>Revisar e treinar</Text>
          </TouchableOpacity>
        ) : (
          <>
            {region.level && !region.isBeginner && (
              <TouchableOpacity
                style={[styles.panelBtn, styles.panelBtnBattle, { borderColor: region.color }]}
                onPress={onBattle}
              >
                <Text style={styles.panelBtnIcon}>⚔</Text>
                <Text style={styles.panelBtnText}>Batalhar</Text>
                <Text style={styles.panelBtnSub}>Nível {region.levelLabel}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.panelBtn, styles.panelBtnLesson]}
              onPress={onLessons}
            >
              <Text style={styles.panelBtnIcon}>📚</Text>
              <Text style={styles.panelBtnText}>Lições</Text>
              <Text style={styles.panelBtnSub}>Dojo do Sensei</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );
};

// ─── MapScreen ────────────────────────────────────────────────────────────────
export default function MapScreen({ navigation }) {
  const { hp, maxHp, xp, xpPercent, rank, jlptLevel, gender, saveProgress, devMode } = usePlayer();
  const [selectedRegion, setSelectedRegion] = useState(null);
  // Altura real da área do mapa (abaixo do HUD), medida via onLayout
  const [mapHeight, setMapHeight] = useState(H * 0.85);

  // Salva lastScreen ao entrar no mapa
  useEffect(() => {
    saveProgress({ lastScreen: 'Map' });
  }, []);

  const handleNodePress = (region) => {
    const locked = !canAccessRegion(region, jlptLevel, devMode);
    if (locked) {
      Alert.alert(
        'Região Bloqueada',
        `Complete o nível ${region.requiredLevel} para desbloquear ${region.name}.`,
        [{ text: 'Entendi' }]
      );
      return;
    }
    if (selectedRegion?.id === region.id) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(region);
    }
  };

  const handleBattle = () => {
    if (!selectedRegion?.level) return;
    navigation.navigate('Battle', { jlptLevel: selectedRegion.level });
    setSelectedRegion(null);
  };

  const handleLessons = () => {
    navigation.navigate('LessonsList', { region: selectedRegion });
    setSelectedRegion(null);
  };

  const handleTemple = () => {
    navigation.navigate('EimeiTemple');
    setSelectedRegion(null);
  };

  // Corações de HP
  const hearts = Array.from({ length: maxHp }, (_, i) => i < hp ? '♥' : '♡');

  // Mapeia ids para regiões para os paths
  const regionById = Object.fromEntries(REGIONS.map(r => [r.id, r]));

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* ── HUD Superior — fora do mapa, no fluxo normal ─────────── */}
      <View style={styles.hud}>
        <View style={styles.hudLeft}>
          <Text style={styles.hudTitle}>⛩  Japão Quest</Text>
          <Text style={styles.hudRank}>{rank}</Text>
          <Text style={styles.hudJlpt}>JLPT: {jlptLevel}</Text>
        </View>
        <View style={styles.hudRight}>
          <Text style={styles.hudHearts}>{hearts.join(' ')}</Text>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
          </View>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
      </View>

      {/* ── Área do mapa — abaixo do HUD ─────────────────────────── */}
      <View
        style={styles.mapArea}
        onLayout={e => setMapHeight(e.nativeEvent.layout.height)}
      >
        <ImageBackground
          source={require('../assets/japan_map_portrait.png')}
          style={styles.mapBg}
          resizeMode="cover"
        >
          {/* Overlay escuro leve */}
          <View style={styles.mapOverlay} pointerEvents="none" />

          {/* ── Conexões entre regiões ───────────────────────────── */}
          {CONNECTIONS.map(([a, b]) => (
            <MapLine
              key={`${a}-${b}`}
              from={regionById[a]}
              to={regionById[b]}
              active={selectedRegion?.id === a || selectedRegion?.id === b}
              mapH={mapHeight}
            />
          ))}

          {/* ── Nós das Regiões ──────────────────────────────────── */}
          {REGIONS.map(region => (
            <RegionNode
              key={region.id}
              region={region}
              selected={selectedRegion?.id === region.id}
              isLocked={!canAccessRegion(region, jlptLevel, devMode)}
              onPress={handleNodePress}
              mapH={mapHeight}
            />
          ))}

          {/* Título decorativo do mapa */}
          <View style={styles.mapTitle} pointerEvents="none">
            <Text style={styles.mapTitleText}>地図  ·  Mapa do Japão</Text>
          </View>
        </ImageBackground>

        {/* ── Painel de Região Selecionada ─────────────────────────── */}
        {selectedRegion && (
          <RegionPanel
            region={selectedRegion}
            onBattle={handleBattle}
            onLessons={handleLessons}
            onTemple={handleTemple}
            onClose={() => setSelectedRegion(null)}
          />
        )}

        {/* Dica quando nada está selecionado */}
        {!selectedRegion && (
          <View style={styles.hint} pointerEvents="none">
            <Text style={styles.hintText}>Toque em uma região para explorar</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020a14' },
  mapArea:   { flex: 1 },
  mapBg:     { flex: 1, width: W },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // ── HUD — no fluxo normal (não é absolute)
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: '#ffd70033',
  },
  hudLeft:  { flex: 1 },
  hudTitle: { color: '#ffd700', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
  hudRank:  { color: '#aaa', fontSize: 12, marginTop: 2 },
  hudJlpt:  { color: '#78909c', fontSize: 11, marginTop: 1 },
  hudRight: { alignItems: 'flex-end' },
  hudHearts: { color: '#f44336', fontSize: 16, letterSpacing: 4, marginBottom: 4 },
  xpTrack: {
    width: 110, height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 2,
  },
  xpFill: { height: '100%', backgroundColor: '#ffd700', borderRadius: 3 },
  xpText: { color: '#888', fontSize: 10 },

  // ── Título do mapa
  mapTitle: {
    position: 'absolute',
    bottom: 90,
    left: 0, right: 0,
    alignItems: 'center',
  },
  mapTitleText: {
    color: '#ffffff22',
    fontSize: 11,
    letterSpacing: 2,
  },

  // ── Nós
  nodeWrapper: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
  },
  kurokamiPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
  },
  nodeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  nodeIcon: { fontSize: 20 },
  nodeLocked: { opacity: 0.85 },
  nodeIconLocked: { opacity: 0.5 },
  nodeLockOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  nodeLockBadge: { fontSize: 18 },
  nodeLabelLocked: { color: '#888' },
  nodeLabelBox: {
    position: 'absolute',
    bottom: -10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    minWidth: 30,
    alignItems: 'center',
  },
  nodeLabelLevel: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  // ── Painel slide-up
  panel: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(5,12,24,0.97)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: '#ffd70033',
    padding: 20,
    paddingBottom: 32,
    elevation: 12,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 12,
  },
  panelIcon:      { fontSize: 32, marginRight: 12 },
  panelTitleArea: { flex: 1 },
  panelLevelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  panelLevelText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  panelName:      { color: '#fff', fontSize: 20, fontWeight: 'bold', lineHeight: 24 },
  panelSubtitle:  { color: '#aaa', fontSize: 13, marginTop: 2 },
  panelClose: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    width: 28, height: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  panelCloseText: { color: '#aaa', fontSize: 12, fontWeight: 'bold' },
  panelDesc: {
    color: '#9e9e9e',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },

  panelActions: {
    flexDirection: 'row',
    gap: 12,
  },
  panelBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  panelBtnBattle: {
    backgroundColor: '#8b000022',
    borderColor: '#8b0000',
  },
  panelBtnLesson: {
    backgroundColor: '#1565c022',
    borderColor: '#1565c0',
  },
  panelBtnTemple: {
    backgroundColor: '#3e2a0022',
    borderColor: '#c8a96e',
    flex: 1,
  },
  panelBtnIcon: { fontSize: 22, marginBottom: 4 },
  panelBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  panelBtnSub:  { color: '#888', fontSize: 11, marginTop: 2 },

  // ── Dica
  hint: {
    position: 'absolute',
    bottom: 24,
    left: 0, right: 0,
    alignItems: 'center',
  },
  hintText: {
    color: '#ffffff44',
    fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
});
