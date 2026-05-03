import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MAX_SLOTS = 6;

/**
 * Barra inferior de inventário exibindo os itens coletados na sala.
 *
 * Props:
 *   items       – array de { id, emoji, label }
 *   accentColor – cor de destaque (tipicamente a cor da sala)
 *   onItemPress – callback opcional ao tocar num item (mostra label)
 *   puzzleCount – "{resolvidos}/{total}"
 */
export default function InventoryBar({
  items = [], accentColor = '#ffd700', onItemPress, puzzleCount,
}) {
  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => items[i] || null);

  return (
    <View style={[styles.container, { borderTopColor: accentColor + '44' }]}>
      <View style={styles.left}>
        <Text style={styles.bagIcon}>🎒</Text>
        <Text style={styles.bagLabel}>持ち物:</Text>
        <View style={styles.slotsRow}>
          {slots.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.slot,
                { borderColor: item ? accentColor : '#2a2a4a' },
              ]}
              onPress={() => item && onItemPress?.(item)}
              disabled={!item}
              activeOpacity={0.7}
            >
              {item ? (
                <Text style={styles.slotEmoji}>{item.emoji}</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {puzzleCount ? (
        <Text style={[styles.counter, { color: accentColor }]}>
          {puzzleCount} enigmas
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderTopWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bagIcon: { fontSize: 22 },
  bagLabel: { color: '#c8b890', fontSize: 12, marginRight: 4 },
  slotsRow: { flexDirection: 'row', gap: 6 },
  slot: {
    width: 36, height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center', justifyContent: 'center',
  },
  slotEmoji: { fontSize: 20 },
  counter: { fontSize: 13, fontWeight: 'bold' },
});
