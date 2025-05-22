import { useState, useEffect } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, View } from "react-native"
import styles from "@/styles/audio_player"
import AudioHeader from "../../components/audio_player/AudioHeader"
import AudioImage from "../../components/audio_player/AudioImage"
import PlayerControls from "../../components/audio_player/PlayerControls"
import Transcript from "../../components/audio_player/Transcript"
import { router, useLocalSearchParams } from "expo-router"
import { Audio } from "expo-av"
import { getNextAudioByCheckpointId, getPrevAudioByCheckpointId, getTourAudioByCheckpointId } from "@/services/tour"

export default function AudioPlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const {checkpointId } = useLocalSearchParams()
  const { characterId } = useLocalSearchParams()
  const [audioData, setAudioData] = useState(null)

  useEffect(() => {
    const fetchAudioData = async () => {
      const response = await getTourAudioByCheckpointId(checkpointId as string, characterId as string)
      console.log('AUDIO', response.response)
      if (response) setAudioData(response.response)
    }
    fetchAudioData()
  }, [checkpointId])

  // Load audio khi audioData thay đổi
  useEffect(() => {
    let isMounted = true
    const loadSound = async () => {
      if (!audioData?.fileUrl) return
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioData.fileUrl },
        { shouldPlay: false },
      )
      if (isMounted) setSound(sound)
    }
    loadSound()
    return () => {
      isMounted = false
      if (sound) sound.unloadAsync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioData])

  const togglePlayPause = async () => {
    if (!sound) return
    if (isPlaying) {
      await sound.pauseAsync()
      setIsPlaying(false)
    } else {
      await sound.playAsync()
      setIsPlaying(true)
    }
  }

  const handleNextAudio = async () => {
   const res = await getNextAudioByCheckpointId(checkpointId as string)
    if (res.response) {
      setAudioData(res.response)
  }
}
  const handlePrevAudio = async () => {
    const res = await getPrevAudioByCheckpointId(checkpointId as string)
    if (res.response) {
      setAudioData(res.response)
    }
  }

  const handleBack = () => {
    router.back()
  }

  // Chỉ render khi đã có audioData
  if (!audioData) {
    return (
      <SafeAreaView style={styles.container}>
        <AudioHeader onBackPress={handleBack} checkpointId={checkpointId as string}/>
       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <AudioHeader onBackPress={handleBack} checkpointId={checkpointId as string}/>
      <AudioImage imageUrl={audioData?.image} />
      <PlayerControls 
      isPlaying={isPlaying} 
      onPlayPause={togglePlayPause} 
      onNext={() => handleNextAudio()} 
      onPrevious={() => handlePrevAudio()}/>
      <ScrollView style={{ flex: 1, margin: 20 }} showsVerticalScrollIndicator={false}>
        <Transcript text={audioData?.transcript} />
      </ScrollView>
    </SafeAreaView>
  )
}

