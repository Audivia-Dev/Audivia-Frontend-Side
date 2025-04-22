import React, { useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FloatingButton = ({ onPress }: { onPress?: () => void }) => {
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - 150 })).current;
  const [currentPosition, setCurrentPosition] = useState({ x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - 150 });

  // Add listener to track current position
  pan.addListener((value) => setCurrentPosition(value));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: currentPosition.x,
          y: currentPosition.y
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        // Snap to edges
        const x = currentPosition.x;
        const y = currentPosition.y;
        
        let finalX = x;
        let finalY = y;

        // Snap to left or right edge
        if (x < SCREEN_WIDTH / 2) {
          finalX = 20;
        } else {
          finalX = SCREEN_WIDTH - 80;
        }

        // Keep the current Y position but ensure it's within bounds
        finalY = Math.max(20, Math.min(finalY, SCREEN_HEIGHT - 80));

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          tension: 50,
          friction: 7
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.floatingButton, pan.getLayout()]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={onPress}>
        <Image source={require('../assets/images/logo.png')} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    zIndex: 999,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
export default FloatingButton;

