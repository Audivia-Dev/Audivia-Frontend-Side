import { useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import styles from "@/styles/message_inbox"


// Dữ liệu mẫu cho các cuộc trò chuyện
const CONVERSATIONS = [
  {
    id: "1",
    name: "Audy - Trợ lý du lịch",
    avatar: "https://cdn-icons-png.flaticon.com/512/5229/5229537.png",
    lastMessage:
      "Tôi có thể giúp bạn đặt tour này cho ngày mai. Vui lòng cho tôi biết thời gian bạn muốn bắt đầu tour và số người tham gia.",
    time: "10:36",
    unread: 1,
    isOnline: true,
    isBot: true,
  },
  {
    id: "3",
    name: "Minh",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    lastMessage: "Tôi đã đặt vé máy bay rồi. Chúng ta sẽ gặp nhau ở sân bay lúc 7h sáng nhé!",
    time: "Hôm qua",
    unread: 0,
    isOnline: true,
  },
  {
    id: "4",
    name: "Lan",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "Cảm ơn bạn đã chia sẻ thông tin về tour Hội An. Tôi rất thích những bức ảnh bạn đã gửi.",
    time: "Hôm qua",
    unread: 0,
    isOnline: false,
  },
  {
    id: "5",
    name: "Nhóm Phượt Đà Lạt",
    avatar: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1000&auto=format&fit=crop",
    lastMessage: "Tuấn: Dự báo thời tiết cuối tuần này ở Đà Lạt sẽ mưa nhẹ, mọi người nhớ mang áo mưa nhé!",
    time: "Thứ Tư",
    unread: 0,
    isGroup: true,
    members: ["Tuấn", "Hà", "Minh", "+5"],
  },
  {
    id: "6",
    name: "Hương",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    lastMessage: "Bạn đã xem review về khách sạn ở Nha Trang mà tôi gửi chưa?",
    time: "Thứ Ba",
    unread: 0,
    isOnline: true,
  },
  {
    id: "7",
    name: "Tuấn",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Tôi vừa tìm thấy một quán ăn ngon ở Hội An, để tôi gửi địa chỉ cho bạn.",
    time: "23/04",
    unread: 0,
    isOnline: true,
  },
  {
    id: "8",
    name: "Hà",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    lastMessage: "Chuyến đi Sapa tháng trước thật tuyệt vời! Cảm ơn bạn đã tổ chức.",
    time: "20/04",
    unread: 0,
    isOnline: false,
  },
]

export default function MessagingInboxScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const router = useRouter()

  const filteredConversations = CONVERSATIONS.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const navigateToChat = (conversationId) => {
    router.push(`/chat?id=${conversationId}`)
  }

  const renderConversation = ({ item }) => (
    <TouchableOpacity style={styles.conversationItem} onPress={() => navigateToChat(item.id)}>
      <View style={styles.conversationAvatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.conversationAvatar} />
        {item.isOnline && <View style={styles.conversationOnlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.conversationName, item.unread > 0 && styles.unreadName]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.conversationTime, item.unread > 0 && styles.unreadTime]}>{item.time}</Text>
        </View>

        <View style={styles.conversationFooter}>
          <Text
            style={[styles.conversationLastMessage, item.unread > 0 && styles.unreadMessage]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unread}</Text>
            </View>
          )}
        </View>

        {item.isGroup && (
          <View style={styles.groupMembersContainer}>
            {item.members.slice(0, 3).map((member, index) => (
              <View key={index} style={[styles.groupMemberBadge, { marginLeft: index * -8 }]}>
                <Text style={styles.groupMemberText}>{member.charAt(0)}</Text>
              </View>
            ))}
            {item.members.length > 3 && (
              <Text style={styles.groupMembersMore}>{item.members[item.members.length - 1]}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      {!showSearch ? (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tin nhắn</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="create" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => setShowSearch(true)}>
              <Ionicons name="search" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.searchHeader}>
          <TouchableOpacity style={styles.searchBackButton} onPress={() => setShowSearch(false)}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm tin nhắn..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Conversations */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Không tìm thấy cuộc trò chuyện</Text>
          </View>
        }
      />

    </SafeAreaView>
  )
}

