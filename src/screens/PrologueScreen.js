import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

// ─── Cenas do Prólogo ─────────────────────────────────────────────────────────
const SCENES = [
  // ── Cena 1: Abertura ──
  {
    bg: '#0a0a0a',
    accent: '#c8a96e',
    speaker: null,
    japanese: null,
    text: 'Japão Feudal.\nUma época de guerras, honra e lendas...',
    mood: 'epic',
  },
  {
    bg: '#0d1a0d',
    accent: '#4caf50',
    speaker: null,
    japanese: '影隠れの里',
    text: 'Na vila de Kakurega, escondida entre montanhas e florestas de bambu, vivia uma lenda.',
    mood: 'peaceful',
  },
  // ── Cena 2: O herói ──
  {
    bg: '#1a0d0d',
    accent: '#ffd700',
    speaker: null,
    japanese: '武田竜',
    text: 'Takeda Ryuu — o Samurai das Mil Vitórias. Invencível em batalha. Mesmo com tantos títulos e fama, a sua maior riqueza era a sua família: Hana, sua esposa, e os filhos Kenji e Yuki.',
    mood: 'glorious',
  },
  // ── Cena 3: O ataque ──
  {
    bg: '#1a0000',
    accent: '#f44336',
    speaker: null,
    japanese: '黒髪',
    text: 'Em uma noite em que Ryuu estava chegando em casa, o céu escureceu repentinamente. Não eram nuvens, era Kurokami — o Mago da Névoa Negra. Destruidor de vilas. Ladrão de memórias. Ao vê-lo, Ryuu desembainhou a espada sem hesitar e o confrontou para proteger sua família e todos de sua vila.',
    mood: 'dark',
  },
  // ── Cena 4: A luta ──
  {
    bg: '#0a0a0a',
    accent: '#ff5722',
    speaker: null,
    japanese: null,
    text: 'A luta foi épica. A cada ataque de Ryuu, Kurokami sentia que a derrota estava cada vez mais próxima. Mas ele guardava uma técnica secreta, a Névoa do Esquecimento.',
    mood: 'epic',
  },
  // ── Cena 5: O feitiço ──
  {
    bg: '#050505',
    accent: '#9c27b0',
    speaker: null,
    japanese: null,
    text: 'A Névoa do Esquecimento atingiu Ryuu em cheio e o lançou para um buraco negro. Nome, família, batalhas, palavras — tudo foi apagado de sua memória. O samurai mais temido do Japão agora não existia mais, Takeda Ryuu não existia mais!',
    mood: 'dark',
  },
  // ── Cena 6: Consequências ──
  {
    bg: '#0a0000',
    accent: '#f44336',
    speaker: null,
    japanese: null,
    text: 'Kurokami capturou Hana, Kenji e Yuki e os levou ao seu castelo. Kakurega foi destruída até virar cinzas.',
    mood: 'dark',
  },
  // ── Cena 7: O despertar ──
  {
    bg: '#0a0f0a',
    accent: '#4caf50',
    speaker: null,
    japanese: null,
    text: 'Dias depois, à beira de uma estrada desconhecida, um homem acordou na lama. Não lembrava o próprio nome. Não lia placas. Não entendia uma palavra, apenas vagava sem rumo com um olhar vazio, como se não houvesse uma alma dentro do seu corpo.',
    mood: 'ominous',
  },
  // ── Cena 8: O monge ──
  {
    bg: '#0d1a0d',
    accent: '#c8a96e',
    speaker: null,
    japanese: null,
    text: 'Certo dia, Ryuu passou por um velho monge que notou algo estranho nele. O monge se aproximou e se apresentou como Eimei. Ryuu apenas o olhou sem compreender nada. Eimei confirmou suas suspeitas: a memória daquele homem havia sido roubada por magia antiga. Sensibilizado, Eimei decidiu ajudá-lo e disse a Ryuu: "Um guerreiro sem palavras é como uma espada sem fio. Venha comigo meu jovem, que eu o ajudarei a recuperar tudo o que você perdeu."',
    mood: 'warm',
  },
  // ── Cena 9: O templo ──
  {
    bg: '#0d1a0d',
    accent: '#ffd700',
    speaker: null,
    japanese: 'ひらがな',
    text: 'Ryuu não entendia as palavras que saíam da boca daquele velho, mas sentiu a bondade no seu gesto e o seguiu. Chegando em seu templo, Eimei decidiu que o primeiro ensinamento seria ler e escrever. "As palavras são mais fortes que a espada", disse Eimei. Eimei então começou pelo hiragana — 46 letras, o sistema de escrita básico da língua japonesa.',
    mood: 'warm',
  },
  // ── Cena 10: Chamada à ação ──
  {
    bg: '#0a0a0a',
    accent: '#ffd700',
    speaker: null,
    japanese: null,
    text: 'Chegou a hora de praticar. O monge lançará as letras pelo ar. O guerreiro terá de identificar cada uma antes que atinjam o chão. Concentração é fundamental!',
    mood: 'epic',
    isLast: true,
  },
];

// ─── Typewriter Hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    idx.current = 0;

    const interval = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  const skip = () => {
    setDisplayed(text);
    setDone(true);
  };

  return { displayed, done, skip };
}

// ─── PrologueScreen ───────────────────────────────────────────────────────────
export default function PrologueScreen({ navigation, route }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const bgAnim    = useRef(new Animated.Value(0)).current;

  const scene = SCENES[sceneIdx];
  const { displayed, done, skip } = useTypewriter(scene.text, 24);

  // Fade in ao trocar de cena
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [sceneIdx]);

  const advance = () => {
    if (!done) { skip(); return; }

    if (sceneIdx < SCENES.length - 1) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setSceneIdx(i => i + 1);
      });
    } else {
      // Vai para o mini-game de kana
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        navigation.replace('KanaRain');
      });
    }
  };

  const skipAll = () => {
    navigation.replace('KanaRain');
  };

  // Cor de destaque da cena
  const accent = scene.accent || '#ffd700';

  return (
    <TouchableOpacity activeOpacity={1} style={[styles.container, { backgroundColor: scene.bg }]} onPress={advance}>
      <StatusBar hidden />

      {/* Partículas decorativas de fundo */}
      <View style={styles.particles}>
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${10 + i * 12}%`,
                top:  `${15 + (i % 3) * 25}%`,
                backgroundColor: accent + '22',
                width:  4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        {/* Número da cena */}
        <View style={styles.topBar}>
          <View style={[styles.progressBar, { borderColor: accent + '44' }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((sceneIdx + 1) / SCENES.length) * 100}%`,
                  backgroundColor: accent,
                },
              ]}
            />
          </View>
          <TouchableOpacity onPress={skipAll} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: accent + '88' }]}>Pular »</Text>
          </TouchableOpacity>
        </View>

        {/* Texto japonês (destaque central) */}
        {scene.japanese ? (
          <View style={styles.japaneseContainer}>
            <Text style={[styles.japaneseText, { color: accent }]}>{scene.japanese}</Text>
            <View style={[styles.japaneseLine, { backgroundColor: accent + '55' }]} />
          </View>
        ) : (
          <View style={styles.japaneseContainer} />
        )}

        {/* Caixa de diálogo */}
        <View style={[styles.dialogBox, { borderColor: accent + '44' }]}>
          {scene.speaker ? (
            <View style={[styles.speakerBadge, { backgroundColor: accent + '22', borderColor: accent }]}>
              <Text style={[styles.speakerText, { color: accent }]}>{scene.speaker}</Text>
            </View>
          ) : null}

          <Text style={styles.dialogText}>{displayed}</Text>

          {done ? (
            <Text style={[styles.continueHint, { color: accent }]}>
              {scene.isLast ? '▶  Iniciar Jornada' : '▶  Continuar'}
            </Text>
          ) : (
            <Text style={[styles.continueHint, { color: accent + '55' }]}>Toque para avançar</Text>
          )}
        </View>

        {/* Indicador de cena */}
        <Text style={styles.sceneNumber}>{sceneIdx + 1} / {SCENES.length}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  particles: { ...StyleSheet.absoluteFillObject },
  particle: { position: 'absolute', borderRadius: 50 },

  content: { flex: 1, padding: 24, paddingTop: 56, justifyContent: 'space-between' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ffffff11',
    borderWidth: 0,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  skipBtn:  { paddingVertical: 4, paddingHorizontal: 8 },
  skipText: { fontSize: 13 },

  japaneseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  japaneseText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 4,
  },
  japaneseLine: {
    height: 2,
    width: '60%',
    marginTop: 12,
    borderRadius: 1,
  },

  dialogBox: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    minHeight: 140,
  },
  speakerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  speakerText: { fontSize: 13, fontWeight: 'bold' },
  dialogText: {
    color: '#e8e8e8',
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  continueHint: {
    marginTop: 14,
    fontSize: 13,
    textAlign: 'right',
    fontWeight: 'bold',
  },

  sceneNumber: {
    color: '#ffffff22',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
  },
});
