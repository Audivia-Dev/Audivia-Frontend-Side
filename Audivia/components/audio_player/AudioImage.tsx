import { View, Image, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import styles from "@/styles/audio_player"

interface AudioImageProps {
  imageUrl: string
  title: string
}

export default function AudioImage({ imageUrl, title }: AudioImageProps) {
  return (
    <View style={styles.audioImageContainer}>
      <Image source={{ uri: imageUrl }} style={styles.audioImage} />
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]}
        style={styles.imageGradient}
      />
      <View style={styles.audioInfo}>
        <Text style={styles.audioTitle}>{title}</Text>
      </View>
    </View>
  )
} 