import { Video, ResizeMode } from "expo-av";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { COLORS } from "@/constants/theme";

interface AudioImageProps {
  videoUrl: string;
}

export default function AudioVideo({ videoUrl }: AudioImageProps) {
  const [isBuffering, setIsBuffering] = useState(false);

  return (
    <View style={styles.audioImageContainer}>
      <Video
        source={{ uri: videoUrl }}
        style={styles.audioImage}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        useNativeControls
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded) {
            setIsBuffering(status.isBuffering);
          }
        }}
      />
      {isBuffering && (
        <View style={styles.bufferingOverlay}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      )}
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]}
        style={styles.imageGradient}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  audioImageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
    overflow: "hidden",
    backgroundColor: '#000',
  },
  audioImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
});
