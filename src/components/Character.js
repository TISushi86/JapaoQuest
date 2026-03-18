import React, { useEffect, useRef } from 'react';
import { View, Image } from 'react-native';

// Sprite sheet: 4 colunas x 4 linhas, cada frame 80x96px
const SHEET_COLS     = 4;
const SOURCE_FRAME_W = 80;
const SOURCE_FRAME_H = 96;
const DISPLAY_W      = 80;
const DISPLAY_H      = 96;

// Row 0 = frente, Row 1 = costas, Row 2 = direita, Row 3 = esquerda
// Para esquerda usamos Row 2 espelhada (scaleX: -1) pois tem melhor passada
const DIRECTION_ROW = {
  down:  0,
  up:    1,
  right: 2,
  left:  2,
};

// Sequência de frames por direção:
// Cima/baixo: ciclo completo 0→1→2→3
// Lados: ciclo intercalado 0→1→0→3 para evidenciar a troca de pernas
//   c0 = perna neutra, c1 = passada A, c3 = passada B
const WALK_SEQUENCE = {
  down:  [0, 1, 2, 3],
  up:    [0, 1, 2, 3],
  right: [1, 0, 3, 0],
  left:  [1, 0, 3, 0],
};

const WALK_SPEED = {
  down:  150,
  up:    150,
  right: 120,
  left:  120,
};

const SPRITES = {
  male:   require('../assets/ronin_male_ready.png'),
  female: require('../assets/ronin_female_ready.png'),
};

const Character = ({ direction = 'down', isMoving = false, gender = 'male' }) => {
  const seqIdx     = useRef(0);
  const [, setTick] = React.useState(0);

  useEffect(() => {
    seqIdx.current = 0;
    setTick(t => t + 1);
  }, [direction]);

  useEffect(() => {
    let interval;
    if (isMoving) {
      const seq = WALK_SEQUENCE[direction] || WALK_SEQUENCE.down;
      const ms  = WALK_SPEED[direction]    || 150;
      interval = setInterval(() => {
        seqIdx.current = (seqIdx.current + 1) % seq.length;
        setTick(t => t + 1);
      }, ms);
    } else {
      seqIdx.current = 0;
      setTick(t => t + 1);
    }
    return () => clearInterval(interval);
  }, [isMoving, direction]);

  const seq   = WALK_SEQUENCE[direction] || WALK_SEQUENCE.down;
  const col   = isMoving ? seq[seqIdx.current] : 0;
  const row   = DIRECTION_ROW[direction];
  const flipX = direction === 'left' ? -1 : 1;

  return (
    <View style={{
      width: DISPLAY_W,
      height: DISPLAY_H,
      overflow: 'hidden',
      transform: [{ scaleX: flipX }],
    }}>
      <Image
        source={SPRITES[gender] || SPRITES.male}
        style={{
          width:    SOURCE_FRAME_W * SHEET_COLS,
          height:   SOURCE_FRAME_H * 4,
          position: 'absolute',
          left:     -(col * SOURCE_FRAME_W),
          top:      -(row * SOURCE_FRAME_H),
        }}
        resizeMode="stretch"
      />
    </View>
  );
};

export default Character;
