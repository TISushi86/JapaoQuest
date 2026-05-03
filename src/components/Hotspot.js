import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import FuriganaText from './FuriganaText';

/**
 * Hotspot clicável no cenário de uma sala de escape room.
 *
 * Todos os hotspots aparecem visualmente idênticos em qualquer estado.
 * Não há marca verde de "resolvido", cadeado, seta de saída, ou halo
 * dourado indicando item compatível. O jogador precisa deduzir tudo por
 * conta própria — inclusive lembrar em quais objetos já interagiu.
 *
 * O único feedback visual que permanece é o pulso sutil permanente, para
 * dar vida ao cenário e ajudar o jogador a perceber que há objetos
 * interativos em geral.
 *
 * Props:
 *   hotspot     – { emoji, label, labelPt, ... }
 *   x, y        – posição absoluta (pixels) dentro do container
 *   accentColor – cor de destaque da borda e do label
 *   onPress     – callback quando tocado
 *
 * (state é aceito mas ignorado — mantido para compatibilidade com o motor.)
 */
export default function Hotspot({
  hotspot, x, y,
  accentColor = '#ffd700',
  onPress,
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1300, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1300, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity
      style={[styles.wrapper, { left: x - 38, top: y - 38 }]}
      onPress={() => onPress?.(hotspot)}
      activeOpacity={0.75}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: 'rgba(30,15,5,0.88)',
            borderColor: accentColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={styles.emoji}>
          {hotspot.emoji}
        </Text>
      </Animated.View>

      <View style={[styles.labelBox, { borderColor: accentColor + '55' }]}>
        <FuriganaText
          text={hotspot.label}
          fontSize={10}
          color="#fff"
          furiganaColor={accentColor}
          align="center"
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
  emoji: { fontSize: 30 },
  labelBox: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 6,
    borderWidth: 1,
  },
});
