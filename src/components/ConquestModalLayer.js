import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import ConquestModal from './ConquestModal';

/** Camada global que exibe o modal de conquista quando o jogador avança de nível */
export default function ConquestModalLayer() {
  const { conquestMessage, clearConquest } = usePlayer();
  return (
    <ConquestModal
      visible={!!conquestMessage}
      conquestType={conquestMessage}
      onDismiss={clearConquest}
    />
  );
}
