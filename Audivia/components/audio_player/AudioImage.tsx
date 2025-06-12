import { Video, ResizeMode } from "expo-av";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AudioImageProps {
  videoUrl: string;
}

export default function AudioVideo({ videoUrl }: AudioImageProps) {
  return (
    <View style={styles.audioImageContainer}>
      <Video
        source={{ uri: videoUrl }}
        style={styles.audioImage}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]}
        style={styles.imageGradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  audioImageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    overflow: "hidden",
  },
  audioImage: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
