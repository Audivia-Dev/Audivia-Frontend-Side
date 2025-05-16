import { useState, useEffect, useRef } from "react"
import { SafeAreaView, StatusBar, ScrollView, Animated, Dimensions } from "react-native"
import styles from "@/styles/audio_player"
import AudioHeader from "../../components/audio_player/AudioHeader"
import AudioImage from "../../components/audio_player/AudioImage"
import PlayerControls from "../../components/audio_player/PlayerControls"
import Transcript from "../../components/audio_player/Transcript"
import { router } from "expo-router"

const { width } = Dimensions.get("window")

const COLORS = {
  primary: "#00BCD4",
  secondary: "#4CAF50",
  background: "#f8f8f8",
  white: "#FFFFFF",
  text: "#333333",
  textLight: "#666666",
  border: "#EEEEEE",
  transcript: "#F5F5F5",
  transcriptActive: "#E3F2FD",
}

// Dữ liệu mẫu cho audio
const AUDIO_DATA = {
  title: "Introduction to VNU Cultural House",
  speaker: "Tour Guide",
  duration: 180, // seconds
  image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?q=80&w=1000&auto=format&fit=crop",
  transcript: [
    {
      id: "1",
      startTime: 0,
      endTime: 15,
      text: "Xin chào và chào mừng bạn đến với Nhà Văn hóa ĐHQG TP.HCM. Tôi là hướng dẫn viên ảo của bạn và hôm nay tôi sẽ đưa bạn tham quan công trình kiến trúc độc đáo này.",
    },
    {
      id: "2",
      startTime: 15,
      endTime: 30,
      text: "Nhà Văn hóa ĐHQG TP.HCM được khánh thành vào năm 2010 và là một trong những công trình biểu tượng của Đại học Quốc gia TP.HCM. Với thiết kế hiện đại và đa chức năng, đây là nơi diễn ra nhiều hoạt động văn hóa, nghệ thuật và học thuật quan trọng.",
    },
    {
      id: "3",
      startTime: 30,
      endTime: 45,
      text: "Tòa nhà có diện tích sử dụng hơn 5.000 mét vuông, bao gồm nhiều không gian chức năng như hội trường lớn, phòng triển lãm, thư viện, và các phòng đa năng phục vụ cho các hoạt động sinh viên.",
    },
    {
      id: "4",
      startTime: 45,
      endTime: 60,
      text: "Điểm nổi bật trong thiết kế của Nhà Văn hóa là mặt tiền với các thanh chắn nắng bằng kim loại, tạo nên một hình ảnh hiện đại nhưng vẫn hài hòa với không gian xung quanh. Thiết kế này không chỉ mang tính thẩm mỹ mà còn giúp điều hòa ánh sáng và nhiệt độ bên trong tòa nhà.",
    },
    {
      id: "5",
      startTime: 60,
      endTime: 75,
      text: "Khi bước vào bên trong, bạn sẽ thấy sảnh chính rộng lớn với trần cao, tạo cảm giác thoáng đãng và sang trọng. Đây là nơi thường xuyên diễn ra các triển lãm nghệ thuật và sự kiện văn hóa của sinh viên.",
    },
    {
      id: "6",
      startTime: 75,
      endTime: 90,
      text: "Hội trường chính của Nhà Văn hóa có sức chứa lên đến 500 người, được trang bị hệ thống âm thanh, ánh sáng hiện đại, đáp ứng nhu cầu tổ chức các sự kiện lớn như hội nghị, hội thảo, biểu diễn nghệ thuật.",
    },
    {
      id: "7",
      startTime: 90,
      endTime: 105,
      text: "Bên cạnh đó, tòa nhà còn có nhiều phòng học và phòng sinh hoạt nhóm, nơi sinh viên có thể tổ chức các hoạt động câu lạc bộ, học nhóm hoặc thảo luận chuyên đề.",
    },
    {
      id: "8",
      startTime: 105,
      endTime: 120,
      text: "Thư viện trong Nhà Văn hóa là một không gian yên tĩnh với nhiều tài liệu quý giá, sách báo và tạp chí chuyên ngành, phục vụ nhu cầu học tập và nghiên cứu của sinh viên và giảng viên.",
    },
    {
      id: "9",
      startTime: 120,
      endTime: 135,
      text: "Khu vực triển lãm thường xuyên trưng bày các tác phẩm nghệ thuật, thành tựu khoa học và các dự án sáng tạo của sinh viên, tạo điều kiện cho việc giao lưu và chia sẻ kiến thức.",
    },
    {
      id: "10",
      startTime: 135,
      endTime: 150,
      text: "Nhà Văn hóa ĐHQG TP.HCM không chỉ là một công trình kiến trúc đẹp mắt mà còn là biểu tượng của sự phát triển và hội nhập của giáo dục đại học Việt Nam trong khu vực và trên thế giới.",
    },
    {
      id: "11",
      startTime: 150,
      endTime: 165,
      text: "Hàng năm, nơi đây đón tiếp hàng nghìn lượt khách tham quan, bao gồm sinh viên, giảng viên, nhà nghiên cứu và khách quốc tế, góp phần quảng bá hình ảnh của Đại học Quốc gia TP.HCM.",
    },
    {
      id: "12",
      startTime: 165,
      endTime: 180,
      text: "Cảm ơn bạn đã lắng nghe phần giới thiệu về Nhà Văn hóa ĐHQG TP.HCM. Hãy tiếp tục khám phá các khu vực khác trong tour của chúng ta.",
    },
  ],
}

export default function AudioPlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeTranscriptId, setActiveTranscriptId] = useState("1")
  const progressAnimation = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)

  // Giả lập việc phát audio
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 1
          if (newTime >= AUDIO_DATA.duration) {
            if (interval) clearInterval(interval)
            setIsPlaying(false)
            return 0
          }
          return newTime
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  // Cập nhật transcript đang active
  useEffect(() => {
    const activeTranscript = AUDIO_DATA.transcript.find(
      (item) => currentTime >= item.startTime && currentTime < item.endTime,
    )
    if (activeTranscript && activeTranscript.id !== activeTranscriptId) {
      setActiveTranscriptId(activeTranscript.id)

      // Tự động cuộn đến transcript đang active
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: Number.parseInt(activeTranscript.id) * 80 - 120,
          animated: true,
        })
      }
    }
  }, [currentTime, activeTranscriptId])

  // Cập nhật thanh progress
  useEffect(() => {
    const progress = currentTime / AUDIO_DATA.duration
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start()
  }, [currentTime, progressAnimation])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    const currentIndex = AUDIO_DATA.transcript.findIndex((item) => item.id === activeTranscriptId)
    if (currentIndex > 0) {
      const prevTranscript = AUDIO_DATA.transcript[currentIndex - 1]
      setCurrentTime(prevTranscript.startTime)
    } else {
      setCurrentTime(0)
    }
  }

  const handleNext = () => {
    const currentIndex = AUDIO_DATA.transcript.findIndex((item) => item.id === activeTranscriptId)
    if (currentIndex < AUDIO_DATA.transcript.length - 1) {
      const nextTranscript = AUDIO_DATA.transcript[currentIndex + 1]
      setCurrentTime(nextTranscript.startTime)
    }
  }

  const handleTranscriptPress = (startTime: number) => {
    setCurrentTime(startTime)
    if (!isPlaying) {
      setIsPlaying(true)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  })
  const handleBack =() => {
    router.back()
  }
  return (
    <SafeAreaView style={styles.container}>
      <AudioHeader onBackPress={handleBack} />
      
      <AudioImage
        imageUrl={AUDIO_DATA.image}
        title={AUDIO_DATA.title}
      />

      <PlayerControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={AUDIO_DATA.duration}
        progressWidth={progressWidth}
        onPlayPause={togglePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <Transcript
        items={AUDIO_DATA.transcript}
        activeId={activeTranscriptId}
        onItemPress={handleTranscriptPress}
        scrollViewRef={scrollViewRef}
        formatTime={formatTime}
      />
    </SafeAreaView>
  )
}

