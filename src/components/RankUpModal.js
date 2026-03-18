import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export default function RankUpModal({ visible, newRank, onDismiss }) {
  if (!visible || !newRank) return null;

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
          <Text style={styles.icon}>⭐</Text>
          <Text style={styles.title}>Evolução!</Text>
          <Text style={styles.message}>
            Parabéns! Você evoluiu para
          </Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{newRank}</Text>
          </View>
          <Text style={styles.submessage}>
            Continue sua jornada para recuperar suas memórias!
          </Text>
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
    borderColor: '#ffd700',
    minWidth: 280,
  },
  icon: { fontSize: 56, marginBottom: 12 },
  title: {
    color: '#ffd700',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    backgroundColor: '#ffd70022',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffd700',
    marginBottom: 16,
  },
  rankText: {
    color: '#ffd700',
    fontSize: 22,
    fontWeight: 'bold',
  },
  submessage: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  btn: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
