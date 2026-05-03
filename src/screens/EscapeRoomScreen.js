import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, StatusBar, ScrollView, Animated, Modal, Alert,
} from 'react-native';
import { getRoomById } from '../data/escapeRooms';
import { usePlayer } from '../context/PlayerContext';
import FuriganaText from '../components/FuriganaText';
import Hotspot from '../components/Hotspot';
import InventoryBar from '../components/InventoryBar';
import PuzzleModal from '../components/PuzzleModal';
import MemoryReveal from '../components/MemoryReveal';
import RankUpModal from '../components/RankUpModal';

const { width: SW, height: SH } = Dimensions.get('window');
const MAX_HP = 3;
const MAX_HINTS = 3;

/**
 * Motor da Câmara da Memória (escape room).
 *
 * Fluxo de fases:
 *  'intro'   – mostra texto de abertura da sala
 *  'playing' – sala interativa (hotspots)
 *  'memory'  – mostra MemoryReveal ao vencer
 *  'defeat'  – HP zerado, tela de fim
 */
export default function EscapeRoomScreen({ navigation, route }) {
  const roomId = route.params?.roomId;
  const fromStory = route.params?.fromStory === true;
  const room = useMemo(() => getRoomById(roomId), [roomId]);

  const { gainXP, completeEscapeRoom, devMode } = usePlayer();

  const [phase,   setPhase]   = useState('intro');   // intro | playing | memory | defeat
  const [hp,      setHp]      = useState(MAX_HP);
  const [hints,   setHints]   = useState(MAX_HINTS);
  const [solved,  setSolved]  = useState([]);        // ids de hotspots resolvidos
  const [unlocked, setUnlocked] = useState([]);      // ids de hotspots destravados dinamicamente
  const [inventory, setInventory] = useState([]);    // [{ id, emoji, label }, ...]
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [showHint,   setShowHint]   = useState(false);
  const [hintText,   setHintText]   = useState('');
  const [rankUpModal, setRankUpModal] = useState(null);
  const [mapAreaH, setMapAreaH] = useState(SH * 0.7);

  // Se sala não encontrada
  if (!room) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Sala não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Sala com stub (N4-N1 ainda não implementadas)
  if (room.stub) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.stubIcon}>{room.icon}</Text>
        <Text style={[styles.stubTitle, { color: room.accentColor }]}>{room.title}</Text>
        <Text style={styles.stubText}>{room.intro}</Text>
        <TouchableOpacity style={[styles.backBtn, { borderColor: room.accentColor }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Voltar ao templo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const accent = room.accentColor || '#ffd700';

  // Hotspots inicialmente destravados: aqueles sem flag `locked` ou sem requires
  const initiallyUnlocked = useMemo(
    () => room.hotspots.filter(h => !h.locked).map(h => h.id),
    [room]
  );

  useEffect(() => {
    setUnlocked(initiallyUnlocked);
  }, [initiallyUnlocked]);

  // ── Computa estado visual de um hotspot ─────────────────────────────────
  const getState = (h) => {
    if (solved.includes(h.id)) return 'solved';
    if (!unlocked.includes(h.id)) return 'locked';
    // Tem requires? Se não atende, mostra locked
    if (h.requires && h.requires.length > 0) {
      const hasAll = h.requires.every(req => inventory.find(i => i.id === req));
      if (!hasAll) return 'locked';
    }
    return 'available';
  };

  // ── Clique num hotspot ──────────────────────────────────────────────────
  const handleHotspotPress = (h) => {
    const state = getState(h);
    if (state === 'solved') return;
    if (state === 'locked') {
      const msg = h.requiresMessage || 'Este lugar ainda está selado. Procure algo que possa abri-lo.';
      Alert.alert('🔒 Bloqueado', msg);
      return;
    }
    // Porta de saída: testa condição de vitória antes de "resolver"
    if (h.isExit) {
      // Já destravada por requires — considera vitória
      handleExit(h);
      return;
    }
    setActiveHotspot(h);
    // Se tem texto de descoberta, o modal de reveals é exibido primeiro
    // (e a partir dele o jogador abre o puzzle). Se não tem reveals:
    //  - com puzzle: abre direto
    //  - sem puzzle: resolve imediatamente (item automático)
    if (!h.reveals) {
      if (h.puzzle) setShowPuzzle(true);
      else handleSolved(h, { skipPuzzle: true });
    }
  };

  // ── Jogador resolveu o enigma ───────────────────────────────────────────
  const handlePuzzleSolved = () => {
    setShowPuzzle(false);
    if (activeHotspot) handleSolved(activeHotspot);
  };

  const handlePuzzleFailed = () => {
    setShowPuzzle(false);
    if (devMode) return;
    const newHp = hp - 1;
    setHp(newHp);
    if (newHp <= 0) setPhase('defeat');
  };

  const handleSolved = (h, { skipPuzzle } = {}) => {
    // Marca como resolvido
    setSolved(prev => prev.includes(h.id) ? prev : [...prev, h.id]);

    // Adiciona itens ao inventário
    if (h.rewardItems?.length) {
      setInventory(prev => {
        const existing = new Set(prev.map(i => i.id));
        const toAdd = h.rewardItems.filter(ri => !existing.has(ri.id));
        return [...prev, ...toAdd];
      });
    }

    // Destrava outros hotspots
    if (h.unlockHotspots?.length) {
      setUnlocked(prev => {
        const set = new Set(prev);
        h.unlockHotspots.forEach(id => set.add(id));
        return [...set];
      });
    }

    setActiveHotspot(null);
  };

  // ── Porta de saída — vitória ────────────────────────────────────────────
  const handleExit = (door) => {
    // Itens necessários já checados em getState. Se chegou aqui, abriu.
    setSolved(prev => prev.includes(door.id) ? prev : [...prev, door.id]);
    setShowReveal(true);
  };

  // ── Fim da cena de memória ──────────────────────────────────────────────
  const handleMemoryFinish = () => {
    completeEscapeRoom(room.id);
    const xpReward = room.memory?.xpReward ?? 100;
    gainXP(xpReward, (newRank) => {
      if (newRank) setRankUpModal(newRank);
      else navigation.goBack();
    });
    setShowReveal(false);
    setPhase('memory'); // fica em tela de agradecimento até onDismiss
  };

  const handleRankUpDismiss = () => {
    setRankUpModal(null);
    navigation.goBack();
  };

  // ── Dica do Eimei ───────────────────────────────────────────────────────
  const useHint = () => {
    if (hints <= 0) {
      Alert.alert('Sem dicas', 'Eimei já revelou todos os segredos que podia.');
      return;
    }
    // Encontra primeiro hotspot não-resolvido disponível para dar dica
    const next = room.hotspots.find(h => !solved.includes(h.id) && getState(h) === 'available');
    const locked = room.hotspots.find(h => !solved.includes(h.id) && getState(h) === 'locked');

    let text = 'Tudo que você precisa está ao seu redor. Observe bem.';
    if (next) {
      text = `Observe "${next.labelPt}". ${next.puzzle?.hintPt || next.reveals?.split('\n')[0] || 'Talvez haja um enigma ali.'}`;
    } else if (locked) {
      text = `A porta ou outro elemento aguarda um item. Tente combinar o que já coletou.`;
    }
    setHintText(text);
    setShowHint(true);
    setHints(h => h - 1);
  };

  // ── Fugir da sala ───────────────────────────────────────────────────────
  const handleFlee = () => {
    Alert.alert(
      'Recuar da câmara',
      'Você sairá sem recuperar a memória. Progresso desta sala será perdido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Recuar',   style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  // ─── Renderização por fase ──────────────────────────────────────────────

  // ── Intro: texto de abertura ────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.container, styles.centered, { borderColor: accent + '33' }]}
        onPress={() => setPhase('playing')}
      >
        <StatusBar hidden />
        <Text style={styles.introIcon}>{room.icon}</Text>
        <FuriganaText
          text={room.titleJp}
          fontSize={32}
          color={accent}
          furiganaColor={accent + 'aa'}
          style={{ justifyContent: 'center', marginBottom: 6 }}
        />
        <Text style={[styles.introTitle, { color: accent }]}>{room.title}</Text>
        <Text style={styles.introLevel}>JLPT {room.jlptLevel}</Text>
        <View style={[styles.introBox, { borderColor: accent + '44' }]}>
          <Text style={styles.introText}>{room.intro}</Text>
        </View>
        <Text style={[styles.tapHint, { color: accent }]}>▶  Tocar para entrar</Text>
      </TouchableOpacity>
    );
  }

  // ── Defeat ──────────────────────────────────────────────────────────────
  if (phase === 'defeat') {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar hidden />
        <Text style={styles.defeatIcon}>💫</Text>
        <Text style={styles.defeatTitle}>A névoa consumiu sua memória...</Text>
        <Text style={styles.defeatSub}>
          Você errou demais. O fragmento de memória escapou novamente.
          Volte ao templo para descansar e tente outra vez.
        </Text>
        <TouchableOpacity
          style={[styles.defeatBtn, { borderColor: accent }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.defeatBtnText}>↩  Recuar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Memory (aguardando MemoryReveal ou rank up) ─────────────────────────
  if (phase === 'memory' && !showReveal && !rankUpModal) {
    // Saiu direto (rare fallback)
    navigation.goBack();
    return null;
  }

  // ── Playing: cenário ────────────────────────────────────────────────────
  const solvedCount = solved.filter(id => id !== 'hs-porta').length; // porta não conta
  const totalPuzzles = room.hotspots.filter(h => !h.isExit).length;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* ── HUD Superior ───────────────────────────────────────────────── */}
      <View style={[styles.hud, { borderBottomColor: accent + '44' }]}>
        <View style={styles.hudLeft}>
          <Text style={styles.hudHearts}>
            {'♥ '.repeat(hp).trim() + ' ♡'.repeat(MAX_HP - hp)}
          </Text>
        </View>
        <View style={styles.hudCenter}>
          <Text style={styles.hudIcon}>{room.icon}</Text>
          <View>
            <Text style={[styles.hudTitle, { color: accent }]} numberOfLines={1}>
              {room.title}
            </Text>
            <Text style={styles.hudSub}>JLPT {room.jlptLevel}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.hintBtn} onPress={useHint}>
          <Text style={styles.hintBtnIcon}>💡</Text>
          <Text style={[styles.hintBtnText, { color: accent }]}>{hints}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Área da sala (hotspots) ───────────────────────────────────── */}
      <View
        style={styles.mapArea}
        onLayout={e => setMapAreaH(e.nativeEvent.layout.height)}
      >
        {/* Linhas conectoras entre hotspots com dependência (unlockHotspots) */}
        {room.hotspots.map((from) => {
          if (!from.unlockHotspots?.length) return null;
          return from.unlockHotspots.map(toId => {
            const to = room.hotspots.find(h => h.id === toId);
            if (!to) return null;
            const fx = from.x * SW;
            const fy = from.y * mapAreaH;
            const tx = to.x * SW;
            const ty = to.y * mapAreaH;
            const dx = tx - fx;
            const dy = ty - fy;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ang = Math.atan2(dy, dx) * 180 / Math.PI;
            const isFromSolved = solved.includes(from.id);
            return (
              <View
                key={`line-${from.id}-${toId}`}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: (fx + tx) / 2 - len / 2,
                  top: (fy + ty) / 2 - 0.5,
                  width: len,
                  height: 1.5,
                  backgroundColor: isFromSolved ? accent + '66' : accent + '15',
                  transform: [{ rotate: `${ang}deg` }],
                }}
              />
            );
          });
        })}

        {room.hotspots.map(h => (
          <Hotspot
            key={h.id}
            hotspot={h}
            x={h.x * SW}
            y={h.y * mapAreaH}
            state={getState(h)}
            accentColor={accent}
            onPress={handleHotspotPress}
          />
        ))}
      </View>

      {/* ── Botão de fuga ──────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.fleeBtn} onPress={handleFlee}>
        <Text style={styles.fleeBtnText}>Recuar</Text>
      </TouchableOpacity>

      {/* ── Inventário e contador ─────────────────────────────────────── */}
      <InventoryBar
        items={inventory}
        accentColor={accent}
        puzzleCount={`${solvedCount}/${totalPuzzles}`}
        onItemPress={(item) => Alert.alert(item.label, `Item coletado: ${item.emoji} ${item.label}`)}
      />

      {/* ── Modal de pista/reveal antes do puzzle ─────────────────────── */}
      {activeHotspot && !showPuzzle && !showReveal && activeHotspot.reveals && !solved.includes(activeHotspot.id) ? (
        <Modal transparent visible animationType="fade" onRequestClose={() => setActiveHotspot(null)}>
          <View style={styles.overlay}>
            <View style={[styles.card, { borderColor: accent }]}>
              <Text style={[styles.cardTitle, { color: accent }]}>
                {activeHotspot.emoji} {activeHotspot.labelPt}
              </Text>
              <ScrollView style={{ maxHeight: 240 }}>
                <FuriganaText
                  text={activeHotspot.reveals}
                  fontSize={14}
                  color="#e8e8e8"
                  furiganaColor="#90caf9"
                  style={{ justifyContent: 'flex-start' }}
                />
              </ScrollView>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.cardBtn, styles.cardBtnSecondary]}
                  onPress={() => setActiveHotspot(null)}
                >
                  <Text style={styles.cardBtnText}>Fechar</Text>
                </TouchableOpacity>
                {activeHotspot.puzzle ? (
                  <TouchableOpacity
                    style={[styles.cardBtn, { backgroundColor: accent + '33', borderColor: accent }]}
                    onPress={() => setShowPuzzle(true)}
                  >
                    <Text style={styles.cardBtnText}>Investigar →</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.cardBtn, { backgroundColor: accent + '33', borderColor: accent }]}
                    onPress={() => handleSolved(activeHotspot, { skipPuzzle: true })}
                  >
                    <Text style={styles.cardBtnText}>Ok</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      {/* ── Modal do enigma ───────────────────────────────────────────── */}
      <PuzzleModal
        visible={showPuzzle}
        puzzle={activeHotspot?.puzzle}
        accentColor={accent}
        onSolved={handlePuzzleSolved}
        onFailed={handlePuzzleFailed}
        onClose={() => { setShowPuzzle(false); setActiveHotspot(null); }}
      />

      {/* ── Modal de dica do Eimei ────────────────────────────────────── */}
      <Modal transparent visible={showHint} animationType="fade" onRequestClose={() => setShowHint(false)}>
        <View style={styles.overlay}>
          <View style={[styles.card, { borderColor: accent }]}>
            <Text style={[styles.cardTitle, { color: accent }]}>🧙 Eimei sussurra</Text>
            <Text style={styles.hintBody}>{hintText}</Text>
            <Text style={styles.hintCost}>Dicas restantes: {hints}</Text>
            <TouchableOpacity
              style={[styles.cardBtn, { backgroundColor: accent + '33', borderColor: accent, alignSelf: 'center' }]}
              onPress={() => setShowHint(false)}
            >
              <Text style={styles.cardBtnText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Tela de memória recuperada ────────────────────────────────── */}
      {showReveal ? (
        <Modal transparent={false} visible animationType="fade">
          <MemoryReveal
            memory={room.memory}
            accentColor={accent}
            onFinish={handleMemoryFinish}
          />
        </Modal>
      ) : null}

      <RankUpModal
        visible={!!rankUpModal}
        newRank={rankUpModal}
        onDismiss={handleRankUpDismiss}
      />
    </View>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a12' },
  centered:  { justifyContent: 'center', alignItems: 'center', padding: 24, gap: 14 },
  errorText: { color: '#f44336', fontSize: 16 },
  backLink:  { color: '#ffd700', fontSize: 15, marginTop: 10 },

  // ── HUD
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44,
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderBottomWidth: 1,
    gap: 12,
  },
  hudLeft:    { flex: 1 },
  hudHearts:  { color: '#f44336', fontSize: 18, letterSpacing: 3 },
  hudCenter:  { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  hudIcon:    { fontSize: 24 },
  hudTitle:   { fontSize: 14, fontWeight: 'bold', letterSpacing: 0.5 },
  hudSub:     { color: '#888', fontSize: 11 },
  hintBtn:    {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  hintBtnIcon: { fontSize: 18 },
  hintBtnText: { fontSize: 15, fontWeight: 'bold' },

  // ── Área do mapa
  mapArea: { flex: 1, position: 'relative' },

  // ── Fuga
  fleeBtn: {
    position: 'absolute',
    top: 48,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#666',
    zIndex: 10,
  },
  fleeBtnText: { color: '#aaa', fontSize: 12 },

  // ── Intro
  introIcon:  { fontSize: 72 },
  introTitle: { fontSize: 26, fontWeight: 'bold', marginTop: 6 },
  introLevel: { color: '#888', fontSize: 13, letterSpacing: 3 },
  introBox: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    maxWidth: 380,
    marginVertical: 16,
  },
  introText:  { color: '#e8e8e8', fontSize: 15, lineHeight: 24, textAlign: 'center' },
  tapHint:    { fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },

  // ── Defeat
  defeatIcon:  { fontSize: 72 },
  defeatTitle: { color: '#f44336', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  defeatSub:   { color: '#aaa', fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: 320 },
  defeatBtn:   {
    paddingHorizontal: 30, paddingVertical: 12,
    borderRadius: 10, borderWidth: 2,
    marginTop: 16,
  },
  defeatBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // ── Stub
  stubIcon:   { fontSize: 72 },
  stubTitle:  { fontSize: 24, fontWeight: 'bold' },
  stubText:   { color: '#aaa', fontSize: 14, textAlign: 'center', maxWidth: 320, lineHeight: 22 },
  backBtn:    {
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 10, borderWidth: 2,
    marginTop: 18,
  },
  backBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  // ── Overlay / card genérico
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0f1628',
    borderRadius: 14,
    borderWidth: 2,
    padding: 18,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  cardBtn: {
    paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: '#16213e',
    borderColor: '#2a2a4a',
  },
  cardBtnSecondary: { backgroundColor: 'transparent', borderColor: '#666' },
  cardBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  // ── Hint
  hintBody:  { color: '#e8e8e8', fontSize: 14, lineHeight: 22, marginBottom: 12 },
  hintCost:  { color: '#ffab91', fontSize: 11, textAlign: 'center', marginBottom: 10, fontStyle: 'italic' },
});
