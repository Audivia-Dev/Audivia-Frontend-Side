import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import styles from "@/styles/audio_player"

interface TranscriptItem {
  id: string
  startTime: number
  endTime: number
  text: string
}

interface TranscriptProps {
  items: TranscriptItem[]
  activeId: string
  onItemPress: (startTime: number) => void
  scrollViewRef: React.RefObject<ScrollView>
  formatTime: (seconds: number) => string
}

export default function Transcript({ items, activeId, onItemPress, scrollViewRef, formatTime }: TranscriptProps) {
  return (
    <View style={styles.transcriptContainer}>
      <View style={styles.transcriptHeader}>
        <Text style={styles.transcriptTitle}>Transcript</Text>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.transcriptScroll} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.transcriptItem, activeId === item.id && styles.activeTranscriptItem]}
            onPress={() => onItemPress(item.startTime)}
          >
            <Text style={[styles.transcriptText, activeId === item.id && styles.activeTranscriptText]}>
              {item.text}
            </Text>
            <Text style={styles.transcriptTime}>{formatTime(item.startTime)}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
} 