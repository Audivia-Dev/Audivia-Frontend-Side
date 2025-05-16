import { View, TouchableOpacity, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "@/styles/audio_player"

interface AudioHeaderProps {
  onBackPress?: () => void
  onMenuPress?: () => void
}

export default function AudioHeader({ onBackPress, onMenuPress }: AudioHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>Audio Player</Text>
      </View>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
} 