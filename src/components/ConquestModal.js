import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const LEVEL_UNLOCK_MESSAGES = {
  N5: { icon: '🌱', message: 'Nível N5 desbloqueado!', submessage: 'A Vila Kakurega está aberta. Complete as lições N5 e vença a batalha para desbloquear o próximo nível.' },
  N4: { icon: '⚓', message: 'Nível N4 desbloqueado!', submessage: 'A Cidade do Porto aguarda. Novas lições e desafios estão disponíveis.' },
  N3: { icon: '🏯', message: 'Nível N3 desbloqueado!', submessage: 'A Capital Imperial está aberta. Continue sua jornada.' },
  N2: { icon: '⚔️', message: 'Nível N2 desbloqueado!', submessage: 'A Fortaleza do Sul está acessível. O desafio aumenta.' },
  N1: { icon: '👹', message: 'Nível N1 desbloqueado!', submessage: 'O Castelo de Kurokami aguarda. O desafio final está próximo.' },
};

export default function ConquestModal({ visible, conquestType, onDismiss }) {
  if (!visible || !conquestType) return null;

  let content = { icon: '⭐', title: 'Nível Desbloqueado!', message: '', submessage: '' };
  if (conquestType.startsWith('level_unlocked:')) {
    const level = conquestType.replace('level_unlocked:', '');
    const levelContent = LEVEL_UNLOCK_MESSAGES[level];
    if (levelContent) {
      content = { ...levelContent, title: 'Nível Desbloqueado!' };
    }
  } else if (conquestType === 'kanji_battle_unlocked') {
    content = {
      icon: '⚔️',
      title: 'Conquista!',
      message: 'Você completou o nível básico!',
      submessage: 'Agora você está apto a batalhar com os kanjis na Vila Kakurega.',
    };
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <View style={styles.card}>
          <Text style={styles.icon}>{content.icon}</Text>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.message}>{content.message}</Text>
          <Text style={styles.submessage}>{content.submessage}</Text>
          <TouchableOpacity style={styles.btn} onPress={onDismiss}>
            <Text style={styles.btnText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4caf50',
    minWidth: 280,
  },
  icon: { fontSize: 56, marginBottom: 12 },
  title: {
    color: '#4caf50',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  submessage: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  btn: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
