import { View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "@/styles/audio_player"
import { COLORS } from "@/constants/theme"

interface PlayerControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
}

export default function PlayerControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
}: PlayerControlsProps) {
  return (
    <View style={styles.playerContainer}>
      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={onPrevious}>
          <Ionicons name="play-skip-back" size={28} color={COLORS.darkGrey} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playPauseButton} onPress={onPlayPause}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={onNext}>
          <Ionicons name="play-skip-forward" size={28} color={COLORS.darkGrey} />
        </TouchableOpacity>
      </View>
    </View>
  )
} 