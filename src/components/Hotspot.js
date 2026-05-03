import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import FuriganaText from './FuriganaText';

/**
 * Hotspot clicável no cenário de uma sala de escape room.
 *
 * Estados visuais (os nomes devem bater com o motor):
 *  - 'idle'      – desbloqueado, sem puzzle pendente (ex.: apenas reveals)
 *  - 'locked'    – precisa de um item para abrir
 *  - 'solved'    – enigma resolvido (check verde, opaco)
 *  - 'exit'      – porta de saída ainda trancada
 *
 * Extras (sobrepostos):
 *  - compatible=true: o item atualmente selecionado no inventário combina com
 *    este hotspot (halo pulsante em dourado — dica visual). Passado pelo motor.
 *
 * Props:
 *   hotspot       – objeto { emoji, label, labelPt, isExit }
 *   x, y          – posição absoluta
 *   state         – 'idle' | 'locked' | 'solved' | 'exit'
 *   compatible    – se true, anima halo indicando match do item selecionado
 *   accentColor   – cor de destaque
 *   onPress
 */
export default function Hotspot({
  hotspot, x, y, state = 'idle',
  compatible = false, accentColor = '#ffd700',
  onPress,
}) {
  const idleAnim = useRef(new Animated.Value(1)).current;
  const haloAnim = useRef(new Animated.Value(0)).current;

  // Pulso sutil permanente para chamar a atenção nos idle
  useEffect(() => {
    if (state === 'idle' || state === 'locked' || state === 'exit') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(idleAnim, { toValue: 1.06, duration: 1300, useNativeDriver: true }),
          Animated.timing(idleAnim, { toValue: 1,    duration: 1300, useNativeDriver: true }),
        ])
      ).start();
    } else {
      idleAnim.setValue(1);
    }
  }, [state]);

  // Halo grande quando compatível
  useEffect(() => {
    if (compatible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(haloAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(haloAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      haloAnim.setValue(0);
    }
  }, [compatible]);

  const isSolved  = state === 'solved';
  const isLocked  = state === 'locked';
  const isExit    = state === 'exit';

  const bgColor =
    isSolved ? 'rgba(40,40,50,0.75)' :
    isLocked ? 'rgba(20,10,5,0.85)'  :
    isExit   ? 'rgba(60,15,15,0.90)' :
               'rgba(30,15,5,0.90)';

  const borderColor =
    isSolved ? '#4caf50' :
    isLocked ? '#8a6b40' :
    accentColor;

  return (
    <TouchableOpacity
      style={[styles.wrapper, { left: x - 38, top: y - 38 }, isSolved && styles.solvedWrapper]}
      onPress={() => onPress?.(hotspot)}
      activeOpacity={0.75}
    >
      {/* Halo externo (quando item compatível) */}
      <Animated.View
        style={[
          styles.halo,
          {
            borderColor: accentColor,
            opacity: haloAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.75] }),
            transform: [{
              scale: haloAnim.interpolate({ inputRange: [0, 1], outputRange: [1.0, 1.35] }),
            }],
          },
        ]}
        pointerEvents="none"
      />

      {/* Círculo principal */}
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: bgColor,
            borderColor,
            transform: [{ scale: idleAnim }],
          },
        ]}
      >
        <Text style={[styles.emoji, isSolved && styles.emojiDim]}>
          {hotspot.emoji}
        </Text>

        {isLocked ? (
          <View style={styles.cornerBadge}>
            <Text style={styles.cornerBadgeText}>🔒</Text>
          </View>
        ) : null}
        {isSolved ? (
          <View style={[styles.cornerBadge, { backgroundColor: '#1b5e20', borderColor: '#4caf50' }]}>
            <Text style={styles.cornerBadgeTextLight}>✓</Text>
          </View>
        ) : null}
        {isExit ? (
          <View style={[styles.cornerBadge, { backgroundColor: '#5c1a1a', borderColor: '#f44336' }]}>
            <Text style={styles.cornerBadgeTextLight}>→</Text>
          </View>
        ) : null}
      </Animated.View>

      {/* Etiqueta em kanji */}
      <View style={[styles.labelBox, { borderColor: accentColor + '55' }]}>
        <FuriganaText
          text={hotspot.label}
          fontSize={10}
          color={isSolved ? '#888' : '#fff'}
          furiganaColor={isSolved ? '#666' : accentColor}
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
  solvedWrapper: { opacity: 0.6 },

  halo: {
    position: 'absolute',
    top: 0, left: 5,
    width: 66, height: 66,
    borderRadius: 33,
    borderWidth: 3,
  },

  circle: {
    width: 66, height: 66,
    borderRadius: 33,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  emoji:    { fontSize: 30 },
  emojiDim: { opacity: 0.45 },

  cornerBadge: {
    position: 'absolute',
    right: -5, bottom: -5,
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: '#1a1a2e',
    borderWidth: 1.5,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerBadgeText: { fontSize: 10 },
  cornerBadgeTextLight: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  labelBox: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 6,
    borderWidth: 1,
  },
});
