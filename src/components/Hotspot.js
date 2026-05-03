import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import FuriganaText from './FuriganaText';

/**
 * Hotspot clicável no cenário de uma sala de escape room.
 *
 * Todos os hotspots (exceto os já resolvidos) aparecem visualmente idênticos,
 * sem indicação de cadeado, de porta de saída ou de compatibilidade com o item
 * selecionado. O jogador precisa deduzir sozinho onde usar cada item e quais
 * objetos são relevantes.
 *
 * Estados:
 *   'idle'   / 'locked' / 'exit' – todos renderizados como um hotspot neutro,
 *                                  apenas com um pulso sutil para chamar atenção.
 *   'solved' – marca verde ✓ e opacidade reduzida.
 *
 * Props:
 *   hotspot     – { emoji, label, labelPt, ... }
 *   x, y        – posição absoluta (pixels)
 *   state       – estado lógico (ver acima)
 *   accentColor – cor de destaque
 *   onPress     – callback
 */
export default function Hotspot({
  hotspot, x, y, state = 'idle',
  accentColor = '#ffd700',
  onPress,
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isSolved  = state === 'solved';

  useEffect(() => {
    if (!isSolved) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 1300, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 1300, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSolved]);

  return (
    <TouchableOpacity
      style={[styles.wrapper, { left: x - 38, top: y - 38 }, isSolved && styles.solvedWrapper]}
      onPress={() => onPress?.(hotspot)}
      activeOpacity={0.75}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: isSolved ? 'rgba(40,40,50,0.75)' : 'rgba(30,15,5,0.88)',
            borderColor: isSolved ? '#4caf50' : accentColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={[styles.emoji, isSolved && styles.emojiDim]}>
          {hotspot.emoji}
        </Text>

        {isSolved ? (
          <View style={styles.solvedBadge}>
            <Text style={styles.solvedBadgeText}>✓</Text>
          </View>
        ) : null}
      </Animated.View>

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

  solvedBadge: {
    position: 'absolute',
    right: -5, bottom: -5,
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: '#1b5e20',
    borderWidth: 1.5,
    borderColor: '#4caf50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solvedBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  labelBox: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 6,
    borderWidth: 1,
  },
});
