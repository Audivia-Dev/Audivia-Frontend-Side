import { View, TouchableOpacity, Text, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "@/styles/audio_player"
import { COLORS } from "@/constants/theme"

interface PlayerControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  progressWidth: Animated.AnimatedInterpolation<string>
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

export default function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  progressWidth,
  onPlayPause,
  onPrevious,
  onNext,
}: PlayerControlsProps) {
  return (
    <View style={styles.playerContainer}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={onPrevious}>
          <Ionicons name="play-skip-back" size={28} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playPauseButton} onPress={onPlayPause}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={onNext}>
          <Ionicons name="play-skip-forward" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  )
} 