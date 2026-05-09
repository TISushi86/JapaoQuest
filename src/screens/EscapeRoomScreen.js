import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, StatusBar, ScrollView, Modal, Alert,
  ImageBackground,
} from 'react-native';
import { getRoomById } from '../data/escapeRooms';
import { usePlayer } from '../context/PlayerContext';
import FuriganaText from '../components/FuriganaText';
import Hotspot from '../components/Hotspot';
import InventoryBar from '../components/InventoryBar';
import PuzzleModal from '../components/PuzzleModal';
import MemoryReveal from '../components/MemoryReveal';
import RankUpModal from '../components/RankUpModal';
import ItemRewardModal from '../components/ItemRewardModal';

const { width: SW, height: SH } = Dimensions.get('window');
const MAX_HP = 3;
const MAX_HINTS = 3;
// Altura total rolável da cena. Bem maior que a viewport → força exploração
// por scroll, dando sensação de sala ampla. 13 hotspots cabem com folga.
const SCENE_HEIGHT = Math.max(1280, SH * 1.85);

/**
 * Motor da Câmara da Memória (escape room).
 *
 * Fases:
 *  'intro'   – texto de abertura da sala (typewriter curto)
 *  'playing' – sala interativa
 *  'memory'  – MemoryReveal ao escapar
 *  'defeat'  – HP zerado
 *
 * Mecânica central (playing):
 *  Estado local por hotspot em `unlocked` (Set de ids) e `solved` (Set).
 *  Um hotspot com `useItem` começa "locked". Para destravá-lo, o jogador:
 *    1. Seleciona um item do inventário (selectedItemId).
 *    2. Toca no hotspot alvo.
 *    3. Se o item ID bate com useItem (ou satisfaz todos se array), destrava.
 *    4. Porta de saída (isExit): ao destravar, vai direto para a memória.
 *  Um hotspot `ambientOnly` nunca gera puzzle nem item — só mostra reveals.
 *  Um hotspot normal (sem useItem) abre direto ao tocar.
 */
export default function EscapeRoomScreen({ navigation, route }) {
  const roomId = route.params?.roomId;
  const room = useMemo(() => getRoomById(roomId), [roomId]);

  const { gainXP, completeEscapeRoom, devMode } = usePlayer();

  const [phase,       setPhase]       = useState('intro');
  const [hp,          setHp]          = useState(MAX_HP);
  const [hints,       setHints]       = useState(MAX_HINTS);
  const [solved,      setSolved]      = useState([]);
  const [unlocked,    setUnlocked]    = useState([]);
  const [inventory,   setInventory]   = useState([]);
  const [selectedId,  setSelectedId]  = useState(null);

  const [toast, setToast] = useState(null);             // feedback rápido
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [rankUpModal, setRankUpModal] = useState(null);
  // Itens recém-conquistados, exibidos pelo ItemRewardModal antes de retomar
  // a sala. Enquanto não vazio, o jogador vê uma celebração proeminente.
  const [wonItems, setWonItems] = useState([]);

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

  // ─── Helpers de estado ──────────────────────────────────────────────────

  const hasItem = (id) => inventory.some(i => i.id === id);

  const itemMatches = (hotspot, itemId) => {
    if (!hotspot.useItem || !itemId) return false;
    const need = Array.isArray(hotspot.useItem) ? hotspot.useItem : [hotspot.useItem];
    return need.includes(itemId);
  };

  const allRequiredItemsInInventory = (hotspot) => {
    if (!hotspot.useItem) return true;
    const need = Array.isArray(hotspot.useItem) ? hotspot.useItem : [hotspot.useItem];
    return need.every(id => hasItem(id));
  };

  const hotspotState = (h) => {
    if (solved.includes(h.id)) return 'solved';
    if (h.isExit)              return 'exit';
    if (!h.useItem)            return 'idle';
    if (unlocked.includes(h.id)) return 'idle';
    return 'locked';
  };

  // Toast efêmero no topo da sala
  const showToast = (text, tone = 'info') => {
    setToast({ text, tone });
    setTimeout(() => setToast(null), 2600);
  };

  // ─── Clique num hotspot ─────────────────────────────────────────────────
  const handleHotspotPress = (h) => {
    const state = hotspotState(h);

    // Cenário 1: jogador tem item selecionado e clica num hotspot
    if (selectedId) {
      // Feedback neutro para qualquer tentativa falha. Não revela POR QUE
      // falhou (se é objeto decorativo, se é item errado, se é item parcial).
      // O jogador precisa deduzir.
      const failNeutro = () => {
        showToast('Nada acontece.', 'wrong');
        setSelectedId(null);
      };

      if (state === 'solved' || (h.useItem && unlocked.includes(h.id))) {
        // Sem distinção visual de "já explorado", este feedback substitui.
        showToast('Nada acontece.', 'wrong');
        setSelectedId(null);
        return;
      }
      if (h.ambientOnly || !h.useItem) return failNeutro();

      // Item correto + todos os requisitos satisfeitos?
      if (itemMatches(h, selectedId) && allRequiredItemsInInventory(h)) {
        // Destrava!
        setUnlocked(prev => prev.includes(h.id) ? prev : [...prev, h.id]);
        setSelectedId(null);
        // Se é exit, ao destravar dispara a saída direto
        if (h.isExit) {
          setSolved(prev => prev.includes(h.id) ? prev : [...prev, h.id]);
          setActiveHotspot(h);
          setShowReveal(true);
          return;
        }
        // Senão: abre reveals/success/puzzle.
        // Regra: se tem texto (reveals OU useItemSuccess), mostra o modal com
        // esse texto primeiro; só depois o jogador toca em "Investigar" para ir
        // ao puzzle. Assim o texto de destrancar (que pode conter a pista do
        // puzzle, como as direções da janela) nunca é pulado.
        setActiveHotspot({ ...h, _justUnlocked: true });
        if (!h.reveals && !h.useItemSuccess && h.puzzle) {
          setShowPuzzle(true);
        }
        return;
      }

      // Item incorreto OU faltam outros itens (caso multi-item)
      return failNeutro();
    }

    // Cenário 2: clique sem item selecionado

    // Hotspot já resolvido → reabre o modal com a pista/texto (útil para reler
    // direções da janela, kazoku da lareira, etc., já que não há mais "✓"
    // indicando visualmente que o objeto foi concluído).
    if (state === 'solved') {
      if (h.reveals || h.useItemSuccess) {
        setActiveHotspot({ ...h, _justUnlocked: !!h.useItemSuccess, _revisit: true });
      } else {
        showToast('Nada acontece.', 'wrong');
      }
      return;
    }

    // Hotspot que ainda precisa ser destravado (inclui porta final):
    // mostra o modal teaser com a descrição neutra.
    if (h.useItem && !unlocked.includes(h.id)) {
      setActiveHotspot({ ...h, _lockedTeaser: true });
      return;
    }

    setActiveHotspot(h);
    if (!h.reveals && h.puzzle) {
      setShowPuzzle(true);
    }
  };

  // ─── Resolução do puzzle ────────────────────────────────────────────────
  const handlePuzzleSolved = () => {
    setShowPuzzle(false);
    if (!activeHotspot) return;
    const h = activeHotspot;

    // Marca como resolvido
    setSolved(prev => prev.includes(h.id) ? prev : [...prev, h.id]);

    // Adiciona itens ao inventário e dispara a celebração.
    // Importante: calculamos `toAdd` FORA do updater do setState para que
    // (a) StrictMode não execute o filtro duas vezes e (b) o agendamento do
    // ItemRewardModal não dependa de mutação dentro do updater.
    if (h.rewardItems?.length) {
      const existingIds = new Set(inventory.map(i => i.id));
      const toAdd = h.rewardItems.filter(ri => !existingIds.has(ri.id));
      if (toAdd.length) {
        setInventory(prev => {
          const ids = new Set(prev.map(i => i.id));
          const safeAdd = toAdd.filter(ri => !ids.has(ri.id));
          return [...prev, ...safeAdd];
        });
        // Toast imediato (sempre aparece, redundância visual)
        const names = toAdd.map(i => `${i.emoji} ${i.label}`).join(', ');
        showToast(`🎁 Item conquistado: ${names}`, 'win');
        // Modal proeminente após o fade do PuzzleModal
        setTimeout(() => setWonItems(toAdd), 240);
      }
    }

    setActiveHotspot(null);
  };

  const dismissWonItems = () => {
    setWonItems([]);
  };

  const handlePuzzleFailed = () => {
    setShowPuzzle(false);
    if (devMode) return;
    const newHp = hp - 1;
    setHp(newHp);
    if (newHp <= 0) setPhase('defeat');
  };

  // ─── Ambient "resolvido" ao fechar (para marcar como lido) ─────────────
  const closeReveal = () => {
    if (activeHotspot?.ambientOnly) {
      setSolved(prev => prev.includes(activeHotspot.id) ? prev : [...prev, activeHotspot.id]);
    }
    setActiveHotspot(null);
  };

  // ─── Fim da cena de memória ─────────────────────────────────────────────
  const handleMemoryFinish = () => {
    completeEscapeRoom(room.id);
    const xpReward = room.memory?.xpReward ?? 100;
    gainXP(xpReward, (newRank) => {
      if (newRank) setRankUpModal(newRank);
      else navigation.goBack();
    });
    setShowReveal(false);
  };

  const handleRankUpDismiss = () => {
    setRankUpModal(null);
    navigation.goBack();
  };

  // ─── Dica do Eimei ──────────────────────────────────────────────────────
  const useHint = () => {
    if (hints <= 0) {
      Alert.alert('Sem dicas', 'Eimei já revelou todos os segredos que podia.');
      return;
    }

    // Dicas intencionalmente vagas — apenas alertam sobre item não usado ou
    // sugerem explorar sem revelar alvo. O jogador deve deduzir sozinho.
    const unusedItem = inventory.find(item =>
      room.hotspots.some(h =>
        !solved.includes(h.id) && !unlocked.includes(h.id) && itemMatches(h, item.id)
      ),
    );
    let text;
    if (unusedItem) {
      text = `Você já tem o "${unusedItem.label}" (${unusedItem.emoji}) há um tempo. Cada item tem um lugar certo — tente-o em objetos que ainda não cederam a nada.`;
    } else {
      const freeCount = room.hotspots.filter(h =>
        !solved.includes(h.id) && !h.useItem && !h.ambientOnly
      ).length;
      if (freeCount > 0) {
        text = 'Há objetos aqui que se abrem sem precisar de nada do seu bolso. Olhe com cuidado — às vezes é só ler.';
      } else {
        text = 'Objetos decorativos não inventam caminhos. Releia os que você destrancou — alguns guardam palavras que despertam memórias.';
      }
    }

    setHintText(text);
    setShowHint(true);
    setHints(h => h - 1);
  };

  const handleFlee = () => {
    Alert.alert(
      'Recuar da câmara',
      'Você sairá sem recuperar a memória. Progresso desta sala será perdido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Recuar',   style: 'destructive', onPress: () => navigation.goBack() },
      ],
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  Render: fases especiais
  // ══════════════════════════════════════════════════════════════════════════

  if (phase === 'intro') {
    return (
      <ImageBackground
        source={room.backgroundImage}
        style={styles.container}
        imageStyle={{ opacity: 0.55 }}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          style={[styles.introOverlay, { borderColor: accent + '55' }]}
          onPress={() => setPhase('playing')}
        >
          <StatusBar hidden />
          <Text style={styles.introIcon}>{room.icon}</Text>
          <FuriganaText
            text={room.titleJp}
            fontSize={32}
            color={accent}
            furiganaColor={accent + 'aa'}
            align="center"
            style={{ marginBottom: 6 }}
          />
          <Text style={[styles.introTitle, { color: accent }]}>{room.title}</Text>
          <Text style={styles.introLevel}>JLPT {room.jlptLevel}</Text>
          <View style={[styles.introBox, { borderColor: accent + '66' }]}>
            <Text style={styles.introText}>{room.intro}</Text>
          </View>
          <Text style={[styles.tapHint, { color: accent }]}>▶  Tocar para entrar</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

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

  // ══════════════════════════════════════════════════════════════════════════
  //  Render: sala interativa
  // ══════════════════════════════════════════════════════════════════════════

  const solvedCount = solved.filter(id => {
    const h = room.hotspots.find(x => x.id === id);
    return h && !h.isExit && !h.ambientOnly;
  }).length;
  const totalPuzzles = room.hotspots.filter(h => !h.isExit && !h.ambientOnly).length;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* ── HUD Superior ──────────────────────────────────────────────── */}
      <View style={[styles.hud, { borderBottomColor: accent + '55' }]}>
        <View style={styles.hudLeft}>
          <Text style={styles.hudHearts}>
            {'♥'.repeat(hp)}
            <Text style={{ color: '#3a3a3a' }}>{'♡'.repeat(MAX_HP - hp)}</Text>
          </Text>
        </View>
        <View style={styles.hudCenter}>
          <Text style={styles.hudIcon}>{room.icon}</Text>
          <View>
            <Text style={[styles.hudTitle, { color: accent }]} numberOfLines={1}>
              {room.title}
            </Text>
            <Text style={styles.hudSub}>JLPT {room.jlptLevel} · {solvedCount}/{totalPuzzles}</Text>
          </View>
        </View>
        <View style={styles.hudRight}>
          <TouchableOpacity style={[styles.iconBtn, { borderColor: accent + '66' }]} onPress={useHint}>
            <Text style={styles.iconBtnEmoji}>💡</Text>
            <Text style={[styles.iconBtnCount, { color: accent }]}>{hints}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fleeBtn} onPress={handleFlee}>
            <Text style={styles.fleeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Cenário imersivo (scroll vertical com hotspots sobrepostos) ── */}
      <View style={styles.mapWrapper}>
        <ScrollView
          style={styles.mapScroll}
          contentContainerStyle={{ height: SCENE_HEIGHT, width: SW }}
          showsVerticalScrollIndicator
          bounces
        >
          <ImageBackground
            source={room.backgroundImage}
            style={styles.mapSceneFull}
            imageStyle={styles.mapBackgroundImage}
            resizeMode="cover"
          >
            <View style={styles.vignette} pointerEvents="none" />

            {room.hotspots.map(h => {
              const state = hotspotState(h);
              return (
                <Hotspot
                  key={h.id}
                  hotspot={h}
                  x={h.x * SW}
                  y={h.y * SCENE_HEIGHT}
                  state={state}
                  accentColor={accent}
                  onPress={handleHotspotPress}
                />
              );
            })}
          </ImageBackground>
        </ScrollView>

        {/* Overlays fixos sobre a viewport (não rolam com o conteúdo) */}
        {toast ? (
          <View pointerEvents="none" style={[
            styles.toast,
            toast.tone === 'wrong' && styles.toastWrong,
            toast.tone === 'win'   && styles.toastWin,
          ]}>
            <Text style={styles.toastText}>{toast.text}</Text>
          </View>
        ) : null}

        {selectedId ? (
          <View pointerEvents="none" style={[styles.selectionHint, { borderColor: accent }]}>
            <Text style={[styles.selectionHintText, { color: accent }]}>
              🎯  Toque num objeto para usar este item
            </Text>
          </View>
        ) : null}

        {/* Indicador discreto de "há mais para rolar" */}
        <View pointerEvents="none" style={styles.scrollHint}>
          <Text style={styles.scrollHintText}>▾</Text>
        </View>
      </View>

      {/* ── Inventário ────────────────────────────────────────────────── */}
      <InventoryBar
        items={inventory}
        selectedId={selectedId}
        accentColor={accent}
        puzzleCount={`${solvedCount}/${totalPuzzles}`}
        onSelectItem={(id) => setSelectedId(id)}
      />

      {/* ── Modal teaser do hotspot ainda bloqueado ───────────────────── */}
      <Modal
        transparent
        visible={!!activeHotspot && activeHotspot._lockedTeaser && !showPuzzle && !showReveal && wonItems.length === 0}
        animationType="fade"
        onRequestClose={() => setActiveHotspot(null)}
      >
        <View style={styles.overlay}>
          <View style={[styles.card, { borderColor: accent }]}>
            <Text style={[styles.cardTitle, { color: accent }]}>
              {activeHotspot?.emoji}  {activeHotspot?.labelPt}
            </Text>
            <ScrollView style={{ maxHeight: 260, marginBottom: 14 }}>
              <FuriganaText
                text={activeHotspot?.initialMessage || 'Você examina o objeto, mas nada acontece.'}
                fontSize={14}
                color="#e8e8e8"
                furiganaColor={accent}
                align="left"
              />
            </ScrollView>
            <TouchableOpacity
              style={[styles.cardBtn, { backgroundColor: accent + '22', borderColor: accent, alignSelf: 'center' }]}
              onPress={() => setActiveHotspot(null)}
            >
              <Text style={styles.cardBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Modal de reveals / descoberta ─────────────────────────────── */}
      <Modal
        transparent
        visible={!!activeHotspot && !activeHotspot._lockedTeaser && !showPuzzle && !showReveal && wonItems.length === 0 && !!(activeHotspot.reveals || activeHotspot._justUnlocked)}
        animationType="fade"
        onRequestClose={closeReveal}
      >
        <View style={styles.overlay}>
          <View style={[styles.card, { borderColor: accent }]}>
            <Text style={[styles.cardTitle, { color: accent }]}>
              {activeHotspot?.emoji}  {activeHotspot?.labelPt}
            </Text>
            <ScrollView style={{ maxHeight: 280 }}>
              {activeHotspot?._justUnlocked && activeHotspot?.useItemSuccess ? (
                <View style={[styles.unlockBanner, { borderColor: accent + '55' }]}>
                  <Text style={[styles.unlockBannerLabel, { color: accent }]}>
                    {activeHotspot?._revisit ? '📝  Anotações' : '✓  Destravado'}
                  </Text>
                  <FuriganaText
                    text={activeHotspot.useItemSuccess}
                    fontSize={14}
                    color="#e8e8e8"
                    furiganaColor={accent}
                    align="left"
                  />
                </View>
              ) : null}
              {activeHotspot?.reveals ? (
                <View style={{ marginTop: activeHotspot?._justUnlocked ? 10 : 0 }}>
                  <FuriganaText
                    text={activeHotspot.reveals}
                    fontSize={14}
                    color="#e8e8e8"
                    furiganaColor={accent}
                    align="left"
                  />
                </View>
              ) : null}
            </ScrollView>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.cardBtn, styles.cardBtnSecondary]}
                onPress={closeReveal}
              >
                <Text style={styles.cardBtnText}>Fechar</Text>
              </TouchableOpacity>
              {/* Botão "Investigar →" só aparece quando há puzzle pendente
                  (não aparece quando é uma revisita a hotspot já resolvido). */}
              {activeHotspot?.puzzle && !activeHotspot._revisit && !solved.includes(activeHotspot.id) ? (
                <TouchableOpacity
                  style={[styles.cardBtn, { backgroundColor: accent + '22', borderColor: accent }]}
                  onPress={() => setShowPuzzle(true)}
                >
                  <Text style={styles.cardBtnText}>Investigar →</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal do enigma ───────────────────────────────────────────── */}
      <PuzzleModal
        visible={showPuzzle}
        puzzle={activeHotspot?.puzzle}
        accentColor={accent}
        onSolved={handlePuzzleSolved}
        onFailed={handlePuzzleFailed}
        onClose={() => { setShowPuzzle(false); setActiveHotspot(null); }}
      />

      {/* ── Modal de dica ─────────────────────────────────────────────── */}
      <Modal transparent visible={showHint} animationType="fade" onRequestClose={() => setShowHint(false)}>
        <View style={styles.overlay}>
          <View style={[styles.card, { borderColor: accent }]}>
            <Text style={[styles.cardTitle, { color: accent }]}>🧙  Eimei sussurra</Text>
            <Text style={styles.cardBody}>{hintText}</Text>
            <Text style={styles.hintCount}>Dicas restantes: {hints}</Text>
            <TouchableOpacity
              style={[styles.cardBtn, { backgroundColor: accent + '22', borderColor: accent, alignSelf: 'center' }]}
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

      {/* ── Celebração de item conquistado ────────────────────────────── */}
      <ItemRewardModal
        visible={wonItems.length > 0}
        items={wonItems}
        accentColor={accent}
        onDismiss={dismissWonItems}
      />

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
  container: { flex: 1, backgroundColor: '#05070d' },
  centered:  { justifyContent: 'center', alignItems: 'center', padding: 24, gap: 14 },
  errorText: { color: '#f44336', fontSize: 16 },
  backLink:  { color: '#ffd700', fontSize: 15, marginTop: 10 },

  // HUD
  hud: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 44, paddingHorizontal: 12,
    paddingBottom: 10, backgroundColor: 'rgba(0,0,0,0.9)',
    borderBottomWidth: 1, gap: 10,
  },
  hudLeft:    { flex: 1 },
  hudHearts:  { color: '#f44336', fontSize: 18, letterSpacing: 2 },
  hudCenter:  { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  hudIcon:    { fontSize: 22 },
  hudTitle:   { fontSize: 14, fontWeight: 'bold', letterSpacing: 0.3 },
  hudSub:     { color: '#888', fontSize: 10 },
  hudRight:   { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
  iconBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 14, borderWidth: 1,
    gap: 4,
  },
  iconBtnEmoji: { fontSize: 14 },
  iconBtnCount: { fontSize: 13, fontWeight: 'bold' },
  fleeBtn: {
    width: 30, height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  fleeBtnText: { color: '#888', fontSize: 16, fontWeight: 'bold' },

  // Map area (agora com scroll)
  mapWrapper: { flex: 1, position: 'relative', overflow: 'hidden' },
  mapScroll:  { flex: 1 },
  mapSceneFull: { flex: 1, position: 'relative' },
  mapBackgroundImage: { opacity: 0.92 },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  // Seta "▾" discreta no canto inferior direito sugerindo scroll
  scrollHint: {
    position: 'absolute',
    right: 12, bottom: 12,
    width: 26, height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  scrollHintText: { color: '#ccc', fontSize: 14, lineHeight: 18 },

  // Toast
  toast: {
    position: 'absolute',
    top: 14, alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.82)',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#888',
    maxWidth: '90%',
    zIndex: 50,
  },
  toastWrong: { borderColor: '#f44336', backgroundColor: 'rgba(60,0,0,0.85)' },
  toastWin:   { borderColor: '#4caf50', backgroundColor: 'rgba(0,40,10,0.85)' },
  toastText:  { color: '#fff', fontSize: 12 },

  // Hint quando item selecionado
  selectionHint: {
    position: 'absolute',
    top: 48, alignSelf: 'center',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 14, borderWidth: 1.5,
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 40,
  },
  selectionHintText: { fontSize: 12, fontWeight: 'bold' },

  // Intro
  introOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  introIcon:  { fontSize: 72 },
  introTitle: { fontSize: 26, fontWeight: 'bold', marginTop: 6 },
  introLevel: { color: '#888', fontSize: 13, letterSpacing: 3 },
  introBox: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 14, borderWidth: 1,
    padding: 18, maxWidth: 400,
    marginVertical: 16,
  },
  introText: { color: '#e8e8e8', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  tapHint:   { fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },

  // Defeat
  defeatIcon:  { fontSize: 72 },
  defeatTitle: { color: '#f44336', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  defeatSub:   { color: '#aaa', fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: 320 },
  defeatBtn:   {
    paddingHorizontal: 30, paddingVertical: 12,
    borderRadius: 10, borderWidth: 2,
    marginTop: 16,
  },
  defeatBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // Stub
  stubIcon:    { fontSize: 72 },
  stubTitle:   { fontSize: 24, fontWeight: 'bold' },
  stubText:    { color: '#aaa', fontSize: 14, textAlign: 'center', maxWidth: 320, lineHeight: 22 },
  backBtn:     {
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 10, borderWidth: 2,
    marginTop: 18,
  },
  backBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  // Modais genéricos
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%', maxWidth: 400,
    backgroundColor: '#0f1628',
    borderRadius: 14, borderWidth: 2,
    padding: 18,
  },
  cardTitle:   { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  cardBody:    { color: '#e8e8e8', fontSize: 14, lineHeight: 22, marginBottom: 14 },
  cardActions: {
    flexDirection: 'row', justifyContent: 'flex-end',
    gap: 10, marginTop: 14,
  },
  cardBtn: {
    paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: 10, borderWidth: 1.5,
    backgroundColor: '#16213e',
    borderColor: '#2a2a4a',
  },
  cardBtnSecondary: { backgroundColor: 'transparent', borderColor: '#666' },
  cardBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  unlockBanner: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginBottom: 12,
  },
  unlockBannerLabel: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 6 },

  hintCount: { color: '#c8a96e', fontSize: 11, textAlign: 'center', marginBottom: 10, fontStyle: 'italic' },
});
