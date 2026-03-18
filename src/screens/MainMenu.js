import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, Image, Alert, ActivityIndicator,
  Modal, Switch,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';

const SPRITES = {
  male:   require('../assets/ronin_male_ready.png'),
  female: require('../assets/ronin_female_ready.png'),
};

const RANKS = ['Estudante', 'Guerreiro', 'Samurai', 'Sensei', 'Mestre', 'Shogun'];

function lastScreenLabel(lastScreen, kanaPhase) {
  if (lastScreen === 'Map')      return '⚔  Em jornada pelo mapa';
  if (lastScreen === 'KanaRain') {
    if (!kanaPhase || kanaPhase === 'lesson_h') return '📖  Aprendendo Hiragana';
    if (kanaPhase === 'hiraganaChallenge_intro' || kanaPhase === 'hiraganaChallenge')
      return '🌀  Desafio Hiragana';
    if (kanaPhase === 'katakanaIntro_intro' || kanaPhase === 'lesson_k')
      return '📖  Aprendendo Katakana';
    if (kanaPhase === 'katakanaChallenge_intro' || kanaPhase === 'katakanaChallenge')
      return '🌀  Desafio Katakana';
    if (kanaPhase === 'finalBattle_intro' || kanaPhase === 'finalBattle')
      return '🏯  Prova Final do Mestre';
    return '📖  Aprendendo Kana';
  }
  if (lastScreen === 'Prologue') return '📜  No prólogo';
  return '❓  Jornada iniciada';
}

// ── Tela de seleção de personagem ─────────────────────────────────────────────
function GenderSelectScreen({ onConfirm, onBack, gender, setGender }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/b5882476-2471-4f38-8d98-99232af57b06.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Escolha seu Personagem</Text>
          <Text style={styles.subtitle}>Quem vai trilhar o caminho do Ronin?</Text>

          <View style={styles.characterRow}>
            <TouchableOpacity
              style={[styles.characterCard, gender === 'male' && styles.cardSelected]}
              onPress={() => setGender('male')}
            >
              <View style={styles.spriteContainer}>
                <Image source={SPRITES.male} style={styles.spriteSheet} resizeMode="stretch" />
              </View>
              <Text style={styles.characterName}>Ronin</Text>
              <Text style={styles.characterDesc}>Masculino</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.characterCard, gender === 'female' && styles.cardSelected]}
              onPress={() => setGender('female')}
            >
              <View style={styles.spriteContainer}>
                <Image source={SPRITES.female} style={styles.spriteSheet} resizeMode="stretch" />
              </View>
              <Text style={styles.characterName}>Ronin</Text>
              <Text style={styles.characterDesc}>Feminino</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirm(gender)}>
            <Text style={styles.confirmButtonText}>Iniciar Jornada</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

// ── Menu principal ─────────────────────────────────────────────────────────────
const MainMenu = ({ navigation }) => {
  const {
    gender, setGender,
    rank, totalXp, rankIndex, jlptLevel,
    hasSave, saveLoaded, lastScreen, kanaPhase,
    saveProgress, resetProgress, toggleDevMode, devMode,
  } = usePlayer();

  const [showGenderSelect, setShowGenderSelect] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Enquanto o save está carregando, mostra loading
  if (!saveLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }]}>
        <ActivityIndicator size="large" color="#ffd700" />
        <Text style={{ color: '#ccc', marginTop: 16, fontSize: 15 }}>Carregando jornada...</Text>
      </View>
    );
  }

  if (showGenderSelect) {
    return (
      <GenderSelectScreen
        gender={gender}
        setGender={setGender}
        onBack={() => setShowGenderSelect(false)}
        onConfirm={async (selectedGender) => {
          await saveProgress({ gender: selectedGender, lastScreen: 'Prologue' });
          navigation.navigate('Prologue');
        }}
      />
    );
  }

  const handleNovaJornada = () => {
    if (hasSave) {
      Alert.alert(
        'Nova Jornada',
        'Iniciar uma nova jornada apagará todo o progresso salvo. Tem certeza?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            style: 'destructive',
            onPress: async () => {
              await resetProgress();
              setShowGenderSelect(true);
            },
          },
        ]
      );
    } else {
      setShowGenderSelect(true);
    }
  };

  const handleContinuar = () => {
    if (!hasSave || !lastScreen) return;
    navigation.navigate(lastScreen);
  };

  const canContinue = hasSave && !!lastScreen;
  const whereLabel  = canContinue ? lastScreenLabel(lastScreen, kanaPhase) : null;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/b5882476-2471-4f38-8d98-99232af57b06.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Japão Quest</Text>
            {devMode && <View style={styles.devBadge}><Text style={styles.devBadgeText}>DEV</Text></View>}
          </View>
          <Text style={styles.subtitle}>A Jornada do Ronin</Text>

          {/* Card de save */}
          {canContinue && (
            <View style={styles.saveCard}>
              <View style={styles.saveCardRow}>
                <Image
                  source={SPRITES[gender]}
                  style={styles.saveSpriteThumb}
                  resizeMode="stretch"
                />
                <View style={styles.saveInfo}>
                  <Text style={styles.saveRank}>{RANKS[rankIndex]}</Text>
                  <Text style={styles.saveJlpt}>JLPT: {jlptLevel}</Text>
                  <Text style={styles.saveXp}>XP Total: {totalXp}</Text>
                  <Text style={styles.saveWhere}>{whereLabel}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleContinuar}>
                <Text style={styles.continueButtonText}>▶  Continuar Jornada</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleNovaJornada}>
              <Text style={styles.buttonText}>
                {canContinue ? '↺  Nova Jornada' : '⚔  Iniciar Jornada'}
              </Text>
            </TouchableOpacity>

            {devMode && (
              <TouchableOpacity
                style={[styles.button, styles.buttonDev]}
                onPress={async () => {
                  await saveProgress({ lastScreen: 'Map', kanaPhase: 'done', jlptLevel: 'N1' });
                  navigation.navigate('Map');
                }}
              >
                <Text style={styles.buttonText}>🔧 Ir para Mapa (Dev)</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => setShowOptions(true)}>
              <Text style={styles.buttonText}>Opções</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Modal de Opções */}
      <Modal visible={showOptions} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsModal} onStartShouldSetResponder={() => true}>
            <Text style={styles.optionsTitle}>⚙️ Opções</Text>
            <View style={styles.optionRow}>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>Modo Desenvolvedor</Text>
                <Text style={styles.optionDesc}>Acesso total a lições e mini-games</Text>
              </View>
              <Switch
                value={devMode}
                onValueChange={async (v) => await toggleDevMode(v)}
                trackColor={{ false: '#444', true: '#ffd70044' }}
                thumbColor={devMode ? '#ffd700' : '#888'}
              />
            </View>
            <TouchableOpacity style={styles.optionsCloseBtn} onPress={() => setShowOptions(false)}>
              <Text style={styles.optionsCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container:  { flex: 1 },
  background: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    flex: 1, width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: {
    fontSize: 48, fontWeight: 'bold', color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'serif',
  },
  devBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  devBadgeText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  subtitle: {
    fontSize: 18, color: '#ddd',
    marginBottom: 28,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // ── Card de save ────────────────────────────────────────────────────────────
  saveCard: {
    width: '90%',
    backgroundColor: 'rgba(20,10,0,0.85)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ffd70066',
    padding: 16,
    marginBottom: 24,
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  saveSpriteThumb: {
    width: 40,
    height: 48,
    marginRight: 14,
    // Mostra apenas o primeiro frame (frente)
    transform: [{ translateX: 0 }],
  },
  saveInfo: { flex: 1 },
  saveRank: {
    color: '#ffd700',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  saveJlpt: {
    color: '#78909c',
    fontSize: 13,
    marginBottom: 2,
  },
  saveXp: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 4,
  },
  saveWhere: {
    color: '#90caf9',
    fontSize: 13,
    fontStyle: 'italic',
  },

  continueButton: {
    backgroundColor: '#8b0000',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffd700',
    paddingVertical: 13,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // ── Botões principais ────────────────────────────────────────────────────────
  buttonContainer: { width: '100%', alignItems: 'center' },
  button: {
    backgroundColor: '#4a0000',
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 14,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffd70066',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderColor: '#ffffff33',
  },
  buttonDev: {
    backgroundColor: '#1a3a1a',
    borderColor: '#4caf5066',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ── Seleção de personagem ────────────────────────────────────────────────────
  characterRow:  { flexDirection: 'row', gap: 24, marginBottom: 32, marginTop: 8 },
  characterCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, borderWidth: 2,
    borderColor: 'rgba(255,215,0,0.4)',
    padding: 16, alignItems: 'center', width: 130,
  },
  cardSelected: {
    borderColor: '#ffd700',
    backgroundColor: 'rgba(255,215,0,0.2)',
  },
  spriteContainer: { width: 80, height: 96, overflow: 'hidden', marginBottom: 10 },
  spriteSheet:     { width: 320, height: 384, position: 'absolute', left: 0, top: 0 },
  characterName:   { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  characterDesc:   { color: '#ccc', fontSize: 13, marginTop: 2 },

  confirmButton: {
    backgroundColor: '#8b0000',
    paddingVertical: 15, paddingHorizontal: 50,
    borderRadius: 8, borderWidth: 2,
    borderColor: '#ffd700', marginBottom: 14,
  },
  confirmButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
  backButton:        { paddingVertical: 10, paddingHorizontal: 30 },
  backButtonText:    { color: '#aaa', fontSize: 14 },

  // ── Modal Opções ────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  optionsModal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#ffd70033',
  },
  optionsTitle: { color: '#ffd700', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  optionTextWrap: { flex: 1 },
  optionLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  optionDesc: { color: '#888', fontSize: 12, marginTop: 2 },
  optionsCloseBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  optionsCloseText: { color: '#ffd700', fontSize: 16 },
});

export default MainMenu;
