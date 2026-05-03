import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import FuriganaText from './FuriganaText';

/**
 * Hotspot clicável no cenário de uma sala de escape room.
 *
 * Estados visuais:
 *  - available  : interativo, pulso sutil para chamar a atenção
 *  - locked     : cadeado exibido, toque ainda funciona (mas motor decide o que mostrar)
 *  - solved     : apagado/transparente
 *
 * Props:
 *   hotspot     – objeto com emoji, label, labelPt
 *   x, y        – coordenadas absolutas em pixels (calculadas pelo motor)
 *   state       – 'available' | 'locked' | 'solved'
 *   accentColor – cor de destaque
 *   onPress     – callback
 */
export default function Hotspot({
  hotspot, x, y, state = 'available', accentColor = '#ffd700', onPress,
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'available') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state]);

  const isSolved = state === 'solved';
  const isLocked = state === 'locked';

  return (
    <TouchableOpacity
      style={[
        styles.wrapper,
        { left: x - 38, top: y - 38 },
        isSolved && styles.solved,
      ]}
      onPress={() => !isSolved && onPress?.(hotspot)}
      disabled={isSolved}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: isSolved ? '#1a1a2e' : '#4a0000',
            borderColor: isSolved ? '#333' : accentColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={[styles.emoji, isSolved && styles.emojiSolved]}>
          {hotspot.emoji}
        </Text>
        {isLocked ? (
          <View style={styles.lockBadge}>
            <Text style={styles.lockBadgeText}>🔒</Text>
          </View>
        ) : null}
        {isSolved ? (
          <View style={styles.solvedBadge}>
            <Text style={styles.solvedBadgeText}>✓</Text>
          </View>
        ) : null}
      </Animated.View>
      <View style={[styles.labelBox, { borderColor: accentColor + '44' }]}>
        <FuriganaText
          text={hotspot.label}
          fontSize={11}
          color={isSolved ? '#666' : '#fff'}
          furiganaColor={isSolved ? '#555' : accentColor}
          style={{ justifyContent: 'center' }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    width: 76,
  },
  solved: { opacity: 0.5 },
  circle: {
    width: 66, height: 66,
    borderRadius: 33,
    borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  emoji: { fontSize: 30 },
  emojiSolved: { opacity: 0.4 },
  lockBadge: {
    position: 'absolute',
    right: -4, bottom: -4,
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: '#1a1a2e',
    borderWidth: 1.5,
    borderColor: '#666',
    alignItems: 'center', justifyContent: 'center',
  },
  lockBadgeText: { fontSize: 11 },
  solvedBadge: {
    position: 'absolute',
    right: -4, bottom: -4,
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: '#2e7d32',
    borderWidth: 1.5,
    borderColor: '#4caf50',
    alignItems: 'center', justifyContent: 'center',
  },
  solvedBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  labelBox: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 6,
    borderWidth: 1,
  },
});
