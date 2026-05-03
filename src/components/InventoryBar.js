import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';

const MAX_SLOTS = 6;

/**
 * Barra inferior de inventário.
 *
 * MECÂNICA:
 *  - Jogador clica num item para selecioná-lo (borda dourada pulsante).
 *  - Clicar novamente no mesmo item desseleciona.
 *  - Só UM item pode estar selecionado por vez.
 *  - Depois de selecionar, o jogador clica num hotspot para "usar" o item ali.
 *
 * Props:
 *   items        – array de { id, emoji, label, hint }
 *   selectedId   – id do item atualmente selecionado (ou null)
 *   accentColor  – cor de destaque da sala
 *   onSelectItem – callback(id) quando jogador toca num item
 *   puzzleCount  – "resolvidos/total"
 */
export default function InventoryBar({
  items = [], selectedId = null, accentColor = '#ffd700',
  onSelectItem, puzzleCount,
}) {
  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => items[i] || null);
  const selectedItem = items.find(i => i.id === selectedId) || null;

  // Pulso na borda do item selecionado
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (selectedId) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [selectedId]);

  return (
    <View style={[styles.wrapper, { borderTopColor: accentColor + '55' }]}>
      {/* Cabeçalho: status do item selecionado ou instrução */}
      <View style={styles.header}>
        {selectedItem ? (
          <Text style={[styles.headerText, { color: accentColor }]} numberOfLines={1}>
            <Text style={styles.headerEmoji}>{selectedItem.emoji}</Text>
            {'  '}
            <Text style={styles.headerBold}>{selectedItem.label} selecionado</Text>
            {selectedItem.hint ? (
              <Text style={styles.headerHint}>{'  · '}{selectedItem.hint}</Text>
            ) : null}
          </Text>
        ) : (
          <Text style={styles.headerTextIdle} numberOfLines={1}>
            🎒  Toque num item para usá-lo nos objetos da sala.
          </Text>
        )}
        {puzzleCount ? (
          <Text style={[styles.counter, { color: accentColor }]}>{puzzleCount}</Text>
        ) : null}
      </View>

      {/* Slots de inventário */}
      <View style={styles.slotsRow}>
        {slots.map((item, i) => {
          const isSelected = item && item.id === selectedId;
          return (
            <TouchableOpacity
              key={i}
              style={styles.slotTouchable}
              onPress={() => item && onSelectItem?.(isSelected ? null : item.id)}
              disabled={!item}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.slot,
                  {
                    borderColor: isSelected ? accentColor : (item ? accentColor + '88' : '#2a2a4a'),
                    backgroundColor: isSelected ? accentColor + '33' : 'rgba(0,0,0,0.55)',
                    transform: isSelected ? [{ scale: pulseAnim }] : [{ scale: 1 }],
                  },
                ]}
              >
                {item ? (
                  <Text style={styles.slotEmoji}>{item.emoji}</Text>
                ) : (
                  <Text style={styles.slotEmptyMark}>·</Text>
                )}
                {isSelected ? (
                  <View style={[styles.selectedBadge, { backgroundColor: accentColor }]}>
                    <Text style={styles.selectedBadgeText}>USAR</Text>
                  </View>
                ) : null}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.92)',
    borderTopWidth: 1.5,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  headerText: {
    flex: 1,
    fontSize: 12,
  },
  headerEmoji: { fontSize: 14 },
  headerBold:  { fontWeight: 'bold' },
  headerHint:  { color: '#a0a0a0', fontSize: 11, fontStyle: 'italic' },
  headerTextIdle: { flex: 1, color: '#9a9080', fontSize: 12, fontStyle: 'italic' },
  counter: { fontSize: 12, fontWeight: 'bold', marginLeft: 8 },

  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  slotTouchable: { flex: 1 },
  slot: {
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slotEmoji: { fontSize: 22 },
  slotEmptyMark: { color: '#444', fontSize: 14 },

  selectedBadge: {
    position: 'absolute',
    bottom: -4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  selectedBadgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
