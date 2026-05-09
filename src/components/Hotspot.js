import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import FuriganaText from './FuriganaText';

/** Emojis de torii (⛩ / ⛩️) costumam sair pretos no Web — desenho vermelho consistente. */
export function isToriiEmoji(str) {
  if (!str) return false;
  return String(str).replace(/\uFE0F/g, '').trim() === '⛩';
}

/**
 * Torii vermelho estilizado (silhueta simples: lintel duplo + pilares).
 */
export function ToriiMark({ color = '#c92a2a', size = 30 }) {
  const s = size;
  const postW = Math.max(3.5, s * 0.15);
  const postH = s * 0.5;
  return (
    <View style={{ width: s, height: s * 0.92, alignItems: 'center' }}>
      <View style={{ width: s * 0.9, height: s * 0.1, backgroundColor: color, borderRadius: 2 }} />
      <View style={{ width: s * 0.52, height: s * 0.08, backgroundColor: color, borderRadius: 2, marginTop: s * 0.03 }} />
      <View
        style={{
          flexDirection: 'row',
          width: s * 0.68,
          justifyContent: 'space-between',
          marginTop: s * 0.04,
          height: postH,
        }}
      >
        <View style={{ width: postW, height: postH, backgroundColor: color, borderRadius: 2 }} />
        <View style={{ width: postW, height: postH, backgroundColor: color, borderRadius: 2 }} />
      </View>
    </View>
  );
}

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
        {isToriiEmoji(hotspot.emoji) ? (
          <View style={styles.emojiToriiWrap}>
            <ToriiMark color="#c92a2a" size={30} />
          </View>
        ) : (
          <Text style={styles.emoji}>{hotspot.emoji}</Text>
        )}
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
  emojiToriiWrap: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBox: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 6,
    borderWidth: 1,
  },
});
