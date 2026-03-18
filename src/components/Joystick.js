import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';

const CIRCLE_RADIUS = 60;
const KNOB_RADIUS = 30;
const MAX_DISTANCE = CIRCLE_RADIUS - KNOB_RADIUS;

const Joystick = ({ onMove }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        {
          useNativeDriver: false,
          listener: (event, gestureState) => {
            const { dx, dy } = gestureState;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            let x = dx;
            let y = dy;

            // Limitar o movimento ao raio do círculo
            if (distance > MAX_DISTANCE) {
              const ratio = MAX_DISTANCE / distance;
              x *= ratio;
              y *= ratio;
            }

            // Normalizar vetor (0 a 1) para o callback
            const normalizedX = x / MAX_DISTANCE;
            const normalizedY = y / MAX_DISTANCE;
            
            if (onMove) {
              onMove({ x: normalizedX, y: normalizedY });
            }
          }
        }
      ),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5
        }).start();
        
        if (onMove) {
          onMove({ x: 0, y: 0 });
        }
      },
    })
  ).current;

  // Limitar visualmente o knob
  const knobPosition = {
    transform: [
      {
        translateX: pan.x.interpolate({
          inputRange: [-1000, 1000],
          outputRange: [-1000, 1000],
          extrapolate: 'clamp', // A lógica JS já limita, mas isso é backup
        })
      },
      {
        translateY: pan.y.interpolate({
          inputRange: [-1000, 1000],
          outputRange: [-1000, 1000],
          extrapolate: 'clamp',
        })
      }
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Animated.View
          style={[styles.knob, knobPosition]}
          {...panResponder.panHandlers}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  knob: {
    width: KNOB_RADIUS * 2,
    height: KNOB_RADIUS * 2,
    borderRadius: KNOB_RADIUS,
    backgroundColor: '#8b0000', // Vermelho Japão
    borderWidth: 2,
    borderColor: '#ffd700', // Dourado
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Joystick;
