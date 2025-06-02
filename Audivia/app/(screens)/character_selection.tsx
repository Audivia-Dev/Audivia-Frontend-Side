import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
} from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { getCharacters } from "@/services/character"
import { updateAudioCharacterId } from "@/services/historyTransaction"
import styles from "@/styles/character_selection"
import { router, useLocalSearchParams } from "expo-router"
import { useUser } from "@/hooks/useUser"
import { checkUserPurchasedTour } from "@/services/historyTransaction"
import { LinearGradient } from "expo-linear-gradient"
import MaskedView from "@react-native-masked-view/masked-view"

const CharacterSelectionScreen = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [characters, setCharacters] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const soundRef = useRef<Audio.Sound | null>(null)
  const scaleAnim = useRef(new Animated.Value(1)).current
  const {user} = useUser()
  const {tourId} = useLocalSearchParams()
  const [userTourId, setUserTourId] = useState(null)

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setIsLoadingData(true)
        const response = await getCharacters()
        if (response) {
          setCharacters(response)
          if (response.length > 0) {
            setSelectedCharacter(response[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching characters:", error)
      } finally {
        setIsLoadingData(false)
      }
    }
    fetchCharacters()
    if (user?.id && tourId) {
      checkIfUserPurchasedTour()
    }
  }, [user, tourId])

  const checkIfUserPurchasedTour = async () => {
    if (!user?.id) return
    console.log('USER', user.id, 'TOUR', tourId)
    const response = await checkUserPurchasedTour(user?.id, tourId as string)
    console.log('HEHE',response)
    setUserTourId(response.id)
  }
  const handleBack = () => {
    router.back()
  }
  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync()
      await soundRef.current.unloadAsync()
      soundRef.current = null
    }
    setIsPlaying(false)
  }

  const playPreview = async (character: any) => {
    try {
      setIsLoading(true)
      await stopAudio()
      const { sound } = await Audio.Sound.createAsync({ uri: character.audioUrl }, { shouldPlay: true })
      soundRef.current = sound
      setIsPlaying(true)
      setIsLoading(false)
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsLoading(false)
      setIsPlaying(false)
    }
  }

  const handleSelectCharacter = async (index: number) => {
    if (index < 0 || index >= characters.length) return

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

    const characterId = characters[index].id
    setSelectedCharacter(characterId)
    setCurrentSlide(index)
    setIsPlaying(false)
  }

  const handleConfirmSelection = async () => {
    try {
      if (!userTourId) {
        console.error("No user tour ID found")
        return
      }
      const characterId = characters[currentSlide].id
      console.log('Updating character:', { userTourId, characterId })
      await updateAudioCharacterId(userTourId, characterId)
      router.push(`/tour_audio?tourId=${tourId}`)
    } catch (error) {
      console.error("Error updating audio character:", error)
    }
  }

  const handleNext = () => {
    if (characters.length === 0) return
    const nextIndex = (currentSlide + 1) % characters.length
    handleSelectCharacter(nextIndex)
  }

  const handlePrevious = () => {
    if (characters.length === 0) return
    const prevIndex = (currentSlide - 1 + characters.length) % characters.length
    handleSelectCharacter(prevIndex)
  }

  const handleAudioToggle = async (character: any) => {
    if (isPlaying && selectedCharacter === character.id) {
      await stopAudio()
    } else {
      await playPreview(character)
      setSelectedCharacter(character.id)
    }
  }

  if (isLoadingData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.dark} />
      </View>
    )
  }

  if (characters.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Không có nhân vật nào</Text>
      </View>
    )
  }

  const currentCharacter = characters[currentSlide]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <MaskedView maskElement={
          <Text style={[styles.title, { backgroundColor: 'transparent' }]}>
            Chọn nhân vật
          </Text>
        }>
          <LinearGradient
            colors={[COLORS.primary, COLORS.purpleGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}>
            <Text style={[styles.title, { opacity: 0 }]}>
            Chọn nhân vật
            </Text>
          </LinearGradient>
        </MaskedView>
        <Text style={styles.subtitle}>Chọn nhân vật bạn muốn cùng đồng hành</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.arrowButton} onPress={handlePrevious}>
          <Ionicons name="chevron-back" size={32} color={COLORS.dark} />
        </TouchableOpacity>

        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={[styles.characterContainer, { backgroundColor: `${COLORS.primary}30` }]}>
            <Image source={{ uri: currentCharacter.avatarUrl }} style={styles.characterImage} resizeMode="contain" />

            <TouchableOpacity
              style={[styles.audioButton, { backgroundColor: COLORS.primary }]}
              onPress={() => handleAudioToggle(currentCharacter)}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : isPlaying && selectedCharacter === currentCharacter.id ? (
                <Ionicons name="pause" size={24} color={COLORS.white} />
              ) : (
                <Ionicons name="play" size={24} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.characterName}>{currentCharacter.name}</Text>
          <Text style={styles.characterDescription}>{currentCharacter.description}</Text>
          <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.selectButton}
            >
              <TouchableOpacity onPress={handleConfirmSelection}>
                <Text style={styles.selectButtonText}>Chọn</Text>
              </TouchableOpacity>
            </LinearGradient>
        </Animated.View>

        <TouchableOpacity style={styles.arrowButton} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={32} color={COLORS.dark} />
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


export default CharacterSelectionScreen
