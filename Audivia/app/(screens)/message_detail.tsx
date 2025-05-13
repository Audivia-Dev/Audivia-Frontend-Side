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

const MESSAGES = [
  {
    id: "1",
    text: "Chào bạn, cuối tuần này bạn có rảnh không?",
    time: "10:30",
    senderId: "user2",
    senderName: "Minh Anh",
    senderAvatar: require("@/assets/images/avatar.jpg"),
    isNew: false,
  },
  {
    id: "2",
    text: "Chào Minh Anh, mình rảnh đấy. Có gì không?",
    time: "10:31",
    senderId: "user1", // current user
    senderName: "Tôi",
    senderAvatar: null,
    isNew: false,
  },
  {
    id: "3",
    text: "Mình đang nghĩ đến việc đi tham quan Nhà Văn hóa ĐHQG TP.HCM. Nghe nói ở đó có triển lãm mới, bạn có muốn đi cùng không?",
    time: "10:32",
    senderId: "user2",
    senderName: "Minh Anh",
    senderAvatar: require("@/assets/images/avatar.jpg"),
    isNew: false,
  },
  {
    id: "4",
    text: "Nghe hay đấy! Mấy giờ và hẹn ở đâu?",
    time: "10:33",
    senderId: "user1", // current user
    senderName: "Tôi",
    senderAvatar: null,
    isNew: false,
  },
  {
    id: "5",
    text: "Mình nghĩ khoảng 2h chiều thứ 7 nhé. Mình có thể đón bạn ở trạm xe buýt gần nhà bạn.",
    time: "10:34",
    senderId: "user2",
    senderName: "Minh Anh",
    senderAvatar: require("@/assets/images/avatar.jpg"),
    isNew: false,
  },
]

// Chat details - can be for 1-on-1 or group chat
const CHAT_DETAILS = {
  id: "chat123",
  name: "Minh Anh", // For 1-on-1 chat, this is the friend's name
  avatar: require("@/assets/images/avatar.jpg"), // Friend's avatar
  isOnline: true,
  lastSeen: "Vừa truy cập",
  isGroup: false, // Set to true for group chat
  // For group chats, you can add:
  // members: [{id: "user1", name: "Name 1"}, {id: "user2", name: "Name 2"}],
}

export default function MessageDetailScreen() {
  const [messages, setMessages] = useState(MESSAGES)
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const flatListRef = useRef<FlatList<any>>(null)
  const typingAnimation = useRef(new Animated.Value(0)).current
  const router = useRouter()
  const currentUserId = "user1" // This would normally come from authentication

  useEffect(() => {
    // Auto-scroll to the latest message
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  useEffect(() => {
    // Typing indicator animation
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

  // Simulate the other person typing occasionally
  useEffect(() => {
    const randomTyping = () => {
      if (Math.random() > 0.7) {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 2000 + Math.random() * 3000)
      }
    }
    
    const typingInterval = setInterval(randomTyping, 10000)
    return () => clearInterval(typingInterval)
  }, [])

  const goBack = () => {
    router.back()
  }

  const sendMessage = () => {
    if (inputText.trim() === "") return

    // Add user's message
    const newUserMessage = {
      id: String(Date.now()),
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      senderId: currentUserId,
      senderName: "Tôi",
      senderAvatar: null,
      isNew: true,
    }

    setMessages([...messages, newUserMessage])
    setInputText("")

    // Simulate friend typing (only sometimes)
    if (Math.random() > 0.3) {
      setIsTyping(true)
      
      // Simulate friend's response after a random delay
      setTimeout(() => {
        setIsTyping(false)
        
        const friendResponses = [
          "Được đấy! Mình sẽ chuẩn bị trước nhé.",
          "Tuyệt vời! Mình đang rất háo hức.",
          "Ok bạn, vậy hẹn gặp lại nhé!",
          "Mình sẽ mang theo máy ảnh để chụp hình.",
          "Bạn có muốn rủ thêm ai không?",
        ]
        
        const randomResponse = friendResponses[Math.floor(Math.random() * friendResponses.length)]
        
        const newFriendMessage = {
          id: String(Date.now() + 1),
          text: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          senderId: "user2",
          senderName: CHAT_DETAILS.name,
          senderAvatar: CHAT_DETAILS.avatar,
          isNew: true,
        }
        
        setMessages(prev => [...prev, newFriendMessage])
      }, 1000 + Math.random() * 3000)
    }
  }

  const renderMessage = ({ item }: { item: any }) => {
    const isCurrentUser = item.senderId === currentUserId
    
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.userMessageContainer : styles.friendMessageContainer,
          item.isNew && { opacity: 1, transform: [{ translateY: 0 }] },
        ]}
      >
        {!isCurrentUser && (
          <Image 
            source={item.senderAvatar || require("@/assets/images/avatar.jpg")} 
            style={styles.friendAvatar} 
          />
        )}
        <View 
          style={[
            styles.messageBubble, 
            isCurrentUser ? styles.userMessageBubble : styles.friendMessageBubble
          ]}
        >
          {CHAT_DETAILS.isGroup && !isCurrentUser && (
            <Text style={styles.messageSender}>{item.senderName}</Text>
          )}
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
            source={CHAT_DETAILS.avatar}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>{CHAT_DETAILS.name}</Text>
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
            source={CHAT_DETAILS.avatar}
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
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera-outline" size={24} color="#666" />
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