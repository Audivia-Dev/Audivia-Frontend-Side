import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { COLORS } from "@/constants/theme"
import { styles } from "@/styles/chatbox.styles"

// Dữ liệu mẫu cho tin nhắn
const MESSAGES = [
  {
    id: "1",
    text: "Xin chào! Tôi là Audy, trợ lý ảo của Audivia. Tôi có thể giúp gì cho bạn về các tour du lịch?",
    time: "10:30",
    isBot: true,
    isNew: false,
  },
  {
    id: "2",
    text: "Chào Audy, tôi muốn tìm hiểu về tour Nhà Văn hóa ĐHQG TP.HCM",
    time: "10:31",
    isBot: false,
    isNew: false,
  },
  {
    id: "3",
    text: "Tuyệt vời! Tour Nhà Văn hóa ĐHQG TP.HCM là một tour miễn phí kéo dài khoảng 40 phút. Tour này sẽ đưa bạn tham quan 6 địa điểm chính trong khuôn viên, bao gồm thư viện, không gian triển lãm và khu vực ngoài trời.",
    time: "10:32",
    isBot: true,
    isNew: false,
  },
  {
    id: "4",
    text: "Tour này có những điểm gì đặc biệt?",
    time: "10:33",
    isBot: false,
    isNew: false,
  },
  {
    id: "5",
    text: "Tour này có nhiều điểm đặc biệt như:\n\n• Kiến trúc hiện đại kết hợp với không gian xanh\n• Bộ sưu tập sách phong phú tại thư viện\n• Các triển lãm nghệ thuật và văn hóa thường xuyên thay đổi\n• Không gian học tập và làm việc nhóm tiện nghi\n• Khu vực ngoài trời với cảnh quan đẹp",
    time: "10:34",
    isBot: true,
    isNew: false,
  },
]

export default function ChatScreen() {
  const [messages, setMessages] = useState(MESSAGES)
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const flatListRef = useRef<FlatList<any>>(null)
  const typingAnimation = useRef(new Animated.Value(0)).current
  const router = useRouter()

  useEffect(() => {
    // Tự động cuộn xuống tin nhắn mới nhất
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  useEffect(() => {
    // Hiệu ứng "đang nhập" khi isTyping = true
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      typingAnimation.setValue(0)
    }
  }, [isTyping])

  const goBack = () => {
    router.back()
  }

  const sendMessage = () => {
    if (inputText.trim() === "") return

    // Thêm tin nhắn của người dùng
    const newUserMessage = {
      id: String(messages.length + 1),
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isBot: false,
      isNew: true,
    }

    setMessages([...messages, newUserMessage])
    setInputText("")

    // Giả lập bot đang nhập
    setIsTyping(true)

    // Giả lập phản hồi từ bot sau 1-2 giây
    setTimeout(
      () => {
        setIsTyping(false)

        const botResponses = [
          "Tôi hiểu rồi! Để tôi kiểm tra thông tin cho bạn nhé.",
          "Cảm ơn bạn đã hỏi. Đây là thông tin bạn cần biết về tour này.",
          "Tôi sẽ giúp bạn sắp xếp chuyến đi này. Bạn có yêu cầu đặc biệt nào không?",
          "Tour này rất phổ biến! Tôi khuyên bạn nên đặt trước ít nhất 1 ngày.",
          "Bạn có thể tìm thêm thông tin chi tiết trong phần mô tả tour nhé.",
        ]

        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

        const newBotMessage = {
          id: String(messages.length + 2),
          text: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isBot: true,
          isNew: true,
        }

        setMessages((prevMessages) => [...prevMessages, newBotMessage])
      },
      1000 + Math.random() * 1000,
    )
  }

  const renderMessage = ({ item }: { item: any }) => {
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          item.isBot ? styles.botMessageContainer : styles.userMessageContainer,
          item.isNew && { opacity: 1, transform: [{ translateY: 0 }] },
        ]}
      >
        {item.isBot && (
          <Image source={require("@/assets/images/logo.png")} style={styles.botAvatar} />
        )}
        <View style={[styles.messageBubble, item.isBot ? styles.botMessageBubble : styles.userMessageBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>Audy - Trợ lý du lịch</Text>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/5229/5229537.png" }}
            style={styles.typingAvatar}
          />
          <View style={styles.typingBubble}>
            <Animated.View
              style={[
                styles.typingDot,
                {
                  opacity: typingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                {
                  opacity: typingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                {
                  opacity: typingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.emojiButton}>
            <Ionicons name="happy-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : {}]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color={inputText.trim() ? "#fff" : "#999"} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

