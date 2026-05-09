import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import FuriganaText from './FuriganaText';

/**
 * Modal de "item conquistado".
 *
 * Exibido logo após resolver um enigma que dá item(ns). Mais marcante que o
 * toast: cada item ganha um cartão com emoji grande, nome em PT e em japonês
 * (quando disponível) e a dica de uso. O jogador precisa tocar para fechar
 * antes de continuar a explorar — assim ele reconhece o que recebeu.
 *
 * Props:
 *   visible      – boolean
 *   items        – array de { id, emoji, label, labelJp?, hint }
 *   accentColor  – cor da sala
 *   onDismiss    – callback ao fechar
 */
export default function ItemRewardModal({ visible, items = [], accentColor = '#ffd700', onDismiss }) {
  const scaleAnim  = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return undefined;
    scaleAnim.setValue(0.6);
    opacityAnim.setValue(0);
    sparkleAnim.setValue(0);

    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 7 }).start();
    Animated.timing(opacityAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();

    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(sparkleAnim, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ]),
    );
    sparkleLoop.start();

    return () => sparkleLoop.stop();
  }, [visible]);

  if (!visible || !items.length) return null;

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 1], outputRange: [0.85, 1.1],
  });
  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 1], outputRange: [0.5, 1],
  });

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            { borderColor: accentColor, transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          <Animated.Text
            style={[
              styles.sparkle,
              { color: accentColor, transform: [{ scale: sparkleScale }], opacity: sparkleOpacity },
            ]}
          >
            ✨
          </Animated.Text>
          <Text style={[styles.title, { color: accentColor }]}>Item conquistado!</Text>
          <Text style={styles.subtitle}>{items.length === 1 ? 'Você obteve:' : 'Você obteve estes itens:'}</Text>

          <View style={styles.list}>
            {items.map(it => (
              <View key={it.id} style={[styles.itemCard, { borderColor: accentColor + '88' }]}>
                <Text style={styles.itemEmoji}>{it.emoji}</Text>
                <View style={styles.itemTexts}>
                  {it.labelJp ? (
                    <View style={{ marginBottom: 2 }}>
                      <FuriganaText
                        text={it.labelJp}
                        fontSize={16}
                        color="#fff"
                        furiganaColor={accentColor}
                        align="left"
                      />
                    </View>
                  ) : null}
                  <Text style={[styles.itemLabel, { color: accentColor }]}>{it.label}</Text>
                  {it.hint ? <Text style={styles.itemHint}>{it.hint}</Text> : null}
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: accentColor + '22', borderColor: accentColor }]}
            onPress={onDismiss}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>Continuar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.88)',
    justifyContent: 'center', alignItems: 'center',
    padding: 22,
  },
  card: {
    width: '100%', maxWidth: 380,
    backgroundColor: '#0f1628',
    borderRadius: 18, borderWidth: 2,
    padding: 22, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 14, shadowOffset: { width: 0, height: 4 },
  },
  sparkle:   { fontSize: 38, marginBottom: 4 },
  title:     { fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 4 },
  subtitle:  { color: '#a8b1c2', fontSize: 13, marginBottom: 14 },

  list: { width: '100%', gap: 10, marginBottom: 18 },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 12, borderWidth: 1.5,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  itemEmoji: { fontSize: 38 },
  itemTexts: { flex: 1 },
  itemLabel: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  itemHint:  { color: '#c8c8c8', fontSize: 12, lineHeight: 17, fontStyle: 'italic' },

  button: {
    paddingHorizontal: 28, paddingVertical: 11,
    borderRadius: 12, borderWidth: 1.5,
  },
  buttonText: { fontSize: 14, fontWeight: 'bold', letterSpacing: 0.5 },
});
