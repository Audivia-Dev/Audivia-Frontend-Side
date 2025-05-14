import React from "react";
import { View, Image, Animated } from "react-native";
import { styles } from "@/styles/chatbox.styles";

interface TypingIndicatorProps {
  avatar: any;
  animation: Animated.Value;
}

export const TypingIndicator = ({ avatar, animation }: TypingIndicatorProps) => {
  return (
    <View style={styles.typingContainer}>
      <Image source={avatar} style={styles.typingAvatar} />
      <View style={styles.typingBubble}>
        <Animated.View
          style={[
            styles.typingDot,
            {
              opacity: animation,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            {
              opacity: animation,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            {
              opacity: animation,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}; 