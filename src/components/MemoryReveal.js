import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar,
} from 'react-native';
import FuriganaText from './FuriganaText';

/**
 * Tela de revelação de memória ao escapar de uma câmara.
 * Segue o mesmo padrão do PrologueScreen: typewriter, fade entre cenas.
 *
 * Props:
 *   memory      – objeto do dado da sala ({ title, scenes, xpReward })
 *   accentColor – cor de destaque
 *   onFinish    – callback ao encerrar
 */
export default function MemoryReveal({ memory, accentColor = '#ffd700', onFinish }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const idxRef = useRef(0);

  const scene = memory?.scenes?.[sceneIdx];
  const isLast = sceneIdx === (memory?.scenes?.length || 1) - 1;

  // Typewriter
  useEffect(() => {
    if (!scene) return;
    setDisplayed('');
    setDone(false);
    idxRef.current = 0;
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    const interval = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(scene.text.slice(0, idxRef.current));
      if (idxRef.current >= scene.text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [sceneIdx]);

  const advance = () => {
    if (!done) {
      setDisplayed(scene.text);
      setDone(true);
      return;
    }
    if (!isLast) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
        .start(() => setSceneIdx(i => i + 1));
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true })
        .start(() => onFinish?.());
    }
  };

  if (!scene) return null;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={advance}
      style={[styles.container, { borderColor: accentColor + '33' }]}
    >
      <StatusBar hidden />

      <View style={styles.topBar}>
        <Text style={[styles.title, { color: accentColor }]}>
          ✨ {memory.title || 'Memória Recuperada'}
        </Text>
        <Text style={styles.progress}>
          {sceneIdx + 1} / {memory.scenes.length}
        </Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {scene.japanese ? (
          <View style={styles.japaneseBox}>
            <FuriganaText
              text={scene.japanese}
              fontSize={36}
              color={accentColor}
              furiganaColor={accentColor + 'aa'}
              style={{ justifyContent: 'center' }}
            />
            <View style={[styles.underline, { backgroundColor: accentColor + '55' }]} />
          </View>
        ) : null}

        <View style={[styles.dialogBox, { borderColor: accentColor + '44' }]}>
          <Text style={styles.dialogText}>{displayed}</Text>
          <Text style={[styles.continueHint, { color: done ? accentColor : accentColor + '55' }]}>
            {done ? (isLast ? '▶  Continuar a jornada' : '▶  Continuar') : 'Toque para avançar'}
          </Text>
        </View>
      </Animated.View>

      {isLast && done && memory.xpReward ? (
        <View style={[styles.rewardBox, { borderColor: accentColor }]}>
          <Text style={[styles.rewardText, { color: accentColor }]}>
            +{memory.xpReward} XP
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070d',
    padding: 20,
    paddingTop: 48,
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title:    { fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
  progress: { color: '#555', fontSize: 12 },

  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  japaneseBox: { alignItems: 'center', marginBottom: 30 },
  underline:   { height: 2, width: '50%', marginTop: 12, borderRadius: 1 },

  dialogBox: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    minHeight: 120,
  },
  dialogText: { color: '#e8e8e8', fontSize: 16, lineHeight: 26 },
  continueHint: { marginTop: 14, fontSize: 13, textAlign: 'right', fontWeight: 'bold' },

  rewardBox: {
    alignSelf: 'center',
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 16,
  },
  rewardText: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
