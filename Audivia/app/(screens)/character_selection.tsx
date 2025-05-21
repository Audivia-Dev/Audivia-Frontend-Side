import { useState, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.8

const CharacterSelectionScreen = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<number>(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(1)
  const soundRef = useRef<Audio.Sound | null>(null)
  const scaleAnim = useRef(new Animated.Value(1)).current

  const characters = [
    {
      id: 0,
      name: "Viking",
      image: "https://res.cloudinary.com/dgzn2ix8w/image/upload/v1747814934/Audivia/y8yrmmdevcpgwiqsw4xz.png",
      color: "#FF6B6B",
      previewAudio: "https://example.com/viking-preview.mp3",
    },
    {
      id: 1,
      name: "Musician",
      image: "https://res.cloudinary.com/dgzn2ix8w/image/upload/v1747814934/Audivia/y8yrmmdevcpgwiqsw4xz.png",
      color: "#4ECDC4",
      previewAudio: "https://example.com/musician-preview.mp3",
    },
    {
      id: 2,
      name: "Surfer",
      image: "https://res.cloudinary.com/dgzn2ix8w/image/upload/v1747814934/Audivia/y8yrmmdevcpgwiqsw4xz.png",
      color: "#C7F464",
      previewAudio: "https://example.com/surfer-preview.mp3",
    },
  ]

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync()
      await soundRef.current.unloadAsync()
      soundRef.current = null
    }
    setIsPlaying(false)
  }

  const playPreview = async (character: typeof characters[0]) => {
    try {
      setIsLoading(true)
      await stopAudio()
      const { sound } = await Audio.Sound.createAsync({ uri: character.previewAudio }, { shouldPlay: true })
      soundRef.current = sound
      setIsPlaying(true)
      setIsLoading(false)
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsLoading(false)
      setIsPlaying(false)
    }
  }

  const handleSelectCharacter = (index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    setSelectedCharacter(index)
    setCurrentSlide(index)
  }

  const handleNext = () => {
    const nextIndex = (currentSlide + 1) % characters.length
    handleSelectCharacter(nextIndex)
  }

  const handlePrevious = () => {
    const prevIndex = (currentSlide - 1 + characters.length) % characters.length
    handleSelectCharacter(prevIndex)
  }

  const handleAudioToggle = async (character: typeof characters[0]) => {
    if (isPlaying && selectedCharacter === character.id) {
      await stopAudio()
    } else {
      await playPreview(character)
      setSelectedCharacter(character.id)
    }
  }

  const currentCharacter = characters[currentSlide]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Guide</Text>
        <Text style={styles.subtitle}>Select a voice companion for your journey</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.arrowButton} onPress={handlePrevious}>
          <Ionicons name="chevron-back" size={32} color={COLORS.dark} />
        </TouchableOpacity>

        <Animated.View
          style={[styles.card, { width: CARD_WIDTH }, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={[styles.characterContainer, { backgroundColor: `${currentCharacter.color}30` }]}>
            <Image source={{ uri: currentCharacter.image }} style={styles.characterImage} resizeMode="contain" />

            <TouchableOpacity
              style={[styles.audioButton, { backgroundColor: currentCharacter.color }]}
              onPress={() => handleAudioToggle(currentCharacter)}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : isPlaying && selectedCharacter === currentCharacter.id ? (
                <Ionicons name="pause" size={24} color="#FFFFFF" />
              ) : (
                <Ionicons name="play" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.characterLabel}>Choose personality</Text>

          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: currentCharacter.color }]}
            onPress={() => handleSelectCharacter(currentCharacter.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectButtonText}>This one</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.arrowButton} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.pagination}>
        {characters.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.paginationDot, currentSlide === index && styles.paginationDotActive]}
            onPress={() => handleSelectCharacter(index)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.dark,
    opacity: 0.8,
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: "rgba(102, 142, 185, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: CARD_WIDTH,
    aspectRatio: 0.8,
  },
  characterContainer: {
    width: "100%",
    aspectRatio: 1.2,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
    padding: 10,
  },
  characterImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  audioButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  characterLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4B5563",
    marginBottom: 24,
  },
  selectButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 16,
    backgroundColor: "#38BDF8",
  },
})

export default CharacterSelectionScreen
